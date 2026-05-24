// Pure mapper: form payload → structured PlannerParams.
// No AI, no DB. Just normalization + sane defaults.

import type {
  PlannerParams,
  GroupType,
  DietRestriction,
  Purpose,
  Pace,
  PriceTier,
} from "./types";
import type { InterestTag, KidBand } from "../../../scripts/lib/taxonomy";

/** What the form on the planner page sends. Loosely typed since it's user input. */
export interface IntakePayload {
  cities?: string[];
  date_start?: string;
  date_end?: string;
  date_flex_days?: number | string;
  group?: string;
  kid_ages?: string[];
  has_mobility_issues?: boolean;
  purposes?: string[];
  budget_tier?: string;
  interests?: string[];
  diet?: string[];
  pace?: string;
  freeform?: string;
}

const VALID_GROUPS: GroupType[] = [
  "solo",
  "couple",
  "family",
  "friends",
  "multigen",
  "business",
];
const VALID_KID_BANDS: KidBand[] = ["toddler", "child", "tween", "teen"];
const VALID_DIETS: DietRestriction[] = [
  "halal",
  "vegetarian",
  "vegan",
  "pork-free",
  "none",
];
const VALID_PURPOSES: Purpose[] = [
  "first-time",
  "honeymoon",
  "family-vacation",
  "friends-trip",
  "returning",
  "food-nightlife",
  "culture-history",
  "business-leisure",
];
const VALID_BUDGETS: PriceTier[] = ["free", "budget", "mid", "premium", "luxury"];
const VALID_INTERESTS: InterestTag[] = [
  "food",
  "culture",
  "history",
  "nature",
  "art",
  "nightlife",
  "shopping",
  "family",
  "adventure",
  "wellness",
  "photography",
  "architecture",
  "local-life",
  "iconic",
];
const VALID_PACES: Pace[] = ["fast", "balanced", "relaxed"];

function pick<T extends string>(
  value: unknown,
  whitelist: readonly T[],
  fallback: T
): T {
  return whitelist.includes(value as T) ? (value as T) : fallback;
}

function pickMany<T extends string>(
  values: unknown,
  whitelist: readonly T[]
): T[] {
  if (!Array.isArray(values)) return [];
  return values.filter((v): v is T => whitelist.includes(v as T));
}

/** Infer pace from group composition + purposes if user didn't pick one. */
function inferPace(group: GroupType, purposes: Purpose[], kids: KidBand[]): Pace {
  if (purposes.includes("honeymoon")) return "relaxed";
  if (kids.includes("toddler")) return "relaxed";
  if (group === "family" && kids.length) return "balanced";
  if (group === "friends" && purposes.includes("food-nightlife")) return "fast";
  if (group === "multigen") return "relaxed";
  if (group === "business") return "balanced";
  return "balanced";
}

export function parseIntake(p: IntakePayload): PlannerParams {
  const cities = (p.cities ?? []).filter(
    (c): c is string => typeof c === "string" && c.length > 0
  );
  if (!cities.length) throw new Error("intake.cities is required");
  if (!p.date_start) throw new Error("intake.date_start is required");
  if (!p.date_end) throw new Error("intake.date_end is required");

  const group = pick<GroupType>(p.group, VALID_GROUPS, "couple");
  const kid_ages = pickMany<KidBand>(p.kid_ages, VALID_KID_BANDS);
  const purposes = pickMany<Purpose>(p.purposes, VALID_PURPOSES);
  const interests = pickMany<InterestTag>(p.interests, VALID_INTERESTS);
  const diet = pickMany<DietRestriction>(p.diet, VALID_DIETS);
  const budget_tier = pick<PriceTier>(p.budget_tier, VALID_BUDGETS, "mid");
  const pace = p.pace
    ? pick<Pace>(p.pace, VALID_PACES, inferPace(group, purposes, kid_ages))
    : inferPace(group, purposes, kid_ages);

  return {
    cities,
    date_start: p.date_start,
    date_end: p.date_end,
    date_flex_days:
      typeof p.date_flex_days === "number"
        ? p.date_flex_days
        : Number(p.date_flex_days ?? 0) || 0,
    group,
    kid_ages: (group === "family" || group === "multigen") && kid_ages.length
      ? kid_ages
      : undefined,
    has_mobility_issues: Boolean(p.has_mobility_issues),
    purposes: purposes.length ? purposes : ["first-time"],
    budget_tier,
    interests: interests.length ? interests : ["iconic", "food"],
    diet: diet.length ? diet : ["none"],
    pace,
    freeform: typeof p.freeform === "string" ? p.freeform.trim() || undefined : undefined,
  };
}
