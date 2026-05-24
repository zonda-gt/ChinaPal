// Anthropic SDK client for Pipeline B (live request flow).
// Mirrors scripts/lib/claude.ts but lives under src/ for Next.js to bundle.
import "server-only";
import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export function getClaudeClient(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env (see .env.example)."
    );
  }
  _client = new Anthropic({ apiKey });
  return _client;
}

/** Sonnet 4.6 — used for skeleton, itinerary, and refine. */
export const PLANNER_MODEL = "claude-sonnet-4-6";

/** Extract the first text block from a response. */
export function firstText(message: Anthropic.Message): string {
  for (const block of message.content) {
    if (block.type === "text") return block.text;
  }
  return "";
}

/**
 * Parse a JSON object out of a possibly-prose response.
 * Tolerates markdown fences (```json ... ```), surrounding prose,
 * trailing content after the JSON, and partial truncation.
 */
export function parseJSONResponse<T = unknown>(text: string): T {
  let s = text.trim();

  // 1) Strip markdown code fences if present.
  const fenceMatch = s.match(/^```(?:json|JSON)?\s*\n([\s\S]*?)\n```\s*$/);
  if (fenceMatch) s = fenceMatch[1].trim();

  // 2) Direct parse.
  try {
    return JSON.parse(s) as T;
  } catch { /* fall through */ }

  // 3) Find the FIRST balanced top-level JSON object.
  //    Walk character-by-character tracking string state + brace depth.
  const start = s.indexOf("{");
  if (start === -1) {
    throw new Error(`No JSON object in response: ${text.slice(0, 200)}`);
  }
  let depth = 0;
  let inStr = false;
  let escape = false;
  let end = -1;
  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (escape) { escape = false; continue; }
      if (ch === "\\") { escape = true; continue; }
      if (ch === '"') { inStr = false; continue; }
    } else {
      if (ch === '"') { inStr = true; continue; }
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }
  }
  if (end === -1) {
    throw new Error(
      `Unbalanced braces in response (depth ${depth}): ${s.slice(start, start + 400)}`
    );
  }
  try {
    return JSON.parse(s.slice(start, end + 1)) as T;
  } catch (e) {
    throw new Error(
      `JSON parse failed: ${(e as Error).message}\n${s.slice(start, start + 400)}`
    );
  }
}
