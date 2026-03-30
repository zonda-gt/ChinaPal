"use client";

/* ChinaPal TestimonialsSection — social proof from travelers
   Design: "Calm Authority" — warm grey bg, white quote cards, Fraunces italic quotes
   Single section-level IntersectionObserver — no per-card observers to avoid layout thrashing */

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    location: "London, UK",
    trip: "Beijing & Xi'an, 12 days",
    quote: "I'd spent 3 evenings trying to figure out 12306. Sent ChinaPal one message and had e-tickets in 10 minutes. I just showed up and got on the train.",
    stars: 5,
    initials: "SM",
  },
  {
    name: "James & Lisa K.",
    location: "Sydney, Australia",
    trip: "Zhangjiajie & Shanghai, 10 days",
    quote: "One photo of 4 passports. Every ticket, train, and restaurant booked. I genuinely don't know how we used to do this trip without them.",
    stars: 5,
    initials: "JK",
  },
  {
    name: "David R.",
    location: "Toronto, Canada",
    trip: "Family of 4, 14 days",
    quote: "Train cancelled with 20 minutes notice. ChinaPal had us on the next one and sent a screenshot in Chinese to show the staff. I didn't even have to speak.",
    stars: 5,
    initials: "DR",
  },
  {
    name: "Emma T.",
    location: "Amsterdam, Netherlands",
    trip: "Solo trip, 8 days",
    quote: "Every restaurant was a local place — no English menus, no tourists, incredible food. ChinaPal called ahead and reserved the table. I just walked in.",
    stars: 5,
    initials: "ET",
  },
];

export default function TestimonialsSection() {
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
    <section className="py-24 px-4" style={{ backgroundColor: "oklch(0.96 0.006 80)" }}>
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
            Traveler stories
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.18 0.01 260)" }}>
            What travelers say.
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "oklch(0.52 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Every one of them says the same thing: they wish they'd found us sooner.
          </p>
        </div>

        {/* Cards — staggered via CSS delay, no per-card observers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 border border-stone-100 shadow-sm flex flex-col"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.55s ease ${i * 0.08}s, transform 0.55s ease ${i * 0.08}s`,
                willChange: "opacity, transform",
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, si) => (
                  <Star key={si} className="w-4 h-4 fill-current" style={{ color: "oklch(0.48 0.22 25)" }} />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-display text-lg font-medium italic leading-relaxed mb-6 flex-1" style={{ color: "oklch(0.18 0.01 260)" }}>
                "{t.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: "oklch(0.48 0.22 25)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "oklch(0.18 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t.name}
                  </div>
                  <div className="text-xs" style={{ color: "oklch(0.52 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t.location} · {t.trip}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
