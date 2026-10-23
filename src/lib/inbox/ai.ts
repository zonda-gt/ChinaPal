import "server-only";
import OpenAI from "openai";
import { randomUUID } from "node:crypto";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import { mediaBytes } from "./graph";
import { lease, release, saveDraft, threadData } from "./service";
import { readProfile } from "./profile-store";
import { contactIdentity } from "./contacts";
import { runDraft } from "./draft-core";
import { linkDraft, listQuestions } from "./question-store";
import { questionsToAsk } from "./question-data";
import { InboxError, type Staff } from "./types";

// Loads the live conversation, runs the shared draft generator (draft-core.ts,
// prompt in prompt.ts) and saves the result as the conversation's shared draft.
export async function generateDraft(
  peer: string,
  staff: Staff,
  input: {
    instruction?: string;
    currentText?: string;
    staffFacts?: string;
    draftId?: string;
    version?: number;
  },
) {
  if (!process.env.OPENAI_API_KEY)
    throw new InboxError("AI drafting needs OPENAI_API_KEY on the server.", 503);
  await lease(`ai:${peer}`, 180);
  try {
    const [{ conversation, messages }, profile, identity, questions] = await Promise.all([
      threadData(peer, 400),
      readProfile(peer).catch(() => null),
      contactIdentity(peer).catch(() => null),
      // Before the questions migration there is simply nothing to ask.
      listQuestions(peer).catch(() => []),
    ]);
    const toAsk = questionsToAsk(questions);
    if (!messages.length) throw new InboxError("Load messages before generating a reply.");
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 0,
      timeout: 110000,
    });
    const result = await runDraft(
      client,
      {
        now: new Date().toISOString(),
        customerName: identity?.name ?? conversation.name ?? null,
        username: identity?.username || conversation.username,
        stage: conversation.stage,
        notes: conversation.notes,
        historyComplete: conversation.history_complete,
        messages,
        profile: profile ? { profile: profile.profile, generated_at: profile.generated_at } : null,
        staffFacts: input.staffFacts,
        instruction: input.instruction,
        currentDraft: input.currentText,
        questions: toAsk.map((q) => ({ text: q.text, why: q.why })),
      },
      mediaBytes,
    );
    const generationId = randomUUID();
    const [body, ...parts] = result.messages;
    const draft = await saveDraft(
      peer,
      body,
      messages.at(-1)?.id ?? null,
      staff,
      input.draftId,
      input.version,
      result.warnings,
      { parts, staffFacts: input.staffFacts ?? "", generationId },
    );
    // Sending this draft marks its questions as asked (route: send, resolve).
    await linkDraft(peer, draft.id, toAsk.map((q) => q.id)).catch(() =>
      console.error("[inbox-ai] Could not link the questions to the draft"),
    );
    // The log is for measuring draft quality later; it must never block a draft.
    const { error } = await db().from("inbox_ai_generations").insert({
      id: generationId,
      peer_id: peer,
      draft_id: draft.id,
      prompt_version: result.promptVersion,
      model: result.model,
      reasoning: result.reasoning,
      context_id: messages.at(-1)?.id ?? null,
      instruction: input.instruction ?? "",
      staff_facts: input.staffFacts ?? "",
      messages: result.messages,
      warnings: result.warnings,
      usage: result.usage,
      latency_ms: result.latencyMs,
      created_by: staff.email,
    });
    if (error) console.error("[inbox-ai] Could not log the generation", error.code);
    return draft;
  } finally {
    await release(`ai:${peer}`);
  }
}
