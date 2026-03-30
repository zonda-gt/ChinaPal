"use client";

/* ChinaPal ChatMockup — animated chat interface demo
   Supports any number of messages per conversation.
   Shows typing indicator before each bot/confirmation message. */

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

interface Message {
  type: "user" | "bot" | "confirmation";
  text?: string;
  confirmationData?: {
    title: string;
    detail1: string;
    detail2: string;
    ref: string;
  };
}

const CONVERSATIONS: Message[][] = [
  [
    { type: "user", text: "Hi, we need to get from Shanghai to Xi'an on April 12, there's 2 of us" },
    { type: "bot", text: "There's a 9:05am that gets in at 1:32pm, or earlier if you want more time in Xi'an" },
    { type: "user", text: "The 9am one is good" },
    { type: "bot", text: "G360, 9:05am from Hongqiao station. Seats 7A and 7B. Booked \u2705" },
    { type: "bot", text: "Heads up — Hongqiao has two stations (railway + airport), make sure you go to the railway side." },
    {
      type: "confirmation",
      confirmationData: { title: "G360 · Shanghai → Xi'an", detail1: "Apr 12 · 9:05am → 13:32", detail2: "Seats 7A & 7B · Second class", ref: "E-tickets sent" }
    },
  ],
  [
    { type: "user", text: "We want to visit Zhangjiajie. What should we book?" },
    { type: "bot", text: "How many people, and any kids or elderly? That changes the route and tickets." },
    {
      type: "confirmation",
      confirmationData: { title: "All 6 booked \u2705", detail1: "East Gate · 7:30am · Bailong Elevator", detail2: "Parents free · Kids under 120cm free", ref: "Confirmations attached" }
    },
  ],
  [
    { type: "user", text: "We want authentic Xi'an food tonight, near the Bell Tower" },
    { type: "bot", text: "Reserved a table at Lao Sun Jia for 7pm. Order the lamb paomo — it's what locals come for." },
    {
      type: "confirmation",
      confirmationData: { title: "Lao Sun Jia Restaurant", detail1: "Tonight · 7:00pm · Bell Tower", detail2: "Table for 2 confirmed", ref: "Amap link sent" }
    },
  ],
];

const FONT = "'Plus Jakarta Sans', sans-serif";
const RED = "oklch(0.48 0.22 25)";

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
    let time = 300;

    conversation.forEach((msg, i) => {
      const showAt = time;

      if (msg.type === "user") {
        // User messages appear instantly (no typing)
        timers.push(setTimeout(() => {
          setShowTyping(false);
          setVisibleCount(i + 1);
        }, showAt));
        time += 800;
      } else {
        // Bot/confirmation: show typing first, then reveal
        const typingStart = showAt;
        const revealAt = showAt + 800;

        timers.push(setTimeout(() => setShowTyping(true), typingStart));
        timers.push(setTimeout(() => {
          setShowTyping(false);
          setVisibleCount(i + 1);
        }, revealAt));
        time = revealAt + 600;
      }
    });

    // Cycle to next conversation after all messages shown + pause
    timers.push(setTimeout(() => {
      setConvIndex((i) => (i + 1) % CONVERSATIONS.length);
    }, time + 2000));

    return () => timers.forEach(clearTimeout);
  }, [convIndex, isPlaying, conversation]);

  return (
    <div
      className="relative mx-auto"
      style={{ width: "100%", maxWidth: 320 }}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Phone shell */}
      <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-stone-200 bg-white" style={{ boxShadow: "0 32px 80px -12px rgba(0,0,0,0.25)" }}>
        {/* Chat header — compact */}
        <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: RED }}>
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-xs font-display">CP</span>
          </div>
          <div className="text-white font-semibold text-sm" style={{ fontFamily: FONT }}>ChinaPal</div>
          <div className="ml-auto w-2 h-2 rounded-full bg-green-400" />
        </div>

        {/* Messages area */}
        <div className="bg-stone-50 px-4 py-4 space-y-3 h-[420px] overflow-hidden">
          {conversation.map((msg, i) => {
            if (i >= visibleCount) return null;

            if (msg.type === "user") {
              return (
                <div key={i} className="flex justify-end animate-bubble-in">
                  <div
                    className="max-w-[75%] rounded-2xl rounded-tr-sm px-3 py-2 text-sm text-white"
                    style={{ backgroundColor: RED, fontFamily: FONT }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            }

            if (msg.type === "bot") {
              return (
                <div key={i} className="flex justify-start animate-bubble-in">
                  <div
                    className="max-w-[80%] bg-white rounded-2xl rounded-tl-sm px-3 py-2 text-xs shadow-sm whitespace-pre-line"
                    style={{ color: "oklch(0.18 0.01 260)", fontFamily: FONT }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            }

            if (msg.type === "confirmation" && msg.confirmationData) {
              return (
                <div key={i} className="flex justify-start animate-bubble-in">
                  <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-3 max-w-[85%]">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: RED }} />
                      <div>
                        <div className="text-xs font-bold mb-1" style={{ color: RED, fontFamily: FONT }}>
                          CONFIRMED
                        </div>
                        <div className="text-xs font-semibold" style={{ color: "oklch(0.18 0.01 260)", fontFamily: FONT }}>
                          {msg.confirmationData.title}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "oklch(0.52 0.01 260)", fontFamily: FONT }}>
                          {msg.confirmationData.detail1}
                        </div>
                        <div className="text-xs" style={{ color: "oklch(0.52 0.01 260)", fontFamily: FONT }}>
                          {msg.confirmationData.detail2}
                        </div>
                        <div className="text-xs mt-1 font-medium" style={{ color: RED, fontFamily: FONT }}>
                          {msg.confirmationData.ref}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}

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
        </div>

        {/* Input bar */}
        <div className="bg-white px-4 py-3 border-t border-stone-100 flex items-center gap-2">
          <div className="flex-1 bg-stone-100 rounded-full px-4 py-2 text-xs text-stone-400" style={{ fontFamily: FONT }}>
            Message ChinaPal...
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: RED }}
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
            style={{ backgroundColor: i === convIndex ? RED : "oklch(0.80 0.01 260)" }}
          />
        ))}
      </div>
    </div>
  );
}
