// Blind AI judge and scorecard for an evaluation run against real cases.
// Usage: npx tsx scripts/inbox-eval/judge.ts --results data/eval/results/<file>.json
//   [--cases data/eval/real-cases.json] [--variants v2,v2-edit]
//   [--out data/eval/judged.json] [--mode traveller|team]
// For every case and run, the judge sees the conversation, what the team actually
// sent next and the drafts under shuffled labels.
// --mode traveller (default) reads each draft as the customer would: someone who has
// paid (or is deciding whether to pay) for help making their China trip great, scored
// against ChinaPal's standard for a great reply, with the service facts for accuracy.
// The team's real reply is context only. --mode team asks whether the team would send
// each draft as is, after small edits, or rewrite it, using the real reply as a guide. The scorecard adds
// length, questions and closeness to what was sent, overall and per conversation
// (so the busiest conversations don't decide the result). Writes the judgments to
// --out and the scorecard next to it as .md. Local only: contains customer messages.
// The judge is a separate request to the same GPT model; every version is GPT, so
// any preference for its own writing applies to all of them equally.
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { config } from "dotenv";
import OpenAI from "openai";
import { SERVICE_FACTS, buildPromptText, type PromptContext } from "../../src/lib/inbox/prompt";
import { charCount, compareWithSent, questionCount } from "./text-metrics";

const NAMES: Record<string, string> = {
  v2: "Live prompt",
  "v2.1": "A · prompt v2.1 (before 23 Oct)",
  "v2-edit": "Live prompt + editor",
  v22: "Prompt v2.2 (focus + latest-message fix)",
  "v2-alt": "Candidate prompt (--alt)",
  focus: "B · focus prompt",
  "focus-edit": "C · focus prompt + editor",
  live: "Live draft (logged at the time)",
};
const VERDICTS = ["send_as_is", "small_edits", "rewrite"] as const;
const FLAGS = [
  "too_long",
  "off_current_topic",
  "unneeded_caveats",
  "too_many_questions",
  "repeats_service_or_price",
  "did_too_much",
  "missed_the_question",
  "wrong_or_invented_fact",
  "missing_key_info",
  "awkward_or_robotic",
  "generic_not_specific",
  "doesnt_get_them",
  "no_clear_next_step",
] as const;

const TRAVELLER_INSTRUCTIONS = `You are judging Instagram replies from ChinaPal, a small Shanghai-based team that helps international travellers plan and enjoy independent trips in China, from the traveller's side.

Put yourself in the customer's place. If the stage is "customer", you have paid ChinaPal US$39–59 for planning and online support and you want this trip to be really good. Otherwise you are deciding whether to trust them with it. Read each reply on your phone as that person: does it make you feel understood and well looked after, and is it worth reading?

A great reply:
1. Understands them: the advice clearly fits their situation, without reciting it back to them.
2. Is thoughtful: notices what matters to them, including what they haven't thought of yet, and gives a reasoned pick rather than a list.
3. Shows real work: specific places, Chinese names, timings, or what the team has actually done.
4. Gives a clear next step when that helps: for a paying customer, what the team is doing now; for someone deciding, an easy, useful invitation. Not needed when they are just saying thanks or the reply already ends on the question that is the next step.
5. Is straight to the point and friendly: no padding, no process talk, nothing explained at length that could be said briefly. Around 50 words a message is ideal; over 100 is too long.
6. Is accurate. The customer can't see this, but you must check it: no invented facts, prices or claims that the team called, checked or booked something unless the conversation or staff facts say so. Prices and terms must match the service facts below.

Also: asking again for something they already said, repeating known details (a baby, older parents) in every message, needless questions, sales pitches when they didn't ask, and disclaimers that don't change their decision all make the experience worse.

You also see what the team actually sent next. It is context only (what happened), not the target: a draft can be better or worse than it. Don't mark a draft down for lacking facts only the team knew when they replied, unless the staff facts gave them to the AI.

ChinaPal service facts:
${SERVICE_FACTS}

For each draft:
- verdict: "send_as_is" (great as it is), "small_edits" (good, needs a small fix) or "rewrite" (not good enough for this customer).
- score: 1 to 10 for this moment, as the customer would feel it (accuracy problems lower it a lot).
- flags: any that apply: too_long; off_current_topic; unneeded_caveats; too_many_questions; repeats_service_or_price; did_too_much; missed_the_question; wrong_or_invented_fact; missing_key_info; awkward_or_robotic; generic_not_specific; doesnt_get_them (misses or misreads their situation); no_clear_next_step (when one was needed).
- note: one short sentence.
Then name the best draft. Judge each draft on its own merits; the labels are in random order.`;

const TEAM_INSTRUCTIONS = `You judge AI-drafted Instagram replies for ChinaPal, a small Shanghai-based team that helps international travellers with independent trips in China. A team member reads each draft and decides whether to send it.

You get the conversation as the AI saw it, what the team actually sent next, and several drafts under random labels. The team's real reply shows what they judged right at that moment: the focus, the length, the tone and what could wait. Use it as a strong guide, not the only right answer. Do not mark a draft down for lacking facts only the team knew when they replied (a booking made since, a price they looked up, a link), unless the staff facts gave them to the AI.

For each draft:
- verdict: "send_as_is" (the team would send it unchanged), "small_edits" (a quick cut or wording fix, under a minute) or "rewrite" (they would write their own or rework it substantially).
- score: 1 to 10, how good a reply it is for this moment.
- flags: any that apply:
  too_long; off_current_topic (raises things that could wait); unneeded_caveats (customer-facing disclaimers the team would cut); too_many_questions; repeats_service_or_price (already covered or not asked); did_too_much (writes a plan or quote the team still has to prepare, when a short reply was right); missed_the_question; wrong_or_invented_fact; missing_key_info; awkward_or_robotic.
- note: one short sentence.
Then name the best draft. Judge each draft on its own merits; the labels are in random order.`;

type Case = { id: string; conversation: string; context: PromptContext; reference: string[]; live?: { messages: string[] } };
type Result = { case: string; variant: string; run: number; messages?: string[]; warnings?: string[] };
type Rating = { verdict: (typeof VERDICTS)[number]; score: number; flags: string[]; note: string };
type Judgment = { case: string; run: number; labels: Record<string, string>; best: string; ratings: Record<string, Rating> };

function shuffle<T>(items: T[], seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function schema(labels: string[]) {
  const rating = {
    type: "object",
    additionalProperties: false,
    properties: {
      verdict: { type: "string", enum: [...VERDICTS] },
      score: { type: "integer" },
      flags: { type: "array", items: { type: "string", enum: [...FLAGS] } },
      note: { type: "string" },
    },
    required: ["verdict", "score", "flags", "note"],
  };
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      ratings: {
        type: "object",
        additionalProperties: false,
        properties: Object.fromEntries(labels.map((l) => [l, rating])),
        required: labels,
      },
      best: { type: "string", enum: labels },
    },
    required: ["ratings", "best"],
  };
}

// CommonJS project: top-level await is wrapped in main().
async function main() {
  config({ path: process.env.ENV_FILE || ".env.local" });
  const DIR = "data/eval";
  const arg = (name: string, fallback: string) => {
    const i = process.argv.indexOf(`--${name}`);
    return i > 0 ? process.argv[i + 1] : fallback;
  };
  const resultsFile = arg("results", "");
  if (!resultsFile) throw new Error("Pass --results with the run to judge.");
  const cases: Case[] = JSON.parse(await readFile(arg("cases", join(DIR, "real-cases.json")), "utf8"));
  const results: Result[] = (
    await Promise.all(resultsFile.split(",").map(async (f) => JSON.parse(await readFile(f, "utf8")) as Result[]))
  ).flat();
  const variants = arg("variants", "v2,v2-edit").split(",");
  const out = arg("out", join(DIR, "judged.json"));
  const mode = arg("mode", "traveller");
  if (mode !== "traveller" && mode !== "team") throw new Error("--mode is traveller or team");
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 2, timeout: 180000 });

  async function ask(text: string, labels: string[]) {
    const r = await openai.responses.create({
      model: process.env.INBOX_AI_MODEL || "gpt-6.1-sol",
      reasoning: { effort: "medium" },
      max_output_tokens: 8000,
      store: false,
      instructions: mode === "team" ? TEAM_INSTRUCTIONS : TRAVELLER_INSTRUCTIONS,
      input: [{ role: "user", content: [{ type: "input_text", text }] }],
      text: { format: { type: "json_schema", name: "judgment", strict: true, schema: schema(labels) } },
    });
    if (r.status !== "completed") throw new Error(`Judge did not complete: ${r.status}`);
    return JSON.parse(r.output_text);
  }

  const runs = [...new Set(results.map((r) => r.run))].sort();
  const jobs = cases.flatMap((c) => runs.map((run) => ({ c, run })));
  const judgments: Judgment[] = [];
  let done = 0;
  async function worker() {
    for (let job = jobs.shift(); job; job = jobs.shift()) {
      const { c, run } = job;
      const drafts = variants
        .map((v) => ({ v, r: results.find((x) => x.case === c.id && x.variant === v && x.run === run && x.messages) }))
        .filter((d) => d.r);
      if (drafts.length < 2) continue;
      const shuffled = shuffle(drafts, `${c.id}-${run}`);
      const labels = shuffled.map((_, i) => String.fromCharCode(65 + i));
      const text = [
        buildPromptText(c.context).text,
        c.reference.length
          ? `What the team actually sent next${mode === "team" ? "" : " (context only, not the target)"}:\n${c.reference.map((m, i) => `[message ${i + 1}] ${m}`).join("\n")}`
          : "The team has not replied yet, so there is no real reply to compare with: judge each draft on its own merits.",
        ...shuffled.map(
          (d, i) =>
            `Draft ${labels[i]}:\n${d.r!.messages!.map((m, j) => `[message ${j + 1}] ${m}`).join("\n")}${
              d.r!.warnings?.length ? `\n(Staff warnings, not sent: ${d.r!.warnings.join(" | ")})` : ""
            }`,
        ),
      ].join("\n\n");
      try {
        const j = await ask(text, labels);
        judgments.push({ case: c.id, run, labels: Object.fromEntries(labels.map((l, i) => [l, shuffled[i].v])), ...j });
      } catch (e) {
        console.warn(`  ${c.id} #${run} not judged: ${(e as Error).message}`);
      }
      console.log(`${++done} judged (${c.id} #${run})`);
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  await writeFile(out, JSON.stringify(judgments, null, 1));

  // Scorecard.
  type Row = { conversation: string; verdict?: string; score?: number; best?: boolean; flags?: string[]; chars: number; ratio: number; questions: number; closeness: number; later: number };
  const rows: Record<string, Row[]> = {};
  const byCase = new Map(cases.map((c) => [c.id, c]));
  const add = (variant: string, c: Case, messages: string[], warnings: string[], j?: { rating: Rating; best: boolean }) =>
    (rows[variant] ??= []).push({
      conversation: c.conversation,
      verdict: j?.rating.verdict,
      score: j?.rating.score,
      best: j?.best,
      flags: j?.rating.flags,
      chars: charCount(messages),
      // Only cases the team answered have a real reply to compare length with.
      ratio: c.reference.length ? charCount(messages) / Math.max(1, charCount(c.reference)) : NaN,
      questions: questionCount(messages),
      closeness: compareWithSent(messages, c.reference).closeness,
      later: warnings.filter((w) => /^later:/i.test(w.trim())).length,
    });
  for (const r of results) {
    const c = byCase.get(r.case);
    if (!c || !r.messages || !variants.includes(r.variant)) continue;
    const j = judgments.find((x) => x.case === r.case && x.run === r.run);
    const label = j && Object.entries(j.labels).find(([, v]) => v === r.variant)?.[0];
    add(r.variant, c, r.messages, r.warnings ?? [], label ? { rating: j!.ratings[label], best: j!.best === label } : undefined);
  }
  for (const c of cases) if (c.live?.messages.length) add("live", c, c.live.messages, []);

  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
  const pct = (x: number) => (Number.isNaN(x) ? "–" : `${Math.round(x * 100)}%`);
  const num = (x: number, d = 1) => (Number.isNaN(x) ? "–" : x.toFixed(d));
  // Mean of each conversation's mean, so every customer counts once.
  const perConversation = (rs: Row[], f: (r: Row) => number | undefined) => {
    const groups = new Map<string, number[]>();
    for (const r of rs) {
      const v = f(r);
      if (v !== undefined) groups.set(r.conversation, [...(groups.get(r.conversation) ?? []), v]);
    }
    return mean([...groups.values()].map(mean));
  };
  const lines = [
    `# Reply assistant A/B/C/D test`,
    ``,
    `${cases.length} real cases, ${runs.length} run(s) each, judged blind by a separate GPT request (${mode === "team" ? "as the team: would they send it" : "as the traveller: Sent as is = great as it is, Rewrite = not good enough"}). "Ready to send" = sent as is or after small edits.`,
    ``,
    `| Version | Judged | Score /10 | Sent as is | Ready to send | Rewrite | Picked best | Ready to send (per customer) | Score (per customer) |`,
    `|---|---|---|---|---|---|---|---|---|`,
  ];
  for (const v of variants) {
    const rs = (rows[v] ?? []).filter((r) => r.verdict);
    const n = rs.length;
    const share = (f: (r: Row) => boolean) => (n ? rs.filter(f).length / n : NaN);
    lines.push(
      `| ${NAMES[v] ?? v} | ${n} | ${num(mean(rs.map((r) => r.score!)))} | ${pct(share((r) => r.verdict === "send_as_is"))} | ${pct(share((r) => r.verdict !== "rewrite"))} | ${pct(share((r) => r.verdict === "rewrite"))} | ${pct(share((r) => !!r.best))} | ${pct(perConversation(rs, (r) => (r.verdict !== "rewrite" ? 1 : 0)))} | ${num(perConversation(rs, (r) => r.score))} |`,
    );
  }
  lines.push(
    ``,
    `## Shape of the drafts`,
    ``,
    `The team's real replies averaged ${Math.round(mean(cases.filter((c) => c.reference.length).map((c) => charCount(c.reference))))} characters. Closeness: how much of the draft's wording matches what was sent (1 = identical).`,
    ``,
    `| Version | Characters | Length vs sent | Question marks | Closeness to sent | "Later:" notes |`,
    `|---|---|---|---|---|---|`,
  );
  for (const v of [...variants, "live"]) {
    const rs = rows[v] ?? [];
    if (!rs.length) continue;
    lines.push(
      `| ${NAMES[v] ?? v} | ${Math.round(mean(rs.map((r) => r.chars)))} | ${num(mean(rs.map((r) => r.ratio).filter((x) => !Number.isNaN(x))), 2)}× | ${num(mean(rs.map((r) => r.questions)))} | ${num(mean(rs.map((r) => r.closeness)), 2)} | ${num(mean(rs.map((r) => r.later)))} |`,
    );
  }
  lines.push(``, `## Problems the judge flagged (share of drafts)`, ``, `| Version | ${FLAGS.join(" | ")} |`, `|---|${FLAGS.map(() => "---").join("|")}|`);
  for (const v of variants) {
    const rs = (rows[v] ?? []).filter((r) => r.verdict);
    lines.push(`| ${NAMES[v] ?? v} | ${FLAGS.map((f) => pct(rs.length ? rs.filter((r) => r.flags!.includes(f)).length / rs.length : NaN)).join(" | ")} |`);
  }
  // Head to head on the same case and run.
  const pairs = [["v2-alt", "v2"], ["focus", "v2"], ["v2-edit", "v2"], ["focus-edit", "focus"], ["focus-edit", "v2"], ["focus-edit", "v2-edit"]].filter(
    ([a, b]) => variants.includes(a) && variants.includes(b),
  );
  if (pairs.length) {
    lines.push(``, `## Head to head (same case and run, by score)`, ``, `| Comparison | Better | Same | Worse |`, `|---|---|---|---|`);
    for (const [a, b] of pairs) {
      let win = 0, tie = 0, loss = 0;
      for (const j of judgments) {
        const la = Object.entries(j.labels).find(([, v]) => v === a)?.[0];
        const lb = Object.entries(j.labels).find(([, v]) => v === b)?.[0];
        if (!la || !lb) continue;
        const d = j.ratings[la].score - j.ratings[lb].score;
        if (d > 0) win++;
        else if (d < 0) loss++;
        else tie++;
      }
      lines.push(`| ${NAMES[a]} vs ${NAMES[b]} | ${win} | ${tie} | ${loss} |`);
    }
  }
  const md = lines.join("\n");
  await writeFile(out.replace(/\.json$/, "") + ".md", md);
  console.log(`\n${md}\n\nSaved ${out} and the scorecard next to it.`);
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
