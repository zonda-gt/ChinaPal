// POST /api/landing-chat
// Live AI chat for the Google Ads landing page (/landing-chat).
// Model: Claude Haiku 4.5 — fast, cheap, fine for short helpful answers.
// The key never reaches the client; this runs server-side only.
//
// Conversion guardrail: the client shows the $39 handoff after a fixed number
// of free replies (FREE_LIMIT in the page). This route ALSO enforces a hard
// server cap (MAX_USER_MSGS) as defense-in-depth so the endpoint can't be
// used as a free unlimited China-travel bot.
import { NextResponse, type NextRequest } from "next/server";
import { getClaudeClient, firstText } from "@/lib/planner/claude";

export const runtime = "nodejs";

// Sonnet 4.6 primary — it follows the terse "max 8 words per item" formatting
// far better than Haiku (which ignored the length cap). Cost per short reply is
// still tiny. Falls back to Haiku if Sonnet is overloaded/rate-limited.
const MODEL = "claude-sonnet-4-6";
const FALLBACK_MODEL = "claude-haiku-4-5";
const MAX_USER_MSGS = 4; // hard server cap (client wall fires earlier)
const MAX_CHARS = 600; // per-message input clamp
const MAX_HISTORY = 8; // only the last N turns are sent to the model

const SYSTEM = `You are ChinaPal's trip-planning assistant, embedded on a landing page. You give free, genuinely useful advice for travel ANYWHERE in China (any city or region — Beijing, Chengdu, Yunnan, Tibet, Xinjiang, etc.).

You ALWAYS reply as a JSON object with three fields: "reply", "days", "closing".
- "reply": a short, warm intro or answer — 1 to 2 sentences, plain text. Always filled.
- "days": a day-by-day plan, ONLY when the user wants a multi-day itinerary. Each day = { "city" (the city that day is in, e.g. "Chengdu"), "label" ("Day 1"), "title" (2-4 word theme, e.g. "Pandas + Old Town"), "items" (3-4 SHORT scannable lines) }. For a single question that is NOT an itinerary, set "days" to [].
- "closing": one short local tip OR a follow-up question to keep them going — or "" if none.

ITEM STYLE — the single most important rule. Each item is a TERSE phrase, NOT a sentence. HARD LIMIT: 8 words maximum per item — count them and cut. Use "·" to separate the place/action from ONE key detail. Never start an item with "Morning/Afternoon/Evening/Day" — lead with the place or action. No rationale, no "since/because/so" clauses, no explanations.
GOOD: "Forbidden City · arrive 8:30am, skip gift shops"
GOOD: "Great Wall at Mutianyu · 7am, fewer crowds"
GOOD: "Lunch in Drum Tower alleys · jianbing, noodles"
GOOD: "Houhai lake hutong walk at dusk"
BAD (too long): "Afternoon: People's Park — watch the old-timer tea drinkers and grab some street snacks while you wander."
BAD (full sentence): "Head to the Forbidden City, arrive by 8:30am, and go straight to the back half since it has fewer crowds."

Content rules:
- Be specific and local: name neighbourhoods, areas, timing, what to skip. Sound like a local friend, not a brochure.
- NEVER invent exact business names, prices, train numbers, addresses, or opening hours. If unsure, use principles ("the old town", "one street back from the main drag", "right after opening") instead of fake specifics.
- You handle PLANNING and RECOMMENDATIONS only — that's free. You CANNOT book, reserve, call ahead, or translate live on the ground; if asked, say plainly that this is what the human ChinaPal team does on the trip (the paid service), and still answer the planning side.
- No emoji spam, no corporate filler. Never say you are an AI or mention any model. Stay on China travel.`;

// Structured-output schema — the model returns this shape so the page can render
// a clean day-by-day card instead of a wall of prose.
const REPLY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    reply: {
      type: "string",
      description: "Short warm intro/answer, 1-2 sentences. Always filled.",
    },
    days: {
      type: "array",
      description:
        "Day-by-day plan; empty [] when the question is not a multi-day itinerary.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          city: {
            type: "string",
            description: "City this day is in (for section headers).",
          },
          label: { type: "string", description: "e.g. Day 1" },
          title: { type: "string", description: "2-4 word day theme" },
          items: {
            type: "array",
            description: "3-4 terse scannable lines, 4-8 words each",
            items: { type: "string" },
          },
        },
        required: ["city", "label", "title", "items"],
      },
    },
    closing: {
      type: "string",
      description: "One short tip or follow-up question, or empty string.",
    },
  },
  required: ["reply", "days", "closing"],
} as const;

type Msg = { role: "user" | "assistant"; content: string };

const HANDOFF_REPLY =
  "Happy to keep going — but the most useful thing now is a real local for the whole trip, who can actually reserve, translate and fix things while you're there. That's $39 flat. ↓";

export async function POST(req: NextRequest) {
  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const raw = Array.isArray(body.messages) ? body.messages : [];
  const clean: Msg[] = raw
    .filter(
      (m): m is Msg =>
        !!m &&
        typeof m === "object" &&
        ((m as Msg).role === "user" || (m as Msg).role === "assistant") &&
        typeof (m as Msg).content === "string" &&
        (m as Msg).content.trim().length > 0,
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (!clean.length || clean[clean.length - 1].role !== "user") {
    return NextResponse.json({ error: "no_user_message" }, { status: 400 });
  }

  // Hard cap: count user turns on the FULL history (before trimming), so a long
  // history can't slip past the cap. Past the free allowance, return the handoff
  // instead of calling the model.
  const userCount = clean.filter((m) => m.role === "user").length;
  if (userCount > MAX_USER_MSGS) {
    return NextResponse.json({ reply: HANDOFF_REPLY, limit: true });
  }

  // Only the last N turns are actually sent to the model (context + cost control).
  const messages = clean.slice(-MAX_HISTORY);

  const client = getClaudeClient();
  const send = (model: string, opts?: { maxRetries?: number }) =>
    client.messages.create(
      {
        model,
        max_tokens: 900, // room for a multi-day JSON itinerary
        // cache_control is forward-compatible: Haiku's min cacheable prefix is
        // ~4096 tokens, so this short system prompt won't cache yet (no error),
        // but the breakpoint is correctly placed if the prompt grows.
        system: [
          { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
        ],
        messages,
        output_config: { format: { type: "json_schema", schema: REPLY_SCHEMA } },
      },
      opts,
    );

  try {
    let message;
    try {
      // Primary: Haiku. maxRetries:1 so we fail fast to the fallback rather
      // than burning ~30s on the SDK's default retry/backoff when overloaded.
      message = await send(MODEL, { maxRetries: 1 });
    } catch (err) {
      const status = (err as { status?: number } | null)?.status;
      if (status && [429, 500, 503, 529].includes(status)) {
        // Haiku overloaded/rate-limited → fall back to Sonnet for this request.
        message = await send(FALLBACK_MODEL);
      } else {
        throw err;
      }
    }
    // Structured output → parse the JSON the model returned. Fall back to
    // treating the whole text as a plain reply if parsing ever fails.
    const text = firstText(message).trim();
    let parsed: { reply?: unknown; days?: unknown; closing?: unknown };
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { reply: text, days: [], closing: "" };
    }
    return NextResponse.json({
      reply: typeof parsed.reply === "string" ? parsed.reply : text,
      days: Array.isArray(parsed.days) ? parsed.days : [],
      closing: typeof parsed.closing === "string" ? parsed.closing : "",
    });
  } catch (err) {
    console.error("[landing-chat] generation failed:", err);
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}
