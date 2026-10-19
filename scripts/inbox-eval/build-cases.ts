// Freeze evaluation cases from saved inbox conversations (read-only).
// Usage: npx tsx scripts/inbox-eval/build-cases.ts [data/eval/spec.json] [output.json]
// The spec and everything written under data/eval/ contain customer messages
// and are git-ignored. Each spec entry names a conversation and the customer
// message where the conversation is cut; the staff messages that followed
// become the reference reply.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { PromptMessage } from "../../src/lib/inbox/prompt";

// CommonJS project: top-level await is wrapped in main().
async function main() {
  config({ path: process.env.ENV_FILE || ".env.local" });
  const DIR = "data/eval";
  type Spec = {
    id: string;
    username?: string;
    docMessages?: string; // pre-converted transcript for chats outside Instagram
    anchor: string;
    cat: string;
    tests: string;
    staff_facts?: string;
    stage?: string;
    name?: string;
  };
  const scrub = (t: string) =>
    t
      .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[email]")
      .replace(/\+?\d[\d\s-]{8,}\d/g, "[number]")
      .replace(/\b[A-Z]\d{7}[A-Z]\b/g, "[passport]");

  const db = createClient(process.env.CONCIERGE_SUPABASE_URL!, process.env.CONCIERGE_SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false },
  });
  async function conversationMessages(username: string) {
    const { data: conv, error } = await db
      .from("inbox_conversations")
      .select("peer_id,username,stage,history_complete")
      .eq("username", username)
      .single();
    if (error || !conv) throw new Error(`No conversation for ${username}`);
    const { data, error: e2 } = await db
      .from("inbox_messages")
      .select("*")
      .eq("peer_id", conv.peer_id)
      .order("sent_at", { ascending: true })
      .order("id", { ascending: true })
      .limit(2000);
    if (e2) throw e2;
    return { conv, messages: data as PromptMessage[] };
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

  const spec: Spec[] = JSON.parse(await readFile(process.argv[2] || join(DIR, "spec.json"), "utf8"));
  const cases = [];
  for (const s of spec) {
    let messages: PromptMessage[], username: string, stage: string, historyComplete: boolean;
    if (s.docMessages) {
      messages = JSON.parse(await readFile(s.docMessages, "utf8"));
      username = s.name || s.id;
      stage = s.stage || "customer";
      historyComplete = true;
    } else {
      const found = await conversationMessages(s.username!);
      messages = found.messages;
      username = found.conv.username;
      stage = s.stage || "inquiry";
      historyComplete = found.conv.history_complete;
    }
    const norm = (t: string) => t.replace(/\s+/g, " ").toLowerCase();
    let cut = messages.findIndex((m) => m.direction === "inbound" && norm(m.text).includes(norm(s.anchor)));
    if (cut < 0) {
      console.warn(`Anchor not found for ${s.id}`);
      continue;
    }
    while (messages[cut + 1]?.direction === "inbound") cut++;
    const reference: PromptMessage[] = [];
    for (let i = cut + 1; i < messages.length && messages[i].direction === "outbound"; i++)
      reference.push(messages[i]);
    const history = messages.slice(0, cut + 1).map((m) => ({ ...m, text: scrub(m.text) }));
    await saveImages(s.id, history);
    // The draft is written as if just before the real reply (or shortly after the
    // customer's message when nobody has replied yet).
    const now =
      reference[0]?.sent_at ??
      new Date(Date.parse(history.at(-1)!.sent_at) + 30 * 60000).toISOString();
    cases.push({
      id: s.id,
      conversation: username,
      cat: s.cat,
      tests: s.tests,
      staff_facts: s.staff_facts ?? "",
      context: {
        now,
        customerName: s.name ?? null,
        username,
        stage,
        notes: "",
        historyComplete,
        messages: history,
        profile: null,
      },
      reference: reference.map((m) => scrub(m.text)).filter(Boolean),
    });
    console.log(`${s.id} ${username}: ${history.length} messages, ${reference.length} reference`);
  }
  const out = process.argv[3] || join(DIR, "cases.json");
  await writeFile(out, JSON.stringify(cases, null, 1));
  console.log(`Wrote ${cases.length} cases to ${out}`);
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
