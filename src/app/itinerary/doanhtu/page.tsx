import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import DoAnhTuClient from "./client";

export const metadata: Metadata = {
  title: "Do Anh Tu’s Shanghai & Hangzhou Week",
  description: "24 October – 1 November 2026: a personalised Shanghai and Hangzhou itinerary with beauty shopping, photo spots, West Lake and red pandas.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default function Page() {
  return <DoAnhTuClient images={getImageMap()} />;
}
