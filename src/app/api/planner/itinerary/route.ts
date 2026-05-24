// POST /api/planner/itinerary
// Pipeline B · Stage 6: detailed day-by-day itinerary, streamed back as
// newline-delimited JSON (one Day per line) so the UI can render each day
// as it arrives.
//
// Body shape: { params: PlannerParams, skeleton: Skeleton }
//
// The client should call /api/planner/skeleton first to get the skeleton,
// let the user adjust it, then POST it back here with the params.
import { type NextRequest } from "next/server";
import type { PlannerParams, Skeleton } from "@/lib/planner/types";
import { hardFilter } from "@/lib/planner/filter";
import { rankCandidates } from "@/lib/planner/score";
import { streamItinerary } from "@/lib/planner/itinerary";

export const runtime = "nodejs";
// Allow up to 5 minutes for the full multi-day generation.
export const maxDuration = 300;

interface ItineraryRequest {
  params: PlannerParams;
  skeleton: Skeleton;
}

export async function POST(req: NextRequest) {
  let body: ItineraryRequest;
  try {
    body = (await req.json()) as ItineraryRequest;
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "invalid_json", message: (err as Error).message }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }
  if (!body?.params || !body?.skeleton) {
    return new Response(
      JSON.stringify({ error: "missing_fields", message: "Need both params and skeleton." }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  // Re-score candidates against the saved params. Could be cached client-side
  // but doing it server-side guarantees consistency with the saved params.
  const filtered = hardFilter(body.params);
  const candidates = rankCandidates(filtered, body.params, 80);
  if (!candidates.length) {
    return new Response(
      JSON.stringify({ error: "no_candidates" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  // Build place_id → image_url lookup so we can attach images to each item
  // without an extra DB roundtrip per item.
  const { getDb } = await import("@/lib/db/client");
  const imgRows = getDb()
    .prepare(
      `SELECT id, image_url FROM places WHERE city = ? AND image_url IS NOT NULL`
    )
    .all(body.params.cities[0] ?? "shanghai") as { id: string; image_url: string }[];
  const imageById = new Map(imgRows.map((r) => [r.id, r.image_url]));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const day of streamItinerary(body.params, body.skeleton, candidates)) {
          // Inject image_url onto each item from our lookup.
          for (const it of day.items) {
            const img = imageById.get(it.place_id);
            if (img) (it as { image_url?: string }).image_url = img;
          }
          // NDJSON: one Day per line.
          controller.enqueue(encoder.encode(JSON.stringify(day) + "\n"));
        }
        controller.close();
      } catch (err) {
        console.error("[itinerary] stream error:", err);
        // Emit a final error line and close. UI should detect a non-Day shape.
        controller.enqueue(
          encoder.encode(
            JSON.stringify({ error: "generation_failed", message: (err as Error).message }) + "\n"
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
