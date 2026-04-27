import type { Metadata } from "next";
import GuangzhouHongKongPosterPage from "@/components/GuangzhouHongKongPosterPage";

export const metadata: Metadata = {
  title: "Guangzhou & Hong Kong · 13-Day Draft Itinerary",
  description:
    "A 13-day draft itinerary covering Guangzhou and Hong Kong, with three open days for an optional extension to Guilin, Xi'an, or Shanghai.",
};

export default function Page() {
  return <GuangzhouHongKongPosterPage />;
}
