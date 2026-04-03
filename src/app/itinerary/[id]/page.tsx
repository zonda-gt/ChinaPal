import type { Metadata } from "next";
import { getImageMap } from "@/lib/itinerary-images";
import ItineraryPage from "../ItineraryPage";
import { notFound } from "next/navigation";

/* Custom itinerary links for individual leads.
   Add new leads here: id → { name, waMessage } */
const LEADS: Record<string, { name: string; waMessage?: string }> = {
  "m7k2x": { name: "Michał" },
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const lead = LEADS[id];
  if (!lead) return { title: "ChinaPal Itinerary" };
  return {
    title: `${lead.name}'s Zhangjiajie Itinerary — ChinaPal`,
    description: `A personalised Zhangjiajie itinerary for ${lead.name}, built by ChinaPal.`,
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = LEADS[id];
  if (!lead) notFound();

  const images = getImageMap();
  return <ItineraryPage images={images} leadName={lead.name} />;
}
