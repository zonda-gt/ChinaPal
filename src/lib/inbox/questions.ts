import "server-only";
import { InboxError, type Staff } from "./types";
import { addQuestions, listQuestions, updateQuestions, type QuestionPatch } from "./question-store";

const STATUSES = ["open", "asked", "answered", "dismissed"];

/** Add a team question, or change one: tick it for the next draft, edit, answer or dismiss it. */
export async function changeQuestion(peer: string, staff: Staff, body: Record<string, unknown>) {
  const text = (value: unknown, max: number) => {
    if (typeof value !== "string" || value.length > max) throw new InboxError("Invalid question.");
    return value.trim();
  };
  if (body.action === "add") {
    const owner = body.owner === "team" ? "team" : "customer";
    const question = text(body.text, 300);
    if (!question) throw new InboxError("Write the question first.");
    await addQuestions(peer, [{ text: question, why: "", owner, urgent: body.urgent === true }], "team", staff.name || staff.email);
  } else if (body.action === "update") {
    const id = text(body.id, 50);
    if (!(await listQuestions(peer)).some((q) => q.id === id)) throw new InboxError("Question not found.", 404);
    const patch: QuestionPatch = {};
    if (body.text !== undefined) {
      patch.text = text(body.text, 300);
      if (!patch.text) throw new InboxError("Write the question first.");
    }
    if (body.answer !== undefined) patch.answer = text(body.answer, 300);
    if (body.include !== undefined) patch.include = body.include === true;
    if (body.urgent !== undefined) patch.urgent = body.urgent === true;
    if (body.owner !== undefined) patch.owner = body.owner === "team" ? "team" : "customer";
    if (body.status !== undefined) {
      if (!STATUSES.includes(String(body.status))) throw new InboxError("Invalid question status.");
      patch.status = body.status as QuestionPatch["status"];
      // Only open questions can go into a draft.
      if (patch.status !== "open") {
        patch.include = false;
        patch.draft_id = null;
      }
    }
    await updateQuestions(peer, [id], patch);
  } else throw new InboxError("Invalid question change.");
  return { questions: await listQuestions(peer) };
}
