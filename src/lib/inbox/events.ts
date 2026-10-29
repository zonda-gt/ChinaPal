import "server-only";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import { safeMediaUrl } from "./policy";
import { storeMessage } from "./service";
import type { InstagramDelivery } from "@/lib/instagram/webhook";
import type { WhatsAppMessage } from "@/lib/whatsapp/webhook";
import type { Attachment } from "./types";
type Event = {
  sender?: { id: string };
  recipient?: { id: string };
  timestamp?: number;
  message?: {
    mid?: string;
    text?: string;
    is_echo?: boolean;
    is_deleted?: boolean;
    attachments?: { type: string; payload?: { url?: string } }[];
  };
};
export async function processDelivery(delivery: InstagramDelivery) {
  for (const entry of delivery.payload.entry) {
    for (const event of (Array.isArray(entry.messaging)
      ? entry.messaging
      : []) as Event[]) {
      const message = event.message;
      if (!message?.mid) continue;
      const outbound =
        event.sender?.id === delivery.account_id || message.is_echo === true;
      const peer = outbound ? event.recipient?.id : event.sender?.id;
      if (!peer || !/^\d+$/.test(peer)) continue;
      const { error: conversationError } = await db()
        .from("inbox_conversations")
        .upsert(
          { peer_id: peer, username: peer },
          { onConflict: "peer_id", ignoreDuplicates: true },
        );
      if (conversationError) throw Error("Conversation storage failed");
      const attachments: Attachment[] = [];
      for (const a of message.attachments ?? []) {
        const url = safeMediaUrl(a.payload?.url);
        if (url)
          attachments.push({
            type: ["image", "video", "audio"].includes(a.type)
              ? (a.type as Attachment["type"])
              : "file",
            url,
          });
      }
      if (message.is_deleted) {
        const { data: existing, error } = await db()
          .from("inbox_messages")
          .select("*")
          .eq("id", message.mid)
          .maybeSingle();
        if (error) throw Error("Message lookup failed");
        if (existing) {
          await storeMessage({
            ...existing,
            deleted: true,
            text: "",
            attachments: [],
          });
          continue;
        }
      }
      await storeMessage({
        id: message.mid,
        peer_id: peer,
        direction: outbound ? "outbound" : "inbound",
        sent_at: new Date(event.timestamp || Date.now()).toISOString(),
        text: message.is_deleted ? "" : message.text || "",
        attachments: message.is_deleted ? [] : attachments,
        deleted: !!message.is_deleted,
        unavailable: !message.text && !attachments.length,
      });
    }
  }
}
// Only numbers linked by hand to a conversation are stored. Messages from any
// other WhatsApp number are dropped, so no unrelated customer data is kept.
export async function storeWhatsAppMessages(messages: WhatsAppMessage[]) {
  for (const m of messages) {
    const { data, error } = await db()
      .from("inbox_conversations")
      .select("peer_id")
      .eq("whatsapp_id", m.wa_id)
      .maybeSingle();
    if (error) throw Error("WhatsApp link lookup failed");
    if (!data) {
      console.warn("[whatsapp-webhook] Ignored a message from an unlinked number");
      continue;
    }
    await storeMessage({
      id: m.id,
      peer_id: data.peer_id,
      direction: m.direction,
      sent_at: m.sent_at,
      text: m.text,
      attachments: [],
      deleted: false,
      unavailable: m.unavailable,
      channel: "whatsapp",
    });
  }
}
