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
  "/uploads/itinerary/beijing/scraper/forbidden-taihe.jpg",
  "/uploads/itinerary/thebund.jpeg",
  "/uploads/itinerary/hangzhou/westlake1.jpg",
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
  image: string;
}

const poster = {
  destinationEn: "China",
  subtitle: "VAISHVI · 16 DAYS · 4 CITIES",
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
      nameEn: "Mt. Hua (Huashan)",
      image: "/uploads/itinerary/vaishvi-mthua.jpg",
    },
    {
      id: "5",
      nameEn: "The Bund · Shanghai",
      image: BUND_IMAGE,
    },
    {
      id: "6",
      nameEn: "Victoria Peak · HK",
      image: "/uploads/itinerary/vaishvi-victoria-peak.jpg",
    },
  ] satisfies Attraction[],
};

const cityStays: CityStay[] = [
  {
    city: "Beijing",
    nights: "4 nights · 15–19 May",
    area: "Wangfujing / Qianmen — walkable to Tiananmen + Forbidden City",
    image: "/uploads/itinerary/beijing/hutong1.jpg",
  },
  {
    city: "Xi'an",
    nights: "3 nights · 19–22 May",
    area: "Inside or near the City Wall — walking distance to Bell Tower",
    image: "/uploads/itinerary/vaishvi-xian-wall.jpg",
  },
  {
    city: "Shanghai",
    nights: "4 nights · 22–26 May",
    area: "Bund area or French Concession — heritage streets + transit",
    image: "/uploads/itinerary/carousel-shanghai-3.jpg",
  },
  {
    city: "Hong Kong",
    nights: "4 nights · 26–30 May",
    area: "Tsim Sha Tsui — harbour views + Indian restaurants nearby",
    image: "/uploads/itinerary/vaishvi-hk-tst.jpg",
  },
];

const itineraryDays: ItineraryDay[] = [
  {
    day: "DAY 1",
    date: "Fri 15 May · Arrival",
    title: "Land in Beijing · Wangfujing stroll",
    tags: ["Airport pickup included", "Vegetarian dinner booked"],
    items: [
      "Arrival at Beijing Capital (PEK) or Daxing (PKX)",
      "Private transfer → Wangfujing-area hotel",
      "Light evening: walk Wangfujing or Qianmen Dajie",
      "Dinner: Lotus in Moonlight (荷塘月色) — pure veg, no egg/garlic/wine · ~¥80–100pp",
    ],
  },
  {
    day: "DAY 2",
    date: "Sat 16 May · Imperial Beijing",
    title: "Tiananmen · Forbidden City · Jingshan",
    tags: ["Forbidden City tickets pre-booked", "Citywalk guide via Concierge"],
    items: [
      "Morning: Tiananmen Square → Forbidden City (3–4h, Treasure Gallery + Imperial Garden)",
      "Afternoon: exit north → Jingshan Park hill (panoramic rooftop view) → Beihai Park + White Pagoda",
      "Evening: King's Joy (京兆尹) — Michelin 100% veg in a Lama Temple hutong (booking essential)",
    ],
  },
  {
    day: "DAY 3",
    date: "Sun 17 May · Great Wall",
    title: "Mutianyu Great Wall day",
    tags: ["Cable car + toboggan included", "Vegetarian set lunch arranged"],
    items: [
      "Full day Mutianyu (preferred over Badaling) — ~1.5h from central Beijing",
      "Cable car up · walk towers 14–20 (most scenic) · toboggan down",
      "Lush forested mountains in May — light jacket, water, sun protection",
      "Lunch: vegetarian set at Mutianyu base village",
      "Evening: Vege Tiger / Suhu — all-veg Chinese buffet, ~¥75pp",
    ],
  },
  {
    day: "DAY 4",
    date: "Mon 18 May · Old Beijing",
    title: "Temple of Heaven · Hutongs · Houhai",
    tags: ["Forbidden City closed Mon — rebalanced", "Rickshaw + courtyard visit"],
    items: [
      "Morning: Temple of Heaven Park — Hall of Prayer, locals at tai chi (2.5–3h)",
      "Afternoon: hutong rickshaw tour around Houhai / Nanluoguxiang + traditional siheyuan visit",
      "Walk Houhai Lake; optional Jingshan sunset if missed on Day 2",
      "Dinner: Bai He Vegetarian (百合素食) — mock-meat specialist, no egg/garlic/wine",
    ],
  },
  {
    day: "DAY 5",
    date: "Tue 19 May · Beijing → Xi'an",
    title: "Summer Palace · High-speed train to Xi'an",
    tags: ["G-class train booked", "Veg snack pack for the journey"],
    items: [
      "Morning: Summer Palace — Kunming Lake, Long Corridor, Marble Boat (3h)",
      "Quick veg lunch near the station",
      "🚄 Beijing West → Xi'an North (G-class, ~4.5–5.5h) — pack veg snacks, train food is meat-based",
      "Evening arrival Xi'an → transfer to City Wall hotel",
      "Dinner: Tianlong Baoyan (天龙宝严素食馆) near Big Wild Goose Pagoda — no egg/garlic",
    ],
  },
  {
    day: "DAY 6",
    date: "Wed 20 May · Xi'an",
    title: "Terracotta Warriors · Muslim Quarter",
    tags: ["Tickets pre-booked", "English-speaking guide", "Veg set lunch arranged"],
    items: [
      "Morning: drive to Lintong (~1h) → Terracotta Warriors Pits 1, 2, 3 + bronze chariots hall",
      "Lunch: vegetarian-friendly restaurant at the site",
      "Afternoon: Banpo Neolithic Museum (optional) or early return for rest",
      "Dinner: Anduo Vegetarian near Guangren Temple (inside City Wall) — no egg",
      "Evening stroll: Muslim Quarter (Beiyuanmen) for lanterns + dry-fruit shops (food mostly meat)",
      "Backup: Delhi Darbar (Yanta) for North Indian thalis",
    ],
  },
  {
    day: "DAY 7",
    date: "Thu 21 May · Mt. Hua",
    title: "Huashan day trip — granite cliffs",
    tags: ["High-speed train + cable cars booked", "Tickets pre-booked"],
    items: [
      "🚄 Xi'an North → Huashan North (~30 min)",
      "Cable car up to West Peak → walk ridges to South + East peaks → cable car down",
      "~4–5h comfortable walking · pine forests · mountain temples · stunning views",
      "Optional 'Plank Walk' is skippable — rest of mountain is perfectly safe",
      "Dinner back in Xi'an: Daxingshan Temple Vegetarian — fully vegan inside a 1,000-year-old temple",
    ],
  },
  {
    day: "DAY 8",
    date: "Fri 22 May · Xi'an → Shanghai",
    title: "City Wall cycle · Goose Pagoda · Fly to Shanghai",
    tags: ["Bicycle hire arranged", "Flight booked (~2.5h)"],
    items: [
      "Morning: cycle the top of Xi'an City Wall (hire at South Gate, half loop ~1h)",
      "Late morning: Big Wild Goose Pagoda — 7th-century pagoda for Xuanzang's scriptures from India",
      "Lunch near the pagoda",
      "Afternoon: ✈️ Xi'an (XIY) → Shanghai (PVG/SHA) ~2.5h",
      "Evening: transfer to Bund / French Concession hotel",
      "Dinner: Zao Zi Shu / Jujube Tree (枣子树) — popular pure-veg chain",
    ],
  },
  {
    day: "DAY 9",
    date: "Sat 23 May · Shanghai",
    title: "Yu Garden · The Bund · Shanghai Tower",
    tags: ["Tower observation deck included", "Citywalk guide via Concierge"],
    items: [
      "Morning: Yu Garden + Old Town bazaar (Ming-era ponds, rockeries, pavilions)",
      "Lunch: Songyuelou (松月楼) near Yu Garden — fully veg dumplings + noodles since 1910",
      "Afternoon: Bund waterfront → ferry across Huangpu → Pudong Shanghai Tower (118F deck)",
      "Evening: Bund night views of Pudong skyline",
      "Dinner: Fu He Hui (福和慧) — Michelin veg tasting in a French Concession villa (book ahead) · backup Jujube Tree",
    ],
  },
  {
    day: "DAY 10",
    date: "Sun 24 May · Hangzhou",
    title: "West Lake · Lingyin Temple · Tea Village",
    tags: ["High-speed return tickets booked", "Veg lunch at temple arranged"],
    items: [
      "🚄 Shanghai → Hangzhou (~1h each way)",
      "West Lake — boat across to Su Causeway + Three Pools Mirroring the Moon",
      "Lingyin Temple — Buddhist temple in wooded hills + Feilai Feng cliff carvings",
      "Longjing Tea Village — green tea plantation walk + local tea house",
      "Lunch: Lingyin Vegetarian Restaurant — Buddhist temple cooking, fully no-egg",
      "Return Shanghai in the evening",
    ],
  },
  {
    day: "DAY 11",
    date: "Mon 25 May · Shanghai",
    title: "French Concession · Jing'an Temple · Nanjing Rd",
    tags: ["Walking-day pacing", "Concierge restaurant bookings"],
    items: [
      "Morning: French Concession walking tour — art deco mansions + Tianzifang shikumen lanes",
      "Lunch: Tianzifang — many vegetarian-friendly cafés",
      "Afternoon: Xintiandi (upscale shikumen) + Jing'an Temple (working temple with on-site veg dining hall)",
      "Evening: Nanjing Road stroll for shopping",
      "Dinner: Gongdelin (功德林) — Shanghai's original 1922 mock-meat veg restaurant",
    ],
  },
  {
    day: "DAY 12",
    date: "Tue 26 May · Shanghai → HK",
    title: "Zhujiajiao Water Town · Fly to Hong Kong",
    tags: ["Flight booked (~3h)", "Optional Suzhou swap"],
    items: [
      "Morning: half-day at Zhujiajiao Water Town — 1,700-year-old canal town, gondolas, stone bridges",
      "Alternative: Suzhou (1h by train) for UNESCO classical gardens",
      "Lunch at the water town",
      "Afternoon: ✈️ Shanghai (PVG) → Hong Kong (HKG) ~3h",
      "Evening: transfer to Tsim Sha Tsui hotel",
      "Dinner: Branto Pure Vegetarian (Lock Road, TST) — North + South Indian thalis, Jain on request",
    ],
  },
  {
    day: "DAY 13",
    date: "Wed 27 May · Hong Kong",
    title: "Victoria Peak · Star Ferry · Symphony of Lights",
    tags: ["Peak Tram included", "Symphony of Lights — 8 pm"],
    items: [
      "Morning: Peak Tram up Victoria Peak → Peak Circle Walk (flat 3.5 km loop with sweeping views)",
      "Lunch: LockCha Tea House in Hong Kong Park — traditional fully-veg dim sum",
      "Afternoon: Central → Star Ferry to TST (HK$5, classic experience)",
      "Evening: Symphony of Lights at 8pm from TST Avenue of Stars",
      "Dinner: Kung Tak Lam (功德林) — Shanghai-style veg restaurant in TST with harbour views",
    ],
  },
  {
    day: "DAY 14",
    date: "Thu 28 May · Lantau Island",
    title: "Big Buddha · Po Lin Monastery · Tai O",
    tags: ["Cable car included", "Monastery veg lunch booked"],
    items: [
      "Ngong Ping 360 cable car from Tung Chung — 25-min scenic ride over mountains + sea",
      "Tian Tan Big Buddha — 34m bronze Buddha on the plateau",
      "Po Lin Monastery — lunch at the monks' vegetarian restaurant (very pure veg)",
      "Bus/taxi to Tai O fishing village — stilt houses + dolphin-spotting boat ride",
      "Evening: return to HK Island · Temple Street Night Market (eat first at Woodlands Indian Veg in TST)",
    ],
  },
  {
    day: "DAY 15",
    date: "Fri 29 May · Hong Kong",
    title: "Dragon's Back hike · Stanley · Final dinner",
    tags: ["Outdoor highlight", "Concierge for final-dinner booking"],
    items: [
      "Morning: Dragon's Back hike — coastal ridge, ~4 km, 2h, views over Shek O + South China Sea",
      "Lunch: Shek O village or Big Wave Bay — small beach cafés (veg noodles, fries, salads)",
      "Afternoon: bus/taxi to Stanley — Stanley Market + Murray House + waterfront promenade",
      "Final dinner: Pure Veggie House (心齋) Causeway Bay — special veg Cantonese dim sum · or Sangeetha (South Indian veg) TST",
    ],
  },
  {
    day: "DAY 16",
    date: "Sat 30 May · Departure",
    title: "Last shopping · Fly home",
    tags: ["Airport drop-off included"],
    items: [
      "Morning: last-minute shopping (Causeway Bay, Mong Kok, IFC Mall) or relaxed dim sum brunch",
      "Transfer to HKG — allow 90 min by Airport Express, 60 min by car",
      "✈️ Departure",
    ],
  },
];

const beforeYouTravel = [
  {
    title: "China visa (L tourist)",
    body: "Required for all 4–5 travellers (covers Beijing, Xi'an, Shanghai). Apply 4–6 weeks ahead.",
  },
  {
    title: "Hong Kong PAR",
    body: "Indian passport holders must complete the free online Pre-Arrival Registration before flying to HK. Print + carry the slip.",
  },
  {
    title: "Forbidden City tickets",
    body: "Booked exactly 7 days ahead using each passport (one per passport per day). Closed Mondays. We book this for you.",
  },
  {
    title: "Mt. Hua + Terracotta tickets",
    body: "We pre-book both to avoid queues and entry-time uncertainty.",
  },
  {
    title: "Payment setup",
    body: "WeChat Pay / Alipay linked to an international card is strongly recommended — cash works but is rarely convenient. We'll guide you.",
  },
  {
    title: "eSIM / VPN",
    body: "WhatsApp, Google, Instagram are restricted on the mainland. Use a China-friendly eSIM with built-in VPN. Hong Kong has no restrictions.",
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

export default function VaishviChinaPosterPage() {
  const [forbidden, mutianyu, terracotta, mthua, bund, victoriaPeak] =
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
                Vaishvi Family Trip | China 16 Days 15 Nights
              </h2>
              <p className="text-[13px] font-normal leading-snug text-[#4A4A4A]">
                Beijing · Xi'an · Shanghai · Hong Kong | Pure veg, no egg | Outdoors-focused leisure
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                "24/7 WhatsApp concierge",
                "Pure-veg dining curated",
                "Tickets pre-booked",
                "Fully customizable",
              ].map((tag) => (
                <span
                  key={tag}
                  className="border border-[#F0C8D1] px-2 py-1 text-[11px] font-semibold text-[#D3567E]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-[13px] font-normal leading-snug text-[#4A4A4A]">
              4–5 travellers · 15–30 May 2026 · mid-budget
            </p>

            <p className="text-[20px] font-semibold leading-none text-[#3F3F3F]">
              from ¥ 6800 RMB / person
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
              <AttractionCard attraction={mutianyu} />
            </div>

            <div className="grid grid-cols-1">
              <AttractionCard attraction={mthua} fullWidth />
            </div>

            <FeaturedAttractionCard attraction={terracotta} />
            <FeaturedAttractionCard attraction={bund} reverse />

            <div className="grid grid-cols-1">
              <AttractionCard attraction={victoriaPeak} fullWidth />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-hidden rounded-xl bg-white p-5 shadow-md"
        >
          <div className="mb-3 flex items-center gap-1.5">
            <span className="inline-block h-3 w-[3px] bg-[#C23845]" />
            <h3 className="text-[13px] font-extrabold uppercase tracking-wide text-[#1F1F1F]">
              At a glance
            </h3>
          </div>
          <div className="overflow-hidden rounded-md border border-stone-200">
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
                  <td className="px-3 py-2">15–19 May</td>
                  <td className="px-3 py-2">4</td>
                  <td className="px-3 py-2">Beijing</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">2</td>
                  <td className="px-3 py-2">19–22 May</td>
                  <td className="px-3 py-2">3</td>
                  <td className="px-3 py-2">Xi'an</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">3</td>
                  <td className="px-3 py-2">22–26 May</td>
                  <td className="px-3 py-2">4</td>
                  <td className="px-3 py-2">Shanghai</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">4</td>
                  <td className="px-3 py-2">26–30 May</td>
                  <td className="px-3 py-2">4</td>
                  <td className="px-3 py-2">Hong Kong</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-stone-500">
            Routing: Beijing first (typical entry), Xi'an in the middle for Terracotta + Mt. Hua, Shanghai for the
            modern coastal contrast, Hong Kong last so departure works on any major airline.
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
              Your Stays
            </h2>

            <div className="mx-auto mt-4 flex max-w-[220px] items-center gap-3">
              <div className="h-px flex-1 bg-white/40" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
                4 cities · 15 nights
              </p>
              <div className="h-px flex-1 bg-white/40" />
            </div>

            <p className="mt-2 text-[13px] font-semibold tracking-wide text-white/85">
              Recommended areas — final hotels TBC
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
          transition={{ duration: 0.6, delay: 0.42 }}
          className="overflow-hidden rounded-xl bg-white p-5 shadow-md"
        >
          <div className="mb-3 flex items-center gap-1.5">
            <span className="inline-block h-3 w-[3px] bg-[#C23845]" />
            <h3 className="text-[13px] font-extrabold uppercase tracking-wide text-[#1F1F1F]">
              Before you travel · 4–6 weeks ahead
            </h3>
          </div>
          <div className="space-y-2.5">
            {beforeYouTravel.map((item) => (
              <div key={item.title}>
                <p className="text-[12px] font-bold text-[#1F1F1F]">{item.title}</p>
                <p className="text-[11px] leading-[1.45] text-[#4A4A4A]">{item.body}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="overflow-hidden rounded-xl bg-white p-5 shadow-md"
        >
          <div className="mb-3 flex items-center gap-1.5">
            <span className="inline-block h-3 w-[3px] bg-[#C23845]" />
            <h3 className="text-[13px] font-extrabold uppercase tracking-wide text-[#1F1F1F]">
              Vegetarian dining · curated picks
            </h3>
          </div>
          <p className="mb-3 text-[11px] leading-relaxed text-[#4A4A4A]">
            All listings below are confirmed pure vegetarian and (with noted exceptions) egg-free. For Indian-style
            no-onion/no-garlic, request <span className="font-semibold">jīngsùshí (净素)</span> — strict Buddhist veg.
            We&apos;ll provide a printed Chinese dietary card for the group.
          </p>
          <div className="space-y-3 text-[11px] leading-[1.4] text-[#333]">
            <div>
              <p className="font-bold text-[#C23845]">Beijing</p>
              <p>King&apos;s Joy (Michelin) · Lotus in Moonlight · Bai He · Vege Tiger buffet</p>
              <p className="text-[#777]">Indian food backup: Punjabi Restaurant, Tandoor Beijing</p>
            </div>
            <div>
              <p className="font-bold text-[#C23845]">Xi&apos;an</p>
              <p>Tianlong Baoyan · Daxingshan Temple Vegetarian · Anduo Vegetarian</p>
              <p className="text-[#777]">Indian food backup: Delhi Darbar, Red Fort, Ganges</p>
            </div>
            <div>
              <p className="font-bold text-[#C23845]">Shanghai</p>
              <p>Fu He Hui (Michelin) · Jujube Tree · Songyuelou · Gongdelin · Jing&apos;an Temple veg hall</p>
              <p className="text-[#777]">Indian food backup: Vedas, Masala Art, Bukhara</p>
            </div>
            <div>
              <p className="font-bold text-[#C23845]">Hong Kong</p>
              <p>LockCha Tea House · Kung Tak Lam · Pure Veggie House · Po Lin Monastery</p>
              <p className="text-[#777]">Indian food backup: Branto, Woodlands, Sangeetha (all in TST)</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.48 }}
          className="space-y-3 bg-white px-4 py-4"
        >
          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="inline-block h-3 w-[3px] bg-[#C23845]" />
              <h3 className="text-[13px] font-extrabold text-[#1F1F1F]">
                Price Included
              </h3>
            </div>
            <ol className="space-y-0.5 text-[9px] leading-[1.3] text-[#333333]">
              <li>1. Hotels: 15 nights across 4 cities (Beijing 4 · Xi&apos;an 3 · Shanghai 4 · Hong Kong 4) — mid-range, central locations as outlined.</li>
              <li>2. Pre-arranged airport pickup in Beijing (Day 1) + airport drop-off in Hong Kong (Day 16).</li>
              <li>3. Inter-city transport: G-class train Beijing → Xi&apos;an, flight Xi&apos;an → Shanghai, flight Shanghai → Hong Kong (with hotel transfers on arrival).</li>
              <li>4. Tickets pre-booked: Forbidden City × pax, Mutianyu Great Wall (cable car + toboggan), Terracotta Warriors, Mt. Hua return cable car, Shanghai Tower observation deck, Yu Garden, Peak Tram, Ngong Ping 360 cable car.</li>
              <li>5. Day trips: Mutianyu (Day 3), Mt. Hua return train (Day 7), Hangzhou high-speed return (Day 10), Lantau Island (Day 14).</li>
              <li>6. English-speaking guide for the Terracotta Warriors visit; veg set lunches arranged at Mutianyu and Lingyin Temple.</li>
              <li>7. Concierge: WhatsApp support throughout the trip — restaurant bookings, dietary cards in Chinese, on-the-ground assistance.</li>
              <li>8. Pre-trip planning: visa guidance, HK PAR walkthrough, payment setup (WeChat/Alipay), eSIM + VPN recommendations.</li>
            </ol>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="inline-block h-3 w-[3px] bg-[#C23845]" />
              <h3 className="text-[13px] font-extrabold text-[#1F1F1F]">
                Price Not Included
              </h3>
            </div>
            <ol className="space-y-0.5 text-[9px] leading-[1.3] text-[#333333]">
              <li>1. International flights to Beijing and out of Hong Kong.</li>
              <li>2. China visa fees and Hong Kong PAR (PAR is free; visa fees vary by nationality).</li>
              <li>3. Travel insurance.</li>
              <li>4. Lunches and dinners outside the noted included meals.</li>
              <li>5. Local urban transport in each city (metro, taxi, Didi) outside the included transfers and day trips.</li>
              <li>6. Optional add-ons: full-time private guide and private car within each city (available on request, quoted separately).</li>
              <li>7. Personal expenses — laundry, minibar, phone, alcohol, souvenirs.</li>
              <li>8. Additional costs caused by delays, cancellations, weather, or other force majeure events.</li>
              <li>9. Any item not explicitly listed under &quot;Price Included&quot;.</li>
            </ol>
          </div>
        </motion.div>

        <div className="pb-4 text-center text-xs text-stone-400">
          <p>China · 16-day itinerary for Vaishvi · 15–30 May 2026</p>
        </div>
      </div>
    </div>
  );
}
