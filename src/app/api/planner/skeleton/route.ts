// POST /api/planner/skeleton
// Pipeline B · Stage 5: AI-composed trip skeleton (city sequence + day themes).
// Combines /candidates (filter+score) with a Sonnet 4.6 call.
import { NextResponse, type NextRequest } from "next/server";
import { parseIntake, type IntakePayload } from "@/lib/planner/intake";
import { hardFilter } from "@/lib/planner/filter";
import { rankCandidates } from "@/lib/planner/score";
import { generateSkeleton } from "@/lib/planner/skeleton";

export const runtime = "nodejs";

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
  const candidates = rankCandidates(filtered, params, 80);

  if (!candidates.length) {
    return NextResponse.json(
      {
        error: "no_candidates",
        message:
          "No places match your hard constraints. Try widening dietary or budget.",
      },
      { status: 400 }
    );
  }

  try {
    const skeleton = await generateSkeleton(params, candidates);
    return NextResponse.json({
      params,
      candidates_count: candidates.length,
      skeleton,
    });
  } catch (err) {
    console.error("[skeleton] generation failed:", err);
    return NextResponse.json(
      { error: "generation_failed", message: (err as Error).message },
      { status: 500 }
    );
  }
}
