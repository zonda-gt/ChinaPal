import "server-only";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import {
  accountId,
  cursor,
  graph,
  normalizeMessage,
  GraphError,
  type GraphMessage,
  type GraphPage,
  type GraphThread,
} from "./graph";
import {
  InboxError,
  type Conversation,
  type Draft,
  type Message,
  type Staff,
} from "./types";
import { validateReply, replyWindowOpen } from "./policy";
function checked(error: unknown) {
  if (error)
    throw new InboxError(
      "Inbox storage is unavailable. Check the database setup and try again.",
      503,
    );
}
export async function lease(key: string, seconds: number) {
  const { data, error } = await db().rpc("inbox_take_lease", {
    p_key: key,
    p_seconds: seconds,
  });
  checked(error);
  if (!data)
    throw new InboxError(
      "This action is already running. Please wait a moment.",
      429,
    );
}
export async function release(key: string) {
  await db().from("inbox_operations").delete().eq("key", key);
}
export async function conversation(peer: string): Promise<Conversation> {
  const { data, error } = await db()
    .from("inbox_conversations")
    .select("*")
    .eq("peer_id", peer)
    .maybeSingle();
  checked(error);
  if (!data) throw new InboxError("Conversation not found.", 404);
  return data;
}
export async function storeMessage(message: Message) {
  const { error } = await db().rpc("inbox_store_message", {
    p_message: message,
  });
  checked(error);
}
export async function listConversations() {
  const { data, error } = await db()
    .from("inbox_conversations")
    .select("*")
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(500);
  checked(error);
  return data as Conversation[];
}
export async function syncConversations(after?: string) {
  await lease("sync-list", 180);
  try {
    const self = await graph<{
      id: string;
      user_id?: string;
      username: string;
    }>("me", { fields: "id,user_id,username" });
    const page = await graph<GraphPage<GraphThread>>(
      `${accountId()}/conversations`,
      {
        platform: "instagram",
        fields: "id,updated_time,participants",
        limit: "50",
        ...(after ? { after } : {}),
      },
    );
    let count = 0;
    for (const c of page.data) {
      const peer = c.participants.data.find(
        (p) =>
          p.id !== accountId() &&
          p.id !== self.id &&
          p.id !== self.user_id &&
          p.username !== self.username,
      );
      if (!peer) continue;
      const { error } = await db()
        .from("inbox_conversations")
        .upsert(
          {
            peer_id: peer.id,
            thread_id: c.id,
            username: peer.username || peer.id,
          },
          { onConflict: "peer_id" },
        );
      checked(error);
      // Do not regress the timestamp if a webhook arrived during this import.
      const { error: timestampError } = await db()
        .from("inbox_conversations")
        .update({ last_message_at: c.updated_time })
        .eq("peer_id", peer.id)
        .or(`last_message_at.is.null,last_message_at.lt.${c.updated_time}`);
      checked(timestampError);
      count++;
    }
    return { count, cursor: cursor(page) };
  } finally {
    await release("sync-list");
  }
}
export async function syncThread(peer: string, older = false) {
  const c = await conversation(peer);
  if (!c.thread_id)
    throw new InboxError(
      "Refresh the conversation list first to connect this new chat.",
    );
  if (older && c.history_complete) return { count: 0, more: false };
  await lease(`sync:${peer}`, 180);
  try {
    const params = {
      fields: "id,created_time",
      limit: "30",
      ...(older && c.history_cursor ? { after: c.history_cursor } : {}),
    };
    const page = await graph<GraphPage<{ id: string; created_time: string }>>(
      `${encodeURIComponent(c.thread_id)}/messages`,
      params,
    );
    // Bound parallel requests and only advance the cursor when every detail is saved.
    for (let i = 0; i < page.data.length; i += 5) {
      await Promise.all(
        page.data.slice(i, i + 5).map(async (m) => {
          const detail = await graph<GraphMessage>(encodeURIComponent(m.id), {
            fields: "id,created_time,from,to,message,attachments",
          });
          await storeMessage(normalizeMessage(detail, peer));
        }),
      );
    }
    const after = cursor(page);
    const { error } = await db()
      .from("inbox_conversations")
      .update({
        synced_at: new Date().toISOString(),
        ...(older || !c.synced_at
          ? { history_cursor: after, history_complete: !after }
          : {}),
      })
      .eq("peer_id", peer);
    checked(error);
    return { count: page.data.length, more: !!after };
  } finally {
    await release(`sync:${peer}`);
  }
}
export async function threadData(peer: string, limit = 100) {
  const c = await conversation(peer);
  const [{ data: messages, error }, { data: drafts, error: draftError }] =
    await Promise.all([
      db()
        .from("inbox_messages")
        .select("*")
        .eq("peer_id", peer)
        .order("sent_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(limit),
      db()
        .from("inbox_drafts")
        .select("*")
        .eq("peer_id", peer)
        .order("updated_at", { ascending: false })
        .limit(10),
    ]);
  checked(error);
  checked(draftError);
  const latestInbound =
    (messages as Message[]).find((m) => m.direction === "inbound" && !m.deleted)
      ?.sent_at ?? null;
  return {
    conversation: c,
    messages: (messages as Message[]).reverse(),
    drafts: drafts as Draft[],
    canSend: replyWindowOpen(latestInbound),
    latestInbound,
  };
}
export async function saveDraft(
  peer: string,
  body: string,
  contextId: string | null,
  staff: Staff,
  id?: string,
  version?: number,
  warnings: string[] = [],
) {
  validateReply(body);
  const record = {
    body,
    context_id: contextId,
    edited_by: staff.email,
    updated_at: new Date().toISOString(),
    warnings,
  };
  if (id) {
    const { data, error } = await db()
      .from("inbox_drafts")
      .update({ ...record, version: (version ?? 0) + 1 })
      .eq("id", id)
      .eq("peer_id", peer)
      .eq("version", version ?? 0)
      .eq("status", "draft")
      .select()
      .maybeSingle();
    checked(error);
    if (!data)
      throw new InboxError(
        "The shared draft changed. Your text is still in the editor; reload the saved draft before replacing it.",
        409,
      );
    return data as Draft;
  }
  const { data, error } = await db()
    .from("inbox_drafts")
    .insert({ ...record, peer_id: peer })
    .select()
    .single();
  if (error?.code === "23505")
    throw new InboxError(
      "There is already a shared draft. Refresh it before saving.",
      409,
    );
  checked(error);
  return data as Draft;
}
export async function sendDraft(
  peer: string,
  id: string,
  version: number,
  staff: Staff,
) {
  const { data: existing, error } = await db()
    .from("inbox_drafts")
    .select("*")
    .eq("id", id)
    .eq("peer_id", peer)
    .single();
  checked(error);
  if (!existing) throw new InboxError("Draft not found.", 404);
  if (existing.status === "sent") return { status: "sent" }; // Idempotent browser retry.
  validateReply(existing.body);
  // Refresh immediately before sending so drafts cannot silently ignore a new DM.
  await syncThread(peer);
  const { data: claimed, error: claimError } = await db().rpc(
    "inbox_claim_send",
    { p_id: id, p_version: version, p_email: staff.email },
  );
  if (claimError)
    throw new InboxError(
      claimError.code === "P0001"
        ? claimError.message
        : "Could not reserve the reply. Refresh and try again.",
      409,
    );
  const draft = claimed as Draft;
  let sent: { message_id: string };
  try {
    sent = await graph<{ message_id: string }>(
      `${accountId()}/messages`,
      {},
      { recipient: { id: peer }, message: { text: draft.body } },
    );
  } catch (e) {
    const definite = e instanceof GraphError && e.definiteFailure;
    await db()
      .from("inbox_drafts")
      .update({
        status: definite ? "failed" : "unknown",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (definite)
      await db()
        .from("inbox_conversations")
        .update({ sending_draft_id: null })
        .eq("peer_id", peer)
        .eq("sending_draft_id", id);
    throw new InboxError(
      definite
        ? "Instagram rejected the reply. Refresh the chat and check the reply window before creating a new draft."
        : "Delivery is uncertain. Check Instagram before sending anything else; automatic retries are disabled.",
      502,
    );
  }
  // Once Instagram accepted the send, a storage failure must never cause a resend.
  if (!sent.message_id)
    throw new InboxError(
      "Delivery is uncertain. Check Instagram before sending anything else.",
      502,
    );
  await storeMessage({
    id: sent.message_id,
    peer_id: peer,
    direction: "outbound",
    sent_at: new Date().toISOString(),
    text: draft.body,
    attachments: [],
    deleted: false,
    unavailable: false,
  });
  const { error: finalError } = await db()
    .from("inbox_drafts")
    .update({
      status: "sent",
      sent_message_id: sent.message_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  checked(finalError);
  const { error: unlockError } = await db()
    .from("inbox_conversations")
    .update({ sending_draft_id: null })
    .eq("peer_id", peer)
    .eq("sending_draft_id", id);
  checked(unlockError);
  return { status: "sent" };
}
