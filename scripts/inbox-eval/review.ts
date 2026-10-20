// Build a blind side-by-side review page from an evaluation run.
// Usage: npx tsx scripts/inbox-eval/review.ts data/eval/results/<file>.json[,more.json] [--labelled]
//   [--cases data/eval/cases.json,more.json] [--variants baseline,v2,v2-facts] [--out review.html]
// --labelled shows which version wrote each reply (data/eval/review-labelled.html).
// Writes data/eval/review.html: a self-contained local page (contains customer
// messages, so it is never published). Ratings are kept in the browser and can
// be exported as JSON; "Reveal" shows which version wrote each reply.
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import type { PromptContext } from "../../src/lib/inbox/prompt";

// CommonJS project: top-level await is wrapped in main().
async function main() {
  const DIR = "data/eval";
  type Case = { id: string; cat: string; tests: string; staff_facts: string; context: PromptContext; reference: string[] };
  type Result = { case: string; variant: string; run: number; messages?: string[]; warnings?: string[]; error?: string };
  const resultsFile = process.argv[2];
  const labelled = process.argv.includes("--labelled");
  const arg = (name: string, fallback: string) => {
    const i = process.argv.indexOf(`--${name}`);
    return i > 0 ? process.argv[i + 1] : fallback;
  };
  const NAMES: Record<string, string> = {
    baseline: "V1 (current)",
    v2: "V2 (GPT)",
    "v2-facts": "V2 + staff facts",
    sonnet: "Claude Sonnet 5.5",
    opus: "Claude Opus 5.5",
    "claude-session": "Claude (this session)",
    staff: "Actual message sent",
  };
  if (!resultsFile) throw new Error("Pass the results file to review.");
  const readAll = async <T>(files: string) =>
    (await Promise.all(files.split(",").map(async (f) => JSON.parse(await readFile(f, "utf8")) as T[]))).flat();
  const cases = await readAll<Case>(arg("cases", join(DIR, "cases.json")));
  const results = await readAll<Result>(resultsFile);
  const variants = arg("variants", "baseline,v2,v2-facts").split(",");
  const esc = (t: string) =>
    t.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
  const when = (iso: string) =>
    new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Shanghai", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
  // Deterministic shuffle so the labels stay the same when the page is rebuilt.
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
  async function imageTag(url?: string) {
    if (!url || url.startsWith("https://")) return "<em>[image]</em>";
    try {
      // Small previews keep the page light; the model saw the full image.
      const data = (
        await sharp(await readFile(join(DIR, url)))
          .resize({ width: 480, withoutEnlargement: true })
          .jpeg({ quality: 70 })
          .toBuffer()
      ).toString("base64");
      return `<img src="data:image/jpeg;base64,${data}" alt="Customer image">`;
    } catch {
      return "<em>[image]</em>";
    }
  }
  async function messageHtml(m: PromptContext["messages"][number]) {
    const media = await Promise.all(
      m.attachments.map((a) => (a.type === "image" ? imageTag(a.url) : `<em>[${a.type}]</em>`)),
    );
    const who = m.direction === "inbound" ? "customer" : "team";
    const text = m.deleted ? "<em>[unsent]</em>" : esc(m.text).replace(/\n/g, "<br>");
    return `<div class="msg ${who}"><span>${who === "customer" ? "Customer" : "ChinaPal"} · ${when(m.sent_at)}</span><p>${text || (media.length ? "" : "<em>[shared post]</em>")}</p>${media.join("")}</div>`;
  }

  const mapping: Record<string, Record<string, string>> = {};
  const sections: string[] = [];
  for (const c of cases) {
    const options: { key: string; messages: string[]; warnings: string[] }[] = [];
    for (const variant of variants) {
      const r = results.find((x) => x.case === c.id && x.variant === variant && x.run === 1 && x.messages);
      if (r) options.push({ key: variant, messages: r.messages!, warnings: r.warnings ?? [] });
    }
    if (c.reference.length) options.push({ key: "staff", messages: c.reference, warnings: [] });
    if (!options.length) continue;
    const shuffled = labelled ? options : shuffle(options, c.id);
    mapping[c.id] = Object.fromEntries(shuffled.map((o, i) => [String.fromCharCode(65 + i), o.key]));
    const msgs = c.context.messages;
    const recent = await Promise.all(msgs.slice(-12).map(messageHtml));
    const earlier = msgs.length > 12 ? await Promise.all(msgs.slice(0, -12).map(messageHtml)) : [];
    const cards = shuffled
      .map((o, i) => {
        const label = String.fromCharCode(65 + i);
        return `<article class="option" data-label="${label}">
    <header><label><input type="radio" name="best-${c.id}" value="${label}"> Best: <b>${label}</b></label><span class="who"${labelled ? "" : " hidden"}>${labelled ? NAMES[o.key] : ""}</span></header>
    ${o.messages.map((t) => `<div class="draft">${esc(t).replace(/\n/g, "<br>")}</div>`).join("")}
    ${o.warnings.length ? `<details class="warn"><summary>Staff warnings (${o.warnings.length})</summary><ul>${o.warnings.map((w) => `<li>${esc(w)}</li>`).join("")}</ul></details>` : ""}
    <div class="tags">${["Wrong or invented fact", "Asked for known info", "Vague / not specific", "Too long", "Missed the question", "Too salesy", "Sounds like a bot"]
      .map((t) => `<label><input type="checkbox" data-tag="${t}"> ${t}</label>`)
      .join("")}</div>
  </article>`;
      })
      .join("");
    sections.push(`<section class="case" id="${c.id}" data-case="${c.id}">
    <h2>${c.id} <small>${esc(c.cat)}</small></h2>
    <p class="tests">${esc(c.tests)}</p>
    ${earlier.length ? `<details class="earlier"><summary>Earlier conversation (${earlier.length} messages)</summary>${earlier.join("")}</details>` : ""}
    <div class="thread">${recent.join("")}</div>
    ${c.staff_facts && variants.includes("v2-facts") ? `<p class="facts"><b>Staff facts given to the "with facts" version:</b> ${esc(c.staff_facts)}</p>` : ""}
    <div class="options">${cards}</div>
    <textarea class="note" placeholder="Notes on this case (optional)"></textarea>
  </section>`);
  }

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Reply Assistant Review</title>
  <style>
  :root{--bg:#f7f5f0;--card:#fff;--ink:#22303c;--muted:#6b7680;--line:#e2ddd2;--cust:#eef2f6;--team:#e9f4ec;--accent:#0b63ce}
  @media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#15191d;--card:#1e2328;--ink:#e6e9ec;--muted:#9aa4ad;--line:#2f363d;--cust:#25303a;--team:#1f3227;--accent:#6aa8ff}}
  :root[data-theme=dark]{--bg:#15191d;--card:#1e2328;--ink:#e6e9ec;--muted:#9aa4ad;--line:#2f363d;--cust:#25303a;--team:#1f3227;--accent:#6aa8ff}
  *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.55 system-ui,sans-serif;padding:16px}
  main{max-width:1200px;margin:0 auto}h1{font-size:20px;margin:0 0 4px}.bar{position:sticky;top:0;background:var(--bg);padding:8px 0;display:flex;gap:8px;flex-wrap:wrap;align-items:center;z-index:2;border-bottom:1px solid var(--line)}
  button{font:inherit;padding:6px 12px;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:6px;cursor:pointer}
  .case{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px;margin:16px 0}.case h2{margin:0;font-size:17px}.case h2 small{color:var(--muted);font-weight:400}
  .tests{color:var(--muted);margin:4px 0 12px}.thread,.earlier{display:flex;flex-direction:column;gap:6px;max-width:720px}
  .msg{padding:8px 10px;border-radius:8px;max-width:90%}.msg span{font-size:11px;color:var(--muted)}.msg p{margin:2px 0 0;overflow-wrap:anywhere}.msg img{max-width:240px;border-radius:6px;display:block;margin-top:4px}
  .customer{background:var(--cust);align-self:flex-start}.team{background:var(--team);align-self:flex-end}
  .facts{background:var(--cust);padding:8px 10px;border-radius:8px}
  .options{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-top:14px}
  .option{border:1px solid var(--line);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:8px}.option header{display:flex;justify-content:space-between}
  .option.best{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}.who{font-size:12px;color:var(--accent);font-weight:600}
  .draft{white-space:normal;background:var(--bg);padding:8px;border-radius:6px;overflow-wrap:anywhere}.tags{display:flex;flex-direction:column;font-size:12px;color:var(--muted)}
  .warn{font-size:12px;color:var(--muted)}.note{width:100%;margin-top:10px;min-height:44px;background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:6px;padding:6px}
  table{border-collapse:collapse;margin-top:8px}td,th{border:1px solid var(--line);padding:4px 8px;text-align:left}#score{display:none}
  @media (max-width:600px){body{padding:16px 16px}.msg img{max-width:100%}}
  </style></head><body><main>
  <h1>Reply assistant review</h1>
  <p>${labelled ? "Each reply is labelled with the version that wrote it. Pick the best reply and tick any problems. Ratings save in this browser." : "For each case, pick the best reply and tick any problems. Labels are shuffled; don't reveal until you've finished. Ratings save in this browser."}</p>
  <div class="bar"><span id="progress"></span><button id="export">Export ratings</button><button id="reveal">${labelled ? "Show score" : "Reveal versions + score"}</button></div>
  <div id="score"></div>
  ${sections.join("\n")}
  </main>
  <script>
  const MAP=${JSON.stringify(mapping)};
  const KEY="inbox-review-"+${JSON.stringify(resultsFile + (labelled ? "-labelled" : ""))};const LABELLED=${labelled};
  let state={};try{state=JSON.parse(localStorage.getItem(KEY)||"{}")}catch{}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}progress()};
  function progress(){const n=Object.keys(MAP).length,d=Object.keys(MAP).filter(c=>state[c]?.best).length;document.getElementById("progress").textContent=d+" of "+n+" cases rated"}
  document.querySelectorAll(".case").forEach(sec=>{const c=sec.dataset.case;state[c]=state[c]||{best:null,tags:{},note:""};
   sec.querySelectorAll("input[type=radio]").forEach(r=>{if(state[c].best===r.value)r.checked=true;r.onchange=()=>{state[c].best=r.value;mark(sec,c);save()}});
   sec.querySelectorAll(".option").forEach(o=>{const L=o.dataset.label;o.querySelectorAll("input[type=checkbox]").forEach(cb=>{const t=cb.dataset.tag;cb.checked=!!state[c].tags[L]?.includes(t);cb.onchange=()=>{const s=new Set(state[c].tags[L]||[]);cb.checked?s.add(t):s.delete(t);state[c].tags[L]=[...s];save()}})});
   const note=sec.querySelector(".note");note.value=state[c].note||"";note.oninput=()=>{state[c].note=note.value;save()};mark(sec,c)});
  function mark(sec,c){sec.querySelectorAll(".option").forEach(o=>o.classList.toggle("best",o.dataset.label===state[c].best))}
  document.getElementById("export").onclick=()=>{const out=Object.fromEntries(Object.entries(state).map(([c,s])=>[c,{...s,best_version:MAP[c]?.[s.best]||null,tags_by_version:Object.fromEntries(Object.entries(s.tags).map(([L,t])=>[MAP[c]?.[L],t]))}]));
   const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(out,null,1)],{type:"application/json"}));a.download="review-ratings.json";a.click()};
  document.getElementById("reveal").onclick=()=>{if(!LABELLED&&!confirm("Reveal which version wrote each reply?"))return;
   document.querySelectorAll(".case").forEach(sec=>{const c=sec.dataset.case;sec.querySelectorAll(".option").forEach(o=>{const w=o.querySelector(".who");w.textContent=${JSON.stringify(NAMES)}[MAP[c][o.dataset.label]];w.hidden=false})});
   const wins={},seen={},tags={};for(const [c,m] of Object.entries(MAP)){for(const v of Object.values(m))seen[v]=(seen[v]||0)+1;const s=state[c];if(s?.best)wins[m[s.best]]=(wins[m[s.best]]||0)+1;for(const [L,t] of Object.entries(s?.tags||{}))for(const x of t){const v=m[L];tags[v]=tags[v]||{};tags[v][x]=(tags[v][x]||0)+1}}
   const names=${JSON.stringify(NAMES)};const allTags=[...new Set(Object.values(tags).flatMap(o=>Object.keys(o)))];
   let h="<h2>Scorecard</h2><table><tr><th>Version</th><th>Picked best</th><th>Cases shown</th>"+allTags.map(t=>"<th>"+t+"</th>").join("")+"</tr>";
   for(const v of Object.keys(seen))h+="<tr><td>"+names[v]+"</td><td>"+(wins[v]||0)+"</td><td>"+seen[v]+"</td>"+allTags.map(t=>"<td>"+((tags[v]||{})[t]||0)+"</td>").join("")+"</tr>";
   const el=document.getElementById("score");el.innerHTML=h+"</table>";el.style.display="block";el.scrollIntoView()};
  progress();
  </script></body></html>`;
  const out = arg("out", labelled ? "review-labelled.html" : "review.html");
  await writeFile(join(DIR, out), html);
  console.log(`Wrote ${DIR}/${out} (${Object.keys(mapping).length} cases)`);
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
