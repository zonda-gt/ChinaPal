import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import { InboxError } from "./types";
import type { SavedBrief } from "./brief-data";

// Local development keeps briefs on disk, so previews never write to the shared
// database. Production uses the inbox_briefs table from the accompanying migration.
const local = process.env.NODE_ENV === "development";
const directory = join(process.cwd(), "data/cache/inbox-briefs");
const EMPTY: SavedBrief = {
  brief: null,
  edits: [],
  model: null,
  usage: null,
  fingerprint: null,
  generated_at: null,
  coverage: null,
};
function file(peer: string) {
  if (!/^\d+$/.test(peer)) throw new InboxError("Invalid conversation");
  return join(directory, `${peer}.json`);
}
export async function readBrief(peer: string): Promise<SavedBrief> {
  if (local) {
    try {
      return { ...EMPTY, ...JSON.parse(await readFile(file(peer), "utf8")) };
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return EMPTY;
      throw e;
    }
  }
  const { data, error } = await db()
    .from("inbox_briefs")
    .select("brief,edits,model,usage,fingerprint,generated_at,coverage")
    .eq("peer_id", peer)
    .maybeSingle();
  if (error) throw new InboxError("Trip briefs need the inbox brief database migration.", 503);
  return data ? { ...EMPTY, ...(data as SavedBrief) } : EMPTY;
}
export async function writeBrief(peer: string, saved: SavedBrief) {
  if (local) {
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const target = file(peer),
      temp = `${target}.${randomUUID()}.tmp`;
    await writeFile(temp, JSON.stringify(saved), { mode: 0o600 });
    await rename(temp, target);
    return;
  }
  const { error } = await db()
    .from("inbox_briefs")
    .upsert({ peer_id: peer, ...saved, updated_at: new Date().toISOString() });
  if (error) throw new InboxError("Could not save the trip brief. Please try again.", 503);
}
