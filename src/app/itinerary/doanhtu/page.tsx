import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import DoAnhTuClient from "./client";

export const metadata: Metadata = {
  title: "Do Anh Tu’s Shanghai & Hangzhou Itinerary — ChinaPal",
  description: "A 9-day personalised itinerary for Do Anh Tu: Shanghai and Hangzhou, 24 October – 1 November 2026. Built by ChinaPal.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function Page() {
  return <DoAnhTuClient images={getImageMap()} />;
}
