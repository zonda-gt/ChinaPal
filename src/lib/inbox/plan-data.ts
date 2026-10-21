// Trip plan: the AI's researched day-by-day plan for one traveller, built on
// request from the chat, the trip brief and web research. It is a proposal for
// the team to check, and later the content of the traveller's itinerary page.
import { NEW_QUESTION_SCHEMA } from "./question-data";

export type PlanKind = "fixed" | "suggested" | "option";
export type PlanItem = {
  time: string;
  title: string;
  detail: string;
  kind: PlanKind; // fixed: the traveller's own commitment; option: an alternative or extra
  place_cn: string; // Chinese name to paste into Amap or DiDi
  address_cn: string;
  getting_there: string; // from the previous stop: metro line, change, exit, minutes, or taxi
  cost: string;
  verify: string; // what still needs checking before we rely on it; "" when checked
  source: string; // a page the research actually opened, or ""
};
export type PlanDay = { date: string; label: string; city: string; base: string; items: PlanItem[] };
export type BookingStatus = "to_book" | "customer_books" | "booked" | "no_booking";
export type PlanBooking = { item: string; when: string; how: string; deadline: string; status: BookingStatus };
export type PlanCore = {
  overview: string;
  days: PlanDay[];
  bookings: PlanBooking[];
  tips: string[];
  sources: string[]; // every page the research opened
};
// A team member's message in the plan chat, or the AI's reply with the stops it changed.
export type PlanChatTurn = { role: "team" | "assistant"; text: string; at: string; by?: string; changed?: string[] };
export type TripPlan = PlanCore & {
  chat?: PlanChatTurn[];
  undo?: PlanCore | null; // the plan before the last chat change or replacement
};
export type PlanStatus = "idle" | "running" | "failed";
export type SavedPlan = {
  plan: TripPlan | null;
  status: PlanStatus;
  job: string | null;
  instruction: string;
  error: string;
  model: string | null;
  usage: { input_tokens: number; cached_input_tokens: number; output_tokens: number; searches: number } | null;
  started_by: string;
  started_at: string | null;
  generated_at: string | null;
};
export const EMPTY_PLAN: SavedPlan = {
  plan: null,
  status: "idle",
  job: null,
  instruction: "",
  error: "",
  model: null,
  usage: null,
  started_by: "",
  started_at: null,
  generated_at: null,
};
export const BOOKING_LABELS: Record<BookingStatus, string> = {
  to_book: "We book",
  customer_books: "They book",
  booked: "Booked",
  no_booking: "No booking",
};

// No maxLength: a model forced to stop at a length cuts words in half. parsePlan
// trims the text instead.
const text = (max: number) => ({ type: "string", description: `About ${max} characters at most` });
const list = (items: object, max: number) => ({ type: "array", maxItems: max, items });
export const PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    overview: text(800),
    days: list(
      {
        type: "object",
        additionalProperties: false,
        properties: {
          date: text(10),
          label: text(30),
          city: text(80),
          base: text(160),
          items: list(
            {
              type: "object",
              additionalProperties: false,
              properties: {
                time: text(30),
                title: text(140),
                detail: text(600),
                kind: { type: "string", enum: ["fixed", "suggested", "option"] },
                place_cn: text(120),
                address_cn: text(200),
                getting_there: text(400),
                cost: text(100),
                verify: text(300),
                source: text(400),
              },
              required: ["time", "title", "detail", "kind", "place_cn", "address_cn", "getting_there", "cost", "verify", "source"],
            },
            12,
          ),
        },
        required: ["date", "label", "city", "base", "items"],
      },
      31,
    ),
    bookings: list(
      {
        type: "object",
        additionalProperties: false,
        properties: {
          item: text(140),
          when: text(80),
          how: text(300),
          deadline: text(120),
          status: { type: "string", enum: ["to_book", "customer_books", "booked", "no_booking"] },
        },
        required: ["item", "when", "how", "deadline", "status"],
      },
      15,
    ),
    questions: list(NEW_QUESTION_SCHEMA, 10),
    tips: list(text(300), 8),
  },
  required: ["overview", "days", "bookings", "questions", "tips"],
};

/** Text without the inline citation links web search adds, e.g. "([site.com](https://…))". */
export function cleanText(value: string) {
  return value
    .replace(/\s*\(\[[^\]]*\]\([^)]*\)\)/g, "")
    .replace(/\[([^\]]*)\]\((https?:[^)]*)\)/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/** A URL reduced to what identifies the page, for matching against opened sources. */
export function pageKey(url: string) {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") return "";
    return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/+$/, "")}`.toLowerCase();
  } catch {
    return "";
  }
}

const str = (value: unknown, max: number) => (typeof value === "string" ? cleanText(value).slice(0, max) : "");
const arr = (value: unknown, max: number) => (Array.isArray(value) ? (value.slice(0, max) as Record<string, unknown>[]) : []);
const STATUSES = ["to_book", "customer_books", "booked", "no_booking"];

/** One stop, checked. Its source must be one of the known pages, else it is dropped. */
export function cleanItem(i: Record<string, unknown>, known: Map<string, string>): PlanItem {
  const kind: PlanKind = i.kind === "fixed" || i.kind === "option" ? i.kind : "suggested";
  return {
    time: str(i.time, 30),
    title: str(i.title, 140),
    detail: str(i.detail, 600),
    kind,
    place_cn: str(i.place_cn, 120),
    address_cn: str(i.address_cn, 200),
    getting_there: str(i.getting_there, 400),
    cost: str(i.cost, 100),
    verify: str(i.verify, 300),
    source: known.get(pageKey(str(i.source, 400))) ?? "",
  };
}
export function cleanBookings(value: unknown): PlanBooking[] {
  return arr(value, 15)
    .map((b) => ({
      item: str(b.item, 140),
      when: str(b.when, 80),
      how: str(b.how, 300),
      deadline: str(b.deadline, 120),
      status: (STATUSES.includes(b.status as string) ? b.status : "to_book") as BookingStatus,
    }))
    .filter((b) => b.item);
}
export function cleanTips(value: unknown) {
  return (Array.isArray(value) ? value : []).slice(0, 8).map((t: unknown) => str(t, 300)).filter(Boolean);
}
const knownPages = (opened: string[]) => {
  const pages = [...new Set(opened.filter((u) => pageKey(u)))];
  return { pages, known: new Map(pages.map((u) => [pageKey(u), u])) };
};

/**
 * The model's plan, checked. Item sources must be pages the research actually
 * opened; anything else is dropped rather than shown as evidence.
 */
export function parsePlan(raw: string, opened: string[]): TripPlan {
  const data = JSON.parse(raw);
  const { pages, known } = knownPages(opened);
  if (!Array.isArray(data.days)) throw Error("Invalid plan");
  const days = arr(data.days, 31).map((d) => {
    const date = str(d.date, 10);
    return {
      date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "",
      label: str(d.label, 30),
      city: str(d.city, 80),
      base: str(d.base, 160),
      items: arr(d.items, 12)
        .map((i) => cleanItem(i, known))
        .filter((i) => i.title),
    };
  });
  return {
    overview: str(data.overview, 800),
    days,
    bookings: cleanBookings(data.bookings),
    tips: cleanTips(data.tips),
    sources: pages.slice(0, 200),
  };
}

/* ── Plan chat: small edits instead of rewriting the whole plan ── */
const ITEM_SCHEMA = (PLAN_SCHEMA.properties.days.items as { properties: { items: { items: object } } }).properties.items.items;
const nullable = (schema: object) => ({ anyOf: [schema, { type: "null" }] });
export const PLAN_EDIT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    reply: text(600),
    edits: list(
      {
        type: "object",
        additionalProperties: false,
        properties: {
          op: { type: "string", enum: ["set_item", "add_item", "remove_item", "set_day", "set_overview", "set_bookings", "set_tips"] },
          day: { type: "integer" },
          index: { type: "integer" },
          item: nullable(ITEM_SCHEMA),
          label: text(30),
          city: text(80),
          base: text(160),
          text: text(800),
          bookings: nullable(PLAN_SCHEMA.properties.bookings),
          tips: nullable(PLAN_SCHEMA.properties.tips),
        },
        required: ["op", "day", "index", "item", "label", "city", "base", "text", "bookings", "tips"],
      },
      40,
    ),
  },
  required: ["reply", "edits"],
};

/** The plan as the chat model sees it: days and stops numbered from 1. */
export function planForEditing(plan: PlanCore) {
  return {
    overview: plan.overview,
    days: plan.days.map((d, di) => ({
      day: di + 1,
      label: d.label,
      date: d.date,
      city: d.city,
      base: d.base,
      items: d.items.map((item, ii) => ({ index: ii + 1, ...item })),
    })),
    bookings: plan.bookings,
    tips: plan.tips,
  };
}

/**
 * Apply chat edits. Day and stop numbers always refer to the plan as it was
 * given, so the order of edits doesn't matter. add_item inserts after stop
 * `index` (0 = at the start of the day). Returns the new plan and the keys
 * ("day-stop", 0-based, in the new plan) of the stops that were changed or added.
 */
export function applyPlanEdits(plan: PlanCore, raw: unknown): { plan: PlanCore; changed: string[]; count: number } {
  const edits = arr(raw, 40);
  const { known } = knownPages(plan.sources);
  const days = plan.days.map((d) => ({
    ...d,
    slots: d.items.map((item) => ({ item, changed: false, removed: false })),
    inserts: new Map<number, PlanItem[]>(),
  }));
  let overview = plan.overview,
    bookings = plan.bookings,
    tips = plan.tips,
    count = 0;
  for (const e of edits) {
    const day = days[Number(e.day) - 1];
    const index = Number(e.index);
    const item = e.item && typeof e.item === "object" ? cleanItem(e.item as Record<string, unknown>, known) : null;
    if (e.op === "set_overview" && typeof e.text === "string" && e.text.trim()) overview = str(e.text, 800);
    else if (e.op === "set_bookings" && Array.isArray(e.bookings)) bookings = cleanBookings(e.bookings);
    else if (e.op === "set_tips" && Array.isArray(e.tips)) tips = cleanTips(e.tips);
    else if (!day) continue;
    else if (e.op === "set_day") {
      if (str(e.label, 30)) day.label = str(e.label, 30);
      if (str(e.city, 80)) day.city = str(e.city, 80);
      if (str(e.base, 160)) day.base = str(e.base, 160);
    } else if (e.op === "set_item" && item?.title && day.slots[index - 1]) day.slots[index - 1] = { item, changed: true, removed: false };
    else if (e.op === "remove_item" && day.slots[index - 1]) day.slots[index - 1].removed = true;
    else if (e.op === "add_item" && item?.title && index >= 0 && index <= day.slots.length)
      day.inserts.set(index, [...(day.inserts.get(index) ?? []), item]);
    else continue;
    count++;
  }
  const changed: string[] = [];
  const next = days.map(({ slots, inserts, ...d }, di) => {
    const items: PlanItem[] = [];
    const push = (item: PlanItem, isChanged: boolean) => {
      if (isChanged) changed.push(`${di}-${items.length}`);
      items.push(item);
    };
    for (const added of inserts.get(0) ?? []) push(added, true);
    slots.forEach((slot, si) => {
      if (!slot.removed) push(slot.item, slot.changed);
      for (const added of inserts.get(si + 1) ?? []) push(added, true);
    });
    return { ...d, items: items.slice(0, 12) };
  });
  return { plan: { overview, days: next, bookings, tips, sources: plan.sources }, changed, count };
}

/** The plan without its chat and undo, e.g. to keep as the undo step. */
export const planCore = ({ overview, days, bookings, tips, sources }: PlanCore): PlanCore => ({ overview, days, bookings, tips, sources });
