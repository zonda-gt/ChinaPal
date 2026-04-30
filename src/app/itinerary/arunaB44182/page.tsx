import type { Metadata } from "next";
import ArunaBChinaPosterPage from "@/components/ArunaBChinaPosterPage";

export const metadata: Metadata = {
  title: "Aruna Group China Itinerary (B)",
  description:
    "Snapshot of the 15-day China itinerary for Aruna's group prior to the 30 Apr edits — Guangzhou, Chongqing, Shanghai, Zhangjiajie, Xi'an and Beijing.",
};

export default function Page() {
  return <ArunaBChinaPosterPage />;
}
