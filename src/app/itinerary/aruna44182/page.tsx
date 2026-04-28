import type { Metadata } from "next";
import ArunaChinaPosterPage from "@/components/ArunaChinaPosterPage";

export const metadata: Metadata = {
  title: "Aruna Group China Itinerary",
  description:
    "A custom 15-day China itinerary for Aruna's group — Guangzhou, Chongqing, Shanghai, Zhangjiajie, Xi'an and Beijing, in an editorial poster-style layout.",
};

export default function Page() {
  return <ArunaChinaPosterPage />;
}
