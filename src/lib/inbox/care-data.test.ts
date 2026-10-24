import test from "node:test";
import assert from "node:assert/strict";
import { careDays, chinaDate, isDue, isMissed, keyInfo, reminderInstruction, reminders, tripStage } from "./care-data";
import type { PlanCore, PlanItem } from "./plan-data";

const item = (over: Partial<PlanItem>): PlanItem => ({
  time: "",
  title: "",
  detail: "",
  kind: "suggested",
  place_cn: "",
  address_cn: "",
  getting_there: "",
  cost: "",
  verify: "",
  source: "",
  ...over,
});
const plan: PlanCore = {
  overview: "",
  days: [
    { date: "2026-12-05", label: "Sat 5 Dec", city: "Shanghai", base: "Sofitel", items: [item({ time: "14:35", title: "Land at Pudong", kind: "fixed" }), item({ time: "18:00", title: "Dinner" })] },
    { date: "2026-12-06", label: "Sun 6 Dec", city: "Shanghai", base: "Sofitel", items: [item({ time: "09:00", title: "Yu Garden", place_cn: "豫园" })] },
    { date: "2026-12-07", label: "Mon 7 Dec", city: "Hangzhou", base: "Westlake Hotel", items: [item({ time: "10:00", title: "Train G201 to Hangzhou East", kind: "fixed" })] },
    { date: "2026-12-08", label: "Tue 8 Dec", city: "Shanghai", base: "Sofitel", items: [item({ time: "10:05", title: "Fly home", kind: "fixed" })] },
  ],
  bookings: [],
  tips: [],
  sources: [],
};
const at = (iso: string) => Date.parse(iso);

test("chinaDate uses Shanghai time", () => {
  assert.equal(chinaDate(at("2026-12-05T17:00:00Z")), "2026-12-06");
  assert.equal(chinaDate(at("2026-12-05T15:59:00Z")), "2026-12-05");
});

test("team appointments join their day in time order", () => {
  const days = careDays(plan, null, [{ id: "event:1", date: "2026-12-06", time: "08:00", title: "Haircut", detail: "发型屋" }]);
  assert.deepEqual(days[1].items.map((i) => i.title), ["Haircut", "Yu Garden"]);
  assert.equal(days[1].items[0].important, true);
});

test("reminders: prep, one per evening, landed, mid-trip and after, each with its status", () => {
  const days = careDays(plan, null, []);
  const list = reminders(days, [{ key: "evening:2026-12-07", status: "sent", draft_id: null, updated_by: "Steve", updated_at: "" }]);
  assert.deepEqual(list.map((r) => r.key), [
    "prep",
    "evening:2026-12-05",
    "landed",
    "evening:2026-12-07",
    "midtrip",
    "evening:2026-12-08",
    "after",
  ]);
  const train = list.find((r) => r.key === "evening:2026-12-07")!;
  assert.equal(train.due, "2026-12-06T11:00:00.000Z"); // 19:00 in Shanghai the night before
  assert.equal(train.status, "sent");
  assert.deepEqual(train.summary, ["10:00 Train G201 to Hangzhou East"]);
  const landed = list.find((r) => r.key === "landed")!;
  assert.equal(landed.due, "2026-12-05T11:00:00.000Z");
  assert.deepEqual(landed.summary, ["Did they arrive OK, is the hotel fine", "Tomorrow: 09:00 Yu Garden"]);
});

test("due tonight, then missed once the day has passed", () => {
  const r = reminders(careDays(plan, null, []), []).find((x) => x.key === "evening:2026-12-07")!;
  assert.equal(isDue(r, at("2026-12-06T02:00:00Z")), true); // 10:00 the day before: due tonight
  assert.equal(isDue(r, at("2026-12-05T12:00:00Z")), false); // two evenings before
  assert.equal(isDue(r, at("2026-12-07T01:00:00Z")), true); // forgot: still useful that morning
  assert.equal(isMissed(r, at("2026-12-08T01:00:00Z")), true);
  // Arrival-day reminders are no use once they've landed.
  const list = reminders(careDays(plan, null, []), []);
  const arrival = list.find((x) => x.key === "evening:2026-12-05")!;
  assert.equal(isDue(arrival, at("2026-12-04T12:00:00Z")), true);
  assert.equal(isMissed(arrival, at("2026-12-05T02:00:00Z")), true);
  assert.equal(isMissed(list.find((x) => x.key === "prep")!, at("2026-12-05T02:00:00Z")), true);
  assert.equal(isDue({ ...r, status: "drafted" }, at("2026-12-06T02:00:00Z")), false);
});

test("trip stage, next fixed time and key info", () => {
  const days = careDays(plan, null, []);
  assert.deepEqual(tripStage(days, at("2026-12-01T04:00:00Z")), { stage: "before", days: 4, start: "2026-12-05" });
  const during = tripStage(days, at("2026-12-06T04:00:00Z"));
  assert.equal(during.stage, "during");
  if (during.stage === "during") {
    assert.equal(during.day, 2);
    assert.equal(during.of, 4);
    assert.equal(during.next?.title, "Train G201 to Hangzhou East");
  }
  assert.equal(tripStage(days, at("2026-12-10T04:00:00Z")).stage, "after");
  assert.deepEqual(keyInfo(days), {
    hotels: ["Sofitel", "Westlake Hotel"],
    arrival: "Sat 5 Dec · 14:35 Land at Pudong",
    departure: "Tue 8 Dec · 10:05 Fly home",
  });
});

test("the first-evening reminder asks for tomorrow's practical how-to", () => {
  const days = careDays(plan, null, []);
  const r = reminders(days, []).find((x) => x.key === "landed")!;
  const text = reminderInstruction(r, days);
  assert.match(text, /first evening/);
  assert.match(text, /tomorrow, Sun 6 Dec/);
  assert.match(text, /- 09:00 Yu Garden \(豫园\)/);
  assert.ok(text.length <= 2000);
});
