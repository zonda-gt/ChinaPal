"use client";

/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Dancing_Script, DM_Sans } from "next/font/google";
import { photos } from "./config";

const dancingScript = Dancing_Script({ subsets: ["latin"], weight: "700" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });

const CAROUSEL_IMAGES = [photos.bund[0], photos.scitech[0], "/uploads/itinerary/hangzhou/westlake1.jpg", "/uploads/itinerary/shdisney.jpg"];

type Attraction = { nameEn: string; image: string };
type City = { name: string; days: string; small: [Attraction, Attraction]; featured: Attraction };
const cities: City[] = [
  {
    name: "Shanghai",
    days: "Days 1–4 & 6",
    small: [
      { nameEn: "Science & Technology Museum", image: photos.scitech[0] },
      { nameEn: "Wukang Mansion", image: photos.wukang[0] },
    ],
    featured: { nameEn: "The Bund & the River", image: photos.bund[0] },
  },
  {
    name: "Suzhou & Hangzhou",
    days: "Days 5 & 7",
    small: [
      { nameEn: "Humble Administrator’s Garden", image: photos.zhuozheng[0] },
      { nameEn: "Pingjiang Road Canals", image: photos.pingjiang[0] },
    ],
    featured: { nameEn: "West Lake", image: "/uploads/itinerary/hangzhou/westlake1.jpg" },
  },
  {
    name: "LEGOLAND & Disney",
    days: "Days 8–11",
    small: [
      { nameEn: "LEGOLAND Shanghai", image: photos.legoland[0] },
      { nameEn: "Fengjing Water Town", image: photos.fengjing[0] },
    ],
    featured: { nameEn: "Shanghai Disneyland", image: "/uploads/itinerary/shdisney.jpg" },
  },
];

type ItineraryDay = { day: string; title: string; items: string[] };
const cityItineraries: { cityName: string; days: ItineraryDay[] }[] = [
  {
    cityName: "Shanghai",
    days: [
      { day: "DAY 1", title: "Arrival · The Bund at Night", items: ["✈️ Land 14:35 at Pudong (SQ 830) · pickup booked", "Lai Lai soup dumplings for dinner", "Nanjing Road & the Bund lit up"] },
      { day: "DAY 2", title: "Yu Garden · Xintiandi · River Cruise", items: ["Yu Garden at opening · Nanxiang xiaolongbao", "🛍️ Xintiandi & Huaihai Road · 🍵 the lamb latte", "🚢 Huangpu sunset cruise"] },
      { day: "DAY 3", title: "Wukang Road · “Harry Potter” Bakery", items: ["Wukang Mansion & Wukang Road", "🥐 The “Harry Potter” bakery · lunch in a 1920s mansion", "🛍️ Anfu Road · spicy dinner"] },
      { day: "DAY 4", title: "Science Museum · Greenhouse", items: ["🔬 Science & Technology Museum · Mini World", "🌿 Shanghai Greenhouse Garden", "Jinchao 8 Lane for dinner"] },
    ],
  },
  {
    cityName: "Suzhou",
    days: [
      { day: "DAY 5", title: "Garden & Canals", items: ["🚄 G7006 09:00 → Suzhou 09:25", "Humble Administrator’s Garden · Lion Grove maze", "Pingjiang Road · Suzhou noodles"] },
    ],
  },
  {
    cityName: "Shanghai",
    days: [
      { day: "DAY 6", title: "Free Day · Jing’an Lanes", items: ["Shanghai Tower 118F (optional) · 52nd-floor coffee", "🛍️ Zhangyuan’s restored stone-gate lanes", "☕ Yuyuan Road cafés & shops · Shanghainese dinner"] },
    ],
  },
  {
    cityName: "Hangzhou",
    days: [
      { day: "DAY 7", title: "West Lake", items: ["🚄 G201 10:00 → Hangzhou East 10:45", "Boat to Three Pools Mirroring the Moon", "Broken Bridge · Zhiweiguan · fountain"] },
    ],
  },
  {
    cityName: "LEGOLAND & Disney",
    days: [
      { day: "DAY 8", title: "LEGOLAND", items: ["🚄 G7502 08:15 → Jinshan North", "A full day at LEGOLAND"] },
      { day: "DAY 9", title: "Water Town · To Disney", items: ["Fengjing Ancient Town (optional)", "🚗 To the Disneyland Hotel · Disneytown"] },
      { day: "DAY 10", title: "Disneyland Day 1", items: ["🏰 Early entry · parade · evening show"] },
      { day: "DAY 11", title: "Disneyland Day 2", items: ["🏰 Early entry · Novotel Chuansha"] },
      { day: "DAY 12", title: "Flight Home", items: ["✈️ Pickup to Pudong Airport"] },
    ],
  },
];

function AttractionCard({ attraction }: { attraction: Attraction }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="relative overflow-hidden rounded-sm bg-white p-2 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
      <div className="px-2 py-2 text-center">
        <p className="block text-[13px] font-semibold leading-tight text-[#912F34]">{attraction.nameEn}</p>
      </div>
      <img src={attraction.image} alt={attraction.nameEn} className="h-40 w-full rounded-[2px] object-cover" />
    </motion.div>
  );
}

function FeaturedAttractionCard({ attraction, reverse = false }: { attraction: Attraction; reverse?: boolean }) {
  const label = (
    <div className="px-3 text-center">
      <p className="text-[17px] font-semibold leading-tight text-[#912F34]">{attraction.nameEn}</p>
    </div>
  );
  const image = <img src={attraction.image} alt={attraction.nameEn} className="h-28 w-full rounded-[2px] object-cover" />;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="overflow-hidden rounded-sm bg-white p-2 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
      <div className={`grid items-center gap-3 ${reverse ? "grid-cols-[1.45fr_1fr]" : "grid-cols-[1fr_1.45fr]"}`}>
        {reverse ? (
          <>
            {image}
            {label}
          </>
        ) : (
          <>
            {label}
            {image}
          </>
        )}
      </div>
    </motion.div>
  );
}

function DayBadge({ label }: { label: string }) {
  return <span className="inline-flex shrink-0 rounded-full bg-white px-3 py-1 text-[13px] font-extrabold leading-none tracking-[0.02em] text-[#C23845]">{label.replace(" ", "")}</span>;
}

export default function ArdioPoster() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  // The overview starts as one line per day; the details are optional.
  const [showDetails, setShowDetails] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const goToSlide = (index: number) => {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollTo({ left: index * scroller.clientWidth, behavior: "smooth" });
  };
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scroller = event.currentTarget;
    const next = Math.round(scroller.scrollLeft / scroller.clientWidth);
    if (next !== carouselIndex) setCarouselIndex(next);
  };

  return (
    <div className={`${dmSans.className} bg-stone-100 px-4 py-6`}>
      <div className="mx-auto max-w-[420px] space-y-4">
        <section className="-mx-4 overflow-hidden bg-white">
          <div className="relative">
            <div ref={scrollerRef} onScroll={handleScroll} className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ touchAction: "pan-x pan-y pinch-zoom" }}>
              {CAROUSEL_IMAGES.map((image, index) => (
                <img key={index} src={image} alt={`Trip preview ${index + 1}`} className="h-[500px] w-full shrink-0 snap-center snap-always object-cover" draggable={false} />
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3">
              {CAROUSEL_IMAGES.map((_, index) => (
                <button key={index} onClick={() => goToSlide(index)} className={`h-3 w-3 rounded-full border border-white/70 ${carouselIndex === index ? "bg-[#C23845]" : "bg-white"}`} aria-label={`Go to slide ${index + 1}`} />
              ))}
            </div>
          </div>
          <div className="space-y-4 bg-white px-5 py-5">
            <div className="space-y-3">
              <h2 className="text-[17px] font-extrabold leading-tight text-[#333333]">Ardio’s Family Trip to China · 12 Days</h2>
              <p className="text-[13px] font-normal leading-snug text-[#4A4A4A]">Shanghai · Suzhou · Hangzhou · LEGOLAND · Disney · 5–16 Dec 2026</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Made for ages 1 & 5", "Every museum open on your day", "Restaurants our team picked", "Travel light to Hangzhou"].map((tag) => (
                <span key={tag} className="border border-[#F0C8D1] px-2 py-1 text-[11px] font-semibold text-[#D3567E]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="overflow-hidden rounded-xl bg-[#C23845] p-4 shadow-md">
          <div className="px-2 pb-5 pt-3 text-center">
            <h1 className={`${dancingScript.className} text-5xl leading-tight text-white`}>Shanghai & Beyond</h1>
            <div className="mx-auto mt-4 flex max-w-[240px] items-center gap-3">
              <div className="h-px flex-1 bg-white/40" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">Family Trip · 12 Days</p>
              <div className="h-px flex-1 bg-white/40" />
            </div>
            <p className="mt-2 text-[13px] font-semibold tracking-wide text-white/85">Top Sights</p>
          </div>
          <div className="space-y-6">
            {cities.map((city, cityIdx) => (
              <div key={city.name} className="space-y-3">
                <div className="flex items-baseline justify-between px-1 pt-1">
                  <p className="text-[16px] font-extrabold tracking-wide text-white">{city.name}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/75">{city.days}</p>
                </div>
                <FeaturedAttractionCard attraction={city.small[0]} />
                <FeaturedAttractionCard attraction={city.small[1]} reverse />
                <AttractionCard attraction={city.featured} />
                {cityIdx < cities.length - 1 && (
                  <div className="pt-2">
                    <div className="h-px w-full bg-white/20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="relative overflow-hidden rounded-xl shadow-md">
          <img src="/uploads/itinerary/hangzhou/westlake3.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#4A0F16]/88 via-[#3B0A11]/85 to-[#2A070C]/92" />
          <div className="relative px-5 py-6 text-white">
            <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">Day-by-Day Overview</p>
            <div className={showDetails ? "space-y-6" : "space-y-4"}>
              {cityItineraries.map((itin, i) => (
                <div key={i} className={showDetails ? "space-y-4" : "space-y-2.5"}>
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/30" />
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#F5C6CB]">{itin.cityName}</p>
                    <div className="h-px flex-1 bg-white/30" />
                  </div>
                  <div className={showDetails ? "space-y-4" : "space-y-2"}>
                    {itin.days.map((entry) => (
                      <div key={entry.day} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <DayBadge label={entry.day} />
                          <p className="min-w-0 text-[14px] font-extrabold leading-[1.1] text-white">{entry.title}</p>
                        </div>
                        {showDetails && (
                          <div className="space-y-1 pl-[6px]">
                            {entry.items.map((item) => (
                              <p key={item} className="text-[12px] font-normal leading-[1.45] text-white/90">
                                {item}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowDetails(!showDetails)} className="mx-auto mt-6 flex items-center gap-1.5 rounded-full border border-white/40 px-4 py-2 text-[12px] font-bold text-white">
              {showDetails ? "Hide the details ▴" : "What’s in each day ▾"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
