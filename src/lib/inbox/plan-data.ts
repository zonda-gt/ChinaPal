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
export type TripPlan = {
  overview: string;
  days: PlanDay[];
  bookings: PlanBooking[];
  tips: string[];
  sources: string[]; // every page the research opened
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

const text = (max: number) => ({ type: "string", maxLength: max });
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

/**
 * The model's plan, checked. Item sources must be pages the research actually
 * opened; anything else is dropped rather than shown as evidence.
 */
export function parsePlan(raw: string, opened: string[]): TripPlan {
  const data = JSON.parse(raw);
  const str = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");
  const arr = (value: unknown, max: number) => (Array.isArray(value) ? (value.slice(0, max) as Record<string, unknown>[]) : []);
  const pages = [...new Set(opened.filter((u) => pageKey(u)))];
  const known = new Map(pages.map((u) => [pageKey(u), u]));
  if (!Array.isArray(data.days)) throw Error("Invalid plan");
  const days = arr(data.days, 31).map((d) => {
    const date = str(d.date, 10);
    return {
      date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "",
      label: str(d.label, 30),
      city: str(d.city, 80),
      base: str(d.base, 160),
      items: arr(d.items, 12)
        .map((i) => {
          const kind: PlanKind = i.kind === "fixed" || i.kind === "option" ? i.kind : "suggested";
          const source = known.get(pageKey(str(i.source, 400))) ?? "";
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
            source,
          };
        })
        .filter((i) => i.title),
    };
  });
  const statuses = ["to_book", "customer_books", "booked", "no_booking"];
  return {
    overview: str(data.overview, 800),
    days,
    bookings: arr(data.bookings, 15)
      .map((b) => ({
        item: str(b.item, 140),
        when: str(b.when, 80),
        how: str(b.how, 300),
        deadline: str(b.deadline, 120),
        status: (statuses.includes(b.status as string) ? b.status : "to_book") as BookingStatus,
      }))
      .filter((b) => b.item),
    tips: (Array.isArray(data.tips) ? data.tips : []).slice(0, 8).map((t: unknown) => str(t, 300)).filter(Boolean),
    sources: pages.slice(0, 200),
  };
}
