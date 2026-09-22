import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import VivekClient from "./client";

export const metadata: Metadata = {
  title: "Vivek's Shanghai & Suzhou Itinerary",
  description: "A personalised family itinerary for six: Shanghai and Suzhou, November 25–29, 2026.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function Page() {
  return <VivekClient images={getImageMap()} />;
}
