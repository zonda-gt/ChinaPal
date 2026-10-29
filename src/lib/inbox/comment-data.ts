import type { InstagramDelivery } from "@/lib/instagram/webhook";

// Comment replies: someone comments a keyword on one of our posts or reels and
// we DM them a set message (Instagram's "private reply") and reply under the
// comment. No AI writes these; the team sets each message on /comment.

export type CommentRule = {
  id: string;
  media_id: string | null; // null = every post and reel
  keyword: string;
  message: string;
  public_reply: string;
  active: boolean;
  updated_by: string;
  updated_at: string;
};
export type CommentStatus = "pending" | "sending" | "sent" | "failed" | "skipped";
export type CommentReply = {
  comment_id: string;
  media_id: string;
  rule_id: string | null;
  commenter_id: string;
  username: string;
  comment: string;
  commented_at: string;
  status: CommentStatus;
  dm_sent_at: string | null;
  public_sent_at: string | null;
  attempts: number;
  error: string;
  created_at: string;
  updated_at: string;
};
export type CommentEvent = { id: string; mediaId: string; from: string; username: string; text: string; at: string };

/** Instagram accepts a private reply only within 7 days of the comment. */
export const PRIVATE_REPLY_MS = 7 * 24 * 60 * 60 * 1000;
/** A send left "sending" this long was cut off and may be retried. */
export const STUCK_MS = 5 * 60 * 1000;
export const LIMITS = { keyword: 40, message: 1000, publicReply: 300 };

/** Lower-case words and numbers only, so "China!!", "china 🇨🇳" and "CHINA" read the same. */
export function normalize(text: string) {
  return ` ${text.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim()} `;
}
/**
 * The keyword as a whole word or phrase anywhere in the comment ("china" matches
 * "China trip", not "Chinatown"). Chinese and Japanese have no spaces between
 * words, so a keyword in those scripts matches anywhere ("中国" in "想去中国").
 */
export function matches(text: string, keyword: string) {
  const k = normalize(keyword).trim();
  if (!k) return false;
  return /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(k) ? normalize(text).includes(k) : normalize(text).includes(` ${k} `);
}

type Change = { field?: string; value?: { id?: unknown; text?: unknown; from?: { id?: unknown; username?: unknown }; media?: { id?: unknown } } };
/** Comments on our posts in a webhook delivery, without our own (including our replies). */
export function commentEvents(delivery: InstagramDelivery): CommentEvent[] {
  const out: CommentEvent[] = [];
  for (const entry of delivery.payload.entry) {
    const at = typeof entry.time === "number" ? new Date(entry.time * 1000) : new Date();
    for (const change of (Array.isArray(entry.changes) ? entry.changes : []) as Change[]) {
      const v = change.value;
      if (change.field !== "comments" || !v) continue;
      const id = String(v.id ?? ""),
        mediaId = String(v.media?.id ?? ""),
        from = String(v.from?.id ?? "");
      if (!/^\d+$/.test(id) || !/^\d+$/.test(mediaId) || !/^\d+$/.test(from) || from === delivery.account_id) continue;
      out.push({ id, mediaId, from, username: String(v.from?.username ?? "").slice(0, 100), text: String(v.text ?? "").slice(0, 2000), at: at.toISOString() });
    }
  }
  return out;
}

/** The rule for this comment: the post's own rules first, then the ones for every post. */
export function pickRule(rules: CommentRule[], mediaId: string, text: string) {
  const live = rules.filter((r) => r.active && matches(text, r.keyword));
  return live.find((r) => r.media_id === mediaId) ?? live.find((r) => r.media_id === null) ?? null;
}

/** Whether a logged comment should be (re)sent now. */
export function sendable(r: Pick<CommentReply, "status" | "updated_at">, now = Date.now()) {
  return r.status === "pending" || (r.status === "sending" && now - Date.parse(r.updated_at) > STUCK_MS);
}
