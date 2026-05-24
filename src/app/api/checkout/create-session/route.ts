// POST /api/checkout/create-session
// Creates a Stripe Hosted Checkout session for a logged-in user and returns its
// URL. The browser redirects there; Stripe redirects back to /checkout/success.
//
// Identity: the client sends its Supabase access token as a Bearer header. We
// verify it server-side and stamp the resulting user_id onto the session via
// `client_reference_id` — that is the join key the webhook reads back to record
// the entitlement under the right account. No email matching anywhere.
import { NextResponse, type NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getUserFromAccessToken } from "@/lib/supabase/admin";
import { isPlanKey, PLANS } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // ── Who is this? Verify the Supabase access token. ──
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : null;
  const user = await getUserFromAccessToken(token);
  if (!user) {
    return NextResponse.json(
      { error: "Please sign in before paying." },
      { status: 401 },
    );
  }

  // ── Which plan? ──
  let body: { plan?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!isPlanKey(body.plan)) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }
  const plan = PLANS[body.plan];

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      client_reference_id: user.id, // ← Supabase user_id, read back by the webhook
      customer_email: user.email ?? undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: plan.price * 100, // dollars → cents
            product_data: { name: `ChinaPal — ${plan.name}`, description: plan.unit },
          },
        },
      ],
      metadata: { plan: plan.key, supabase_user_id: user.id },
      success_url: `${site}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/checkout?plan=${plan.key}`,
      // NOTE: EU VAT (automatic_tax) + local methods (iDEAL/Bancontact/SEPA/
      // Klarna) are enabled in the Stripe Dashboard, not here. Add
      // `automatic_tax: { enabled: true }` only after Stripe Tax is configured,
      // otherwise the call errors.
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[create-session] Stripe error:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
