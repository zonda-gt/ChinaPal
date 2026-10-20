// Build a labelled document of every reply in a model comparison, with the
// conversation before it, the team's actual reply and (optionally) ratings.
// Usage: npx tsx scripts/inbox-eval/document.ts --results a.json,b.json --cases a.json,b.json
//   --operator data/eval/operator-replies.json [--ratings dir --map judge-map.json] [--notes notes.html]
//   [--out models.html] [--set images --image-notes data/eval/image-notes.json]
// --set images compares today's drafts (v2) with drafts using image notes (v2-notes)
// and shows each image's note under it.
// Writes a self-contained local page under data/eval/ (contains customer messages, never published).
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import type { PromptContext } from "../../src/lib/inbox/prompt";

type Case = { id: string; cat: string; tests: string; conversation: string; context: PromptContext; reference: string[] };
type Result = { case: string; variant: string; run: number; messages?: string[]; latencyMs?: number };
type Operator = Record<string, { messages: { sent_at?: string; text: string; attachments: string[] }[] }>;
type Rating = { score: number; flags: string[]; note: string };
type Judged = { best: string; ratings: Record<string, Rating> };

const SOURCES: Record<string, string> = {
  "gpt-1": "GPT (V2.1) · run 1",
  "gpt-2": "GPT (V2.1) · run 2",
  "sonnet-1": "Claude Sonnet 5.5 · run 1",
  "sonnet-2": "Claude Sonnet 5.5 · run 2",
  claude: "Claude (this session)",
  operator: "Operator (actually sent)",
};
const GROUP = (key: string) => key.replace(/-\d$/, "");
const GROUP_NAMES: Record<string, string> = {
  gpt: "GPT (V2.1)",
  sonnet: "Claude Sonnet 5.5",
  claude: "Claude (this session)",
  current: "Today's AI (6 newest images)",
  notes: "AI with image notes",
  operator: "Operator",
};
// Which results go in the document, as [variant, run, key], and what the others are compared with.
const SETS = {
  models: {
    baseline: "gpt",
    others: ["sonnet", "claude", "operator"],
    replies: [["v2", 1, "gpt-1"], ["v2", 2, "gpt-2"], ["sonnet", 1, "sonnet-1"], ["sonnet", 2, "sonnet-2"], ["claude-session", 1, "claude"]],
    title: "Reply model comparison",
    intro: "every draft (GPT V2.1 twice, Claude Sonnet 5.5 twice, Claude in this session once)",
  },
  images: {
    baseline: "current",
    others: ["notes", "operator"],
    replies: [["v2", 1, "current-1"], ["v2", 2, "current-2"], ["v2-notes", 1, "notes-1"], ["v2-notes", 2, "notes-2"]],
    title: "Image notes comparison",
    intro: "every draft (today's AI, which sees only the 6 newest images, twice; the AI with image notes for every image, twice)",
  },
} as const;
Object.assign(SOURCES, {
  "current-1": "Today's AI · run 1",
  "current-2": "Today's AI · run 2",
  "notes-1": "With image notes · run 1",
  "notes-2": "With image notes · run 2",
});

async function main() {
  const DIR = "data/eval";
  const arg = (name: string, fallback = "") => {
    const i = process.argv.indexOf(`--${name}`);
    return i > 0 ? process.argv[i + 1] : fallback;
  };
  const readAll = async <T>(files: string) =>
    (await Promise.all(files.split(",").map(async (f) => JSON.parse(await readFile(f, "utf8")) as T[]))).flat();
  const cases = await readAll<Case>(arg("cases", join(DIR, "cases.json")));
  const results = await readAll<Result>(arg("results"));
  const operator: Operator = JSON.parse(await readFile(arg("operator", join(DIR, "operator-replies.json")), "utf8"));
  const ratingsDir = arg("ratings");
  const set = SETS[arg("set", "models") as keyof typeof SETS];
  const imageNotes: Record<string, { note: string }> = arg("image-notes")
    ? JSON.parse(await readFile(arg("image-notes"), "utf8"))
    : {};
  const map: Record<string, Record<string, string>> = ratingsDir
    ? JSON.parse(await readFile(arg("map", join(DIR, "judge-map.json")), "utf8"))
    : {};
  // Ratings keyed by case and source, translated from the blind labels.
  const ratings: Record<string, Record<string, Rating & { best: boolean }>> = {};
  if (ratingsDir)
    for (const f of (await readdir(ratingsDir)).filter((f) => f.endsWith(".json"))) {
      const j: Judged = JSON.parse(await readFile(join(ratingsDir, f), "utf8"));
      const id = f.replace(".json", "");
      ratings[id] = Object.fromEntries(
        Object.entries(j.ratings).map(([label, r]) => [map[id][label], { ...r, best: label === j.best }]),
      );
    }

  const esc = (t: string) =>
    t.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
  const lines = (t: string) => esc(t).replace(/\n/g, "<br>");
  const when = (iso: string) =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Shanghai",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  async function imageTag(url?: string) {
    if (!url || url.startsWith("https://")) return "<em>[image]</em>";
    try {
      const data = (
        await sharp(await readFile(join(DIR, url)))
          .resize({ width: 420, withoutEnlargement: true })
          .jpeg({ quality: 65 })
          .toBuffer()
      ).toString("base64");
      return `<img src="data:image/jpeg;base64,${data}" alt="Image in the conversation">`;
    } catch {
      return "<em>[image]</em>";
    }
  }
  async function messageHtml(m: PromptContext["messages"][number]) {
    const media = await Promise.all(
      m.attachments.map(async (a, i) => {
        if (a.type !== "image") return `<em>[${esc(a.type)}]</em>`;
        const note = imageNotes[`${m.id}:${i}`]?.note;
        return (await imageTag(a.url)) + (note ? `<details class="inote"><summary>Image note</summary>${lines(note)}</details>` : "");
      }),
    );
    const who = m.direction === "inbound" ? "customer" : "team";
    const text = m.deleted ? "<em>[unsent]</em>" : lines(m.text);
    return `<div class="msg ${who}"><span>${who === "customer" ? "Customer" : "ChinaPal"} · ${when(m.sent_at)}</span><p>${text || (media.length ? "" : "<em>[shared post]</em>")}</p>${media.join("")}</div>`;
  }

  // Scorecard across all cases.
  const totals: Record<string, { sum: number; n: number; best: number; flags: Record<string, number> }> = {};
  const head: Record<string, { higher: number; tied: number; lower: number }> = {};
  for (const byKey of Object.values(ratings)) {
    for (const [key, r] of Object.entries(byKey)) {
      const t = (totals[GROUP(key)] ??= { sum: 0, n: 0, best: 0, flags: {} });
      t.sum += r.score;
      t.n++;
      if (r.best) t.best++;
      for (const f of r.flags) t.flags[f] = (t.flags[f] || 0) + 1;
    }
    // Head to head with GPT per case, averaging the runs of each source.
    const avg = (group: string) => {
      const s = Object.entries(byKey).filter(([k]) => GROUP(k) === group).map(([, r]) => r.score);
      return s.length ? s.reduce((a, b) => a + b, 0) / s.length : undefined;
    };
    const gpt = avg(set.baseline);
    for (const group of set.others) {
      const other = avg(group);
      if (gpt === undefined || other === undefined) continue;
      const h = (head[group] ??= { higher: 0, tied: 0, lower: 0 });
      h[other > gpt ? "higher" : other === gpt ? "tied" : "lower"]++;
    }
  }
  const allFlags = [...new Set(Object.values(totals).flatMap((t) => Object.keys(t.flags)))].sort();
  const scorecard = Object.keys(totals).length
    ? `<section class="card"><h2>Scorecard</h2>
  <p>Every reply was rated blind from 1 to 10: the rater saw the conversation and the five or six replies in random order, without names. AI versions with two runs per case count both runs in their average.</p>
  <div class="scroll"><table><tr><th>Source</th><th>Average score</th><th>Replies rated</th><th>Picked best</th>${allFlags.map((f) => `<th>${esc(f)}</th>`).join("")}</tr>
  ${Object.entries(totals)
    .sort((a, b) => b[1].sum / b[1].n - a[1].sum / a[1].n)
    .map(
      ([g, t]) =>
        `<tr><td>${GROUP_NAMES[g]}</td><td><b>${(t.sum / t.n).toFixed(2)}</b></td><td>${t.n}</td><td>${t.best}</td>${allFlags.map((f) => `<td>${t.flags[f] || ""}</td>`).join("")}</tr>`,
    )
    .join("")}</table></div>
  <h3>Case by case against ${GROUP_NAMES[set.baseline]} (average of each source's runs)</h3>
  <div class="scroll"><table><tr><th>Compared with ${GROUP_NAMES[set.baseline]}</th><th>Cases scored higher</th><th>Tied</th><th>Cases scored lower</th></tr>
  ${Object.entries(head)
    .map(([g, h]) => `<tr><td>${GROUP_NAMES[g]}</td><td>${h.higher}</td><td>${h.tied}</td><td>${h.lower}</td></tr>`)
    .join("")}</table></div></section>`
    : "";

  const notesFile = arg("notes");
  const notes = notesFile ? `<section class="card notes">${await readFile(notesFile, "utf8")}</section>` : "";
  const sections: string[] = [];
  for (const c of cases) {
    const replies: { key: string; messages: string[]; times?: string[] }[] = [];
    for (const [variant, run, key] of set.replies) {
      const r = results.find((x) => x.case === c.id && x.variant === variant && x.run === run && x.messages);
      if (r) replies.push({ key, messages: r.messages! });
    }
    const op = operator[c.id]?.messages ?? [];
    if (op.length)
      replies.push({
        key: "operator",
        messages: op.map((m) => [m.text, ...m.attachments.map((a) => `[${a} sent]`)].filter(Boolean).join("\n")),
        times: op.map((m) => (m.sent_at ? when(m.sent_at) : "")),
      });
    const msgs = c.context.messages;
    const recent = await Promise.all(msgs.slice(-12).map(messageHtml));
    const earlier = msgs.length > 12 ? await Promise.all(msgs.slice(0, -12).map(messageHtml)) : [];
    const cards = replies
      .map(({ key, messages, times }) => {
        const r = ratings[c.id]?.[key];
        return `<article class="reply ${GROUP(key)}${r?.best ? " best" : ""}">
      <header><b>${SOURCES[key]}</b>${r ? `<span class="score">${r.score}/10${r.best ? " · best" : ""}</span>` : ""}</header>
      ${messages.map((t, i) => `<div class="bubble"><small>Message ${i + 1}${times?.[i] ? ` · ${times[i]}` : ""}</small>${lines(t)}</div>`).join("")}
      ${r ? `<p class="note">${r.flags.length ? `<span class="flags">${r.flags.map(esc).join(" · ")}</span> ` : ""}${esc(r.note)}</p>` : ""}
    </article>`;
      })
      .join("");
    sections.push(`<section class="card case" id="${c.id}">
    <h2>${c.id} <small>${esc(c.cat)} · @${esc(c.conversation)}</small></h2>
    <p class="tests">${esc(c.tests)}</p>
    <h3>Conversation before the reply</h3>
    ${earlier.length ? `<details><summary>Earlier messages (${earlier.length})</summary><div class="thread">${earlier.join("")}</div></details>` : ""}
    <div class="thread">${recent.join("")}</div>
    <h3>Replies</h3>
    <div class="replies">${cards}</div>
  </section>`);
  }

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${set.title}</title>
  <style>
  :root{--bg:#f7f5f0;--card:#fff;--ink:#22303c;--muted:#6b7680;--line:#e2ddd2;--cust:#eef2f6;--team:#e9f4ec;--accent:#0b63ce;--gpt:#8a5a00;--sonnet:#a0461f;--claude:#6b3fa0;--operator:#1d7a46}
  @media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#15191d;--card:#1e2328;--ink:#e6e9ec;--muted:#9aa4ad;--line:#2f363d;--cust:#25303a;--team:#1f3227;--accent:#6aa8ff;--gpt:#e0b354;--sonnet:#f0936a;--claude:#c3a2ee;--operator:#6fd39a}}
  :root[data-theme=dark]{--bg:#15191d;--card:#1e2328;--ink:#e6e9ec;--muted:#9aa4ad;--line:#2f363d;--cust:#25303a;--team:#1f3227;--accent:#6aa8ff;--gpt:#e0b354;--sonnet:#f0936a;--claude:#c3a2ee;--operator:#6fd39a}
  *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.55 system-ui,sans-serif;padding:16px}
  main{max-width:1200px;margin:0 auto}h1{font-size:22px;margin:0 0 4px}h3{font-size:14px;margin:16px 0 6px;color:var(--muted)}
  .card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px;margin:16px 0}.case h2{margin:0;font-size:17px}.case h2 small{color:var(--muted);font-weight:400}
  .tests{color:var(--muted);margin:4px 0 0}.thread{display:flex;flex-direction:column;gap:6px;max-width:760px}
  .msg{padding:8px 10px;border-radius:8px;max-width:90%}.msg span{font-size:11px;color:var(--muted)}.msg p{margin:2px 0 0;overflow-wrap:anywhere}.msg img{max-width:220px;border-radius:6px;display:block;margin-top:4px}
  .customer{background:var(--cust);align-self:flex-start}.team{background:var(--team);align-self:flex-end}
  .replies{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}
  .reply{border:1px solid var(--line);border-top:4px solid var(--c);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:8px}
  .reply.gpt{--c:var(--gpt)}.reply.sonnet{--c:var(--sonnet)}.reply.claude{--c:var(--claude)}.reply.operator{--c:var(--operator)}.reply.current{--c:var(--gpt)}.reply.notes{--c:var(--claude)}
  .inote{max-width:240px;font-size:12px;margin-top:4px}.inote summary{cursor:pointer;color:var(--muted)}
  .reply.best{box-shadow:0 0 0 2px var(--c)}.reply header{display:flex;justify-content:space-between;gap:8px;color:var(--c)}.score{font-weight:700;white-space:nowrap}
  .bubble{background:var(--bg);padding:8px;border-radius:6px;overflow-wrap:anywhere}.bubble small{display:block;color:var(--muted);font-size:11px}
  .note{margin:0;font-size:13px;color:var(--muted)}.flags{color:var(--ink);font-weight:600}
  .scroll{overflow-x:auto}table{border-collapse:collapse;margin-top:8px}td,th{border:1px solid var(--line);padding:4px 8px;text-align:left;white-space:nowrap}
  nav{display:flex;flex-wrap:wrap;gap:6px}nav a{color:var(--accent);text-decoration:none}
  @media (max-width:600px){.msg img{max-width:100%}.replies{grid-template-columns:1fr}}
  </style></head><body><main>
  <h1>${set.title}</h1>
  <p>${cases.length} real moments from ChinaPal's Instagram inbox. For each one: the conversation up to that point, then ${set.intro} and what the operator actually sent, including every message in that reply.</p>
  <nav>${cases.map((c) => `<a href="#${c.id}">${c.id}</a>`).join("")}</nav>
  ${notes}
  ${scorecard}
  ${sections.join("\n")}
  </main></body></html>`;
  const out = join(DIR, arg("out", "models.html"));
  await writeFile(out, html);
  console.log(`Wrote ${out} (${cases.length} cases)`);
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
