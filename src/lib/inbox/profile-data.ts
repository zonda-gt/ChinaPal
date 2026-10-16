import type { Message } from "./types";

export type ProfileStatus = "confirmed" | "inferred" | "suggested" | "unknown";
export type ProfileSource = {
  time: string;
  role: "customer" | "team";
  text: string;
};
export type ProfileFact = {
  value: string;
  status: ProfileStatus;
  sources: ProfileSource[];
};
export type TravelProfile = {
  summary: ProfileFact;
  arrival: ProfileFact;
  departure: ProfileFact;
  party: ProfileFact;
  cities: { city: string; stay: ProfileFact }[];
  interests: ProfileFact[];
  preferences: ProfileFact[];
  logistics: ProfileFact[];
  questions: string[];
};
export type ProfileCoverage = {
  count: number;
  partial: boolean;
  attachments: boolean;
  firstAt: string | null;
  lastAt: string | null;
};
export type SavedProfile = {
  model: string;
  usage: { input_tokens: number; cached_input_tokens: number; output_tokens: number };
  profile: TravelProfile;
  fingerprint: string;
  generated_at: string;
  coverage: ProfileCoverage;
};
export type ProfileResponse = {
  sourceFingerprint: string;
  saved: SavedProfile | null;
  stale: boolean;
  coverage: ProfileCoverage;
};
const string = { type: "string", maxLength: 500 };
const fact = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: string,
    status: {
      type: "string",
      enum: ["confirmed", "inferred", "suggested", "unknown"],
    },
    sources: {
      type: "array",
      maxItems: 3,
      items: { type: "integer", minimum: 1 },
    },
  },
  required: ["value", "status", "sources"],
};
const facts = { type: "array", maxItems: 8, items: fact };
export const PROFILE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: fact,
    arrival: fact,
    departure: fact,
    party: fact,
    cities: {
      type: "array",
      maxItems: 12,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { city: string, stay: fact },
        required: ["city", "stay"],
      },
    },
    interests: facts,
    preferences: facts,
    logistics: facts,
    questions: { type: "array", maxItems: 5, items: string },
  },
  required: [
    "summary",
    "arrival",
    "departure",
    "party",
    "cities",
    "interests",
    "preferences",
    "logistics",
    "questions",
  ],
};

// Sources are resolved against this conversation, never trusted model quotations.
export function parseProfile(raw: string, messages: Message[]): TravelProfile {
  const data = JSON.parse(raw);
  function text(value: unknown): string {
    if (typeof value !== "string" || value.length > 500)
      throw Error("Invalid profile text");
    return value;
  }
  function parseFact(value: {
    value: unknown;
    status: ProfileStatus;
    sources: number[];
  }): ProfileFact {
    if (
      !value ||
      !["confirmed", "inferred", "suggested", "unknown"].includes(
        value.status,
      ) ||
      !Array.isArray(value.sources)
    )
      throw Error("Invalid profile fact");
    const label = text(value.value);
    const sources = [...new Set(value.sources)].slice(0, 3).map((index) => {
      if (!Number.isInteger(index)) throw Error("Invalid source");
      const message = messages[index - 1];
      if (!message || message.deleted || !message.text.trim())
        throw Error("Invalid source");
      return {
        time: message.sent_at,
        role:
          message.direction === "inbound"
            ? ("customer" as const)
            : ("team" as const),
        text: message.text.slice(0, 600),
      };
    });
    if (value.status === "unknown" || !sources.length)
      return { value: "Not mentioned", status: "unknown", sources: [] };
    return {
      value: label,
      status:
        value.status === "confirmed" && sources.every((s) => s.role === "team")
          ? "suggested"
          : value.status,
      sources,
    };
  }
  function list(value: unknown, max: number): unknown[] {
    if (!Array.isArray(value) || value.length > max)
      throw Error("Invalid profile list");
    return value;
  }
  return {
    summary: parseFact(data.summary),
    arrival: parseFact(data.arrival),
    departure: parseFact(data.departure),
    party: parseFact(data.party),
    cities: list(data.cities, 12).map((value) => {
      const city = value as {
        city: string;
        stay: Parameters<typeof parseFact>[0];
      };
      return { city: text(city.city), stay: parseFact(city.stay) };
    }),
    interests: list(data.interests, 8).map((v) =>
      parseFact(v as Parameters<typeof parseFact>[0]),
    ),
    preferences: list(data.preferences, 8).map((v) =>
      parseFact(v as Parameters<typeof parseFact>[0]),
    ),
    logistics: list(data.logistics, 8).map((v) =>
      parseFact(v as Parameters<typeof parseFact>[0]),
    ),
    questions: list(data.questions, 5).map(text),
  };
}

export function selectProfileHistory(
  messages: Message[],
  historyComplete: boolean,
) {
  // A large bounded text window, independent of the chat's visible message limit.
  const selected: Message[] = [];
  let chars = 0;
  const usable = messages.filter((m) => !m.deleted && m.text.trim());
  for (const message of usable.slice().reverse()) {
    if (chars + message.text.length > 120000) break;
    selected.unshift(message);
    chars += message.text.length;
  }
  return {
    messages: selected,
    coverage: {
      count: selected.length,
      partial:
        !historyComplete ||
        selected.length < usable.length ||
        messages.length >= 1000,
      attachments: messages.some((m) => !m.deleted && m.attachments.length > 0),
      firstAt: selected[0]?.sent_at ?? null,
      lastAt: selected.at(-1)?.sent_at ?? null,
    },
  };
}
