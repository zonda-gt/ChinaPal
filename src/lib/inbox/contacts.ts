import "server-only";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import { graph } from "./graph";
import { conversation } from "./service";
import { safeMediaUrl } from "./policy";
import type { ContactIdentity } from "./types";

// Short-lived CDN URLs and names are refreshed independently of message history.
// This bounded process cache also coalesces lookups from multiple staff tabs.
const cached = new Map<string, ContactIdentity>();
const pending = new Map<string, Promise<ContactIdentity>>();
export async function contactIdentity(peer: string): Promise<ContactIdentity> {
  const saved = cached.get(peer);
  if (saved && saved.refresh_at > Date.now()) return saved;
  const running = pending.get(peer);
  if (running) return running;
  const lookup = (async () => {
    const contact = await conversation(peer);
    let result: ContactIdentity = {
      peer_id: peer,
      username: contact.username,
      name: saved?.name ?? contact.name ?? null,
      picture: null,
      refresh_at: Date.now() + 5 * 60_000,
    };
    try {
      const profile = await graph<{
        username?: string; name?: string; profile_pic?: string;
      }>(peer, { fields: "name,username,profile_pic" });
      result = {
        peer_id: peer,
        username: profile.username || contact.username,
        name: profile.name || contact.name || null,
        picture: safeMediaUrl(profile.profile_pic),
        refresh_at: Date.now() + 60 * 60_000,
      };
      if (profile.username && profile.username !== contact.username) {
        const { error } = await db().from("inbox_conversations")
          .update({ username: profile.username }).eq("peer_id", peer);
        // Retry persistence sooner, without hiding an otherwise usable identity.
        if (error) result.refresh_at = Date.now() + 5 * 60_000;
      }
      // Saved separately and best-effort: the list shows it on the next load,
      // and a database without the name column only loses that shortcut.
      if (profile.name && profile.name !== contact.name)
        await db().from("inbox_conversations").update({ name: profile.name }).eq("peer_id", peer);
    } catch {
      // Missing consent, deleted accounts or transient API failures must never
      // prevent staff from opening the saved conversation or composing a reply.
    }
    cached.delete(peer);
    cached.set(peer, result);
    if (cached.size > 500) cached.delete(cached.keys().next().value!);
    return result;
  })();
  pending.set(peer, lookup);
  try { return await lookup; }
  finally { pending.delete(peer); }
}
