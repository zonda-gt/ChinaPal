// Read place_scraper canonical processed-JSONs.
// One entry per place, with category and city resolved.
import fs from "node:fs";
import path from "node:path";

export const PLACE_SCRAPER_ROOT =
  "/Users/zonda/Documents/ClaudeCode/place_scraper/data";

export type Category = "attraction" | "experience" | "restaurant";

export interface SourceFile {
  city: string;       // English slug, e.g. 'shanghai'
  city_cn: string;    // Chinese name, e.g. '上海'
  category: Category;
  folder_name: string;
  file_path: string;
  data: any;
}

const CITY_CN_TO_SLUG: Record<string, string> = {
  上海: "shanghai",
  北京: "beijing",
  成都: "chengdu",
  杭州: "hangzhou",
  西安: "xian",
  重庆: "chongqing",
  丽江: "lijiang",
  大理: "dali",
  昆明: "kunming",
  桂林: "guilin",
  张家界: "zhangjiajie",
  香格里拉: "shangri-la",
};

function readJSON(p: string): any {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function readCategoryFolder(
  cityRoot: string,
  citySlug: string,
  cityCn: string,
  category: Category,
  subdir: string,
  canonicalSubpath: string
): SourceFile[] {
  const root = path.join(cityRoot, subdir);
  if (!fs.existsSync(root)) return [];
  const out: SourceFile[] = [];
  for (const folder of fs.readdirSync(root)) {
    if (folder.startsWith(".")) continue;
    const full = path.join(root, folder, canonicalSubpath);
    if (!fs.existsSync(full)) continue;
    out.push({
      city: citySlug,
      city_cn: cityCn,
      category,
      folder_name: folder,
      file_path: full,
      data: readJSON(full),
    });
  }
  return out;
}

/** Read all canonical processed JSONs for a city. */
export function readCity(cityCn: string): SourceFile[] {
  const citySlug = CITY_CN_TO_SLUG[cityCn];
  if (!citySlug) throw new Error(`Unknown city: ${cityCn}`);
  const cityRoot = path.join(PLACE_SCRAPER_ROOT, cityCn);
  if (!fs.existsSync(cityRoot)) throw new Error(`No data for ${cityCn} at ${cityRoot}`);

  return [
    ...readCategoryFolder(cityRoot, citySlug, cityCn, "attraction", "attractions", "chinapal_processed.json"),
    ...readCategoryFolder(cityRoot, citySlug, cityCn, "experience", "experiences", "processed/profile.json"),
    ...readCategoryFolder(cityRoot, citySlug, cityCn, "restaurant", "restaurant_bar", "processed/profile_v2.json"),
  ];
}

/** Convenience: read Shanghai. */
export function readShanghai(): SourceFile[] {
  return readCity("上海");
}
