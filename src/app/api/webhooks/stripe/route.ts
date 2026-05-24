// POST /api/webhooks/stripe
// Stripe's source-of-truth callback. On `checkout.session.completed` it records
// a paid entitlement in the SHARED Supabase (keyed to the user_id we stamped at
// checkout) and pings the team. This is the real "a customer paid" delivery
// trigger — the success-page redirect is just for the buyer's screen.
//
// Next.js App Router note: the raw request body is read with `await req.text()`
// (NOT req.json()) — Stripe signature verification needs the exact bytes.
import { type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { notifyTeam } from "@/lib/notify";
import { isPlanKey, PLANS } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET unset");
    return new Response("Webhook not configured", { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const body = await req.text(); // raw bytes, required for verification

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("[webhook] signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await recordPaidEntitlement(event.data.object as Stripe.Checkout.Session);
  }

  return new Response(null, { status: 200 });
}

async function recordPaidEntitlement(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;

  const userId =
    session.client_reference_id ?? session.metadata?.supabase_user_id ?? null;
  const planKey = session.metadata?.plan;
  if (!userId || !isPlanKey(planKey)) {
    console.error("[webhook] missing user_id or plan on session", session.id);
    return;
  }

  // Idempotent insert: stripe_session_id is UNIQUE, so webhook retries no-op.
  const { error } = await getSupabaseAdmin().from("entitlements").insert({
    user_id: userId,
    plan: planKey,
    status: "active",
    stripe_session_id: session.id,
    stripe_customer_id:
      typeof session.customer === "string" ? session.customer : null,
    stripe_payment_intent:
      typeof session.payment_intent === "string" ? session.payment_intent : null,
    amount: session.amount_total ?? null,
    currency: session.currency ?? null,
    // starts_at / expires_at left null — the app starts the 7-day Pass clock
    // on the customer's first real message.
  });

  if (error) {
    if (error.code === "23505") return; // already recorded (retry) — don't re-notify
    console.error("[webhook] failed to insert entitlement:", error);
    return;
  }

  const plan = PLANS[planKey];
  const email =
    session.customer_details?.email ?? session.customer_email ?? "—";
  const name = session.customer_details?.name ?? "—";
  const amount = ((session.amount_total ?? 0) / 100).toFixed(2);
  const currency = (session.currency ?? "usd").toUpperCase();
  await notifyTeam(
    `💰 *${plan.name}* paid · ${name} · ${email}\n` +
      `${amount} ${currency} · user ${userId}`,
  );
}
