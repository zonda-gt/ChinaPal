// Load .env early in any script. Import this once at the top of any ingest script.
import "dotenv/config";

export const ENV = {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ?? "",
  VOYAGE_API_KEY: process.env.VOYAGE_API_KEY ?? "",
  AMAP_API_KEY: process.env.AMAP_API_KEY ?? "",
};

export function requireEnv(key: keyof typeof ENV): string {
  const v = ENV[key];
  if (!v) {
    throw new Error(
      `Missing ${key}. Add it to .env (see .env.example) before running this script.`
    );
  }
  return v;
}
