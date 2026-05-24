"use client";

/* ChinaPal FeaturesSection — 8 key features with icons
   Design: "Calm Authority" — white cards, red icon accents
   Single section-level IntersectionObserver — no per-card observers to avoid layout thrashing */

import { useEffect, useRef, useState } from "react";
import { ClipboardCheck, Utensils, Ticket, MessageCircle } from "lucide-react";

const features = [
  {
    icon: ClipboardCheck,
    title: "Itinerary Review",
    desc: "Send us your draft plan. We'll tell you what to skip, what to add, and how to make the day-by-day actually flow.",
  },
  {
    icon: Utensils,
    title: "Local Recommendations",
    desc: "Restaurants, cafes, neighborhoods, day trips. Local judgment instead of tourist-trap top-10 lists.",
  },
  {
    icon: Ticket,
    title: "Ticket Guidance",
    desc: "Which Trip.com option, which Klook ticket, which gate. You book on the platforms you trust — we tell you which one to pick.",
  },
  {
    icon: MessageCircle,
    title: "Text a Local",
    desc: "Translate a menu, decode a sign, ask \"what should we do next?\" — real humans on app chat or WhatsApp.",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-12 md:py-24 px-2 md:px-4 bg-white">
      <div ref={sectionRef} className="max-w-6xl mx-auto">
        {/* Title */}
        <div
          className="text-center mb-8 md:mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border"
            style={{ backgroundColor: "oklch(0.92 0.05 25)", color: "oklch(0.48 0.22 25)", borderColor: "oklch(0.85 0.08 25)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            How we help
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.18 0.01 260)" }}>
            Local judgment. By text.
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "oklch(0.52 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Book on platforms you trust. Use ChinaPal to plan smarter, choose better, and text a local when you need help.
          </p>
        </div>

        {/* Cards grid — staggered via CSS delay, no per-card observers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl md:rounded-2xl p-2.5 md:p-6 border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 group"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s, box-shadow 0.3s ease`,
                  willChange: "opacity, transform",
                }}
              >
                <div
                  className="w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: "oklch(0.92 0.05 25)" }}
                >
                  <Icon className="w-3.5 h-3.5 md:w-5 md:h-5" style={{ color: "oklch(0.48 0.22 25)" }} />
                </div>
                <h3 className="font-display font-bold text-xs md:text-lg mb-1 md:mb-2" style={{ color: "oklch(0.18 0.01 260)" }}>
                  {feature.title}
                </h3>
                <p className="text-[10px] md:text-sm leading-snug md:leading-relaxed" style={{ color: "oklch(0.52 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
