import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import AntonioClient from "./client";

export const metadata: Metadata = {
  title: "Antonio’s Shanghai Escape",
  description: "11–13 November 2026: Antonio’s personalised Shanghai itinerary, with local flavours, neighbourhood walks and a private day with Steven.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default function Page() {
  return <AntonioClient images={getImageMap()} />;
}
