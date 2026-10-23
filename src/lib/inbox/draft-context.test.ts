import test from "node:test";
import assert from "node:assert/strict";
import { briefForDraft, planForDraft, planShared } from "./draft-context";
import type { TripBrief } from "./brief-data";
import type { PlanCore, PlanItem } from "./plan-data";

const item = (over: Partial<PlanItem>): PlanItem => ({
  time: "10:00",
  title: "Yu Garden",
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
  overview: "Family trip to Shanghai.",
  days: [
    {
      date: "2026-12-06",
      label: "Sun 6 Dec",
      city: "Shanghai",
      base: "Sofitel North Bund",
      items: [
        item({
          detail:
            "A Ming garden with rockeries. Go early, it fills up by 11.\n\nRestaurants: Nanxiang (南翔馒头店), dumplings, ¥60: soup dumplings | Lai Lai: noodles\n\nOther option (Indoor): Shanghai Museum. Free, book ahead.",
          place_cn: "豫园",
          address_cn: "安仁街218号",
          getting_there: "Metro Line 10, 15 min",
          cost: "¥40",
          verify: "Check Monday closure",
          source: "https://example.com/yu",
        }),
      ],
    },
  ],
  bookings: [{ item: "Yu Garden", when: "6 Dec", how: "WeChat", deadline: "Before the visit", status: "to_book" }],
  tips: ["Bring a stroller."],
  sources: ["https://example.com/yu"],
};

test("planShared spots an itinerary link we sent", () => {
  assert.equal(planShared([{ direction: "inbound", text: "see chinapal.co/itinerary/ardio" }]), false);
  assert.equal(planShared([{ direction: "outbound", text: "Here: https://www.chinapal.co/itinerary/ardio", deleted: true }]), false);
  assert.equal(planShared([{ direction: "outbound", text: "Here: https://www.chinapal.co/itinerary/ardio" }]), true);
});

test("planForDraft keeps customer-safe facts and drops internal notes", () => {
  const text = planForDraft(plan);
  assert.match(text, /Day 1 · Sun 6 Dec · staying at Sofitel North Bund/);
  assert.match(text, /- 10:00 Yu Garden/);
  assert.match(text, /A Ming garden with rockeries\./);
  assert.doesNotMatch(text, /fills up by 11/);
  assert.match(text, /Chinese name\/address: 豫园 · 安仁街218号/);
  assert.match(text, /Getting there: Metro Line 10, 15 min/);
  assert.match(text, /Restaurants: Nanxiang \(南翔馒头店\), dumplings, ¥60 \| Lai Lai/);
  assert.doesNotMatch(text, /soup dumplings/);
  assert.match(text, /Other option \(Indoor\): Shanghai Museum$/m);
  assert.match(text, /Yu Garden \(6 Dec\): to book; Before the visit/);
  assert.doesNotMatch(text, /Monday closure|example\.com/);
});

test("briefForDraft lists the brief's days only when there is no plan", () => {
  const fact = (text: string) => ({ text, certainty: "confirmed" as const, sources: [] });
  const brief: TripBrief = {
    name: "Ardio",
    language: "English",
    stage: { value: "planning", reason: "" },
    need: fact("Family itinerary"),
    dates: fact("5–16 Dec 2026"),
    start: "2026-12-05",
    party: null,
    paid: null,
    route: [{ ...fact(""), place: "Shanghai", dates: "5–11 Dec", booked: true }],
    days: [{ date: "2026-12-06", label: "Sun 6 Dec", city: "Shanghai", items: [{ ...fact("Yu Garden"), time: "", booked: false, day: "" }] }],
    requests: [],
    deadlines: [],
    mustKnow: [{ ...fact("Child is 1"), critical: true }],
    preferences: [],
    questions: [],
    ideas: [],
  };
  const withDays = briefForDraft(brief, true);
  assert.match(withDays, /Route:\n- Shanghai 5–11 Dec \(booked\)/);
  assert.match(withDays, /Days:\n- Sun 6 Dec: Yu Garden/);
  assert.match(withDays, /IMPORTANT: Child is 1/);
  assert.doesNotMatch(briefForDraft(brief, false), /Days:/);
});
