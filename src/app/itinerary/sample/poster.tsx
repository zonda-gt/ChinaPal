"use client";

/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Dancing_Script, DM_Sans } from "next/font/google";
import { photos } from "./config";

const dancingScript = Dancing_Script({ subsets: ["latin"], weight: "700" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });

const CAROUSEL_IMAGES = [photos.mutianyu[0], photos.hongyadong[0], photos.bund[0], photos.forbidden[0]];

type Attraction = { nameEn: string; image: string };
type City = { name: string; days: string; small: [Attraction, Attraction]; featured: Attraction };
const cities: City[] = [
  {
    name: "Beijing",
    days: "Days 1–4",
    small: [
      { nameEn: "The Forbidden City", image: photos.forbidden[0] },
      { nameEn: "Temple of Heaven", image: photos.templeOfHeaven[0] },
    ],
    featured: { nameEn: "The Great Wall at Mutianyu", image: photos.mutianyu[0] },
  },
  {
    name: "Chongqing",
    days: "Days 5–7",
    small: [
      { nameEn: "The Train Through a Building", image: photos.liziba[0] },
      { nameEn: "Ciqikou Old Town", image: photos.ciqikou[0] },
    ],
    featured: { nameEn: "Hongyadong at Night", image: photos.hongyadong[0] },
  },
  {
    name: "Shanghai",
    days: "Days 7–10",
    small: [
      { nameEn: "Wukang Mansion", image: photos.wukang[0] },
      { nameEn: "Yu Garden", image: photos.yugarden[0] },
    ],
    featured: { nameEn: "The Bund at Night", image: photos.bund[0] },
  },
];

type ItineraryDay = { day: string; title: string; items: string[] };
const cityItineraries: { cityName: string; days: ItineraryDay[] }[] = [
  {
    cityName: "Beijing",
    days: [
      { day: "DAY 1", title: "Arrival · Hutongs & Houhai", items: ["✈️ Land at Beijing Capital · hotel in the old city", "Nanluoguxiang, the Drum Tower and Houhai at sunset", "Kao Rou Ji by the lake"] },
      { day: "DAY 2", title: "Forbidden City · Peking Duck", items: ["🏯 Forbidden City · lunch in the old ice cellar", "Jingshan in peony season · boats on Beihai", "🦆 Peking duck at Siji Minfu"] },
      { day: "DAY 3", title: "The Great Wall", items: ["🧱 Mutianyu: cable car up, toboggan down", "Grilled trout in the village", "Zhajiangmian · acrobatics (optional)"] },
      { day: "DAY 4", title: "Temple of Heaven · Summer Palace", items: ["Tai chi with locals · the Hall of Prayer", "🚣 The Long Corridor and a boat across the lake", "Copper-pot hotpot on Wangfujing"] },
    ],
  },
  {
    cityName: "Chongqing",
    days: [
      { day: "DAY 5", title: "Hotpot · Hongyadong", items: ["✈️ Fly to Chongqing · Jiefangbei food streets", "🌶️ Chongqing hotpot", "Hongyadong lit up at night"] },
      { day: "DAY 6", title: "The 3D City", items: ["Ciqikou old town · Liziba spicy chicken", "🚝 The train through a building", "🚡 Yangtze cableway at sunset · Nanshan night view"] },
      { day: "DAY 7", title: "Museum · Fly to Shanghai", items: ["Three Gorges Museum · Chongqing noodles", "✈️ Fly to Shanghai · soup dumplings", "🌃 Nanjing Road and the Bund at night"] },
    ],
  },
  {
    cityName: "Shanghai",
    days: [
      { day: "DAY 8", title: "Yu Garden · Huaihai Road", items: ["Yu Garden at opening · Nanxiang xiaolongbao", "🛍️ Huaihai Road walk: Matcha Wang, HAUS NOWHERE, Songmont", "🚢 Night cruise on the Huangpu"] },
      { day: "DAY 9", title: "Wukang Road · Shanghai Tower", items: ["Wukang Mansion · the “Harry Potter” bakery", "🛍️ Zhangyuan · the Louis Vuitton ship", "🌇 Shanghai Tower at sunset"] },
      { day: "DAY 10", title: "Flight Home", items: ["Last presents on Nanjing Road", "🚄 The Maglev to the airport in 8 minutes"] },
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

/* name: the lead's first name from ?name=, so a link can be personalised. */
export default function SamplePoster({ name }: { name?: string | null }) {
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
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#C23845]">{name ? `A sample trip for ${name}` : "A sample trip"}</span>
            <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3">
              {CAROUSEL_IMAGES.map((_, index) => (
                <button key={index} onClick={() => goToSlide(index)} className={`h-3 w-3 rounded-full border border-white/70 ${carouselIndex === index ? "bg-[#C23845]" : "bg-white"}`} aria-label={`Go to slide ${index + 1}`} />
              ))}
            </div>
          </div>
          <div className="space-y-4 bg-white px-5 py-5">
            <div className="space-y-3">
              <h2 className="text-[17px] font-extrabold leading-tight text-[#333333]">China in 10 Days · Beijing, Chongqing & Shanghai</h2>
              <p className="text-[13px] font-normal leading-snug text-[#4A4A4A]">A first trip to China for two · 14–23 April 2027</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Every sight open on your day", "Chinese addresses for DiDi", "Restaurants our team picked", "We book the hard tickets"].map((tag) => (
                <span key={tag} className="border border-[#F0C8D1] px-2 py-1 text-[11px] font-semibold text-[#D3567E]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="overflow-hidden rounded-xl bg-[#C23845] p-4 shadow-md">
          <div className="px-2 pb-5 pt-3 text-center">
            <h1 className={`${dancingScript.className} text-5xl leading-tight text-white`}>China in 10 Days</h1>
            <div className="mx-auto mt-4 flex max-w-[240px] items-center gap-3">
              <div className="h-px flex-1 bg-white/40" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">3 Cities · 10 Days</p>
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
          <img src={photos.summerPalace[1]} alt="" className="absolute inset-0 h-full w-full object-cover" />
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
