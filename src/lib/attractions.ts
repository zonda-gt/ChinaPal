import fs from "fs";
import path from "path";

export interface Attraction {
  attraction_name_cn: string;
  attraction_name_en: string;
  address_cn: string;
  experience_type: string;
  hook: string;
  honest_description: string;
  foreigner_top_questions: { question: string; answer: string }[];
  experience_format_note: string;
  vibe: string;
  time_needed: { quick_visit: string; recommended: string; deep_dive: string };
  best_time: {
    best_time_of_day: string;
    worst_time: string;
    seasonal_notes: string;
    pro_tip: string;
  };
  getting_in: {
    opening_hours: string;
    price_rmb: string;
    price_usd: string;
    price_breakdown: { item: string; price: string; highlight: string }[];
    booking_required: string;
    booking_method: string;
    passport_accepted: string;
    what_to_bring: string;
    queue_situation: string;
    language_barrier_rating: string;
  };
  highlights: {
    name: string;
    description: string;
    foreigner_appeal: string;
    foreigner_note: string;
    tip: string;
    image?: string;
  }[];
  what_visitors_miss: { what: string; why: string }[];
  strategy: {
    smart_route: string;
    what_to_skip: string;
    pro_tips: string;
  };
  heads_up: { warning: string; advice: string }[];
  foreigners_watch_out: string[];
  if_things_go_wrong: { problem: string; what_to_do: string; plan_b: string }[];
  preparation: {
    what_to_wear: string;
    what_to_bring: string;
    what_not_to_bring: string;
  };
  physical_accessibility: {
    physical_intensity: string;
    physical_details: string;
    age_notes: string;
    health_warnings: string;
  };
  concierge_opportunities: {
    action: string;
    platform: string;
    value_to_user: string;
  }[];
  useful_chinese: { pinyin: string; chinese: string; english: string }[];
  pair_with: { suggestion: string; why: string; travel_time: string }[];
  cultural_context: string;
  photo_spots: { location: string; tip: string; why: string }[];
  card_name: string;
  card_type: string;
  card_hook: string;
  best_for: string[];
}

const CITY_MAP: Record<string, string> = {
  北京: "beijing",
  上海: "shanghai",
  西安: "xian",
  成都: "chengdu",
  重庆: "chongqing",
  杭州: "hangzhou",
  桂林: "guilin",
  张家界: "zhangjiajie",
  丽江: "lijiang",
  大理: "dali",
  昆明: "kunming",
  香格里拉: "shangri-la",
};

const CITY_NAMES_EN: Record<string, string> = {
  beijing: "Beijing",
  shanghai: "Shanghai",
  xian: "Xi'an",
  chengdu: "Chengdu",
  chongqing: "Chongqing",
  hangzhou: "Hangzhou",
  guilin: "Guilin",
  zhangjiajie: "Zhangjiajie",
  lijiang: "Lijiang",
  dali: "Dali",
  kunming: "Kunming",
  "shangri-la": "Shangri-La",
};

const CITY_NAMES_CN: Record<string, string> = {
  beijing: "北京",
  shanghai: "上海",
  xian: "西安",
  chengdu: "成都",
  chongqing: "重庆",
  hangzhou: "杭州",
  guilin: "桂林",
  zhangjiajie: "张家界",
  lijiang: "丽江",
  dali: "大理",
  kunming: "昆明",
  "shangri-la": "香格里拉",
};

function getCitySlug(addressCn: string): string {
  for (const [cn, slug] of Object.entries(CITY_MAP)) {
    if (addressCn.includes(cn)) return slug;
  }
  return "other";
}

function getAttractionSlug(filename: string): string {
  return filename.replace(".json", "");
}

const DATA_DIR = path.join(process.cwd(), "src/data/attractions");

export function getAllAttractions(): {
  slug: string;
  citySlug: string;
  data: Attraction;
}[] {
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
    const data: Attraction = JSON.parse(raw);
    return {
      slug: getAttractionSlug(file),
      citySlug: getCitySlug(data.address_cn),
      data,
    };
  });
}

export function getAttraction(
  citySlug: string,
  attractionSlug: string
): Attraction | null {
  const filePath = path.join(DATA_DIR, `${attractionSlug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const data: Attraction = JSON.parse(raw);
  const actualCity = getCitySlug(data.address_cn);
  if (actualCity !== citySlug) return null;
  return data;
}

export function getAttractionsByCity(
  citySlug: string
): { slug: string; data: Attraction }[] {
  return getAllAttractions()
    .filter((a) => a.citySlug === citySlug)
    .map((a) => ({ slug: a.slug, data: a.data }));
}

export function getCityNameEn(slug: string): string {
  return CITY_NAMES_EN[slug] || slug;
}

export function getCityNameCn(slug: string): string {
  return CITY_NAMES_CN[slug] || "";
}

export function getAllCitySlugs(): string[] {
  return Object.values(CITY_MAP);
}
