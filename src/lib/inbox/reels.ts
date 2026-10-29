import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI, { toFile } from "openai";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import type { InstagramDelivery } from "@/lib/instagram/webhook";
import { claimReel, pendingReels, saveReel, saveShare } from "./reel-store";
import { MATCH_INSTRUCTIONS, NOTE_INSTRUCTIONS, NOTE_SCHEMA, reelCode, reelUrl, type AmapMatch, type ReelNote } from "./reel-data";

// Reading a shared reel: Apify fetches the caption, location tag, video and audio
// links; OpenAI transcribes the audio; ffmpeg takes still frames; Claude writes the
// note from all of it, then matches its places on Amap using Amap as tools.
const run = promisify(execFile);
const MODEL = () => process.env.INBOX_REEL_MODEL || "claude-sonnet-5-5";
/** Don't start another reel with less time than this left before the deadline. */
const REEL_BUDGET_MS = 150_000;

type ReelEvent = { sender?: { id: string }; recipient?: { id: string }; timestamp?: number; message?: { mid?: string; attachments?: { type: string; payload?: { url?: string; title?: string } }[] } };

function reelShares(delivery: InstagramDelivery) {
  const out: { messageId: string; peer: string; code: string; url: string; caption: string; sharedAt: string }[] = [];
  for (const entry of delivery.payload.entry)
    for (const event of (Array.isArray(entry.messaging) ? entry.messaging : []) as ReelEvent[]) {
      const mid = event.message?.mid;
      // Only reels a traveller sent us, not ones we sent.
      const peer = event.sender?.id;
      if (!mid || !peer || peer === delivery.account_id || !/^\d+$/.test(peer)) continue;
      for (const a of event.message?.attachments ?? []) {
        const code = a.type === "ig_reel" ? reelCode(a.payload?.url) : "";
        if (code)
          out.push({
            messageId: mid,
            peer,
            code,
            url: reelUrl(code),
            caption: String(a.payload?.title ?? "").slice(0, 5000),
            sharedAt: new Date(event.timestamp || Date.now()).toISOString(),
          });
      }
    }
  return out;
}

/** Save the reels in a webhook delivery (after its messages are stored). Returns how many. */
export async function captureReels(delivery: InstagramDelivery) {
  const shares = reelShares(delivery);
  for (const s of shares) await saveShare({ message_id: s.messageId, peer_id: s.peer, code: s.code, shared_at: s.sharedAt }, { url: s.url, caption: s.caption });
  return shares.length;
}

/** Find reels in webhooks received before reels were saved. Safe to run again. */
export async function backfillReels() {
  const shares: ReturnType<typeof reelShares> = [];
  for (let from = 0; ; from += 500) {
    const { data, error } = await db().from("instagram_webhook_deliveries").select("delivery_hash,account_id,payload").order("received_at").range(from, from + 499);
    if (error) throw error;
    for (const d of (data ?? []) as InstagramDelivery[]) shares.push(...reelShares(d));
    if ((data ?? []).length < 500) break;
  }
  // A share needs its message in the inbox; others wait for the next history load.
  const known = new Set<string>();
  const ids = [...new Set(shares.map((s) => s.messageId))];
  for (let i = 0; i < ids.length; i += 200) {
    const { data } = await db().from("inbox_messages").select("id").in("id", ids.slice(i, i + 200));
    for (const m of data ?? []) known.add(m.id as string);
  }
  let saved = 0;
  for (const s of shares.filter((s) => known.has(s.messageId))) {
    await saveShare({ message_id: s.messageId, peer_id: s.peer, code: s.code, shared_at: s.sharedAt }, { url: s.url, caption: s.caption });
    saved++;
  }
  return { found: shares.length, saved };
}

type ApifyReel = {
  shortCode?: string;
  type?: string;
  caption?: string;
  ownerUsername?: string;
  locationName?: string;
  videoDuration?: number;
  videoUrl?: string;
  audioUrl?: string;
  displayUrl?: string;
  images?: string[];
  error?: string;
};

async function fetchReel(code: string): Promise<ApifyReel> {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw Error("APIFY_TOKEN is not set on the server.");
  const response = await fetch("https://api.apify.com/v2/acts/apify~instagram-reel-scraper/run-sync-get-dataset-items?timeout=120&clean=true", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ username: [reelUrl(code)], resultsLimit: 1 }),
    signal: AbortSignal.timeout(150_000),
  });
  if (!response.ok) throw Error(`Apify could not fetch the reel (${response.status}).`);
  const items = (await response.json()) as ApifyReel[];
  const item = items.find((i) => i.shortCode === code && !i.error) ?? items.find((i) => !i.error);
  if (!item) throw Error(items[0]?.error ? `Apify: ${items[0].error}` : "Apify returned nothing for this reel. It may be private or deleted.");
  return item;
}

async function download(url: string, max: number) {
  const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw Error(`Download failed (${response.status}).`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > max) throw Error("File too large.");
  return bytes;
}

async function transcribe(audioUrl: string | undefined) {
  if (!audioUrl || !process.env.OPENAI_API_KEY) return "";
  const audio = await download(audioUrl, 24_000_000);
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 1, timeout: 60_000 });
  const result = await client.audio.transcriptions.create({ file: await toFile(audio, "audio.m4a"), model: "gpt-4o-mini-transcribe" });
  return result.text.trim().slice(0, 20_000);
}

/** The ffmpeg bundled for Vercel (optional dependency), else the one installed on this machine. */
function ffmpegPath() {
  const bundled = join(process.cwd(), "node_modules/@ffmpeg-installer/linux-x64/ffmpeg");
  return existsSync(bundled) ? bundled : "ffmpeg";
}

/** 4 to 10 frames spread over the video, 540 px wide. */
async function frames(videoUrl: string, duration: number) {
  const folder = await mkdtemp(join(tmpdir(), "reel-"));
  try {
    await writeFile(join(folder, "video.mp4"), await download(videoUrl, 80_000_000));
    const count = Math.min(10, Math.max(4, Math.ceil(duration / 4)));
    await run(
      ffmpegPath(),
      ["-loglevel", "error", "-i", join(folder, "video.mp4"), "-vf", `fps=${count / Math.max(duration, 1)},scale=540:-2`, "-frames:v", String(count), "-q:v", "4", join(folder, "f%02d.jpg")],
      { timeout: 60_000 },
    );
    const names = (await readdir(folder)).filter((n) => n.endsWith(".jpg")).sort();
    return Promise.all(names.map(async (n) => (await readFile(join(folder, n))).toString("base64")));
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
}

async function imageBase64(url: string) {
  return (await download(url, 5_000_000)).toString("base64");
}

async function writeNote(claude: Anthropic, input: { caption: string; location: string; owner: string; transcript: string; frames: string[] }) {
  const content: Anthropic.ContentBlockParam[] = [
    {
      type: "text",
      text: [
        `Caption:\n${input.caption || "(none)"}`,
        `Location tag: ${input.location || "(none)"}`,
        `Posted by: @${input.owner || "unknown"}`,
        `Audio transcript:\n${input.transcript || "(no speech)"}`,
        input.frames.length ? "" : "No frames: the video could not be read.",
      ]
        .filter(Boolean)
        .join("\n\n"),
    },
  ];
  input.frames.forEach((data, i) => {
    content.push({ type: "text", text: `Frame ${i + 1}` });
    content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data } });
  });
  const result = await claude.messages
    .stream({
      model: MODEL(),
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium", format: { type: "json_schema", schema: NOTE_SCHEMA } },
      system: NOTE_INSTRUCTIONS,
      messages: [{ role: "user", content }],
    })
    .finalMessage();
  if (result.stop_reason === "refusal") throw Error("The AI declined to describe this reel.");
  if (result.stop_reason === "max_tokens") throw Error("The AI did not finish the note.");
  const text = result.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
  return { note: JSON.parse(text) as ReelNote, usage: result.usage };
}

// ── Amap, as tools the AI uses to find each place ──────────────────────────────

class AmapKeyError extends Error {}

async function amap(path: string, params: Record<string, string>) {
  const key = process.env.AMAP_API_KEY;
  if (!key) throw new AmapKeyError("AMAP_API_KEY is not set on the server.");
  const u = new URL(`https://restapi.amap.com${path}`);
  u.search = new URLSearchParams({ key, ...params }).toString();
  const j = await (await fetch(u, { signal: AbortSignal.timeout(15_000) })).json();
  if (j.status === "1") return j;
  if (/KEY|SIGNATURE|QUOTA|LIMIT/i.test(String(j.info))) throw new AmapKeyError(`Amap refused the request: ${j.info}`);
  return { error: String(j.info) };
}
type Poi = { id?: string; name?: string; type?: string; cityname?: string; district?: string; adname?: string; address?: unknown; location?: unknown; distance?: string; business?: { opentime_week?: string; rating?: string } };
const poi = (p: Poi) => ({
  id: p.id,
  name: p.name,
  type: String(p.type ?? "").split(";").slice(0, 3).join(" · "),
  district: `${p.cityname ?? p.district ?? ""}${p.adname ?? ""}`,
  address: typeof p.address === "string" ? p.address : "",
  location: typeof p.location === "string" ? p.location : "",
});

const TOOLS: Anthropic.Tool[] = [
  {
    name: "search_places",
    description: "Search Amap for places by keywords inside a city (Chinese works best). Returns up to 8 places with id, name, type, district, address and location (lng,lat). Amap tolerates small typos.",
    input_schema: { type: "object", properties: { keywords: { type: "string" }, city: { type: "string", description: "City in Chinese, e.g. 重庆" } }, required: ["keywords", "city"] },
  },
  {
    name: "suggestions",
    description: "Amap's autocomplete suggestions for partial, misspelled or informal names in a city. Good when search_places finds nothing useful.",
    input_schema: { type: "object", properties: { keywords: { type: "string" }, city: { type: "string" } }, required: ["keywords", "city"] },
  },
  {
    name: "search_nearby",
    description: "Search around a point, e.g. the street or shop the reel walks to from a landmark. location is 'lng,lat' from an earlier result.",
    input_schema: {
      type: "object",
      properties: { location: { type: "string" }, keywords: { type: "string" }, radius_m: { type: "integer", description: "Up to 5000" } },
      required: ["location", "keywords"],
    },
  },
  {
    name: "place_details",
    description: "Details for one Amap place id: type, address, opening hours, rating.",
    input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
  },
  {
    name: "report_match",
    description: "Record your decision for one place from the reel. Call once per place.",
    input_schema: {
      type: "object",
      properties: {
        place: { type: "integer", description: "The place number from the list" },
        status: {
          type: "string",
          enum: ["confirmed", "close", "several", "not_found", "not_a_place"],
          description:
            "confirmed = this is the place; close = linked to a bigger or related place (e.g. an escalator inside a scenic area) or the reel's name is unofficial; several = several branches or sites and the reel doesn't show which; not_found = not on Amap; not_a_place = not one spot on a map",
        },
        amap_id: { type: "string" },
        relation: { type: "string", description: "For close: how the Amap place relates, e.g. 'the escalator is inside this scenic area'" },
        reason: { type: "string", description: "One short sentence on why" },
      },
      required: ["place", "status", "reason"],
    },
  },
];

async function runTool(name: string, input: Record<string, unknown>) {
  const s = (v: unknown) => String(v ?? "").slice(0, 100);
  if (name === "search_places") {
    const j = await amap("/v5/place/text", { keywords: s(input.keywords), region: s(input.city), city_limit: "true", page_size: "8" });
    return j.error ? j : ((j.pois ?? []) as Poi[]).map(poi);
  }
  if (name === "suggestions") {
    const j = await amap("/v3/assistant/inputtips", { keywords: s(input.keywords), city: s(input.city), citylimit: "true" });
    return j.error ? j : ((j.tips ?? []) as Poi[]).filter((t) => typeof t.id === "string" && t.id).slice(0, 8).map((t) => poi({ ...t, cityname: t.district, adname: "" }));
  }
  if (name === "search_nearby") {
    const radius = String(Math.min(5000, Math.max(50, Number(input.radius_m) || 1000)));
    const j = await amap("/v5/place/around", { location: s(input.location), keywords: s(input.keywords), radius, page_size: "8" });
    return j.error ? j : ((j.pois ?? []) as Poi[]).map((p) => ({ ...poi(p), distance_m: p.distance }));
  }
  if (name === "place_details") {
    const j = await amap("/v5/place/detail", { id: s(input.id), show_fields: "business" });
    const p = (j.pois ?? [])[0] as Poi | undefined;
    return j.error ? j : p ? { ...poi(p), hours: p.business?.opentime_week ?? "", rating: p.business?.rating ?? "" } : { error: "not found" };
  }
  return { error: "unknown tool" };
}

/** Sonnet finds each place on Amap, searching as many times as it needs, and decides. */
async function matchPlaces(claude: Anthropic, note: ReelNote) {
  const usage = { input_tokens: 0, output_tokens: 0, searches: 0 };
  const targets = note.places.map((p, i) => ({ p, n: i + 1 })).filter(({ p }) => p.mappable && p.confidence !== "guess");
  // Guesses aren't looked up: the card marks them as guesses instead.
  for (const p of note.places) if (!p.mappable) p.amap = { status: "not_a_place", reason: "Not one spot on a map." };
  if (!targets.length) return usage;
  const list = targets.map(({ p, n }) => `${n}. ${p.name} | ${p.name_cn || "(no Chinese name)"} | ${p.city} ${p.city_cn} | ${p.category} | ${p.what}`).join("\n");
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: `Reel: ${note.summary}\n\nPlaces:\n${list}` }];
  const reports = new Map<number, { status: AmapMatch["status"]; amap_id?: string; relation?: string; reason: string }>();
  try {
    for (let turn = 0; turn < 20 && reports.size < targets.length; turn++) {
      const res = await claude.messages.create({
        model: MODEL(),
        max_tokens: 8000,
        thinking: { type: "adaptive" },
        output_config: { effort: "low" },
        system: MATCH_INSTRUCTIONS,
        tools: TOOLS,
        messages,
      });
      usage.input_tokens += res.usage.input_tokens;
      usage.output_tokens += res.usage.output_tokens;
      messages.push({ role: "assistant", content: res.content });
      const uses = res.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
      if (!uses.length) break;
      const results: Anthropic.ToolResultBlockParam[] = [];
      for (const u of uses) {
        const input = u.input as Record<string, unknown>;
        if (u.name === "report_match") {
          reports.set(Number(input.place), input as never);
          results.push({ type: "tool_result", tool_use_id: u.id, content: "Recorded." });
        } else {
          usage.searches++;
          results.push({ type: "tool_result", tool_use_id: u.id, content: JSON.stringify(await runTool(u.name, input)) });
        }
      }
      messages.push({ role: "user", content: results });
    }
  } catch (e) {
    if (!(e instanceof AmapKeyError)) throw e;
    for (const { p } of targets) p.amap = { status: "error", reason: e.message };
    return usage;
  }
  for (const { p, n } of targets) {
    const r = reports.get(n);
    if (!r) {
      p.amap = { status: "not_found", reason: "The AI didn't decide on this place." };
      continue;
    }
    const match: AmapMatch = { status: r.status, reason: String(r.reason ?? "").slice(0, 300), ...(r.relation ? { relation: String(r.relation).slice(0, 200) } : {}) };
    if (r.amap_id && (r.status === "confirmed" || r.status === "close")) {
      const d = (await runTool("place_details", { id: r.amap_id }).catch(() => ({ error: "details" }))) as Record<string, string>;
      if (!d.error) Object.assign(match, { id: r.amap_id, name: d.name, address: `${d.district}${d.address}`, location: d.location, hours: d.hours });
    }
    p.amap = match;
  }
  return usage;
}

/** Read one reel end to end. Returns false when someone else is already on it. */
export async function processReel(code: string) {
  const reel = await claimReel(code);
  if (!reel) return false;
  const started = Date.now();
  try {
    if (!process.env.ANTHROPIC_API_KEY) throw Error("ANTHROPIC_API_KEY is not set on the server.");
    const item = await fetchReel(code);
    const caption = item.caption ?? reel.caption;
    const duration = Number(item.videoDuration) || 0;
    const [transcript, pictures] = await Promise.all([
      transcribe(item.audioUrl).catch(() => ""),
      item.videoUrl
        ? frames(item.videoUrl, duration || 15).catch(() => [] as string[])
        : // A photo post: its pictures are the frames.
          Promise.all([...(item.images?.length ? item.images : item.displayUrl ? [item.displayUrl] : [])].slice(0, 6).map((u) => imageBase64(u).catch(() => ""))).then((a) => a.filter(Boolean)),
    ]);
    const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 120_000 });
    const written = await writeNote(claude, { caption, location: item.locationName ?? "", owner: item.ownerUsername ?? "", transcript, frames: pictures });
    const matched = await matchPlaces(claude, written.note);
    await saveReel(code, {
      caption,
      owner: item.ownerUsername ?? "",
      location: item.locationName ?? "",
      duration: duration || null,
      transcript,
      note: written.note,
      status: "done",
      error: "",
      usage: {
        note: { input: written.usage.input_tokens, output: written.usage.output_tokens },
        match: matched,
        frames: pictures.length,
        seconds: Math.round((Date.now() - started) / 1000),
      },
    });
  } catch (e) {
    console.error("[inbox-reels]", code, (e as Error).message);
    await saveReel(code, { status: "failed", error: (e as Error).message.slice(0, 300) });
  }
  return true;
}

/** Read waiting reels (a conversation's, or any) until the time budget runs out. */
export async function processPending(options: { peer?: string; deadline: number }) {
  let done = 0;
  for (const code of await pendingReels(options.peer, 10)) {
    if (options.deadline - Date.now() < REEL_BUDGET_MS) break;
    if (await processReel(code)) done++;
  }
  return done;
}
