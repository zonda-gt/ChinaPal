// Second pass (evaluation only): a separate request that edits a finished draft
// the way the team edits before sending. It sees the same conversation as the
// draft, plus a few real before/after pairs from other customers, and may only
// cut, reorder and rephrase. Topics it cuts go to the warnings as "Later:" items.
import OpenAI from "openai";
import { buildPromptText, fitMessages, type PromptContext } from "../../src/lib/inbox/prompt";
import type { DraftResult } from "../../src/lib/inbox/draft-core";
import { compareWithSent } from "./text-metrics";

export const EDITOR_VERSION = "editor-v1";

export type EditExample = { conversation: string; customer: string[]; draft: string[]; sent: string[] };

const EDITOR_INSTRUCTIONS = `You are the ChinaPal team member about to send an AI-drafted Instagram reply to a traveller. ChinaPal is a small Shanghai-based team helping international travellers with independent trips around China. Edit the draft the way the team does before pressing send, then return it.

What the team changes:
- Focus. Keep to the topic being discussed right now and put the answer to their question first. Cut paragraphs and questions about other topics that can wait (the next booking, another decision, later details). Add each cut topic to the warnings as "Later: <what to raise or ask>".
- Customer-facing caveats. Cut disclaimers such as "not confirmed yet", "these are starting points, not confirmed rates", "a video doesn't guarantee it". Keep one only when the customer might otherwise act on something unconfirmed (pay, travel, skip booking); move the rest to the warnings.
- Repeated service terms. Cut the price, the service description, "no markup" and "we'll confirm terms before booking" when the conversation has already covered them or this reply is not arranging a booking.
- Doing too much. If the customer asked for something the team still has to prepare (a quote, a full plan, a supplier check), or one short question is all the next step needs, cut the draft down to that: what the team will send, or the one question.
- Questions. Keep at most one or two, only what the next step needs, unless the staff instruction asks for more.
- Voice. Plain, warm and short, like a person chatting. Fix awkward or stiff phrasing.

Rules:
- Never add facts, names, prices, times, links or promises that are not in the draft, the conversation or the staff facts. You may add a short natural touch (thanks, a greeting by name already used in the chat) when it fits.
- Keep everything the staff facts or the staff instruction asked to be said, and keep specific details the customer needs (Chinese names, addresses, times, prices).
- If the draft is already right, return it unchanged. Doing nothing is a good result.
- Keep the draft's warnings and add your "Later:" items.
- messages: 1 to 3 Instagram messages, each under 1,000 characters, in sending order.
- changes: one short line saying what you changed, or "No changes".`;

const EDITOR_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    messages: { type: "array", items: { type: "string", maxLength: 1000 } },
    warnings: { type: "array", items: { type: "string" } },
    changes: { type: "string" },
  },
  required: ["messages", "warnings", "changes"],
} as const;

/**
 * Real drafts the team edited before sending (not sent as is, not rewritten),
 * one per conversation and never from the conversation being edited.
 */
export function pickExamples(
  cases: { conversation: string; context: PromptContext; reference: string[]; live?: { messages: string[] } }[],
  exclude: string,
  count = 5,
): EditExample[] {
  const seen = new Set([exclude]);
  const out: EditExample[] = [];
  const edited = cases
    .filter((c) => c.live?.messages.length && c.reference.length)
    .map((c) => ({ c, m: compareWithSent(c.live!.messages, c.reference) }))
    .filter(({ m }) => m.fromDraft >= 0.5 && m.kept < 0.9)
    .sort((a, b) => a.m.kept - b.m.kept);
  for (const { c } of edited) {
    if (out.length >= count || seen.has(c.conversation)) continue;
    seen.add(c.conversation);
    const lastTeam = c.context.messages.findLastIndex((m) => m.direction === "outbound");
    const customer = c.context.messages
      .slice(lastTeam + 1)
      .filter((m) => m.direction === "inbound" && m.text.trim())
      .slice(-3)
      .map((m) => m.text.trim());
    out.push({ conversation: c.conversation, customer, draft: c.live!.messages, sent: c.reference });
  }
  return out;
}

function examplesText(examples: EditExample[]) {
  if (!examples.length) return "";
  const block = (label: string, parts: string[]) =>
    `${label}:\n${parts.map((p, i) => (parts.length > 1 ? `[message ${i + 1}] ${p}` : p)).join("\n")}`;
  return `\n\n# Real examples: the AI's draft and what the team actually sent (other customers)\n${examples
    .map(
      (e, i) =>
        `## Example ${i + 1}\n${block("Customer's latest messages", e.customer.length ? e.customer : ["(see conversation)"])}\n\n${block("Draft", e.draft)}\n\n${block("Sent", e.sent)}`,
    )
    .join("\n\n")}`;
}

export async function runEditor(
  client: OpenAI,
  ctx: PromptContext,
  draft: Pick<DraftResult, "messages" | "warnings">,
  examples: EditExample[],
  options: { model?: string; reasoning?: "low" | "medium" | "high" } = {},
): Promise<DraftResult & { changes: string }> {
  const model = options.model || process.env.INBOX_AI_MODEL || "gpt-6.1-sol";
  const reasoning = options.reasoning || "low";
  // The draft box's earlier text would read as a second draft.
  const prompt = buildPromptText({ ...ctx, currentDraft: undefined });
  const text = `${prompt.text}\n\nDraft to edit:\n${draft.messages
    .map((m, i) => `[message ${i + 1}]\n${m}`)
    .join("\n\n")}\n\nDraft warnings:\n${draft.warnings.map((w) => `- ${w}`).join("\n") || "(none)"}`;
  const started = Date.now();
  const result = await client.responses.create({
    model,
    reasoning: { effort: reasoning },
    max_output_tokens: 6000,
    store: false,
    instructions: EDITOR_INSTRUCTIONS + examplesText(examples),
    input: [{ role: "user", content: [{ type: "input_text", text }] }],
    text: { format: { type: "json_schema", name: "edited_draft", strict: true, schema: EDITOR_SCHEMA } },
  });
  if (result.status !== "completed") throw new Error(`Editor did not complete: ${result.status}`);
  const parsed = JSON.parse(result.output_text) as { messages: string[]; warnings: string[]; changes: string };
  const messages = fitMessages(parsed.messages ?? []).slice(0, 3);
  if (!messages.length) throw new Error("Editor returned an empty draft");
  return {
    messages,
    warnings: (parsed.warnings ?? []).filter((w) => w.trim()).slice(0, 10),
    changes: parsed.changes ?? "",
    promptVersion: EDITOR_VERSION,
    model: result.model,
    reasoning,
    usage: {
      input_tokens: result.usage?.input_tokens ?? 0,
      cached_input_tokens: result.usage?.input_tokens_details?.cached_tokens ?? 0,
      output_tokens: result.usage?.output_tokens ?? 0,
    },
    latencyMs: Date.now() - started,
  };
}
