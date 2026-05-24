// POST /api/planner/refine
// Pipeline B · Stage 8: handles 'swap' (small) and 'chat' (full-itinerary edit).
//
// Body shape:
//   { mode: "swap", itinerary, day_index, slot, reason? }
//   { mode: "chat", itinerary, message }
import { NextResponse, type NextRequest } from "next/server";
import { hardFilter } from "@/lib/planner/filter";
import { rankCandidates } from "@/lib/planner/score";
import {
  generateSwapAlternatives,
  generateChatRefine,
} from "@/lib/planner/refine";
import type { RefineRequest } from "@/lib/planner/types";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  let body: RefineRequest;
  try {
    body = (await req.json()) as RefineRequest;
  } catch (err) {
    return NextResponse.json(
      { error: "invalid_json", message: (err as Error).message },
      { status: 400 }
    );
  }
  if (!body?.itinerary?.params) {
    return NextResponse.json(
      { error: "missing_fields", message: "Need itinerary with params." },
      { status: 400 }
    );
  }

  const filtered = hardFilter(body.itinerary.params);
  const candidates = rankCandidates(filtered, body.itinerary.params, 80);

  try {
    if (body.mode === "swap") {
      const result = await generateSwapAlternatives(
        body.itinerary,
        body.day_index,
        body.slot,
        candidates,
        body.reason
      );
      return NextResponse.json(result);
    }
    if (body.mode === "chat") {
      const result = await generateChatRefine(
        body.itinerary,
        body.message,
        candidates
      );
      return NextResponse.json(result);
    }
    return NextResponse.json(
      { error: "invalid_mode", message: `Unknown mode: ${(body as { mode?: string }).mode}` },
      { status: 400 }
    );
  } catch (err) {
    console.error("[refine] error:", err);
    return NextResponse.json(
      { error: "refine_failed", message: (err as Error).message },
      { status: 500 }
    );
  }
}
