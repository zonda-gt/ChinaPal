import "server-only";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import { InboxError, type Staff } from "./types";
import { applyEdits, type BriefEdit, type TripBrief } from "./brief-data";
import type { PlanCore } from "./plan-data";
import { readBrief } from "./brief-store";
import { readPlan } from "./plan-store";
import { careDays, isDue, keyInfo, reminders, tripStage, type CareStatus, type CareView } from "./care-data";
import { addEvent, events, listAllCare, listCare, records, removeEvent, setStatus, type CareRow } from "./care-store";

const STATUSES: CareStatus[] = ["todo", "drafted", "sent", "skipped"];
const local = process.env.NODE_ENV === "development";

function view(plan: PlanCore | null, brief: TripBrief | null, rows: CareRow[] | null): CareView {
  const added = events(rows ?? []);
  const days = careDays(plan, brief, added);
  return {
    days,
    reminders: reminders(days, records(rows ?? [])),
    trip: tripStage(days),
    info: keyInfo(days),
    events: added,
    saved: rows !== null,
  };
}

export async function getCare(peer: string): Promise<CareView> {
  const [plan, brief, rows] = await Promise.all([
    readPlan(peer).catch(() => null),
    readBrief(peer).catch(() => null),
    listCare(peer),
  ]);
  return view(
    plan?.plan?.days.length ? plan.plan : null,
    brief?.brief ? applyEdits(brief.brief, brief.edits) : null,
    rows,
  );
}

/** Set a reminder's status, or add or remove an appointment. */
export async function changeCare(peer: string, staff: Staff, body: Record<string, unknown>) {
  const text = (value: unknown, max: number) => {
    if (typeof value !== "string" || value.length > max) throw new InboxError("Invalid reminder.");
    return value.trim();
  };
  const by = staff.name || staff.email;
  if (body.action === "status") {
    const status = text(body.status, 20) as CareStatus;
    if (!STATUSES.includes(status)) throw new InboxError("Invalid reminder status.");
    const key = text(body.key, 100);
    if (!(await getCare(peer)).reminders.some((r) => r.key === key)) throw new InboxError("Reminder not found.", 404);
    await setStatus(peer, key, status, by, body.draftId ? text(body.draftId, 50) : null);
  } else if (body.action === "add") {
    const date = text(body.date, 10),
      time = text(body.time, 5),
      title = text(body.title, 120);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new InboxError("Pick the date.");
    if (time && !/^\d{2}:\d{2}$/.test(time)) throw new InboxError("Invalid time.");
    if (!title) throw new InboxError("Say what the appointment is.");
    await addEvent(peer, { date, time, title, detail: text(body.detail ?? "", 600) }, by);
  } else if (body.action === "remove") {
    await removeEvent(peer, text(body.key, 100));
  } else throw new InboxError("Invalid reminder change.");
  return getCare(peer);
}

type PlanRow = { peer_id: string; plan: PlanCore | null };
type BriefRow = { peer_id: string; brief: TripBrief | null; edits: BriefEdit[] | null };

async function localRows<T>(folder: string, read: (peer: string) => Promise<T>) {
  const names = await readdir(join(process.cwd(), "data/cache", folder)).catch(() => [] as string[]);
  const peers = names.filter((n) => /^\d+\.json$/.test(n)).map((n) => n.slice(0, -5));
  return Promise.all(peers.map(async (peer_id) => ({ peer_id, ...(await read(peer_id)) })));
}

/** How many reminders are waiting tonight, per traveller. */
export async function dueCounts(): Promise<Record<string, number>> {
  const [plans, briefs, rows] = await Promise.all([
    local
      ? localRows("inbox-plans", async (p) => ({ plan: (await readPlan(p)).plan }))
      : db().from("inbox_plans").select("peer_id,plan").not("plan", "is", null).limit(500).then((r) => (r.data ?? []) as PlanRow[]),
    local
      ? localRows("inbox-briefs", async (p) => readBrief(p))
      : db().from("inbox_briefs").select("peer_id,brief,edits").limit(500).then((r) => (r.data ?? []) as BriefRow[]),
    listAllCare(),
  ]);
  const byPeer = new Map<string, CareRow[]>();
  for (const r of rows ?? []) byPeer.set(r.peer_id, [...(byPeer.get(r.peer_id) ?? []), r]);
  const planOf = new Map(plans.filter((p) => p.plan?.days?.length).map((p) => [p.peer_id, p.plan as PlanCore]));
  const briefOf = new Map(briefs.filter((b) => b.brief).map((b) => [b.peer_id, applyEdits(b.brief as TripBrief, b.edits ?? [])]));
  const counts: Record<string, number> = {};
  for (const peer of new Set([...planOf.keys(), ...briefOf.keys(), ...byPeer.keys()])) {
    const due = view(planOf.get(peer) ?? null, briefOf.get(peer) ?? null, byPeer.get(peer) ?? []).reminders.filter((r) => isDue(r)).length;
    if (due) counts[peer] = due;
  }
  return counts;
}
