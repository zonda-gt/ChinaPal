import { processDelivery } from "@/lib/inbox/events";
import { getConciergeDatabase } from "@/lib/instagram/database";
import { receiveInstagramWebhook, verifyInstagramWebhook } from "@/lib/instagram/webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return verifyInstagramWebhook(request, process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN);
}

export async function POST(request: Request) {
  return receiveInstagramWebhook(request, {
    appSecret: process.env.INSTAGRAM_APP_SECRET,
    accountId: process.env.INSTAGRAM_ACCOUNT_ID,
    async save(delivery) {
      const { error } = await getConciergeDatabase()
        .from("instagram_webhook_deliveries")
        .upsert(delivery, { onConflict: "delivery_hash", ignoreDuplicates: true });
      if (error) throw new Error("Instagram delivery storage failed");
      await processDelivery(delivery);
    },
  });
}
