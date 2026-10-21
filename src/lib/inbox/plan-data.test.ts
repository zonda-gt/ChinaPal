import test from "node:test";
import assert from "node:assert/strict";
import { cleanText, pageKey, parsePlan } from "./plan-data";
import { freshQuestions, questionsForPrompt, questionsToAsk, type TripQuestion } from "./question-data";
import { parseQuestionUpdates } from "./brief-data";
import type { Message } from "./types";

const question = (over: Partial<TripQuestion>): TripQuestion => ({
  id: "id",
  text: "Which hotel?",
  why: "",
  owner: "customer",
  urgent: false,
  source: "brief",
  status: "open",
  include: false,
  answer: "",
  draft_id: null,
  created_by: "",
  created_at: "",
  updated_at: "",
  ...over,
});
const message = (text: string, direction: Message["direction"]): Message => ({
  id: text,
  peer_id: "1",
  direction,
  text,
  deleted: false,
  attachments: [],
  unavailable: false,
  sent_at: "2026-10-20T10:00:00Z",
});

test("new AI questions skip ones already in the list, reworded only by case or punctuation", () => {
  const existing = [question({ text: "Which hotel in Shanghai on 28–31 Oct?", status: "asked" })];
  const out = freshQuestions(
    [
      { text: "which hotel in Shanghai on 28-31 Oct", why: "Routes", owner: "customer", urgent: true },
      { text: "Arrival airport?", why: "Day 1 route", owner: "customer", urgent: true },
      { text: "Arrival airport?", why: "dup", owner: "customer", urgent: false },
      { text: "Check red panda feeding", why: "", owner: "team", urgent: false },
      { text: "Bad owner", why: "", owner: "robot", urgent: false },
    ],
    existing,
  );
  assert.deepEqual(
    out.map((q) => q.text),
    ["Arrival airport?", "Check red panda feeding"],
  );
});

test("drafts ask only ticked, open customer questions, urgent first", () => {
  const list = [
    question({ id: "a", include: true }),
    question({ id: "b", include: true, urgent: true }),
    question({ id: "c", include: false }),
    question({ id: "d", include: true, owner: "team" }),
    question({ id: "e", include: true, status: "asked" }),
  ];
  assert.deepEqual(
    questionsToAsk(list).map((q) => q.id),
    ["b", "a"],
  );
});

test("question updates must cite a message from the right side", () => {
  const { ids } = questionsForPrompt([question({ id: "uuid-1" }), question({ id: "uuid-2" })]);
  const messages = [message("What's your hotel?", "outbound"), message("Hotel Lotus", "inbound")];
  const raw = JSON.stringify({
    questionUpdates: [
      { ref: "q1", status: "answered", answer: "Hotel Lotus", sources: [2] },
      { ref: "q2", status: "answered", answer: "made up", sources: [1] },
      { ref: "q9", status: "asked", answer: "", sources: [1] },
    ],
  });
  assert.deepEqual(parseQuestionUpdates(raw, ids, messages), [{ id: "uuid-1", status: "answered", answer: "Hotel Lotus" }]);
});

test("plan sources must be pages the research opened", () => {
  const item = (source: string) => ({
    time: "10:00",
    title: "HARMAY",
    detail: "",
    kind: "suggested",
    place_cn: "话梅",
    address_cn: "武康路55号",
    getting_there: "",
    cost: "",
    verify: "",
    source,
  });
  const plan = parsePlan(
    JSON.stringify({
      overview: "Shopping first",
      days: [{ date: "2026-10-24", label: "Sat 24 Oct", city: "Shanghai", base: "Crystal Orange", items: [item("https://www.smartshanghai.com/articles/x/"), item("https://made-up.example/page"), { ...item(""), title: "" }] }],
      bookings: [{ item: "Salon", when: "26 Oct", how: "We book", deadline: "", status: "weird" }],
      questions: [],
      tips: ["Bring passport"],
    }),
    ["https://smartshanghai.com/articles/x?utm=1"],
  );
  assert.equal(plan.days[0].items.length, 2, "items without a title are dropped");
  assert.equal(plan.days[0].items[0].source, "https://smartshanghai.com/articles/x?utm=1");
  assert.equal(plan.days[0].items[1].source, "");
  assert.equal(plan.bookings[0].status, "to_book");
  assert.equal(pageKey("javascript:alert(1)"), "");
});

test("plan text loses inline citation links", () => {
  assert.equal(
    cleanText("Open 10:00–22:00. ([harmay.com](https://harmay.com/en/stores)) See [the guide](https://x.com/a) too."),
    "Open 10:00–22:00. See the guide too.",
  );
});

test("chat edits refer to the plan as given and mark what changed", async () => {
  const { applyPlanEdits } = await import("./plan-data");
  const stopAt = (title: string) => ({ time: "", title, detail: "", kind: "suggested" as const, place_cn: "", address_cn: "", getting_there: "", cost: "", verify: "", source: "" });
  const plan = {
    overview: "Old",
    days: [
      { date: "", label: "Mon", city: "Hangzhou", base: "", items: [stopAt("Salon"), stopAt("Lake walk"), stopAt("Light show")] },
      { date: "", label: "Tue", city: "Hangzhou", base: "", items: [stopAt("Lingyin"), stopAt("Boat")] },
    ],
    bookings: [],
    tips: [],
    sources: ["https://example.com/a"],
  };
  const { plan: next, changed, count } = applyPlanEdits(plan, [
    { op: "remove_item", day: 2, index: 2 },
    { op: "add_item", day: 1, index: 1, item: { ...stopAt("Boat"), source: "https://made-up.example/x" } },
    { op: "set_item", day: 1, index: 3, item: stopAt("Light show from the pier") },
    { op: "set_item", day: 9, index: 1, item: stopAt("No such day") },
    { op: "set_overview", day: 0, index: 0, text: "New" },
  ]);
  assert.equal(count, 4);
  assert.deepEqual(next.days[0].items.map((i) => i.title), ["Salon", "Boat", "Lake walk", "Light show from the pier"]);
  assert.deepEqual(next.days[1].items.map((i) => i.title), ["Lingyin"]);
  assert.deepEqual(changed, ["0-1", "0-3"]);
  assert.equal(next.days[0].items[1].source, "", "unknown sources are dropped");
  assert.equal(next.overview, "New");
});
