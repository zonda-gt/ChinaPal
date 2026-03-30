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
    quote: "Honestly I'd been putting off the train booking for days because 12306 made zero sense. Messaged ChinaPal and had the e-tickets in like 10 minutes. Felt stupid for not doing it sooner lol",
    stars: 5,
    initials: "SM",
  },
  {
    name: "James & Lisa K.",
    location: "Sydney, Australia",
    trip: "Zhangjiajie & Shanghai, 10 days",
    quote: "We sent one photo of our 4 passports and they just booked everything? Trains, tickets, cable cars, all of it. My wife still talks about how easy it was. Super good $59 we spent on the whole trip.",
    stars: 5,
    initials: "JK",
  },
  {
    name: "Emma T.",
    location: "Amsterdam, Netherlands",
    trip: "Solo trip, 8 days",
    quote: "The restaurant recs alone were worth it. Every place was somewhere I never would've found on my own — no English menu, no tourists, amazing food. They just called ahead and reserved. I literally just showed up and ate.",
    stars: 5,
    initials: "ET",
  },
  {
    name: "Mike & Jenny S.",
    location: "Dallas, USA",
    trip: "Beijing, Xi'an & Shanghai",
    quote: "We had a rough idea of what we wanted but didn't know how to structure it. Sent them our dates and wish list and they came back with a day-by-day plan that's great — told us to skip a day in Beijing and add one in Xi'an instead. Glad they did, it was the highlight of the whole trip.",
    stars: 5,
    initials: "MS",
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
    <section className="py-12 md:py-24 px-2 md:px-4" style={{ backgroundColor: "oklch(0.96 0.006 80)" }}>
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
        <div className="grid grid-cols-2 gap-2 md:gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-xl md:rounded-2xl p-2.5 md:p-5 border border-stone-100 shadow-sm flex flex-col"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.55s ease ${i * 0.08}s, transform 0.55s ease ${i * 0.08}s`,
                willChange: "opacity, transform",
              }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-1.5 md:mb-3">
                {Array.from({ length: t.stars }).map((_, si) => (
                  <Star key={si} className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 fill-current" style={{ color: "oklch(0.48 0.22 25)" }} />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-display text-[10px] md:text-sm font-medium italic leading-snug md:leading-relaxed mb-2 md:mb-4 flex-1" style={{ color: "oklch(0.18 0.01 260)" }}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-1.5 md:gap-3">
                <div
                  className="w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ backgroundColor: "oklch(0.48 0.22 25)", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "8px" }}
                >
                  <span className="hidden md:inline text-xs">{t.initials}</span>
                  <span className="md:hidden">{t.initials}</span>
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-[9px] md:text-xs truncate" style={{ color: "oklch(0.18 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t.name}
                  </div>
                  <div className="text-[8px] md:text-xs truncate" style={{ color: "oklch(0.52 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t.location}
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
