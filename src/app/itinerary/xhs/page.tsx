import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import XhsClient from "./client";

export const metadata: Metadata = {
  title: "Your Shanghai & Hangzhou Trip — ChinaPal",
  description: "A personal 10-day solo China trip: food, shopping, easy evenings and time for supplier meetings in Shanghai, with a two-night Hangzhou escape.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function Page() {
  return <XhsClient images={getImageMap()} />;
}
