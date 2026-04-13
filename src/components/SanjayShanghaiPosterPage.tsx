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
  title: string;
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
    day: "DAY 1",
    title: "Arrive in Shanghai · Maglev Experience",
    items: [
      "✈️ Arrival → Maglev Pudong Airport to city (431 km/h, 7 min)",
      "The Bund sunset walk + Pudong skyline photos",
      "Hotel: 4★ Pudong",
    ],
  },
  {
    day: "DAY 2",
    title: "Shanghai Disneyland",
    items: [
      "Full-day Disney",
      "Hotel: 4★ Pudong",
    ],
  },
  {
    day: "DAY 3",
    title: "Shanghai Tower + French Concession",
    items: [
      "Shanghai Tower 632m observation deck (world's 2nd tallest)",
      "French Concession walk + Tianzifang art alleys",
      "Evening: Sleep No More Shanghai OR Shanghai Circus World acrobatics (pick one)",
      "Hotel: 4★ Pudong",
    ],
  },
  {
    day: "DAY 4",
    title: "Yu Garden + Departure",
    items: [
      "Yu Garden + Yuyuan Bazaar street food",
      "Nanjing Road last-minute shopping",
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

export default function SanjayShanghaiPosterPage() {
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
        <section className="-mx-4 overflow-hidden bg-white">
          <div className="relative">
            <div
              ref={scrollerRef}
              onScroll={handleScroll}
              className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ touchAction: "pan-y pinch-zoom" }}
            >
              {PRODUCT_IMAGES.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Shanghai trip preview ${index + 1}`}
                  className="h-[500px] w-full shrink-0 snap-center snap-always object-cover"
                  draggable={false}
                />
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
              {["WhatsApp concierge included", "4-star stay", "Fully customizable"].map((tag) => (
                <span
                  key={tag}
                  className="border border-[#F0C8D1] px-2 py-1 text-[11px] font-semibold text-[#D3567E]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-[20px] font-semibold leading-none text-[#3F3F3F]">
              ¥ 6399 from / person
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
            <p className="mt-2 text-2xl font-bold tracking-widest text-white">
              {poster.destinationCn}
            </p>

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
                  <div className="flex items-center gap-2">
                    <DayBadge label={entry.day} />
                    <p className="min-w-0 text-[16px] font-extrabold leading-[1.05] text-white">
                      {entry.title}
                    </p>
                  </div>

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

        <div className="pb-4 text-center text-xs text-stone-400">
          <p>Shanghai Travel Itinerary</p>
        </div>
      </div>
    </div>
  );
}
