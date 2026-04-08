"use client";

import type { ImageMap } from "@/lib/itinerary-images";
import ItineraryPage from "../ItineraryPage";
import { buildChengduConfig } from "./config";

export default function ChengduClient({ images }: { images: ImageMap }) {
  const config = buildChengduConfig();
  return <ItineraryPage images={images} config={config} />;
}
