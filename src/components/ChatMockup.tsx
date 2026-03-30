"use client";

/* ChinaPal ChatMockup — animated chat interface demo
   Design: "Calm Authority" — red header, white bubbles, sequential animation
   Shows a live conversation playing out step by step */

import { useState, useEffect } from "react";
import { CheckCircle, MapPin } from "lucide-react";

interface Message {
  id: number;
  type: "user" | "bot" | "confirmation";
  text?: string;
  delay: number;
  confirmationData?: {
    title: string;
    detail1: string;
    detail2: string;
    ref: string;
  };
}

const CONVERSATIONS: Message[][] = [
  [
    { id: 1, type: "user", text: "We want to visit Zhangjiajie. What should we book?", delay: 0 },
    { id: 2, type: "bot", text: "How many people, and any kids or elderly? That changes the route and tickets.", delay: 1200 },
    {
      id: 3, type: "confirmation", delay: 2200,
      confirmationData: { title: "All 6 booked ✅", detail1: "East Gate · 7:30am · Bailong Elevator", detail2: "Parents free · Kids under 120cm free", ref: "Confirmations attached" }
    },
  ],
  [
    { id: 1, type: "user", text: "We need to get from Shanghai to Xi'an on April 12, 2 people", delay: 0 },
    { id: 2, type: "bot", text: "Take the G360 at 9:05am from Hongqiao, arrives 13:32. Second class is fine for this route.", delay: 1200 },
    {
      id: 3, type: "confirmation", delay: 2000,
      confirmationData: { title: "G360 · Shanghai → Xi'an", detail1: "Apr 12 · 9:05am → 13:32", detail2: "2 × Second Class · Hongqiao", ref: "E-tickets sent to your email" }
    },
  ],
  [
    { id: 1, type: "user", text: "We want authentic Xi'an food tonight, near the Bell Tower", delay: 0 },
    { id: 2, type: "bot", text: "Reserved a table at Lao Sun Jia for 7pm. Order the lamb paomo — it's what locals come for.", delay: 1200 },
    {
      id: 3, type: "confirmation", delay: 2000,
      confirmationData: { title: "Lao Sun Jia Restaurant", detail1: "Tonight · 7:00pm · Bell Tower", detail2: "Table for 2 confirmed", ref: "Amap link sent" }
    },
  ],
];

export default function ChatMockup({ autoPlay = true }: { autoPlay?: boolean }) {
  const [convIndex, setConvIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const conversation = CONVERSATIONS[convIndex];

  useEffect(() => {
    if (!isPlaying) return;
    setVisibleCount(0);
    setShowTyping(false);

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Show first message immediately
    timers.push(setTimeout(() => setVisibleCount(1), 300));

    // Show typing indicator before bot reply
    timers.push(setTimeout(() => setShowTyping(true), 900));

    // Show bot reply
    timers.push(setTimeout(() => {
      setShowTyping(false);
      setVisibleCount(2);
    }, conversation[1].delay));

    // Show confirmation card
    timers.push(setTimeout(() => setVisibleCount(3), conversation[2].delay));

    // Cycle to next conversation
    timers.push(setTimeout(() => {
      setConvIndex((i) => (i + 1) % CONVERSATIONS.length);
    }, 5500));

    return () => timers.forEach(clearTimeout);
  }, [convIndex, isPlaying]);

  return (
    <div
      className="relative mx-auto"
      style={{ width: "100%", maxWidth: 320 }}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Phone shell */}
      <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-stone-200 bg-white" style={{ boxShadow: "0 32px 80px -12px rgba(0,0,0,0.25)" }}>
        {/* Status bar */}
        <div className="px-6 pt-3 pb-1 flex justify-between items-center text-xs font-medium" style={{ backgroundColor: "oklch(0.48 0.22 25)", color: "white" }}>
          <span>9:41</span>
          <span>●●●</span>
        </div>

        {/* Chat header */}
        <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "oklch(0.48 0.22 25)" }}>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-sm font-display">CP</span>
          </div>
          <div>
            <div className="text-white font-semibold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ChinaPal</div>
            <div className="text-white/70 text-xs">Your China travel assistant</div>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-green-400" />
        </div>

        {/* Messages area */}
        <div className="bg-stone-50 px-4 py-4 space-y-3 h-[280px] overflow-hidden">
          {/* User message */}
          {visibleCount >= 1 && (
            <div className="flex justify-end animate-bubble-in">
              <div
                className="max-w-[75%] rounded-2xl rounded-tr-sm px-3 py-2 text-sm text-white"
                style={{ backgroundColor: "oklch(0.48 0.22 25)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {conversation[0].text}
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {showTyping && (
            <div className="flex justify-start animate-bubble-in">
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-400 typing-dot" />
                <div className="w-1.5 h-1.5 rounded-full bg-stone-400 typing-dot" />
                <div className="w-1.5 h-1.5 rounded-full bg-stone-400 typing-dot" />
              </div>
            </div>
          )}

          {/* Bot reply */}
          {visibleCount >= 2 && (
            <div className="flex justify-start animate-bubble-in">
              <div
                className="max-w-[80%] bg-white rounded-2xl rounded-tl-sm px-3 py-2 text-sm shadow-sm"
                style={{ color: "oklch(0.18 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {conversation[1].text}
              </div>
            </div>
          )}

          {/* Confirmation card */}
          {visibleCount >= 3 && conversation[2].confirmationData && (
            <div className="flex justify-start animate-bubble-in">
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-3 max-w-[85%]">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "oklch(0.48 0.22 25)" }} />
                  <div>
                    <div className="text-xs font-bold mb-1" style={{ color: "oklch(0.48 0.22 25)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      CONFIRMED
                    </div>
                    <div className="text-xs font-semibold" style={{ color: "oklch(0.18 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {conversation[2].confirmationData.title}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "oklch(0.52 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {conversation[2].confirmationData.detail1}
                    </div>
                    <div className="text-xs" style={{ color: "oklch(0.52 0.01 260)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {conversation[2].confirmationData.detail2}
                    </div>
                    <div className="text-xs mt-1 font-medium" style={{ color: "oklch(0.48 0.22 25)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {conversation[2].confirmationData.ref}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="bg-white px-4 py-3 border-t border-stone-100 flex items-center gap-2">
          <div className="flex-1 bg-stone-100 rounded-full px-4 py-2 text-xs text-stone-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Message ChinaPal...
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "oklch(0.48 0.22 25)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Conversation dots */}
      <div className="flex justify-center gap-2 mt-4">
        {CONVERSATIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setConvIndex(i); setIsPlaying(true); }}
            className="w-2 h-2 rounded-full transition-all"
            style={{ backgroundColor: i === convIndex ? "oklch(0.48 0.22 25)" : "oklch(0.80 0.01 260)" }}
          />
        ))}
      </div>
    </div>
  );
}
