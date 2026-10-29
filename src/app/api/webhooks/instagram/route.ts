import { after } from "next/server";
import { processDelivery } from "@/lib/inbox/events";
import { captureReels, processPending } from "@/lib/inbox/reels";
import { getConciergeDatabase } from "@/lib/instagram/database";
import { receiveInstagramWebhook, verifyInstagramWebhook } from "@/lib/instagram/webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Shared reels are read after the reply to Instagram, within this limit.
export const maxDuration = 300;

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
      // A reel problem (e.g. before the reels migration) must not fail the delivery.
      const reels = await captureReels(delivery).catch((e) => {
        console.error("[inbox-reels] capture failed", (e as Error).message);
        return 0;
      });
      if (reels) {
        const deadline = Date.now() + 290_000;
        after(() => processPending({ deadline }).catch((e) => console.error("[inbox-reels]", (e as Error).message)));
      }
    },
  });
}
