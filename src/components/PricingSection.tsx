"use client";

/* ChinaPal PricingSection — simple, clear pricing tiers
   Design: "Calm Authority" — warm grey bg, white cards, red highlight on popular plan
   Single section-level IntersectionObserver — no per-card observers to avoid layout thrashing */

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "per trip",
    tagline: "Solo traveler or couple, simple trip",
    features: [
      "Up to 10 bookings",
      "Train & attraction tickets",
      "Restaurant reservations",
      "Didi booking support",
      "WhatsApp support",
    ],
    cta: "Start my trip",
    highlighted: false,
  },
  {
    name: "Explorer",
    price: "$59",
    period: "per trip",
    tagline: "Families, groups, or multi-city trips",
    features: [
      "Unlimited bookings",
      "Everything in Starter",
      "One-photo passport entry for all travelers",
      "Full itinerary built for you",
      "Alipay & WeChat Pay setup",
      "Emergency rebooking — same day",
      "Priority WhatsApp response",
    ],
    cta: "Start my trip",
    highlighted: true,
  },
  {
    name: "Concierge",
    price: "$149",
    period: "per trip",
    tagline: "Complex trips, high expectations",
    features: [
      "Everything in Explorer",
      "Dedicated advisor, one point of contact",
      "Hotel search & booking",
      "Day-by-day itinerary with timings",
      "24/7 on-trip support",
      "We call ahead for you",
    ],
    cta: "Talk to us",
    highlighted: false,
  },
];

export default function PricingSection() {
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
    <section id="pricing" className="py-24 px-4" style={{ backgroundColor: "oklch(0.985 0.005 80)" }}>
      <div ref={sectionRef} className="max-w-5xl mx-auto">
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
            Pricing
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.18 0.01 260)" }}>
            One fee. Zero hassle.
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "oklch(0.52 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Pay once per trip. No subscriptions, no hidden fees. Most travelers choose Explorer.
          </p>
        </div>

        {/* Cards — staggered via CSS delay, no per-card observers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-2xl p-7 border ${plan.highlighted ? "shadow-xl relative" : "bg-white border-stone-200 shadow-sm"}`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.55s ease ${i * 0.1}s, transform 0.55s ease ${i * 0.1}s`,
                willChange: "opacity, transform",
                ...(plan.highlighted
                  ? { backgroundColor: "oklch(0.48 0.22 25)", borderColor: "oklch(0.48 0.22 25)" }
                  : {}),
              }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm"
                    style={{ color: "oklch(0.48 0.22 25)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className="font-display font-bold text-xl mb-1"
                  style={{ color: plan.highlighted ? "white" : "oklch(0.18 0.01 260)" }}
                >
                  {plan.name}
                </h3>
                <p
                  className="text-xs mb-4"
                  style={{ color: plan.highlighted ? "rgba(255,255,255,0.75)" : "oklch(0.52 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {plan.tagline}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className="font-display font-bold text-4xl"
                    style={{ color: plan.highlighted ? "white" : "oklch(0.18 0.01 260)" }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: plan.highlighted ? "rgba(255,255,255,0.75)" : "oklch(0.52 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <Check
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: plan.highlighted ? "rgba(255,255,255,0.9)" : "oklch(0.48 0.22 25)" }}
                    />
                    <span
                      className="text-sm"
                      style={{
                        color: plan.highlighted ? "rgba(255,255,255,0.9)" : "oklch(0.35 0.01 260)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full font-semibold rounded-full py-3 transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] ${plan.highlighted ? "bg-white" : ""}`}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  ...(plan.highlighted
                    ? { color: "oklch(0.48 0.22 25)" }
                    : { backgroundColor: "oklch(0.48 0.22 25)", color: "white" }),
                }}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm mt-8" style={{ color: "oklch(0.60 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          100% satisfaction guarantee. If we can't sort it, you don't pay.
        </p>
      </div>
    </section>
  );
}
