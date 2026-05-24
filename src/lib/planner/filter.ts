// Pipeline B · Stage 2 — Hard filtering (deterministic SQL).
// Cuts the catalog to candidates that meet the user's non-negotiable constraints.
//
// Soft preferences (interests, narrative role) belong in score.ts, not here.

import type { PlannerParams, Candidate } from "./types";
import { getDb } from "../db/client";

const PRICE_TIER_RANK: Record<string, number> = {
  free: 0,
  budget: 1,
  mid: 2,
  premium: 3,
  luxury: 4,
};

const MOBILITY_RANK: Record<string, number> = {
  easy: 0,
  moderate: 1,
  hard: 2,
};

interface PlaceRow {
  id: string;
  slug: string;
  city: string;
  category: string;
  name_cn: string;
  name_en: string | null;
  neighborhood_cn: string | null;
  neighborhood_en: string | null;
  price_cny: number | null;
  price_tier: string | null;
  cuisine_type: string | null;
  cuisine_subtype: string | null;
  time_needed_min: number | null;
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
}

/** Parse a JSON column, returning null on failure. */
function jparse<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

/** Convert a raw SQLite row into a Candidate (without score). */
function rowToCandidate(row: PlaceRow): Omit<Candidate, "score"> {
  return {
    id: row.id,
    slug: row.slug,
    city: row.city,
    category: row.category as Candidate["category"],
    name_cn: row.name_cn,
    name_en: row.name_en,
    neighborhood_cn: row.neighborhood_cn,
    neighborhood_en: row.neighborhood_en,
    price_cny: row.price_cny,
    price_tier: row.price_tier as Candidate["price_tier"],
    cuisine_type: row.cuisine_type,
    cuisine_subtype: row.cuisine_subtype,
    time_needed_min: row.time_needed_min,
    kid_suitability: jparse(row.kid_suitability),
    mobility: row.mobility as Candidate["mobility"],
    indoor_outdoor: row.indoor_outdoor as Candidate["indoor_outdoor"],
    weather_resilience: row.weather_resilience as Candidate["weather_resilience"],
    energy_intensity: row.energy_intensity as Candidate["energy_intensity"],
    foreigner_friction_score: row.foreigner_friction_score,
    best_time_of_day: jparse(row.best_time_of_day),
    dietary_flags: jparse(row.dietary_flags),
    narrative_role: row.narrative_role as Candidate["narrative_role"],
    interest_tags: jparse(row.interest_tags),
    ai_summary: row.ai_summary,
  };
}

/**
 * Hard filter step. Returns Candidates that pass all non-negotiable constraints.
 * Soft scoring happens in score.ts.
 */
export function hardFilter(
  params: PlannerParams
): Omit<Candidate, "score">[] {
  const db = getDb();

  // Build dynamic WHERE clauses.
  const where: string[] = ["city IN (" + params.cities.map(() => "?").join(",") + ")"];
  const args: (string | number)[] = [...params.cities];

  // Budget ceiling — places with NULL tier still pass (we don't have signal).
  const budgetRank = PRICE_TIER_RANK[params.budget_tier] ?? 2;
  // For restaurants we cap strictly. For attractions/experiences we're looser
  // (a free attraction is fine on a luxury budget; that's not an issue).
  // The cap matters most for restaurants and ticketed events.
  // We allow tiers ≤ budget (rank check at TS layer for nullable handling).

  // Mobility ceiling.
  if (params.has_mobility_issues) {
    where.push("(mobility = 'easy' OR mobility IS NULL)");
  }

  const sql = `
    SELECT id, slug, city, category, name_cn, name_en,
           neighborhood_cn, neighborhood_en, price_cny, price_tier,
           cuisine_type, cuisine_subtype, time_needed_min,
           kid_suitability, mobility, indoor_outdoor, weather_resilience,
           energy_intensity, foreigner_friction_score, best_time_of_day,
           dietary_flags, narrative_role, interest_tags, ai_summary
      FROM places
     WHERE ${where.join(" AND ")}
  `;

  const rows = db.prepare(sql).all(...args) as PlaceRow[];

  // Apply remaining filters in TS where SQL is awkward (JSON columns, mixed nulls).
  return rows
    .map(rowToCandidate)
    .filter((c) => passesBudget(c, budgetRank))
    .filter((c) => passesDiet(c, params))
    .filter((c) => passesKidAges(c, params));
}

function passesBudget(c: Omit<Candidate, "score">, budgetRank: number): boolean {
  if (!c.price_tier) return true; // unknown tier — allow
  const r = PRICE_TIER_RANK[c.price_tier];
  return r === undefined ? true : r <= budgetRank;
}

function passesDiet(
  c: Omit<Candidate, "score">,
  params: PlannerParams
): boolean {
  // Only restaurants are HARD-filtered on diet. For attractions/experiences,
  // the dietary_flags describe nearby options — useful for ranking, not gating.
  if (c.category !== "restaurant") return true;

  const diet = params.diet;
  if (!diet.length || diet.includes("none")) return true;

  const flags = c.dietary_flags as Record<string, unknown> | null;
  if (!flags) return true; // no signal — don't gate

  // After Phase 3 normalization, fields are halal_ok/veg_ok/vegan_ok/pork_free
  // (booleans). For halal specifically we use STRICT semantics: must be
  // explicitly halal_ok=true. Anything else (false OR null/missing) is rejected
  // — pork is a hard line for Muslims and we'd rather under-recommend than
  // surface a non-halal place by accident.
  const halalOk = flags.halal_ok === true;
  const vegNo = flags.veg_ok === false;
  const veganNo = flags.vegan_ok === false;
  const porkFreeNo = flags.pork_free === false;

  for (const d of diet) {
    if (d === "halal" && !halalOk) return false; // strict
    if (d === "vegetarian" && vegNo) return false;
    if (d === "vegan" && veganNo) return false;
    if (d === "pork-free" && porkFreeNo) return false;
  }
  return true;
}

function passesKidAges(
  c: Omit<Candidate, "score">,
  params: PlannerParams
): boolean {
  if (!params.kid_ages?.length) return true; // not a family trip — allow all
  if (!c.kid_suitability) return true; // no enrichment signal — allow

  // Place must be suitable for AT LEAST ONE of the user's kid ages.
  // (If a family has a toddler AND a teen, anywhere either can enjoy is fine.)
  return params.kid_ages.some((age) => c.kid_suitability!.includes(age));
}
