import test from "node:test";
import assert from "node:assert/strict";
import { buildPromptText, fitMessages, selectHistory, waitedFor, wordCount, type PromptContext, type PromptMessage } from "./prompt";

const message = (n: number, over: Partial<PromptMessage> = {}): PromptMessage => ({
  id: `m${n}`,
  direction: n % 2 ? "inbound" : "outbound",
  sent_at: new Date(Date.UTC(2026, 9, 10, 2, n)).toISOString(),
  text: `message ${n}`,
  attachments: [],
  deleted: false,
  unavailable: false,
  ...over,
});
const context = (over: Partial<PromptContext> = {}): PromptContext => ({
  now: "2026-10-11T04:00:00.000Z",
  customerName: "Theresa",
  username: "theresa",
  stage: "customer",
  notes: "",
  historyComplete: true,
  messages: [message(1), message(2), message(3)],
  profile: null,
  ...over,
});

test("long messages split at a sentence break and stay within Instagram's limit", () => {
  const long = "Short sentence. ".repeat(100).trim();
  const parts = fitMessages([long, "  ", "Second message"]);
  assert.ok(parts.length >= 3);
  for (const p of parts) assert.ok([...p].length <= 1000);
  assert.equal(parts.at(-1), "Second message");
  assert.equal(parts.slice(0, -1).join(" "), long);
});

test("history keeps the newest messages within the budget", () => {
  const many = Array.from({ length: 500 }, (_, i) => message(i + 1, { text: "x".repeat(200) }));
  const { selected, truncated } = selectHistory(many);
  assert.ok(truncated);
  assert.equal(selected.at(-1)!.id, "m500");
  assert.ok(selected.length <= 400);
  assert.ok(selected.reduce((n, m) => n + m.text.length, 0) <= 60000);
});

test("the request states Shanghai time, waiting time, staff facts and unsent messages", () => {
  const { text } = buildPromptText(
    context({
      staffFacts: "Called Fu 1088: 9pm, private room.",
      messages: [message(1), message(2), message(3, { deleted: true, text: "" })],
    }),
  );
  assert.match(text, /Current time in Shanghai: Sun, 11 Oct 2026, 12:00/);
  assert.match(text, /Customer: Theresa \(@theresa\)/);
  assert.match(text, /Customer's last message was 26 hours ago/);
  assert.match(text, /Staff facts \(verified by the team for this reply\):\nCalled Fu 1088/);
  assert.match(text, /#3 \[.*\] Customer: \[message unsent\]/);
  assert.doesNotMatch(text, /earlier messages are not included/);
});

test("waiting time reads naturally", () => {
  assert.equal(waitedFor("2026-10-10T00:00:00Z", "2026-10-10T00:05:00Z"), "5 minutes");
  assert.equal(waitedFor("2026-10-10T00:00:00Z", "2026-10-10T03:00:00Z"), "3 hours");
  assert.equal(waitedFor("2026-10-10T00:00:00Z", "2026-10-13T00:00:00Z"), "3 days");
});

test("word count treats each Chinese character as a word", () => {
  assert.equal(wordCount("Take the metro to 人民广场 today"), 9);
  assert.equal(wordCount("  "), 0);
});
