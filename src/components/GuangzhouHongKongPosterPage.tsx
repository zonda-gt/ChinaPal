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

const FEATURE_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/e/e1/Hong_Kong_Skyline_view_from_the_peak_2017.jpg";
const PRODUCT_IMAGES = [
  "https://upload.wikimedia.org/wikipedia/commons/8/88/The_beautiful_night_scene_near_the_Pearl_River_in_Guangzhou%2C_China.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/5/5e/Vista_del_Puerto_de_Victoria_desde_Sky100%2C_Hong_Kong%2C_2013-08-09%2C_DD_10.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Canton_Tower%2C_Guangzhou%2C_CN_Lit_up_at_night.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/b/bf/Tian_Tan_Buddha_August_2013.JPG",
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
  open?: boolean;
}

const poster = {
  destinationEn: "Guangzhou × Hong Kong",
  subtitle: "FAMILY ITINERARY",
  attractions: [
    {
      id: "1",
      nameEn: "Canton Tower",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Canton_Tower%2C_Guangzhou%2C_CN_Lit_up_at_night.jpg",
    },
    {
      id: "2",
      nameEn: "Shamian Island",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/1/14/Architecture_on_Shamian_Island.JPG",
    },
    {
      id: "3",
      nameEn: "Chen Clan Hall",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/b/b6/Chen_Clan_Ancestral_Hall_03048-Guangzhou_%2832881211901%29.jpg",
    },
    {
      id: "4",
      nameEn: "Victoria Peak",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/e/e1/Hong_Kong_Skyline_view_from_the_peak_2017.jpg",
    },
    {
      id: "5",
      nameEn: "Big Buddha",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/b/bf/Tian_Tan_Buddha_August_2013.JPG",
    },
    {
      id: "6",
      nameEn: "Tsim Sha Tsui",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/0/00/Tsim_Sha_Tsui_Promenade_at_East_Tsim_Sha_Tsui.jpg",
    },
  ] satisfies Attraction[],
};

const itineraryDays: ItineraryDay[] = [
  {
    day: "DAY 1",
    date: "25 May",
    title: "Arrival in Guangzhou",
    tags: ["Airport pickup included"],
    items: [
      "✈️ Arrive at Guangzhou Baiyun International Airport",
      "Pre-arranged transfer → hotel check-in, rest",
      "Evening stroll along the Pearl River with Canton Tower views",
    ],
  },
  {
    day: "DAY 2",
    date: "26 May",
    title: "Guangzhou Old City & Culture",
    tags: ["Citywalk guide via Concierge"],
    items: [
      "Chen Clan Ancestral Hall — Lingnan architecture & folk art",
      "Shamian Island — colonial-era streets & cafés",
      "Yuexiu Park & the Five Rams Statue",
      "Evening: classic Cantonese dim sum experience",
    ],
  },
  {
    day: "DAY 3",
    date: "27 May",
    title: "Modern Guangzhou",
    tags: ["Tower tickets included", "Night cruise included"],
    items: [
      "Canton Tower observation deck",
      "Zhujiang New Town skyline walk",
      "Guangdong Museum",
      "Evening: Pearl River night cruise",
    ],
  },
  {
    day: "DAY 4",
    date: "28 May",
    title: "Cultural Day Trip",
    tags: ["Choose one: Foshan or Kaiping"],
    items: [
      "Option A — Foshan: Ancestral Temple & Cantonese opera",
      "Option B — Kaiping Diaolou (UNESCO watchtowers, ~2hr each way)",
      "Return to Guangzhou for the evening",
    ],
  },
  {
    day: "DAY 5",
    date: "29 May",
    title: "Open Day · Extension Suggested",
    tags: ["Flex day"],
    open: true,
    items: [
      "🏞️ Guilin & Yangshuo (3–4 days) — karst peaks, Li River cruise, rice terraces",
      "🏯 Xi'an (2–3 days) — Terracotta Warriors, ancient city walls",
      "🏙️ Shanghai (2–3 days) — modern skyline, the Bund, water towns",
    ],
  },
  {
    day: "DAY 6",
    date: "30 May",
    title: "Open Day · Continue Extension",
    tags: ["Flex day"],
    open: true,
    items: [
      "Continue your chosen extension trip",
      "Or relaxed day back in Guangzhou (markets, café streets, spa)",
    ],
  },
  {
    day: "DAY 7",
    date: "31 May",
    title: "Open Day · Wrap Extension",
    tags: ["Flex day"],
    open: true,
    items: [
      "Final day of your extension",
      "Return to Guangzhou by evening, ready for Hong Kong",
    ],
  },
  {
    day: "DAY 8",
    date: "1 Jun",
    title: "Travel to Hong Kong",
    tags: ["High-speed rail booked"],
    items: [
      "🚄 Guangzhou South → Hong Kong West Kowloon (~50 min)",
      "Hotel check-in in Tsim Sha Tsui or Central",
      "Evening: Victoria Harbour & Symphony of Lights show",
    ],
  },
  {
    day: "DAY 9",
    date: "2 Jun",
    title: "Hong Kong Island",
    tags: ["Peak Tram tickets included"],
    items: [
      "Victoria Peak via the historic Peak Tram",
      "Central district + Man Mo Temple",
      "Soho district — galleries & Mid-Levels escalator",
      "Evening: Lan Kwai Fong",
    ],
  },
  {
    day: "DAY 10",
    date: "3 Jun",
    title: "Kowloon & Markets",
    items: [
      "Tsim Sha Tsui promenade & Avenue of Stars",
      "Temple Street Night Market",
      "Mong Kok — Ladies' Market & street food",
      "Wong Tai Sin Temple",
    ],
  },
  {
    day: "DAY 11",
    date: "4 Jun",
    title: "Lantau Island Nature Day",
    tags: ["Cable car tickets included"],
    items: [
      "Ngong Ping 360 cable car",
      "Tian Tan Big Buddha & Po Lin Monastery",
      "Tai O fishing village — stilt houses & seafood",
    ],
  },
  {
    day: "DAY 12",
    date: "5 Jun",
    title: "Open Day · Hong Kong or Macau",
    tags: ["Optional ferry add-on"],
    open: true,
    items: [
      "Option A — Macau day trip (~1hr ferry): UNESCO old town, Portuguese heritage, egg tarts",
      "Option B — Hong Kong free day: shopping in Causeway Bay, Stanley Market, or beach time",
    ],
  },
  {
    day: "DAY 13",
    date: "6 Jun",
    title: "Departure",
    tags: ["Airport drop-off included"],
    items: [
      "Final breakfast & last-minute shopping",
      "Pre-arranged transfer → Hong Kong International Airport",
      "✈️ Safe travels home",
    ],
  },
];

const extensions = [
  {
    emoji: "🏞️",
    name: "Guilin & Yangshuo",
    duration: "3–4 days",
    blurb: "Karst mountains, Li River cruise, rice terraces — our top pick for nature.",
  },
  {
    emoji: "🏯",
    name: "Xi'an",
    duration: "2–3 days",
    blurb: "Terracotta Warriors and intact Ming-era city walls — top pick for history.",
  },
  {
    emoji: "🏙️",
    name: "Shanghai",
    duration: "2–3 days",
    blurb: "The Bund, modern skyline, classic water towns just outside the city.",
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

function DayBadge({ label, open = false }: { label: string; open?: boolean }) {
  const compactLabel = label.replace(" ", "");

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-[15px] font-extrabold leading-none tracking-[0.02em] ${
        open ? "bg-white/85 text-[#7A4A12]" : "bg-white text-[#C23845]"
      }`}
    >
      {compactLabel}
    </span>
  );
}

export default function GuangzhouHongKongPosterPage() {
  const [cantonTower, shamian, chenClan, victoriaPeak, bigBuddha, tst] =
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
                    alt={`Guangzhou & Hong Kong preview ${index + 1}`}
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
                Guangzhou & Hong Kong | 13 Days · Draft
              </h2>
              <p className="text-[13px] font-normal leading-snug text-[#4A4A4A]">
                Cantonese culture | HK skyline | optional 3-day extension
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                "WhatsApp concierge",
                "Flexible Days 5–7",
                "High-speed rail GZ → HK",
                "Optional Macau add-on",
              ].map((tag) => (
                <span
                  key={tag}
                  className="border border-[#F0C8D1] px-2 py-1 text-[11px] font-semibold text-[#D3567E]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-[13px] font-medium leading-snug text-[#7A4A12]">
              Pricing TBD — full quote follows once Days 5–7 are decided.
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
              className={`${dancingScript.className} text-4xl leading-tight text-white`}
            >
              Guangzhou
              <span className="mt-1 block text-3xl text-white/85">× Hong Kong</span>
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
              <AttractionCard attraction={cantonTower} />
              <AttractionCard attraction={shamian} />
            </div>

            <FeaturedAttractionCard attraction={chenClan} />

            <div className="grid grid-cols-1">
              <AttractionCard attraction={bigBuddha} fullWidth />
            </div>

            <FeaturedAttractionCard attraction={victoriaPeak} reverse />

            <div className="grid grid-cols-1">
              <AttractionCard attraction={tst} fullWidth />
            </div>
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
            alt="Pearl River Delta backdrop"
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
                      <DayBadge label={entry.day} open={entry.open} />
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
          transition={{ duration: 0.6, delay: 0.4 }}
          className="overflow-hidden rounded-xl bg-[#C23845] p-4 shadow-md"
        >
          <div className="px-2 pb-5 pt-3 text-center">
            <h2
              className={`${dancingScript.className} text-5xl leading-none text-white`}
            >
              Extend
            </h2>

            <div className="mx-auto mt-4 flex max-w-[220px] items-center gap-3">
              <div className="h-px flex-1 bg-white/40" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
                Days 5 – 7
              </p>
              <div className="h-px flex-1 bg-white/40" />
            </div>

            <p className="mt-2 text-[13px] font-semibold tracking-wide text-white/85">
              Three open days — top picks
            </p>
          </div>

          <div className="space-y-2">
            {extensions.map((ext) => (
              <div
                key={ext.name}
                className="rounded-sm bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[15px] font-bold text-[#912F34]">
                    <span className="mr-1.5">{ext.emoji}</span>
                    {ext.name}
                  </p>
                  <p className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-[#C23845]">
                    {ext.duration}
                  </p>
                </div>
                <p className="mt-1 text-[12px] leading-snug text-[#4A4A4A]">
                  {ext.blurb}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="space-y-3 bg-white px-4 py-5"
        >
          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <span className="inline-block h-3 w-[3px] bg-[#C23845]" />
              <h3 className="text-[13px] font-extrabold text-[#1F1F1F]">
                A Note From Your Concierge
              </h3>
            </div>
            <p className="text-[12px] leading-[1.55] text-[#333333]">
              Here&apos;s a draft itinerary based on your interests in culture and nature.
              We&apos;ve kept Days 5–7 open because with 13 days you have a wonderful
              opportunity to explore more of China beyond Guangzhou and Hong Kong.
              Based on what you&apos;ve told us, we&apos;d especially recommend{" "}
              <span className="font-semibold text-[#912F34]">Guilin / Yangshuo</span>{" "}
              for breathtaking nature, or{" "}
              <span className="font-semibold text-[#912F34]">Xi&apos;an</span> for
              deep cultural history. Let us know which direction excites you and
              we&apos;ll build out the full plan with transport, hotels, and guides.
            </p>
          </div>
        </motion.div>

        <div className="pb-4 text-center text-xs text-stone-400">
          <p>Guangzhou & Hong Kong · 13-Day Draft Itinerary</p>
        </div>
      </div>
    </div>
  );
}
