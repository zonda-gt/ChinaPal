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
const PRODUCT_IMAGES = [
  "/uploads/itinerary/beijing/scraper/forbidden-taihe.jpg",
  "/uploads/itinerary/beijing/scraper/mutianyu-autumn.jpg",
  "/uploads/itinerary/beijing/scraper/temple-heaven-qinian.png",
  "/uploads/itinerary/beijing/scraper/hutong-nanluoguxiang.jpg",
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

const poster = {
  destinationEn: "Beijing",
  subtitle: "ARPIT GROUP · 8 PAX",
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
      nameEn: "Summer Palace",
      image: "/uploads/itinerary/beijing/scraper/summer-palace-bridge.jpg",
    },
    {
      id: "4",
      nameEn: "Temple of Heaven",
      image: "/uploads/itinerary/beijing/scraper/temple-heaven-qinian.png",
    },
    {
      id: "5",
      nameEn: "Wangfujing Street",
      image: "/uploads/itinerary/beijing/scraper/hutong-streetfood.jpg",
    },
    {
      id: "6",
      nameEn: "Peking Duck Dinner",
      image: "/uploads/itinerary/beijing/dumplings.jpg",
    },
  ] satisfies Attraction[],
};

const hotel = {
  name: "4★ Wangfujing-area Hotel · 4 rooms (2 pax/room)",
  description:
    "Central Wangfujing base · walkable to Tiananmen + Forbidden City · senior-friendly lifts and step-free access · daily breakfast included. Final pick from: Novotel Beijing Peace, DoubleTree by Hilton Beijing Wangfujing, or Hilton Beijing Wangfujing — we'll confirm based on availability for your dates.",
  images: [
    "/uploads/itinerary/beijing/hutong1.jpg",
    "/uploads/itinerary/beijing/hutong2.jpg",
    "/uploads/itinerary/beijing/hutong3.jpg",
  ],
};

const itineraryDays: ItineraryDay[] = [
  {
    day: "DAY 1",
    date: "Fri 5 June · Arrival",
    title: "PEK Arrival · Temple of Heaven · Forbidden City",
    tags: ["11-seater coach + guide", "Senior-friendly pacing"],
    items: [
      "07:30 — meet your guide at PEK arrivals after SQ800 from Singapore",
      "Coach transfer to your Wangfujing hotel · drop bags (rooms ready by 14:00)",
      "Late breakfast nearby, then a gentle walk through Temple of Heaven (flat park, easy on the seniors after a redeye)",
      "Lunch in the area, then check in",
      "Afternoon: walk Tiananmen Square through the Forbidden City (about 3 hours)",
      "Evening: stroll Wangfujing Street, dinner nearby, early night",
    ],
  },
  {
    day: "DAY 2",
    date: "Sat 6 June · Wall + Summer Palace",
    title: "Mutianyu Great Wall · Summer Palace · Peking Duck",
    tags: ["Round-trip cable car", "Lakeside walk at Summer Palace"],
    items: [
      "Morning: drive to Mutianyu Great Wall (about 1.5 hours)",
      "At the wall: cable car up, walk a section at your pace, cable car down",
      "Lunch at the Mutianyu base",
      "Afternoon: drive across to Summer Palace · gentle lakeside walk along the Long Corridor + Seventeen-Arch Bridge (about 2 hours)",
      "Evening: farewell Peking Duck dinner at Siji Minfu, Wangfujing",
    ],
  },
];

const tradeoffs = [
  {
    title: "Why Mutianyu, not Badaling",
    body: "Mutianyu has both-way cable car — essential when 4 of 8 are seniors. Badaling is more crowded and has steeper sections.",
  },
  {
    title: "Why Temple of Heaven on Day 1, not Day 2",
    body: "Day 1 starts after a redeye — Temple of Heaven is a flat park, the gentlest of the big sites, perfect for easing in. Day 2 then keeps the heavy outdoor walking (Wall + Summer Palace) clustered in the north so you're not crossing the city twice.",
  },
  {
    title: "Why this date is great",
    body: "Early June falls between Labor Day (May) and the summer holiday peak (mid-July) — calmer crowds at Forbidden City + Mutianyu, mild weather for outdoor walking, and Summer Palace's lake gardens are at their best.",
  },
];

const prebookings = [
  "Forbidden City — passport-linked timed entry, sells out",
  "Mutianyu round-trip cable car combo × 8",
  "Summer Palace entry × 8",
  "Hotel: 4 rooms × 2 nights at the chosen Wangfujing 4★",
  "PEK pickup for SQ800 (07:30 arrival) — 11-seater coach + English-speaking guide × 2 days",
  "Restaurant reservations: farewell Peking Duck dinner for 8 (Siji Minfu, Wangfujing)",
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

export default function ArpitBeijingPosterPage() {
  const [forbidden, mutianyu, summerPalace, templeHeaven, wangfujing, duck] =
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
                    alt={`Beijing trip preview ${index + 1}`}
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
              <h2 className="whitespace-nowrap text-[17px] font-extrabold leading-tight text-[#333333]">
                Arpit Group | Beijing 2 Days · 8 pax
              </h2>
              <p className="text-[13px] font-normal leading-snug text-[#4A4A4A]">
                Forbidden City · Mutianyu Great Wall · English-speaking guide
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                "11-seater coach + English guide",
                "Senior-friendly pacing (4 seniors)",
                "Both-way cable car included",
                "WhatsApp concierge",
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
              ¥ 1,320 / person
            </p>
            <p className="text-[12px] font-medium leading-snug text-[#7A1F25]">
              5–6 June 2026 · 8 pax sharing · English-speaking guide included
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
              <AttractionCard attraction={summerPalace} />
            </div>

            <div className="grid grid-cols-1">
              <AttractionCard attraction={mutianyu} fullWidth />
            </div>

            <FeaturedAttractionCard attraction={templeHeaven} />
            <FeaturedAttractionCard attraction={wangfujing} reverse />
            <FeaturedAttractionCard attraction={duck} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative overflow-hidden rounded-xl shadow-md"
        >
          <img
            src={FEATURE_IMAGE}
            alt="Mutianyu Great Wall backdrop"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#4A0F16]/80 via-[#3B0A11]/78 to-[#2A070C]/88" />
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
          className="space-y-3 rounded-2xl bg-white px-5 py-5 shadow-md"
        >
          <div className="mb-1 flex items-center gap-1.5">
            <span className="inline-block h-3 w-[3px] bg-[#C23845]" />
            <h3 className="text-[13px] font-extrabold text-[#1F1F1F]">
              Trade-offs &amp; Reasoning
            </h3>
          </div>
          {tradeoffs.map((note) => (
            <div key={note.title} className="space-y-0.5">
              <p className="text-[12px] font-bold text-[#912F34]">
                {note.title}
              </p>
              <p className="text-[11px] leading-[1.5] text-[#333333]">
                {note.body}
              </p>
            </div>
          ))}
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
              Hotel
            </h2>

            <div className="mx-auto mt-4 flex max-w-[220px] items-center gap-3">
              <div className="h-px flex-1 bg-white/40" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
                Your Stay
              </p>
              <div className="h-px flex-1 bg-white/40" />
            </div>

            <p className="mt-2 text-[13px] font-semibold tracking-wide text-white/85">
              {hotel.name}
            </p>
          </div>

          <div className="space-y-1 overflow-hidden rounded-md">
            <img
              src={hotel.images[0]}
              alt="Wangfujing area main"
              className="aspect-[3/2] w-full object-cover"
            />
            <div className="grid grid-cols-2 gap-1">
              <img
                src={hotel.images[1]}
                alt="Wangfujing area detail 1"
                className="aspect-[3/2] w-full object-cover"
              />
              <img
                src={hotel.images[2]}
                alt="Wangfujing area detail 2"
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
          </div>

          <p className="mt-3 px-1 text-[12px] leading-relaxed text-white/90">
            {hotel.description}
          </p>
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
                Pre-bookings Needed Now
              </h3>
            </div>
            <ol className="space-y-0.5 text-[11px] leading-[1.35] text-[#333333]">
              {prebookings.map((item, i) => (
                <li key={item}>
                  {i + 1}. {item}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <div className="mb-1 flex items-center gap-1">
              <span className="inline-block h-2 w-[1.5px] bg-[#C23845]/60" />
              <h3 className="text-[8px] font-bold text-[#9A9A9A] uppercase tracking-wider">
                Price Included
              </h3>
            </div>
            <ol className="space-y-0.5 text-[8px] leading-[1.3] text-[#888888]">
              <li>1. Hotel: 2 nights at 4★ Wangfujing-area hotel (Novotel Peace / DoubleTree Wangfujing / Hilton Wangfujing), 4 rooms × 2 pax with daily breakfast.</li>
              <li>2. Private 11-seater coach with English-speaking guide for Day 1 and Day 2.</li>
              <li>3. PEK arrival pickup for SQ800 (07:30 arrival from Singapore) at the terminal arrivals hall.</li>
              <li>4. Attractions: Forbidden City × 8 (passport-linked timed entry), Mutianyu Great Wall round-trip cable car × 8, Temple of Heaven × 8, Summer Palace × 8.</li>
              <li>5. Concierge: 24/7 WhatsApp support throughout, restaurant booking, taxi assistance, eSIM setup help.</li>
              <li>6. Planning: Itinerary tuned for 4 seniors with senior-friendly pacing and routing.</li>
            </ol>
          </div>

          <div>
            <div className="mb-1 flex items-center gap-1">
              <span className="inline-block h-2 w-[1.5px] bg-[#C23845]/60" />
              <h3 className="text-[8px] font-bold text-[#9A9A9A] uppercase tracking-wider">
                Price Not Included
              </h3>
            </div>
            <ol className="space-y-0.5 text-[8px] leading-[1.3] text-[#888888]">
              <li>1. International flights to/from Beijing PEK.</li>
              <li>2. Day 2 hotel-to-airport or onward transfer (quote on request).</li>
              <li>3. All meals — lunches, dinners, snacks, drinks (hotel breakfast is included in the room).</li>
              <li>4. Travel insurance and China visa fees.</li>
              <li>5. Personal expenses such as laundry, minibar, phone, alcohol, souvenirs.</li>
              <li>6. Additional costs from delays, cancellations, weather, or other force majeure events.</li>
              <li>7. Any item not explicitly listed under &quot;Price Included&quot;.</li>
            </ol>
          </div>
        </motion.div>

        <div className="pb-4 text-center text-xs text-stone-400">
          <p>Beijing 2-Day Itinerary · Arpit Group</p>
        </div>
      </div>
    </div>
  );
}
