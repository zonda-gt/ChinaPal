"use client";

/* eslint-disable @next/next/no-img-element */

import { MessageCircle } from "lucide-react";
import type { ImageMap } from "@/lib/itinerary-images";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItineraryPage from "../ItineraryPage";
import ArdioPoster from "./poster";
import { buildArdioConfig, recommended } from "./config";

const FONT = "'Plus Jakarta Sans', sans-serif";

export default function ArdioClient({ images, withOptions = false }: { images: ImageMap; withOptions?: boolean }) {
  const config = buildArdioConfig(withOptions);
  return (
    <>
      <style>{`
        header button[aria-label="Toggle menu"] { display: none !important; }
      `}</style>
      <Navbar />
      <ArdioPoster />
      <div style={{ background: "#F7F5F2", padding: "32px 16px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center" }}>
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: "#D0021B", opacity: 0.4 }} />
            <p style={{ fontSize: 11, fontWeight: 800, color: "#D0021B", textTransform: "uppercase", letterSpacing: "0.2em", margin: 0 }}>Daily Plan</p>
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: "#D0021B", opacity: 0.4 }} />
          </div>
          <p style={{ fontSize: 13, color: "#888", margin: "12px 0 0", fontFamily: FONT, lineHeight: 1.6 }}>
            Every stop has its Chinese name and address for Amap or DiDi, with the taxi time first and the metro as a backup.
            Journey times were checked in Amap for the time of day you’ll travel, and each day leaves time for naps.
            {withOptions && <><br /><br /><b style={{ color: "#B45309" }}>★ Our pick</b> is what we recommend. Where you see <b style={{ color: "#B45309" }}>+ other options</b>, swipe the card to see a different choice for the same time, such as one for a rainy day or tired kids.</>}
          </p>
        </div>
      </div>
      <ItineraryPage images={images} config={config} leadName="Ardio" chromeless />
      <RecommendedPlaces />
      <Footer />
    </>
  );
}

/* Places we like but left out of the daily plan, as tall cards to swipe
   through, in the style of the main itinerary page's "You could also do". */
function RecommendedPlaces() {
  return (
    <section style={{ background: "#F7F5F2", padding: "8px 0 48px", fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Recommended places</p>
            <span style={{ fontSize: 10, background: "#FFF1F3", color: "#D0021B", fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>If you have time</span>
          </div>
          <p style={{ fontSize: 12, color: "#888", margin: 0, lineHeight: 1.4 }}>More places we like in Shanghai, Suzhou and Hangzhou. Tell us if you’d like any of them added to a day.</p>
        </div>
        <div className="itinerary-options-row" style={{ display: "flex", gap: 12, padding: "0 16px 4px", overflowX: "auto", scrollbarWidth: "none", scrollSnapType: "x mandatory", scrollPaddingLeft: 16 }}>
          {recommended.map((place) => (
            <div key={place.id} style={{ flexShrink: 0, width: 220, scrollSnapAlign: "start", background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: "1px solid #F0EDE8" }}>
              <div style={{ height: 240, position: "relative", overflow: "hidden" }}>
                <img src={place.image} alt={place.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%)" }} />
                <span style={{ position: "absolute", top: 10, left: 10, fontSize: 10, fontWeight: 800, color: "#1A1A1A", background: "rgba(255,255,255,0.92)", padding: "3px 8px", borderRadius: 20 }}>{place.city}</span>
                <p style={{ position: "absolute", bottom: 8, left: 10, right: 10, fontSize: 10, color: "rgba(255,255,255,0.95)", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.35 }}>{place.tag}</p>
              </div>
              <div style={{ padding: "12px 14px 14px" }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#1A1A1A", margin: "0 0 5px", fontFamily: "'Fraunces', serif", lineHeight: 1.2 }}>{place.title}</p>
                <p style={{ fontSize: 12, color: "#666", margin: "0 0 10px", lineHeight: 1.5 }}>{place.desc}</p>
                <div style={{ background: "#FFF8F0", borderRadius: 10, padding: "8px 10px", display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <MessageCircle size={13} color="#B45309" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 11, color: "#7A5C3A", margin: 0, lineHeight: 1.45 }}>{place.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", fontSize: 12.5, color: "#666", margin: "20px 16px 0" }}>
          <MessageCircle size={14} color="#D0021B" /> Message us any time before or during your trip.
        </p>
      </div>
    </section>
  );
}
