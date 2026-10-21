"use client";

import { Check, MessageCircle } from "lucide-react";
import type { ImageMap } from "@/lib/itinerary-images";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItineraryPage from "../ItineraryPage";
import DoAnhTuPoster from "./poster";
import { buildDoAnhTuConfig, finalDetails } from "./config";

const FONT = "'Plus Jakarta Sans', sans-serif";

export default function DoAnhTuClient({ images }: { images: ImageMap }) {
  const config = buildDoAnhTuConfig();
  return (
    <>
      <style>{`
        header button[aria-label="Toggle menu"] { display: none !important; }
      `}</style>
      <Navbar />
      <DoAnhTuPoster />
      <div style={{ background: "#F7F5F2", padding: "32px 16px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center" }}>
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: "#D0021B", opacity: 0.4 }} />
            <p style={{ fontSize: 11, fontWeight: 800, color: "#D0021B", textTransform: "uppercase", letterSpacing: "0.2em", margin: 0 }}>Daily Plan</p>
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: "#D0021B", opacity: 0.4 }} />
          </div>
          <p style={{ fontSize: 13, color: "#888", margin: "12px 0 0", fontFamily: FONT, lineHeight: 1.6 }}>
            Every stop has its Chinese name and address for Amap or DiDi, and the metro line, exit or taxi time to get there.
            Journey times were checked in Amap for the time of day you’ll travel.
          </p>
        </div>
      </div>
      <ItineraryPage images={images} config={config} leadName="Do Anh Tu" chromeless />
      <section style={{ background: "#F7F5F2", padding: "8px 16px 48px", fontFamily: FONT }}>
        <div style={{ maxWidth: 640, margin: "0 auto", background: "#fff", border: "1px solid #F0EDE8", borderRadius: 18, padding: "20px 20px 16px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: "#D0021B", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 6px" }}>Still to confirm</p>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, margin: "0 0 12px", color: "#1A1A1A" }}>A few details for us to finalise</h2>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {finalDetails.map((detail) => (
              <li key={detail} style={{ display: "flex", gap: 10, padding: "8px 0", borderTop: "1px solid #F5F3F0", fontSize: 13, lineHeight: 1.55, color: "#444" }}>
                <Check size={15} color="#D0021B" style={{ flexShrink: 0, marginTop: 3 }} />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
          <p style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12.5, color: "#666", margin: "12px 0 0" }}>
            <MessageCircle size={14} color="#D0021B" /> Message us on WeChat any time before or during your trip.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
