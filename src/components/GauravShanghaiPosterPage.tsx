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

const FEATURE_IMAGE = "/uploads/itinerary/shanghai/scraper/bund-skyline.jpg";
const PRODUCT_IMAGES = [
  "/uploads/itinerary/shanghai/scraper/bund-skyline.jpg",
  "/uploads/itinerary/shdisney.jpg",
  "/uploads/itinerary/shanghai/scraper/shanghai-tower.webp",
  "/uploads/itinerary/shanghai/scraper/yugarden-bridge.jpg",
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
  destinationEn: "Shanghai",
  subtitle: "GAURAV FAMILY · 2A + 2K",
  attractions: [
    {
      id: "1",
      nameEn: "Shanghai Disneyland",
      image: "/uploads/itinerary/shdisney.jpg",
    },
    {
      id: "2",
      nameEn: "Legoland Shanghai",
      image: "/uploads/itinerary/shanghai/scraper/lego-flagship.jpg",
    },
    {
      id: "3",
      nameEn: "Shanghai Tower",
      image: "/uploads/itinerary/shanghai/scraper/shanghai-tower.webp",
    },
    {
      id: "4",
      nameEn: "The Bund",
      image: "/uploads/itinerary/shanghai/scraper/bund-skyline.jpg",
    },
    {
      id: "5",
      nameEn: "Yu Garden",
      image: "/uploads/itinerary/shanghai/scraper/yugarden-bridge.jpg",
    },
    {
      id: "6",
      nameEn: "Tianzifang",
      image: "/uploads/itinerary/shanghai/scraper/tianzifang-shikumen.jpg",
    },
  ] satisfies Attraction[],
};

const hotel = {
  name: "Holiday Inn Shanghai Jing'an · Premium Double × 6 nights",
  description:
    "4★ international-chain stay in central Jing'an · premium room with 2 double beds (fits the family of 4) · breakfast included · close to Jing'an Temple and metro.",
  images: [
    "/uploads/itinerary/shanghai/hotel/holiday-inn-jingan-1.webp",
    "/uploads/itinerary/shanghai/hotel/holiday-inn-jingan-2.webp",
    "/uploads/itinerary/shanghai/hotel/holiday-inn-jingan-3.webp",
  ],
};

const itineraryDays: ItineraryDay[] = [
  {
    day: "DAY 1",
    date: "Sat 16 May · Arrival",
    title: "Arrival · Easy Jing'an Reset",
    tags: ["Airport pickup included", "Family-friendly pacing"],
    items: [
      "Morning: land Shanghai · airport pickup (private car for luggage) · transfer to Holiday Inn Jing'an",
      "Drop bags · light lunch nearby (Shanghainese, kid-friendly)",
      "Afternoon: gentle walk · Jing'an Temple + Jing'an Park (within 10 min of hotel)",
      "Evening: dinner near hotel · early night to recover from the flight",
    ],
  },
  {
    day: "DAY 2",
    date: "Sun 17 May · Old Shanghai + Bund",
    title: "Yu Garden · Nanjing Road · The Bund",
    tags: ["Yu Garden tickets included", "Sunset on the Bund"],
    items: [
      "Morning: Yu Garden + Yuyuan Bazaar — the kids will love the dragon walls and street food",
      "Lunch at Nanxiang Steamed Bun Shop (xiaolongbao, in the bazaar)",
      "Afternoon: Nanjing Road shopping walk — flagship stores, snacks, the famous neon stretch",
      "Sunset: The Bund waterfront walk · Pudong skyline photo spot",
      "Dinner in the Bund area",
    ],
  },
  {
    day: "DAY 3",
    date: "Mon 18 May · Disneyland",
    title: "Shanghai Disneyland · Full Day",
    tags: ["Weekday — lighter crowds", "Park tickets included"],
    items: [
      "Pickup ~07:30 · arrive at park opening 08:00",
      "Full day at the park — recommend Lightning Lane / Premier Access for top rides",
      "Stay until parade + fireworks (~21:00)",
      "Pickup back to hotel after fireworks",
    ],
  },
  {
    day: "DAY 4",
    date: "Tue 19 May · Lujiazui Skyline",
    title: "Shanghai Tower · Science & Tech Museum",
    tags: ["Tower tickets included", "Indoor recovery day after Disney"],
    items: [
      "Morning: Shanghai Tower 632m observation deck — kids love being on the world's 2nd-tallest",
      "Lunch at the Lujiazui mall food court",
      "Afternoon: Shanghai Science & Technology Museum — biggest indoor kids attraction in China",
      "Easy evening back at the hotel · pick a casual local spot for dinner",
    ],
  },
  {
    day: "DAY 5",
    date: "Wed 20 May · Legoland",
    title: "Legoland Shanghai · Full Day",
    tags: ["Weekday — quieter", "Tickets included"],
    items: [
      "Drive to Jinshan Legoland (about 1 hour each way)",
      "Full day at the park — best for ages 5–16",
      "Drive back evening · dinner near hotel",
      "Note: if your kids are under 5, we'd suggest swapping this for Zhujiajiao water town (40 min away, calmer + photogenic) — let us know.",
    ],
  },
  {
    day: "DAY 6",
    date: "Thu 21 May · French Concession + Farewell",
    title: "Tianzifang · Xintiandi · Huangpu Cruise",
    tags: ["Cruise included", "Easy walking day"],
    items: [
      "Morning: Tianzifang art lanes — narrow shikumen alleys, shops, easy walking",
      "Lunch in the French Concession",
      "Afternoon: Xintiandi shopping district",
      "Sunset: Huangpu River cruise (1 hr · kids love it)",
      "Farewell Shanghainese dinner",
    ],
  },
  {
    day: "DAY 7",
    date: "Fri 22 May · Departure",
    title: "Hotel → Airport",
    tags: ["Airport drop-off included"],
    items: [
      "Early breakfast",
      "08:30 hotel pickup → airport for 11:30 flight",
    ],
  },
];

const tradeoffs = [
  {
    title: "Why Disney on Monday and Legoland on Wednesday",
    body: "Both theme parks are on weekdays — fewer school groups and noticeably shorter queues than weekends. Sunday (the only weekend day in the trip) is reserved for Yu Garden + Bund, which are must-sees regardless.",
  },
  {
    title: "Why Day 4 is the calm day",
    body: "Theme parks exhaust everyone, especially kids. Day 4 is mostly indoor (Shanghai Tower, Science Museum, mall lunch) so the family can recover before the next big day at Legoland.",
  },
  {
    title: "Legoland — honest take",
    body: "Legoland Shanghai opened mid-2024 and works well for ages 5–16. If your kids are under 5, the round-trip drive isn't worth it — Zhujiajiao water town is a calmer, more photogenic alternative we'd sub in.",
  },
];

const prebookings = [
  "Shanghai Disneyland tickets × 4 (passport-linked, weekday slot)",
  "Legoland Shanghai tickets × 4",
  "Shanghai Tower observation deck × 4",
  "Shanghai Science & Technology Museum × 4",
  "Yu Garden entry × 4",
  "Huangpu River sunset cruise × 4",
  "Hotel: 1 premium room × 6 nights at Holiday Inn Shanghai Jing'an",
  "Airport pickup + drop-off (private car, luggage-friendly)",
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

export default function GauravShanghaiPosterPage() {
  const [disney, lego, tower, bund, yuGarden, tianzifang] = poster.attractions;
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
                    alt={`Shanghai trip preview ${index + 1}`}
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
                Gaurav Family | Shanghai 6 Nights · 4 pax
              </h2>
              <p className="text-[13px] font-normal leading-snug text-[#4A4A4A]">
                Disneyland · Legoland · Bund · family-friendly pacing
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                "Holiday Inn Jing'an · Premium Double",
                "Disney + Legoland on weekdays",
                "Airport pickup + drop-off",
                "24hr WhatsApp concierge",
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
              ¥ 2,640 / person
            </p>
            <p className="text-[12px] font-medium leading-snug text-[#7A1F25]">
              16–22 May 2026 · 6 nights · 2 adults + 2 kids
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

            <div className="mx-auto mt-4 flex max-w-[280px] items-center gap-3">
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
              <AttractionCard attraction={disney} />
              <AttractionCard attraction={lego} />
            </div>

            <div className="grid grid-cols-1">
              <AttractionCard attraction={tower} fullWidth />
            </div>

            <FeaturedAttractionCard attraction={bund} />
            <FeaturedAttractionCard attraction={yuGarden} reverse />
            <FeaturedAttractionCard attraction={tianzifang} />
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
            alt="Bund skyline backdrop"
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
              alt="Hotel main"
              className="aspect-[3/2] w-full object-cover"
            />
            <div className="grid grid-cols-2 gap-1">
              <img
                src={hotel.images[1]}
                alt="Hotel detail 1"
                className="aspect-[3/2] w-full object-cover"
              />
              <img
                src={hotel.images[2]}
                alt="Hotel detail 2"
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
              <li>1. Hotel: 6 nights at Holiday Inn Shanghai Jing'an (4★), 1 premium double room with 2 double beds, breakfast included.</li>
              <li>2. Airport transfers: arrival pickup + departure drop-off (private car, luggage-friendly).</li>
              <li>3. Attraction tickets × 4: Shanghai Disneyland, Legoland Shanghai, Shanghai Tower, Science &amp; Technology Museum, Yu Garden, Huangpu River cruise.</li>
              <li>4. Disney + Legoland day pickups: arranged transport to/from each park.</li>
              <li>5. Concierge: 24/7 WhatsApp support throughout, restaurant booking, taxi/Didi assistance, eSIM setup help.</li>
              <li>6. Planning: Itinerary tuned for 2 adults + 2 kids with theme-park weekday slotting.</li>
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
              <li>1. International flights to/from Shanghai.</li>
              <li>2. Daily in-city transport (metro, taxi, Didi) outside the listed transfers.</li>
              <li>3. All meals — breakfasts (except hotel), lunches, dinners, snacks, drinks, in-park food.</li>
              <li>4. Travel insurance and China visa fees.</li>
              <li>5. Personal expenses such as laundry, minibar, phone, alcohol, souvenirs.</li>
              <li>6. Additional costs from delays, cancellations, weather, or other force majeure events.</li>
              <li>7. Any item not explicitly listed under &quot;Price Included&quot;.</li>
            </ol>
          </div>
        </motion.div>

        <div className="pb-4 text-center text-xs text-stone-400">
          <p>Shanghai 6-Night Family Itinerary · Gaurav</p>
        </div>
      </div>
    </div>
  );
}
