"use client";

/* ChinaPal PricingSection — simple, clear pricing tiers
   Design: "Calm Authority" — warm grey bg, white cards, red highlight on popular plan
   Single section-level IntersectionObserver — no per-card observers to avoid layout thrashing */

import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll to Explorer (2nd card) on mobile by default
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || window.innerWidth >= 768) return;
    const card = el.children[1] as HTMLElement | undefined;
    if (card) {
      el.scrollLeft = card.offsetLeft - (el.offsetWidth - card.offsetWidth) / 2;
    }
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
        <div className="relative">
          {/* Left arrow — mobile only */}
          <button
            aria-label="Previous plan"
            className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 shadow border border-stone-200 flex items-center justify-center"
            onClick={() => {
              const el = scrollRef.current;
              if (el) el.scrollBy({ left: -(el.offsetWidth * 0.65), behavior: "smooth" });
            }}
          >
            <ChevronLeft className="w-4 h-4" style={{ color: "oklch(0.35 0.01 260)" }} />
          </button>
          {/* Right arrow — mobile only */}
          <button
            aria-label="Next plan"
            className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 shadow border border-stone-200 flex items-center justify-center"
            onClick={() => {
              const el = scrollRef.current;
              if (el) el.scrollBy({ left: el.offsetWidth * 0.65, behavior: "smooth" });
            }}
          >
            <ChevronRight className="w-4 h-4" style={{ color: "oklch(0.35 0.01 260)" }} />
          </button>

        <div ref={scrollRef} className="flex md:grid md:grid-cols-3 gap-3 md:gap-6 items-start overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-2 px-6 md:mx-0 md:px-0 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-xl md:rounded-2xl p-3.5 md:p-7 border flex-shrink-0 w-[65vw] md:w-auto snap-center ${plan.highlighted ? "shadow-xl relative" : "bg-white border-stone-200 shadow-sm"}`}
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
                <div className="absolute -top-2.5 md:-top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-sm"
                    style={{ color: "oklch(0.48 0.22 25)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-3 md:mb-6">
                <h3
                  className="font-display font-bold text-base md:text-xl mb-0.5 md:mb-1"
                  style={{ color: plan.highlighted ? "white" : "oklch(0.18 0.01 260)" }}
                >
                  {plan.name}
                </h3>
                <p
                  className="text-[10px] md:text-xs mb-2 md:mb-4"
                  style={{ color: plan.highlighted ? "rgba(255,255,255,0.75)" : "oklch(0.52 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {plan.tagline}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className="font-display font-bold text-2xl md:text-4xl"
                    style={{ color: plan.highlighted ? "white" : "oklch(0.18 0.01 260)" }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-[10px] md:text-sm"
                    style={{ color: plan.highlighted ? "rgba(255,255,255,0.75)" : "oklch(0.52 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-1.5 md:space-y-3 mb-4 md:mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-1.5 md:gap-2.5">
                    <Check
                      className="w-3 h-3 md:w-4 md:h-4 mt-0.5 flex-shrink-0"
                      style={{ color: plan.highlighted ? "rgba(255,255,255,0.9)" : "oklch(0.48 0.22 25)" }}
                    />
                    <span
                      className="text-[11px] md:text-sm leading-tight"
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
                asChild
                className={`w-full font-semibold rounded-full py-2 md:py-3 text-xs md:text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] ${plan.highlighted ? "bg-white" : ""}`}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  ...(plan.highlighted
                    ? { color: "oklch(0.48 0.22 25)" }
                    : { backgroundColor: "oklch(0.48 0.22 25)", color: "white" }),
                }}
              >
                <Link href="/start">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
        </div>

        <p className="text-center text-sm mt-8" style={{ color: "oklch(0.60 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          100% satisfaction guarantee. If we can't sort it, you don't pay.
        </p>
      </div>
    </section>
  );
}
