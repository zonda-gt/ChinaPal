import type { Metadata } from "next";
import SanjayShanghaiPosterPage from "@/components/SanjayShanghaiPosterPage";

export const metadata: Metadata = {
  title: "Sanjay Family Shanghai Itinerary",
  description:
    "A custom 4-day Shanghai itinerary for Sanjay and family in an editorial poster-style layout.",
};

export default function Page() {
  return <SanjayShanghaiPosterPage />;
}
