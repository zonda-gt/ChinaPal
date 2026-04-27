import type { Metadata } from "next";
import ArunaChinaPosterPage from "@/components/ArunaChinaPosterPage";

export const metadata: Metadata = {
  title: "Aruna Group China Itinerary",
  description:
    "A custom 18-day China itinerary for Aruna's 18-pax group — Beijing, Xi'an, Shanghai, Zhangjiajie, Chongqing and Guangzhou, in an editorial poster-style layout.",
};

export default function Page() {
  return <ArunaChinaPosterPage />;
}
