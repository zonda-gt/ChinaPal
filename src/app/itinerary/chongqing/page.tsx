import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import ChongqingClient from "./client";

export const metadata: Metadata = {
  title: "Chongqing Itinerary — ChinaPal",
  description:
    "A 2-day Chongqing itinerary: Hongyadong, Yangtze Cableway, Ciqikou, hotpot, and more. Built by ChinaPal.",
};

export const dynamic = "force-dynamic";

export default function Page() {
  const images = getImageMap();
  return <ChongqingClient images={images} />;
}
