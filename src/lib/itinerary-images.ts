import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "public/uploads/itinerary/config.json");

export const IMAGE_SLOTS = [
  { key: "forest", label: "Forest Park (Hero)", description: "Main hero image + Forest Park activity card" },
  { key: "tianzi", label: "Tianzi Mountain", description: "Tianzi Mountain activity card" },
  { key: "golden", label: "Golden Whip Stream", description: "Golden Whip Stream activity card" },
  { key: "show", label: "Charming Xiangxi Show", description: "Evening show activity card" },
  { key: "concierge", label: "Concierge Mei", description: "Mei's avatar photo" },
  { key: "bailong", label: "Bailong Elevator", description: "Preview thumbnail for Forest Park" },
  { key: "avatar", label: "Avatar Pillars", description: "Preview thumbnail for Forest Park" },
  { key: "tianzi_clouds", label: "Tianzi Sea of Clouds", description: "Preview thumbnail for Tianzi Mountain" },
  { key: "tujia", label: "Tujia Weaving", description: "Tujia Workshop preview" },
  { key: "stream_close", label: "Stream Close-up", description: "Golden Whip Stream preview" },
  { key: "ten_mile", label: "Ten-Mile Gallery", description: "Ten-Mile Gallery preview" },
  { key: "show_stage", label: "Show Stage", description: "Charming Xiangxi preview" },
  { key: "hunan_food", label: "Hunan Food", description: "Restaurant card thumbnails" },
] as const;

export type ImageSlotKey = (typeof IMAGE_SLOTS)[number]["key"];

const CDN_DEFAULTS: Record<ImageSlotKey, string> = {
  forest: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/zjj-forest-park-Fk6sgYY4AzscGgsTAdGZLa.webp",
  tianzi: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/zjj-tianzi-mountain-XX5qUieAEsabKUeYk3JHxK.webp",
  golden: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/zjj-golden-whip-8i6gvipo7fjNjnMVU35ZsX.webp",
  show: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/zjj-charming-show-ekx4haBqHues8Ks8VN98UT.webp",
  concierge: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/concierge-mei-LSnYLpSvvTzhJGNGFgY3Du.webp",
  bailong: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/zjj-bailong-elevator-9wBE8Ew5MeTzffXtu96bUz.webp",
  avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/zjj-avatar-pillars-JfnwwF7VRiJvmNKdnJuoV2.webp",
  tianzi_clouds: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/zjj-tianzi-clouds-9hojziDU5h4PbieGP8mtEX.webp",
  tujia: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/zjj-tujia-weaving-mr8ec3URk5JHRPu8h7Wg67.webp",
  stream_close: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/zjj-stream-close-hBhQpt79q4p9cSqndUf8Ww.webp",
  ten_mile: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/zjj-ten-mile-night-hhDcwkiXTzUM77iNNhKJJz.webp",
  show_stage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/zjj-show-stage-5vsSH7YEVUrQP8TKivY3B2.webp",
  hunan_food: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/zjj-hunan-food-5uvTJyHoH4ttNhNFdYfrT2.webp",
};

export type ImageMap = Record<ImageSlotKey, string>;

function readConfig(): Partial<Record<ImageSlotKey, string>> {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeConfig(config: Partial<Record<ImageSlotKey, string>>) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

/** Get resolved image URLs — custom uploads override CDN defaults */
export function getImageMap(): ImageMap {
  const overrides = readConfig();
  const result = { ...CDN_DEFAULTS };
  for (const [key, val] of Object.entries(overrides)) {
    if (val) result[key as ImageSlotKey] = val;
  }
  return result;
}

/** Save a custom image path for a slot */
export function setSlotImage(slot: ImageSlotKey, publicPath: string) {
  const config = readConfig();
  config[slot] = publicPath;
  writeConfig(config);
}

/** Reset a slot back to CDN default */
export function resetSlotImage(slot: ImageSlotKey) {
  const config = readConfig();
  delete config[slot];
  writeConfig(config);
}

export { CDN_DEFAULTS };
