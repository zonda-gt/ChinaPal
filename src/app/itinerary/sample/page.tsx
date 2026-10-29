import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import SampleClient from "./client";

/* The sample itinerary we send to leads. Add ?name=Sarah to personalise it. */
export const metadata: Metadata = {
  title: "China in 10 Days: Beijing, Chongqing & Shanghai — ChinaPal",
  description: "A sample 10-day ChinaPal itinerary: the Forbidden City and the Great Wall, Chongqing hotpot and Hongyadong at night, and Shanghai’s Bund, day by day.",
  openGraph: {
    title: "China in 10 Days: Beijing, Chongqing & Shanghai",
    description: "A sample ChinaPal itinerary, day by day, with every address, ticket and journey planned.",
    images: ["/uploads/itinerary/sample/mutianyu.webp"],
  },
};

export const dynamic = "force-dynamic";

export default function Page() {
  return <SampleClient images={getImageMap()} />;
}
