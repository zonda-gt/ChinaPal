import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import RuijunClient from "./client";

export const metadata: Metadata = {
  title: "Ruijun’s Hangzhou & Shanghai Itinerary — ChinaPal",
  description: "10–15 October 2026: six days in Hangzhou and Shanghai for Ruijun and family, with gentle walks, vegetarian dining and time to rest.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function Page() {
  return <RuijunClient images={getImageMap()} />;
}
