import { InboxError } from "./types";
export const REPLY_WINDOW_MS = 24 * 60 * 60 * 1000;
export function validateReply(body: unknown) {
  if (typeof body !== "string" || !body.trim())
    throw new InboxError("Write a reply first.");
  if ([...body].length > 1000)
    throw new InboxError(
      "Instagram replies must be 1,000 characters or fewer.",
    );
  return body.trim();
}
export function replyWindowOpen(lastInbound: string | null, now = Date.now()) {
  const sent = lastInbound ? Date.parse(lastInbound) : NaN;
  return Number.isFinite(sent) && sent <= now && now - sent < REPLY_WINDOW_MS;
}
export function safeMediaUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const u = new URL(value);
    return u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !u.port &&
      ["fbcdn.net", "cdninstagram.com", "fbsbx.com"].some(
        (h) => u.hostname === h || u.hostname.endsWith("." + h),
      )
      ? u.href
      : null;
  } catch {
    return null;
  }
}
export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin)
    throw new InboxError("Please reload the inbox and try again.", 403);
}
