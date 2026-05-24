// One-shot migration runner: `npm run db:init`
// Creates /data/db/places.sqlite if missing and runs migrations.
import "./env";
import { getDb, closeDb } from "../../src/lib/db/client";
import { migrate } from "../../src/lib/db/schema";

const db = getDb();
migrate(db);

const tables = db
  .prepare(
    "SELECT name FROM sqlite_master WHERE type IN ('table','virtual') ORDER BY name"
  )
  .all() as { name: string }[];

console.log("✓ DB ready at data/db/places.sqlite");
console.log("Tables:", tables.map((t) => t.name).join(", "));

closeDb();
