import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import ArdioClient from "../client";

/* The same itinerary with swipeable alternatives beside some stops. */
export const metadata: Metadata = {
  title: "Ardio’s Family Trip, with Options — ChinaPal",
  description: "Ardio’s 12-day family itinerary, with other choices to swipe through for some stops.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function Page() {
  return <ArdioClient images={getImageMap()} withOptions />;
}
