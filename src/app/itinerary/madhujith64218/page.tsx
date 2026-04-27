import type { Metadata } from "next";
import SoloChengduChongqingXianPosterPage from "@/components/SoloChengduChongqingXianPosterPage";

export const metadata: Metadata = {
  title: "Madhujith — Chengdu × Chongqing × Xi'an Solo Itinerary",
  description:
    "A 13-day solo budget itinerary for Madhujith covering Chengdu, Jiuzhaigou, Chongqing's Wulong Karst and Xi'an, in an editorial poster-style layout.",
};

export default function Page() {
  return <SoloChengduChongqingXianPosterPage />;
}
