import "server-only";
import { GraphError } from "./graph";
import { InboxError } from "./types";

export async function sendWhatsApp(to: string, body: string): Promise<{ message_id: string }> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phone = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phone || !/^\d+$/.test(phone))
    throw new InboxError("WhatsApp connection is not configured.", 503);
  let response: Response;
  try {
    response = await fetch(`https://graph.facebook.com/v25.0/${phone}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { body, preview_url: false },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new GraphError(false, 504);
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || !data || data.error)
    throw new GraphError(response.status >= 400 && response.status < 500, response.status);
  return { message_id: data.messages?.[0]?.id ?? "" };
}
