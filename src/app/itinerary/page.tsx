import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import ItineraryPage from "./ItineraryPage";

export const metadata: Metadata = {
  title: "Your Zhangjiajie Itinerary — ChinaPal",
  description:
    "A personalised 2-day Zhangjiajie itinerary built by your ChinaPal concierge Mei. Forest Park, Tianzi Mountain, Golden Whip Stream, and more.",
};

export const dynamic = "force-dynamic";

export default function Page() {
  const images = getImageMap();
  return <ItineraryPage images={images} />;
}
