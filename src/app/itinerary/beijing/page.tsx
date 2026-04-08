import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import BeijingClient from "./client";

export const metadata: Metadata = {
  title: "Beijing Itinerary — ChinaPal",
  description:
    "A 3-day Beijing itinerary: Forbidden City, Great Wall, Temple of Heaven, Summer Palace, and more. Built by ChinaPal.",
};

export const dynamic = "force-dynamic";

export default function Page() {
  const images = getImageMap();
  return <BeijingClient images={images} />;
}
