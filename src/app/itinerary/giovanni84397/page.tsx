import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import GiovanniClient from "./client";

export const metadata: Metadata = {
  title: "Giovanni's China Itinerary — ChinaPal",
  description:
    "A 12-day personalised China itinerary for Giovanni: Chengdu, Chongqing, and Zhangjiajie. Built by ChinaPal.",
};

export const dynamic = "force-dynamic";

export default function Page() {
  const images = getImageMap();
  return <GiovanniClient images={images} />;
}
