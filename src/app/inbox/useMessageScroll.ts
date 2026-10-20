"use client";
import { useLayoutEffect, useRef } from "react";
import type { Message } from "@/lib/inbox/types";

export default function useMessageScroll(peer: string | null, messages?: Message[]) {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const followLatest = useRef(true);
  const previous = useRef<{ peer: string; first?: string; height: number; top: number } | null>(null);

  function remember() {
    const el = viewport.current;
    if (el && previous.current) {
      previous.current.height = el.scrollHeight;
      previous.current.top = el.scrollTop;
    }
  }
  function onScroll() {
    const el = viewport.current;
    if (!el) return;
    followLatest.current = el.scrollHeight - el.clientHeight - el.scrollTop < 80;
    remember();
  }

  // Position a newly opened chat before paint, including cached conversations.
  // Only scroll this panel; scrollIntoView can also move ancestor containers.
  useLayoutEffect(() => {
    const el = viewport.current;
    if (!el || !peer || !messages) {
      previous.current = null;
      return;
    }
    const old = previous.current;
    const first = messages[0]?.id;
    if (!old || old.peer !== peer) {
      followLatest.current = true;
      el.scrollTop = el.scrollHeight;
    } else if (old.first && first !== old.first && messages.some(m => m.id === old.first)) {
      // Older messages were prepended: keep the same message in view.
      el.scrollTop = old.top + el.scrollHeight - old.height;
      followLatest.current = el.scrollHeight - el.clientHeight - el.scrollTop < 80;
    } else if (followLatest.current) {
      el.scrollTop = el.scrollHeight;
    }
    previous.current = { peer, first, height: el.scrollHeight, top: el.scrollTop };
  }, [peer, messages]);

  useLayoutEffect(() => {
    const el = viewport.current;
    const body = content.current;
    if (!el || !body || !peer) return;
    const observer = new ResizeObserver(() => {
      // Images and the resizable composer can change the height after render.
      if (followLatest.current) el.scrollTop = el.scrollHeight;
      remember();
    });
    observer.observe(body);
    observer.observe(el);
    return () => observer.disconnect();
  }, [peer]);

  return { viewport, content, onScroll };
}
