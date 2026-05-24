import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import path from "node:path";
import fs from "node:fs";

// Resolve relative to the project root, regardless of where the process runs.
const DB_PATH = path.join(process.cwd(), "data", "db", "places.sqlite");

let _db: Database.Database | null = null;

/**
 * Returns a singleton better-sqlite3 connection with sqlite-vec loaded.
 * Use this for both Pipeline A scripts and Pipeline B API routes.
 *
 * The DB lives at /data/db/places.sqlite (gitignored). It's created on first
 * call; running migrations is the caller's responsibility (see schema.ts).
 */
export function getDb(): Database.Database {
  if (_db) return _db;
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  sqliteVec.load(db);
  _db = db;
  return db;
}

/** Close the singleton. Useful for scripts that want to flush WAL on exit. */
export function closeDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}
