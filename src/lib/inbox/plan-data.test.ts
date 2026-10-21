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
