"use client";

import type { ImageMap } from "@/lib/itinerary-images";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GiovanniPoster from "@/components/GiovanniPoster";
import ItineraryPage from "../ItineraryPage";
import { buildGiovanniConfig } from "./config";

export default function GiovanniClient({ images }: { images: ImageMap }) {
  const config = buildGiovanniConfig();
  return (
    <>
      <Navbar />
      <GiovanniPoster />
      <div style={{ background: "#F7F5F2", padding: "32px 16px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center" }}>
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: "#D0021B", opacity: 0.4 }} />
            <p style={{ fontSize: 11, fontWeight: 800, color: "#D0021B", textTransform: "uppercase", letterSpacing: "0.2em", margin: 0 }}>
              Daily Plan
            </p>
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: "#D0021B", opacity: 0.4 }} />
          </div>
          <p style={{ fontSize: 13, color: "#888", margin: "12px 0 0", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Hour-by-hour logistics below — every ticket, train, restaurant, and transfer.
          </p>
        </div>
      </div>
      <ItineraryPage images={images} config={config} leadName="Giovanni" chromeless />
      <Footer />
    </>
  );
}
