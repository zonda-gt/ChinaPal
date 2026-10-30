import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import JashimClient from "../client";

/* The same itinerary with swipeable alternatives beside some stops. */
export const metadata: Metadata = {
  title: "Jashim’s Family Trip, with Options — ChinaPal",
  description: "Jashim’s 16-day family itinerary, with rainy-day choices to swipe through for some stops.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function Page() {
  return <JashimClient images={getImageMap()} withOptions />;
}
