// POST /api/planner/candidates
//
// Pipeline B · Stages 1-3: parse intake → hard filter → tag-score.
// Pure deterministic SQL + TypeScript. No AI, no streaming.
// Target latency: <100ms.
import { NextResponse, type NextRequest } from "next/server";
import { parseIntake, type IntakePayload } from "@/lib/planner/intake";
import { hardFilter } from "@/lib/planner/filter";
import { rankCandidates } from "@/lib/planner/score";

export const runtime = "nodejs"; // better-sqlite3 needs Node, not Edge

export async function POST(req: NextRequest) {
  let payload: IntakePayload;
  try {
    payload = (await req.json()) as IntakePayload;
  } catch (err) {
    return NextResponse.json(
      { error: "invalid_json", message: (err as Error).message },
      { status: 400 }
    );
  }

  let params;
  try {
    params = parseIntake(payload);
  } catch (err) {
    return NextResponse.json(
      { error: "invalid_intake", message: (err as Error).message },
      { status: 400 }
    );
  }

  const filtered = hardFilter(params);
  const ranked = rankCandidates(filtered, params, 80);

  // Group counts for the UI.
  const byCategory = ranked.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] ?? 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    params,
    counts: {
      total: ranked.length,
      by_category: byCategory,
    },
    candidates: ranked.map((c) => ({
      id: c.id,
      slug: c.slug,
      name_cn: c.name_cn,
      name_en: c.name_en,
      category: c.category,
      neighborhood: c.neighborhood_en ?? c.neighborhood_cn,
      price_cny: c.price_cny,
      price_tier: c.price_tier,
      cuisine: c.cuisine_subtype ?? c.cuisine_type,
      time_needed_min: c.time_needed_min,
      narrative_role: c.narrative_role,
      interest_tags: c.interest_tags,
      best_time_of_day: c.best_time_of_day,
      foreigner_friction_score: c.foreigner_friction_score,
      score: c.score,
      score_breakdown: c.score_breakdown,
    })),
  });
}
