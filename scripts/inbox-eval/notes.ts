// Write image notes for every image in frozen evaluation cases.
// Usage: npx tsx scripts/inbox-eval/notes.ts data/eval/cases-images.json [data/eval/image-notes.json]
// Notes are keyed by message id and attachment index, so a chat's images are
// described once even when several cases share them. Existing notes are kept.
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { config } from "dotenv";
import OpenAI from "openai";
import { describeImage, IMAGE_NOTE_VERSION } from "../../src/lib/inbox/image-notes";
import type { PromptContext } from "../../src/lib/inbox/prompt";

// CommonJS project: top-level await is wrapped in main().
async function main() {
  config({ path: process.env.ENV_FILE || ".env.local" });
  const DIR = "data/eval";
  const [casesFile, outFile = join(DIR, "image-notes.json")] = process.argv.slice(2);
  const cases: { id: string; context: PromptContext }[] = JSON.parse(await readFile(casesFile, "utf8"));
  let notes: Record<string, { note: string; model: string; version: string }> = {};
  try {
    notes = JSON.parse(await readFile(outFile, "utf8"));
  } catch {}
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 2, timeout: 120000 });
  const jobs = new Map<string, () => Promise<void>>();
  for (const c of cases) {
    const msgs = c.context.messages;
    msgs.forEach((m, k) =>
      m.attachments.forEach((a, i) => {
        const key = `${m.id}:${i}`;
        if (a.type !== "image" || !a.url || a.url.startsWith("http") || notes[key] || jobs.has(key)) return;
        // Text sent with the image, or the same sender's message just before it.
        const caption = m.text || (msgs[k - 1]?.direction === m.direction ? msgs[k - 1].text : "");
        jobs.set(key, async () => {
          const bytes = await readFile(join(DIR, a.url!));
          const type = (await readFile(join(DIR, `${a.url}.type`), "utf8")).trim();
          const result = await describeImage(client, {
            bytes,
            type,
            sender: m.direction === "inbound" ? "customer" : "team",
            caption,
          });
          notes[key] = { note: result.note, model: result.model, version: IMAGE_NOTE_VERSION };
        });
      }),
    );
  }
  const queue = [...jobs.entries()];
  console.log(`${queue.length} images to describe`);
  let done = 0;
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      for (let job = queue.shift(); job; job = queue.shift()) {
        try {
          await job[1]();
        } catch (e) {
          console.warn(`  ${job[0]} failed: ${(e as Error).message}`);
        }
        if (++done % 5 === 0) console.log(`${done} done`);
      }
    }),
  );
  await writeFile(outFile, JSON.stringify(notes, null, 1));
  console.log(`Saved ${Object.keys(notes).length} notes to ${outFile}`);
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
