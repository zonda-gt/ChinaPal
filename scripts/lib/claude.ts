// Anthropic SDK client + helpers shared by Pipeline A scripts.
// Defaults to Opus 4.7. Adaptive thinking + effort=medium are good defaults
// for tagging/summarization workloads — adjust per call site if needed.
import Anthropic from "@anthropic-ai/sdk";
import { requireEnv } from "./env";

let _client: Anthropic | null = null;

export function getClient(): Anthropic {
  if (_client) return _client;
  _client = new Anthropic({ apiKey: requireEnv("ANTHROPIC_API_KEY") });
  return _client;
}

// User chose Sonnet 4.6 as the default for all live Pipeline B calls.
// Cheaper than Opus 4.7 ($3/$15 vs $5/$25 per 1M) and plenty smart for
// skeleton + itinerary composition.
export const DEFAULT_MODEL = "claude-sonnet-4-6";

/**
 * Extract the first text block from a Claude response.
 * Returns "" if no text block was produced (unusual but possible).
 */
export function firstText(message: Anthropic.Message): string {
  for (const block of message.content) {
    if (block.type === "text") return block.text;
  }
  return "";
}

/**
 * Parse a JSON object out of a Claude response. Tolerates surrounding prose
 * (e.g. "Here you go: {...}") by extracting the first {...} substring.
 * Throws with the raw text if parsing fails.
 */
export function parseJSONResponse<T = unknown>(text: string): T {
  const trimmed = text.trim();
  // Try direct parse first
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // Fall through
  }
  // Extract first JSON object
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`No JSON object found in response: ${trimmed.slice(0, 200)}`);
  }
  const slice = trimmed.slice(start, end + 1);
  try {
    return JSON.parse(slice) as T;
  } catch (e) {
    throw new Error(
      `JSON parse failed: ${(e as Error).message}\nText: ${slice.slice(0, 400)}`
    );
  }
}

/**
 * Sleep helper for rate-limit backoff.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
