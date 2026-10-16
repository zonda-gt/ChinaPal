import "server-only";
import { InboxError, type Attachment, type Message } from "./types";
import { safeMediaUrl } from "./policy";
export class GraphError extends InboxError {
  constructor(
    public definiteFailure: boolean,
    status: number,
  ) {
    super(
      status === 429
        ? "Instagram is rate limiting requests. Please try again shortly."
        : "Instagram could not complete the request. Check the connection and try refreshing.",
      502,
    );
  }
}
export type GraphPage<T> = {
  data: T[];
  paging?: { next?: string; cursors?: { after?: string } };
};
export type GraphThread = {
  id: string;
  updated_time: string;
  participants: { data: { id: string; username?: string }[] };
};
export type GraphMessage = {
  id: string;
  created_time: string;
  from?: { id: string; username?: string };
  to?: { data: { id: string }[] };
  message?: string;
  attachments?: {
    data: {
      image_data?: { url?: string };
      video_data?: { url?: string };
      file_url?: string;
    }[];
  };
};
export async function graph<T>(
  path: string,
  params: Record<string, string> = {},
  body?: object,
): Promise<T> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token)
    throw new InboxError("Instagram connection is not configured.", 503);
  const u = new URL(`https://graph.instagram.com/v25.0/${path}`);
  u.search = new URLSearchParams(params).toString();
  let response: Response;
  try {
    response = await fetch(u, {
      method: body ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new GraphError(false, 504);
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || !data || data.error)
    throw new GraphError(
      response.status >= 400 && response.status < 500,
      response.status,
    );
  return data as T;
}
export function cursor<T>(page: GraphPage<T>): string | null {
  if (!page.data?.length || !page.paging?.next) return null;
  const url = new URL(page.paging.next);
  if (url.origin !== "https://graph.instagram.com") return null;
  return url.searchParams.get("after");
}
export function accountId() {
  const id = process.env.INSTAGRAM_ACCOUNT_ID;
  if (!id || !/^\d+$/.test(id))
    throw new InboxError("Instagram account is not configured.", 503);
  return id;
}
export function normalizeMessage(message: GraphMessage, peer: string): Message {
  const attachments: Attachment[] = [];
  for (const a of message.attachments?.data ?? []) {
    const image = safeMediaUrl(a.image_data?.url),
      video = safeMediaUrl(a.video_data?.url),
      file = safeMediaUrl(a.file_url);
    if (image) attachments.push({ type: "image", url: image });
    else if (video) attachments.push({ type: "video", url: video });
    else if (file) attachments.push({ type: "file", url: file });
  }
  return {
    id: message.id,
    peer_id: peer,
    direction: message.from?.id === peer ? "inbound" : "outbound",
    sent_at: message.created_time,
    text: message.message ?? "",
    attachments,
    deleted: false,
    unavailable: !message.message && !attachments.length,
  };
}
export async function mediaBytes(url: string) {
  let target = safeMediaUrl(url);
  if (!target) throw new InboxError("This attachment cannot be opened.", 400);
  const signal = AbortSignal.timeout(15000);
  for (let redirect = 0; redirect < 4; redirect++) {
    const response = await fetch(target, {
      redirect: "manual",
      cache: "no-store",
      signal,
    });
    if (response.status >= 300 && response.status < 400) {
      target = safeMediaUrl(
        new URL(response.headers.get("location") || "", target).href,
      );
      if (!target)
        throw new InboxError("Attachment redirect is not supported.", 502);
      continue;
    }
    if (!response.ok)
      throw new InboxError(
        "Attachment expired. Refresh the conversation to reload it.",
        410,
      );
    const type = response.headers.get("content-type")?.split(";")[0] ?? "";
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(type))
      throw new InboxError("Only image previews are supported in V1.", 415);
    if (Number(response.headers.get("content-length") || 0) > 5 * 1024 * 1024)
      throw new InboxError("Image exceeds the 5 MB preview limit.", 413);
    const reader = response.body?.getReader();
    if (!reader) throw new InboxError("Image unavailable.", 502);
    const parts: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.length;
      if (size > 5 * 1024 * 1024) {
        await reader.cancel();
        throw new InboxError("Image exceeds the 5 MB preview limit.", 413);
      }
      parts.push(chunk.value);
    }
    return {
      bytes: Buffer.concat(parts),
      type: type as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
    };
  }
  throw new InboxError("Too many attachment redirects.", 502);
}
