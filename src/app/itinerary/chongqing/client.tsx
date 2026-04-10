"use client";

import type { ImageMap } from "@/lib/itinerary-images";
import ItineraryPage from "../ItineraryPage";
import { buildChongqingConfig } from "./config";

export default function ChongqingClient({ images }: { images: ImageMap }) {
  const config = buildChongqingConfig();
  return <ItineraryPage images={images} config={config} />;
}
