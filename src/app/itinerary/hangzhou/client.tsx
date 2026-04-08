"use client";

import type { ImageMap } from "@/lib/itinerary-images";
import ItineraryPage from "../ItineraryPage";
import { buildHangzhouConfig } from "./config";

export default function HangzhouClient({ images }: { images: ImageMap }) {
  const config = buildHangzhouConfig();
  return <ItineraryPage images={images} config={config} />;
}
