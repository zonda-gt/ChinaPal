import "server-only";
import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import { InboxError } from "./types";
import { STALE_MS, MAX_ATTEMPTS, needsWork, type ReelNote, type ReelStatus, type ReelView } from "./reel-data";

// Shared reels (inbox_reels) and which message shared them (inbox_reel_shares).
// Local development keeps both on disk, so previews never write to the shared
// database. Production uses the tables from the inbox reels migration.
const local = process.env.NODE_ENV === "development";
const directory = join(process.cwd(), "data/cache/inbox-reels");
export const REELS_MIGRATION = "Reading reels needs the inbox reels database migration.";

export type ReelRow = {
  code: string;
  url: string;
  caption: string;
  owner: string;
  location: string;
  duration: number | null;
  transcript: string;
  note: ReelNote | null;
  status: ReelStatus;
  attempts: number;
  error: string;
  usage: Record<string, unknown> | null;
  updated_at: string;
};
export type Share = { message_id: string; peer_id: string; code: string; shared_at: string };
export type ReelWork = ReelView & { attempts: number; updated_at: string };

const COLUMNS = "code,url,caption,owner,location,status,note,error,attempts,updated_at";

async function readJson<T>(path: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw e;
  }
}
async function writeJson(path: string, value: unknown) {
  await mkdir(join(path, ".."), { recursive: true, mode: 0o700 });
  const temp = `${path}.${randomUUID()}.tmp`;
  await writeFile(temp, JSON.stringify(value), { mode: 0o600 });
  await rename(temp, path);
}
const reelFile = (code: string) => {
  if (!/^[A-Za-z0-9_-]{5,40}$/.test(code)) throw new InboxError("Invalid reel");
  return join(directory, "reels", `${code}.json`);
};
const sharesFile = (peer: string) => {
  if (!/^\d+$/.test(peer)) throw new InboxError("Invalid conversation");
  return join(directory, "shares", `${peer}.json`);
};

function missingTable(error: { code?: string; message?: string } | null) {
  return !!error && (error.code === "42P01" || error.code === "PGRST205" || /does not exist|schema cache/i.test(error.message ?? ""));
}
function checked(error: { code?: string; message?: string } | null) {
  if (!error) return;
  if (missingTable(error)) throw new InboxError(REELS_MIGRATION, 503);
  throw new InboxError("Could not save the reel. Please try again.", 503);
}

/** Record that a message shared a reel, adding the reel as pending if we haven't seen it. */
export async function saveShare(share: Share, reel: { url: string; caption: string }) {
  if (local) {
    const path = reelFile(share.code);
    const existing = await readJson<ReelRow | null>(path, null);
    if (!existing)
      await writeJson(path, {
        code: share.code,
        ...reel,
        owner: "",
        location: "",
        duration: null,
        transcript: "",
        note: null,
        status: "pending",
        attempts: 0,
        error: "",
        usage: null,
        updated_at: new Date().toISOString(),
      } satisfies ReelRow);
    const shares = await readJson<Share[]>(sharesFile(share.peer_id), []);
    if (!shares.some((s) => s.message_id === share.message_id)) await writeJson(sharesFile(share.peer_id), [...shares, share]);
    return;
  }
  const { error } = await db().from("inbox_reels").upsert({ code: share.code, ...reel }, { onConflict: "code", ignoreDuplicates: true });
  checked(error);
  const { error: shareError } = await db().from("inbox_reel_shares").upsert(share, { onConflict: "message_id", ignoreDuplicates: true });
  checked(shareError);
}

/** The reels shared in a conversation, by the id of the message that shared them. */
export async function reelsForPeer(peer: string): Promise<Record<string, ReelWork>> {
  let shares: Share[];
  let reels: (Omit<ReelRow, "transcript" | "duration" | "usage">)[];
  if (local) {
    shares = await readJson<Share[]>(sharesFile(peer), []);
    reels = (await Promise.all([...new Set(shares.map((s) => s.code))].map((c) => readJson<ReelRow | null>(reelFile(c), null)))).filter(
      (r): r is ReelRow => !!r,
    );
  } else {
    const { data, error } = await db().from("inbox_reel_shares").select(`message_id,peer_id,code,shared_at,reel:inbox_reels(${COLUMNS})`).eq("peer_id", peer).limit(500);
    if (missingTable(error)) return {};
    checked(error);
    const rows = (data ?? []) as unknown as (Share & { reel: ReelRow | null })[];
    shares = rows;
    reels = rows.flatMap((r) => (r.reel ? [r.reel] : []));
  }
  const byCode = new Map(reels.map((r) => [r.code, r]));
  const out: Record<string, ReelWork> = {};
  for (const s of shares) {
    const r = byCode.get(s.code);
    if (r)
      out[s.message_id] = {
        code: r.code,
        url: r.url,
        caption: r.caption,
        owner: r.owner,
        status: r.status,
        note: r.note,
        error: r.error,
        attempts: r.attempts,
        updated_at: r.updated_at,
      };
  }
  return out;
}

export async function readReel(code: string): Promise<ReelRow | null> {
  if (local) return readJson<ReelRow | null>(reelFile(code), null);
  const { data, error } = await db().from("inbox_reels").select("*").eq("code", code).maybeSingle();
  checked(error);
  return data as ReelRow | null;
}

/** Take a reel to read, so two servers never read the same one. Returns it, or null when it isn't ours to take. */
export async function claimReel(code: string): Promise<ReelRow | null> {
  const reel = await readReel(code);
  if (!reel || !needsWork(reel)) return null;
  const patch = { status: "working" as const, attempts: reel.attempts + 1, error: "", updated_at: new Date().toISOString() };
  if (local) {
    await writeJson(reelFile(code), { ...reel, ...patch });
    return { ...reel, ...patch };
  }
  // Only succeeds if nobody else changed the row since we read it.
  const { data, error } = await db()
    .from("inbox_reels")
    .update(patch)
    .eq("code", code)
    .eq("attempts", reel.attempts)
    .eq("updated_at", reel.updated_at)
    .select("*")
    .maybeSingle();
  checked(error);
  return data as ReelRow | null;
}

export async function saveReel(code: string, patch: Partial<ReelRow>) {
  const row = { ...patch, updated_at: new Date().toISOString() };
  if (local) {
    const reel = await readJson<ReelRow | null>(reelFile(code), null);
    if (reel) await writeJson(reelFile(code), { ...reel, ...row });
    return;
  }
  const { error } = await db().from("inbox_reels").update(row).eq("code", code);
  checked(error);
}

/** Reels waiting to be read, oldest first (a conversation's own, or any). */
export async function pendingReels(peer?: string, limit = 10): Promise<string[]> {
  if (peer) {
    const reels = Object.values(await reelsForPeer(peer));
    return [...new Set(reels.filter((r) => needsWork(r)).map((r) => r.code))].slice(0, limit);
  }
  if (local) {
    const names = await readdir(join(directory, "reels")).catch(() => [] as string[]);
    const rows = await Promise.all(names.filter((n) => n.endsWith(".json")).map((n) => readJson<ReelRow | null>(join(directory, "reels", n), null)));
    return rows.filter((r): r is ReelRow => !!r && needsWork(r)).map((r) => r.code).slice(0, limit);
  }
  const stale = new Date(Date.now() - STALE_MS).toISOString();
  const { data, error } = await db()
    .from("inbox_reels")
    .select("code")
    .or(`status.eq.pending,and(status.eq.failed,attempts.lt.${MAX_ATTEMPTS}),and(status.eq.working,updated_at.lt.${stale},attempts.lt.${MAX_ATTEMPTS})`)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (missingTable(error)) return [];
  checked(error);
  return (data ?? []).map((r) => r.code as string);
}
