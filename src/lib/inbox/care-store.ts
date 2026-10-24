import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import { InboxError } from "./types";
import type { CareEvent, CareRecord, CareStatus } from "./care-data";

// One row per reminder status ("status") or appointment the team added ("event").
// Local development keeps them on disk, so previews never write to the shared
// database. Production uses the inbox_care table.
const local = process.env.NODE_ENV === "development";
const directory = join(process.cwd(), "data/cache/inbox-care");
const COLUMNS = "peer_id,key,kind,status,date,time,title,detail,draft_id,updated_by,updated_at";
export const CARE_MIGRATION = "Saving reminders needs the inbox care database migration.";

export type CareRow = {
  peer_id: string;
  key: string;
  kind: "status" | "event";
  status: CareStatus;
  date: string;
  time: string;
  title: string;
  detail: string;
  draft_id: string | null;
  updated_by: string;
  updated_at: string;
};

function file(peer: string) {
  if (!/^\d+$/.test(peer)) throw new InboxError("Invalid conversation");
  return join(directory, `${peer}.json`);
}
async function readLocal(peer: string): Promise<CareRow[]> {
  try {
    return JSON.parse(await readFile(file(peer), "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}
async function writeLocal(peer: string, rows: CareRow[]) {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const target = file(peer),
    temp = `${target}.${randomUUID()}.tmp`;
  await writeFile(temp, JSON.stringify(rows), { mode: 0o600 });
  await rename(temp, target);
}

/** The saved rows, or null before the migration has run. */
export async function listCare(peer: string): Promise<CareRow[] | null> {
  if (local) return readLocal(peer);
  const { data, error } = await db().from("inbox_care").select(COLUMNS).eq("peer_id", peer).limit(500);
  return error ? null : (data as CareRow[]);
}
/** Every traveller's rows, for the conversation list's "Due tonight" count. */
export async function listAllCare(): Promise<CareRow[] | null> {
  if (local) return [];
  const { data, error } = await db().from("inbox_care").select(COLUMNS).limit(5000);
  return error ? null : (data as CareRow[]);
}

export function records(rows: CareRow[]): CareRecord[] {
  return rows.filter((r) => r.kind === "status");
}
export function events(rows: CareRow[]): CareEvent[] {
  return rows
    .filter((r) => r.kind === "event")
    .map((r) => ({ id: r.key, date: r.date, time: r.time, title: r.title, detail: r.detail }));
}

async function upsert(peer: string, row: Omit<CareRow, "peer_id" | "updated_at">) {
  const full: CareRow = { ...row, peer_id: peer, updated_at: new Date().toISOString() };
  if (local) {
    const rows = (await readLocal(peer)).filter((r) => r.key !== row.key);
    await writeLocal(peer, [...rows, full]);
    return;
  }
  const { error } = await db().from("inbox_care").upsert(full, { onConflict: "peer_id,key" });
  if (error) throw new InboxError(CARE_MIGRATION, 503);
}

export async function setStatus(peer: string, key: string, status: CareStatus, by: string, draftId: string | null = null) {
  await upsert(peer, { key, kind: "status", status, date: "", time: "", title: "", detail: "", draft_id: draftId, updated_by: by });
}
export async function addEvent(peer: string, event: Omit<CareEvent, "id">, by: string) {
  await upsert(peer, { key: `event:${randomUUID()}`, kind: "event", status: "todo", ...event, draft_id: null, updated_by: by });
}
export async function removeEvent(peer: string, key: string) {
  if (!key.startsWith("event:")) throw new InboxError("Invalid appointment.");
  if (local) return writeLocal(peer, (await readLocal(peer)).filter((r) => r.key !== key));
  const { error } = await db().from("inbox_care").delete().eq("peer_id", peer).eq("key", key);
  if (error) throw new InboxError(CARE_MIGRATION, 503);
}

/** A sent draft that was written for a reminder marks it sent. Never blocks the send. */
export async function markCareSent(peer: string, draftId: string, by: string) {
  try {
    const rows = await listCare(peer);
    for (const r of rows ?? [])
      if (r.kind === "status" && r.draft_id === draftId && r.status === "drafted") await setStatus(peer, r.key, "sent", by, draftId);
  } catch {
    console.error("[inbox-care] Could not mark the reminder as sent");
  }
}
