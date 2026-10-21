import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import { InboxError } from "./types";
import type { NewQuestion, QuestionSource, TripQuestion } from "./question-data";

// Local development keeps the list on disk, so previews never write to the shared
// database. Production uses the inbox_questions table.
const local = process.env.NODE_ENV === "development";
const directory = join(process.cwd(), "data/cache/inbox-questions");
const COLUMNS = "id,text,why,owner,urgent,source,status,include,answer,draft_id,created_by,created_at,updated_at";
const MIGRATION = "The questions list needs the inbox plans and questions database migration.";

function file(peer: string) {
  if (!/^\d+$/.test(peer)) throw new InboxError("Invalid conversation");
  return join(directory, `${peer}.json`);
}
async function readLocal(peer: string): Promise<TripQuestion[]> {
  try {
    return JSON.parse(await readFile(file(peer), "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}
async function writeLocal(peer: string, questions: TripQuestion[]) {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const target = file(peer),
    temp = `${target}.${randomUUID()}.tmp`;
  await writeFile(temp, JSON.stringify(questions), { mode: 0o600 });
  await rename(temp, target);
}

export async function listQuestions(peer: string): Promise<TripQuestion[]> {
  if (local) return readLocal(peer);
  const { data, error } = await db()
    .from("inbox_questions")
    .select(COLUMNS)
    .eq("peer_id", peer)
    .order("created_at")
    .limit(200);
  if (error) throw new InboxError(MIGRATION, 503);
  return data as TripQuestion[];
}

export async function addQuestions(peer: string, items: NewQuestion[], source: QuestionSource, by: string) {
  if (!items.length) return;
  const now = new Date().toISOString();
  const rows = items.map((q) => ({
    ...q,
    source,
    status: "open" as const,
    // The team adds a customer question to ask it; AI questions start ticked only when urgent.
    include: q.owner === "customer" && (source === "team" || q.urgent),
    answer: "",
    draft_id: null,
    created_by: by,
  }));
  if (local) {
    const existing = await readLocal(peer);
    if (existing.length + rows.length > 200) throw new InboxError("This questions list is full. Dismiss some first.");
    await writeLocal(peer, [...existing, ...rows.map((r) => ({ ...r, id: randomUUID(), created_at: now, updated_at: now }))]);
    return;
  }
  const { error } = await db()
    .from("inbox_questions")
    .insert(rows.map((r) => ({ ...r, peer_id: peer })));
  if (error) throw new InboxError("Could not save the questions. Please try again.", 503);
}

export type QuestionPatch = Partial<
  Pick<TripQuestion, "text" | "why" | "owner" | "urgent" | "status" | "include" | "answer" | "draft_id">
>;

export async function updateQuestions(peer: string, ids: string[], patch: QuestionPatch) {
  if (!ids.length) return;
  const updated_at = new Date().toISOString();
  if (local) {
    const existing = await readLocal(peer);
    await writeLocal(peer, existing.map((q) => (ids.includes(q.id) ? { ...q, ...patch, updated_at } : q)));
    return;
  }
  const { error } = await db()
    .from("inbox_questions")
    .update({ ...patch, updated_at })
    .eq("peer_id", peer)
    .in("id", ids);
  if (error) throw new InboxError("Could not update the questions. Please try again.", 503);
}

/** Point the given questions at the draft that now asks them, and only those. */
export async function linkDraft(peer: string, draftId: string, ids: string[]) {
  const questions = await listQuestions(peer);
  const unlink = questions.filter((q) => q.draft_id === draftId && !ids.includes(q.id)).map((q) => q.id);
  await updateQuestions(peer, unlink, { draft_id: null });
  await updateQuestions(peer, ids, { draft_id: draftId });
}

/** A sent draft has asked its questions. Never blocks the send that triggered it. */
export async function markAsked(peer: string, draftId: string) {
  try {
    const questions = await listQuestions(peer);
    const ids = questions.filter((q) => q.draft_id === draftId && q.status === "open").map((q) => q.id);
    await updateQuestions(peer, ids, { status: "asked", include: false, draft_id: null });
  } catch {
    console.error("[inbox-questions] Could not mark questions as asked");
  }
}
