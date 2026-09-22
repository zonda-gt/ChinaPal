"use client";

import type { ImageMap } from "@/lib/itinerary-images";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItineraryPage from "../ItineraryPage";
import { buildXhsConfig } from "./config";
import XhsPoster from "./poster";

export default function XhsClient({ images }: { images: ImageMap }) {
  const config = buildXhsConfig();
  return (
    <>
      <Navbar />
      <XhsPoster config={config} />
      <section id="daily-plan" className="scroll-mt-20 bg-[#F7F5F2] px-4 pb-4 pt-8 text-center">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#C23845]">Your daily plan</p>
        <p className="mx-auto mt-3 max-w-lg text-[13px] leading-relaxed text-stone-500">Choose a day, then open each stop for the details. Timings are flexible until your flights and meetings are confirmed.</p>
      </section>
      <ItineraryPage images={images} config={config} chromeless />
      <Footer />
    </>
  );
}
