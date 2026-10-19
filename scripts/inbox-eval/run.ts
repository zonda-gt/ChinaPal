// Run reply-assistant versions over the frozen evaluation cases.
// Usage: npx tsx scripts/inbox-eval/run.ts [--runs 2] [--only C01,C02] [--variants baseline,v2,v2-facts]
// Reads data/eval/cases.json and writes data/eval/results/<timestamp>.json.
// Nothing is saved to the inbox database and nothing is sent to customers.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { config } from "dotenv";
import OpenAI from "openai";
import { runDraft, type LoadImage } from "../../src/lib/inbox/draft-core";
import type { PromptContext } from "../../src/lib/inbox/prompt";
import { runBaseline } from "./baseline";

// CommonJS project: top-level await is wrapped in main().
async function main() {
  config({ path: process.env.ENV_FILE || ".env.local" });
  const DIR = "data/eval";
  const arg = (name: string, fallback: string) => {
    const i = process.argv.indexOf(`--${name}`);
    return i > 0 ? process.argv[i + 1] : fallback;
  };
  const runs = Number(arg("runs", "2"));
  const only = arg("only", "").split(",").filter(Boolean);
  const variants = arg("variants", "baseline,v2,v2-facts").split(",");

  type Case = { id: string; staff_facts: string; context: PromptContext };
  const cases: Case[] = JSON.parse(await readFile(join(DIR, "cases.json"), "utf8"));
  const loadImage: LoadImage = async (url) => ({
    bytes: await readFile(join(DIR, url)),
    type: (await readFile(join(DIR, `${url}.type`), "utf8")).trim(),
  });
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 2, timeout: 180000 });

  const jobs = cases
    .filter((c) => !only.length || only.includes(c.id))
    .flatMap((c) =>
      variants
        .filter((v) => v !== "v2-facts" || c.staff_facts.trim())
        .flatMap((variant) => Array.from({ length: runs }, (_, run) => ({ c, variant, run: run + 1 }))),
    );
  console.log(`${jobs.length} generations (${runs} runs each)`);

  const results: unknown[] = [];
  let done = 0;
  async function worker() {
    for (let job = jobs.shift(); job; job = jobs.shift()) {
      const { c, variant, run } = job;
      try {
        const output =
          variant === "baseline"
            ? await runBaseline(client, c.context, loadImage)
            : await runDraft(
                client,
                { ...c.context, staffFacts: variant === "v2-facts" ? c.staff_facts : undefined },
                loadImage,
              );
        results.push({ case: c.id, variant, run, ...output });
      } catch (e) {
        results.push({ case: c.id, variant, run, error: (e as Error).message });
        console.warn(`  ${c.id} ${variant} #${run} failed: ${(e as Error).message}`);
      }
      console.log(`${++done} done (${c.id} ${variant} #${run})`);
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  await mkdir(join(DIR, "results"), { recursive: true });
  const file = join(DIR, "results", `${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  await writeFile(file, JSON.stringify(results, null, 1));
  console.log(`Saved ${file}`);
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
