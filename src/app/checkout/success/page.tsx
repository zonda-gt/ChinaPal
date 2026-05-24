import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { isPlanKey, PLANS } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";
import SuccessClient from "./SuccessClient";

export const dynamic = "force-dynamic";

// Reached only via Stripe's redirect, which carries ?session_id=...
// We retrieve the session and confirm it's actually paid before showing the
// confirmation — so nobody can land here by typing the URL. (The webhook, not
// this page, is the durable source of truth that records the entitlement.)
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) redirect("/product");

  let session: Stripe.Checkout.Session | null = null;
  try {
    session = await getStripe().checkout.sessions.retrieve(session_id);
  } catch {
    redirect("/product");
  }

  if (!session || session.payment_status !== "paid") redirect("/product");

  const planKey = session.metadata?.plan;
  if (!isPlanKey(planKey)) redirect("/product");

  return <SuccessClient plan={PLANS[planKey]} />;
}
