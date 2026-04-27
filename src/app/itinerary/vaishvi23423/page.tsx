import type { Metadata } from "next";
import VaishviChinaPosterPage from "@/components/VaishviChinaPosterPage";

export const metadata: Metadata = {
  title: "Vaishvi Family China Itinerary",
  description:
    "A custom 16-day China itinerary for Vaishvi and family — Beijing, Xi'an, Shanghai and Hong Kong, in an editorial poster-style layout.",
};

export default function Page() {
  return <VaishviChinaPosterPage />;
}
