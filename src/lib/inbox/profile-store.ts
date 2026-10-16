import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import { InboxError } from "./types";
import type { SavedProfile } from "./profile-data";

// Keep prototype profiles local until the inbox redesign is approved for publishing.
// Production uses the private Supabase table created by the accompanying migration.
const local = process.env.NODE_ENV === "development";
const directory = join(process.cwd(), "data/cache/inbox-profiles");
function file(peer: string) {
  if (!/^\d+$/.test(peer)) throw new InboxError("Invalid conversation");
  return join(directory, `${peer}.json`);
}
export async function readProfile(peer: string): Promise<SavedProfile | null> {
  if (local) {
    try {
      return JSON.parse(await readFile(file(peer), "utf8"));
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw e;
    }
  }
  const { data, error } = await db()
    .from("inbox_profiles")
    .select("profile,fingerprint,generated_at,coverage,model,usage")
    .eq("peer_id", peer)
    .maybeSingle();
  if (error)
    throw new InboxError(
      "Travel profiles need the inbox profile database migration before publishing.",
      503,
    );
  return data as SavedProfile | null;
}
export async function writeProfile(peer: string, saved: SavedProfile) {
  if (local) {
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const target = file(peer),
      temp = `${target}.${randomUUID()}.tmp`;
    await writeFile(temp, JSON.stringify(saved), { mode: 0o600 });
    await rename(temp, target);
    return;
  }
  const { error } = await db()
    .from("inbox_profiles")
    .upsert({ peer_id: peer, ...saved });
  if (error)
    throw new InboxError(
      "Could not save the travel profile. Please try again.",
      503,
    );
}
