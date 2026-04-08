import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import ItineraryPage from "../ItineraryPage";

export const metadata: Metadata = {
  title: "Zhangjiajie Itinerary — ChinaPal",
  description:
    "A 3-day Zhangjiajie itinerary: Forest Park, Tianzi Mountain, Tianmen Mountain, and more. Built by ChinaPal.",
};

export const dynamic = "force-dynamic";

export default function Page() {
  const images = getImageMap();
  return <ItineraryPage images={images} />;
}
