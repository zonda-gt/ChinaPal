"use client";

import type { ImageMap } from "@/lib/itinerary-images";
import ItineraryPage from "../ItineraryPage";
import { buildBeijingConfig } from "./config";

export default function BeijingClient({ images }: { images: ImageMap }) {
  const config = buildBeijingConfig();
  return <ItineraryPage images={images} config={config} />;
}
