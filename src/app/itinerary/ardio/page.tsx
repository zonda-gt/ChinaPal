import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import ArdioClient from "./client";

export const metadata: Metadata = {
  title: "Ardio’s Family Trip to Shanghai, Suzhou & Hangzhou — ChinaPal",
  description: "A 12-day family itinerary for Ardio: Shanghai, Suzhou, Hangzhou, LEGOLAND and Shanghai Disneyland, 5–16 December 2026. Built by ChinaPal.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function Page() {
  return <ArdioClient images={getImageMap()} />;
}
