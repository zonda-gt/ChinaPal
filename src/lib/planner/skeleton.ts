// Pipeline B · Stage 5 — Skeleton generation.
// Calls Claude Sonnet 4.6 to compose a city-by-day trip outline from the
// top-scored candidates. Output is structured JSON the user can review +
// adjust before we generate detailed days.
import "server-only";
import { getClaudeClient, PLANNER_MODEL, firstText, parseJSONResponse } from "./claude";
import type { Candidate, PlannerParams, Skeleton } from "./types";

/** How many nights total, given inclusive ISO date strings. */
function nightsBetween(dateStart: string, dateEnd: string): number {
  const a = new Date(dateStart + "T00:00:00Z");
  const b = new Date(dateEnd + "T00:00:00Z");
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
}

/** Stable system prompt — gets the prompt-cache benefit on repeated calls. */
const SKELETON_SYSTEM = `You are the trip-skeleton planner for ChinaPal, an AI trip planner for foreign tourists visiting China.

Your job: given a user's structured intake and a ranked list of candidate places, produce a skeleton — the SHAPE of the trip — before any detailed daily itinerary is composed. The user will review and adjust your skeleton, then a separate stage fills in hour-by-hour activities.

A skeleton has:
- city sequence with nights per city (total nights must match trip length)
- per-day theme (one short phrase, 4-8 words)
- per-day pace estimate (fast | balanced | relaxed)

Day-theme writing rules:
- Be specific. Not "Day in Shanghai" — say "Yu Garden morning + Pudong skyline evening" or "French Concession slow walk + jazz".
- Reference actual places from the candidate list when natural. Don't invent places.
- First-day theme should account for arrival fatigue (lighter, evening anchor).
- Last-day theme should account for departure (light morning, no commitments after lunch unless flight is late).
- For a Family trip with toddlers/young kids, alternate high-energy and low-energy days. Don't stack 3 high-energy days.
- For Honeymoon, prioritize evening anchors (sunset, jazz, river) and slow mornings.
- For Returning travelers, weight 'hidden_gem' candidates over 'iconic'.

Pace rules:
- 'relaxed' = 2 stops/day, long meals, slow start
- 'balanced' = 3-4 stops/day, normal pace
- 'fast' = 4-5 stops/day, early start, dinner late

Output rules:
- Return ONLY a single JSON object. No preamble, no markdown fences.
- Match the schema below exactly.
- 'rationale' is 2-3 sentences explaining the SHAPE (city sequence + pace), not justifying individual day picks.
- 'date' must be an ISO YYYY-MM-DD string for each day, computed from date_start and the day index.

Schema:
{
  "cities": [
    {
      "city": "<city slug>",
      "nights": <int>,
      "days": [
        {
          "day_index": <1-based across the whole trip>,
          "date": "YYYY-MM-DD",
          "theme": "<4-8 words>",
          "pace_estimate": "fast" | "balanced" | "relaxed",
          "notes": "<optional 1 short sentence>"
        }
      ]
    }
  ],
  "total_nights": <int>,
  "rationale": "<2-3 sentences>"
}`;

/** Compact view of a candidate that fits a lot of them in one prompt. */
function candidateBrief(c: Candidate): string {
  const tags = (c.interest_tags ?? []).join(",");
  const role = c.narrative_role ?? "?";
  const slot = (c.best_time_of_day ?? []).join("/") || "?";
  const energy = c.energy_intensity ?? "?";
  const friction = c.foreigner_friction_score ?? "?";
  const price = c.price_cny == null ? "?" : `¥${c.price_cny}`;
  const cuisine = c.cuisine_subtype ? ` cuisine:${c.cuisine_subtype}` : "";
  const summary = c.ai_summary ? ` — ${c.ai_summary.slice(0, 200)}…` : "";
  return `[${c.id}] ${c.name_en ?? c.name_cn} (${c.category}, ${role}, ${tags}, slot:${slot}, energy:${energy}, friction:${friction}/5, ${price}${cuisine})${summary}`;
}

/**
 * Generate a trip skeleton.
 *
 * @param params  user intake (validated/structured form payload)
 * @param candidates  top-scored Candidates from Pipeline B Stage 3 (~30-80)
 */
export async function generateSkeleton(
  params: PlannerParams,
  candidates: Candidate[]
): Promise<Skeleton> {
  const total_nights = nightsBetween(params.date_start, params.date_end);

  // Cap candidates to keep the prompt manageable. The skeleton only needs
  // a sense of variety — detailed selection happens in Stage 6.
  const briefs = candidates
    .slice(0, 60)
    .map((c) => candidateBrief(c))
    .join("\n");

  const userMsg = `## User intake
- Cities: ${params.cities.join(", ")}
- Dates: ${params.date_start} → ${params.date_end} (${total_nights} nights)
- Group: ${params.group}${params.kid_ages?.length ? ` with kids: ${params.kid_ages.join(",")}` : ""}
- Mobility issues: ${params.has_mobility_issues ? "yes" : "no"}
- Purposes: ${params.purposes.join(", ")}
- Budget tier: ${params.budget_tier}
- Interests: ${params.interests.join(", ")}
- Dietary: ${params.diet.join(", ")}
- Pace: ${params.pace ?? "balanced"}
${params.freeform ? `- Freeform note: ${params.freeform}\n` : ""}

## Top candidates available
${briefs}

## Task
Produce the skeleton. Total nights MUST equal ${total_nights}. First day_index = 1, date_start = ${params.date_start}.

Return only JSON.`;

  const client = getClaudeClient();
  const message = await client.messages.create({
    model: PLANNER_MODEL,
    max_tokens: 4000,
    system: [
      {
        type: "text",
        text: SKELETON_SYSTEM,
        cache_control: { type: "ephemeral" }, // cache the stable prompt
      },
    ],
    messages: [{ role: "user", content: userMsg }],
  });

  const text = firstText(message);
  const skeleton = parseJSONResponse<Skeleton>(text);

  // Sanity: total_nights must match. If model went off-script, throw — caller decides whether to retry.
  if (skeleton.total_nights !== total_nights) {
    throw new Error(
      `Skeleton total_nights mismatch: model returned ${skeleton.total_nights}, expected ${total_nights}`
    );
  }
  return skeleton;
}
