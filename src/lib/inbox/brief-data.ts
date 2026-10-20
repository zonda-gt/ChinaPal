// Trip brief: what the operator needs at a glance, built by AI from one
// conversation and corrected by the team. Every AI statement points at the
// messages it came from; team edits are kept across regenerations.
import type { Message } from "./types";
import type { ProfileCoverage, ProfileSource } from "./profile-data";

export type Certainty = "confirmed" | "inferred" | "suggested";
// editId marks an item the team added, so it can be edited or removed again.
export type BriefFact = { text: string; certainty: Certainty; sources: ProfileSource[]; editId?: string };
export type RouteStop = BriefFact & { place: string; dates: string; booked: boolean };
export type RequestStatus =
  | "requested"
  | "proposed"
  | "waiting_customer"
  | "booked"
  | "done"
  | "customer_handles"
  | "declined";
export type BriefRequest = BriefFact & { item: string; status: RequestStatus; next: string };
export type Deadline = BriefFact & { by: string };
export type MustKnow = BriefFact & { critical: boolean };
export type Question = { text: string; owner: "customer" | "team"; editId?: string };
export type Idea = { text: string; why: string; editId?: string };
export type Stage = "lead" | "quoted" | "paid" | "planning" | "in_trip" | "done" | "not_a_lead";
export const STAGES: Record<Stage, string> = {
  lead: "Lead",
  quoted: "Quoted",
  paid: "Paid",
  planning: "Planning",
  in_trip: "In trip",
  done: "Done",
  not_a_lead: "Not a lead",
};
export type TripBrief = {
  name: string;
  language: string;
  stage: { value: Stage; reason: string };
  need: BriefFact | null;
  dates: BriefFact | null;
  start: string; // YYYY-MM-DD when the first day in China is known with its year
  party: BriefFact | null;
  paid: BriefFact | null;
  route: RouteStop[];
  requests: BriefRequest[];
  deadlines: Deadline[];
  mustKnow: MustKnow[];
  preferences: BriefFact[];
  questions: Question[];
  ideas: Idea[];
};

// Team corrections. Single fields are replaced; list items are added or hidden.
export type BriefSection =
  | "need"
  | "dates"
  | "party"
  | "paid"
  | "stage"
  | "route"
  | "requests"
  | "deadlines"
  | "mustKnow"
  | "preferences"
  | "questions"
  | "ideas";
export const SINGLE_SECTIONS = ["need", "dates", "party", "paid", "stage"] as const;
export type BriefEdit = {
  id: string;
  section: BriefSection;
  // "set" replaces a single field or adds a team item; "hide" removes an AI item.
  action: "set" | "hide";
  text: string;
  target?: string; // the AI text this edit replaces or hides
  by: string;
  at: string;
};
export type SavedBrief = {
  brief: TripBrief | null;
  edits: BriefEdit[];
  model: string | null;
  usage: { input_tokens: number; cached_input_tokens: number; output_tokens: number } | null;
  fingerprint: string | null;
  generated_at: string | null;
  coverage: ProfileCoverage | null;
};
export type BriefResponse = { saved: SavedBrief; stale: boolean; coverage: ProfileCoverage };

const text = (max = 400) => ({ type: "string", maxLength: max });
const certainty = { type: "string", enum: ["confirmed", "inferred", "suggested"] };
const sources = { type: "array", maxItems: 3, items: { type: "integer", minimum: 1 } };
const fact = (extra: Record<string, unknown> = {}) => ({
  type: "object",
  additionalProperties: false,
  properties: { text: text(), certainty, sources, ...extra },
  required: ["text", "certainty", "sources", ...Object.keys(extra)],
});
const optional = (schema: object) => ({ anyOf: [schema, { type: "null" }] });
const list = (items: object, max: number) => ({ type: "array", maxItems: max, items });
export const BRIEF_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: text(80),
    language: text(40),
    stage: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "string", enum: Object.keys(STAGES) }, reason: text(200) },
      required: ["value", "reason"],
    },
    need: optional(fact()),
    dates: optional(fact()),
    start: text(10),
    party: optional(fact()),
    paid: optional(fact()),
    route: list(fact({ place: text(80), dates: text(80), booked: { type: "boolean" } }), 12),
    requests: list(
      fact({
        item: text(80),
        status: {
          type: "string",
          enum: ["requested", "proposed", "waiting_customer", "booked", "done", "customer_handles", "declined"],
        },
        next: text(200),
      }),
      10,
    ),
    deadlines: list(fact({ by: text(80) }), 5),
    mustKnow: list(fact({ critical: { type: "boolean" } }), 6),
    preferences: list(fact(), 8),
    questions: list(
      {
        type: "object",
        additionalProperties: false,
        properties: { text: text(300), owner: { type: "string", enum: ["customer", "team"] } },
        required: ["text", "owner"],
      },
      6,
    ),
    ideas: list(
      {
        type: "object",
        additionalProperties: false,
        properties: { text: text(300), why: text(200) },
        required: ["text", "why"],
      },
      4,
    ),
  },
  required: [
    "name",
    "language",
    "stage",
    "need",
    "dates",
    "start",
    "party",
    "paid",
    "route",
    "requests",
    "deadlines",
    "mustKnow",
    "preferences",
    "questions",
    "ideas",
  ],
};

type RawFact = { text: unknown; certainty: unknown; sources: unknown } & Record<string, unknown>;

// Sources are resolved against this conversation, never trusted model quotations.
// Facts without a real source are dropped instead of shown as if they were known.
export function parseBrief(raw: string, messages: Message[]): TripBrief {
  const data = JSON.parse(raw);
  const str = (value: unknown, max = 400) => {
    if (typeof value !== "string" || value.length > max) throw Error("Invalid brief text");
    return value.trim();
  };
  const arr = (value: unknown, max: number) => {
    if (!Array.isArray(value) || value.length > max) throw Error("Invalid brief list");
    return value as RawFact[];
  };
  function parseFact(value: RawFact | null): BriefFact | null {
    if (value === null) return null;
    if (!["confirmed", "inferred", "suggested"].includes(value.certainty as string) || !Array.isArray(value.sources))
      throw Error("Invalid brief fact");
    const found = [...new Set(value.sources as number[])].slice(0, 3).map((index) => {
      const message = Number.isInteger(index) ? messages[index - 1] : undefined;
      if (!message || message.deleted || !message.text.trim()) throw Error("Invalid source");
      return {
        time: message.sent_at,
        role: message.direction === "inbound" ? ("customer" as const) : ("team" as const),
        text: message.text.slice(0, 600),
      };
    });
    const body = str(value.text);
    if (!found.length || !body) return null;
    // A plan only the team has mentioned is a suggestion, whatever the model says.
    const certainty =
      value.certainty === "confirmed" && found.every((s) => s.role === "team")
        ? "suggested"
        : (value.certainty as Certainty);
    return { text: body, certainty, sources: found };
  }
  const facts = <T>(value: unknown, max: number, extra: (v: RawFact) => T) =>
    arr(value, max).flatMap((v) => {
      const f = parseFact(v);
      return f ? [{ ...f, ...extra(v) }] : [];
    });
  const stage = data.stage?.value as Stage;
  if (!(stage in STAGES)) throw Error("Invalid stage");
  const start = str(data.start, 10);
  return {
    name: str(data.name, 80),
    language: str(data.language, 40),
    stage: { value: stage, reason: str(data.stage.reason, 200) },
    need: parseFact(data.need),
    dates: parseFact(data.dates),
    start: /^\d{4}-\d{2}-\d{2}$/.test(start) ? start : "",
    party: parseFact(data.party),
    paid: parseFact(data.paid),
    route: facts(data.route, 12, (v) => ({ place: str(v.place, 80), dates: str(v.dates, 80), booked: v.booked === true })),
    requests: facts(data.requests, 10, (v) => {
      const status = v.status as RequestStatus;
      if (!["requested", "proposed", "waiting_customer", "booked", "done", "customer_handles", "declined"].includes(status))
        throw Error("Invalid request status");
      return { item: str(v.item, 80), status, next: str(v.next, 200) };
    }),
    deadlines: facts(data.deadlines, 5, (v) => ({ by: str(v.by, 80) })),
    mustKnow: facts(data.mustKnow, 6, (v) => ({ critical: v.critical === true })),
    preferences: facts(data.preferences, 8, () => ({})),
    questions: arr(data.questions, 6).map((q) => {
      const owner = (q as Record<string, unknown>).owner;
      if (owner !== "customer" && owner !== "team") throw Error("Invalid question");
      return { text: str(q.text, 300), owner };
    }),
    ideas: arr(data.ideas, 4).map((i) => ({ text: str(i.text, 300), why: str(i.why, 200) })),
  };
}

/** The text a section item is identified by when the team hides or replaces it. */
export function itemText(section: BriefSection, item: unknown): string {
  if (!item || typeof item !== "object") return "";
  const v = item as Record<string, unknown>;
  if (section === "route") return `${v.place} · ${v.dates}`;
  if (section === "requests") return String(v.item);
  return String(v.text ?? "");
}

/** Team edits applied on top of the AI brief. */
export function applyEdits(brief: TripBrief, edits: BriefEdit[]) {
  const hidden = (section: BriefSection) =>
    new Set(edits.filter((e) => e.section === section && e.target).map((e) => e.target));
  // A "set" with a target replaces that AI item; without one it adds a team item.
  const added = (section: BriefSection) => edits.filter((e) => e.section === section && e.action === "set");
  const team = (t: string): BriefFact => ({ text: t, certainty: "confirmed", sources: [] });
  const out: TripBrief & { teamSet: Partial<Record<BriefSection, string>> } = { ...brief, teamSet: {} };
  for (const section of SINGLE_SECTIONS) {
    const edit = edits.filter((e) => e.section === section && e.action === "set").at(-1);
    if (!edit) continue;
    out.teamSet[section] = edit.at;
    if (section === "stage") {
      if (edit.text in STAGES) out.stage = { value: edit.text as Stage, reason: "Set by the team" };
    } else out[section] = edit.text.trim() ? team(edit.text) : null;
  }
  const merge = <T>(section: BriefSection, items: T[], make: (t: string) => T) => [
    ...items.filter((item) => !hidden(section).has(itemText(section, item))),
    ...added(section).map((e) => ({ ...make(e.text), editId: e.id })),
  ];
  out.route = merge("route", brief.route, (t) => ({ ...team(t), place: t, dates: "", booked: false }));
  out.requests = merge("requests", brief.requests, (t) => ({ ...team(t), item: t, status: "requested" as const, next: "" }));
  out.deadlines = merge("deadlines", brief.deadlines, (t) => ({ ...team(t), by: "" }));
  out.mustKnow = merge("mustKnow", brief.mustKnow, (t) => ({ ...team(t), critical: true }));
  out.preferences = merge("preferences", brief.preferences, team);
  out.questions = merge("questions", brief.questions, (t) => ({ text: t, owner: "customer" as const }));
  out.ideas = merge("ideas", brief.ideas, (t) => ({ text: t, why: "" }));
  return out;
}

export const EMPTY_BRIEF: TripBrief = {
  name: "",
  language: "",
  stage: { value: "lead", reason: "" },
  need: null,
  dates: null,
  start: "",
  party: null,
  paid: null,
  route: [],
  requests: [],
  deadlines: [],
  mustKnow: [],
  preferences: [],
  questions: [],
  ideas: [],
};
