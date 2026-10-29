import { storeWhatsAppMessages } from "@/lib/inbox/events";
import { verifyInstagramWebhook } from "@/lib/instagram/webhook";
import { receiveWhatsAppWebhook } from "@/lib/whatsapp/webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Meta's subscription handshake is the same for Instagram and WhatsApp.
export function GET(request: Request) {
  return verifyInstagramWebhook(request, process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN);
}

export async function POST(request: Request) {
  return receiveWhatsAppWebhook(request, {
    appSecret: process.env.WHATSAPP_APP_SECRET,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    save: storeWhatsAppMessages,
  });
}
