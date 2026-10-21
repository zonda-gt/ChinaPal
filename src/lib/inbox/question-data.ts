// Questions list: what we still need to ask the traveller (owner "customer")
// or check ourselves (owner "team"). Found by the trip brief (missing basics),
// the trip plan (blockers met while planning) or added by the team. Ticked
// customer questions go into the next AI draft and become "asked" when it is sent.
export type QuestionOwner = "customer" | "team";
export type QuestionSource = "brief" | "plan" | "team";
export type QuestionStatus = "open" | "asked" | "answered" | "dismissed";
export type TripQuestion = {
  id: string;
  text: string;
  why: string;
  owner: QuestionOwner;
  urgent: boolean;
  source: QuestionSource;
  status: QuestionStatus;
  include: boolean; // ticked: the next draft asks it
  answer: string;
  draft_id: string | null; // the draft that asks it, until that draft is sent
  created_by: string;
  created_at: string;
  updated_at: string;
};
export type NewQuestion = { text: string; why: string; owner: QuestionOwner; urgent: boolean };

/** The JSON schema for questions found by the AI (brief or plan). */
export const NEW_QUESTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 300 },
    why: { type: "string", maxLength: 200 },
    owner: { type: "string", enum: ["customer", "team"] },
    urgent: { type: "boolean" },
  },
  required: ["text", "why", "owner", "urgent"],
} as const;

const normal = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

/** AI questions, validated, without ones the list already has (in any status). */
export function freshQuestions(raw: unknown, existing: Pick<TripQuestion, "text">[], max = 8): NewQuestion[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set(existing.map((q) => normal(q.text)));
  const out: NewQuestion[] = [];
  for (const q of raw.slice(0, max)) {
    const v = (q ?? {}) as Record<string, unknown>;
    if (typeof v.text !== "string" || (v.owner !== "customer" && v.owner !== "team")) continue;
    const text = v.text.trim().slice(0, 300);
    const key = normal(text);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({
      text,
      why: typeof v.why === "string" ? v.why.trim().slice(0, 200) : "",
      owner: v.owner,
      urgent: v.urgent === true,
    });
  }
  return out;
}

/** The list as the AI sees it: short ids it can refer back to, never database ids. */
export function questionsForPrompt(questions: TripQuestion[]) {
  const ids = new Map<string, string>();
  const list = questions
    .filter((q) => q.status !== "dismissed")
    .map((q, i) => {
      const ref = `q${i + 1}`;
      ids.set(ref, q.id);
      return { ref, text: q.text, owner: q.owner, status: q.status, ...(q.answer ? { answer: q.answer } : {}) };
    });
  return { list, ids };
}

/** Customer questions the next draft should ask, most urgent first. */
export function questionsToAsk(questions: TripQuestion[]) {
  return questions
    .filter((q) => q.owner === "customer" && q.status === "open" && q.include)
    .sort((a, b) => Number(b.urgent) - Number(a.urgent))
    .slice(0, 6);
}
