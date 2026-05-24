// Pipeline B · Stage 6 — Detailed itinerary generation.
// For each day in the skeleton, ask Claude to pick 3-5 places that match the
// theme + slot, sequence them, and write a one-line "why". Run sequentially
// per day so we can stream day-by-day to the UI.
import "server-only";
import { getClaudeClient, PLANNER_MODEL, firstText, parseJSONResponse } from "./claude";
import type {
  Candidate,
  Day,
  DayItem,
  PlannerParams,
  Skeleton,
  SkeletonDay,
} from "./types";

/** Stable system prompt — cached across all per-day calls in a single trip. */
const ITIN_SYSTEM = `You are the daily-itinerary composer for ChinaPal, an AI trip planner for foreign tourists in China.

Given a single day's skeleton (theme, pace, date) and a list of candidate places already pre-filtered for the user, your job is to:
1. Pick 3-5 places that fit the day's THEME — not random tag-matches.
2. Sequence them by their natural time-of-day slot.
3. For each, write ONE short sentence (≤25 words) explaining WHY this specific place at this specific slot for this specific user.

Sequencing rules:
- Order by slot: dawn → morning → midday → afternoon → evening → night.
- Allow only one meal per slot (one lunch, one dinner). Don't double up.
- Default start times: morning 09:00, midday 12:30, afternoon 14:30, evening 18:30, night 21:00. Adjust by ±60 min if a place's data demands.
- For "fast" pace days, target 4-5 items. For "balanced", 3-4. For "relaxed", 2-3.
- Don't repeat a place across days.

"why" line rules:
- Specific to THIS user. Not generic ("great food"). Reference their group, kids' ages, purposes, or interests.
- Don't restate the place name. The reader sees it.
- Don't describe the place. Tell them why this slot, this day, this trip.

Output rules:
- Return ONLY a single JSON object — no preamble, no markdown fences.
- Use only place IDs from the candidate list. Don't invent place IDs or names.
- Match the schema below exactly.

Schema:
{
  "items": [
    {
      "slot": "morning"|"midday"|"afternoon"|"evening"|"night"|"dawn",
      "start_time": "HH:MM",
      "duration_min": <int>,
      "place_id": "<id from candidates>",
      "place_name": "<name from candidates>",
      "category": "attraction" | "experience" | "restaurant",
      "why": "<one sentence ≤25 words>",
      "cost_cny": <int or null>
    }
  ]
}`;

/** Compact candidate brief — used inside the per-day user prompt. */
function dayCandidateBrief(c: Candidate): string {
  const tags = (c.interest_tags ?? []).join(",");
  const slot = (c.best_time_of_day ?? []).join("/") || "any";
  const energy = c.energy_intensity ?? "?";
  const cuisine = c.cuisine_subtype ? ` cuisine:${c.cuisine_subtype}` : "";
  const time = c.time_needed_min ? ` ~${c.time_needed_min}min` : "";
  const summary = c.ai_summary ? ` — ${c.ai_summary.slice(0, 220)}…` : "";
  return `[${c.id}] ${c.name_en ?? c.name_cn} (${c.category}, slot:${slot}, energy:${energy}, tags:${tags}${cuisine}${time})${summary}`;
}

/**
 * Generate the items for a single day. Designed to be called once per day
 * so callers can stream day-by-day to the UI.
 */
async function generateDay(
  params: PlannerParams,
  skelDay: SkeletonDay,
  candidates: Candidate[],
  alreadyUsedIds: Set<string>
): Promise<{ items: DayItem[] }> {
  // Filter candidates for this day:
  //  - exclude already-used places
  //  - prefer ones whose best_time_of_day overlaps with the day's pace + theme
  // (We let the LLM do final selection, but we trim aggressively to keep prompt small.)
  const eligible = candidates.filter((c) => !alreadyUsedIds.has(c.id));

  // Cap to 30 candidates to keep prompt small + responses fast.
  const briefs = eligible
    .slice(0, 30)
    .map(dayCandidateBrief)
    .join("\n");

  const userMsg = `## User context (for "why" lines)
- Group: ${params.group}${params.kid_ages?.length ? ` with kids: ${params.kid_ages.join(",")}` : ""}
- Purposes: ${params.purposes.join(", ")}
- Interests: ${params.interests.join(", ")}
- Budget tier: ${params.budget_tier}
- Pace: ${params.pace ?? "balanced"}
${params.freeform ? `- Note: ${params.freeform}\n` : ""}

## Day ${skelDay.day_index} — ${skelDay.date}
- Theme: ${skelDay.theme}
- Pace: ${skelDay.pace_estimate}
${skelDay.notes ? `- Notes: ${skelDay.notes}` : ""}

## Candidate places (already pre-filtered for this user)
${briefs}

## Task
Pick 3-5 places that fit the THEME, sequence them by time-of-day, and write the "why" lines.
Return only JSON.`;

  const client = getClaudeClient();
  const message = await client.messages.create({
    model: PLANNER_MODEL,
    max_tokens: 2500,
    system: [
      {
        type: "text",
        text: ITIN_SYSTEM,
        cache_control: { type: "ephemeral" }, // reused across all days in the trip
      },
    ],
    messages: [{ role: "user", content: userMsg }],
  });

  const text = firstText(message);
  return parseJSONResponse<{ items: DayItem[] }>(text);
}

/**
 * Generate a full multi-day itinerary by composing per-day calls.
 * Returns days in order. Caller can stream them as they resolve.
 */
export async function* streamItinerary(
  params: PlannerParams,
  skeleton: Skeleton,
  candidates: Candidate[]
): AsyncGenerator<Day, void, unknown> {
  const used = new Set<string>();

  // Flatten skeleton.cities[].days into a single chronological list.
  const allDays: { city: string; day: SkeletonDay }[] = [];
  for (const c of skeleton.cities) {
    for (const d of c.days) allDays.push({ city: c.city, day: d });
  }
  allDays.sort((a, b) => a.day.day_index - b.day.day_index);

  // Filter candidates by city — we don't want to suggest Beijing places on a
  // Shanghai day. (For Shanghai-only trips this is a no-op.)
  const candidatesByCity = new Map<string, Candidate[]>();
  for (const c of candidates) {
    if (!candidatesByCity.has(c.city)) candidatesByCity.set(c.city, []);
    candidatesByCity.get(c.city)!.push(c);
  }

  for (const { city, day } of allDays) {
    const cityCandidates = candidatesByCity.get(city) ?? [];
    const { items } = await generateDay(params, day, cityCandidates, used);
    for (const it of items) used.add(it.place_id);

    yield {
      day_index: day.day_index,
      date: day.date,
      city,
      theme: day.theme,
      items,
    };
  }
}
