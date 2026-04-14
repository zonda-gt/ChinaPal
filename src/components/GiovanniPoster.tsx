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

/* ── Image paths ── */
const PANDA = "/uploads/itinerary/chengdu/panda1.jpg";
const LESHAN = "/uploads/itinerary/giovanni/leshan-buddha.webp";
const EMEI = "/uploads/itinerary/giovanni/emei-golden-summit.webp";
const HONGYADONG = "/uploads/itinerary/chongqing/hongyadong1.jpg";
const WULONG = "/uploads/itinerary/giovanni/wulong-three-bridges.jpg";
const CABLEWAY = "/uploads/itinerary/chongqing/cableway1.jpg";
const ZJJ_CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i";
const AVATAR = `${ZJJ_CDN}/zjj-avatar-pillars-JfnwwF7VRiJvmNKdnJuoV2.webp`;
const FOREST = `${ZJJ_CDN}/zjj-forest-park-Fk6sgYY4AzscGgsTAdGZLa.webp`;
const GLASS_BRIDGE = "/uploads/itinerary/giovanni/glass-bridge.webp";
const TIANMEN = "/uploads/itinerary/tianmen_cable1.jpg";

const CAROUSEL_IMAGES = [PANDA, AVATAR, HONGYADONG, TIANMEN] as const;

interface Attraction {
  nameEn: string;
  image: string;
}

interface City {
  name: string;
  caps: string;
  days: string;
  small: [Attraction, Attraction];
  featured: Attraction;
}

const cities: City[] = [
  {
    name: "Chengdu",
    caps: "CHENGDU",
    days: "Days 1–3",
    small: [
      { nameEn: "Giant Panda Base", image: PANDA },
      { nameEn: "Leshan Giant Buddha", image: LESHAN },
    ],
    featured: { nameEn: "Mount Emei", image: EMEI },
  },
  {
    name: "Chongqing",
    caps: "CHONGQING",
    days: "Days 4–6",
    small: [
      { nameEn: "Hongyadong", image: HONGYADONG },
      { nameEn: "Wulong Three Bridges", image: WULONG },
    ],
    featured: { nameEn: "Yangtze Cableway", image: CABLEWAY },
  },
  {
    name: "Zhangjiajie",
    caps: "ZHANGJIAJIE",
    days: "Days 7–11",
    small: [
      { nameEn: "Avatar Mountains", image: FOREST },
      { nameEn: "Glass Bridge", image: GLASS_BRIDGE },
    ],
    featured: { nameEn: "Tianmen Mountain", image: TIANMEN },
  },
];

interface ItineraryDay {
  day: string;
  title: string;
  items: string[];
}

interface CityItinerary {
  cityName: string;
  backdrop: string;
  days: ItineraryDay[];
}

const cityItineraries: CityItinerary[] = [
  {
    cityName: "Chengdu",
    backdrop: PANDA,
    days: [
      {
        day: "DAY 1",
        title: "Pandas & Leshan Buddha",
        items: [
          "Giant Panda Base at opening (they most active)",
          "🚄 Train C6255 to Leshan · Giant Buddha boat cruise",
          "Sleep in Leshan",
        ],
      },
      {
        day: "DAY 2",
        title: "Mount Emei · Golden Summit",
        items: [
          "Direct taxi Leshan → Baoguo Temple (~¥90)",
          "Scenic bus + cable car to 3,077m Golden Summit",
          "🚄 Evening train C6264 back to Chengdu",
        ],
      },
      {
        day: "DAY 3",
        title: "Chengdu → Chongqing",
        items: [
          "Wuhou Shrine · Du Fu's Thatched Cottage",
          "🚄 High-speed train to Chongqing",
          "Check in near Jiefangbei · Hongyadong at night",
        ],
      },
    ],
  },
  {
    cityName: "Chongqing",
    backdrop: HONGYADONG,
    days: [
      {
        day: "DAY 4",
        title: "Wulong Day Trip",
        items: [
          "Three Natural Bridges (Transformers 4 location)",
          "Longshui Gorge karst fissure walk",
          "Evening: Chongqing drone light show",
        ],
      },
      {
        day: "DAY 5",
        title: "Chongqing City · 1949 Banquet",
        items: [
          "Ciqikou Ancient Town · Liziba monorail",
          "Yangtze River Cableway",
          "1949 Banquet immersive dinner show",
        ],
      },
      {
        day: "DAY 6",
        title: "Chongqing → Zhangjiajie",
        items: [
          "Morning: Three Gorges Museum (free)",
          "🚄 High-speed train to Zhangjiajie West",
          "Check in Wulingyuan",
        ],
      },
    ],
  },
  {
    cityName: "Zhangjiajie",
    backdrop: AVATAR,
    days: [
      {
        day: "DAY 7",
        title: "Avatar Forest Park",
        items: [
          "Bailong Elevator (world's tallest outdoor lift)",
          "Yuanjiajie · Avatar Hallelujah Mountain",
          "Tianzi Mountain cable car",
        ],
      },
      {
        day: "DAY 8",
        title: "Golden Whip Stream · Evening Show",
        items: [
          "Tujia brocade workshop",
          "7.5km Golden Whip Stream valley walk",
          "Charming Xiangxi outdoor spectacular",
        ],
      },
      {
        day: "DAY 9",
        title: "Grand Canyon · Glass Bridge",
        items: [
          "430m glass-bottomed bridge (300m high)",
          "Grand Canyon waterfalls + descent",
          "Free afternoon or Baofeng Lake",
        ],
      },
      {
        day: "DAY 10",
        title: "Yellow Dragon Cave · City Transfer",
        items: [
          "Underground cave chambers + river boat",
          "Transfer to Zhangjiajie city hotel",
          "72 Qilou Tower at sunset",
        ],
      },
      {
        day: "DAY 11",
        title: "Tianmen Mountain",
        items: [
          "7.5km cable car to 1,518m summit",
          "Glass skywalks + 999 Steps to Heaven's Gate",
          "99-bend road descent · farewell dinner",
        ],
      },
      {
        day: "DAY 12",
        title: "Zhangjiajie → Chengdu → Hanoi",
        items: [
          "🚄 Early train Zhangjiajie → Chengdu (via Chongqing, ~5 hrs)",
          "Taxi Chengdu East → Tianfu International Airport",
          "✈️ Afternoon flight to Hanoi",
        ],
      },
    ],
  },
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
      <div className="px-3 py-2 text-center">
        <p className="block whitespace-nowrap text-[15px] font-semibold text-[#912F34]">
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

function DayBadge({ label }: { label: string }) {
  const compactLabel = label.replace(" ", "");
  return (
    <span className="inline-flex shrink-0 rounded-full bg-white px-3 py-1 text-[13px] font-extrabold leading-none tracking-[0.02em] text-[#C23845]">
      {compactLabel}
    </span>
  );
}

export default function GiovanniPoster() {
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
              style={{ touchAction: "pan-y pinch-zoom" }}
            >
              {CAROUSEL_IMAGES.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Giovanni trip preview ${index + 1}`}
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
            <div className="space-y-3">
              <h2 className="text-[17px] font-extrabold leading-tight text-[#333333]">
                Giovanni's China Trip · 12 Days 11 Nights
              </h2>
              <p className="text-[13px] font-normal leading-snug text-[#4A4A4A]">
                Chengdu · Chongqing · Zhangjiajie · solo traveller · May 19–31
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Every ticket pre-booked",
                "Transport logistics sorted",
                "WhatsApp concierge included",
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

        {/* ── Unified red poster with 3 city sub-sections ── */}
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
                Three Cities · 12 Days
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
                <div className="grid grid-cols-2 gap-3">
                  <AttractionCard attraction={city.small[0]} />
                  <AttractionCard attraction={city.small[1]} />
                </div>
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

        {/* ── Unified dark itinerary card with 3 city sub-sections ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative overflow-hidden rounded-xl shadow-md"
        >
          <img
            src={AVATAR}
            alt="Trip backdrop"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#4A0F16]/88 via-[#3B0A11]/85 to-[#2A070C]/92" />
          <div className="relative px-5 py-6 text-white">
            <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">
              Day-by-Day Overview
            </p>
            <div className="space-y-6">
              {cityItineraries.map((itin, cityIdx) => (
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
