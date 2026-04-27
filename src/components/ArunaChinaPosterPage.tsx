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

const FEATURE_IMAGE = "/uploads/itinerary/beijing/scraper/mutianyu-towers.webp";
const BUND_IMAGE = "/uploads/itinerary/thebund.jpeg";

const PRODUCT_IMAGES = [
  "/uploads/itinerary/beijing/scraper/mutianyu-autumn.jpg",
  "/uploads/itinerary/vaishvi-terracotta.jpg",
  "/uploads/itinerary/thebund.jpeg",
  "/uploads/itinerary/avatar.jpeg",
] as const;

interface Attraction {
  id: string;
  nameEn: string;
  image: string;
}

interface ItineraryDay {
  day: string;
  date?: string;
  title: string;
  tags?: string[];
  items: string[];
}

interface CityStay {
  city: string;
  nights: string;
  area: string;
}

const poster = {
  destinationEn: "China",
  subtitle: "ARUNA · 18 DAYS · 6 CITIES",
  attractions: [
    {
      id: "1",
      nameEn: "Forbidden City",
      image: "/uploads/itinerary/beijing/scraper/forbidden-taihe.jpg",
    },
    {
      id: "2",
      nameEn: "Mutianyu Great Wall",
      image: "/uploads/itinerary/beijing/scraper/mutianyu-autumn.jpg",
    },
    {
      id: "3",
      nameEn: "Terracotta Warriors",
      image: "/uploads/itinerary/vaishvi-terracotta.jpg",
    },
    {
      id: "4",
      nameEn: "The Bund · Shanghai",
      image: BUND_IMAGE,
    },
    {
      id: "5",
      nameEn: "Avatar Mountains · Zhangjiajie",
      image: "/uploads/itinerary/avatar.jpeg",
    },
    {
      id: "6",
      nameEn: "Hongya Cave · Chongqing",
      image: "/uploads/itinerary/chongqing/hongyadong1.jpg",
    },
  ] satisfies Attraction[],
};

const cityStays: CityStay[] = [
  {
    city: "Beijing",
    nights: "4 nights · 27–31 Aug",
    area: "Wangfujing or Qianmen — central, walkable evening strolls",
  },
  {
    city: "Xi'an",
    nights: "3 nights · 31 Aug – 3 Sep",
    area: "Inside the City Wall, Bell Tower area",
  },
  {
    city: "Shanghai",
    nights: "3 nights · 3–6 Sep",
    area: "Near the Bund or Nanjing Road",
  },
  {
    city: "Zhangjiajie",
    nights: "3 nights · 6–9 Sep",
    area: "Wulingyuan town — saves a 40-min daily drive to the park",
  },
  {
    city: "Chongqing",
    nights: "2 nights · 9–11 Sep",
    area: "Yuzhong, riverside near Hongya Cave",
  },
  {
    city: "Guangzhou",
    nights: "2 nights · 11–13 Sep",
    area: "Tianhe or Yuexiu — central with easy CAN airport access",
  },
];

const itineraryDays: ItineraryDay[] = [
  {
    day: "DAY 1",
    date: "Thu 27 Aug · Arrival",
    title: "Land in Beijing · Welcome dinner",
    tags: ["Airport pickup included", "Vegetarian set menu"],
    items: [
      "Group arrival at Beijing Capital (PEK) or Daxing (PKX)",
      "Private coach transfer with English-speaking representative",
      "Hotel check-in + welcome briefing",
      "Welcome dinner at a Beijing restaurant (transfers both ways)",
      "Hotel: 4★ Wangfujing / Qianmen area",
    ],
  },
  {
    day: "DAY 2",
    date: "Fri 28 Aug",
    title: "Imperial Beijing · Forbidden City",
    tags: ["Forbidden City pre-booked", "Vegetarian lunch arranged"],
    items: [
      "Tiananmen Square (flat, photo stops)",
      "Forbidden City — central axis only, golf-cart-friendly entry",
      "Vegetarian-friendly Beijing lunch",
      "Jingshan Park — short walk for panoramic Forbidden City rooftop view (rest at base optional)",
      "Hotel downtime · dinner at hotel or nearby (transfer arranged)",
    ],
  },
  {
    day: "DAY 3",
    date: "Sat 29 Aug",
    title: "Great Wall at Mutianyu",
    tags: ["Cable car included", "Toboggan optional"],
    items: [
      "Early drive to Mutianyu (~1.5 hrs) — chosen over Badaling for fewer crowds",
      "Cable car up · cable car or toboggan down",
      "Walk a short, restored Wall section at the top",
      "Lunch at a Wall-side restaurant",
      "Evening: free time / optional foot massage",
      "Dinner: Peking Duck banquet with parallel vegetarian dishes pre-arranged",
    ],
  },
  {
    day: "DAY 4",
    date: "Sun 30 Aug",
    title: "Temple of Heaven · Summer Palace",
    tags: ["Boat ride included"],
    items: [
      "Temple of Heaven — flat park, morning tai chi & calligraphy",
      "Lunch at a local restaurant",
      "Summer Palace — Kunming Lake boat to reduce walking; Long Corridor + Marble Boat",
      "Return to hotel · dinner nearby (transfer arranged)",
    ],
  },
  {
    day: "DAY 5",
    date: "Mon 31 Aug · Bullet train",
    title: "Hutong morning · Beijing → Xi'an",
    tags: ["G-class train", "Group seating arranged"],
    items: [
      "Hutong rickshaw tour through Shichahai — flat ride, optional courtyard visit",
      "Lunch · transfer to Beijing West Station",
      "🚄 G-class bullet train Beijing → Xi'an (~4.5–5 hrs, 2nd-class soft seats)",
      "Arrival Xi'an North · private coach transfer to hotel",
      "Light dinner at hotel",
      "Hotel: 4★ inside Xi'an City Wall (Bell Tower area)",
    ],
  },
  {
    day: "DAY 6",
    date: "Tue 1 Sep",
    title: "Terracotta Warriors",
    tags: ["Tickets pre-booked", "Electric shuttle from gate"],
    items: [
      "Drive to Terracotta Warriors Museum (~1 hr)",
      "Guided visit — Pits 1, 2, 3 + Bronze Chariots Hall",
      "Museum-side lunch · dumpling sampler with vegetarian options",
      "Optional brief stop at Huaqing Palace if energy permits — flat lakeside walk only",
      "Dinner at hotel area (transfer arranged)",
    ],
  },
  {
    day: "DAY 7",
    date: "Wed 2 Sep",
    title: "Xi'an City Highlights",
    tags: ["City Wall electric cart", "Tang Dynasty Show"],
    items: [
      "City Wall — electric cart along the wall, photo stops at four cardinal gates (no walking)",
      "Big Wild Goose Pagoda from the plaza · musical fountain",
      "Lunch · Shaanxi History Museum (1–1.5 hrs guided, relaxed pace)",
      "Muslim Quarter evening walk (Beiyuanmen) — split into two groups so guide accommodates slower walkers",
      "Tang Dynasty Dinner Show with vegetarian-friendly banquet",
    ],
  },
  {
    day: "DAY 8",
    date: "Thu 3 Sep · Flight",
    title: "Xi'an → Shanghai",
    tags: ["Domestic flight", "Late check-out"],
    items: [
      "Leisurely breakfast · late check-out",
      "Transfer to Xi'an Xianyang (XIY)",
      "✈️ Flight Xi'an → Shanghai Hongqiao or Pudong (~2.5 hrs)",
      "Private coach transfer to hotel · check-in and rest",
      "Dinner at hotel area",
      "Hotel: 4★ near the Bund / Nanjing Road",
    ],
  },
  {
    day: "DAY 9",
    date: "Fri 4 Sep",
    title: "Old & New Shanghai · Huangpu cruise",
    tags: ["Yu Garden tickets", "River cruise included"],
    items: [
      "Yu Garden — classical garden, flat walking",
      "Yu Garden Bazaar — shopping + Shanghai snacks",
      "Lunch at Nanxiang for soup dumplings (vegetarian dumplings pre-arranged)",
      "The Bund — colonial architecture + Pudong skyline",
      "Hotel rest before evening",
      "Huangpu River Evening Cruise — seated, AC, panoramic skyline",
      "Dinner aboard or at Bund-area restaurant (transfer arranged)",
    ],
  },
  {
    day: "DAY 10",
    date: "Sat 5 Sep",
    title: "French Concession · Shopping",
    tags: ["Guided walking tour"],
    items: [
      "Former French Concession — Xintiandi area, tree-lined streets",
      "Tianzifang — boutique alleys (mostly flat)",
      "Lunch",
      "Nanjing Road afternoon shopping — coach available for early hotel return",
      "Dinner at a Shanghainese restaurant (transfer arranged)",
    ],
  },
  {
    day: "DAY 11",
    date: "Sun 6 Sep · Flight",
    title: "Zhujiajiao Water Town · → Zhangjiajie",
    tags: ["Gondola ride", "Domestic flight"],
    items: [
      "Zhujiajiao Water Town half-day — gondola through canals, flat walking",
      "Lunch at a canal-side restaurant",
      "Transfer to SHA or PVG · ✈️ flight to Zhangjiajie Hehua (DYG) (~2.5 hrs)",
      "Coach transfer to Wulingyuan (saves a 40-min drive each morning)",
      "Late dinner at hotel",
      "Hotel: 4★ in Wulingyuan town",
    ],
  },
  {
    day: "DAY 12",
    date: "Mon 7 Sep",
    title: "Zhangjiajie Forest Park · Avatar Mountains",
    tags: ["Bailong glass elevator", "No climbing required"],
    items: [
      "Bailong Glass Elevator — world's tallest outdoor elevator, no climbing",
      "Yuanjiajie — Avatar Hallelujah viewpoint + First Bridge Under Heaven",
      "Lunch at a mountain-top restaurant inside the park",
      "Shuttle to Tianzi Mountain area · cable car or shuttle down",
      "Dinner at hotel (group is likely tired)",
    ],
  },
  {
    day: "DAY 13",
    date: "Tue 8 Sep",
    title: "Tianmen Mountain · Heaven's Gate",
    tags: ["Scenic cable car", "Escalators inside the mountain"],
    items: [
      "Drive to Zhangjiajie city (~40 mins)",
      "Tianmen Mountain Cable Car — ~30-min scenic ride up, one of the world's longest",
      "Escalators inside the mountain to viewpoints (no stairs)",
      "Glass Skywalk optional · non-glass viewing path also available",
      "Heaven's Gate — recommended: shuttle + escalator down to view from platform (no 999 steps)",
      "Coach down via the famous 99-bend road (or cable car back)",
      "Lunch in Zhangjiajie city · free afternoon at hotel · dinner at hotel",
    ],
  },
  {
    day: "DAY 14",
    date: "Wed 9 Sep · Flight",
    title: "Glass Bridge or Baofeng Lake · → Chongqing",
    tags: ["Option A or B", "Domestic flight"],
    items: [
      "Option A — Grand Canyon Glass Bridge (mostly flat, optional skip for those uncomfortable with heights)",
      "Option B (recommended for relaxed pace) — Baofeng Lake boat cruise with folk singing",
      "Lunch · transfer to DYG · ✈️ flight to Chongqing Jiangbei (CKG) (~1.5 hrs)",
      "Coach transfer to hotel · dinner at hotel",
      "Hotel: 4★ in Yuzhong, near Hongya Cave",
    ],
  },
  {
    day: "DAY 15",
    date: "Thu 10 Sep",
    title: "Chongqing Highlights · Yangtze cruise",
    tags: ["Hongya Cave at dusk", "Night cruise included"],
    items: [
      "Ciqikou Ancient Town — flat cobblestone streets, tea house stop",
      "Mild Chongqing lunch (non-spicy, vegetarian-friendly menu pre-set)",
      "People's Liberation Monument — short downtown walk",
      "Hotel rest",
      "Hongya Cave at dusk — multi-level stilt complex with elevators",
      "Yangtze River Night Cruise — seated, AC, skyline views",
      "Dinner aboard or at riverside restaurant (transfer arranged)",
    ],
  },
  {
    day: "DAY 16",
    date: "Fri 11 Sep · Flight",
    title: "Dazu Rock Carvings · → Guangzhou",
    tags: ["UNESCO site", "Electric carts available"],
    items: [
      "Drive to Dazu Rock Carvings (~2 hrs each way) — mostly flat, electric carts available",
      "Lunch en route or at site",
      "Return to Chongqing · transfer to airport",
      "✈️ Flight Chongqing → Guangzhou (CAN) (~2 hrs)",
      "Coach transfer to hotel · late dinner at hotel",
      "Alternative: substitute with Three Gorges Museum half-day + earlier flight if Dazu feels too long",
      "Hotel: 4★ in Tianhe or Yuexiu",
    ],
  },
  {
    day: "DAY 17",
    date: "Sat 12 Sep",
    title: "Guangzhou Highlights · Canton Tower",
    tags: ["Vegetarian dim sum", "Farewell dinner"],
    items: [
      "Chen Clan Ancestral Hall — Cantonese architecture, flat courtyards",
      "Shamian Island — colonial-era European architecture, tree-lined walking",
      "Cantonese dim sum lunch (vegetarian dim sum pre-arranged)",
      "Yuexiu Park + Five Rams Statue — gentle walk",
      "Hotel rest",
      "Canton Tower — elevator to observation deck for sunset and night skyline",
      "Farewell dinner at a Cantonese restaurant (transfer arranged)",
    ],
  },
  {
    day: "DAY 18",
    date: "Sun 13 Sep · Departure",
    title: "Free morning · Departure from Guangzhou",
    tags: ["Airport drop-off included"],
    items: [
      "Breakfast at hotel",
      "Free morning for last-minute shopping (coach + guide available)",
      "Hotel check-out",
      "Private coach transfer to Guangzhou Baiyun International (CAN)",
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
              <p className="text-xl font-semibold leading-tight text-[#912F34]">
                {attraction.nameEn}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="px-3 text-center">
              <p className="text-xl font-semibold leading-tight text-[#912F34]">
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
    <span className="inline-flex shrink-0 rounded-full bg-white px-3 py-1 text-[15px] font-extrabold leading-none tracking-[0.02em] text-[#C23845]">
      {compactLabel}
    </span>
  );
}

export default function ArunaChinaPosterPage() {
  const [forbidden, mutianyu, terracotta, bund, avatar, hongya] =
    poster.attractions;
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
    <div className={`${dmSans.className} min-h-screen bg-stone-100 px-4 py-6`}>
      <div className="mx-auto max-w-[420px] space-y-4">
        <section className="-mx-4 bg-white">
          <div className="relative">
            <div
              ref={scrollerRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden"
              style={{
                scrollSnapType: "x mandatory",
                overscrollBehaviorX: "contain",
                touchAction: "pan-x pan-y pinch-zoom",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {PRODUCT_IMAGES.map((image, index) => (
                <div
                  key={index}
                  className="h-[500px] w-full shrink-0 basis-full"
                  style={{ scrollSnapAlign: "center", scrollSnapStop: "always" }}
                >
                  <img
                    src={image}
                    alt={`China trip preview ${index + 1}`}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3">
              {PRODUCT_IMAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-4 w-4 rounded-full border border-white/70 ${
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
                Aruna Group Trip | China 18 Days 17 Nights
              </h2>
              <p className="text-[13px] font-normal leading-snug text-[#4A4A4A]">
                6 cities · 18 pax · vegetarian-friendly throughout · English-speaking national escort
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                "24/7 WhatsApp concierge",
                "4-star stays",
                "Vegetarian restaurants",
                "Private 21-seater coach",
                "English-speaking escort",
              ].map((tag) => (
                <span
                  key={tag}
                  className="border border-[#F0C8D1] px-2 py-1 text-[11px] font-semibold text-[#D3567E]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-[20px] font-semibold leading-none text-[#3F3F3F]">
              from ¥ 13,800 / person
            </p>
          </div>
        </section>

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
              {poster.destinationEn}
            </h1>

            <div className="mx-auto mt-4 flex max-w-[260px] items-center gap-3">
              <div className="h-px flex-1 bg-white/40" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
                {poster.subtitle}
              </p>
              <div className="h-px flex-1 bg-white/40" />
            </div>

            <p className="mt-2 text-[13px] font-semibold tracking-wide text-white/85">
              Top Sights
            </p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <AttractionCard attraction={forbidden} />
              <AttractionCard attraction={terracotta} />
            </div>

            <div className="grid grid-cols-1">
              <AttractionCard attraction={mutianyu} fullWidth />
            </div>

            <FeaturedAttractionCard attraction={bund} />
            <FeaturedAttractionCard attraction={avatar} reverse />

            <div className="grid grid-cols-1">
              <AttractionCard attraction={hongya} fullWidth />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="overflow-hidden rounded-xl bg-white p-5 shadow-md"
        >
          <div className="mb-3 flex items-center gap-1.5">
            <span className="inline-block h-3 w-[3px] bg-[#C23845]" />
            <h3 className="text-[13px] font-extrabold uppercase tracking-wide text-[#1F1F1F]">
              Route overview · 17 nights
            </h3>
          </div>
          <div className="overflow-hidden rounded-lg border border-stone-200">
            <table className="w-full text-[12px]">
              <thead className="bg-stone-50 text-[11px] uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Stage</th>
                  <th className="px-3 py-2 text-left font-semibold">Dates</th>
                  <th className="px-3 py-2 text-left font-semibold">Nights</th>
                  <th className="px-3 py-2 text-left font-semibold">City</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-[#333]">
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">1</td>
                  <td className="px-3 py-2">27–31 Aug</td>
                  <td className="px-3 py-2">4</td>
                  <td className="px-3 py-2">Beijing</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">2</td>
                  <td className="px-3 py-2">31 Aug – 3 Sep</td>
                  <td className="px-3 py-2">3</td>
                  <td className="px-3 py-2">Xi&apos;an</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">3</td>
                  <td className="px-3 py-2">3–6 Sep</td>
                  <td className="px-3 py-2">3</td>
                  <td className="px-3 py-2">Shanghai</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">4</td>
                  <td className="px-3 py-2">6–9 Sep</td>
                  <td className="px-3 py-2">3</td>
                  <td className="px-3 py-2">Zhangjiajie</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">5</td>
                  <td className="px-3 py-2">9–11 Sep</td>
                  <td className="px-3 py-2">2</td>
                  <td className="px-3 py-2">Chongqing</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">6</td>
                  <td className="px-3 py-2">11–13 Sep</td>
                  <td className="px-3 py-2">2</td>
                  <td className="px-3 py-2">Guangzhou</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-stone-500">
            Inter-city: 1 bullet train (Beijing → Xi&apos;an) and 4 domestic flights (Xi&apos;an → Shanghai → Zhangjiajie → Chongqing → Guangzhou). Departure from CAN suits long-haul carriers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative overflow-hidden rounded-xl shadow-md"
        >
          <img
            src={BUND_IMAGE}
            alt="China trip backdrop"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#4A0F16]/85 via-[#3B0A11]/82 to-[#2A070C]/90" />
          <div className="relative px-5 py-6 text-white">
            <div className="space-y-6">
              {itineraryDays.map((entry) => (
                <div key={entry.day} className="space-y-2">
                  <div className="space-y-1.5">
                    {entry.date && (
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
                        {entry.date}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <DayBadge label={entry.day} />
                      <p className="min-w-0 text-[16px] font-extrabold leading-[1.05] text-white">
                        {entry.title}
                      </p>
                    </div>
                  </div>

                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pl-[10px]">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-sm bg-white/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white/95 backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="space-y-1.5 pl-[10px]">
                    {entry.items.map((item) => (
                      <p
                        key={item}
                        className="text-[12px] font-normal leading-[1.4] text-white/90"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="overflow-hidden rounded-2xl bg-white shadow-lg"
        >
          <img
            src={FEATURE_IMAGE}
            alt="Mutianyu Great Wall feature"
            className="w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="overflow-hidden rounded-xl bg-[#C23845] p-4 shadow-md"
        >
          <div className="px-2 pb-5 pt-3 text-center">
            <h2
              className={`${dancingScript.className} text-6xl leading-none text-white`}
            >
              Hotels
            </h2>

            <div className="mx-auto mt-4 flex max-w-[240px] items-center gap-3">
              <div className="h-px flex-1 bg-white/40" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
                6 cities · 17 nights
              </p>
              <div className="h-px flex-1 bg-white/40" />
            </div>

            <p className="mt-2 text-[13px] font-semibold tracking-wide text-white/85">
              4-star stays · twin/double sharing · final hotels TBC
            </p>
          </div>

          <div className="space-y-2">
            {cityStays.map((stay) => (
              <div
                key={stay.city}
                className="space-y-1 rounded-md bg-white px-3 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[15px] font-extrabold leading-tight text-[#912F34]">
                    {stay.city}
                  </p>
                  <p className="text-[11px] font-semibold text-[#912F34]/70">
                    {stay.nights}
                  </p>
                </div>
                <p className="text-[11px] leading-snug text-[#4A4A4A]">
                  {stay.area}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="space-y-3 bg-white px-4 py-4"
        >
          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="inline-block h-3 w-[3px] bg-[#C23845]" />
              <h3 className="text-[13px] font-extrabold text-[#1F1F1F]">
                Price Included
              </h3>
            </div>
            <ol className="space-y-0.5 text-[10px] leading-[1.35] text-[#333333]">
              <li>1. Hotels: 17 nights in 4★ accommodation across 6 cities (twin/double sharing) with daily breakfast.</li>
              <li>2. Lunches and dinners as marked in the itinerary, all with parallel vegetarian set menus.</li>
              <li>3. Inter-city transport: 1 G-class bullet train (Beijing → Xi&apos;an) and 4 domestic flights (Xi&apos;an → Shanghai → Zhangjiajie → Chongqing → Guangzhou).</li>
              <li>4. Private air-conditioned 21-seater coach throughout (sized for 18 pax with luggage and comfort).</li>
              <li>5. English-speaking national escort throughout + local English-speaking guide in each city.</li>
              <li>6. All airport, train station, hotel and dinner transfers.</li>
              <li>7. Pre-booked entrance tickets to all listed attractions.</li>
              <li>8. All cable cars, elevators, electric shuttles and boat rides as listed (Mutianyu cable car, Bailong glass elevator, Tianmen cable car, Huangpu cruise, Yangtze night cruise, Zhujiajiao gondola, Baofeng Lake cruise, Canton Tower observation deck).</li>
              <li>9. Tang Dynasty Dinner Show in Xi&apos;an with vegetarian-friendly banquet.</li>
              <li>10. 24/7 ChinaPal concierge support during the trip.</li>
            </ol>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="inline-block h-3 w-[3px] bg-[#C23845]" />
              <h3 className="text-[13px] font-extrabold text-[#1F1F1F]">
                Price Not Included
              </h3>
            </div>
            <ol className="space-y-0.5 text-[10px] leading-[1.35] text-[#333333]">
              <li>1. International flights to Beijing and from Guangzhou.</li>
              <li>2. China visa fees.</li>
              <li>3. Travel insurance.</li>
              <li>4. Drinks beyond water at meals.</li>
              <li>5. Personal expenses, tips for guides and drivers.</li>
              <li>6. Optional activities not listed (foot massage, evening shows beyond Tang Dynasty Show).</li>
              <li>7. Additional costs caused by delays, cancellations, weather, mechanical issues or other force majeure events.</li>
              <li>8. Any item not explicitly listed under &quot;Price Included&quot;.</li>
            </ol>
          </div>
        </motion.div>

        <div className="pb-4 text-center text-xs text-stone-400">
          <p>China · 18-day itinerary for Aruna · 27 Aug – 13 Sep 2026</p>
        </div>
      </div>
    </div>
  );
}
