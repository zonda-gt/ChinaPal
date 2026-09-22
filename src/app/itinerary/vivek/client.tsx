"use client";

import type { ImageMap } from "@/lib/itinerary-images";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItineraryPage from "../ItineraryPage";
import VivekPoster from "./poster";
import { buildVivekConfig } from "./config";

export default function VivekClient({ images }: { images: ImageMap }) {
  const config = buildVivekConfig();
  return (
    <>
      <style>{`header button[aria-label="Toggle menu"] { display: none !important; }`}</style>
      <Navbar />
      <VivekPoster />
      <section className="bg-[#F7F5F2] px-4 pb-4 pt-8">
        <div className="mx-auto max-w-[640px]">
          <div className="rounded-2xl border border-[#E8E4DE] bg-white p-6">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#C23845]">For your family, Vivek</p>
            <p className="text-sm leading-7 text-[#444]">{config.meiGreeting}</p>
            <div className="mt-4 grid gap-3 border-t border-[#F0EDE8] pt-4 text-xs leading-6 text-[#666] sm:grid-cols-2">
              <p><strong className="text-[#333]">Your group</strong><br />2 adults · 2 children, ages 10 &amp; 13<br />2 adults aged 65+ · moderate pace</p>
              <p><strong className="text-[#333]">Your Shanghai base</strong><br />Radisson Collection Hotel, Hyland Shanghai<br />505 Nanjing Road East</p>
            </div>
          </div>
          <p className="mb-2 mt-8 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#D0021B]">Daily Plan</p>
          <p className="text-center text-[13px] leading-6 text-[#888]">Choose a day, then tap a stop for its photos, stories and practical details.</p>
        </div>
      </section>
      <ItineraryPage images={images} config={config} leadName="Vivek" chromeless />
      <section className="bg-[#F7F5F2] px-4 pb-12">
        <div className="mx-auto max-w-[640px] space-y-4">
          <div className="rounded-2xl border border-[#E8E4DE] bg-white p-6 text-[13px] leading-6 text-[#666]">
            <h2 className="mb-2 text-base font-bold text-[#333]">A few details to make it yours</h2>
            <p>This is a proposed itinerary. Guide hours, vehicles, train seats, entry reservations, restaurants and optional experiences will be confirmed with the final quote.</p>
            <p className="mt-3">Still to confirm: dietary requirements, mobility preferences, luggage count and the intended venue at 798 Huaihai Road. City vehicle hops and the Suzhou transfers are proposed services; the final quote should specify their scope.</p>
            <p className="mt-3">We have allowed more time for Saturday’s return journey and proposed a 09:15 Sunday airport pickup instead of the draft’s 10:30. All travel times are estimates.</p>
            <a className="mt-5 inline-flex rounded-full bg-[#C23845] px-5 py-2.5 font-semibold text-white" href="https://wa.me/8618201806768?text=Hi!%20I%27d%20like%20to%20discuss%20Vivek%27s%20Shanghai%20and%20Suzhou%20itinerary%20for%20November%2025%E2%80%9329%2C%202026." target="_blank" rel="noopener noreferrer">Discuss this itinerary</a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
