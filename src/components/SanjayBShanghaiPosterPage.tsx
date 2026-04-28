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

const SANJAY_FEATURE_IMAGE = "/uploads/itinerary/sanjay-safsdf.webp";
const BUND_IMAGE = "/uploads/itinerary/thebund.jpeg";
const SHDISNEY_IMAGE = "/uploads/itinerary/shdisney.jpg";
const SHANGHAI_MAP_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/PwMrEaeBjvxp5svWcwqXHF/shanghai_map-NeX2Joxz7nyaxgxqkNfzv6.webp";
const PRODUCT_IMAGES = [
  "/uploads/itinerary/carousel-shanghai-4.jpg",
  "/uploads/itinerary/carousel-shanghai-3.jpg",
  "/uploads/itinerary/carousel-shanghai-1.jpg",
  "/uploads/itinerary/carousel-shanghai-2.jpg",
] as const;

function posterHero() {
  return "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/PwMrEaeBjvxp5svWcwqXHF/shanghai_hero-C8YobeFNbMvjhbuvmjXEBt.webp";
}

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
  destinationCn: "SHANGHAI",
  tagline: "A custom Shanghai poster for Sanjay and family",
  taglineCn: "A Shanghai poster made for Sanjay and family",
  subtitle: "FAMILY ITINERARY",
  heroImage: posterHero(),
  attractions: [
    {
      id: "3",
      nameEn: "Tianzifang",
      image:
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/PwMrEaeBjvxp5svWcwqXHF/tianzifang_ef53bf6c.jpg",
    },
    {
      id: "2",
      nameEn: "Yu Garden",
      image:
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/PwMrEaeBjvxp5svWcwqXHF/yu_garden_f5cdb8a2.jpg",
    },
    {
      id: "1",
      nameEn: "The Bund",
      image: BUND_IMAGE,
    },
    {
      id: "4",
      nameEn: "Nanjing Road",
      image:
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/PwMrEaeBjvxp5svWcwqXHF/nanjing_road_d96664a9.jpg",
    },
    {
      id: "5",
      nameEn: "French Concession",
      image:
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/PwMrEaeBjvxp5svWcwqXHF/french_concession_e547cb86.jpg",
    },
    {
      id: "6",
      nameEn: "Shanghai Disneyland",
      image: SHDISNEY_IMAGE,
    },
  ] satisfies Attraction[],
};

const itineraryDays: ItineraryDay[] = [
  {
    day: "LANDING",
    date: "17 May · 01:00",
    title: "Land in Shanghai · Transfer to Your Stay",
    tags: ["Airport pickup included"],
    items: [
      "✈️ Arrival at Shanghai Pudong 01:00 (17 May, early hours)",
      "Pre-arranged transfer → your accommodation",
      "Sleep, recover for Day 1",
    ],
  },
  {
    day: "DAY 1",
    date: "17 May",
    title: "Yu Garden · The Bund · Wukang Road",
    tags: ["Yu Garden tickets included", "Citywalk guide via Concierge", "Private 6-seater car with driver"],
    items: [
      "Yu Garden + Yuyuan Bazaar street food",
      "French Concession walk + Wukang Road + Tianzifang art alleys",
      "Nanjing Road shopping",
      "The Bund sunset walk + Pudong skyline photos",
      "North Bund evening stroll + skyline views",
      "Local chartered transport included",
    ],
  },
  {
    day: "DAY 2",
    date: "18 May",
    title: "Shanghai Disneyland",
    tags: ["Disney tickets included", "Private 6-seater car with driver"],
    items: [
      "Full-day Disney (Monday weekday recommended for lighter crowds)",
      "Local chartered transport included",
    ],
  },
  {
    day: "DAY 3",
    date: "19 May",
    title: "Jing'an Temple · Lujiazui · Huangpu River Cruise",
    tags: ["Cruise + Maglev tickets included", "Citywalk guide via Concierge", "Private 6-seater car with driver"],
    items: [
      "Morning: Jing'an Temple visit",
      "Afternoon: Maglev train return ride (Longyang Rd ↔ Pudong Airport, 431 km/h)",
      "Lujiazui city walk + skyscraper district",
      "Night: Huangpu River cruise (Pudong + Bund skyline from the water)",
      "Local chartered transport included",
    ],
  },
  {
    day: "DAY 4",
    date: "20 May",
    title: "City Walk · Departure to Guangzhou",
    tags: ["Private 6-seater car with driver", "Station drop-off included", "Sleeper train booked"],
    items: [
      "Morning city walk along Suzhou Creek + Xintiandi",
      "Pre-arranged drop-off to Shanghai Nan Railway Station",
      "🚄 Train D99: Shanghai → Guangzhou (departs 17:43, overnight sleeper, arrives next morning 09:45)",
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

export default function SanjayBShanghaiPosterPage() {
  const [tianzifang, yuGarden, bund, nanjingRoad, frenchConcession, disney] =
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
                Sanjay Family Trip | Shanghai 4 Days 3 Nights
              </h2>
              <p className="text-[13px] font-normal leading-snug text-[#4A4A4A]">
                Maglev ride | vip private custom | Skyline views
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {["WhatsApp concierge included", "Fully customizable", "Private 6-seater car with driver"].map((tag) => (
                <span
                  key={tag}
                  className="border border-[#F0C8D1] px-2 py-1 text-[11px] font-semibold text-[#D3567E]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-[20px] font-semibold leading-none text-[#3F3F3F]">
              ¥ 2150 / person
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

            <div className="mx-auto mt-4 flex max-w-[220px] items-center gap-3">
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
              <AttractionCard attraction={tianzifang} />
              <AttractionCard attraction={yuGarden} />
            </div>

            <div className="grid grid-cols-1">
              <AttractionCard attraction={disney} fullWidth />
            </div>

            <FeaturedAttractionCard attraction={nanjingRoad} />
            <FeaturedAttractionCard attraction={bund} reverse />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="overflow-hidden rounded-2xl bg-white shadow-lg"
        >
          <img
            src={SHANGHAI_MAP_IMAGE}
            alt="Shanghai attraction map"
            className="w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative overflow-hidden rounded-xl shadow-md"
        >
          <img
            src={frenchConcession.image}
            alt="French Concession backdrop"
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
          className="overflow-hidden rounded-2xl bg-white shadow-lg"
        >
          <img
            src={SANJAY_FEATURE_IMAGE}
            alt="Sanjay itinerary feature"
            className="w-full object-cover"
          />
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
            <ol className="space-y-0.5 text-[11px] leading-[1.35] text-[#333333]">
              <li>1. Pre-arranged airport pickup on arrival on day 1 + drop-off to railway station on day 4.</li>
              <li>2. Private 6-seater car charter with driver for Day 1, 2, 3, and 4.</li>
              <li>3. Attractions: Shanghai Disneyland day tickets × 4, Huangpu River night cruise × 4, Shanghai Maglev train return ride × 4, Yu Garden day tickets × 4.</li>
              <li>4. Train: D99 Shanghai → Guangzhou, 1st-class 4-berth sleeper cabin × 4.</li>
              <li>5. Concierge: WhatsApp support throughout the trip, including restaurant booking + recommendations, taxi booking.</li>
              <li>6. Planning: Daily itinerary guidance, city walk route planning, and on-the-ground assistance via concierge.</li>
            </ol>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="inline-block h-3 w-[3px] bg-[#C23845]" />
              <h3 className="text-[13px] font-extrabold text-[#1F1F1F]">
                Price Not Included
              </h3>
            </div>
            <ol className="space-y-0.5 text-[11px] leading-[1.35] text-[#333333]">
              <li>1. Accommodation in Shanghai (booking your own).</li>
              <li>2. International flights between Kathmandu and Shanghai.</li>
              <li>3. Local transport within Shanghai (metro, taxi, Didi).</li>
              <li>4. Private guide and private car services (available on request, quoted separately).</li>
              <li>5. Meals, snacks and drinks.</li>
              <li>6. Travel insurance and China visa fees.</li>
              <li>7. Personal expenses such as laundry, minibar, phone, alcohol, and souvenirs.</li>
              <li>8. Additional costs caused by delays, cancellations, weather, mechanical issues or other force majeure events.</li>
              <li>9. Any item not explicitly listed under &quot;Price Included&quot;.</li>
            </ol>
          </div>
        </motion.div>

        <div className="pb-4 text-center text-xs text-stone-400">
          <p>Shanghai Travel Itinerary</p>
        </div>
      </div>
    </div>
  );
}
