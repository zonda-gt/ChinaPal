"use client";

/* ChinaPal FeaturesSection — 8 key features with icons
   Design: "Calm Authority" — white cards, red icon accents
   Single section-level IntersectionObserver — no per-card observers to avoid layout thrashing */

import { useEffect, useRef, useState } from "react";
import {
  Ticket, Train, UtensilsCrossed, Car, Map, AlertCircle, CreditCard, Camera
} from "lucide-react";

const features = [
  {
    icon: Ticket,
    title: "Attraction Tickets",
    desc: "Right gate, right time, right combo. We navigate Klook, Mafengwo, and official sites so you don't have to.",
  },
  {
    icon: Train,
    title: "Train Booking",
    desc: "We pick the best train, book the seats together, and send you the e-tickets. 12306 is our problem, not yours.",
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurants",
    desc: "We read Dianping, call ahead, and reserve a table. You get a local gem, not a tourist trap.",
  },
  {
    icon: Car,
    title: "Didi & Transport",
    desc: "We book the ride, send the driver your location in Chinese, and call at pickup time if needed.",
  },
  {
    icon: Map,
    title: "Full Trip Planning",
    desc: "Tell us your cities and dates. We build the itinerary, sequence the trains, and flag what to skip.",
  },
  {
    icon: AlertCircle,
    title: "Day-of Support",
    desc: "Train cancelled? Entrance closed? We're on it — rebooked and a Chinese screenshot in your hand in minutes.",
  },
  {
    icon: CreditCard,
    title: "Alipay & WeChat Pay",
    desc: "We walk you through setup so you can pay like a local. No cash queues, no declined cards.",
  },
  {
    icon: Camera,
    title: "Passport Entry",
    desc: "One photo of all passports. We fill in every form across every platform. You type nothing.",
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
    <section id="features" className="py-24 px-4 bg-white">
      <div ref={sectionRef} className="max-w-6xl mx-auto">
        {/* Title */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border"
            style={{ backgroundColor: "oklch(0.92 0.05 25)", color: "oklch(0.48 0.22 25)", borderColor: "oklch(0.85 0.08 25)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            What we handle
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.18 0.01 260)" }}>
            We handle the hard parts.
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "oklch(0.52 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Every booking that takes you an hour of confusion takes us one message. Here's what's included.
          </p>
        </div>

        {/* Cards grid — staggered via CSS delay, no per-card observers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 group"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s, box-shadow 0.3s ease`,
                  willChange: "opacity, transform",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: "oklch(0.92 0.05 25)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "oklch(0.48 0.22 25)" }} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: "oklch(0.18 0.01 260)" }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.52 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
