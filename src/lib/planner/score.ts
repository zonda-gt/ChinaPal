// Pipeline B · Stage 3 — Tag-based soft scoring (deterministic).
// Ranks the hard-filtered candidates against the user's interests + purpose
// + pace. Pure functions, no I/O.

import type { Candidate, PlannerParams, Pace, Purpose } from "./types";
import type { InterestTag, NarrativeRole, Energy } from "../../../scripts/lib/taxonomy";

/**
 * Score a candidate from 0 to ~100. Higher is better.
 *
 * Weights are tuned for Shanghai's ~119-place catalog. Tune per city if signals
 * change. The breakdown string is for debugging — strip in prod.
 */
export function scoreCandidate(
  c: Omit<Candidate, "score">,
  params: PlannerParams
): { score: number; breakdown: string } {
  const parts: string[] = [];
  let score = 0;

  // ── Base: interest overlap (most important signal) ─────────────────────
  const userInterests = new Set<InterestTag>(params.interests);
  const placeTags = new Set<InterestTag>(c.interest_tags ?? []);
  const overlap = [...userInterests].filter((t) => placeTags.has(t));
  const overlapBoost = overlap.length * 8; // 8 points per matching interest
  score += overlapBoost;
  if (overlap.length) parts.push(`+${overlapBoost} interests:${overlap.join(",")}`);

  // ── Narrative role + purpose ───────────────────────────────────────────
  const roleBoost = scoreNarrativeRole(c.narrative_role, params.purposes);
  score += roleBoost;
  if (roleBoost) parts.push(`${roleBoost > 0 ? "+" : ""}${roleBoost} role:${c.narrative_role}`);

  // ── Foreigner-friendliness ─────────────────────────────────────────────
  // Lower friction = better. Scale: 1 → +5, 5 → -5
  if (typeof c.foreigner_friction_score === "number") {
    const f = 5 - 2 * (c.foreigner_friction_score - 1);
    score += f;
    if (f !== 0) parts.push(`${f > 0 ? "+" : ""}${f} foreigner:${c.foreigner_friction_score}/5`);
  }

  // ── Pace match (energy intensity) ──────────────────────────────────────
  const paceBoost = scorePaceMatch(c.energy_intensity, params.pace);
  score += paceBoost;
  if (paceBoost) parts.push(`${paceBoost > 0 ? "+" : ""}${paceBoost} pace`);

  // ── Quality bumps for solid signals ────────────────────────────────────
  if (c.ai_summary) score += 1; // we trust scored places more than unenriched
  if (c.kid_suitability && params.kid_ages?.length) {
    const matchedKidBands = params.kid_ages.filter((b) =>
      c.kid_suitability!.includes(b)
    ).length;
    if (matchedKidBands === params.kid_ages.length) {
      score += 4; // works for ALL kids in the family
      parts.push("+4 all-kid-band match");
    }
  }

  // ── Floor at 0 ─────────────────────────────────────────────────────────
  score = Math.max(0, Math.round(score));

  return {
    score,
    breakdown: parts.length ? parts.join(" ") : "(neutral)",
  };
}

function scoreNarrativeRole(
  role: NarrativeRole | null,
  purposes: Purpose[]
): number {
  if (!role) return 0;
  const isFirstTime = purposes.includes("first-time");
  const isReturning = purposes.includes("returning");
  const isHoneymoon = purposes.includes("honeymoon");
  const isFamily = purposes.includes("family-vacation");
  const isFood = purposes.includes("food-nightlife");

  switch (role) {
    case "iconic":
      if (isFirstTime) return 18;
      if (isHoneymoon) return 6;
      if (isReturning) return -4; // they've already done the iconic stuff
      return 8;
    case "highlight":
      return 10;
    case "hidden_gem":
      if (isReturning) return 16;
      if (isFirstTime) return 4;
      return 8;
    case "day_filler":
      return 3;
    case "wildcard":
      if (isReturning || isFood) return 6;
      return 0;
    default:
      return 0;
  }
}

function scorePaceMatch(
  energy: Energy | null,
  pace: Pace | undefined
): number {
  if (!energy || !pace) return 0;
  if (pace === "relaxed" && energy === "low") return 5;
  if (pace === "relaxed" && energy === "high") return -6;
  if (pace === "fast" && energy === "high") return 5;
  if (pace === "fast" && energy === "low") return -3;
  if (pace === "balanced" && energy === "medium") return 3;
  return 0;
}

/**
 * Apply scoring to all candidates and return them sorted (highest first).
 * Optional `topN` caps the result.
 */
export function rankCandidates(
  candidates: Omit<Candidate, "score">[],
  params: PlannerParams,
  topN?: number
): Candidate[] {
  const scored: Candidate[] = candidates.map((c) => {
    const { score, breakdown } = scoreCandidate(c, params);
    return { ...c, score, score_breakdown: breakdown };
  });
  scored.sort((a, b) => b.score - a.score);
  return typeof topN === "number" ? scored.slice(0, topN) : scored;
}
