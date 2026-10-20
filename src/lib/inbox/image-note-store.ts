import "server-only";
import OpenAI from "openai";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import { mediaBytes } from "./graph";
import { describeImage, IMAGE_NOTE_VERSION } from "./image-notes";
import type { Message } from "./types";

type Note = { message_id: string; idx: number; note: string };
// Images described per request at most; older ones keep their saved notes or none.
const MAX_NEW = 24;
const local = process.env.NODE_ENV === "development";
const directory = join(process.cwd(), "data/cache/inbox-image-notes");

export const imageNotesEnabled = () => process.env.INBOX_IMAGE_NOTES !== "off";

/** Saved notes, or null when the notes table can't be read (e.g. before its migration). */
async function readNotes(peer: string): Promise<Note[] | null> {
  if (local) {
    try {
      return JSON.parse(await readFile(join(directory, `${peer.replace(/\D/g, "")}.json`), "utf8"));
    } catch {
      return [];
    }
  }
  const { data, error } = await db().from("inbox_image_notes").select("message_id,idx,note").eq("peer_id", peer);
  if (error) {
    console.error("[inbox-image-notes]", error.message);
    return null;
  }
  return data as Note[];
}
async function saveNotes(peer: string, notes: (Note & { model: string })[], existing: Note[]) {
  if (!notes.length) return;
  if (local) {
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const target = join(directory, `${peer.replace(/\D/g, "")}.json`),
      temp = `${target}.${randomUUID()}.tmp`;
    await writeFile(temp, JSON.stringify([...existing, ...notes]), { mode: 0o600 });
    await rename(temp, target);
    return;
  }
  const { error } = await db()
    .from("inbox_image_notes")
    .upsert(notes.map((n) => ({ ...n, peer_id: peer, version: IMAGE_NOTE_VERSION })));
  if (error) console.error("[inbox-image-notes]", error.message);
}

/**
 * The messages with a saved note on each image, describing images that have
 * none yet (newest first, up to MAX_NEW). A failed description only means
 * that image goes without a note; it never blocks the caller.
 */
export async function withImageNotes(peer: string, messages: Message[], client?: OpenAI): Promise<Message[]> {
  if (!imageNotesEnabled()) return messages;
  const existing = await readNotes(peer);
  // Without storage, notes would be paid for again on every request: skip them.
  if (!existing) return messages;
  const known = new Map(existing.map((n) => [`${n.message_id}:${n.idx}`, n.note]));
  const missing = messages
    .flatMap((m, k) =>
      m.deleted
        ? []
        : m.attachments.map((a, idx) => ({ m, k, idx, a })).filter(({ a, idx }) => a.type === "image" && a.url && !known.has(`${m.id}:${idx}`)),
    )
    .slice(-MAX_NEW);
  if (missing.length && client) {
    const added: (Note & { model: string })[] = [];
    const queue = [...missing];
    await Promise.all(
      Array.from({ length: 4 }, async () => {
        for (let job = queue.shift(); job; job = queue.shift()) {
          try {
            const { bytes, type } = await mediaBytes(job.a.url);
            const before = messages[job.k - 1];
            const result = await describeImage(client, {
              bytes,
              type,
              sender: job.m.direction === "inbound" ? "customer" : "team",
              caption: job.m.text || (before?.direction === job.m.direction ? before.text : ""),
            });
            added.push({ message_id: job.m.id, idx: job.idx, note: result.note, model: result.model });
            known.set(`${job.m.id}:${job.idx}`, result.note);
          } catch (e) {
            console.error("[inbox-image-notes] describe failed", (e as Error).message);
          }
        }
      }),
    );
    await saveNotes(peer, added, existing);
  }
  return messages.map((m) => ({
    ...m,
    attachments: m.attachments.map((a, idx) => {
      const note = known.get(`${m.id}:${idx}`);
      return note ? { ...a, note } : a;
    }),
  }));
}

/** Message text with image notes appended, for prompts that only read text. */
export const textWithNotes = (m: Message) =>
  [m.text, ...m.attachments.flatMap((a) => (a.note ? [`[${a.type}: ${a.note.replace(/\s+/g, " ")}]`] : []))]
    .filter(Boolean)
    .join(" ");
