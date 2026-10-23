// Freeze evaluation cases from real drafts: each AI generation that the team
// answered (in the inbox or in Instagram) becomes a case, cut at the moment the
// draft was generated, with what the team actually sent as the reference.
// Usage: npx tsx scripts/inbox-eval/build-real-cases.ts [--out data/eval/real-cases.json]
//   [--since 2026-10-19] [--skip jobo5808]
// Read-only. Writes under data/eval/ (git-ignored: contains customer messages).
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { PromptContext, PromptMessage } from "../../src/lib/inbox/prompt";

// CommonJS project: top-level await is wrapped in main().
async function main() {
  config({ path: process.env.ENV_FILE || ".env.local" });
  const DIR = "data/eval";
  const arg = (name: string, fallback: string) => {
    const i = process.argv.indexOf(`--${name}`);
    return i > 0 ? process.argv[i + 1] : fallback;
  };
  // Test conversations, not customers.
  const skip = arg("skip", "jobo5808").split(",").filter(Boolean);
  const scrub = (t: string) =>
    t
      .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[email]")
      .replace(/\+?\d[\d\s-]{8,}\d/g, "[number]")
      .replace(/\b[A-Z]\d{7}[A-Z]\b/g, "[passport]");
  const db = createClient(process.env.CONCIERGE_SUPABASE_URL!, process.env.CONCIERGE_SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false },
  });

  type Generation = {
    id: string;
    peer_id: string;
    created_at: string;
    instruction: string;
    staff_facts: string;
    messages: string[];
    warnings: string[];
    prompt_version: string;
  };
  const { data: generations, error } = await db
    .from("inbox_ai_generations")
    .select("id,peer_id,created_at,instruction,staff_facts,messages,warnings,prompt_version")
    .gte("created_at", arg("since", "2000-01-01"))
    .order("created_at", { ascending: true })
    .limit(5000);
  if (error) throw error;

  const threads = new Map<string, { username: string; stage: string; complete: boolean; messages: PromptMessage[] }>();
  async function thread(peer: string) {
    if (!threads.has(peer)) {
      const { data: conv, error: e1 } = await db
        .from("inbox_conversations")
        .select("username,stage,history_complete")
        .eq("peer_id", peer)
        .single();
      if (e1) throw e1;
      const { data, error: e2 } = await db
        .from("inbox_messages")
        .select("id,direction,sent_at,text,attachments,deleted,unavailable")
        .eq("peer_id", peer)
        .order("sent_at", { ascending: true })
        .order("id", { ascending: true })
        .limit(2000);
      if (e2) throw e2;
      threads.set(peer, { username: conv.username, stage: conv.stage, complete: conv.history_complete, messages: data });
    }
    return threads.get(peer)!;
  }

  async function saveImages(caseId: string, messages: PromptMessage[]) {
    await mkdir(join(DIR, "media"), { recursive: true });
    for (const m of messages.slice(-20)) {
      for (const [i, a] of m.attachments.entries()) {
        if (a.type !== "image" || !a.url?.startsWith("https://")) continue;
        const file = `media/${caseId}_${m.id.slice(-12)}_${i}`;
        try {
          const res = await fetch(a.url);
          if (!res.ok) throw new Error(String(res.status));
          const type = res.headers.get("content-type")?.split(";")[0] || "image/jpeg";
          await writeFile(join(DIR, file), Buffer.from(await res.arrayBuffer()));
          await writeFile(join(DIR, `${file}.type`), type);
          a.url = file;
        } catch (e) {
          console.warn(`  image not saved for ${caseId}: ${(e as Error).message}`);
          a.url = undefined;
        }
      }
    }
  }

  const cases: unknown[] = [];
  for (const [index, g] of (generations as Generation[]).entries()) {
    const t = await thread(g.peer_id);
    if (skip.includes(t.username)) continue;
    const history = t.messages.filter((m) => m.sent_at <= g.created_at);
    const after = t.messages.filter((m) => m.sent_at > g.created_at);
    const replyEnd = after.findIndex((m) => m.direction === "inbound");
    const reply = (replyEnd < 0 ? after : after.slice(0, replyEnd)).filter(
      (m) => m.direction === "outbound" && !m.deleted,
    );
    if (!reply.length) continue;
    // Only the last draft before the reply: earlier ones were regenerated.
    const later = (generations as Generation[]).slice(index + 1);
    if (later.some((x) => x.peer_id === g.peer_id && x.created_at < reply[0].sent_at)) continue;
    // The draft box still held the previous draft when the team asked for a revision.
    const previous = (generations as Generation[])
      .slice(0, index)
      .reverse()
      .find((x) => x.peer_id === g.peer_id);
    const openDraft =
      previous &&
      !t.messages.some((m) => m.direction === "outbound" && m.sent_at > previous.created_at && m.sent_at <= g.created_at)
        ? previous.messages.join("\n\n")
        : "";
    const { data: profile } = await db
      .from("inbox_profiles")
      .select("profile,generated_at")
      .eq("peer_id", g.peer_id)
      .maybeSingle();

    const id = `R${String(cases.length + 1).padStart(2, "0")}`;
    const messages = history.map((m) => ({ ...m, text: scrub(m.text), attachments: m.attachments.map((a) => ({ ...a })) }));
    await saveImages(id, messages);
    const context: PromptContext = {
      now: g.created_at,
      // The Instagram display name is not stored; the history carries the names in use.
      customerName: null,
      username: t.username,
      stage: t.stage,
      notes: "",
      historyComplete: t.complete,
      messages,
      // A summary generated after this draft could leak what came next.
      profile: profile && profile.generated_at <= g.created_at ? profile : null,
      staffFacts: scrub(g.staff_facts),
      instruction: g.instruction,
      currentDraft: g.instruction.trim() ? openDraft : "",
    };
    cases.push({
      id,
      conversation: t.username,
      cat: t.stage,
      tests: `Real draft ${g.created_at.slice(0, 16).replace("T", " ")} UTC for @${t.username}`,
      staff_facts: context.staffFacts,
      context,
      reference: reply.map((m) => scrub(m.text)).filter(Boolean),
      reference_sent_at: reply.map((m) => m.sent_at),
      // What the inbox actually drafted at the time, for comparison with the replay.
      live: { generation_id: g.id, prompt_version: g.prompt_version, messages: g.messages, warnings: g.warnings },
    });
    console.log(`${id} @${t.username}: ${history.length} messages, ${reply.length} sent after`);
  }
  const out = arg("out", join(DIR, "real-cases.json"));
  await mkdir(DIR, { recursive: true });
  await writeFile(out, JSON.stringify(cases, null, 1));
  console.log(`Wrote ${cases.length} cases to ${out}`);
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
