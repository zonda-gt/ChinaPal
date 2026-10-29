import { isObject, readSignedJson, text, type JsonObject } from "../instagram/webhook";

export type WhatsAppMessage = {
  id: string;
  // The customer's number in WhatsApp format: country code and digits only.
  wa_id: string;
  direction: "inbound" | "outbound";
  sent_at: string;
  text: string;
  // Media, locations and other content the inbox does not show.
  unavailable: boolean;
};

type WebhookOptions = {
  appSecret?: string;
  phoneNumberId?: string;
  save: (messages: WhatsAppMessage[]) => Promise<void>;
};

function list(value: unknown): JsonObject[] {
  return Array.isArray(value) ? value.filter(isObject) : [];
}

function normalize(m: JsonObject, direction: WhatsAppMessage["direction"], wa: unknown): WhatsAppMessage | null {
  if (typeof m.id !== "string" || !m.id || m.id.length > 300) return null;
  if (typeof wa !== "string" || !/^\d{6,20}$/.test(wa)) return null;
  // Reactions have no message of their own; they would show as empty bubbles.
  if (m.type === "reaction") return null;
  const seconds = Number(m.timestamp);
  const content = typeof m.type === "string" && isObject(m[m.type]) ? (m[m.type] as JsonObject) : {};
  const reply = isObject(content.button_reply) ? content.button_reply : isObject(content.list_reply) ? content.list_reply : {};
  const body = [content.body, content.caption, content.text, reply.title].find((v) => typeof v === "string") as string | undefined;
  return {
    id: m.id,
    wa_id: wa,
    direction,
    sent_at: new Date(Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : Date.now()).toISOString(),
    text: body ?? "",
    unavailable: !(m.type === "text" || m.type === "button" || m.type === "interactive") || !body,
  };
}

// Customer messages arrive in `messages`. When the number also runs in the
// WhatsApp Business app (coexistence), replies typed on the phone arrive as
// `message_echoes`, so the inbox shows both sides of the chat.
export function whatsAppMessages(payload: JsonObject, phoneNumberId: string): WhatsAppMessage[] {
  if (payload.object !== "whatsapp_business_account") return [];
  const out: WhatsAppMessage[] = [];
  for (const entry of list(payload.entry)) {
    for (const change of list(entry.changes)) {
      const value = isObject(change.value) ? change.value : {};
      if (!isObject(value.metadata) || value.metadata.phone_number_id !== phoneNumberId) continue;
      for (const m of list(value.messages)) {
        const message = normalize(m, "inbound", m.from);
        if (message) out.push(message);
      }
      for (const m of list(value.message_echoes)) {
        const message = normalize(m, "outbound", m.to);
        if (message) out.push(message);
      }
    }
  }
  return out;
}

export async function receiveWhatsAppWebhook(request: Request, options: WebhookOptions) {
  const { appSecret, phoneNumberId, save } = options;
  if (!appSecret || !phoneNumberId) return text("Webhook not configured", 503);
  const body = await readSignedJson(request, appSecret);
  if (body instanceof Response) return body;
  // Delivery/read receipts and other numbers' events are acknowledged and dropped.
  const messages = whatsAppMessages(body.payload, phoneNumberId);
  if (!messages.length) return text("EVENT_RECEIVED");
  try {
    await save(messages);
  } catch {
    // Meta retries unacknowledged deliveries. Never log message content.
    console.error("[whatsapp-webhook] Messages could not be stored");
    return text("Please retry", 503);
  }
  return text("EVENT_RECEIVED");
}
