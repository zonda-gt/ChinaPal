import type Database from "better-sqlite3";

/**
 * Schema for the place catalog and planner caches.
 *
 * Pipeline A writes to `places`, `places_vec`, `travel_times`.
 * Pipeline B reads from them.
 *
 * All Pipeline A AI fields are nullable so each stage can run independently.
 */
export const SCHEMA_SQL = `
-- ── PLACES ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS places (
  -- Identity
  id              TEXT PRIMARY KEY,         -- sha256(name_cn + city)[:12]
  slug            TEXT UNIQUE NOT NULL,
  city            TEXT NOT NULL,            -- 'shanghai' | 'beijing' | ...
  category        TEXT NOT NULL,            -- 'attraction' | 'experience' | 'restaurant'
  name_cn         TEXT NOT NULL,
  name_en         TEXT,

  -- Location (filled by stage 6 — geocode)
  address_cn      TEXT,
  neighborhood_cn TEXT,
  neighborhood_en TEXT,
  district        TEXT,
  lat             REAL,
  lng             REAL,
  nearest_metro   TEXT,                     -- "Line 2 · East Nanjing Rd · 4 min walk"

  -- Pricing (parsed from prose during stage 2 — normalize)
  price_cny       INTEGER,                  -- typical adult walk-up price; NULL = free
  price_tier      TEXT,                     -- 'free' | 'budget' | 'mid' | 'premium' | 'luxury'

  -- Cuisine (restaurants only) — useful as a hard filter
  cuisine_type    TEXT,                     -- 'Chinese' | 'Japanese' | 'Western' | etc.
  cuisine_subtype TEXT,                     -- 'Sichuan Hot Pot' | 'Cantonese' | etc.

  -- Time + hours
  time_needed_min INTEGER,                  -- recommended duration in minutes
  opening_hours_raw TEXT,                   -- prose, kept for reference

  -- Human-facing fields (carried from source JSON)
  hook            TEXT,
  honest_description TEXT,
  vibe            TEXT,
  best_for        TEXT,                     -- JSON array as TEXT
  pair_with       TEXT,                     -- JSON array of {id|slug, why, travel_min}

  -- AI-enriched fields (filled by stage 3 — enrich)
  kid_suitability TEXT,                     -- JSON array of bands
  mobility        TEXT,                     -- 'easy'|'moderate'|'hard'
  indoor_outdoor  TEXT,                     -- 'indoor'|'outdoor'|'mixed'
  weather_resilience TEXT,                  -- 'low'|'medium'|'high'
  energy_intensity   TEXT,                  -- 'low'|'medium'|'high'
  foreigner_friction_score INTEGER,         -- 1-5
  best_time_of_day TEXT,                    -- JSON array of slots
  dietary_flags    TEXT,                    -- JSON {halal_ok, veg_ok, vegan_ok, pork_free, ...}
  narrative_role   TEXT,                    -- 'iconic'|'hidden_gem'|'day_filler'|'highlight'|'wildcard'
  interest_tags    TEXT,                    -- JSON array from closed vocabulary

  -- AI summary (stage 4) — the text fed to planner LLM at request time
  ai_summary       TEXT,

  -- Quality control
  quality_flags    TEXT,                    -- JSON array of issue codes if any
  source_path      TEXT NOT NULL,           -- path to canonical source JSON
  raw_payload      TEXT,                    -- the full source JSON, stringified
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_places_city          ON places(city);
CREATE INDEX IF NOT EXISTS idx_places_category      ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_price_tier    ON places(price_tier);

-- ── EMBEDDINGS (sqlite-vec) ────────────────────────────────────────────────
-- Voyage voyage-3-large = 1024 dims. Adjust if embedding model changes.
CREATE VIRTUAL TABLE IF NOT EXISTS places_vec USING vec0(
  embedding FLOAT[1024]
);
-- We map the integer rowid in places_vec to the place id via this table.
CREATE TABLE IF NOT EXISTS places_vec_map (
  rowid           INTEGER PRIMARY KEY,
  place_id        TEXT NOT NULL UNIQUE,
  FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
);

-- ── TRAVEL TIMES (intra-city, pairwise) ────────────────────────────────────
-- Stored as both directions for fast lookup. Built by stage 6.
CREATE TABLE IF NOT EXISTS travel_times (
  from_id         TEXT NOT NULL,
  to_id           TEXT NOT NULL,
  minutes         INTEGER NOT NULL,         -- typical urban transit minutes
  mode            TEXT NOT NULL DEFAULT 'transit',  -- 'transit' | 'taxi' | 'walk'
  PRIMARY KEY (from_id, to_id, mode),
  FOREIGN KEY (from_id) REFERENCES places(id) ON DELETE CASCADE,
  FOREIGN KEY (to_id)   REFERENCES places(id) ON DELETE CASCADE
);
`;

/** Run idempotent migration. Safe to call on every script start. */
export function migrate(db: Database.Database): void {
  db.exec(SCHEMA_SQL);
}
