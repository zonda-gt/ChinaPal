"use client";

import type { ImageMap } from "@/lib/itinerary-images";
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
    </section>
    <ItineraryPage images={images} config={config} leadName="Ruijun" chromeless />
    <Footer />
  </>;
}
