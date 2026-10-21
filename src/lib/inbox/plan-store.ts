import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import { InboxError } from "./types";
import { EMPTY_PLAN, type SavedPlan } from "./plan-data";

// Local development keeps plans on disk, so previews never write to the shared
// database. Production uses the inbox_plans table.
const local = process.env.NODE_ENV === "development";
const directory = join(process.cwd(), "data/cache/inbox-plans");
const MIGRATION = "Trip plans need the inbox plans and questions database migration.";

function file(peer: string) {
  if (!/^\d+$/.test(peer)) throw new InboxError("Invalid conversation");
  return join(directory, `${peer}.json`);
}
export async function readPlan(peer: string): Promise<SavedPlan> {
  if (local) {
    try {
      return { ...EMPTY_PLAN, ...JSON.parse(await readFile(file(peer), "utf8")) };
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return EMPTY_PLAN;
      throw e;
    }
  }
  const { data, error } = await db()
    .from("inbox_plans")
    .select("plan,status,job,instruction,error,model,usage,started_by,started_at,generated_at")
    .eq("peer_id", peer)
    .maybeSingle();
  if (error) throw new InboxError(MIGRATION, 503);
  return data ? { ...EMPTY_PLAN, ...(data as SavedPlan) } : EMPTY_PLAN;
}
export async function writePlan(peer: string, saved: SavedPlan) {
  if (local) {
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const target = file(peer),
      temp = `${target}.${randomUUID()}.tmp`;
    await writeFile(temp, JSON.stringify(saved), { mode: 0o600 });
    await rename(temp, target);
    return;
  }
  const { error } = await db()
    .from("inbox_plans")
    .upsert({ peer_id: peer, ...saved, updated_at: new Date().toISOString() });
  if (error) throw new InboxError("Could not save the trip plan. Please try again.", 503);
}
