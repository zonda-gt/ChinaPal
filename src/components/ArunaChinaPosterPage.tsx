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
const CANTON_TOWER_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Canton_Tower%2C_Guangzhou%2C_CN_Lit_up_at_night.jpg";

const PRODUCT_IMAGES = [
  CANTON_TOWER_IMAGE,
  "/uploads/itinerary/thebund.jpeg",
  "/uploads/itinerary/avatar.jpeg",
  "/uploads/itinerary/beijing/scraper/forbidden-taihe.jpg",
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
  hotel: string;
  hotelCn: string;
  pricePerRoom: string;
}

interface TransportLeg {
  date: string;
  route: string;
  mode: "Flight" | "Train";
  number: string;
  time: string;
  pricePerPax: string;
}

const poster = {
  destinationEn: "China",
  subtitle: "ARUNA · 15 DAYS · 6 CITIES",
  attractions: [
    {
      id: "1",
      nameEn: "Canton Tower · Guangzhou",
      image: CANTON_TOWER_IMAGE,
    },
    {
      id: "2",
      nameEn: "Hongya Cave · Chongqing",
      image: "/uploads/itinerary/chongqing/hongyadong1.jpg",
    },
    {
      id: "3",
      nameEn: "The Bund · Shanghai",
      image: BUND_IMAGE,
    },
    {
      id: "4",
      nameEn: "Avatar Mountains · Zhangjiajie",
      image: "/uploads/itinerary/avatar.jpeg",
    },
    {
      id: "5",
      nameEn: "Terracotta Warriors · Xi'an",
      image: "/uploads/itinerary/vaishvi-terracotta.jpg",
    },
    {
      id: "6",
      nameEn: "Forbidden City · Beijing",
      image: "/uploads/itinerary/beijing/scraper/forbidden-taihe.jpg",
    },
  ] satisfies Attraction[],
};

const cityStays: CityStay[] = [
  {
    city: "Guangzhou",
    nights: "2 nights · 26–28 Aug",
    area: "Tianhe — Taikoo Hui Plaza, on Shipaiqiao metro station",
    hotel: "Lavande Hotel (Guangzhou Taikoo Hui · Shipaiqiao Metro)",
    hotelCn: "麗枫酒店(广州太古汇广场石牌桥地铁站店)",
    pricePerRoom: "¥430 / room / night",
  },
  {
    city: "Chongqing",
    nights: "1 night · 28–29 Aug",
    area: "Yuzhong — Jiefangbei pedestrian street, walking distance to Hongya Cave",
    hotel: "Jinke Shengjia Hotel (Jiefangbei Pedestrian Street · Hongya Cave)",
    hotelCn: "金科圣嘉酒店(解放碑步行街洪崖洞店)",
    pricePerRoom: "¥330 / room / night",
  },
  {
    city: "Shanghai",
    nights: "2 nights · 29–31 Aug",
    area: "Pudong Lujiazui — by the Oriental Pearl Tower · 5 friends join here",
    hotel: "Crystal Orange Hotel Shanghai Lujiazui Oriental Pearl",
    hotelCn: "上海陆家嘴东方明珠桔子水晶酒店",
    pricePerRoom: "¥410 / room / night",
  },
  {
    city: "Zhangjiajie",
    nights: "3 nights · 31 Aug – 3 Sep",
    area: "Zhangjiajie city — right by the Tianmen Mountain cable car station",
    hotel: "Mengtu Hotel No.1 West Street Zhangjiajie (Tianmen Cable Car)",
    hotelCn: "张家界西街一号梦途酒店(天门山索道店)",
    pricePerRoom: "¥360 / room / night",
  },
  {
    city: "Xi'an",
    nights: "2 nights · 3–5 Sep",
    area: "Datang Everbright City — by the Datang Furong Garden",
    hotel: "Vienna International Hotel (Xi'an Datang Everbright · Furong Garden)",
    hotelCn: "维也纳国际酒店(西安大唐不夜城大唐芙蓉园店)",
    pricePerRoom: "¥350 / room / night",
  },
  {
    city: "Beijing",
    nights: "4 nights · 5–9 Sep",
    area: "Tiananmen / Forbidden City area — walking distance to the central axis",
    hotel: "Beijing Tiananmen Forbidden City Baogui Hotel",
    hotelCn: "北京天安门故宫宝櫃酒店",
    pricePerRoom: "¥550 / room / night",
  },
];

const transports: TransportLeg[] = [
  {
    date: "Fri 28 Aug",
    route: "Guangzhou → Chongqing",
    mode: "Train",
    number: "G-class bullet train",
    time: "08:30 – 14:24 (~6 hrs)",
    pricePerPax: "¥600 / pax",
  },
  {
    date: "Sat 29 Aug",
    route: "Chongqing → Shanghai",
    mode: "Flight",
    number: "FM9420",
    time: "17:30 – 20:00 (~2.5 hrs)",
    pricePerPax: "¥1,090 / pax",
  },
  {
    date: "Mon 31 Aug",
    route: "Shanghai → Zhangjiajie",
    mode: "Train",
    number: "G-class bullet train",
    time: "07:04 – 14:19 (~7 hrs 15 min)",
    pricePerPax: "¥784 / pax",
  },
  {
    date: "Thu 3 Sep",
    route: "Zhangjiajie → Xi'an",
    mode: "Flight",
    number: "GS7662",
    time: "15:25 – 16:55 (~1 hr 30 min)",
    pricePerPax: "¥930 / pax",
  },
  {
    date: "Sat 5 Sep",
    route: "Xi'an → Beijing",
    mode: "Train",
    number: "G-class bullet train",
    time: "10:02 – 14:21 (~4 hrs 20 min)",
    pricePerPax: "¥540 / pax",
  },
];

const itineraryDays: ItineraryDay[] = [
  {
    day: "DAY 1",
    date: "Wed 26 Aug · Arrival",
    title: "Land in Guangzhou · Pearl River cruise",
    tags: ["Airport pickup included", "Pearl River cruise", "Indian dinner"],
    items: [
      "Group arrival at Guangzhou Baiyun International (CAN) ~2 PM",
      "Private coach transfer with English-speaking representative",
      "Hotel check-in + welcome briefing",
      "Pearl River evening cruise — seated, AC, panoramic skyline",
      "Welcome dinner at an Indian restaurant in Guangzhou (transfer arranged)",
      "Hotel: 4★ Tianhe or Yuexiu area",
    ],
  },
  {
    day: "DAY 2",
    date: "Thu 27 Aug",
    title: "Guangzhou Highlights · Canton Tower",
    tags: ["Pre-booked tickets", "Canton Tower observation deck"],
    items: [
      "Chen Clan Ancestral Hall — Cantonese architecture, flat courtyards",
      "Shamian Island — colonial-era European architecture, tree-lined walking",
      "Vegetarian Cantonese dim sum lunch (no meat/fish — pre-arranged)",
      "Beijing Lu pedestrian street — shopping and street life",
      "Canton Tower — elevator to observation deck for sunset and night skyline",
      "Indian dinner in Guangzhou (transfer arranged)",
    ],
  },
  {
    day: "DAY 3",
    date: "Fri 28 Aug · Bullet train",
    title: "Guangzhou → Chongqing · Liziba · Hongya Cave",
    tags: ["G-class train", "Liziba monorail", "Hongya Cave at dusk"],
    items: [
      "Early breakfast · check-out · transfer to Guangzhou South Station",
      "🚄 G-class bullet train Guangzhou → Chongqing 08:30 – 14:24 (~6 hrs, group seating arranged)",
      "Light meal on board (packed by hotel)",
      "Coach transfer to hotel · check-in (~15:30)",
      "Liziba Station — quick photo stop where the monorail passes through the apartment building",
      "Kuixing building + Jiefangbei pedestrian street — late-afternoon walk",
      "Hongya Cave at dusk — multi-level stilt complex with elevators",
      "Indian dinner in Chongqing (vegetarian if Indian unavailable — pre-arranged)",
      "Hotel: Jinke Shengjia Hotel, Yuzhong (riverside near Hongya Cave)",
    ],
  },
  {
    day: "DAY 4",
    date: "Sat 29 Aug · Flight",
    title: "Chongqing Zoo · → Shanghai · 5 friends join",
    tags: ["Giant pandas", "Domestic flight", "Group meet-up"],
    items: [
      "Early breakfast · Chongqing Zoo opens 8 AM",
      "Giant pandas — battery-operated carts available, ~2 hrs at relaxed pace",
      "Light vegetarian lunch in Chongqing",
      "Afternoon transfer to Chongqing Jiangbei (CKG)",
      "✈️ Flight FM9420 Chongqing → Shanghai Hongqiao 17:30 – 20:00 (~2.5 hrs)",
      "5 additional friends join at Shanghai hotel (group now 23 — TBC)",
      "Combined-group Indian dinner at hotel area (late dinner)",
      "Hotel: Crystal Orange Hotel Shanghai Lujiazui Oriental Pearl",
    ],
  },
  {
    day: "DAY 5",
    date: "Sun 30 Aug",
    title: "Shanghai full day · Yu Garden · Bund · Lujiazui",
    tags: ["Yu Garden tickets", "Huangpu cruise", "Packed day"],
    items: [
      "Yu Garden — classical garden, flat walking + Yu Garden Bazaar (morning)",
      "Vegetarian dumplings lunch at Nanxiang (no meat — pre-arranged)",
      "The Bund — colonial architecture + Pudong skyline photo stop",
      "Shanghai Tower observation deck — Lujiazui skyline (afternoon)",
      "Quick French Concession / Xintiandi walk if time permits",
      "Huangpu River Evening Cruise — seated, AC, panoramic skyline",
      "Indian dinner at Bund-area restaurant (transfer arranged)",
    ],
  },
  {
    day: "DAY 6",
    date: "Mon 31 Aug · Bullet train",
    title: "Shanghai → Zhangjiajie · 72 Wonders Tower",
    tags: ["G-class train", "Group seating arranged"],
    items: [
      "Boxed breakfast · pre-dawn transfer to Shanghai Hongqiao Station",
      "🚄 G-class bullet train Shanghai → Zhangjiajie West 07:04 – 14:19 (~7 hrs 15 min, group seating arranged)",
      "Light meal on board (packed by hotel)",
      "Arrival Zhangjiajie · private coach transfer to hotel",
      "Evening visit: 72 Wonders Tower (illuminated after dark)",
      "Light vegetarian dinner at hotel",
      "Hotel: Mengtu Hotel No.1 West Street (right by Tianmen cable car)",
    ],
  },
  {
    day: "DAY 7",
    date: "Tue 1 Sep",
    title: "Tianmen Mountain · Heaven's Gate",
    tags: ["Cable car both ways", "Glass Skywalk included", "No 999 steps"],
    items: [
      "Drive to Tianmen Mountain Cable Car station (in city)",
      "Tianmen Mountain Cable Car up — ~30-min scenic ride, one of the world's longest",
      "Escalators inside the mountain to viewpoints (no stairs)",
      "Glass Skywalk — included (non-glass viewing path also available for those uncomfortable with heights)",
      "Heaven's Gate — shuttle + escalator down to view from platform (skipping the 999 steps)",
      "Cable car back down (no 99-bend coach descent — gentler ride)",
      "Vegetarian lunch in Zhangjiajie city · free afternoon at hotel · vegetarian dinner at hotel",
    ],
  },
  {
    day: "DAY 8",
    date: "Wed 2 Sep",
    title: "Zhangjiajie Forest Park · Avatar Mountains",
    tags: ["Bailong glass elevator", "No climbing required"],
    items: [
      "Drive to Zhangjiajie National Forest Park (~40 mins from Zhangjiajie city)",
      "Bailong Glass Elevator — world's tallest outdoor elevator, no climbing",
      "Yuanjiajie — Avatar Hallelujah viewpoint + First Bridge Under Heaven",
      "Vegetarian lunch at a mountain-top restaurant inside the park",
      "Shuttle to Tianzi Mountain area · cable car or shuttle down",
      "Return to hotel · vegetarian dinner at hotel",
    ],
  },
  {
    day: "DAY 9",
    date: "Thu 3 Sep · Flight",
    title: "Zhangjiajie morning · → Xi'an · City Wall sunset",
    tags: ["Optional Baofeng Lake / Glass Bridge", "Domestic flight", "City Wall electric cart"],
    items: [
      "Relaxed breakfast · check-out",
      "Optional morning excursion: Baofeng Lake boat cruise (gentle, recommended) OR Grand Canyon Glass Bridge",
      "Vegetarian lunch in Zhangjiajie",
      "Transfer to Zhangjiajie Hehua (DYG) airport",
      "✈️ Flight GS7662 Zhangjiajie → Xi'an Xianyang (XIY) 15:25 – 16:55 (~1 hr 30 min)",
      "Coach transfer to Xi'an hotel · check-in (~18:00)",
      "Xi'an City Wall — electric cart along the wall, photo stops + sunset view at the east side",
      "Indian dinner near Bell Tower area (transfer arranged)",
      "Hotel: Vienna International (Xi'an Datang Everbright)",
    ],
  },
  {
    day: "DAY 10",
    date: "Fri 4 Sep",
    title: "Terracotta Warriors · Muslim Quarter · Tang Show",
    tags: ["Tickets pre-booked", "Tang Dynasty Show"],
    items: [
      "Drive to Terracotta Warriors Museum (~1 hr)",
      "Guided visit — Pits 1, 2, 3 + Bronze Chariots Hall",
      "Vegetarian lunch museum-side (no meat — pre-arranged)",
      "Return to Xi'an",
      "Big Wild Goose Pagoda from the plaza · Great Tang All Day Mall stroll",
      "Muslim Quarter evening walk (Beiyuanmen) — split into two groups so guide accommodates slower walkers",
      "Tang Dynasty Show (show only) + separate Indian / vegetarian dinner pre-arranged",
    ],
  },
  {
    day: "DAY 11",
    date: "Sat 5 Sep · Bullet train",
    title: "Xi'an → Beijing · Houhai evening",
    tags: ["G-class train", "Evening at leisure"],
    items: [
      "Breakfast · transfer to Xi'an North Station",
      "🚄 G-class bullet train Xi'an → Beijing West 10:02 – 14:21 (~4 hrs 20 min, group seating arranged)",
      "Arrival Beijing · coach transfer to hotel · check-in",
      "Houhai / Shichahai evening — \"Bund of Beijing\" lakeside walk",
      "Wangfujing street and night market (browse only — Indian dinner arranged separately)",
      "Indian dinner in Wangfujing area (transfer arranged)",
      "Hotel: Beijing Tiananmen Forbidden City Baogui Hotel",
    ],
  },
  {
    day: "DAY 12",
    date: "Sun 6 Sep",
    title: "Great Wall at Mutianyu · Olympic Park",
    tags: ["Cable car both ways", "Toboggan add-on ¥120/pax", "Olympic Park night view"],
    items: [
      "Early drive to Mutianyu (~1.5 hrs) — chosen over Badaling for fewer crowds",
      "Cable car up — included",
      "Walk a short, restored Wall section at the top",
      "Cable car down — included · OR toboggan down as a paid add-on (~¥120 per person, settled directly)",
      "Vegetarian lunch at a Wall-side restaurant (no meat — pre-arranged)",
      "Return to Beijing",
      "Olympic Park night view — drive-by stop at the Bird's Nest + Water Cube illuminated",
      "Indian dinner in Beijing (transfer arranged)",
    ],
  },
  {
    day: "DAY 13",
    date: "Mon 7 Sep",
    title: "Forbidden City · Tiananmen · Temple of Heaven",
    tags: ["Forbidden City pre-booked", "Golf-cart entry", "Time-wise plan"],
    items: [
      "07:30  Breakfast at hotel",
      "08:30  Depart hotel by coach",
      "09:00  Tiananmen Square — flat, photo stops (~45 min)",
      "09:45  Walk to Forbidden City entrance · golf-cart entry",
      "09:45–12:30  Forbidden City — central axis only with English-speaking guide (~2.75 hrs)",
      "12:45–14:00  Vegetarian / Indian lunch near Qianmen",
      "14:30–17:00  Temple of Heaven — flat park, afternoon culture (tai chi, calligraphy) (~2.5 hrs)",
      "17:30  Return to hotel for short rest",
      "19:00  Indian dinner near Wangfujing (transfer arranged)",
    ],
  },
  {
    day: "DAY 14",
    date: "Tue 8 Sep",
    title: "Summer Palace · Hutong rickshaw · Shopping",
    tags: ["Boat ride included", "Family courtyard visit", "Time-wise plan"],
    items: [
      "08:00  Breakfast at hotel",
      "09:00  Depart hotel by coach",
      "09:30–12:30  Summer Palace — Kunming Lake boat ride · Long Corridor · Marble Boat (~3 hrs)",
      "12:45–13:45  Vegetarian / Indian lunch",
      "14:15–16:00  Hutong rickshaw tour through Shichahai · family courtyard visit included (~1.75 hrs)",
      "16:15–18:00  Wangfujing afternoon shopping — coach available for early hotel return",
      "19:00  Indian farewell dinner (transfer arranged)",
    ],
  },
  {
    day: "DAY 15",
    date: "Wed 9 Sep · Departure",
    title: "4 AM transfer to PKX · Departure",
    tags: ["4:00 AM coach", "8:30 AM flight"],
    items: [
      "03:30  Wake-up call · boxed breakfast · check-out",
      "04:00  Coach transfer to Beijing Daxing (PKX)",
      "06:00  Arrival at PKX (allows ~2.5 hrs for check-in / immigration)",
      "08:30  Group's main departure flight",
      "No sightseeing today — departure-only day",
      "5 friends with different return flights → separate transfers arranged to suit each flight time",
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
  const [cantonTower, hongya, bund, avatar, terracotta, forbidden] =
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
                Aruna Group Trip | China 15 Days 14 Nights
              </h2>
              <p className="text-[13px] font-normal leading-snug text-[#4A4A4A]">
                6 cities · 18 pax (23 from Shanghai onwards — TBC) · Indian veg / vegetarian throughout (no meat, no fish) · English-speaking national escort
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                "24/7 WhatsApp concierge",
                "4-star stays",
                "Indian veg / vegetarian",
                "Private coach",
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

            <div className="space-y-1">
              <p className="text-[20px] font-semibold leading-none text-[#3F3F3F]">
                from ¥ 12,800 / person
                <span className="ml-2 text-[12px] font-normal text-stone-500">main group · 18 pax · 14 nights</span>
              </p>
              <p className="text-[15px] font-semibold leading-none text-[#3F3F3F]">
                ¥ 9,100 / person
                <span className="ml-2 text-[12px] font-normal text-stone-500">5 friends · 9 nights · joining later</span>
              </p>
            </div>
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
              <AttractionCard attraction={cantonTower} />
              <AttractionCard attraction={hongya} />
            </div>

            <div className="grid grid-cols-1">
              <AttractionCard attraction={avatar} fullWidth />
            </div>

            <FeaturedAttractionCard attraction={bund} />
            <FeaturedAttractionCard attraction={terracotta} reverse />

            <div className="grid grid-cols-1">
              <AttractionCard attraction={forbidden} fullWidth />
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
              Route overview · 14 nights
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
                  <td className="px-3 py-2">26–28 Aug</td>
                  <td className="px-3 py-2">2</td>
                  <td className="px-3 py-2">Guangzhou</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">2</td>
                  <td className="px-3 py-2">28–29 Aug</td>
                  <td className="px-3 py-2">1</td>
                  <td className="px-3 py-2">Chongqing</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">3</td>
                  <td className="px-3 py-2">29–31 Aug</td>
                  <td className="px-3 py-2">2</td>
                  <td className="px-3 py-2">Shanghai (5 friends join)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">4</td>
                  <td className="px-3 py-2">31 Aug – 3 Sep</td>
                  <td className="px-3 py-2">3</td>
                  <td className="px-3 py-2">Zhangjiajie</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">5</td>
                  <td className="px-3 py-2">3–5 Sep</td>
                  <td className="px-3 py-2">2</td>
                  <td className="px-3 py-2">Xi&apos;an</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#C23845]">6</td>
                  <td className="px-3 py-2">5–9 Sep</td>
                  <td className="px-3 py-2">4</td>
                  <td className="px-3 py-2">Beijing</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-stone-500">
            Inter-city: 3 G-class bullet trains (Guangzhou → Chongqing; Shanghai → Zhangjiajie; Xi&apos;an → Beijing) and 2 domestic flights (Chongqing → Shanghai; Zhangjiajie → Xi&apos;an). Reverse-route start in Guangzhou suits long-haul carriers from Mumbai. Departure 9 Sep 8:30 AM from Beijing Daxing (PKX). Full leg-by-leg detail in the Transport section below.
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
                6 cities · 14 nights
              </p>
              <div className="h-px flex-1 bg-white/40" />
            </div>

            <p className="mt-2 text-[13px] font-semibold tracking-wide text-white/85">
              Twin/double sharing · all selected for location proximity to the day&apos;s attractions
            </p>
          </div>

          <div className="space-y-2">
            {cityStays.map((stay) => (
              <div
                key={stay.city}
                className="space-y-1.5 rounded-md bg-white px-3 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[15px] font-extrabold leading-tight text-[#912F34]">
                    {stay.city}
                  </p>
                  <p className="text-[11px] font-semibold text-[#912F34]/70">
                    {stay.nights}
                  </p>
                </div>
                <p className="text-[12px] font-semibold leading-snug text-[#1F1F1F]">
                  {stay.hotel}
                </p>
                <p className="text-[10.5px] leading-snug text-[#777]">
                  {stay.hotelCn}
                </p>
                <p className="text-[11px] leading-snug text-[#4A4A4A]">
                  {stay.area}
                </p>
                <p className="text-[10px] font-normal leading-snug text-stone-400">
                  {stay.pricePerRoom}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          className="overflow-hidden rounded-xl bg-[#C23845] p-4 shadow-md"
        >
          <div className="px-2 pb-5 pt-3 text-center">
            <h2
              className={`${dancingScript.className} text-6xl leading-none text-white`}
            >
              Transport
            </h2>

            <div className="mx-auto mt-4 flex max-w-[240px] items-center gap-3">
              <div className="h-px flex-1 bg-white/40" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
                3 trains · 2 flights
              </p>
              <div className="h-px flex-1 bg-white/40" />
            </div>

            <p className="mt-2 text-[13px] font-semibold tracking-wide text-white/85">
              Booked legs · group seats arranged
            </p>
            <p className="mt-2 text-[10px] leading-snug text-white/70">
              Trains preferred wherever practical to avoid the 23 kg domestic-flight baggage cap. Two legs kept as flights: Chongqing → Shanghai (the train is 10+ hrs) and Zhangjiajie → Xi&apos;an (no direct train — it would need a Chongqing or Wuhan transfer).
            </p>
          </div>

          <div className="space-y-2">
            {transports.map((leg) => (
              <div
                key={`${leg.date}-${leg.route}`}
                className="space-y-1 rounded-md bg-white px-3 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[14px] font-extrabold leading-tight text-[#912F34]">
                    {leg.route}
                  </p>
                  <span
                    className={`rounded-sm px-2 py-0.5 text-[10px] font-semibold ${
                      leg.mode === "Flight"
                        ? "bg-[#912F34] text-white"
                        : "bg-[#912F34]/10 text-[#912F34]"
                    }`}
                  >
                    {leg.mode}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-[#1F1F1F]">
                  {leg.number}
                </p>
                <p className="text-[11px] leading-snug text-[#4A4A4A]">
                  {leg.date} · {leg.time}
                </p>
                <p className="text-[10px] font-normal leading-snug text-stone-400">
                  {leg.pricePerPax}
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
              <li>1. Hotels: 14 nights in 4★ accommodation across 6 cities (twin/double sharing) with daily breakfast.</li>
              <li>2. Restaurant arrangements: we book the right Indian / vegetarian restaurants in each city (no meat, no fish) and provide transfers — meal costs are settled by the group at the restaurant.</li>
              <li>3. Inter-city transport: 3 G-class bullet trains (Guangzhou → Chongqing; Shanghai → Zhangjiajie; Xi&apos;an → Beijing) and 2 domestic flights (FM9420 Chongqing → Shanghai; GS7662 Zhangjiajie → Xi&apos;an).</li>
              <li>4. Private air-conditioned coach throughout (sized for 18 pax to Shanghai, then upsized for 23 pax from Shanghai onwards — TBC).</li>
              <li>5. English-speaking national escort with the group every day end-to-end, including on the bullet trains, plus a local English-speaking guide in each city.</li>
              <li>6. All airport, train station, hotel and dinner transfers (including the 4 AM coach to PKX on 9 Sep).</li>
              <li>7. Pre-booked entrance tickets to all listed attractions (Chongqing Zoo, Forbidden City, Temple of Heaven, Summer Palace, Yu Garden, Terracotta Warriors, Tianmen Mountain, Forest Park, Canton Tower).</li>
              <li>8. All cable cars, elevators, electric shuttles and boat rides as listed (Bailong glass elevator, Tianmen cable car both ways, Tianmen Glass Skywalk, Mutianyu cable car both ways, Pearl River cruise, Huangpu cruise, Summer Palace boat, Shanghai Tower observation deck, Canton Tower observation deck, City Wall electric cart, Hutong rickshaw with family courtyard visit).</li>
              <li>9. Tang Dynasty Show in Xi&apos;an (show only — separate Indian / vegetarian dinner pre-arranged).</li>
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
              <li>1. International flights to Guangzhou and from Beijing.</li>
              <li>2. China visa fees.</li>
              <li>3. Travel insurance.</li>
              <li>4. Lunches, dinners and snacks — bills are paid directly to the restaurant (we handle bookings, transfers and dietary briefings, daily breakfast is included with the hotel).</li>
              <li>5. Drinks beyond water at meals.</li>
              <li>6. Personal expenses, tips for guides and drivers.</li>
              <li>7. Optional activities not listed (foot massage, Mutianyu toboggan ~¥120 add-on, Zhangjiajie Grand Canyon Glass Bridge).</li>
              <li>8. Extra checked-baggage fees on domestic flights beyond the standard 23 kg allowance.</li>
              <li>9. International flights for the 5 friends to/from China.</li>
              <li>10. Additional costs caused by delays, cancellations, weather, mechanical issues or other force majeure events.</li>
              <li>11. Any item not explicitly listed under &quot;Price Included&quot;.</li>
            </ol>
          </div>
        </motion.div>

        <div className="pb-4 text-center text-xs text-stone-400">
          <p>China · 15-day itinerary for Aruna · 26 Aug – 9 Sep 2026</p>
        </div>
      </div>
    </div>
  );
}
