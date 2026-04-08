import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import HangzhouClient from "./client";

export const metadata: Metadata = {
  title: "Hangzhou Itinerary — ChinaPal",
  description:
    "A 2-day Hangzhou itinerary: West Lake, Lingyin Temple, Longjing Tea, Grand Canal, and more. Built by ChinaPal.",
};

export const dynamic = "force-dynamic";

export default function Page() {
  const images = getImageMap();
  return <HangzhouClient images={images} />;
}
