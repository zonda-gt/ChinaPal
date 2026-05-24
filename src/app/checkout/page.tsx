import { redirect } from "next/navigation";
import { isPlanKey, PLANS } from "@/lib/plans";
import CheckoutClient from "./CheckoutClient";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  if (!isPlanKey(plan)) redirect("/product");
  return <CheckoutClient plan={PLANS[plan]} />;
}
