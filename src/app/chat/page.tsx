"use client";

/* ChinaPal in-app chat — human-backed concierge thread.
   Persistence: localStorage (placeholder).
   TODO: swap to Supabase-backed /api/concierge/* endpoints
   mirrored from inbound_mvp1/src/app/api/concierge. Single-file swap:
   replace getMessages/appendMessage in @/lib/chat-store with fetch calls. */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Send, ArrowLeft, Pencil, CheckCheck } from "lucide-react";
import {
  getMessages,
  appendMessage,
  getIdentity,
  setIdentity,
  makeId,
  type ChatMessage,
  type ChatIdentity,
} from "@/lib/chat-store";
import { PLANS, firstAck, isPlanKey } from "@/lib/plans";

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function Logo() {
  return (
    <span className="text-[20px] font-extrabold tracking-tight text-[#111110]">
      China<span className="text-[#DC2626]">Pal</span>
    </span>
  );
}

function IdentityModal({
  initial,
  onSave,
}: {
  initial?: ChatIdentity | null;
  onSave: (id: ChatIdentity) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      email: email.trim() || undefined,
      plan: initial?.plan,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#111110]/40 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl border border-[#E7E5E4] shadow-xl w-full max-w-md p-7"
      >
        <h2 className="font-display text-2xl text-[#111110] mb-1.5">
          One quick thing
        </h2>
        <p className="font-body text-sm text-[#78716C] mb-5">
          What should we call you?
        </p>

        <div className="space-y-4">
          <div>
            <label className="block font-body text-xs font-semibold text-[#52525B] uppercase tracking-widest mb-2">
              Name
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Traveler"
              className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FAFAF9] font-body text-sm text-[#111110] focus:outline-none focus:border-[#DC2626] focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block font-body text-xs font-semibold text-[#52525B] uppercase tracking-widest mb-2">
              Email <span className="text-[#A8A29E] normal-case font-normal">(optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FAFAF9] font-body text-sm text-[#111110] focus:outline-none focus:border-[#DC2626] focus:bg-white transition-colors"
            />
            <p className="font-body text-xs text-[#A8A29E] mt-1.5">
              So we can email you if you step away.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="btn-primary w-full justify-center text-sm py-3 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start chatting
        </button>
      </form>
    </div>
  );
}

export default function ChatPage() {
  const [identity, setIdent] = useState<ChatIdentity | null>(null);
  const [showIdentity, setShowIdentity] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Hydrate identity + messages from storage on mount.
  useEffect(() => {
    const id = getIdentity();
    setIdent(id);
    setMessages(getMessages());
    setShowIdentity(!id);
    setHydrated(true);
  }, []);

  // Auto-scroll to bottom on new messages.
  useEffect(() => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages, sending]);

  // Auto-grow textarea.
  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "auto";
    inputRef.current.style.height =
      Math.min(inputRef.current.scrollHeight, 160) + "px";
  }, [draft]);

  function persistIdentity(id: ChatIdentity) {
    setIdentity(id);
    setIdent(id);
    setShowIdentity(false);
  }

  async function handleSend() {
    const text = draft.trim();
    if (!text || !identity || sending) return;
    setSending(true);
    setDraft("");

    const userMsg: ChatMessage = {
      id: makeId(),
      from: "user",
      text,
      ts: Date.now(),
    };
    const next = appendMessage(userMsg);
    setMessages(next);

    // First-message auto-acknowledgement from the team.
    // TODO: remove once Supabase-backed concierge thread is wired —
    // real replies come from the admin dashboard.
    const isFirstUserMsg = next.filter((m) => m.from === "user").length === 1;
    if (isFirstUserMsg) {
      const planKey = isPlanKey(identity.plan) ? identity.plan : "chinapal-pass";
      setTimeout(() => {
        const ack: ChatMessage = {
          id: makeId(),
          from: "team",
          text: firstAck(planKey, identity.name),
          ts: Date.now(),
        };
        const after = appendMessage(ack);
        setMessages(after);
        setSending(false);
      }, 1600);
    } else {
      setSending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="font-body text-sm text-[#A8A29E]">Loading…</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#FAFAF9] flex flex-col">
      {showIdentity && (
        <IdentityModal initial={identity} onSave={persistIdentity} />
      )}

      {/* ── Chat header ──────────────────────────────────────── */}
      <header className="border-b border-[#E7E5E4] bg-white">
        <div className="cp-container">
          <div className="flex items-center justify-between h-16 gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#78716C] hover:text-[#111110] transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
              <span className="font-body text-sm hidden sm:inline">Home</span>
            </Link>

            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] font-display font-bold text-base shrink-0">
                CP
              </div>
              <div className="min-w-0">
                <Logo />
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  <span className="font-body text-xs text-[#78716C]">
                    Local team online · replies within 1 hour
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIdentity(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E7E5E4] hover:border-[#111110] transition-colors shrink-0"
              aria-label="Edit your name"
            >
              <span className="font-body text-xs text-[#52525B] hidden sm:inline">
                {identity?.name ?? "Set name"}
              </span>
              <Pencil size={12} className="text-[#78716C]" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Messages ─────────────────────────────────────────── */}
      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="max-w-2xl mx-auto">
          {messages.length === 0 ? (
            <EmptyState
              planKey={identity?.plan}
              onPickPrompt={(text) => {
                setDraft(text);
                inputRef.current?.focus();
              }}
            />
          ) : (
            <div className="space-y-3">
              {messages.map((m) => (
                <Bubble key={m.id} msg={m} />
              ))}
              {sending && <TypingDots />}
            </div>
          )}
        </div>
      </div>

      {/* ── Composer ─────────────────────────────────────────── */}
      <div className="border-t border-[#E7E5E4] bg-white">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-end gap-2 bg-[#FAFAF9] rounded-2xl border border-[#E7E5E4] focus-within:border-[#DC2626] transition-colors p-2">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Message ChinaPal…"
              className="flex-1 resize-none bg-transparent px-3 py-2 font-body text-sm text-[#111110] placeholder:text-[#A8A29E] focus:outline-none leading-relaxed"
              disabled={!identity}
            />
            <button
              onClick={handleSend}
              disabled={!draft.trim() || !identity || sending}
              className="shrink-0 w-10 h-10 rounded-xl bg-[#DC2626] text-white flex items-center justify-center hover:bg-[#B91C1C] active:scale-[0.96] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-center font-body text-[11px] text-[#A8A29E] mt-2">
            Press Enter to send · Shift+Enter for a new line
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── components ─────────────────────────────────────────────── */

function Bubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.from === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] font-display font-bold text-[10px] shrink-0 mt-0.5">
          CP
        </div>
      )}
      <div className={`max-w-[78%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-2.5 font-body text-sm leading-relaxed ${
            isUser
              ? "bg-[#DC2626] text-white rounded-br-md"
              : "bg-white border border-[#E7E5E4] text-[#111110] rounded-bl-md"
          }`}
        >
          {msg.text}
        </div>
        <div className="flex items-center gap-1 mt-1 px-1">
          <span className="font-body text-[10px] text-[#A8A29E]">
            {formatTime(msg.ts)}
          </span>
          {isUser && <CheckCheck size={11} className="text-[#A8A29E]" />}
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex justify-start gap-2">
      <div className="w-7 h-7 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] font-display font-bold text-[10px] shrink-0 mt-0.5">
        CP
      </div>
      <div className="bg-white border border-[#E7E5E4] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#A8A29E] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  planKey,
  onPickPrompt,
}: {
  planKey?: string;
  onPickPrompt: (text: string) => void;
}) {
  const plan = isPlanKey(planKey) ? PLANS[planKey] : null;
  const prompts = [
    "Here's my draft itinerary — can you review it?",
    "Where should we eat near our hotel?",
    "Should we do Suzhou or Zhujiajiao on day 3?",
    "Can you translate this menu?",
  ];

  return (
    <div className="py-10 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FEF2F2] mb-5">
        <span className="text-2xl">👋</span>
      </div>
      <h2 className="font-display text-2xl text-[#111110] mb-2">
        Hi! Tell us about your trip.
      </h2>
      <p className="font-body text-sm text-[#78716C] max-w-md mx-auto mb-8 leading-relaxed">
        Dates, cities, hotel options, anything you&apos;re unsure about. A local
        will read it and reply.
        {plan?.key === "chinapal-pass" && (
          <span className="block mt-2 text-[#DC2626] font-medium">
            Your 7-day Pass starts on this first message.
          </span>
        )}
      </p>

      <p className="font-body text-xs font-semibold text-[#A8A29E] uppercase tracking-widest mb-3">
        Or try one of these
      </p>
      <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
        {prompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPickPrompt(p)}
            className="px-3.5 py-2 rounded-full border border-[#E7E5E4] bg-white font-body text-xs text-[#52525B] hover:border-[#DC2626] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
