"use client";

/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Dancing_Script, DM_Sans } from "next/font/google";
import { photos } from "./config";

const dancingScript = Dancing_Script({ subsets: ["latin"], weight: "700" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });

const CAROUSEL_IMAGES = [photos.bund[0], "/uploads/itinerary/hangzhou/westlake1.jpg", photos.wukang[0], photos.zoo[0]];

type Attraction = { nameEn: string; image: string };
type City = { name: string; days: string; small: [Attraction, Attraction]; featured: Attraction };
const cities: City[] = [
  {
    name: "Shanghai",
    days: "Days 1–2",
    small: [
      { nameEn: "HARMAY & TX Huaihai", image: photos.harmay[0] },
      { nameEn: "Lai Lai Xiao Long", image: photos.lailai[0] },
    ],
    featured: { nameEn: "Wukang Road", image: photos.wukang[0] },
  },
  {
    name: "Hangzhou",
    days: "Days 3–4",
    small: [
      { nameEn: "Lingyin Temple", image: photos.lingyin[0] },
      { nameEn: "West Lake by Boat", image: photos.boat[0] },
    ],
    featured: { nameEn: "West Lake", image: "/uploads/itinerary/hangzhou/westlake1.jpg" },
  },
  {
    name: "Shanghai",
    days: "Days 5–8",
    small: [
      { nameEn: "Red Pandas", image: photos.zoo[0] },
      { nameEn: "Longfeng Qipao", image: photos.longfeng[0] },
    ],
    featured: { nameEn: "Lujiazui & the Bund", image: photos.northBund[0] },
  },
];

type ItineraryDay = { day: string; title: string; items: string[] };
const cityItineraries: { cityName: string; days: ItineraryDay[] }[] = [
  {
    cityName: "Shanghai",
    days: [
      { day: "DAY 1", title: "Arrival · Beauty Shopping · Wukang Road", items: ["✈️ Land 05:35 · bags at Crystal Orange", "Da Hu Chun pan-fried buns for breakfast", "TX Huaihai · HARMAY · Wukang Road photos", "Lai Lai soup dumplings for dinner"] },
      { day: "DAY 2", title: "DenTech Congress · To Hangzhou", items: ["DenTech Congress 09:00–14:00", "🚕 Taxi to Hongqiao (35–45 min)", "🚄 G1583 16:32 → Hangzhou East 17:24"] },
    ],
  },
  {
    cityName: "Hangzhou",
    days: [
      { day: "DAY 3", title: "Salon · White Horse Lake · Light Show", items: ["Salon appointment (time to confirm)", "Lakeside afternoon by your hotel", "Qiantang River light show 19:30"] },
      { day: "DAY 4", title: "Lingyin Temple · West Lake", items: ["Lingyin Temple & Feilai Peak carvings", "in77 shopping · MU SPRING qipao", "Rowing boat · Zhiweiguan dinner · fountain 19:30"] },
    ],
  },
  {
    cityName: "Shanghai",
    days: [
      { day: "DAY 5", title: "Back to Shanghai · Tianzifang", items: ["🚄 G7506 09:53 → Hongqiao", "Tianzifang · Lipstick Lab: make your own lipstick", "Xintiandi for dinner"] },
      { day: "DAY 6", title: "Wild Animal Park", items: ["🚕 Taxi ~1 h (or metro ~1.5 h)", "Red pandas · safari bus · feeding sessions"] },
      { day: "DAY 7", title: "Skyline · Qipao · Snacks", items: ["Lujiazui escalators & three towers", "Longfeng Qipao · Hema & snack shops", "North Bund sunset · the Bund at night"] },
      { day: "DAY 8", title: "Free Day", items: ["Anything you missed · pack for the group week"] },
      { day: "DAY 9", title: "Group Programme Begins", items: ["Join your group · Longjing & Zhujiajiao this week"] },
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

export default function DoAnhTuPoster() {
  const [carouselIndex, setCarouselIndex] = useState(0);
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
              <h2 className="text-[17px] font-extrabold leading-tight text-[#333333]">Do Anh Tu’s Shanghai & Hangzhou Trip · 9 Days</h2>
              <p className="text-[13px] font-normal leading-snug text-[#4A4A4A]">Shanghai · Hangzhou · Shanghai · 24 Oct – 1 Nov 2026</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Chinese addresses for Amap & DiDi", "Metro lines & exits", "WeChat concierge included", "Fully customisable"].map((tag) => (
                <span key={tag} className="border border-[#F0C8D1] px-2 py-1 text-[11px] font-semibold text-[#D3567E]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="overflow-hidden rounded-xl bg-[#C23845] p-4 shadow-md">
          <div className="px-2 pb-5 pt-3 text-center">
            <h1 className={`${dancingScript.className} text-5xl leading-tight text-white`}>Shanghai & Hangzhou</h1>
            <div className="mx-auto mt-4 flex max-w-[240px] items-center gap-3">
              <div className="h-px flex-1 bg-white/40" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">Two Cities · 9 Days</p>
              <div className="h-px flex-1 bg-white/40" />
            </div>
            <p className="mt-2 text-[13px] font-semibold tracking-wide text-white/85">Top Sights</p>
          </div>
          <div className="space-y-6">
            {cities.map((city, cityIdx) => (
              <div key={city.days} className="space-y-3">
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
            <div className="space-y-6">
              {cityItineraries.map((itin, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/30" />
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#F5C6CB]">{itin.cityName}</p>
                    <div className="h-px flex-1 bg-white/30" />
                  </div>
                  <div className="space-y-4">
                    {itin.days.map((entry) => (
                      <div key={entry.day} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <DayBadge label={entry.day} />
                          <p className="min-w-0 text-[14px] font-extrabold leading-[1.1] text-white">{entry.title}</p>
                        </div>
                        <div className="space-y-1 pl-[6px]">
                          {entry.items.map((item) => (
                            <p key={item} className="text-[12px] font-normal leading-[1.45] text-white/90">
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
