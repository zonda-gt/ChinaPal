"use client";
import { useEffect, useRef, useState } from "react";
import type { ContactIdentity, Conversation } from "@/lib/inbox/types";

export default function useContactIdentities(conversations: Conversation[], enabled: boolean) {
  const [contacts, setContacts] = useState<Record<string, ContactIdentity>>({});
  const cache = useRef<Record<string, ContactIdentity>>({});
  const peers = conversations.map(c => c.peer_id).join(",");
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    let running = false;
    async function refresh() {
      if (running || document.visibilityState !== "visible") return;
      running = true;
      const queue = peers.split(",").filter(peer => peer &&
        (!cache.current[peer] || cache.current[peer].refresh_at <= Date.now()));
      // Names/photos arrive progressively; the message list never waits for Meta.
      await Promise.all(Array.from({ length: 4 }, async () => {
        while (queue.length && !controller.signal.aborted) {
          const peer = queue.shift()!;
          try {
            const response = await fetch(`/api/inbox/conversations/${peer}/identity`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: "{}", cache: "no-store", signal: controller.signal,
            });
            if (!response.ok) continue;
            const identity: ContactIdentity = await response.json();
            if (controller.signal.aborted) return;
            cache.current[peer] = identity;
            setContacts(current => ({ ...current, [peer]: identity }));
          } catch { /* Retry on the next refresh; keep the chat usable. */ }
        }
      }));
      running = false;
    }
    void refresh();
    const timer = setInterval(() => { void refresh(); }, 60_000);
    return () => { controller.abort(); clearInterval(timer); };
  }, [enabled, peers]);
  // Called on logout so contact data never survives into another session.
  function clear() { cache.current = {}; setContacts({}); }
  return { contacts, clear };
}
