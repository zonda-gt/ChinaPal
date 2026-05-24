// Pipeline A · Stage 4b — Copy a hero image per place into /public/places/
// and store the URL in places.image_url.
//
// Image source per category:
//  attractions/<name>/image/highlight_image/*.{jpg,png}  (preferred)
//                     /image/ctrip_image/*.jpg            (fallback)
//  experiences/<name>/photos/highlight-*.jpg              (preferred)
//                    /photos/review_*.jpeg                (fallback)
//  restaurant_bar/<name>/selected_photos/<top-of-photo_ranking.json>
import "../lib/env";
import fs from "node:fs";
import path from "node:path";
import { getDb, closeDb } from "../../src/lib/db/client";

const PUBLIC_DIR = path.join(process.cwd(), "public", "places");
fs.mkdirSync(PUBLIC_DIR, { recursive: true });

const db = getDb();

// Add column if missing.
try {
  db.exec("ALTER TABLE places ADD COLUMN image_url TEXT");
  console.log("Added places.image_url column");
} catch {
  // Column already exists.
}

const IMG_EXT = /\.(jpe?g|png|webp)$/i;

interface Row {
  id: string;
  category: "attraction" | "experience" | "restaurant" | string;
  name_cn: string;
  source_path: string;
}

function placeBaseDir(sourcePath: string): string {
  // attractions/<name>/chinapal_processed.json   → <name>/
  // experiences/<name>/processed/profile.json    → <name>/
  // restaurant_bar/<name>/processed/profile_v2.json → <name>/
  const dir = path.dirname(sourcePath);
  return dir.endsWith("/processed") ? path.dirname(dir) : dir;
}

function listImages(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => IMG_EXT.test(f));
}

function pickImageFor(p: Row): string | null {
  const base = placeBaseDir(p.source_path);

  if (p.category === "attraction") {
    const highlight = path.join(base, "image", "highlight_image");
    const hl = listImages(highlight);
    if (hl.length) return path.join(highlight, hl[0]);
    const ctrip = path.join(base, "image", "ctrip_image");
    const ct = listImages(ctrip);
    if (ct.length) return path.join(ctrip, ct[0]);
    return null;
  }

  if (p.category === "experience") {
    const photos = path.join(base, "photos");
    const all = listImages(photos);
    if (!all.length) return null;
    const highlights = all.filter((f) => f.startsWith("highlight-"));
    return path.join(photos, highlights[0] || all[0]);
  }

  if (p.category === "restaurant") {
    const photos = path.join(base, "selected_photos");
    const ranking = path.join(base, "processed", "photo_ranking.json");
    if (fs.existsSync(ranking) && fs.existsSync(photos)) {
      try {
        const list = JSON.parse(fs.readFileSync(ranking, "utf8")) as string[];
        for (const fname of list) {
          const full = path.join(photos, fname);
          if (fs.existsSync(full)) return full;
        }
      } catch (e) {
        console.warn(`  ! ranking parse failed for ${p.name_cn}: ${(e as Error).message}`);
      }
    }
    const fallback = listImages(photos);
    if (fallback.length) return path.join(photos, fallback[0]);
    return null;
  }

  return null;
}

const places = db
  .prepare(
    "SELECT id, category, name_cn, source_path FROM places WHERE city = ? ORDER BY category, name_cn"
  )
  .all("shanghai") as Row[];

const update = db.prepare("UPDATE places SET image_url = ? WHERE id = ?");

let copied = 0;
let missing = 0;
const missList: string[] = [];

for (const p of places) {
  const src = pickImageFor(p);
  if (!src) {
    missing++;
    missList.push(`${p.category.padEnd(12)} ${p.name_cn}`);
    continue;
  }
  const ext = path.extname(src).toLowerCase();
  // Normalize jpeg → jpg for consistency.
  const cleanExt = ext === ".jpeg" ? ".jpg" : ext;
  const dest = path.join(PUBLIC_DIR, `${p.id}${cleanExt}`);
  fs.copyFileSync(src, dest);
  update.run(`/places/${p.id}${cleanExt}`, p.id);
  copied++;
}

console.log(`\n── Image copy results ─────────────────────────`);
console.log(`  copied:   ${copied} / ${places.length}`);
console.log(`  missing:  ${missing}`);
if (missList.length) {
  console.log(`  details:`);
  for (const m of missList) console.log(`    • ${m}`);
}

// Coverage by category
const cov = db
  .prepare(
    `SELECT category,
            count(*) as total,
            sum(CASE WHEN image_url IS NOT NULL THEN 1 ELSE 0 END) as imaged
     FROM places WHERE city = ? GROUP BY category`
  )
  .all("shanghai") as { category: string; total: number; imaged: number }[];
console.log(`\nCoverage:`);
for (const c of cov) {
  console.log(`  ${c.category.padEnd(12)} ${c.imaged}/${c.total}`);
}

closeDb();
