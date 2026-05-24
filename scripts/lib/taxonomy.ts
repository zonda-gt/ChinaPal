// Closed vocabularies the AI tagger must use when enriching places.
// These are the same labels Pipeline B's filter/score code reads —
// keep them in sync.

export const KID_BANDS = ["toddler", "child", "tween", "teen"] as const;
export type KidBand = (typeof KID_BANDS)[number];

export const MOBILITY_LEVELS = ["easy", "moderate", "hard"] as const;
export type Mobility = (typeof MOBILITY_LEVELS)[number];

export const INDOOR_OUTDOOR = ["indoor", "outdoor", "mixed"] as const;
export type IndoorOutdoor = (typeof INDOOR_OUTDOOR)[number];

export const RESILIENCE = ["low", "medium", "high"] as const;
export type Resilience = (typeof RESILIENCE)[number];

export const ENERGY = ["low", "medium", "high"] as const;
export type Energy = (typeof ENERGY)[number];

export const TIME_OF_DAY = [
  "dawn",
  "morning",
  "midday",
  "afternoon",
  "evening",
  "night",
] as const;
export type TimeOfDay = (typeof TIME_OF_DAY)[number];

export const NARRATIVE_ROLES = [
  "iconic",
  "hidden_gem",
  "day_filler",
  "highlight",
  "wildcard",
] as const;
export type NarrativeRole = (typeof NARRATIVE_ROLES)[number];

export const INTEREST_TAGS = [
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
] as const;
export type InterestTag = (typeof INTEREST_TAGS)[number];

export interface Enrichment {
  kid_suitability: KidBand[];
  mobility: Mobility;
  indoor_outdoor: IndoorOutdoor;
  weather_resilience: Resilience;
  energy_intensity: Energy;
  foreigner_friction_score: number; // 1..5
  best_time_of_day: TimeOfDay[];
  /** Only meaningful for non-restaurants — for restaurants, the existing structured `dietary` is authoritative. */
  dietary_flags: {
    halal_ok: boolean;
    veg_ok: boolean;
    vegan_ok: boolean;
    pork_free: boolean;
    note?: string;
  };
  narrative_role: NarrativeRole;
  interest_tags: InterestTag[];
}
