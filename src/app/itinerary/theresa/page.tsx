import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import TheresaClient from "./client";

export const metadata: Metadata = {
  title: "Theresa’s Shanghai Weekend",
  description: "23–25 October 2026: a Shanghai weekend for Theresa and her partner, with photoshoots, the Bund, cafés and cocktails.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default function Page() {
  return <TheresaClient images={getImageMap()} />;
}
