"use client";

import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WA_LINK = "https://wa.me/8618201806768?text=Hi!%20I'd%20like%20to%20plan%20a%20trip%20to%20China";

export default function StartPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(0.985 0.005 80)" }}>
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-16">
        <div className="max-w-md w-full text-center">
          {/* WhatsApp icon */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "#25D366" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3" style={{ color: "oklch(0.18 0.01 260)" }}>
            Connect on WhatsApp
          </h1>

          <p className="font-body text-base mb-8 leading-relaxed" style={{ color: "oklch(0.52 0.01 260)" }}>
            for free. Tell us your dates and cities, and we&apos;ll get you sorted.
          </p>

          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white font-semibold px-10 py-4 rounded-full text-lg transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] font-body"
            style={{ backgroundColor: "#25D366" }}
          >
            Open WhatsApp
            <ArrowRight className="w-5 h-5" />
          </a>

          <p className="font-body text-xs mt-6" style={{ color: "oklch(0.60 0.01 260)" }}>
            Don&apos;t have WhatsApp?{" "}
            <a href="mailto:hello@chinapal.co" className="underline hover:no-underline" style={{ color: "oklch(0.48 0.22 25)" }}>
              Email us instead
            </a>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 mt-10 mb-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "oklch(0.85 0.005 260)" }} />
            <span className="font-body text-xs uppercase tracking-widest" style={{ color: "oklch(0.60 0.01 260)" }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "oklch(0.85 0.005 260)" }} />
          </div>

          <p className="font-body text-sm mb-5" style={{ color: "oklch(0.45 0.01 260)" }}>
            Get our app for on-the-go help during your trip
          </p>

          <div className="flex justify-center gap-3">
            <button type="button" data-ph-capture-attribute-app-store="ios" className="cursor-pointer bg-transparent border-0 p-0">
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                className="h-10"
              />
            </button>
            <button type="button" data-ph-capture-attribute-app-store="android" className="cursor-pointer bg-transparent border-0 p-0">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-10"
              />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
