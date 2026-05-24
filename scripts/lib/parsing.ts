// Pure helpers for stage 2 (normalize). No I/O, no DB.
import crypto from "node:crypto";

/** Generate a stable 12-char id from name + city. */
export function stableId(nameCn: string, city: string): string {
  return crypto.createHash("sha256").update(`${nameCn}|${city}`).digest("hex").slice(0, 12);
}

/** Lowercase ascii kebab-case slug, capped to 80 chars. */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

/**
 * Parse messy price prose into a single representative integer CNY.
 * Returns 0 for free, null if no signal.
 */
export function priceFromProse(s: string | undefined | null): number | null {
  if (s == null) return null;
  const text = String(s).trim();
  if (!text) return null;
  if (/\bfree\b|免费|0\s*$/i.test(text)) return 0;
  // Strip USD references so we don't mix currencies
  const cnyOnly = text.replace(/\$\s*\d+/g, "").replace(/usd/gi, "");
  const matches = cnyOnly.match(/\d+/g);
  if (!matches) return null;
  const nums = matches
    .map(Number)
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= 100_000);
  if (!nums.length) return null;
  // For ranges, take midpoint of lo/hi.
  nums.sort((a, b) => a - b);
  return Math.round((nums[0] + nums[nums.length - 1]) / 2);
}

/** Bucket integer CNY into a tier. Different scales for restaurants vs attractions. */
export function priceTierFromCNY(
  cny: number | null,
  category: "attraction" | "experience" | "restaurant"
): "free" | "budget" | "mid" | "premium" | "luxury" | null {
  if (cny == null) return null;
  if (cny === 0) return "free";
  if (category === "restaurant") {
    if (cny < 80) return "budget";
    if (cny < 200) return "mid";
    if (cny < 500) return "premium";
    return "luxury";
  }
  // attractions / experiences (entry tickets)
  if (cny < 50) return "budget";
  if (cny < 150) return "mid";
  if (cny < 400) return "premium";
  return "luxury";
}

/**
 * Convert a `time_needed.recommended` string to integer minutes.
 * Examples: "2-3 hours" -> 150, "Half day" -> 300, "30-60 minutes" -> 45.
 */
export function timeNeededMin(timeNeededObj: any): number | null {
  const text = String(timeNeededObj?.recommended ?? "").trim();
  if (!text) return null;
  const lower = text.toLowerCase();
  if (/full\s*day|all\s*day|10[-\s]?12\s*hour|12\s*hour|day[-\s]?long/.test(lower)) return 600;
  if (/half\s*day|half-day|5[-\s]?6\s*hour/.test(lower)) return 300;

  const hourMatch = text.match(/(\d+)(?:\s*[-–]\s*(\d+))?\s*hour/i);
  if (hourMatch) {
    const lo = Number(hourMatch[1]);
    const hi = hourMatch[2] ? Number(hourMatch[2]) : lo;
    return Math.round(((lo + hi) / 2) * 60);
  }

  const minMatch = text.match(/(\d+)(?:\s*[-–]\s*(\d+))?\s*min/i);
  if (minMatch) {
    const lo = Number(minMatch[1]);
    const hi = minMatch[2] ? Number(minMatch[2]) : lo;
    return Math.round((lo + hi) / 2);
  }
  return null;
}
