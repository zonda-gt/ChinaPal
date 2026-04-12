"use client";

import type { ImageMap } from "@/lib/itinerary-images";
import ItineraryPage from "../ItineraryPage";
import { buildGiovanniConfig } from "./config";

export default function GiovanniClient({ images }: { images: ImageMap }) {
  const config = buildGiovanniConfig();
  return <ItineraryPage images={images} config={config} leadName="Giovanni" />;
}
