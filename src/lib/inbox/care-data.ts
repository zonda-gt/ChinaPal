// Care: looking after a traveller close to and during their trip. The days come
// from the Plan tab (or the brief's day-by-day list when there is no plan) plus
// appointments the team adds; the reminders are worked out from those days, and
// only their status is stored.
import type { TripBrief } from "./brief-data";
import type { PlanCore } from "./plan-data";

export type CareStatus = "todo" | "drafted" | "sent" | "skipped";
export type CareItem = {
  time: string;
  title: string;
  detail: string;
  important: boolean; // a fixed time: train, flight, check-in, booking or appointment
  place: string; // Chinese name and address
  eventId?: string; // set on an appointment the team added
};
export type CareDay = { date: string; label: string; city: string; base: string; items: CareItem[] };
export type CareEvent = { id: string; date: string; time: string; title: string; detail: string };
export type CareRecord = { key: string; status: CareStatus; draft_id: string | null; updated_by: string; updated_at: string };
export type ReminderKind = "prep" | "evening" | "landed" | "midtrip" | "after";
export type Reminder = {
  key: string;
  kind: ReminderKind;
  title: string;
  date: string; // the day the reminder is about
  due: string; // ISO time to send it
  until: string; // the last China date it is still worth sending
  important: boolean;
  summary: string[];
  status: CareStatus;
  updated_by: string;
};
export type TripStage =
  | { stage: "none" }
  | { stage: "before"; days: number; start: string }
  | { stage: "during"; day: number; of: number; today: CareDay; next: (CareItem & { date: string }) | null }
  | { stage: "after"; end: string };
export type KeyInfo = { hotels: string[]; arrival: string; departure: string };
export type CareView = {
  days: CareDay[];
  reminders: Reminder[];
  trip: TripStage;
  info: KeyInfo;
  events: CareEvent[];
  saved: boolean; // false until the care table exists
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SHANGHAI = "+08:00";

/** Today's date in China. */
export function chinaDate(now = Date.now()) {
  return new Date(now + 8 * 3600000).toISOString().slice(0, 10);
}
/** A China wall-clock time on a date, as an ISO instant. */
export function chinaTime(date: string, time: string) {
  return new Date(`${date}T${time}:00${SHANGHAI}`).toISOString();
}
export function addDays(date: string, n: number) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10);
}
function minutes(time: string) {
  const m = time.match(/(\d{1,2}):(\d{2})/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}
function firstSentence(text: string) {
  const flat = text.replace(/\s+/g, " ").trim();
  const end = flat.search(/[.!?](\s|$)/);
  return (end >= 0 ? flat.slice(0, end + 1) : flat).slice(0, 200);
}

/** The trip's days, from the plan when there is one, else from the brief, with the team's appointments added. */
export function careDays(plan: PlanCore | null, brief: TripBrief | null, events: CareEvent[]): CareDay[] {
  const days: CareDay[] = plan?.days.length
    ? plan.days
        .filter((d) => ISO_DATE.test(d.date))
        .map((d) => ({
          date: d.date,
          label: d.label,
          city: d.city,
          base: d.base,
          items: d.items.map((i) => ({
            time: i.time,
            title: i.title,
            detail: firstSentence(i.detail),
            important: i.kind === "fixed",
            place: [i.place_cn, i.address_cn].filter(Boolean).join(" · "),
          })),
        }))
    : (brief?.days ?? [])
        .filter((d) => ISO_DATE.test(d.date))
        .map((d) => ({
          date: d.date,
          label: d.label,
          city: d.city,
          base: "",
          items: d.items.map((i) => ({ time: i.time, title: i.text, detail: "", important: i.booked, place: "" })),
        }));
  const byDate = new Map(days.map((d) => [d.date, d]));
  for (const e of events) {
    if (!ISO_DATE.test(e.date)) continue;
    let day = byDate.get(e.date);
    if (!day) {
      day = { date: e.date, label: "", city: "", base: "", items: [] };
      byDate.set(e.date, day);
      days.push(day);
    }
    const item: CareItem = { time: e.time, title: e.title, detail: e.detail, important: true, place: "", eventId: e.id };
    // Slot the appointment in by time; untimed ones go last.
    const at = minutes(e.time);
    const index = at === null ? -1 : day.items.findIndex((i) => (minutes(i.time) ?? -1) > at);
    if (index < 0) day.items.push(item);
    else day.items.splice(index, 0, item);
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

function summary(day: CareDay) {
  const lines = day.items.map((i) => `${i.time ? `${i.time} ` : ""}${i.title}`);
  const important = day.items.filter((i) => i.important).map((i) => `${i.time ? `${i.time} ` : ""}${i.title}`);
  return (important.length ? important : lines).slice(0, 6);
}

/** Every reminder for the trip, oldest first, with its saved status. */
export function reminders(days: CareDay[], records: CareRecord[]): Reminder[] {
  if (!days.length) return [];
  const start = days[0].date,
    end = days.at(-1)!.date;
  const saved = new Map(records.map((r) => [r.key, r]));
  const list: Omit<Reminder, "status" | "updated_by">[] = [
    {
      key: "prep",
      kind: "prep",
      title: "Before they fly: getting ready",
      date: start,
      due: chinaTime(addDays(start, -3), "19:00"),
      until: addDays(start, -1),
      important: false,
      summary: ["Passports, eSIM, Alipay or WeChat Pay", "Getting from the airport to the hotel"],
    },
    // The first evening's check-in also covers day 2, so there is one message that night.
    ...days.filter((_, i) => i !== 1).map((d, i, kept) => ({
      key: `evening:${d.date}`,
      kind: "evening" as const,
      title: i === 0 ? "Night before arrival" : i === kept.length - 1 ? "Night before the last day" : `Night before ${d.label || d.date}`,
      date: d.date,
      due: chinaTime(addDays(d.date, -1), "19:00"),
      // A missed reminder still helps that morning, except on arrival day.
      until: i === 0 ? addDays(d.date, -1) : d.date,
      important: d.items.some((x) => x.important),
      summary: summary(d),
    })),
    {
      key: "landed",
      kind: "landed",
      title: days[1] ? "First evening: landed OK? and tomorrow" : "First evening: landed OK?",
      date: start,
      due: chinaTime(start, "19:00"),
      until: start,
      important: !!days[1]?.items.some((x) => x.important),
      summary: ["Did they arrive OK, is the hotel fine", ...(days[1] ? summary(days[1]).map((l) => `Tomorrow: ${l}`) : [])],
    },
    ...(days.length >= 4
      ? [
          {
            key: "midtrip",
            kind: "midtrip" as const,
            title: "Mid-trip check-in",
            date: days[Math.floor(days.length / 2)].date,
            due: chinaTime(days[Math.floor(days.length / 2)].date, "12:00"),
            until: days[Math.floor(days.length / 2)].date,
            important: false,
            summary: ["How is it going, anything to change for the rest of the trip"],
          },
        ]
      : []),
    {
      key: "after",
      kind: "after",
      title: "After the trip: how did it go?",
      date: addDays(end, 1),
      due: chinaTime(addDays(end, 1), "12:00"),
      until: addDays(end, 3),
      important: false,
      summary: ["Thank them and ask for feedback"],
    },
  ];
  return list
    .map((r) => ({ ...r, status: saved.get(r.key)?.status ?? "todo", updated_by: saved.get(r.key)?.updated_by ?? "" }))
    .sort((a, b) => a.due.localeCompare(b.due));
}

/** Waiting to be sent now: due by tonight (China time) and not yet out of date. */
export function isDue(r: Reminder, now = Date.now()) {
  const today = chinaDate(now);
  return r.status === "todo" && r.due <= chinaTime(addDays(today, 1), "00:00") && r.until >= today;
}
/** Due earlier and never sent, and too late to be useful now. */
export function isMissed(r: Reminder, now = Date.now()) {
  return r.status === "todo" && r.until < chinaDate(now);
}

export function tripStage(days: CareDay[], now = Date.now()): TripStage {
  if (!days.length) return { stage: "none" };
  const today = chinaDate(now),
    start = days[0].date,
    end = days.at(-1)!.date;
  if (today < start) return { stage: "before", days: Math.round((Date.parse(start) - Date.parse(today)) / 86400000), start };
  if (today > end) return { stage: "after", end };
  const index = days.findIndex((d) => d.date >= today);
  const time = new Date(now + 8 * 3600000).toISOString().slice(11, 16);
  // The next fixed-time item from now on, today or later.
  let next: (CareItem & { date: string }) | null = null;
  for (const d of days.slice(index)) {
    const item = d.items.find((i) => i.important && (d.date > today || (minutes(i.time) ?? 24 * 60) >= (minutes(time) ?? 0)));
    if (item) {
      next = { ...item, date: d.date };
      break;
    }
  }
  const day = days[index];
  return {
    stage: "during",
    day: Math.round((Date.parse(day.date) - Date.parse(start)) / 86400000) + 1,
    of: Math.round((Date.parse(end) - Date.parse(start)) / 86400000) + 1,
    today: day.date === today ? day : { date: today, label: "", city: "", base: "", items: [] },
    next,
  };
}

export function keyInfo(days: CareDay[]): KeyInfo {
  const hotels = [...new Set(days.map((d) => d.base).filter(Boolean))];
  const first = days[0]?.items.find((i) => i.important);
  const last = days.at(-1)?.items.filter((i) => i.important).at(-1);
  const line = (d: CareDay | undefined, i: CareItem | undefined) => (d && i ? `${d.label || d.date} · ${i.time ? `${i.time} ` : ""}${i.title}` : "");
  return { hotels, arrival: line(days[0], first), departure: days.length > 1 ? line(days.at(-1), last) : "" };
}

function dayItems(day: CareDay) {
  return day.items
    .map((i) => `- ${i.time ? `${i.time} ` : ""}${i.title}${i.place ? ` (${i.place})` : ""}${i.eventId && i.detail ? `: ${i.detail}` : ""}`)
    .join("\n");
}

/** The staff instruction that asks the reply drafter for this reminder. */
export function reminderInstruction(r: Reminder, days: CareDay[]) {
  const proactive =
    "This is a message we send first, not a reply: don't answer older messages unless something is still open. Keep it short for Instagram and end with an easy question so they reply.";
  const day = days.find((d) => d.date === r.date);
  const items = day ? dayItems(day) : "";
  const text =
    r.kind === "evening"
      ? `Write a fresh reminder for tomorrow, ${day?.label || r.date} (${r.date}). Lead with anything at a fixed time (trains, flights, check-ins, bookings, appointments) and say how to do it: for trains, the station in English and Chinese, arrive 30–45 minutes early, their passport is the ticket at the gates, which close 5 minutes before departure; for appointments and restaurants, the Chinese address to show the driver and when to leave. Then the rest of the day in a line or two. ${proactive}\nTomorrow:\n${items}`
      : r.kind === "prep"
        ? `Write a fresh pre-trip message: they arrive on ${r.date}. A short checklist: passports, mobile data (eSIM), Alipay or WeChat Pay set up with their card, and how they get from the airport to their first hotel${days[0]?.base ? ` (${days[0].base})` : ""}. Mention anything still to book. ${proactive}`
        : r.kind === "landed"
          ? `Write a fresh check-in for their first evening in China: did they arrive OK, is the hotel fine, do they need anything.${
              days[1]
                ? ` Then a short reminder for tomorrow, ${days[1].label || days[1].date}: anything at a fixed time first, with how to get there. ${proactive}\nTomorrow:\n${dayItems(days[1])}`
                : ` ${proactive}`
            }`
          : r.kind === "midtrip"
            ? `Write a fresh mid-trip check-in: how is the trip going, anything they'd like to change, and a one-line look at the next two days. ${proactive}`
            : `Write a fresh message for after the trip: thank them, hope they got home well, and ask how it went and what we could do better. ${proactive}`;
  return text.slice(0, 2000);
}
