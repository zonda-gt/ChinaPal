"use client";
/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */

/* ChinaPal Itinerary — /itinerary
   Design: Warm editorial travel — cream bg, charcoal text, red ChinaPal accent
   Layout: Mobile-first single column, desktop 2-column with sticky sidebar
   Fonts: Fraunces (display headings) + Plus Jakarta Sans (body)
*/
import React, { useState } from "react";
import { MapPin, Clock, Utensils, Camera, Sunset, Moon, Sun, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MessageCircle, Star, Info, Plane, Hotel, Navigation, Check, Sparkles, Pencil, Heart, Car, TramFront, TrainFront, Bus, Footprints } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createContext, useContext } from "react";
import type { ImageMap } from "@/lib/itinerary-images";

/* Images passed from server component. Manage at /itinerary/manage */

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i";

const DEFAULT_IMAGES: ImageMap = {
  forest: `${CDN}/zjj-forest-park-Fk6sgYY4AzscGgsTAdGZLa.webp`,
  tianzi: `${CDN}/zjj-tianzi-mountain-XX5qUieAEsabKUeYk3JHxK.webp`,
  golden: `${CDN}/zjj-golden-whip-8i6gvipo7fjNjnMVU35ZsX.webp`,
  show: `${CDN}/zjj-charming-show-ekx4haBqHues8Ks8VN98UT.webp`,
  concierge: `${CDN}/concierge-mei-LSnYLpSvvTzhJGNGFgY3Du.webp`,
  bailong: `${CDN}/zjj-bailong-elevator-9wBE8Ew5MeTzffXtu96bUz.webp`,
  avatar: `${CDN}/zjj-avatar-pillars-JfnwwF7VRiJvmNKdnJuoV2.webp`,
  tianzi_clouds: `${CDN}/zjj-tianzi-clouds-9hojziDU5h4PbieGP8mtEX.webp`,
  tianzi_preview3: `${CDN}/zjj-avatar-pillars-JfnwwF7VRiJvmNKdnJuoV2.webp`,
  show_preview3: `${CDN}/zjj-tujia-weaving-mr8ec3URk5JHRPu8h7Wg67.webp`,
  tujia: `${CDN}/zjj-tujia-weaving-mr8ec3URk5JHRPu8h7Wg67.webp`,
  stream_close: `${CDN}/zjj-stream-close-hBhQpt79q4p9cSqndUf8Ww.webp`,
  ten_mile: `${CDN}/zjj-ten-mile-night-hhDcwkiXTzUM77iNNhKJJz.webp`,
  show_stage: `${CDN}/zjj-show-stage-5vsSH7YEVUrQP8TKivY3B2.webp`,
  hunan_food: `${CDN}/zjj-hunan-food-5uvTJyHoH4ttNhNFdYfrT2.webp`,
  tianmen_cablecar: `${CDN}/zjj-forest-park-Fk6sgYY4AzscGgsTAdGZLa.webp`,
  tianmen_glass: `${CDN}/zjj-forest-park-Fk6sgYY4AzscGgsTAdGZLa.webp`,
  tianmen_cave: `${CDN}/zjj-forest-park-Fk6sgYY4AzscGgsTAdGZLa.webp`,
};

const ImgCtx = createContext<ImageMap>(DEFAULT_IMAGES);
function useImg() { return useContext(ImgCtx); }

// Aliases used by data arrays (resolved at render time via hook)
let FOREST_IMG = DEFAULT_IMAGES.forest;
let TIANZI_IMG = DEFAULT_IMAGES.tianzi;
let GOLDEN_IMG = DEFAULT_IMAGES.golden;
let SHOW_IMG = DEFAULT_IMAGES.show;
let CONCIERGE_IMG = DEFAULT_IMAGES.concierge;
let BAILONG_IMG = DEFAULT_IMAGES.bailong;
let AVATAR_IMG = DEFAULT_IMAGES.avatar;
let TIANZI_CLOUDS_IMG = DEFAULT_IMAGES.tianzi_clouds;
let TUJIA_IMG = DEFAULT_IMAGES.tujia;
let STREAM_CLOSE_IMG = DEFAULT_IMAGES.stream_close;
let TEN_MILE_IMG = DEFAULT_IMAGES.ten_mile;
let SHOW_STAGE_IMG = DEFAULT_IMAGES.show_stage;
let HUNAN_FOOD_IMG = DEFAULT_IMAGES.hunan_food;

function syncImgVars(img: ImageMap) {
  FOREST_IMG = img.forest;
  TIANZI_IMG = img.tianzi;
  GOLDEN_IMG = img.golden;
  SHOW_IMG = img.show;
  CONCIERGE_IMG = img.concierge;
  BAILONG_IMG = img.bailong;
  AVATAR_IMG = img.avatar;
  TIANZI_CLOUDS_IMG = img.tianzi_clouds;
  TUJIA_IMG = img.tujia;
  STREAM_CLOSE_IMG = img.stream_close;
  TEN_MILE_IMG = img.ten_mile;
  SHOW_STAGE_IMG = img.show_stage;
  HUNAN_FOOD_IMG = img.hunan_food;
}

const WA_LINK = "https://wa.me/447447781385?text=Hi!%20I'd%20like%20to%20plan%20a%20trip%20to%20China";

const RESTAURANT_IMAGES = {
  yinxiangLaozaotai: "/uploads/itinerary/restaurants/yinxiang-laozaotai.jpg",
  suoxiShanzhai: "/uploads/itinerary/restaurants/suoxi-shanzhai.jpg",
  yicunYard: "/uploads/itinerary/restaurants/yicun-yard.jpg",
  daduiYucun: "/uploads/itinerary/restaurants/dadui-yucun.jpg",
  xibuStreetSnacks: "/uploads/itinerary/restaurants/xibu-street-snacks.jpg",
  xianghuaBbq: "/uploads/itinerary/restaurants/xianghua-bbq.jpg",
  watersideBar: "/uploads/itinerary/restaurants/waterside-bar.jpg",
  xitangJiafan: "/uploads/itinerary/restaurants/xitang-jiafan.JPG",
} as const;

interface Restaurant {
  name: string;
  englishName?: string;
  cuisine: string;
  note: string;
  price: string;
  rating: number;
  image?: string;
}

type TransportMode = "taxi" | "walk" | "cable-car" | "shuttle" | "light-rail" | "car" | "train";

interface TransportLeg {
  mode: TransportMode;
  duration: string;
  note?: string;
}

interface TimelineItem {
  id: string;
  time: string;
  icon: React.ElementType;
  iconBg: string;
  type: "activity" | "meal" | "hotel" | "transport";
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  tip?: string;
  restaurants?: Restaurant[];
  previewImages?: string[];
  previewLine?: string;
  transportAfter?: TransportLeg;
}

interface MeiPick {
  id: string;
  emoji: string;
  type: string;
  title: string;
  desc: string;
  meiNote: string;
  image: string;
  tag: string;
  tagColor: string;
}

interface DayConfig {
  label: string;
  subtitle: string;
  color: string;
  items: TimelineItem[];
}

export interface ItineraryConfig {
  cityName: string;
  title: string;
  location: string;
  duration: string;
  heroImage: string;
  days: DayConfig[];
  picks: MeiPick[];
  departure: { time: string; title: string; description: string };
  departureNote: string;
  meiGreeting: string;
}

function buildDay1(img: ImageMap): TimelineItem[] { return [
  {
    id: "d1-forest",
    time: "Morning · 8:00",
    icon: Sun,
    iconBg: "#FFF3E0",
    type: "activity",
    title: "Zhangjiajie National Forest Park",
    subtitle: "Morning exploration",
    description: "Thousands of tall sandstone pillars in a huge forested valley — this is the park that inspired the mountains in Avatar. You'll take the Bailong Elevator up the cliff, walk the Yuanjiajie ridge to the main viewpoints (Avatar Hallelujah Mountain, First Natural Bridge, Enchanting Terrace), then shuttle bus back down.",
    image: FOREST_IMG,
    tip: "Our tip: Enter via the East Gate and head straight for the Bailong Elevator before the queues build. Peak season waits can hit 1-2 hours — we pre-book VIP fast-track passes to skip them.",
    previewImages: [FOREST_IMG, BAILONG_IMG, AVATAR_IMG],
    previewLine: "Towering sandstone pillars, the Bailong Elevator, and Avatar-inspiring views.",
    transportAfter: { mode: "taxi", duration: "10 min", note: "Taxi from park gate to restaurant" },
  },
  {
    id: "d1-lunch",
    time: "Midday · 12:30",
    icon: Utensils,
    iconBg: "#FFF1F3",
    type: "meal",
    title: "Lunch",
    subtitle: "Suggested restaurants",
    description: "After a morning in the mountains, you've earned a proper meal. Here are our top picks near the park:",
    restaurants: [
      { name: "印象老灶台", englishName: "Old Stove Kitchen", cuisine: "Rustic Xiangxi", note: "A proper old-stove style restaurant with clay-pot chicken, baskets of local produce, and the kind of smoky farmhouse atmosphere that feels great after a morning hike.", price: "¥60–90 pp", rating: 4.8, image: RESTAURANT_IMAGES.yinxiangLaozaotai },
      { name: "索溪山寨", englishName: "Suoxi Mountain Lodge", cuisine: "Xiangxi specialties", note: "A lively regional dining room with red lanterns and folk decor. Good if you want a broad intro to Xiangxi dishes without overthinking the order.", price: "¥70–110 pp", rating: 4.7, image: RESTAURANT_IMAGES.suoxiShanzhai },
    ],
    transportAfter: { mode: "cable-car", duration: "25 min", note: "Cable car up to Tianzi Mountain ridge" },
  },
  {
    id: "d1-tianzi",
    time: "Afternoon · 2:30",
    icon: Camera,
    iconBg: "#E8F5E9",
    type: "activity",
    title: "Tianzi Mountain",
    subtitle: "Afternoon — Sea of Clouds",
    description: "Take the cable car up to Tianzi Mountain (天子山), the highest peak in the Wulingyuan area. On clear days the views are infinite; on misty days you get the famous 'sea of clouds' effect where the stone pillars emerge from a white ocean of fog. Walk the ridge trails and take in the Emperor's Brush Peak viewpoint.",
    image: TIANZI_IMG,
    tip: "Our tip: Cable car queues can be brutal — aim to arrive by 2:30pm. If it's cloudy, the mist actually makes it better. We book the combo transport pass so you're not paying per ride.",
    previewImages: [TIANZI_IMG, TIANZI_CLOUDS_IMG, img.tianzi_preview3],
    previewLine: "The highest peak in Wulingyuan — cable car up, sea of clouds below.",
    transportAfter: { mode: "taxi", duration: "15 min", note: "Taxi down to Wulingyuan town for dinner" },
  },
  {
    id: "d1-dinner",
    time: "Evening · 6:00",
    icon: Utensils,
    iconBg: "#FFF1F3",
    type: "meal",
    title: "Dinner",
    subtitle: "Suggested restaurants",
    description: "Refuel before the evening show. These are all within easy reach of the Charming Xiangxi theatre:",
    restaurants: [
      { name: "一村院子餐厅", englishName: "Village Courtyard", cuisine: "Courtyard fine dining", note: "A beautiful timber courtyard with pond-side tables and a polished, slower-paced feel. The best spot for an atmospheric dinner before the show.", price: "¥120–180 pp", rating: 4.8, image: RESTAURANT_IMAGES.yicunYard },
      { name: "大队老渔村", englishName: "Old Fishing Village", cuisine: "Farmhouse Xiangxi", note: "A rustic, ingredient-led spot with jars of pickles, fresh chillies, and preserved meats on display. Great for hearty fish dishes and bolder local flavors.", price: "¥80–120 pp", rating: 4.7, image: RESTAURANT_IMAGES.daduiYucun },
    ],
    transportAfter: { mode: "walk", duration: "8 min", note: "Short walk to the Charming Xiangxi Theatre" },
  },
  {
    id: "d1-show",
    time: "Evening · 20:00",
    icon: Moon,
    iconBg: "#EDE7F6",
    type: "activity",
    title: "Charming Xiangxi Show",
    subtitle: "Evening cultural performance",
    description: "This is one of the most spectacular shows in China — 500+ performers, real waterfalls on stage, fire, acrobatics, and the stories of the Tujia and Miao ethnic minorities who have called these mountains home for centuries. It's genuinely moving and unlike anything you'll see elsewhere.",
    image: "/uploads/itinerary/xiangxi_show.jpg",
    tip: "Our tip: Tickets sell out and need to be booked in advance through Chinese-only platforms. The show is about 90 minutes — bring a light jacket for the open-air theatre. We handle the booking.",
    previewImages: ["/uploads/itinerary/xiangxi_show.jpg", SHOW_STAGE_IMG, img.show_preview3],
    previewLine: "500+ performers, real waterfalls on stage, fire, and Tujia & Miao culture.",
    transportAfter: { mode: "taxi", duration: "10 min", note: "Taxi back to your hotel" },
  },
  {
    id: "d1-hotel",
    time: "Night · 10:00",
    icon: Hotel,
    iconBg: "#E3F2FD",
    type: "hotel",
    title: "Back to Hotel",
    subtitle: "Rest up — big day tomorrow",
    description: "Head back to your hotel and get a good night's sleep. Day 2 starts with a cultural workshop and more incredible scenery.",
  },
]; }

function buildDay2(img: ImageMap): TimelineItem[] { const FOREST_IMG = img.forest; const BAILONG_IMG = img.bailong; const AVATAR_IMG = img.avatar; const TIANZI_IMG = img.tianzi; const TIANZI_CLOUDS_IMG = img.tianzi_clouds; const GOLDEN_IMG = img.golden; const SHOW_IMG = img.show; const SHOW_STAGE_IMG = img.show_stage; const CONCIERGE_IMG = img.concierge; const TUJIA_IMG = img.tujia; const STREAM_CLOSE_IMG = img.stream_close; const TEN_MILE_IMG = img.ten_mile; const HUNAN_FOOD_IMG = img.hunan_food; return [
  {
    id: "d2-workshop",
    time: "Morning · 9:00",
    icon: Sun,
    iconBg: "#FFF3E0",
    type: "activity",
    title: "Guaiyaomei Tujia Brocade Workshop",
    subtitle: "Morning — Cultural immersion",
    description: "Start Day 2 with something genuinely unique — a visit to a traditional Tujia brocade weaving workshop. The Tujia people have been weaving their intricate 'xilankapu' cloth for over 2,000 years, and here you can watch master weavers at work and try the loom yourself. The patterns tell stories of mountains, rivers, and daily life.",
    image: "/uploads/itinerary/tujia_silk1.jpeg",
    tip: "Our tip: This is a quieter, more personal experience — perfect for the morning before the busier afternoon. You can buy authentic brocade pieces directly from the weavers.",
    previewImages: ["/uploads/itinerary/tujia_silk1.jpeg", "/uploads/itinerary/tujia_silk2.jpg", "/uploads/itinerary/tujia_silk3.jpeg"],
    previewLine: "Watch master weavers at work and try the loom yourself — 2,000 years of craft.",
    transportAfter: { mode: "walk", duration: "12 min", note: "Short walk into Wulingyuan town for lunch" },
  },
  {
    id: "d2-lunch",
    time: "Midday · 12:00",
    icon: Utensils,
    iconBg: "#FFF1F3",
    type: "meal",
    title: "Lunch",
    subtitle: "Suggested restaurants",
    description: "A relaxed midday meal before your afternoon walk along Golden Whip Stream:",
    restaurants: [
      { name: "喜棠家饭", englishName: "Xitang Home Kitchen", cuisine: "Comfort food", note: "A warm, family-style place with straightforward local dishes — nothing fancy, just good honest food. A solid easy lunch before heading back out walking.", price: "¥55–85 pp", rating: 4.6, image: RESTAURANT_IMAGES.xitangJiafan },
      { name: "印象老灶台", englishName: "Old Stove Kitchen", cuisine: "Rustic Xiangxi", note: "If you want something more characterful at lunch, this is the atmospheric pick: clay pots, local ingredients, and a proper old-kitchen feel.", price: "¥60–90 pp", rating: 4.8, image: RESTAURANT_IMAGES.yinxiangLaozaotai },
    ],
    transportAfter: { mode: "walk", duration: "5 min", note: "Walk to the Golden Whip Stream entrance" },
  },
  {
    id: "d2-stream",
    time: "Afternoon · 2:00",
    icon: Navigation,
    iconBg: "#E8F5E9",
    type: "activity",
    title: "Golden Whip Stream",
    subtitle: "Afternoon — Scenic valley walk",
    description: "The Golden Whip Stream (金鞭溪) is a 7.5km walk through a narrow valley between towering cliffs, following a crystal-clear turquoise stream. It's one of the most peaceful and beautiful walks in all of China — monkeys sometimes come down to the path, and the light filtering through the forest canopy is extraordinary.",
    image: GOLDEN_IMG,
    tip: "Our tip: The full walk takes about 2.5 hours. Keep snacks in a zipped bag — the monkeys here are aggressive food thieves. We'll make sure you know which exit to take for your pickup.",
    previewImages: [GOLDEN_IMG, STREAM_CLOSE_IMG, AVATAR_IMG],
    previewLine: "A 7.5km valley walk through turquoise water and towering cliffs — monkeys included.",
    transportAfter: { mode: "taxi", duration: "20 min", note: "Taxi to Zhangjiajie city centre for dinner" },
  },
  {
    id: "d2-dinner",
    time: "Evening · 6:30",
    icon: Utensils,
    iconBg: "#FFF1F3",
    type: "meal",
    title: "Dinner",
    subtitle: "Relaxed evening in Wulingyuan",
    description: "Wind down the day with a relaxed evening meal in Wulingyuan:",
    restaurants: [
      { name: "溪布街小吃", englishName: "XiBu Street Snacks", cuisine: "Street food", note: "Perfect if you want a lively XiBu Street evening: cold noodles, mugwort cakes, and easy snack-hopping around the lit-up riverside area.", price: "¥25–50 pp", rating: 4.7, image: RESTAURANT_IMAGES.xibuStreetSnacks },
      { name: "香花烧烤", englishName: "Xianghua BBQ", cuisine: "BBQ", note: "A fun, casual grill with skewers over charcoal and punchy, garlicky plates for sharing. Best if you want a louder, more social dinner.", price: "¥50–80 pp", rating: 4.6, image: RESTAURANT_IMAGES.xianghuaBbq },
    ],
    transportAfter: { mode: "taxi", duration: "20 min", note: "Taxi to Zhangjiajie Songcheng Tourist Area" },
  },
  {
    id: "d2-show",
    time: "Evening · 8:30",
    icon: Moon,
    iconBg: "#EDE7F6",
    type: "activity",
    title: "Zhangjiajie Eternal Love Show",
    subtitle: "Evening — 千古情 spectacular",
    image: "/uploads/itinerary/eternal_love1.jpg",
    description: "A huge indoor show by Songcheng — the same company behind China's most popular live performances. About an hour of Tujia and Miao legends, aerial acrobatics, fire, water effects, and a rotating stage. It covers the mythology of how Zhangjiajie's pillars were formed and the love stories of the local ethnic minorities.",
    tip: "Our tip: Tickets are around ¥260–300 and need to be booked on Chinese platforms. The Songcheng complex around the theatre has food and smaller free performances too — worth arriving early.",
    previewImages: ["/uploads/itinerary/eternal_love1.jpg", "/uploads/itinerary/eternal_love2.jpg", "/uploads/itinerary/eternal_love3.jpg"],
    previewLine: "Aerial acrobatics, fire, water effects, and Tujia legends — a massive indoor spectacular.",
    transportAfter: { mode: "taxi", duration: "15 min", note: "Taxi back to your hotel" },
  },
  {
    id: "d2-hotel",
    time: "Night · 10:00",
    icon: Hotel,
    iconBg: "#E3F2FD",
    type: "hotel",
    title: "Back to Hotel",
    subtitle: "Rest up — Tianmen Mountain tomorrow",
    description: "Get a good rest. Tomorrow is the adrenaline day — Tianmen Mountain, glass skywalks, and the 999 steps to Heaven's Gate.",
  },
]; }

function buildDay3(img: ImageMap): TimelineItem[] { return [
  {
    id: "d3-cablecar",
    time: "Morning · 8:00",
    icon: Sun,
    iconBg: "#FFF3E0",
    type: "activity",
    title: "Tianmen Mountain Cable Car",
    subtitle: "The world's longest cable car",
    description: "Start your final day with the most dramatic cable car ride in China — 7.5 kilometres from downtown Zhangjiajie straight up into the clouds. The 28-minute ride passes over the city, through forest, and into the mountain mist. At 1,519 metres, Tianmen Mountain is a completely different experience from the forest park.",
    image: "/uploads/itinerary/tianmen_cable1.jpg",
    tip: "Our tip: Book the earliest time slot (8:00 AM) to avoid queues and get the clearest weather. Sit on the right side going up for the best mountain views. Bring a warm jacket — the summit is 10-15°C colder than the city.",
    previewImages: ["/uploads/itinerary/tianmen_cable1.jpg", "/uploads/itinerary/tianmen_cable2.jpg", "/uploads/itinerary/tianmen_cable3.jpg"],
    previewLine: "A 28-minute ride from city streets into the clouds — 7.5km of jaw-dropping scenery.",
    transportAfter: { mode: "walk", duration: "5 min", note: "Walk to the east summit trail" },
  },
  {
    id: "d3-glass",
    time: "Morning · 9:00",
    icon: Camera,
    iconBg: "#E8F5E9",
    type: "activity",
    title: "Glass Skywalks & Summit Trails",
    subtitle: "East and west cliff walks",
    description: "Walk the glass-bottomed skywalks bolted onto sheer cliff faces at 1,400 metres — transparent glass beneath your feet with 300 metres of empty air below. The east side Coiling Dragon Cliff section is the most dramatic. Then explore the summit forest trails and the Tianmen Mountain Temple for panoramic views.",
    image: img.tianmen_glass,
    tip: "Our tip: The east side glass walk is longer and more dramatic than the west. You need shoe covers (¥5, bought on-site). Even people without fear of heights find their knees going weak — it's genuinely thrilling.",
    previewImages: [img.tianmen_glass, img.tianmen_cablecar, img.tianmen_cave],
    previewLine: "Transparent glass floor, 300m drop, sheer cliff face — genuinely heart-pounding.",
    transportAfter: { mode: "walk", duration: "10 min", note: "Walk to the escalator entrance" },
  },
  {
    id: "d3-lunch",
    time: "Midday · 12:00",
    icon: Utensils,
    iconBg: "#FFF1F3",
    type: "meal",
    title: "Lunch",
    subtitle: "Quick bite before the 999 steps",
    description: "Refuel before the big descent. Pack a lunch from the hotel or grab something quick — summit restaurants are overpriced.",
    restaurants: [
      { name: "Tianmen Summit Café", cuisine: "Quick bites", note: "Basic but convenient — instant noodles, snacks, and hot drinks. Overpriced but you're on top of a mountain.", price: "¥30–50 pp", rating: 3.8 },
      { name: "Pack your own lunch", cuisine: "Packed meal", note: "The smart move — grab breakfast extras from your hotel and bring them up. Water, fruit, sandwiches.", price: "Free", rating: 5.0 },
    ],
    transportAfter: { mode: "walk", duration: "5 min", note: "Walk to escalator for Tianmen Cave" },
  },
  {
    id: "d3-cave",
    time: "Afternoon · 1:00",
    icon: Navigation,
    iconBg: "#E8F5E9",
    type: "activity",
    title: "Tianmen Cave & 999 Steps",
    subtitle: "Heaven's Gate — the iconic climb",
    description: "Descend via escalators inside the mountain to reach Tianmen Cave (天门洞) — a massive natural hole through the cliff face, 131 metres high and 57 metres wide, first recorded over 1,700 years ago. Then climb down the famous 999 steps — a steep, dramatic staircase that descends from the cave to the road below. The number 999 represents the 'nine heavens' in Chinese numerology.",
    image: img.tianmen_cave,
    tip: "Our tip: Take it slow on the steep upper sections and use the railings — the steps are uneven. The cave itself is most dramatic when clouds drift through it, which happens most mornings.",
    previewImages: [img.tianmen_cave, img.tianmen_glass, img.tianmen_cablecar],
    previewLine: "131m-high natural cave, 999 steps, and the feeling of descending from heaven.",
    transportAfter: { mode: "shuttle", duration: "25 min", note: "Coach down the 99-bend road" },
  },
  {
    id: "d3-road",
    time: "Afternoon · 3:00",
    icon: Car,
    iconBg: "#FFF3E0",
    type: "activity",
    title: "99-Bend Road Descent",
    subtitle: "White-knuckle mountain road",
    image: "/uploads/itinerary/99bend1.webp",
    description: "The coach ride down Tongtian Avenue — nearly 11 kilometres of mountain road with 99 hairpin turns switchbacking from 1,300m to 200m. The bus drivers navigate blind 180-degree turns with centimetres of clearance. It's equal parts terrifying and impressive, and the aerial views from above are spectacular.",
    tip: "Our tip: Sit on the left side for the best cliff-drop views. The ride takes about 25 minutes. If you get motion sick easily, take medication beforehand.",
    previewImages: ["/uploads/itinerary/99bend1.webp", "/uploads/itinerary/99bend2.jpeg", "/uploads/itinerary/99bend3.webp"],
    previewLine: "99 hairpin turns, 1,300m descent — the most dramatic bus ride of your life.",
  },
  {
    id: "d3-dinner",
    time: "Evening · 6:00",
    icon: Utensils,
    iconBg: "#FFF1F3",
    type: "meal",
    title: "Final Dinner",
    subtitle: "Farewell meal in the city",
    description: "Your last evening in Zhangjiajie — celebrate three incredible days with a proper meal in the city centre:",
    restaurants: [
      { name: "一村院子餐厅", englishName: "Village Courtyard", cuisine: "Courtyard fine dining", note: "A strong final-night pick if you want somewhere beautiful and calm. The landscaped courtyard and polished setting make it feel like a proper farewell dinner.", price: "¥120–180 pp", rating: 4.8, image: RESTAURANT_IMAGES.yicunYard },
      { name: "水上酒吧", englishName: "Waterside Bar", cuisine: "Cocktails & light bites", note: "Best for a looser last evening: waterside seating, glowing night views, and a cocktail-bar atmosphere around XiBu Street rather than a formal sit-down meal.", price: "¥60–120 pp", rating: 4.5, image: RESTAURANT_IMAGES.watersideBar },
    ],
    transportAfter: { mode: "taxi", duration: "10 min", note: "Taxi back to your city hotel" },
  },
  {
    id: "d3-hotel",
    time: "Night · 9:00",
    icon: Hotel,
    iconBg: "#E3F2FD",
    type: "hotel",
    title: "City Hotel",
    subtitle: "Final night — airport tomorrow",
    description: "Rest up at your city centre hotel. Your airport transfer is arranged for the morning — Zhangjiajie Hehua Airport is about 40 minutes from the city.",
  },
]; }

const departure = {
  time: "Morning",
  title: "Airport Transfer",
  description: "We arrange a private driver to take you from your hotel to Zhangjiajie Hehua International Airport — about 40 minutes. No haggling with taxis, no language barrier.",
};

// Transport connector between timeline stops
const TRANSPORT_COLOR = "#8A8A8A";
const TRANSPORT_BG = "#F2F0ED";

const TRANSPORT_CONFIG: Record<TransportMode, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  taxi:        { icon: Car,       label: "Taxi",       color: TRANSPORT_COLOR, bg: TRANSPORT_BG },
  walk:        { icon: Footprints,label: "Walk",       color: TRANSPORT_COLOR, bg: TRANSPORT_BG },
  "cable-car": { icon: TramFront, label: "Cable Car",  color: TRANSPORT_COLOR, bg: TRANSPORT_BG },
  shuttle:     { icon: Bus,       label: "Shuttle",    color: TRANSPORT_COLOR, bg: TRANSPORT_BG },
  "light-rail":{ icon: TramFront, label: "Light Rail", color: TRANSPORT_COLOR, bg: TRANSPORT_BG },
  car:         { icon: Car,       label: "Car",        color: TRANSPORT_COLOR, bg: TRANSPORT_BG },
  train:       { icon: TrainFront,label: "Train",      color: TRANSPORT_COLOR, bg: TRANSPORT_BG },
};

function TransportConnector({ leg }: { leg: TransportLeg }) {
  const cfg = TRANSPORT_CONFIG[leg.mode];
  const Icon = cfg.icon;
  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 0 }}>
      {/* Spine alignment */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32, flexShrink: 0 }}>
        <div style={{ width: 2, height: 8, background: "#E8E4DE" }} />
        <div style={{
          width: 22, height: 22, borderRadius: "50%",
          background: cfg.bg, border: `1.5px dashed ${cfg.color}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Icon size={11} color={cfg.color} />
        </div>
        <div style={{ width: 2, height: 8, background: "#E8E4DE" }} />
      </div>
      {/* Label */}
      <div style={{ flex: 1, paddingLeft: 8, display: "flex", alignItems: "center", gap: 8, paddingTop: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: cfg.bg, borderRadius: 20, padding: "5px 12px", border: `1px solid ${cfg.color}22` }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
          <span style={{ width: 3, height: 3, background: cfg.color, borderRadius: "50%", opacity: 0.5 }} />
          <span style={{ fontSize: 11.5, fontWeight: 800, color: cfg.color }}>{leg.duration}</span>
        </div>
        {leg.note && (
          <span style={{ fontSize: 11, color: "#AAA", fontStyle: "italic", flex: 1 }}>{leg.note}</span>
        )}
      </div>
    </div>
  );
}

// Interactive restaurant card with selection state
function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 10,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        border: "1px solid #F0EDE8",
        display: "flex",
      }}
    >
      {r.image && (
        <div style={{ width: 100, minHeight: 100, flexShrink: 0, overflow: "hidden", background: "#F7F5F2" }}>
          <img src={r.image} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      <div style={{ padding: "10px 12px", flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, color: "#1A1A1A", margin: 0, fontFamily: "'Fraunces', serif" }}>{r.englishName || r.name}</p>
            {r.englishName && <p style={{ fontSize: 10, color: "#999", margin: "1px 0 0" }}>{r.name}</p>}
          </div>
          <span style={{ fontSize: 10, color: "#888", fontWeight: 600, flexShrink: 0 }}>{r.price}</span>
        </div>
        <span style={{ display: "inline-block", fontSize: 8, fontWeight: 700, color: "#D0021B", background: "#FFF1F3", padding: "1px 6px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{r.cuisine}</span>
        <p style={{ fontSize: 11.5, color: "#555", margin: "4px 0 0", lineHeight: 1.45 }}>{r.note}</p>
      </div>
    </div>
  );
}

function TimelineCardWithTransport({ item, index }: { item: TimelineItem; index: number }) {
  return (
    <>
      <TimelineCard item={item} index={index} />
      {item.transportAfter && <TransportConnector leg={item.transportAfter} />}
    </>
  );
}

function TimelineCard({ item, index }: { item: TimelineItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const Icon = item.icon;
  const images = item.image ? [item.image, ...(item.previewImages || [])].filter((v, i, a) => a.indexOf(v) === i) : [];

  const typeColors: Record<string, string> = {
    activity: "#8A8A8A",
    meal: "#8A8A8A",
    hotel: "#8A8A8A",
    transport: "#8A8A8A",
  };

  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 0 }}>
      {/* Timeline spine */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32, flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: item.iconBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `2px solid ${typeColors[item.type]}22`,
          flexShrink: 0, zIndex: 1,
        }}>
          <Icon size={14} color={typeColors[item.type]} />
        </div>
        <div style={{ width: 2, flex: 1, background: "#E8E4DE", minHeight: 20 }} />
      </div>

      {/* Card */}
      <div style={{ flex: 1, paddingBottom: 20, paddingLeft: 8 }}>
        <p style={{ fontSize: 11, color: "#999", fontWeight: 700, margin: "0 0 4px", letterSpacing: "0.06em", textTransform: "uppercase", paddingTop: 10 }}>{item.time}</p>

        <div
          style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: "1px solid #F0EDE8", cursor: item.type !== "hotel" ? "pointer" : "default" }}
          onClick={() => item.type !== "hotel" && setExpanded(!expanded)}
        >
          {/* Hero image carousel — only shown when expanded */}
          {images.length > 0 && expanded && (
            <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
              <img src={images[imgIdx]} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.2s" }} />
              {images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setImgIdx((imgIdx - 1 + images.length) % images.length); }} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.45)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <ChevronLeft size={16} color="#fff" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setImgIdx((imgIdx + 1) % images.length); }} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.45)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <ChevronRight size={16} color="#fff" />
                  </button>
                  <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
                    {images.map((_, i) => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i === imgIdx ? "#fff" : "rgba(255,255,255,0.45)", transition: "background 0.2s" }} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: typeColors[item.type], fontWeight: 700, margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{item.subtitle}</p>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", margin: 0, fontFamily: "'Fraunces', serif", lineHeight: 1.2 }}>{item.title}</h3>
              </div>
              {item.type !== "hotel" && (
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "#F5F2EE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 8 }}>
                  {expanded ? <ChevronUp size={14} color="#888" /> : <ChevronDown size={14} color="#888" />}
                </div>
              )}
            </div>

            {/* COLLAPSED PREVIEW — activity: 3 images + one-liner */}
            {!expanded && item.type === "activity" && item.previewImages && (
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, marginBottom: 8 }}>
                  {item.previewImages.slice(0, 2).map((src, i) => (
                    <div key={i} style={{ aspectRatio: "4/3", borderRadius: 10, overflow: "hidden" }}>
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                  <div style={{ aspectRatio: "4/3", borderRadius: 10, overflow: "hidden", position: "relative", cursor: "pointer" }}>
                    <img src={item.previewImages[2]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.4)" }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>+</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "0.05em" }}>See more</span>
                    </div>
                  </div>
                </div>
                {item.previewLine && (
                  <p style={{ fontSize: 12.5, color: "#666", margin: 0, lineHeight: 1.5 }}>{item.previewLine}</p>
                )}
              </div>
            )}

            {/* COLLAPSED PREVIEW — meal: inline restaurant names */}
            {!expanded && item.type === "meal" && item.restaurants && (
              <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
                {item.restaurants.map((r, i) => (
                  <React.Fragment key={r.name}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#555" }}>{r.englishName || r.name}</span>
                    {i < item.restaurants!.length - 1 && <span style={{ fontSize: 10, color: "#CCC" }}>·</span>}
                  </React.Fragment>
                ))}
                <span style={{ fontSize: 10, color: "#AAA", marginLeft: 2 }}>{item.restaurants[0].price}</span>
              </div>
            )}

            {expanded && (
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: 13.5, color: "#444", lineHeight: 1.6, margin: "0 0 12px" }}>{item.description}</p>

                {item.restaurants && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: "#1A1A1A", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Recommended restaurants
                    </p>
                    <p style={{ fontSize: 12, color: "#888", margin: "0 0 10px", lineHeight: 1.4 }}>
                      These are hard to book without a Chinese phone number — we reserve them for you.
                    </p>
                    {item.restaurants.map((r) => (
                      <RestaurantCard key={r.name} r={r} />
                    ))}
                  </div>
                )}

                {item.tip && (
                  <div style={{ background: "#FFF8F0", borderRadius: 12, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start", marginTop: 12 }}>
                    <img src={CONCIERGE_IMG} alt="Mei" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                    <p style={{ fontSize: 12.5, color: "#555", margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>{item.tip}</p>
                  </div>
                )}

                {/* Want to change this activity? */}
                {item.type === "activity" && (
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      marginTop: 12, padding: "9px 14px",
                      background: "#F5F2EE", borderRadius: 10,
                      textDecoration: "none", color: "#555",
                      fontSize: 12.5, fontWeight: 600,
                    }}
                  >
                    <MessageCircle size={13} color="#888" />
                    Any questions? Message us
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mei's tailored recommendations
function buildMeiPicks(img: ImageMap) { const FOREST_IMG = img.forest; const TIANZI_CLOUDS_IMG = img.tianzi_clouds; const TUJIA_IMG = img.tujia; const GOLDEN_IMG = img.golden; const HUNAN_FOOD_IMG = img.hunan_food; const CONCIERGE_IMG = img.concierge; return [
  {
    id: "pick-1",
    emoji: "🚁",
    type: "Premium Experience",
    title: "Avatar Helicopter Tour",
    desc: "Fly over the sandstone pillars at eye level — a god's-eye view of the Avatar mountains, Tianmen Cave, and the 99-bend road. Nothing else in Zhangjiajie comes close.",
    meiNote: "This needs to be booked through a local operator. Tell me your dates and I'll arrange it — it sells out fast.",
    image: "/uploads/itinerary/helicopter.jpg",
    tag: "Premium",
    tagColor: "#D0021B",
  },
  {
    id: "pick-2",
    emoji: "🌉",
    type: "Thrill",
    title: "Grand Canyon Adventure Combo",
    desc: "Glass bridge + 260m bungee jump + rock climbing + cave exploration — a full day of adrenaline in the Grand Canyon scenic area.",
    meiNote: "About 1 hour from the park. We book the combo ticket and arrange transport — much cheaper as a package.",
    image: "/uploads/itinerary/grand_canyon.jpg",
    tag: "Thrill seekers",
    tagColor: "#B45309",
  },
  {
    id: "pick-3",
    emoji: "🌅",
    type: "Sunrise Spot",
    title: "Huangshi Village Sunrise",
    desc: "Hike up to Huangshi Village before dawn and watch the sun rise over the pillars. One of the most breathtaking moments you can have in China.",
    meiNote: "We can arrange an early morning guide for this — just say the word.",
    image: TIANZI_CLOUDS_IMG,
    tag: "Early risers",
    tagColor: "#059669",
  },
  {
    id: "pick-4",
    emoji: "🏊",
    type: "Nature",
    title: "Baofeng Lake Boat Ride",
    desc: "A serene boat ride on an emerald lake surrounded by karst peaks. Waterfall cascades directly into the lake — genuinely magical.",
    meiNote: "Great add-on if you have a spare hour. We book the boat tickets in advance.",
    image: "/uploads/itinerary/baofeng_lake.jpg",
    tag: "Nature",
    tagColor: "#059669",
  },
  {
    id: "pick-5",
    emoji: "♨️",
    type: "Relaxation",
    title: "Forest Hot Springs",
    desc: "Soak in natural hot springs surrounded by forest after 3 days of hiking. Multiple outdoor pools at different temperatures, with mountain views.",
    meiNote: "The Hetian Resort springs are the best — we can book a session and arrange pickup from your hotel.",
    image: "/uploads/itinerary/hotspring.webp",
    tag: "After the hike",
    tagColor: "#D97706",
  },
  {
    id: "pick-6",
    emoji: "🐉",
    type: "Rainy Day",
    title: "Yellow Dragon Cave (黄龙洞)",
    desc: "A 300-million-year-old underground kingdom — boat ride through a subterranean river, a stalagmite insured for ¥100 million, and four levels of karst formations.",
    meiNote: "The perfect backup if it rains. Completely weatherproof and genuinely stunning. Near Wulingyuan — easy to swap in.",
    image: GOLDEN_IMG,
    tag: "Rainy day",
    tagColor: "#2563EB",
  },
  {
    id: "pick-7",
    emoji: "🎋",
    type: "Local Experience",
    title: "Suoxiyu Village Walk",
    desc: "A quiet village walk through traditional Tujia stilted houses. Locals still live here — a genuine glimpse into mountain life that most tourists miss completely.",
    meiNote: "It's a 20-minute walk from the park entrance. No ticket needed — just wander in.",
    image: HUNAN_FOOD_IMG,
    tag: "Locals only",
    tagColor: "#7C3AED",
  },
]; }

function MeiRecommendations({ picks }: { picks?: MeiPick[] }) {
  const img = useImg();
  const MEI_PICKS = picks ?? buildMeiPicks(img);
  const CONCIERGE_IMG = img.concierge;
  

  

  return (
    <div style={{ margin: "20px 0 0" }}>
      {/* Section header */}
      <div style={{ padding: "0 16px 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <img src={CONCIERGE_IMG} alt="Mei" style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>You could also do</p>
              <span style={{ fontSize: 10, background: "#FFF1F3", color: "#D0021B", fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>Local picks</span>
            </div>
            <p style={{ fontSize: 12, color: "#888", margin: 0, lineHeight: 1.4 }}>Other spots near Zhangjiajie we can add to your trip — just let us know.</p>
          </div>
        </div>
      </div>

      {/* Horizontal scroll cards */}
      <div style={{ display: "flex", gap: 12, padding: "0 16px 4px", overflowX: "auto", scrollbarWidth: "none" }}>
        {MEI_PICKS.map((pick) => {
          return (
            <div
              key={pick.id}
              style={{
                flexShrink: 0, width: 220,
                background: "#fff", borderRadius: 18,
                overflow: "hidden",
                boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                border: "1px solid #F0EDE8",
                transition: "all 0.2s",
              }}
            >
              {/* Image */}
              <div style={{ height: 240, position: "relative", overflow: "hidden" }}>
                <img src={pick.image} alt={pick.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%)" }} />
                
                {/* Tag label on image */}
                <p style={{ position: "absolute", bottom: 8, left: 10, fontSize: 10, color: "rgba(255,255,255,0.9)", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{pick.tag}</p>
                
                
              </div>

              {/* Content */}
              <div style={{ padding: "12px 14px 14px" }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#1A1A1A", margin: "0 0 5px", fontFamily: "'Fraunces', serif", lineHeight: 1.2 }}>{pick.title}</p>
                <p style={{ fontSize: 12, color: "#666", margin: "0 0 10px", lineHeight: 1.5 }}>{pick.desc}</p>
                {/* Mei's note */}
                <div style={{ background: "#FFF8F0", borderRadius: 10, padding: "8px 10px", display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <img src={CONCIERGE_IMG} alt="Mei" style={{ width: 18, height: 18, borderRadius: "50%", objectFit: "cover", flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 11, color: "#7A5C3A", margin: 0, lineHeight: 1.45, fontStyle: "italic" }}>{pick.meiNote}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      
    </div>
  );
}

// Personalisation section shown between greeting and trip pills
function PersonalisationBanner() {
  return (
    <div style={{ margin: "16px 16px 0", borderRadius: 20, overflow: "hidden", border: "1px solid #E8E4DE" }}>
      {/* 3 personalisation options */}
      <div style={{ background: "#fff", display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
        {[
          { icon: Check, label: "We book everything", desc: "Tickets, restaurants, transport — all need Chinese platforms" },
          { icon: MapPin, label: "Local knowledge", desc: "Skip the tourist traps, find the real spots" },
          { icon: MessageCircle, label: "On-the-ground help", desc: "Message us anytime during your trip" },
        ].map((item, i) => (
          <div
            key={item.label}
            style={{
              padding: "14px 12px",
              borderRight: i < 2 ? "1px solid #F0EDE8" : "none",
              textAlign: "center",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <item.icon size={18} color="#D0021B" />
              </div>
            </div>
            <p style={{ fontSize: 11, fontWeight: 800, color: "#1A1A1A", margin: "0 0 3px", lineHeight: 1.3 }}>{item.label}</p>
            <p style={{ fontSize: 10.5, color: "#888", margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
          </div>
        ))}
      </div>
      {/* CTA */}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          background: "#F7F5F2", padding: "13px 0",
          textDecoration: "none", color: "#1A1A1A",
          fontSize: 13, fontWeight: 700,
          borderTop: "1px solid #F0EDE8",
        }}
      >
        <MessageCircle size={15} color="#D0021B" />
        Ask us anything
      </a>
    </div>
  );
}


export default function ItineraryPage({ images, leadName, config }: { images?: ImageMap; leadName?: string; config?: ItineraryConfig }) {
  const searchParams = useSearchParams();
  const visitorName = leadName || searchParams.get("name");
  const img = images ?? DEFAULT_IMAGES;
  syncImgVars(img);

  // Use provided config or build default Zhangjiajie config
  const cfg: ItineraryConfig = config ?? {
    cityName: "Zhangjiajie",
    title: "Zhangjiajie Adventure",
    location: "Hunan, China",
    duration: "3 Days",
    heroImage: FOREST_IMG,
    days: [
      { label: "Day 1", subtitle: "Forest Park · Tianzi Mountain · Charming Xiangxi Show", color: "#D0021B", items: buildDay1(img) },
      { label: "Day 2", subtitle: "Tujia Workshop · Golden Whip Stream · Eternal Love Show", color: "#1A1A1A", items: buildDay2(img) },
      { label: "Day 3", subtitle: "Tianmen Mountain · Glass Skywalks · 999 Steps · 99-Bend Road", color: "#B45309", items: buildDay3(img) },
    ],
    picks: buildMeiPicks(img),
    departure: {
      time: "Morning",
      title: "Airport Transfer",
      description: "We arrange a private driver to take you from your hotel to Zhangjiajie Hehua International Airport — about 40 minutes. No haggling with taxis, no language barrier.",
    },
    departureNote: "This is just a sample — we'd tailor everything around your dates and what you want to do. Message us to get started.",
    meiGreeting: `This is what a ${visitorName ? visitorName + "'s " : ""}Zhangjiajie trip could look like. We handle tickets, restaurants, transport, and on-the-ground help — so you can just enjoy the trip.`,
  };

  const allMeals = cfg.days.flatMap(d => d.items).filter(i => i.type === "meal");

  const [activeDay, setActiveDay] = useState(1);

  return (
    <ImgCtx.Provider value={img}>
    <div style={{ minHeight: "100vh", background: "#F7F5F2", fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: 100 }}>
      <Navbar />
      <style>{`
        @media (min-width: 900px) {
          .itinerary-layout {
            grid-template-columns: 320px minmax(0,1fr) !important;
            gap: 32px !important;
            align-items: start;
            padding-top: 32px !important;
            padding-bottom: 40px !important;
          }
          .itinerary-sidebar {
            display: block !important;
            position: sticky;
            top: 88px;
            max-height: calc(100vh - 112px);
            overflow-y: auto;
            scrollbar-width: none;
          }
          .itinerary-sidebar::-webkit-scrollbar { display: none; }
          .itinerary-mobile-only {
            display: none !important;
          }
        }
        @media (max-width: 899px) {
          .itinerary-layout {
            padding-top: 0 !important;
          }
          .itinerary-sidebar {
            display: none !important;
          }
          .itinerary-desktop-only {
            display: none !important;
          }
        }
      `}</style>

      {/* Hero header — taller on desktop */}
      <div style={{ position: "relative", height: "500px", overflow: "hidden" }}>
        <img src={cfg.heroImage} alt={cfg.cityName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.7) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(20px,4vw,48px) clamp(20px,6vw,80px)", paddingTop: 72 }}>
          <h1 style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 900, color: "#fff", margin: "0 0 10px", fontFamily: "'Fraunces', serif", lineHeight: 1.05 }}>
            {visitorName ? `${visitorName}'s ${cfg.title}` : cfg.title}
          </h1>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <MapPin size={14} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{cfg.location}</span>
            </div>
            <div style={{ width: 3, height: 3, background: "rgba(255,255,255,0.5)", borderRadius: "50%" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Clock size={14} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{cfg.duration}</span>
            </div>
            <div style={{ width: 3, height: 3, background: "rgba(255,255,255,0.5)", borderRadius: "50%" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{cfg.cityName}, China</span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "12px 0 0", lineHeight: 1.5 }}>
            {visitorName ? (
              <>Hey {visitorName} — here's a sample trip to give you an idea. Everything's customisable.</>
            ) : (
              <>A sample trip — yours to explore. Every detail is customisable.</>
            )}
          </p>
        </div>
      </div>

      {/* ── DESKTOP: two-column grid, MOBILE: single column ── */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 clamp(16px,4vw,48px)",
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr)",
        gap: 0,
      }} className="itinerary-layout">

        {/* ── LEFT SIDEBAR (desktop only) ── */}
        <aside className="itinerary-sidebar" style={{ display: "none" }}>
          {/* Mei card */}
          <div style={{ background: "#1A1A1A", borderRadius: 20, padding: "20px", position: "relative", overflow: "hidden", marginBottom: 16 }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, background: "rgba(232,39,26,0.15)", borderRadius: "50%", filter: "blur(30px)" }} />
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
              <img src={CONCIERGE_IMG} alt="Mei" style={{ width: 52, height: 52, borderRadius: 16, objectFit: "cover", border: "2px solid rgba(255,255,255,0.15)", flexShrink: 0 }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Mei</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>ChinaPal Concierge</span>
                  <div style={{ width: 7, height: 7, background: "#22C55E", borderRadius: "50%" }} />
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.6 }}>
                  Here's what a Zhangjiajie trip could look like. We handle tickets, restaurants, transport, and on-the-ground help — so you don't have to figure it all out yourself.
                </p>
              </div>
            </div>
            <a
              href={WA_LINK}
              target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", width: "100%", background: "#D0021B", borderRadius: 12, padding: "11px 0", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none", boxSizing: "border-box" }}
            >
              <MessageCircle size={15} /> Ask Us Anything
            </a>
          </div>

          {/* Trip stats */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #E8E4DE", marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#999", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Trip Overview</p>
            {[
              { icon: "🏔️", label: "4 Attractions" },
              { icon: "🍜", label: "9 Restaurant Options" },
              { icon: "🎭", label: "1 Cultural Show" },
              { icon: "🚡", label: "Cable Cars Included" },
            ].map(p => (
              <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #F5F3F0" }}>
                <span style={{ fontSize: 16 }}>{p.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{p.label}</span>
              </div>
            ))}
          </div>

          {/* Personalisation options */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8E4DE", overflow: "hidden", marginBottom: 16 }}>
            <div style={{ background: "#1A1A1A", padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                <Sparkles size={14} color="#D0021B" />
                <p style={{ fontSize: 12, fontWeight: 800, color: "#fff", margin: 0 }}>What we handle for you</p>
              </div>
              <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.5 }}>The hard parts of a China trip, sorted.</p>
            </div>
            {[
              { icon: Check, label: "Ticket booking", desc: "Requires Chinese phone number & payment apps" },
              { icon: MapPin, label: "Local knowledge", desc: "Skip tourist traps, find the real spots" },
              { icon: MessageCircle, label: "On-the-ground help", desc: "Message us anytime during your trip" },
            ].map((item, i) => (
              <div key={item.label} style={{ padding: "12px 16px", borderBottom: i < 2 ? "1px solid #F5F3F0" : "none", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <item.icon size={15} color="#D0021B" />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A", margin: "0 0 2px" }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: "#888", margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
            <a
              href={WA_LINK}
              target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "#F7F5F2", padding: "12px 0", textDecoration: "none", color: "#1A1A1A", fontSize: 12, fontWeight: 700, borderTop: "1px solid #F0EDE8" }}
            >
              <MessageCircle size={13} color="#D0021B" /> Ask us anything
            </a>
          </div>
        </aside>

        {/* ── MAIN CONTENT COLUMN ── */}
        <main>
          {/* Sticky day tabs */}
          <div style={{ position: "sticky", top: 64, zIndex: 10, background: "#F7F5F2", borderBottom: "1px solid #E8E4DE", display: "flex", gap: 20, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
            {cfg.days.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i + 1)}
                style={{
                  padding: "10px 2px", border: "none", background: "none",
                  color: activeDay === i + 1 ? "#C0392B" : "#888",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  borderBottom: activeDay === i + 1 ? "2px solid #C0392B" : "2px solid transparent",
                  marginBottom: -1, whiteSpace: "nowrap",
                }}
              >
                Day {i + 1}
              </button>
            ))}
          </div>

          {/* Day content */}
          <div style={{ paddingTop: 20 }}>
            {cfg.days.map((day, dayIdx) => {
              const dayNum = dayIdx + 1;
              if (activeDay !== dayNum) return null;
              const dayNames = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
              const isLastDay = dayIdx === cfg.days.length - 1;
              return (
                <React.Fragment key={dayIdx}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 36, height: 36, background: day.color, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: "#fff", fontFamily: "'Fraunces', serif" }}>{dayNum}</span>
                    </div>
                    <div>
                      <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1A1A1A", margin: 0, fontFamily: "'Fraunces', serif" }}>Day {dayNames[dayIdx] ?? dayNum}</h2>
                      <p style={{ fontSize: 12, color: "#888", margin: 0, fontWeight: 600 }}>{day.subtitle}</p>
                    </div>
                  </div>
                  {day.items.map((item, i) => (
                    <React.Fragment key={item.id}>
                      <TimelineCardWithTransport item={item} index={i} />
                      {/* Mei greeting after lunch on Day 1 */}
                      {dayIdx === 0 && i === 1 && (
                        <div style={{ margin: "8px 0 20px", marginLeft: 40, background: "#1A1A1A", borderRadius: 18, padding: "16px", position: "relative", overflow: "hidden" }}>
                          <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, background: "rgba(232,39,26,0.15)", borderRadius: "50%", filter: "blur(30px)" }} />
                          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <img src={CONCIERGE_IMG} alt="Mei" style={{ width: 36, height: 36, borderRadius: 12, objectFit: "cover", border: "2px solid rgba(255,255,255,0.15)", flexShrink: 0 }} />
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>Mei</span>
                                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 20, fontWeight: 600 }}>ChinaPal Concierge</span>
                                <div style={{ width: 5, height: 5, background: "#22C55E", borderRadius: "50%" }} />
                              </div>
                              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.55 }}>
                                {cfg.meiGreeting}
                              </p>
                            </div>
                          </div>
                          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                            style={{ marginTop: 12, display: "flex", width: "100%", background: "#D0021B", border: "none", borderRadius: 10, padding: "9px 0", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none", boxSizing: "border-box" }}>
                            <MessageCircle size={14} /> Ask Us Anything
                          </a>
                        </div>
                      )}
                    </React.Fragment>
                  ))}

                  {/* Departure card on last day */}
                  {isLastDay && (
                    <div style={{ display: "flex", gap: 0, marginBottom: 0 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32, flexShrink: 0 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #05996922", flexShrink: 0 }}>
                          <Plane size={14} color="#059669" />
                        </div>
                      </div>
                      <div style={{ flex: 1, paddingBottom: 32, paddingLeft: 8 }}>
                        <p style={{ fontSize: 11, color: "#999", fontWeight: 700, margin: "0 0 4px", letterSpacing: "0.06em", textTransform: "uppercase", paddingTop: 10 }}>{cfg.departure.time}</p>
                        <div style={{ background: "#fff", borderRadius: 18, padding: "14px 16px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: "1px solid #F0EDE8" }}>
                          <p style={{ fontSize: 11, color: "#059669", fontWeight: 700, margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Departure Day</p>
                          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", margin: "0 0 10px", fontFamily: "'Fraunces', serif" }}>{cfg.departure.title}</h3>
                          <p style={{ fontSize: 13.5, color: "#444", lineHeight: 1.6, margin: 0 }}>{cfg.departure.description}</p>
                          <div style={{ marginTop: 12, background: "#F0FDF4", borderRadius: 10, padding: "10px 12px", display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <Info size={14} color="#059669" style={{ flexShrink: 0, marginTop: 1 }} />
                            <p style={{ fontSize: 12, color: "#166534", margin: 0, lineHeight: 1.5 }}>{cfg.departureNote}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Continue to next day button */}
                  {!isLastDay && (
                    <button
                      onClick={() => { setActiveDay(dayNum + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8, padding: "12px 0", background: "none", border: "1px solid #E8E4DE", borderRadius: 12, color: "#D0021B", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Continue to Day {dayNum + 1} →
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </main>
      </div>{/* end itinerary-layout */}

      {/* Mei's Picks + Personalisation — bottom of page, all devices */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
        <MeiRecommendations picks={cfg.picks} />
        <PersonalisationBanner />
      </div>

      <Footer />
    </div>
    </ImgCtx.Provider>
  );
}
