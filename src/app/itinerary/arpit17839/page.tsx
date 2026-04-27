import type { Metadata } from "next";
import ArpitBeijingPosterPage from "@/components/ArpitBeijingPosterPage";

export const metadata: Metadata = {
  title: "Arpit Group · Beijing 2-Day Itinerary",
  description:
    "Custom 2-day Beijing itinerary for Arpit's group of 8 (4 seniors), May 5-6 2026 — Forbidden City, Mutianyu Great Wall, Temple of Heaven.",
};

export default function Page() {
  return <ArpitBeijingPosterPage />;
}
