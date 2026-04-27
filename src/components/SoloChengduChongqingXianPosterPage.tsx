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

const FEATURE_IMAGE = "/uploads/itinerary/chongqing/hongyadong1.jpg";

const PRODUCT_IMAGES = [
  "/uploads/itinerary/chengdu/panda1.jpg",
  "/uploads/itinerary/chongqing/wulong1.jpg",
  "/uploads/itinerary/vaishvi-terracotta.jpg",
  "/uploads/itinerary/vaishvi-mthua.jpg",
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
  destinationEn: "Sichuan +",
  subtitle: "SOLO · CHENGDU · CHONGQING · XI'AN",
  attractions: [
    {
      id: "1",
      nameEn: "Giant Pandas · Chengdu",
      image: "/uploads/itinerary/chengdu/panda1.jpg",
    },
    {
      id: "2",
      nameEn: "Jiuzhaigou Valley",
      image: "/uploads/itinerary/solo64218-jiuzhaigou.jpg",
    },
    {
      id: "3",
      nameEn: "Wulong Karst (UNESCO)",
      image: "/uploads/itinerary/chongqing/wulong1.jpg",
    },
    {
      id: "4",
      nameEn: "Hongyadong night view",
      image: "/uploads/itinerary/chongqing/hongyadong1.jpg",
    },
    {
      id: "5",
      nameEn: "Terracotta Warriors",
      image: "/uploads/itinerary/vaishvi-terracotta.jpg",
    },
    {
      id: "6",
      nameEn: "Mt. Hua (Huashan)",
      image: "/uploads/itinerary/vaishvi-mthua.jpg",
    },
  ] satisfies Attraction[],
};

const cityStays: CityStay[] = [
  {
    city: "Chengdu",
    nights: "4 nights (incl. Jiuzhaigou side trip)",
    area: "Chunxi Road / Jinli — central, walkable, hostel + 4★ options",
  },
  {
    city: "Jiuzhaigou",
    nights: "1 night",
    area: "Near park entrance — 3★ hotel or Yeti Hostel (Aug peak ~¥350)",
  },
  {
    city: "Chongqing",
    nights: "3 nights",
    area: "Jiefangbei / Hongya Cave — everything walkable, lively, safe at night",
  },
  {
    city: "Xi'an",
    nights: "4 nights",
    area: "Inside or near the City Wall — walking distance to Bell Tower",
  },
];

const itineraryDays: ItineraryDay[] = [
  {
    day: "DAY 1",
    date: "Arrival · Chengdu",
    title: "Land Chengdu · Jinli evening stroll",
    tags: ["Airport pickup included", "Light pacing"],
    items: [
      "✈️ Arrival at Chengdu Tianfu (TFU) or Shuangliu (CTU)",
      "Pre-arranged transfer → hotel near Chunxi Road / Jinli",
      "Light evening: Jinli Ancient Street + Wuhou Temple precinct (free to walk, lantern atmosphere)",
      "Quick dinner: noodles or street snacks ¥15–40",
    ],
  },
  {
    day: "DAY 2",
    date: "Chengdu · Pandas + Culture",
    title: "Panda Base · Wide & Narrow Alleys · Sichuan Opera",
    tags: ["English-speaking guide", "Opera tickets included"],
    items: [
      "Early morning: Chengdu Panda Base — go at 8:30am opening, pandas are most active before 10",
      "Late morning: Wide & Narrow Alleys (Kuanzhai Xiangzi) — teahouses, snacks, photo lanes",
      "Afternoon: People's Park — locals at mahjong + Heming Teahouse (¥15 for tea, all afternoon)",
      "Evening: Sichuan Opera with face-changing show at Shufeng Yayun (~¥150–280)",
    ],
  },
  {
    day: "DAY 3",
    date: "Chengdu · Day trip",
    title: "Mt. Qingcheng + Dujiangyan",
    tags: ["UNESCO double-header", "Cool mountain break from city heat"],
    items: [
      "Morning: Mt. Qingcheng — birthplace of Taoism, forested temple hike (cable car option)",
      "Afternoon: Dujiangyan irrigation system — 2,200-year-old engineering marvel still in use today",
      "~1.5h each from Chengdu by HSR; can comfortably do both in a day",
      "Evening: return to Chengdu, hot pot dinner if you want to ease into spicy (mild yuanyang split-pot)",
    ],
  },
  {
    day: "DAY 4",
    date: "Chengdu → Jiuzhaigou",
    title: "Fly to Jiuzhaigou · Park-side check-in",
    tags: ["Flight booked (~1h)", "Pack a fleece + windbreaker"],
    items: [
      "Morning: ✈️ Chengdu → Jiuzhaigou Huanglong (JZH) ~1h (vs 8h drive)",
      "Transfer to hotel near park entrance",
      "Afternoon at altitude: rest, light walk, hydrate (Jiuzhaigou is at 2,000m+)",
      "Dinner: park-village restaurants — Tibetan-Qiang flavoured set meals",
    ],
  },
  {
    day: "DAY 5",
    date: "Jiuzhaigou full day",
    title: "Jiuzhaigou Valley — turquoise lakes + waterfalls",
    tags: ["English-speaking guide", "Park ticket pre-booked", "Shuttle included"],
    items: [
      "Full day on the Y-shaped boardwalks: Long Lake → Five-Colour Pond → Pearl Shoal Falls → Five Flower Lake → Nuorilang Falls",
      "Park shuttle bus loops the valley — easy to combine all three arms",
      "Pack: layers (10–25°C), waterproof shoes, light rain jacket — frequent showers in Aug",
      "Late afternoon: return to Chengdu (✈️ JZH → CTU) · sleep Chengdu",
    ],
  },
  {
    day: "DAY 6",
    date: "Chengdu → Chongqing",
    title: "Chengdu morning · HSR to Chongqing",
    tags: ["G-class train ~1.5h · ¥150"],
    items: [
      "Morning at leisure: optional Sichuan cooking class or Du Fu Thatched Cottage",
      "🚄 Chengdu East → Chongqing North (~1.5h)",
      "Check in at Jiefangbei / Hongya Cave area hotel",
      "Evening: walk Hongya Cave illuminated stilt buildings (best photo from Qiansimen Bridge at 7pm)",
    ],
  },
  {
    day: "DAY 7",
    date: "Chongqing · 8D City",
    title: "Liziba Light Rail · Three Gorges Museum · Hotpot",
    tags: ["English-speaking guide", "Cable car ticket included"],
    items: [
      "Morning: Liziba Light Rail Station — yes, the metro that goes through a 19-storey building (Line 2, Huanghuayuan → Liziba, photo from viewing platform)",
      "Late morning: Three Gorges Museum (free, passport reservation) + People's Assembly Hall photo stop",
      "Light lunch — save room for hotpot dinner",
      "Afternoon: Shibati (18 Steps) + Shancheng Lane — old hillside alleys, stilt houses, river views",
      "Late afternoon: Yangtze River Cableway — iconic 5-min crossing (¥30 one-way)",
      "Evening: Hongyadong night view from Qiansimen Bridge · optional Two Rivers Night Cruise (~¥150, 45 min)",
      "Late dinner: Chongqing hotpot at Liuyishou or Xiaobin Lou — yuanyang split-pot, mild + spicy. Veg picks: lotus root, mushrooms, tofu, leafy greens, sweet potato noodles",
    ],
  },
  {
    day: "DAY 8",
    date: "Chongqing · Wulong Karst",
    title: "UNESCO Three Natural Bridges + Longshuixia",
    tags: ["English-speaking guide", "Tickets pre-booked", "Day trip transport"],
    items: [
      "Full day: Wulong Karst National Geology Park (~3h drive from Chongqing)",
      "Three Natural Bridges — colossal stone arches (Transformers 4 location), easy canyon walking trail",
      "Longshuixia Gap — deep gorge with glass walkways + waterfalls",
      "Optional: Furong Cave — one of China's most beautiful limestone caves",
      "Cooler than the city — perfect break from August heat",
      "Late return to Chongqing · casual dinner near hotel",
    ],
  },
  {
    day: "DAY 9",
    date: "Chongqing → Xi'an",
    title: "Dazu Rock Carvings · HSR to Xi'an",
    tags: ["UNESCO morning", "G-class train ~5h · ¥260–550"],
    items: [
      "Morning: Dazu Rock Carvings (UNESCO) — 1.5h drive · 50,000+ Buddhist/Taoist/Confucian rock sculptures (9th–13th c.)",
      "Budget swap: Ciqikou Ancient Town instead — riverside town within Chongqing, free entry, street food + craft shops",
      "Afternoon: return to Chongqing North Railway Station",
      "🚄 Chongqing North → Xi'an North (~5h)",
      "Late evening arrival Xi'an, transfer to City Wall hotel",
    ],
  },
  {
    day: "DAY 10",
    date: "Xi'an · Terracotta Day",
    title: "Terracotta Warriors + Huaqing Palace",
    tags: ["English-speaking guide", "Tickets pre-booked"],
    items: [
      "Morning: drive to Lintong (~1h) → Terracotta Warriors Pits 1, 2, 3 + bronze chariots hall",
      "Lunch: site restaurant — pre-arranged set meal",
      "Afternoon: Huaqing Palace — imperial hot springs at the foot of Mt. Li, Tang dynasty pools + Xi'an Incident sites",
      "Return to Xi'an evening · explore Bell + Drum Tower square",
    ],
  },
  {
    day: "DAY 11",
    date: "Xi'an · Mt. Hua",
    title: "Huashan day trip — granite cliffs",
    tags: ["High-speed train + cable cars booked"],
    items: [
      "🚄 Xi'an North → Huashan North (~30 min)",
      "Cable car up to West Peak → walk ridges to South + East peaks → cable car down (4–5h comfortable walking)",
      "Pine forests · mountain temples · stunning granite cliffs",
      "Optional 'Plank Walk' — skippable; rest of mountain is perfectly safe solo",
      "Return to Xi'an evening · dinner inside the City Wall",
    ],
  },
  {
    day: "DAY 12",
    date: "Xi'an · City day",
    title: "City Wall cycle · Shaanxi Museum · Muslim Quarter",
    tags: ["Bicycle hire arranged", "Museum free with passport"],
    items: [
      "Morning: cycle the top of Xi'an City Wall (hire at South Gate, half loop ~1h — full loop 14km if up for it)",
      "Late morning: Shaanxi History Museum — free entry with passport reservation, one of China's best museums",
      "Lunch: Muslim Quarter (Beiyuanmen) — biangbiang noodles, persimmon cakes, lamb skewers",
      "Afternoon: Big Wild Goose Pagoda — 7th-century pagoda for Xuanzang's scriptures from India",
      "Evening: optional Tang Dynasty show + dumpling banquet, or relaxed last-night walk",
    ],
  },
  {
    day: "DAY 13",
    date: "Departure",
    title: "Last morning · Fly home",
    tags: ["Airport drop-off included"],
    items: [
      "Morning: last-minute shopping (Muslim Quarter dry-fruit + tea) or relaxed breakfast",
      "Transfer to Xi'an Xianyang Airport (XIY) — allow 90 min by car",
      "✈️ Departure",
    ],
  },
];

const beforeYouTravel = [
  {
    title: "China visa (L tourist)",
    body: "Apply 4–6 weeks ahead. Standard tourist L visa covers all four cities.",
  },
  {
    title: "eSIM + VPN",
    body: "WhatsApp, Google, Instagram, YouTube are blocked on the mainland. Get a China-friendly travel eSIM with built-in VPN (Holafly, Airalo) — ~₹1,500–2,500 for 2 weeks unlimited.",
  },
  {
    title: "Payment setup",
    body: "WeChat Pay or Alipay linked to an international card is essential — taxis, food, museums all expect it. We'll guide you on setup before departure.",
  },
  {
    title: "Museum reservations",
    body: "Free with passport: Shaanxi History Museum, Three Gorges Museum, Sanxingdui, Chengdu Museum. We'll lock in slots ahead of time.",
  },
  {
    title: "Apps to download",
    body: "AMaps + Trip.com (both work without VPN, both have English). Add WeChat for everything else.",
  },
];

const soloNotes = [
  {
    title: "Safety",
    body: "China is one of the safest countries in Asia for solo travellers. Petty theft is rare in tourist areas; public transport is safe at night in Chengdu, Xi'an and central Chongqing.",
  },
  {
    title: "English-speaking guide",
    body: "Booked only on the high-value days (Days 2, 5, 7, 8, 10) to keep budget tight — Panda + culture, Jiuzhaigou, Chongqing 8D city, Wulong, Terracotta. Add ~¥500/day per city for continuity if you want the same guide accompanying you throughout.",
  },
  {
    title: "August climate + packing",
    body: "Chengdu / Chongqing / Xi'an: 25–38°C, humid, frequent short showers — light cotton/linen, breathable shorts/dresses, walking sandals + grip shoes for Mt. Hua, sun hat, sunscreen, mosquito repellent, light umbrella. Jiuzhaigou: 10–25°C, fleece + windbreaker + waterproof shoes. Mt. Hua: long sleeves + thin jacket. Modest dress only at Buddhist/Taoist temples (cover shoulders).",
  },
  {
    title: "Money-saving picks",
    body: "HSR beats flights on sub-1000 km routes (Chengdu↔Chongqing, Chengdu↔Xi'an, Chongqing↔Xi'an). Eat where locals eat — small noodle shops + baozi stalls + Muslim Quarter / Jinli / Ciqikou street food are ¥15–40 per meal vs ¥80–150 at tourist restaurants.",
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

export default function SoloChengduChongqingXianPosterPage() {
  const [pandas, jiuzhaigou, wulong, hongyadong, terracotta, mthua] =
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
                Madhujith Solo Trip | Chengdu × Chongqing × Xi'an · 13 Days 12 Nights
              </h2>
              <p className="text-[13px] font-normal leading-snug text-[#4A4A4A]">
                Pandas · Jiuzhaigou · Wulong Karst · Terracotta · Mt. Hua | Budget-conscious solo plan
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                "24/7 WhatsApp concierge",
                "English-speaking guide on key days",
                "Budget-friendly stays",
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
              Solo traveller · August trip · mid-budget
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90">
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
              <AttractionCard attraction={pandas} />
              <AttractionCard attraction={hongyadong} />
            </div>

            <div className="grid grid-cols-1">
              <AttractionCard attraction={wulong} fullWidth />
            </div>

            <FeaturedAttractionCard attraction={jiuzhaigou} />
            <FeaturedAttractionCard attraction={terracotta} reverse />

            <div className="grid grid-cols-1">
              <AttractionCard attraction={mthua} fullWidth />
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
                  <th className="px-3 py-2 text-left font-semibold">Nights</th>
                  <th className="px-3 py-2 text-left font-semibold">City</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-[#333]">
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">1</td>
                  <td className="px-3 py-2">4</td>
                  <td className="px-3 py-2">Chengdu (incl. Jiuzhaigou side trip)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">2</td>
                  <td className="px-3 py-2">1</td>
                  <td className="px-3 py-2">Jiuzhaigou</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">3</td>
                  <td className="px-3 py-2">3</td>
                  <td className="px-3 py-2">Chongqing</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">4</td>
                  <td className="px-3 py-2">4</td>
                  <td className="px-3 py-2">Xi'an</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-stone-500">
            Total: 12 nights. Routing via HSR + 1 short flight to Jiuzhaigou. Wulong Karst (UNESCO) is the central
            nature highlight of the Chongqing leg.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative overflow-hidden rounded-xl shadow-md"
        >
          <img
            src={FEATURE_IMAGE}
            alt="Chongqing Hongyadong night view backdrop"
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
            src="/uploads/itinerary/chongqing/wulong1.jpg"
            alt="Wulong Karst feature"
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
                4 cities · 12 nights
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
              Solo traveller · practical notes
            </h3>
          </div>
          <div className="space-y-2.5">
            {soloNotes.map((item) => (
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
              <li>1. Hotels: 12 nights across 4 cities (Chengdu 4 · Jiuzhaigou 1 · Chongqing 3 · Xi&apos;an 4) — central, budget-friendly options.</li>
              <li>2. Pre-arranged airport pickup in Chengdu (Day 1) + airport drop-off in Xi&apos;an (Day 13).</li>
              <li>3. Inter-city transport: round-trip flight Chengdu ↔ Jiuzhaigou; HSR Chengdu → Chongqing; HSR Chongqing → Xi&apos;an.</li>
              <li>4. Tickets pre-booked: Chengdu Panda Base, Sichuan Opera, Mt. Qingcheng + Dujiangyan, Jiuzhaigou park + shuttle, Yangtze Cableway, Wulong Karst, Dazu Rock Carvings, Terracotta Warriors, Huaqing Palace, Mt. Hua return cable car, City Wall bicycle, Shaanxi History Museum.</li>
              <li>5. Day trips: Mt. Qingcheng + Dujiangyan (Day 3), Jiuzhaigou (Day 5), Wulong Karst (Day 8), Dazu Rock Carvings (Day 9), Terracotta + Huaqing (Day 10), Mt. Hua (Day 11).</li>
              <li>6. English-speaking guide on the high-value days (Day 2, 5, 7, 8, 10).</li>
              <li>7. 24/7 WhatsApp concierge: restaurant bookings, taxi help, on-the-ground assistance throughout.</li>
              <li>8. Pre-trip planning: visa guidance, payment setup (WeChat/Alipay), eSIM + VPN recommendations, museum reservations.</li>
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
              <li>1. International flights to Chengdu and out of Xi&apos;an.</li>
              <li>2. China visa fees (vary by nationality).</li>
              <li>3. Travel insurance.</li>
              <li>4. Lunches and dinners outside the noted included meals.</li>
              <li>5. Local urban transport in each city (metro, taxi, Didi) outside the included transfers and day trips.</li>
              <li>6. Optional add-ons: continuity guide across all days (~¥500/day per city), Furong Cave entry, Tang Dynasty show.</li>
              <li>7. Personal expenses — laundry, minibar, phone, alcohol, souvenirs.</li>
              <li>8. Additional costs caused by delays, cancellations, weather, or other force majeure events.</li>
              <li>9. Any item not explicitly listed under &quot;Price Included&quot;.</li>
            </ol>
          </div>
        </motion.div>

        <div className="pb-4 text-center text-xs text-stone-400">
          <p>Chengdu · Chongqing · Xi&apos;an · 13-day solo itinerary</p>
        </div>
      </div>
    </div>
  );
}
