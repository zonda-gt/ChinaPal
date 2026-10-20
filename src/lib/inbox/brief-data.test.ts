import test from "node:test";
import assert from "node:assert/strict";
import { applyEdits, parseBrief, type BriefEdit } from "./brief-data";
import type { Message } from "./types";

const message = (text: string, direction: Message["direction"] = "inbound"): Message => ({
  id: text,
  peer_id: "1",
  direction,
  text,
  deleted: false,
  attachments: [],
  unavailable: false,
  sent_at: "2026-10-16T10:00:00Z",
});
const messages = [message("We are 2 adults, 5-9 Nov in Wuyuan. I'm scared of heights"), message("We suggest Xiangao", "outbound")];
const fact = (text: string, sources: number[], certainty = "confirmed") => ({ text, certainty, sources });
const raw = (over: Record<string, unknown> = {}) =>
  JSON.stringify({
    name: "",
    language: "English",
    stage: { value: "lead", reason: "Asking" },
    need: fact("Plan Wuyuan", [1]),
    dates: fact("5-9 Nov", [1]),
    start: "2026-11-05",
    party: null,
    paid: null,
    route: [],
    requests: [],
    deadlines: [],
    mustKnow: [{ ...fact("Scared of heights", [1]), critical: true }],
    preferences: [],
    questions: [],
    ideas: [],
    ...over,
  });

test("facts with no real source are dropped instead of shown as known", () => {
  const brief = parseBrief(raw({ party: fact("Family of four", []) }), messages);
  assert.equal(brief.party, null);
  assert.equal(brief.need?.sources[0].role, "customer");
});

test("a source number outside the conversation rejects the brief", () => {
  assert.throws(() => parseBrief(raw({ need: fact("Plan", [9]) }), messages));
});

test("a plan only the team mentioned is shown as a suggestion", () => {
  const brief = parseBrief(
    raw({ route: [{ ...fact("Stay in Xiangao", [2]), place: "Xiangao", dates: "5-9 Nov", booked: false }] }),
    messages,
  );
  assert.equal(brief.route[0].certainty, "suggested");
});

test("an unclear start date is left empty", () => {
  assert.equal(parseBrief(raw({ start: "Nov 5" }), messages).start, "");
});

test("team edits replace, add and hide items and survive a new AI brief", () => {
  const brief = parseBrief(raw(), messages);
  const edit = (e: Partial<BriefEdit>): BriefEdit => ({
    id: Math.random().toString(),
    section: "mustKnow",
    action: "set",
    text: "",
    by: "Team",
    at: "2026-10-20T00:00:00Z",
    ...e,
  });
  const out = applyEdits(brief, [
    edit({ section: "dates", text: "6-9 Nov" }),
    edit({ section: "stage", text: "paid" }),
    edit({ section: "mustKnow", text: "Avoid cable cars", target: "Scared of heights" }),
    edit({ section: "preferences", text: "Relaxed pace" }),
  ]);
  assert.equal(out.dates?.text, "6-9 Nov");
  assert.equal(out.stage.value, "paid");
  assert.deepEqual(out.mustKnow.map((m) => m.text), ["Avoid cable cars"]);
  assert.equal(out.preferences[0].text, "Relaxed pace");
  assert.ok(out.preferences[0].editId);
  const hidden = applyEdits(brief, [edit({ action: "hide", target: "Scared of heights" })]);
  assert.equal(hidden.mustKnow.length, 0);
});
