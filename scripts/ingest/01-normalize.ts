// Pipeline A · Stage 2 — Normalize
// Reads place_scraper Shanghai canonical JSONs and writes one Place row per file.
// Idempotent: re-running upserts each row.
import "../lib/env";
import { getDb, closeDb } from "../../src/lib/db/client";
import { migrate } from "../../src/lib/db/schema";
import { readShanghai, type SourceFile } from "../lib/sources";
import {
  priceFromProse,
  priceTierFromCNY,
  timeNeededMin,
  stableId,
  slugify,
} from "../lib/parsing";

interface PlaceRow {
  id: string;
  slug: string;
  city: string;
  category: string;
  name_cn: string;
  name_en: string | null;
  address_cn: string | null;
  neighborhood_cn: string | null;
  neighborhood_en: string | null;
  district: string | null;
  lat: number | null;
  lng: number | null;
  nearest_metro: string | null;
  price_cny: number | null;
  price_tier: string | null;
  cuisine_type: string | null;
  cuisine_subtype: string | null;
  time_needed_min: number | null;
  opening_hours_raw: string | null;
  hook: string | null;
  honest_description: string | null;
  vibe: string | null;
  best_for: string | null;
  pair_with: string | null;
  kid_suitability: string | null;
  mobility: string | null;
  indoor_outdoor: string | null;
  weather_resilience: string | null;
  energy_intensity: string | null;
  foreigner_friction_score: number | null;
  best_time_of_day: string | null;
  dietary_flags: string | null;
  narrative_role: string | null;
  interest_tags: string | null;
  ai_summary: string | null;
  quality_flags: string | null;
  source_path: string;
  raw_payload: string;
}

function buildRow(src: SourceFile): PlaceRow {
  const d = src.data;
  let name_cn: string;
  let name_en: string | null = null;
  let address_cn: string | null = null;
  let neighborhood_cn: string | null = null;
  let neighborhood_en: string | null = null;
  let nearest_metro: string | null = null;
  let hook: string | null = null;
  let honest_description: string | null = null;
  let vibe: string | null = null;
  let time_needed_min: number | null = null;
  let price_cny: number | null = null;
  let price_tier: string | null = null;
  let cuisine_type: string | null = null;
  let cuisine_subtype: string | null = null;
  let opening_hours_raw: string | null = null;
  let best_for: any[] | null = null;
  let pair_with: any | null = null;
  let dietary_flags: any | null = null;

  if (src.category === "restaurant") {
    const c = d.layer1_card ?? {};
    const ident = c.identity ?? {};
    name_cn = ident.name_cn;
    name_en = ident.name_en ?? null;
    neighborhood_cn = ident.neighborhood_cn ?? null;
    neighborhood_en = ident.neighborhood_en ?? null;
    cuisine_type = ident.cuisine_type ?? null;
    cuisine_subtype = ident.cuisine_subtype ?? null;
    address_cn = d.layer2_detail?.getting_there?.address_cn ?? null;
    nearest_metro = d.layer2_detail?.getting_there?.nearest_metro ?? null;
    hook = c.hook ?? null;
    vibe = c.vibe?.description ?? null;
    honest_description = vibe;
    price_cny = typeof c.price?.price_per_person_cny === "number"
      ? c.price.price_per_person_cny
      : null;
    const rawTier = String(c.price?.price_tier ?? "").toLowerCase();
    if (rawTier === "moderate") price_tier = "mid";
    else if (["free", "budget", "mid", "premium", "luxury"].includes(rawTier)) price_tier = rawTier;
    else price_tier = priceTierFromCNY(price_cny, "restaurant");
    opening_hours_raw = d.layer2_detail?.practical?.opening_time ?? null;
    best_for = c.tags?.best_for ?? null;
    dietary_flags = c.dietary ?? null;
    time_needed_min = 90; // sensible default for a meal
  } else {
    // attraction or experience
    name_cn = d.attraction_name_cn;
    name_en = d.attraction_name_en ?? null;
    address_cn = d.address_cn ?? null;
    hook = d.hook ?? null;
    honest_description = d.honest_description ?? null;
    vibe = d.vibe ?? null;
    time_needed_min = timeNeededMin(d.time_needed);
    const priceField = d.getting_in?.price_rmb ?? d.getting_in?.price ?? null;
    price_cny = priceFromProse(priceField);
    price_tier = priceTierFromCNY(price_cny, src.category as any);
    opening_hours_raw = d.getting_in?.opening_hours ?? null;
    best_for = Array.isArray(d.best_for) ? d.best_for : null;
    pair_with = Array.isArray(d.pair_with) ? d.pair_with : null;
  }

  if (!name_cn) {
    throw new Error(`Missing name_cn in ${src.file_path}`);
  }

  const id = stableId(name_cn, src.city);
  const slug = name_en
    ? `${src.city}-${slugify(name_en) || id}`
    : `${src.city}-${id}`;

  return {
    id,
    slug,
    city: src.city,
    category: src.category,
    name_cn,
    name_en,
    address_cn,
    neighborhood_cn,
    neighborhood_en,
    district: null,
    lat: null,
    lng: null,
    nearest_metro,
    price_cny,
    price_tier,
    cuisine_type,
    cuisine_subtype,
    time_needed_min,
    opening_hours_raw,
    hook,
    honest_description,
    vibe,
    best_for: best_for ? JSON.stringify(best_for) : null,
    pair_with: pair_with ? JSON.stringify(pair_with) : null,
    kid_suitability: null,
    mobility: null,
    indoor_outdoor: null,
    weather_resilience: null,
    energy_intensity: null,
    foreigner_friction_score: null,
    best_time_of_day: null,
    dietary_flags: dietary_flags ? JSON.stringify(dietary_flags) : null,
    narrative_role: null,
    interest_tags: null,
    ai_summary: null,
    quality_flags: null,
    source_path: src.file_path,
    raw_payload: JSON.stringify(d),
  };
}

// ── Run ────────────────────────────────────────────────────────────────────
const db = getDb();
migrate(db);

const sources = readShanghai();
console.log(`Loaded ${sources.length} source files from place_scraper/data/上海`);

const insert = db.prepare(`
  INSERT OR REPLACE INTO places (
    id, slug, city, category, name_cn, name_en,
    address_cn, neighborhood_cn, neighborhood_en, district, lat, lng, nearest_metro,
    price_cny, price_tier, cuisine_type, cuisine_subtype,
    time_needed_min, opening_hours_raw,
    hook, honest_description, vibe, best_for, pair_with,
    kid_suitability, mobility, indoor_outdoor, weather_resilience, energy_intensity,
    foreigner_friction_score, best_time_of_day, dietary_flags, narrative_role, interest_tags,
    ai_summary, quality_flags, source_path, raw_payload, updated_at
  ) VALUES (
    @id, @slug, @city, @category, @name_cn, @name_en,
    @address_cn, @neighborhood_cn, @neighborhood_en, @district, @lat, @lng, @nearest_metro,
    @price_cny, @price_tier, @cuisine_type, @cuisine_subtype,
    @time_needed_min, @opening_hours_raw,
    @hook, @honest_description, @vibe, @best_for, @pair_with,
    @kid_suitability, @mobility, @indoor_outdoor, @weather_resilience, @energy_intensity,
    @foreigner_friction_score, @best_time_of_day, @dietary_flags, @narrative_role, @interest_tags,
    @ai_summary, @quality_flags, @source_path, @raw_payload, datetime('now')
  )
`);

const rows: PlaceRow[] = [];
let buildErrors = 0;
for (const src of sources) {
  try {
    rows.push(buildRow(src));
  } catch (err) {
    buildErrors++;
    console.error(`  ✗ build failed for ${src.file_path}: ${(err as Error).message}`);
  }
}

let writeErrors = 0;
const tx = db.transaction((batch: PlaceRow[]) => {
  for (const r of batch) {
    try {
      insert.run(r);
    } catch (err) {
      writeErrors++;
      console.error(`  ✗ write failed for ${r.name_cn}: ${(err as Error).message}`);
    }
  }
});
tx(rows);

const counts = db
  .prepare("SELECT category, count(*) as n FROM places WHERE city = ? GROUP BY category ORDER BY category")
  .all("shanghai") as { category: string; n: number }[];

console.log("\n── Shanghai counts ─────────────────────────────");
for (const c of counts) console.log(`  ${c.category.padEnd(12)} ${c.n}`);
console.log("────────────────────────────────────────────────");
console.log(
  `Wrote ${rows.length - writeErrors} / ${sources.length} places. ` +
    `(build errors: ${buildErrors}, write errors: ${writeErrors})`
);

// Quick price-tier sanity report
const tiers = db
  .prepare("SELECT price_tier, count(*) as n FROM places WHERE city = ? GROUP BY price_tier ORDER BY n DESC")
  .all("shanghai") as { price_tier: string | null; n: number }[];
console.log("\nPrice tier distribution:");
for (const t of tiers) console.log(`  ${(t.price_tier ?? "(null)").padEnd(10)} ${t.n}`);

closeDb();
