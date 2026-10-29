import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import { InboxError } from "./types";
import type { CommentEvent, CommentReply, CommentRule } from "./comment-data";

// Comment rules and the log of comments we answered. Local development keeps
// both on disk, so previews never write to the shared database. Production uses
// the tables from the inbox comment replies migration.
const local = process.env.NODE_ENV === "development";
const directory = join(process.cwd(), "data/cache/inbox-comments");
const RULE_COLUMNS = "id,media_id,keyword,message,public_reply,active,updated_by,updated_at";
const REPLY_COLUMNS =
  "comment_id,media_id,rule_id,commenter_id,username,comment,commented_at,status,dm_sent_at,public_sent_at,attempts,error,created_at,updated_at";
export const COMMENTS_MIGRATION = "Comment replies need the inbox comment replies database migration.";

async function readLocal<T>(name: string): Promise<T[]> {
  try {
    return JSON.parse(await readFile(join(directory, `${name}.json`), "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}
async function writeLocal(name: string, rows: unknown[]) {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const target = join(directory, `${name}.json`),
    temp = `${target}.${randomUUID()}.tmp`;
  await writeFile(temp, JSON.stringify(rows), { mode: 0o600 });
  await rename(temp, target);
}

export async function listRules(): Promise<CommentRule[]> {
  if (local) return readLocal<CommentRule>("rules");
  const { data, error } = await db().from("inbox_comment_rules").select(RULE_COLUMNS).order("created_at").limit(500);
  if (error) throw new InboxError(COMMENTS_MIGRATION, 503);
  return data as CommentRule[];
}

export type RuleInput = Pick<CommentRule, "media_id" | "keyword" | "message" | "public_reply" | "active">;
export async function saveRule(id: string | null, rule: RuleInput, by: string) {
  const updated_at = new Date().toISOString();
  const rules = await listRules();
  if (rules.some((r) => r.id !== id && r.media_id === rule.media_id && r.keyword === rule.keyword))
    throw new InboxError(`There is already a reply for "${rule.keyword}" here.`);
  if (local) {
    const row = { ...rule, id: id ?? randomUUID(), updated_by: by, updated_at };
    if (id && !rules.some((r) => r.id === id)) throw new InboxError("That reply no longer exists.", 404);
    await writeLocal("rules", id ? rules.map((r) => (r.id === id ? row : r)) : [...rules, row]);
    return;
  }
  const query = id
    ? db().from("inbox_comment_rules").update({ ...rule, updated_by: by, updated_at }).eq("id", id).select("id")
    : db().from("inbox_comment_rules").insert({ ...rule, updated_by: by }).select("id");
  const { data, error } = await query;
  if (error) throw new InboxError("Could not save the reply. Please try again.", 503);
  if (!data?.length) throw new InboxError("That reply no longer exists.", 404);
}

export async function deleteRule(id: string) {
  if (local) return writeLocal("rules", (await listRules()).filter((r) => r.id !== id));
  const { error } = await db().from("inbox_comment_rules").delete().eq("id", id);
  if (error) throw new InboxError("Could not delete the reply. Please try again.", 503);
}

/** Log a matching comment once. Returns false when it was already logged (a webhook retry). */
export async function logComment(event: CommentEvent, ruleId: string, status: "pending" | "skipped", error = "") {
  const row = {
    comment_id: event.id,
    media_id: event.mediaId,
    rule_id: ruleId,
    commenter_id: event.from,
    username: event.username,
    comment: event.text,
    commented_at: event.at,
    status,
    error,
  };
  if (local) {
    const replies = await readLocal<CommentReply>("replies");
    if (replies.some((r) => r.comment_id === event.id)) return false;
    const now = new Date().toISOString();
    await writeLocal("replies", [{ ...row, dm_sent_at: null, public_sent_at: null, attempts: 0, created_at: now, updated_at: now }, ...replies].slice(0, 500));
    return true;
  }
  const { data, error: e } = await db()
    .from("inbox_comment_replies")
    .upsert(row, { onConflict: "comment_id", ignoreDuplicates: true })
    .select("comment_id");
  if (e) throw new InboxError(COMMENTS_MIGRATION, 503);
  return !!data?.length;
}

export async function listReplies(limit = 50): Promise<CommentReply[]> {
  if (local) return (await readLocal<CommentReply>("replies")).slice(0, limit);
  const { data, error } = await db().from("inbox_comment_replies").select(REPLY_COLUMNS).order("created_at", { ascending: false }).limit(limit);
  if (error) throw new InboxError(COMMENTS_MIGRATION, 503);
  return data as CommentReply[];
}

/** Comments still waiting to be sent, or cut off mid-send. */
export async function openReplies(): Promise<CommentReply[]> {
  if (local) return (await readLocal<CommentReply>("replies")).filter((r) => r.status === "pending" || r.status === "sending");
  const { data, error } = await db().from("inbox_comment_replies").select(REPLY_COLUMNS).in("status", ["pending", "sending"]).order("created_at").limit(100);
  if (error) throw new InboxError(COMMENTS_MIGRATION, 503);
  return data as CommentReply[];
}

/**
 * Move a comment from one status to another, only if it is still in one of
 * `from` (and, with `seenAt`, unchanged since then). False when someone else
 * moved it first, so two senders never both claim the same comment.
 */
export async function moveReply(id: string, from: CommentReply["status"][], patch: Partial<CommentReply>, seenAt?: string) {
  const updated_at = new Date().toISOString();
  if (local) {
    const replies = await readLocal<CommentReply>("replies");
    const target = replies.find((r) => r.comment_id === id);
    if (!target || !from.includes(target.status) || (seenAt && target.updated_at !== seenAt)) return false;
    await writeLocal("replies", replies.map((r) => (r.comment_id === id ? { ...r, ...patch, updated_at } : r)));
    return true;
  }
  let query = db()
    .from("inbox_comment_replies")
    .update({ ...patch, updated_at })
    .eq("comment_id", id)
    .in("status", from);
  if (seenAt) query = query.eq("updated_at", seenAt);
  const { data, error } = await query.select("comment_id");
  if (error) throw new InboxError(COMMENTS_MIGRATION, 503);
  return !!data?.length;
}
