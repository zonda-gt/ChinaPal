// Save the cover of a public Instagram reel or post for an itinerary card.
//
//   npm run instagram:cover -- https://www.instagram.com/p/DSc5O2Xka5l/
//
// Instagram's image links expire, so the cover is stored with our other
// photos, in public/uploads/itinerary/instagram/<code>.webp, and its credit
// in src/data/instagram-covers.json. Prints the `instagram` value for the card.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const url = process.argv[2];
const match = url?.match(/instagram\.com\/(?:[\w.]+\/)?(reels?|p|tv)\/([\w-]+)/);
if (!match) {
  console.error("Usage: npm run instagram:cover -- <Instagram reel or post link>");
  process.exit(1);
}
const kind = match[1] === "p" ? "p" : "reel";
const code = match[2];
const permalink = `https://www.instagram.com/${kind}/${code}/`;

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#064;/g, "@").replace(/&quot;/g, '"');
const page = await fetch(`${permalink}embed/captioned/`, { headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)" } });
if (!page.ok) throw new Error(`Instagram answered ${page.status}. Is the post public?`);
const html = await page.text();
const img = html.match(/<img[^>]+class="EmbeddedMediaImage"[^>]*src="([^"]+)"/)?.[1];
const handle = html.match(/class="UsernameText"[^>]*>([^<]+)</)?.[1];
if (!img) throw new Error("No cover found: the post may be private or not allow embedding.");

const image = await fetch(decode(img));
if (!image.ok) throw new Error(`Could not download the cover (${image.status}).`);
const dir = path.join(process.cwd(), "public/uploads/itinerary/instagram");
fs.mkdirSync(dir, { recursive: true });
await sharp(Buffer.from(await image.arrayBuffer())).resize({ width: 540, withoutEnlargement: true }).webp({ quality: 74 }).toFile(path.join(dir, `${code}.webp`));

const cover = `/uploads/itinerary/instagram/${code}.webp`;
const creditsFile = path.join(process.cwd(), "src/data/instagram-covers.json");
const credits = fs.existsSync(creditsFile) ? JSON.parse(fs.readFileSync(creditsFile, "utf8")) : [];
const credit = { code, permalink, handle: handle ?? null, cover, savedOn: new Date().toISOString().slice(0, 10) };
fs.writeFileSync(creditsFile, `${JSON.stringify([...credits.filter((c) => c.code !== code), credit], null, 2)}\n`);

console.log(`instagram: { url: "${permalink}", handle: "${handle ?? ""}", cover: "${cover}" }`);
