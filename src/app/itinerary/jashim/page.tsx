import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import JashimClient from "./client";

export const metadata: Metadata = {
  title: "Jashim’s Family Trip to Beijing, Xi’an, Zhangjiajie & Shanghai — ChinaPal",
  description: "A 16-day family itinerary for Jashim, his wife and their baby: Beijing, Xi’an, Zhangjiajie and Shanghai, 10–25 December 2026. Built by ChinaPal.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function Page() {
  return <JashimClient images={getImageMap()} />;
}
