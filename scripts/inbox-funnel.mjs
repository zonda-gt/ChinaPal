// Read-only sales-funnel report over the Instagram inbox in Supabase.
// GET requests only. Prints aggregate counts; per-conversation rows (usernames
// included) are written only to the --csv path you choose, never to stdout.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// The $39 concierge offer as staff state it, plus the Stripe link that follows it.
const PITCH = /(?:US\$|USD|\$)\s?39\b|\b39\s?(?:USD|US dollars|dollars)\b|buy\.stripe\.com/i;
const INTEREST = /\b(?:how (?:do|can|should) (?:i|we) (?:pay|make (?:the )?payment)|payment (?:details|link)|send (?:me |us )?(?:the )?(?:payment|link|details)|yes,? please|let'?s (?:do it|go ahead|proceed)|go ahead|sign (?:me|us) up|i'?m in|we'?re in|count (?:me|us) in|i'?ll take it|interested|proceed)\b/i;
const PAID_INBOUND = /\b(?:i(?:'ve| have)? (?:just )?paid|we(?:'ve| have)? (?:just )?paid|just paid|made (?:the )?payment|did the payment|payment (?:has )?(?:been )?(?:made|sent|done|completed|passed|gone|went) ?(?:through)?)\b/i;
const PAID_OUTBOUND = /\b(?:(?:received|got) (?:your|the) payment|payment (?:is |has been )?(?:received|confirmed)|thanks? (?:you )?for (?:your |the )?payment)\b/i;

/** Classify one conversation. `messages` must be sorted oldest first. */
export function classify(messages, stage = "inquiry") {
  const live = messages.filter((m) => !m.deleted && m.text);
  const inquiry = live.some((m) => m.direction === "inbound");
  const pitchIndex = live.findIndex((m) => m.direction === "outbound" && PITCH.test(m.text));
  const pitched = pitchIndex !== -1;
  const after = pitched ? live.slice(pitchIndex + 1) : [];
  const paidByText = live.some((m) =>
    (m.direction === "inbound" && PAID_INBOUND.test(m.text)) ||
    (m.direction === "outbound" && PAID_OUTBOUND.test(m.text)));
  const paid = paidByText || stage === "customer";
  const interested = paid || after.some((m) => m.direction === "inbound" && INTEREST.test(m.text));
  return {
    inquiry, pitched, interested: pitched && interested, paid,
    paidByText, markedCustomer: stage === "customer",
    pitchedAt: pitched ? live[pitchIndex].sent_at : null,
  };
}

function credentials() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const local = fileURLToPath(new URL("../.env.local", import.meta.url));
  if ((!url || !key) && existsSync(local)) {
    const env = Object.fromEntries(readFileSync(local, "utf8").split("\n")
      .map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/))
      .filter(Boolean).map((m) => [m[1], m[2]]));
    url ??= env.NEXT_PUBLIC_SUPABASE_URL;
    key ??= env.SUPABASE_SERVICE_ROLE_KEY;
  }
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (env or .env.local).");
    process.exit(1);
  }
  return { url: url.replace(/\/$/, ""), key };
}

async function fetchAll({ url, key }, table, select, order) {
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const res = await fetch(`${url}/rest/v1/${table}?select=${select}&order=${order}&limit=1000&offset=${offset}`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!res.ok) throw new Error(`${table}: HTTP ${res.status} ${await res.text()}`);
    const page = await res.json();
    rows.push(...page);
    if (page.length < 1000) return rows;
  }
}

const pct = (n, d) => (d ? `${((100 * n) / d).toFixed(1)}%` : "n/a");

async function main() {
  if (process.argv.includes("--help")) {
    console.log("Run: node scripts/inbox-funnel.mjs [--csv path/to/rows.csv]");
    return;
  }
  const csvAt = process.argv.indexOf("--csv");
  const creds = credentials();
  const conversations = await fetchAll(creds, "inbox_conversations", "peer_id,username,stage", "peer_id");
  const messages = await fetchAll(creds, "inbox_messages", "peer_id,direction,sent_at,text,deleted", "peer_id,sent_at,id");

  const byPeer = new Map(conversations.map((c) => [c.peer_id, []]));
  for (const m of messages) byPeer.get(m.peer_id)?.push(m);
  const rows = conversations.map((c) => ({ ...c, ...classify(byPeer.get(c.peer_id), c.stage) }));

  const count = (f) => rows.filter(f).length;
  const inquiries = count((r) => r.inquiry);
  const pitched = count((r) => r.inquiry && r.pitched);
  const interested = count((r) => r.inquiry && r.interested);
  const paidPitched = count((r) => r.inquiry && r.pitched && r.paid);
  const paidAll = count((r) => r.inquiry && r.paid);
  const dates = messages.map((m) => m.sent_at).sort();

  console.log(`Messages ${messages.length}, conversations ${conversations.length}, ${dates[0] ?? "-"} to ${dates.at(-1) ?? "-"}`);
  console.log(`1. Inquiries (customer wrote in):      ${inquiries}`);
  console.log(`2. Heard the $39 offer:                ${pitched}  (${pct(pitched, inquiries)} of inquiries)`);
  console.log(`3. Showed interest after hearing it:   ${interested}  (${pct(interested, pitched)} of those pitched)`);
  console.log(`4. Paid, after hearing it:             ${paidPitched}  (${pct(paidPitched, pitched)} of pitched, ${pct(paidPitched, interested)} of interested)`);
  console.log(`   Paid, any (incl. no pitch found):   ${paidAll}  (${pct(paidAll, inquiries)} of inquiries)`);
  console.log(`   Paid signal: chat text ${count((r) => r.paidByText)}, stage=customer ${count((r) => r.markedCustomer)}, both ${count((r) => r.paidByText && r.markedCustomer)}`);

  if (csvAt !== -1 && process.argv[csvAt + 1]) {
    const cols = ["username", "stage", "inquiry", "pitched", "interested", "paid", "paidByText", "markedCustomer", "pitchedAt"];
    const esc = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
    writeFileSync(process.argv[csvAt + 1], [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n"));
    console.log(`Per-conversation rows written to ${process.argv[csvAt + 1]}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e.message); process.exit(1); });
