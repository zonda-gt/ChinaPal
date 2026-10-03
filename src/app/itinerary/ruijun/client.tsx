"use client";

import type { ImageMap } from "@/lib/itinerary-images";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItineraryPage from "../ItineraryPage";
import { buildRuijunConfig } from "./config";
import RuijunPoster from "./poster";

export default function RuijunClient({ images }: { images: ImageMap }) {
  const config = buildRuijunConfig();
  return <>
    <Navbar />
    <RuijunPoster />
    <section id="daily-plan" className="scroll-mt-20 bg-[#F7F5F2] px-4 pb-4 pt-8 text-center">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#C23845]">Your daily plan · 10–15 October</p>
      <p className="mx-auto mt-3 max-w-lg text-[13px] leading-relaxed text-stone-500">Choose a day and open a stop for details. Train times are booked; meals and optional outings can adapt to everyone’s energy.</p>
      <p className="mx-auto mt-2 max-w-lg text-[11px] leading-relaxed text-stone-500">~ means approximate travel time. These are planning estimates, not live traffic times. Metro estimates include walking and waiting; allow extra for queues, rest stops and heavy traffic. Restaurant transfers depend on the confirmed branch.</p>
      <Link href="/itinerary/ruijun/recommendations" className="mt-4 inline-flex rounded-full border border-[#D8B7BB] px-4 py-2 text-[12px] font-semibold text-[#902F3D]">Explore our show, café & qipao recommendations →</Link>
    </section>
    <ItineraryPage images={images} config={config} leadName="Ruijun" chromeless />
    <Footer />
  </>;
}
