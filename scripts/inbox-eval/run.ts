// Run reply-assistant versions over the frozen evaluation cases.
// Usage: npx tsx scripts/inbox-eval/run.ts [--runs 2] [--only C01,C02] [--variants baseline,v2,v2-facts]
//   [--cases data/eval/cases.json,more.json] [--alt prompt.txt]  (variant "v2-alt" uses the --alt instructions)
// Variants "sonnet" and "opus" send the V2 request to Claude (needs ANTHROPIC_API_KEY).
// Variant "focus" uses the candidate prompt in focus-prompt.ts. Adding "-edit" to a
// variant (v2-edit, focus-edit) also runs the second-pass editor on that variant's
// drafts; the plain variant's result is kept too. The editor's examples come from
// the case files' live drafts and real replies, never from the same conversation.
// The A/B/C/D test: --cases data/eval/real-cases.json --variants v2,v2-edit,focus,focus-edit
// Reads data/eval/cases.json and writes data/eval/results/<timestamp>.json.
// Nothing is saved to the inbox database and nothing is sent to customers.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { config } from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import sharp from "sharp";
import { runClaudeDraft } from "../../src/lib/inbox/draft-claude";
import { runDraft, type LoadImage } from "../../src/lib/inbox/draft-core";
import type { PromptContext } from "../../src/lib/inbox/prompt";
import { runBaseline } from "./baseline";
import { pickExamples, runEditor } from "./editor";
import { FOCUS_INSTRUCTIONS, FOCUS_VERSION } from "./focus-prompt";

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

  type Case = {
    id: string;
    conversation: string;
    staff_facts: string;
    context: PromptContext;
    reference: string[];
    live?: { messages: string[] };
  };
  const cases: Case[] = [];
  for (const file of arg("cases", join(DIR, "cases.json")).split(","))
    cases.push(...JSON.parse(await readFile(file, "utf8")));
  const altFile = arg("alt", "");
  const alt = altFile ? await readFile(altFile, "utf8") : undefined;
  const loadImage: LoadImage = async (url) => ({
    bytes: await readFile(join(DIR, url)),
    type: (await readFile(join(DIR, `${url}.type`), "utf8")).trim(),
  });
  // Claude rejects images over 5 MB and scales large ones to about 1568 px anyway.
  const loadClaudeImage: LoadImage = async (url) => {
    const image = await loadImage(url);
    if (image.bytes.length < 3_500_000) return image;
    const bytes = await sharp(image.bytes).resize({ width: 1568, height: 1568, fit: "inside" }).jpeg().toBuffer();
    return { bytes, type: "image/jpeg" };
  };
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 2, timeout: 180000 });
  const claude = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: "https://api.anthropic.com", // ignore any proxy URL set in the shell
    maxRetries: 2,
  });
  const CLAUDE: Record<string, string> = { sonnet: "claude-sonnet-5-5", opus: "claude-opus-5-5" };

  // An edited variant is produced together with its base draft, so both share it.
  const edited = new Set(variants.filter((v) => v.endsWith("-edit")).map((v) => v.slice(0, -5)));
  const jobs = cases
    .filter((c) => !only.length || only.includes(c.id))
    .flatMap((c) =>
      [...new Set(variants.map((v) => v.replace(/-edit$/, "")))]
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
            : CLAUDE[variant]
              ? await runClaudeDraft(claude, c.context, loadClaudeImage, { model: CLAUDE[variant] })
              : await runDraft(
                client,
                { ...c.context, staffFacts: variant === "v2-facts" ? c.staff_facts : c.context.staffFacts },
                loadImage,
                variant === "v2-alt"
                  ? { instructions: alt }
                  : variant === "focus"
                    ? { instructions: FOCUS_INSTRUCTIONS }
                    : {},
              );
        if (variant === "focus") output.promptVersion = FOCUS_VERSION;
        results.push({ case: c.id, variant, run, ...output });
        if (edited.has(variant)) {
          const examples = pickExamples(cases, c.conversation);
          const edit = await runEditor(client, c.context, output, examples);
          results.push({ case: c.id, variant: `${variant}-edit`, run, ...edit, examples: examples.map((e) => e.conversation) });
        }
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
