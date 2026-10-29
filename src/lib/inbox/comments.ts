import "server-only";
import type { InstagramDelivery } from "@/lib/instagram/webhook";
import { accountId, graph, type GraphPage } from "./graph";
import { safeMediaUrl } from "./policy";
import { InboxError, type Staff } from "./types";
import { commentEvents, LIMITS, normalize, pickRule, PRIVATE_REPLY_MS, sendable, type CommentReply, type CommentRule } from "./comment-data";
import { deleteRule, listReplies, listRules, logComment, moveReply, openReplies, saveRule, type RuleInput } from "./comment-store";

// Comment replies: a keyword comment on one of our posts gets the rule's DM
// (Instagram's private reply, allowed once per comment within 7 days) and its
// optional reply under the comment. The team writes every message on /comment;
// nothing here is generated. Matching runs in the webhook; sending runs after it.

/** Don't start another comment with less time than this left before the deadline. */
const SEND_BUDGET_MS = 30_000;
/** A short pause between comments, so a busy post doesn't send in one burst. */
const GAP_MS = 500;

/** Log the keyword comments in a webhook delivery. Returns how many are waiting to send. */
export async function captureComments(delivery: InstagramDelivery) {
  const events = commentEvents(delivery);
  if (!events.length) return 0;
  const rules = await listRules();
  let waiting = 0;
  for (const event of events) {
    const rule = pickRule(rules, event.mediaId, event.text);
    if (!rule) continue;
    const late = Date.now() - Date.parse(event.at) > PRIVATE_REPLY_MS;
    const added = await logComment(event, rule.id, late ? "skipped" : "pending", late ? "Older than 7 days, so Instagram won't allow a DM." : "");
    if (added && !late) waiting++;
  }
  return waiting;
}

/** Instagram's own error text tells the team what to fix (a missing permission, a reply already sent). */
class SendError extends Error {
  constructor(message: string, public uncertain = false) {
    super(message);
  }
}
async function post(path: string, body: object) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) throw new SendError("The Instagram connection is not configured.");
  let response: Response;
  try {
    response = await fetch(`https://graph.instagram.com/v25.0/${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    // It may have been delivered. A second DM is refused (one per comment), but
    // a second public reply would show twice, so the team checks first.
    throw new SendError("Instagram didn't answer, so it may or may not have gone. Check the post before retrying.", true);
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || !data || data.error)
    throw new SendError(`Instagram refused it: ${String(data?.error?.message ?? response.status).slice(0, 300)}`);
  return data;
}

async function sendOne(row: CommentReply, rules: CommentRule[]) {
  const rule = rules.find((r) => r.id === row.rule_id);
  if (!rule || !rule.active)
    return moveReply(row.comment_id, [row.status], { status: "skipped", error: "Its reply was turned off or deleted before it went." });
  if (!row.dm_sent_at && Date.now() - Date.parse(row.commented_at) > PRIVATE_REPLY_MS)
    return moveReply(row.comment_id, [row.status], { status: "skipped", error: "Older than 7 days, so Instagram won't allow a DM." });
  const claimed = await moveReply(
    row.comment_id,
    [row.status],
    { status: "sending", attempts: row.attempts + 1, error: "" },
    row.status === "sending" ? row.updated_at : undefined,
  );
  if (!claimed) return;
  let step = "The DM";
  try {
    if (!row.dm_sent_at) {
      await post(`${accountId()}/messages`, { recipient: { comment_id: row.comment_id }, message: { text: rule.message } });
      await moveReply(row.comment_id, ["sending"], { dm_sent_at: new Date().toISOString() });
    }
    step = "The DM went, but the reply under the comment";
    if (rule.public_reply && !row.public_sent_at) {
      await post(`${row.comment_id}/replies`, { message: rule.public_reply });
      await moveReply(row.comment_id, ["sending"], { public_sent_at: new Date().toISOString() });
    }
    await moveReply(row.comment_id, ["sending"], { status: "sent" });
  } catch (e) {
    const message = e instanceof SendError ? e.message : "Something went wrong.";
    await moveReply(row.comment_id, ["sending"], { status: "failed", error: `${step} failed. ${message}`.slice(0, 500) });
  }
}

/** Send every comment that is waiting, until the deadline. */
export async function sendPending({ deadline = Date.now() + 60_000 } = {}) {
  const [rows, rules] = await Promise.all([openReplies(), listRules()]);
  let sent = 0;
  for (const row of rows.filter((r) => sendable(r))) {
    if (deadline - Date.now() < SEND_BUDGET_MS) break;
    if (sent) await new Promise((r) => setTimeout(r, GAP_MS));
    await sendOne(row, rules);
    sent++;
  }
  return sent;
}

/** The team asks to send a failed comment again. Parts already sent are not repeated. */
export async function retryComment(commentId: string) {
  const moved = await moveReply(commentId, ["failed"], { status: "pending" });
  if (!moved) throw new InboxError("That comment isn't waiting for a retry.", 409);
  await sendPending({ deadline: Date.now() + 50_000 });
}

export type PostSummary = { id: string; caption: string; kind: string; permalink: string; thumbnail: string | null; at: string; comments: number };
type GraphMedia = {
  id: string;
  caption?: string;
  media_type?: string;
  media_product_type?: string;
  permalink?: string;
  thumbnail_url?: string;
  media_url?: string;
  timestamp?: string;
  comments_count?: number;
};
async function recentPosts(): Promise<PostSummary[]> {
  const page = await graph<GraphPage<GraphMedia>>(`${accountId()}/media`, {
    fields: "id,caption,media_type,media_product_type,permalink,thumbnail_url,media_url,timestamp,comments_count",
    limit: "50",
  });
  return (page.data ?? []).map((m) => ({
    id: m.id,
    caption: (m.caption ?? "").slice(0, 300),
    kind: m.media_product_type === "REELS" ? "Reel" : m.media_type === "CAROUSEL_ALBUM" ? "Carousel" : "Post",
    permalink: m.permalink ?? "",
    thumbnail: safeMediaUrl(m.thumbnail_url) ?? (m.media_type === "VIDEO" ? null : safeMediaUrl(m.media_url)),
    at: m.timestamp ?? "",
    comments: m.comments_count ?? 0,
  }));
}

export async function commentPage() {
  const [rules, replies, posts] = await Promise.all([
    listRules(),
    listReplies(),
    recentPosts().then(
      (p) => ({ posts: p, error: "" }),
      () => ({ posts: [] as PostSummary[], error: "Couldn't load your posts from Instagram. Replies for every post still work." }),
    ),
  ]);
  return { rules, replies, posts: posts.posts, postsError: posts.error };
}

function text(value: unknown, name: string, max: number, required = true) {
  if (typeof value !== "string") throw new InboxError("Invalid request.");
  const v = value.trim();
  if (required && !v) throw new InboxError(`Write the ${name} first.`);
  if ([...v].length > max) throw new InboxError(`The ${name} must be ${max} characters or fewer.`);
  return v;
}
export async function changeRule(staff: Staff, body: Record<string, unknown>) {
  const id = body.id === undefined || body.id === null ? null : text(body.id, "reply", 40);
  if (body.delete === true) {
    if (!id) throw new InboxError("Invalid request.");
    return deleteRule(id);
  }
  const mediaId = body.mediaId === null || body.mediaId === undefined ? null : text(body.mediaId, "post", 40);
  if (mediaId !== null && !/^\d+$/.test(mediaId)) throw new InboxError("Invalid post.");
  const keyword = normalize(text(body.keyword, "keyword", LIMITS.keyword)).trim();
  if (!keyword) throw new InboxError("The keyword needs at least one letter or number.");
  const rule: RuleInput = {
    media_id: mediaId,
    keyword,
    message: text(body.message, "DM", LIMITS.message),
    public_reply: text(body.publicReply ?? "", "public reply", LIMITS.publicReply, false),
    active: body.active !== false,
  };
  await saveRule(id, rule, staff.email);
}
