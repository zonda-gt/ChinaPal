import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import ChengduClient from "./client";

export const metadata: Metadata = {
  title: "Chengdu Itinerary — ChinaPal",
  description:
    "A 2-day Chengdu itinerary: Giant Pandas, Wuhou Shrine, Jinli Street, Wide & Narrow Alleys, and more. Built by ChinaPal.",
};

export const dynamic = "force-dynamic";

export default function Page() {
  const images = getImageMap();
  return <ChengduClient images={images} />;
}
