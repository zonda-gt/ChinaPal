// Pipeline B · Stage 8 — On-demand refinements.
// Two modes:
//  - swap: given an itinerary + day_index + slot, return 3 alternative places
//          (smaller call, ~3-5 seconds)
//  - chat: given an itinerary + freeform user message, return modified
//          itinerary + summary of what changed
import "server-only";
import { getClaudeClient, PLANNER_MODEL, firstText, parseJSONResponse } from "./claude";
import type {
  Candidate,
  ChatRefineResult,
  Day,
  Itinerary,
  PlannerParams,
  SwapResult,
} from "./types";
import type { TimeOfDay } from "../../../scripts/lib/taxonomy";

/* ============================================================
   SWAP MODE
   ============================================================ */

const SWAP_SYSTEM = `You are the swap-suggestion engine for ChinaPal's AI trip planner.

Given the user's current itinerary, a specific day + time slot, and a list of candidate alternatives, pick the 3 BEST alternatives that:
- fill the same slot (same time of day)
- match the day's theme
- aren't already used elsewhere in the itinerary
- if there's a "reason" the user wants to swap, address it specifically

Return ONLY a JSON object:
{
  "alternatives": [
    { "id": "<from candidates>", "why": "<one sentence ≤25 words explaining why this is a strong swap>" }
  ]
}`;

export async function generateSwapAlternatives(
  itinerary: Itinerary,
  dayIndex: number,
  slot: TimeOfDay,
  candidates: Candidate[],
  reason?: string
): Promise<SwapResult> {
  const day = itinerary.days.find((d) => d.day_index === dayIndex);
  if (!day) throw new Error(`Day ${dayIndex} not found in itinerary`);

  // Already-used IDs across the whole trip — never suggest them.
  const used = new Set<string>();
  for (const d of itinerary.days) for (const it of d.items) used.add(it.place_id);

  // Current pick at this slot (if any), so we know what to differ FROM.
  const currentItem = day.items.find((i) => i.slot === slot);

  // Cap candidates and exclude already-used. Prefer ones whose best_time_of_day
  // includes the requested slot.
  const eligible = candidates
    .filter((c) => !used.has(c.id))
    .sort((a, b) => {
      const aFits = (a.best_time_of_day ?? []).includes(slot) ? 1 : 0;
      const bFits = (b.best_time_of_day ?? []).includes(slot) ? 1 : 0;
      return bFits - aFits || b.score - a.score;
    })
    .slice(0, 20);

  const briefs = eligible
    .map(
      (c) =>
        `[${c.id}] ${c.name_en ?? c.name_cn} (${c.category}, ${(c.interest_tags ?? []).join(",")}, slot:${(c.best_time_of_day ?? []).join("/")}) — ${(c.ai_summary ?? "").slice(0, 200)}…`
    )
    .join("\n");

  const userMsg = `## Day ${dayIndex} — ${day.theme} (${day.date}, ${day.city})
Slot to swap: ${slot}
${currentItem ? `Currently scheduled: [${currentItem.place_id}] ${currentItem.place_name}\nWhy it was picked: ${currentItem.why}` : "(empty slot — fill it)"}
${reason ? `User's reason for swapping: ${reason}` : ""}

## User context
- Group: ${itinerary.params.group}${itinerary.params.kid_ages?.length ? ` with kids: ${itinerary.params.kid_ages.join(",")}` : ""}
- Purposes: ${itinerary.params.purposes.join(", ")}
- Interests: ${itinerary.params.interests.join(", ")}
- Pace: ${itinerary.params.pace ?? "balanced"}

## Candidate alternatives (already filtered for the user, not yet used in trip)
${briefs}

Pick the 3 best swaps and return JSON only.`;

  const client = getClaudeClient();
  const message = await client.messages.create({
    model: PLANNER_MODEL,
    max_tokens: 800,
    system: [{ type: "text", text: SWAP_SYSTEM, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: userMsg }],
  });

  const parsed = parseJSONResponse<{ alternatives: { id: string; why: string }[] }>(firstText(message));
  const byId = new Map<string, Candidate>(eligible.map((c) => [c.id, c]));
  const alternatives: Candidate[] = [];
  for (const a of parsed.alternatives) {
    const cand = byId.get(a.id);
    if (cand) {
      alternatives.push({ ...cand, score_breakdown: a.why });
    }
  }
  return { alternatives };
}

/* ============================================================
   CHAT MODE
   ============================================================ */

const CHAT_SYSTEM = `You are the chat-refinement engine for ChinaPal's AI trip planner.

The user has an itinerary and wants to change something via natural language. Your job: interpret their message, decide what changes, and return the MODIFIED itinerary plus a summary of what you changed.

Common requests:
- "make day 2 slower" → reduce items count, swap high-energy for low-energy
- "less restaurants" → drop one meal, replace with attraction/experience
- "no museums" → swap any museum/gallery for something else
- "earlier mornings" → push start times earlier
- "weather looks bad on day 3" → favor indoor places that day
- "add a hotel pool day" → reduce stops, leave space
- "we're not foodies" → swap multiple meals for non-food activities

Output rules:
- Return ONLY a JSON object with the FULL updated itinerary AND a summary.
- Use only place IDs from the candidate list.
- Don't invent places. If you need a place that's not in the candidate list, leave the slot empty and mention it in the summary.
- 'changed_days' lists the day_index values you actually modified (don't list days you left alone).
- 'summary' is 1-2 sentences explaining what changed.

Schema:
{
  "itinerary": <full Itinerary — same shape as the input, with modified days>,
  "changed_days": [<day_index>, ...],
  "summary": "<1-2 sentences>"
}

Itinerary day item shape (same as before):
{
  "slot": "morning"|"midday"|"afternoon"|"evening"|"night"|"dawn",
  "start_time": "HH:MM",
  "duration_min": <int>,
  "place_id": "<id>",
  "place_name": "<name>",
  "category": "attraction"|"experience"|"restaurant",
  "why": "<one sentence>",
  "cost_cny": <int or null>
}`;

export async function generateChatRefine(
  itinerary: Itinerary,
  message: string,
  candidates: Candidate[]
): Promise<ChatRefineResult> {
  const used = new Set<string>();
  for (const d of itinerary.days) for (const it of d.items) used.add(it.place_id);

  const eligible = candidates
    .filter((c) => !used.has(c.id))
    .slice(0, 40);

  const briefs = eligible
    .map(
      (c) =>
        `[${c.id}] ${c.name_en ?? c.name_cn} (${c.category}, ${(c.interest_tags ?? []).join(",")}, slot:${(c.best_time_of_day ?? []).join("/")}, energy:${c.energy_intensity ?? "?"})`
    )
    .join("\n");

  const userMsg = `## Current itinerary
${JSON.stringify(itinerary, null, 2)}

## User's message
"${message}"

## Available alternative places (not currently in the trip)
${briefs}

Apply the user's request and return the modified itinerary as JSON only.`;

  const client = getClaudeClient();
  const aiMessage = await client.messages.create({
    model: PLANNER_MODEL,
    max_tokens: 8000,
    system: [{ type: "text", text: CHAT_SYSTEM, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: userMsg }],
  });

  const result = parseJSONResponse<{
    itinerary: Itinerary;
    changed_days: number[];
    summary: string;
  }>(firstText(aiMessage));

  return result;
}
