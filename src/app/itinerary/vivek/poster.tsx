"use client";

/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Dancing_Script, DM_Sans } from "next/font/google";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: "700",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const photo = (name: string) => `/uploads/itinerary/vivek/${name}.webp`;
const CAROUSEL_IMAGES = [
  { image: photo("the-louis"), label: "The Louis · HKRI Taikoo Hui, Shanghai" },
  { image: photo("pingjiang-road"), label: "Pingjiang Road · Suzhou" },
  { image: photo("jingan-temple"), label: "Jing’an Temple · Shanghai" },
  { image: photo("suzhou-museum"), label: "Suzhou Museum · Suzhou" },
];

interface Attraction { nameEn: string; image: string; }
const cities = [
  { name: "Shanghai", days: "FRI · NOV 27", small: [
    { nameEn: "Jing’an Temple", image: photo("jingan-temple") },
    { nameEn: "The Louis · LV Ship", image: photo("the-louis") },
  ], featured: { nameEn: "Sinan Mansions", image: photo("sinan-mansions") } },
  { name: "Suzhou", days: "SAT · NOV 28", small: [
    { nameEn: "Suzhou Museum", image: photo("suzhou-museum") },
    { nameEn: "Lion Grove Garden", image: photo("lion-grove") },
  ], featured: { nameEn: "Pingjiang Road", image: photo("pingjiang-road") } },
];
const cityItineraries = [
  { cityName: "Your Shanghai base", days: [
    { day: "NOV 25", title: "Welcome to Shanghai", items: ["CX360 · arrives PVG at 16:15 from Hong Kong", "Private airport transfer requested for six + luggage", "Radisson Collection Hotel, Hyland Shanghai"] },
    { day: "NOV 26", title: "A day of your own", items: ["Thursday stays with your existing plans", "No guide scheduled · take the day at your pace"] },
  ] },
  { cityName: "Two days with your guide", days: [
    { day: "NOV 27", title: "Shanghai · food, streets & stories", items: ["Jing’an Temple → the LV ship → Starbucks Roastery", "798 Huaihai Road · Harbin bakery · seated lunch", "Fuxing Park → Sinan Mansions → Xintiandi", "Short vehicle hops and time for tea along the way"] },
    { day: "NOV 28", title: "Suzhou · gardens & canals", items: ["High-speed train + private station transfers proposed", "Suzhou Museum → Lion Grove Garden", "Lunch and a gentle Pingjiang Road stroll", "Optional canal boat and pingtan tea session", "Aim to return to the Shanghai hotel around 18:30"] },
  ] },
  { cityName: "Homeward", days: [
    { day: "NOV 29", title: "A comfortable send-off", items: ["09:15 hotel pickup proposed · final time to confirm", "CX367 · departs PVG at 13:45 for Hong Kong"] },
  ] },
];

function AttractionCard({
  attraction,
  fullWidth = false,
}: {
  attraction: Attraction;
  fullWidth?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-sm bg-white p-2 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
    >
      <div className="px-2 py-2 text-center">
        <p className="block text-[13px] font-semibold leading-tight text-[#912F34]">
          {attraction.nameEn}
        </p>
      </div>
      <img
        src={attraction.image}
        alt={attraction.nameEn}
        className={fullWidth ? "h-40 w-full rounded-[2px] object-cover" : "h-28 w-full rounded-[2px] object-cover"}
      />
    </motion.div>
  );
}

function FeaturedAttractionCard({
  attraction,
  reverse = false,
}: {
  attraction: Attraction;
  reverse?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-sm bg-white p-2 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
    >
      <div
        className={`grid items-center gap-3 ${
          reverse ? "grid-cols-[1.45fr_1fr]" : "grid-cols-[1fr_1.45fr]"
        }`}
      >
        {reverse ? (
          <>
            <img
              src={attraction.image}
              alt={attraction.nameEn}
              className="h-28 w-full rounded-[2px] object-cover"
            />
            <div className="px-3 text-center">
              <p className="text-[17px] font-semibold leading-tight text-[#912F34]">
                {attraction.nameEn}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="px-3 text-center">
              <p className="text-[17px] font-semibold leading-tight text-[#912F34]">
                {attraction.nameEn}
              </p>
            </div>
            <img
              src={attraction.image}
              alt={attraction.nameEn}
              className="h-28 w-full rounded-[2px] object-cover"
            />
          </>
        )}
      </div>
    </motion.div>
  );
}

function DayBadge({ label }: { label: string }) {
  const compactLabel = label.replace(" ", "");
  return (
    <span className="inline-flex shrink-0 rounded-full bg-white px-3 py-1 text-[13px] font-extrabold leading-none tracking-[0.02em] text-[#C23845]">
      {compactLabel}
    </span>
  );
}

export default function VivekPoster() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const goToSlide = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ left: index * scroller.clientWidth, behavior: "smooth" });
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scroller = event.currentTarget;
    const next = Math.round(scroller.scrollLeft / scroller.clientWidth);
    if (next !== carouselIndex) setCarouselIndex(next);
  };

  return (
    <div className={`${dmSans.className} bg-stone-100 px-4 py-6`}>
      <div className="mx-auto max-w-[420px] space-y-4">
        {/* ── Product carousel hero ── */}
        <section className="-mx-4 overflow-hidden bg-white">
          <div className="relative">
            <div
              ref={scrollerRef}
              onScroll={handleScroll}
              className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ touchAction: "pan-x pan-y pinch-zoom" }}
            >
              {CAROUSEL_IMAGES.map((slide, index) => (
                <img
                  key={index}
                  src={slide.image}
                  alt={slide.label}
                  className="h-[500px] w-full shrink-0 snap-center snap-always object-cover"
                  draggable={false}
                />
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3">
              {CAROUSEL_IMAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-3 w-3 rounded-full border border-white/70 ${
                    carouselIndex === index ? "bg-[#C23845]" : "bg-white"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-white px-5 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C23845]">Prepared for Vivek · Personal itinerary proposal</p>
            <div className="space-y-3">
              <h2 className="text-[17px] font-extrabold leading-tight text-[#333333]">
                Vivek&apos;s Family Trip · 5 Days, 4 Nights
              </h2>
              <p className="text-[13px] font-normal leading-snug text-[#4A4A4A]">
                Shanghai · Suzhou · 6 guests · November 25–29, 2026
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Two guided days proposed",
                "Private airport transfers",
                "A pace for three generations",
                "Fully customisable",
              ].map((tag) => (
                <span
                  key={tag}
                  className="border border-[#F0C8D1] px-2 py-1 text-[11px] font-semibold text-[#D3567E]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Red destination poster ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="overflow-hidden rounded-xl bg-[#C23845] p-4 shadow-md"
        >
          <div className="px-2 pb-5 pt-3 text-center">
            <h1
              className={`${dancingScript.className} text-6xl leading-none text-white`}
            >
              China
            </h1>
            <div className="mx-auto mt-4 flex max-w-[220px] items-center gap-3">
              <div className="h-px flex-1 bg-white/40" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
                Two Cities · One Family
              </p>
              <div className="h-px flex-1 bg-white/40" />
            </div>
            <p className="mt-2 text-[13px] font-semibold tracking-wide text-white/85">
              Top Sights
            </p>
          </div>

          <div className="space-y-6">
            {cities.map((city, cityIdx) => (
              <div key={city.name} className="space-y-3">
                <div className="flex items-baseline justify-between px-1 pt-1">
                  <p className="text-[16px] font-extrabold tracking-wide text-white">
                    {city.name}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/75">
                    {city.days}
                  </p>
                </div>
                <FeaturedAttractionCard attraction={city.small[0]} />
                <FeaturedAttractionCard attraction={city.small[1]} reverse />
                <div className="grid grid-cols-1">
                  <AttractionCard attraction={city.featured} fullWidth />
                </div>
                {cityIdx < cities.length - 1 && (
                  <div className="pt-2">
                    <div className="h-px w-full bg-white/20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Day-by-day overview ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative overflow-hidden rounded-xl shadow-md"
        >
          <img
            src={photo("pingjiang-road")}
            alt="Trip backdrop"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#4A0F16]/88 via-[#3B0A11]/85 to-[#2A070C]/92" />
          <div className="relative px-5 py-6 text-white">
            <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">
              Day-by-Day Overview
            </p>
            <div className="space-y-6">
              {cityItineraries.map((itin) => (
                <div key={itin.cityName} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/30" />
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#F5C6CB]">
                      {itin.cityName}
                    </p>
                    <div className="h-px flex-1 bg-white/30" />
                  </div>
                  <div className="space-y-4">
                    {itin.days.map((entry) => (
                      <div key={entry.day} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <DayBadge label={entry.day} />
                          <p className="min-w-0 text-[14px] font-extrabold leading-[1.1] text-white">
                            {entry.title}
                          </p>
                        </div>
                        <div className="space-y-1 pl-[6px]">
                          {entry.items.map((item) => (
                            <p
                              key={item}
                              className="text-[12px] font-normal leading-[1.45] text-white/90"
                            >
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
