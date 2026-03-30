"use client";

/* ChinaPal ComparisonSection — Before/After drag sliders
   Design: "Calm Authority"
   Each scenario is a single full-width card with a drag divider.
   Left side: DIY screenshot (desaturated, painful)
   Right side: ChinaPal chat UI rendered in-place
   Works great on mobile — no side-by-side squeeze. */

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle, GripVertical } from "lucide-react";

/* ── Zhangjiajie inline photos ──────────────────────────── */
const ZJJ_PHOTOS = [
  {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/zhangjiajie-bailong-elevator-CBkEi9VxAnoH2igiVPSd8D.webp",
    label: "Bailong Elevator",
  },
  {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/zhangjiajie-avatar-mountains-BeQAJdZXyKcX86KJFYNhsg.webp",
    label: "Avatar Mountains",
  },
  {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/zhangjiajie-tianzi-cable-car-9GGqUJNiMNKghbZakXFbwZ.webp",
    label: "Tianzi Cable Car",
  },
];

/* ── Image constants ─────────────────────────────────────── */
const KLOOK    = "https://pub-4176b2b92fac4c24bb6fe630ebf1b0f1.r2.dev/images/homepage/attractionticket_diy.png";
const C12306   = "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/diy-12306-screenshot-8nttVHF4ExhAWzC4Ep7cgL.webp";
const DIANPING = "/dianping.png";
const DIDI     = "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/diy-didi-screenshot-v2-oQ7GETZsDF4VMFFZBY6RES.webp";
const PASSPORT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/diy-passport-grid-MXtSG9SvtK64BXHYwSHSxZ.webp";

const RED  = "oklch(0.48 0.22 25)";
const FONT = "'Plus Jakarta Sans', sans-serif";

/* ── types ───────────────────────────────────────────────── */
type ChatMsg = { from: "user" | "bot"; text: string; collapsible?: boolean; photos?: typeof ZJJ_PHOTOS };

interface Scenario {
  label: string;
  diyImage: string;
  diyLabel: string;   // short label shown on the DIY side
  diyCaption: string;
  diyBrand: string;   // brand name for the DIY logo badge
  diyBrandColor: string; // brand color
  messages: ChatMsg[];
  confirmLabel?: string;
  cardHeight?: number; // px — override per scenario
}

/* ── data ─────────────────────────────────────────────────── */
const scenarios: Scenario[] = [
  {
    label: "Tickets",
    diyImage: KLOOK,
    diyLabel: "Attraction tickets with Klook",
    diyCaption: "5 platforms · 3 in Chinese · Still not sure which gate.",
    diyBrand: "Klook",
    diyBrandColor: "#FF5722",
    cardHeight: 560,
    messages: [
      { from: "user", text: "We want to visit Zhangjiajie. What should we book?" },
      { from: "bot",  text: "How many people, and any kids or elderly? That changes the route and tickets." },
      { from: "user", text: "2 adults, my parents (both 65+), and 2 kids aged 8 and 5" },
      { from: "bot",  text: "Perfect — here's your plan:", collapsible: true, photos: ZJJ_PHOTOS },
      { from: "bot",  text: "Send a photo of your passports and I'll book everything 📸" },
      { from: "user", text: "📸 [passport photo]" },
      { from: "bot",  text: "All booked ✅ Confirmations attached. Get there 15 min early. Have an amazing day!" },
    ],
    confirmLabel: "Zhangjiajie · East Gate · 7:30am · All 6 booked",
  },
  {
    label: "Train Booking",
    diyImage: C12306,
    diyLabel: "Train tickets with 12306",
    diyCaption: "30+ trains. All in Chinese. Which station? Which class? Which seat?",
    diyBrand: "12306",
    diyBrandColor: "#1A56DB",
    messages: [
      { from: "user", text: "We need a train from Shanghai to Xi'an on April 12, 2 people" },
      { from: "bot",  text: "G360, departs Hongqiao 9:05am, arrives 13:32. Second class, seats 7A and 7B together. Here are your e-tickets 🎫" },
    ],
    confirmLabel: "G360 · Apr 12 · Seats 7A & 7B · ¥553 pp",
  },
  {
    label: "Restaurant",
    diyImage: DIANPING,
    diyLabel: "Restaurant booking — DIY",
    diyCaption: "Hundreds of reviews. All in Chinese. Can't tell which is good.",
    diyBrand: "Dianping",
    diyBrandColor: "#FF6B00",
    messages: [
      { from: "user", text: "Where should we eat near the Bund tonight? Something local, not touristy" },
      { from: "bot",  text: "Reserved at 南翔馒头店 for 7:30pm. Get the xiaolongbao and the braised pork. It's a 5 min walk from your hotel — here's the Amap link 📍" },
    ],
    confirmLabel: "南翔馒头店 · Tonight 7:30pm · Table for 2",
  },
  {
    label: "Getting Around",
    diyImage: DIDI,
    diyLabel: "Getting around with Didi",
    diyCaption: "Typed 'National Exhibition Center' — every autocomplete result is in Chinese. No idea which one to pick.",
    diyBrand: "DiDi",
    diyBrandColor: "#FF7A00",
    messages: [
      { from: "user", text: "We need to get to Mutianyu Great Wall tomorrow morning" },
      { from: "bot",  text: "Didi booked for 7:30am at your hotel lobby. Driver Mr. Zhang, black Buick, plate 京A·58291. I've sent him your pickup in Chinese. I'll call him at pickup time 👋" },
    ],
    confirmLabel: "Didi · 7:30am · Mr. Zhang · 京A·58291",
  },
];

/* ── Collapsible bot bubble with optional photos ── */
function CollapsibleBotBubble({ msg }: { msg: ChatMsg }) {
  const [expanded, setExpanded] = useState(false);

  const PLAN_DETAIL = "East Gate, 7:30am (quieter for kids). Parents get free entrance with passport. Kids under 120cm free.\n\nBailong Elevator up → Yuanjiajie for Avatar mountains → Tianzi cable car down.\n\nSkip the Glass Bridge — not worth it with young kids.";

  return (
    <div
      className="max-w-[85%] bg-white rounded-2xl rounded-tl-sm shadow-sm border border-stone-100 overflow-hidden"
      style={{ color: "oklch(0.18 0.01 260)", fontFamily: FONT }}
    >
      {/* Header text */}
      <div className="px-3 pt-2 pb-1 text-xs leading-relaxed font-semibold">{msg.text}</div>

      {/* Collapsed preview / expanded detail */}
      {!expanded ? (
        <div className="px-3 pb-2">
          <span
            className="text-[10px] font-semibold cursor-pointer underline underline-offset-2"
            style={{ color: RED }}
            onClick={() => setExpanded(true)}
          >
            See full plan ↓
          </span>
        </div>
      ) : (
        <div className="px-3 pb-2">
          <p className="text-xs leading-relaxed whitespace-pre-line mb-2" style={{ color: "oklch(0.30 0.01 260)" }}>
            {PLAN_DETAIL}
          </p>
          <span
            className="text-[10px] font-semibold cursor-pointer underline underline-offset-2"
            style={{ color: "oklch(0.55 0.01 260)" }}
            onClick={() => setExpanded(false)}
          >
            Show less ↑
          </span>
        </div>
      )}

      {/* Photos strip — always visible */}
      {msg.photos && (
        <div className="flex gap-1 px-2 pb-2">
          {msg.photos.map((p, pi) => (
            <div key={pi} className="flex-1 relative rounded-lg overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}>
                <span className="text-white text-[8px] font-semibold leading-tight block" style={{ fontFamily: FONT }}>{p.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Chat panel rendered as a React node (for the right side) ── */
function ChatPanel({ scenario }: { scenario: Scenario }) {
  let botCount = 0;
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#f8f6f3" }}>
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0"
        style={{ backgroundColor: RED }}
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[9px] font-bold" style={{ fontFamily: FONT }}>CP</span>
        </div>
        <span className="text-white text-xs font-semibold" style={{ fontFamily: FONT }}>ChinaPal</span>
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto" style={{ padding: '12px 16px 12px 12px' }}>
        {scenario.messages.map((msg, i) => {
          if (msg.from === "user") {
            return (
              <div key={i} className="flex justify-end">
                <div
                  className="max-w-[85%] rounded-2xl rounded-tr-sm px-3 py-2 text-xs leading-relaxed text-white shadow-sm"
                  style={{ backgroundColor: RED, fontFamily: FONT }}
                >
                  {msg.text}
                </div>
              </div>
            );
          } else {
            const isFirst = botCount === 0;
            botCount++;
            return (
              <div key={i} className="flex justify-start gap-1.5 pl-1">
                {isFirst ? (
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[8px] font-bold mt-0.5"
                    style={{ backgroundColor: RED, fontFamily: FONT }}
                  >
                    CP
                  </div>
                ) : (
                  <div className="w-5 flex-shrink-0" />
                )}
                {msg.collapsible ? (
                  <CollapsibleBotBubble msg={msg} />
                ) : (
                  <div
                    className="max-w-[85%] bg-white rounded-2xl rounded-tl-sm shadow-sm border border-stone-100 overflow-hidden"
                    style={{ color: "oklch(0.18 0.01 260)", fontFamily: FONT }}
                  >
                    <div className="px-3 py-2 text-xs leading-relaxed whitespace-pre-line">{msg.text}</div>
                  </div>
                )}
              </div>
            );
          }
        })}

        {/* Confirm pill */}
        {scenario.confirmLabel && (
          <div className="flex justify-start pl-6 mt-1">
            <div className="flex items-center gap-1.5 bg-white border border-stone-100 rounded-xl px-2.5 py-1.5 shadow-sm">
              <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: RED }} />
              <span className="text-[10px] font-semibold" style={{ color: RED, fontFamily: FONT }}>
                {scenario.confirmLabel}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Desktop: Side-by-side comparison ─────────────────────── */
function SideBySide({ scenario, index }: { scenario: Scenario; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transitionDelay: `${index * 0.08}s`,
      }}
    >
      {/* Scenario label */}
      <div
        className="text-xs font-bold uppercase tracking-widest mb-2 px-1"
        style={{ color: "oklch(0.55 0.01 260)", fontFamily: FONT }}
      >
        {scenario.label}
      </div>

      <div className="grid grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-md border border-stone-200" style={{ height: `${scenario.cardHeight ?? 420}px` }}>
        {/* LEFT: DIY screenshot */}
        <div className="relative overflow-hidden">
          <img
            src={scenario.diyImage}
            alt={`DIY: ${scenario.label}`}
            className="w-full h-full"
            style={{
              filter: "saturate(0.55) brightness(0.82)",
              objectFit: scenario.label === "Getting Around" ? "contain" : "cover",
              objectPosition: scenario.label === "Getting Around" ? "center" : "top",
              backgroundColor: scenario.label === "Getting Around" ? "#e8e4df" : undefined,
            }}
          />
          {/* DIY brand badge */}
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest pointer-events-none shadow-sm"
            style={{ backgroundColor: scenario.diyBrandColor, color: "white", fontFamily: FONT }}
          >
            {scenario.diyBrand}
          </div>
        </div>

        {/* RIGHT: ChinaPal chat */}
        <div className="relative">
          <ChatPanel scenario={scenario} />
          {/* ChinaPal label */}
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest pointer-events-none"
            style={{ backgroundColor: "oklch(0.48 0.22 25)", color: "white", fontFamily: FONT }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            ChinaPal
          </div>
        </div>
      </div>

      {/* Caption below card */}
      <div className="mt-2 px-1 flex items-start gap-1.5">
        <div className="w-4 h-4 rounded-full bg-stone-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-[8px] font-bold leading-none">✕</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "oklch(0.52 0.01 260)", fontFamily: FONT }}>
            {scenario.diyLabel}
          </span>
          <p className="text-[11px] leading-snug mt-0.5" style={{ color: "oklch(0.60 0.01 260)", fontFamily: FONT }}>
            {scenario.diyCaption}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile: BeforeAfterSlider (1:1:1 layout) ────────────── */
/* DIY covers left 2/3, ChinaPal covers right 2/3, slider moves in middle third */
const SLIDER_MIN = 33;
const SLIDER_MAX = 66;

function BeforeAfterSlider({ scenario, index }: { scenario: Scenario; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cardWidth, setCardWidth] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setCardWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setCardWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const getPositionFromEvent = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 50;
    const x = clientX - rect.left;
    return Math.min(Math.max((x / rect.width) * 100, SLIDER_MIN), SLIDER_MAX);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => setPosition(getPositionFromEvent(e.clientX));
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, getPositionFromEvent]);

  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    setPosition(getPositionFromEvent(e.touches[0].clientX));
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      setPosition(getPositionFromEvent(e.touches[0].clientX));
    };
    const onEnd = () => setDragging(false);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => { window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onEnd); };
  }, [dragging, getPositionFromEvent]);

  const onContainerClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".slider-handle")) return;
    setPosition(getPositionFromEvent(e.clientX));
  };

  return (
    <div
      className="transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transitionDelay: `${index * 0.08}s`,
      }}
    >
      <div
        className="text-xs font-bold uppercase tracking-widest mb-2 px-1"
        style={{ color: "oklch(0.55 0.01 260)", fontFamily: FONT }}
      >
        {scenario.label}
      </div>

      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden shadow-md border border-stone-200 select-none"
        style={{ height: `${scenario.cardHeight ?? 420}px`, cursor: dragging ? "col-resize" : "ew-resize", willChange: "transform" }}
        onClick={onContainerClick}
      >
        {/* RIGHT layer: ChinaPal chat — fixed from 33% to 100% */}
        <div
          className="absolute top-0 bottom-0 right-0 overflow-hidden"
          style={{ left: `${SLIDER_MIN}%` }}
        >
          <ChatPanel scenario={scenario} />
        </div>

        {/* LEFT layer: DIY screenshot — image fills 0% to 66%, clipped by slider position */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <div className="absolute top-0 bottom-0 left-0" style={{ width: `${cardWidth * (SLIDER_MAX / 100)}px` }}>
            <img
              src={scenario.diyImage}
              alt={`DIY: ${scenario.label}`}
              className="w-full h-full"
              style={{
                filter: "saturate(0.55) brightness(0.82)",
                objectFit: scenario.label === "Getting Around" ? "contain" : "cover",
                objectPosition: scenario.label === "Getting Around" ? "center" : "top",
                backgroundColor: scenario.label === "Getting Around" ? "#e8e4df" : undefined,
              }}
            />
            {/* DIY brand badge */}
            <div
              className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest pointer-events-none shadow-sm"
              style={{ backgroundColor: scenario.diyBrandColor, color: "white", fontFamily: FONT }}
            >
              {scenario.diyBrand}
            </div>
          </div>
        </div>

        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest pointer-events-none"
          style={{
            backgroundColor: "oklch(0.48 0.22 25)",
            color: "white",
            fontFamily: FONT,
            opacity: position < 85 ? 1 : 0,
            transition: "opacity 0.2s",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          ChinaPal
        </div>

        <div
          className="absolute top-0 bottom-0 w-0.5 pointer-events-none"
          style={{ left: `${position}%`, backgroundColor: "white", boxShadow: "0 0 8px rgba(0,0,0,0.35)" }}
        />

        <div
          className="slider-handle absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex items-center justify-center rounded-full shadow-xl border-2 border-white"
          style={{
            left: `${position}%`,
            width: "40px",
            height: "40px",
            backgroundColor: "white",
            cursor: "col-resize",
            boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
            transition: dragging ? "none" : "left 0.18s ease",
          }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
          <GripVertical className="w-4 h-4" style={{ color: "oklch(0.48 0.22 25)" }} />
        </div>

        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold pointer-events-none"
          style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.9)", fontFamily: FONT, backdropFilter: "blur(4px)" }}
        >
          ← drag to compare →
        </div>
      </div>

      <div className="mt-2 px-1 flex items-start gap-1.5">
        <div className="w-4 h-4 rounded-full bg-stone-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-[8px] font-bold leading-none">✕</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "oklch(0.52 0.01 260)", fontFamily: FONT }}>
            {scenario.diyLabel}
          </span>
          <p className="text-[11px] leading-snug mt-0.5" style={{ color: "oklch(0.60 0.01 260)", fontFamily: FONT }}>
            {scenario.diyCaption}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Responsive wrapper: desktop = side-by-side, mobile = slider ── */
function ComparisonCard({ scenario, index }: { scenario: Scenario; index: number }) {
  return (
    <>
      {/* Desktop: side-by-side */}
      <div className="hidden md:block">
        <SideBySide scenario={scenario} index={index} />
      </div>
      {/* Mobile: drag slider */}
      <div className="block md:hidden">
        <BeforeAfterSlider scenario={scenario} index={index} />
      </div>
    </>
  );
}

/* ── Section ─────────────────────────────────────────────── */
export default function ComparisonSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTitleVisible(true); },
      { threshold: 0.2 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="py-24 px-4" style={{ backgroundColor: "oklch(0.975 0.006 80)" }}>
        <div className="max-w-2xl md:max-w-4xl mx-auto">

        {/* Section header */}
        <div
          ref={titleRef}
          className="text-center mb-14 transition-all duration-700"
          style={{ opacity: titleVisible ? 1 : 0, transform: titleVisible ? "translateY(0)" : "translateY(24px)" }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border"
            style={{ backgroundColor: "oklch(0.92 0.05 25)", color: "oklch(0.48 0.22 25)", borderColor: "oklch(0.85 0.08 25)", fontFamily: FONT }}
          >
            Same trip. Different experience.
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.18 0.01 260)" }}>
            Drag to see the difference.
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "oklch(0.52 0.01 260)", fontFamily: FONT }}>
            Every booking that takes you hours of confusion takes us one message.
          </p>
        </div>

        {/* Sliders */}
        <div className="flex flex-col gap-8">
          {scenarios.map((s, i) => (
            <ComparisonCard key={s.label} scenario={s} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
