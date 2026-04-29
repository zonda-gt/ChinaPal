import type { Metadata } from "next";
import GauravShanghaiPosterPage from "@/components/GauravShanghaiPosterPage";

export const metadata: Metadata = {
  title: "Gaurav Family · Shanghai 6-Night Itinerary",
  description:
    "Custom 6-night Shanghai family itinerary for Gaurav (2 adults + 2 kids), 16-22 May 2026 — Disneyland, Legoland, the Bund, and Holiday Inn Jing'an.",
};

export default function Page() {
  return <GauravShanghaiPosterPage />;
}
