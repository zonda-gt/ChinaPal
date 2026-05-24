"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Smartphone,
  ClipboardCheck,
  Compass,
  Sparkles,
  Send,
  X as XIcon,
  Shield,
  MapPin,
  Utensils,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/chinapal-hero-bg-FDnCEqDWTZRbZZSyCrbHwY.webp";

const PASS_HREF = "/checkout?plan=chinapal-pass";
const TRIP_CHECK_HREF = "/checkout?plan=trip-check";

const RED = "oklch(0.48 0.22 25)";
const RED_LIGHT = "oklch(0.70 0.18 25)";
const RED_BG = "oklch(0.92 0.05 25)";
const RED_BORDER = "oklch(0.85 0.08 25)";
const DARK = "oklch(0.18 0.01 260)";
const BODY = "oklch(0.52 0.01 260)";
const MUTED = "oklch(0.60 0.01 260)";
const CREAM = "oklch(0.985 0.005 80)";
const FONT = "'Plus Jakarta Sans', sans-serif";

/* ════════════════════════════════════════════════════════════
   HERO — dark bg image, white headline with red emphasis
   ════════════════════════════════════════════════════════════ */

function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BG}
          alt="China landscapes"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.45)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 60%, rgba(24,20,20,0.95) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="pt-28 pb-16 px-4 flex-1 flex items-center">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* ── Left: copy ──────────────────── */}
              <div
                className="transition-all duration-1000"
                style={{
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateY(0)" : "translateY(40px)",
                }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border border-white/20 bg-white/10 backdrop-blur-sm text-white font-body">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  A local friend, by text
                </div>

                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
                  Travel China
                  <br />
                  <em className="not-italic" style={{ color: RED_LIGHT }}>
                    local friend
                  </em>{" "}
                  in your pocket.
                </h1>

                <p
                  className="text-sm md:text-xl text-white/80 mb-8 max-w-md leading-relaxed font-body"
                  style={{ fontFamily: FONT }}
                >
                  Text ChinaPal for local planning, better recommendations, and
                  real human support — before and during your trip.
                </p>

                <div className="flex flex-row flex-wrap gap-3">
                  <a
                    href={PASS_HREF}
                    className="text-white font-semibold px-8 py-4 rounded-full text-base transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 font-body"
                    style={{ backgroundColor: RED, fontFamily: FONT }}
                  >
                    Get 7 days of local help — $39
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={TRIP_CHECK_HREF}
                    className="font-semibold px-8 py-4 rounded-full text-base border border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2 font-body bg-transparent"
                    style={{ fontFamily: FONT }}
                  >
                    Check my trip — $19
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-10">
                  {[
                    { icon: MapPin, text: "Local planning" },
                    { icon: Utensils, text: "Food & shopping" },
                    { icon: Smartphone, text: "Hotel area advice" },
                    { icon: MessageCircle, text: "App or WhatsApp" },
                    { icon: Shield, text: "Real human help" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-white/60" />
                      <span
                        className="text-sm text-white/70 font-body"
                        style={{ fontFamily: FONT }}
                      >
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Right: chat mockup ──────────── */}
              <div
                className="flex justify-center lg:justify-end transition-all duration-1000"
                style={{
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateY(0)" : "translateY(40px)",
                  transitionDelay: "0.2s",
                }}
              >
                <HeroChatMockup />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroChatMockup() {
  return (
    <div className="relative w-full max-w-sm">
      <div
        className="bg-white rounded-3xl overflow-hidden shadow-2xl"
        style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid oklch(0.93 0.005 80)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm"
              style={{ backgroundColor: RED_BG, color: RED }}
            >
              CP
            </div>
            <div>
              <p
                className="font-display font-bold text-sm leading-none"
                style={{ color: DARK }}
              >
                ChinaPal
              </p>
              <p
                className="flex items-center gap-1.5 text-[10px] mt-0.5 font-body"
                style={{ color: MUTED, fontFamily: FONT }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Online · replies in minutes
              </p>
            </div>
          </div>
          <span
            className="text-[10px] font-body"
            style={{ color: MUTED, fontFamily: FONT }}
          >
            2:14 PM
          </span>
        </div>

        {/* Messages */}
        <div className="px-4 py-5 space-y-3" style={{ backgroundColor: CREAM }}>
          {/* User */}
          <div className="flex justify-end">
            <div className="max-w-[82%]">
              <div
                className="text-white rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed font-body"
                style={{ backgroundColor: RED, fontFamily: FONT }}
              >
                We have 3 hours in Shanghai. What should we do?
              </div>
              <p
                className="text-[10px] mt-1 text-right font-body"
                style={{ color: MUTED, fontFamily: FONT }}
              >
                Delivered
              </p>
            </div>
          </div>

          {/* ChinaPal */}
          <div className="flex justify-start gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center font-display font-bold text-[10px] shrink-0 mt-0.5"
              style={{ backgroundColor: RED_BG, color: RED }}
            >
              CP
            </div>
            <div className="max-w-[82%]">
              <div
                className="bg-white rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-relaxed font-body"
                style={{
                  border: "1px solid oklch(0.93 0.005 80)",
                  color: DARK,
                  fontFamily: FONT,
                }}
              >
                Local lunch, a design-street walk, then the Bund at sunset —
                I&apos;ll send the best route and food stop.
              </div>
              <p
                className="text-[10px] mt-1 font-body"
                style={{ color: MUTED, fontFamily: FONT }}
              >
                ChinaPal Team
              </p>
            </div>
          </div>
        </div>

        {/* Composer */}
        <div
          className="px-3 py-2.5 flex items-center gap-2 bg-white"
          style={{ borderTop: "1px solid oklch(0.93 0.005 80)" }}
        >
          <div
            className="flex-1 px-3 py-2 rounded-full text-xs font-body"
            style={{
              backgroundColor: CREAM,
              color: MUTED,
              fontFamily: FONT,
            }}
          >
            Message ChinaPal…
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: RED }}
          >
            <Send size={14} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Helper — section title block
   ════════════════════════════════════════════════════════════ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border"
      style={{
        backgroundColor: RED_BG,
        color: RED,
        borderColor: RED_BORDER,
        fontFamily: FONT,
      }}
    >
      {children}
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   VALUE CARDS — three positive cards
   ════════════════════════════════════════════════════════════ */

function ValueCards() {
  const values = [
    {
      icon: ClipboardCheck,
      title: "Plan smarter",
      desc: "Itineraries, hotel areas, day trips",
    },
    {
      icon: Sparkles,
      title: "Discover more",
      desc: "Food, shopping, neighborhoods, hidden gems",
    },
    {
      icon: MessageCircle,
      title: "Ask anytime",
      desc: "Routes, tickets, translation, “what next?”",
    },
  ];

  return (
    <section className="pt-14 md:pt-20 pb-6 md:pb-8 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-3 md:gap-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <div
                className="bg-white rounded-2xl p-4 md:p-5 border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group h-full"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: RED_BG }}
                >
                  <v.icon className="w-4 h-4" style={{ color: RED }} />
                </div>
                <h3
                  className="font-display font-bold text-base md:text-lg mb-1"
                  style={{ color: DARK }}
                >
                  {v.title}
                </h3>
                <p
                  className="text-sm leading-snug font-body"
                  style={{ color: BODY, fontFamily: FONT }}
                >
                  {v.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   TRUST STRIP — Book vs Ask
   ════════════════════════════════════════════════════════════ */

function TripComLogo() {
  const BLUE = "#2577E3";
  const DOT = "#F5A623";
  return (
    <div className="flex items-baseline" style={{ fontFamily: FONT }}>
      <span className="font-extrabold text-base md:text-lg tracking-tight" style={{ color: BLUE }}>
        Trip
      </span>
      <span className="font-extrabold text-base md:text-lg" style={{ color: DOT }}>
        .
      </span>
      <span className="font-extrabold text-base md:text-lg tracking-tight" style={{ color: BLUE }}>
        com
      </span>
    </div>
  );
}

function AgodaLogo() {
  const dots = ["#E04F4F", "#E8A848", "#5DBA5D", "#4A9DD4", "#A06FB8"];
  return (
    <div className="flex flex-col items-center" style={{ fontFamily: FONT }}>
      <span className="font-bold text-base md:text-lg lowercase tracking-tight" style={{ color: "#5A5C66" }}>
        agoda
      </span>
      <div className="flex gap-[3px] mt-0.5">
        {dots.map((c, i) => (
          <span key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: c }} />
        ))}
      </div>
    </div>
  );
}

function BookingLogo() {
  return (
    <div className="flex items-baseline" style={{ fontFamily: FONT }}>
      <span className="font-bold text-base md:text-lg" style={{ color: "#003B95" }}>
        Booking
      </span>
      <span className="font-bold text-base md:text-lg" style={{ color: "#0071C2" }}>
        .com
      </span>
    </div>
  );
}

function TrustStrip() {
  return (
    <section className="pt-2 md:pt-4 pb-14 md:pb-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div
            className="rounded-2xl px-5 md:px-8 py-5 md:py-6 border flex flex-col md:flex-row items-center gap-6 md:gap-8"
            style={{
              backgroundColor: RED_BG,
              borderColor: RED_BORDER,
            }}
          >
            <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: RED }}
              >
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p
                  className="font-display text-base md:text-lg leading-tight"
                  style={{ color: DARK }}
                >
                  Book on platforms you trust.
                </p>
                <p
                  className="font-display text-base md:text-lg font-bold leading-tight mt-0.5"
                  style={{ color: RED }}
                >
                  Use ChinaPal for local judgment.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 md:gap-8 shrink-0">
              <TripComLogo />
              <AgodaLogo />
              <BookingLogo />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p
            className="text-center text-sm italic mt-3 font-body"
            style={{ color: BODY, fontFamily: FONT }}
          >
            Book there. Ask us what&apos;s worth booking.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   VIGNETTE — micro-story told in two photos + a chat bubble.
   Photos in /public/places/ — swap any src to retune the story.
   ════════════════════════════════════════════════════════════ */

function Vignette() {
  return (
    <section
      className="py-14 md:py-20 px-4"
      style={{ backgroundColor: CREAM }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Beat 1 — the everyday scene */}
        <Reveal>
          <div
            className="relative rounded-2xl overflow-hidden mb-3 shadow-sm"
            style={{ aspectRatio: "16 / 9" }}
          >
            <img
              src="/places/0c864b19a4db.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <p
              className="absolute bottom-4 left-5 right-5 text-white font-display text-base md:text-lg leading-tight"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.4)" }}
            >
              Tuesday evening. You&apos;re standing on the busy street.
            </p>
          </div>
        </Reveal>

        {/* Chat interlude — the moment of asking */}
        <Reveal delay={0.1}>
          <div className="my-5 md:my-7 max-w-md mx-auto px-2">
            <div className="flex justify-end mb-2">
              <div
                className="text-white rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed max-w-[88%] font-body"
                style={{ backgroundColor: RED, fontFamily: FONT }}
              >
                Where do locals actually eat near here?
              </div>
            </div>
            <div className="flex justify-start gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center font-display font-bold text-[10px] shrink-0 mt-0.5"
                style={{ backgroundColor: RED_BG, color: RED }}
              >
                CP
              </div>
              <div
                className="bg-white rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-relaxed max-w-[88%] font-body"
                style={{
                  border: "1px solid oklch(0.93 0.005 80)",
                  color: DARK,
                  fontFamily: FONT,
                }}
              >
                Two streets east. Red awning, no English menu. Order the
                xiaolongbao.
              </div>
            </div>
          </div>
        </Reveal>

        {/* Beat 2 — the unlocked moment */}
        <Reveal delay={0.2}>
          <div
            className="relative rounded-2xl overflow-hidden shadow-sm"
            style={{ aspectRatio: "16 / 9" }}
          >
            <img
              src="/places/1174ef6b56fa.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <p
              className="absolute bottom-4 left-5 right-5 text-white font-display text-base md:text-lg leading-tight"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.4)" }}
            >
              The dumplings you&apos;d never have found.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p
            className="text-center font-body italic mt-6 text-sm md:text-base"
            style={{ color: BODY, fontFamily: FONT }}
          >
            Same evening. Different memory.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   GALLERY — "moments ChinaPal unlocks." Pure seduction wall.
   Photos in /public/places/ — caption-driven, swap srcs to taste.
   ════════════════════════════════════════════════════════════ */

const GALLERY_TILES: { src: string; caption: string }[] = [
  { src: "/places/guanyinge-teahouse.jpg", caption: "300-year teahouse, last coal stove in Sichuan" },
  { src: "/places/luzu-temple-fire.jpg", caption: "Fire-breathing on a 1923 temple stage" },
  { src: "/places/wulong-arches.jpg", caption: "Karst arches where Transformers filmed" },
  { src: "/places/via-ferrata-yangtze.jpg", caption: "Cliff walk above the Yangtze" },
  { src: "/places/liziba-train.jpg", caption: "The train that pierces a building" },
  { src: "/places/xiahaoli-stilt-houses.jpg", caption: "Stilt houses descending to the river" },
  { src: "/places/paramount-livehouse.jpg", caption: "Mandopop in a 1933 ballroom" },
  { src: "/places/east-suburb-memory.jpg", caption: "Soviet factory turned art zone at dusk" },
  { src: "/places/liyuan-face-changing.jpg", caption: "Face-changing two minutes from Taikoo Li" },
];

function Gallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const firstTile = el.querySelector<HTMLElement>("[data-tile]");
    const step = (firstTile?.offsetWidth ?? 280) + 16; // tile width + gap
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-14 md:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-8 md:mb-10">
            <h2
              className="font-display text-4xl md:text-5xl font-bold mb-3 leading-tight"
              style={{ color: DARK }}
            >
              The China most travelers
              <br />
              <em className="not-italic" style={{ color: RED }}>
                never see.
              </em>
            </h2>
            <p
              className="text-base md:text-lg max-w-xl mx-auto font-body"
              style={{ color: BODY, fontFamily: FONT }}
            >
              A few of the moments ChinaPal can hand you.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative">
            {/* Left arrow — desktop */}
            <button
              aria-label="Previous"
              onClick={() => scrollByAmount("left")}
              className="hidden md:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-stone-200 items-center justify-center hover:bg-stone-50 transition-colors"
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
            >
              <ChevronLeft className="w-4 h-4" style={{ color: DARK }} />
            </button>

            {/* Tiles */}
            <div
              ref={scrollRef}
              className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 scrollbar-hide"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {GALLERY_TILES.map((tile, i) => (
                <div
                  key={i}
                  data-tile
                  className="relative shrink-0 w-[72vw] sm:w-64 md:w-72 lg:w-80 aspect-square rounded-xl overflow-hidden snap-center group shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={tile.src}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  <p
                    className="absolute bottom-3 left-3 right-3 text-white text-sm leading-snug font-body"
                    style={{
                      fontFamily: FONT,
                      textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                    }}
                  >
                    {tile.caption}
                  </p>
                </div>
              ))}
            </div>

            {/* Right arrow — desktop */}
            <button
              aria-label="Next"
              onClick={() => scrollByAmount("right")}
              className="hidden md:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-stone-200 items-center justify-center hover:bg-stone-50 transition-colors"
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
            >
              <ChevronRight className="w-4 h-4" style={{ color: DARK }} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   USE CASES — chat-style cards
   ════════════════════════════════════════════════════════════ */

type UseCase = {
  label: string;
  q: string;
  photo: string;
  place: string;
  reply: string;
  chips: string[];
};

function UseCases() {
  const cases: UseCase[] = [
    {
      label: "Food",
      q: "Where should we eat near Jing'an tonight?",
      photo: "/places/11fa9b341879.webp",
      place: "Lao Shanghai Lamian",
      reply:
        "Locals queue for the lamb hand-pulled noodles. Order chili oil on the side and a plate of cold cucumber.",
      chips: ["8 min walk", "Open till 10pm", "Cash or WeChat Pay"],
    },
    {
      label: "Hotel area",
      q: "Is this hotel location good for first-time visitors?",
      photo: "/places/1219ab9b93f6.jpg",
      place: "Quick read on the neighborhood",
      reply:
        "Between two metro stations, street-level food everywhere, and quieter at night. Solid pick for first-time visitors.",
      chips: ["Metro × 2", "Food nearby", "Quiet evenings"],
    },
    {
      label: "Mini day plan",
      q: "We just finished Yu Garden. What next?",
      photo: "/places/12f4e758e918.jpg",
      place: "Wukang Road at golden hour",
      reply:
        "Metro 4 stops west, walk Wukang Road for design shops and cafés, finish at the Bund for sunset around 5:10pm. Sending the route now.",
      chips: ["45 min", "Cafés", "Golden hour"],
    },
    {
      label: "Day trip decision",
      q: "Suzhou or Zhujiajiao?",
      photo: "/places/19ffda836395.jpg",
      place: "We'd pick Zhujiajiao",
      reply:
        "Suzhou's gardens need a full day. Zhujiajiao is a half-day, less crowded, and easier with kids. Given your dates — Zhujiajiao.",
      chips: ["Half-day", "Less crowded", "Family-friendly"],
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-10 md:mb-12">
            <Eyebrow>What ChinaPal sends back</Eyebrow>
            <h2
              className="font-display text-4xl md:text-5xl font-bold mb-3"
              style={{ color: DARK }}
            >
              Ask anything.{" "}
              <em className="not-italic" style={{ color: RED }}>
                Get a real answer.
              </em>
            </h2>
            <p
              className="text-base md:text-lg max-w-xl mx-auto font-body"
              style={{ color: BODY, fontFamily: FONT }}
            >
              A photo, a recommendation, and the practical details — every time.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {cases.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06}>
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest mb-4 font-body"
                  style={{ color: RED, fontFamily: FONT }}
                >
                  {c.label}
                </p>

                {/* User question */}
                <div className="flex justify-end mb-3">
                  <div
                    className="text-white rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed max-w-[85%] font-body"
                    style={{ backgroundColor: RED, fontFamily: FONT }}
                  >
                    {c.q}
                  </div>
                </div>

                {/* ChinaPal reply — image-rich card */}
                <div className="flex justify-start gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center font-display font-bold text-[10px] shrink-0 mt-0.5"
                    style={{ backgroundColor: RED_BG, color: RED }}
                  >
                    CP
                  </div>
                  <div
                    className="rounded-2xl rounded-bl-md overflow-hidden max-w-[88%] shadow-sm"
                    style={{
                      backgroundColor: "white",
                      border: "1px solid oklch(0.93 0.005 80)",
                    }}
                  >
                    <div
                      className="relative w-full overflow-hidden"
                      style={{ aspectRatio: "16 / 10" }}
                    >
                      <img
                        src={c.photo}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-4 pt-3 pb-3.5">
                      <p
                        className="font-display font-bold text-sm leading-tight mb-1"
                        style={{ color: DARK }}
                      >
                        {c.place}
                      </p>
                      <p
                        className="text-sm leading-relaxed font-body"
                        style={{ color: BODY, fontFamily: FONT }}
                      >
                        {c.reply}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {c.chips.map((chip) => (
                          <span
                            key={chip}
                            className="px-2 py-0.5 rounded-full text-[10px] font-medium font-body"
                            style={{
                              backgroundColor: RED_BG,
                              color: RED,
                              fontFamily: FONT,
                            }}
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   PRICING — two cards, Pass highlighted in red
   ════════════════════════════════════════════════════════════ */

function Pricing() {
  const plans = [
    {
      name: "Trip Check",
      price: "$19",
      unit: "one-time local review",
      blurb:
        "Send us your itinerary, hotel area, or travel questions. We'll review your plan and show you how to make it smoother, more local, and more realistic.",
      features: [
        "Itinerary review",
        "Hotel area check",
        "Route improvements",
        "What to skip / what to add",
        "Food and neighborhood ideas",
        "One round of local feedback",
      ],
      cta: "Check my trip",
      href: TRIP_CHECK_HREF,
      note: "Best before your trip. Not live on-trip support.",
      highlight: false,
    },
    {
      name: "ChinaPal Pass",
      price: "$39",
      unit: "7 days of local text support",
      blurb:
        "Text a real local team before and during your China trip. We help with planning, food, shopping, routes, ticket guidance, translation, and “what should we do next?” moments.",
      features: [
        "7 days of local text support",
        "Personalized itinerary help",
        "Food, cafe, shopping, and nightlife ideas",
        "Hotel area and neighborhood advice",
        "Attraction and day-trip advice",
        "Ticket guidance before you book",
        "Route and transport suggestions",
        "App chat or WhatsApp support",
      ],
      cta: "Get 7 days of local help",
      href: PASS_HREF,
      note: "Most travelers choose this for first-time China trips.",
      highlight: true,
      tag: "Most popular",
    },
  ];

  return (
    <section
      id="pricing"
      className="py-16 md:py-24 px-4"
      style={{ backgroundColor: CREAM }}
    >
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <Eyebrow>Pricing</Eyebrow>
            <h2
              className="font-display text-4xl md:text-5xl font-bold mb-4"
              style={{ color: DARK }}
            >
              Two ways to get{" "}
              <em className="not-italic" style={{ color: RED }}>
                local help.
              </em>
            </h2>
            <p
              className="text-lg max-w-xl mx-auto font-body"
              style={{ color: BODY, fontFamily: FONT }}
            >
              Pay once. No subscription. 100% satisfaction guarantee.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-start">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1}>
              <div
                className="relative rounded-2xl p-6 md:p-7 flex flex-col h-full"
                style={
                  plan.highlight
                    ? {
                        backgroundColor: RED,
                        border: `1px solid ${RED}`,
                        boxShadow: "0 12px 40px -10px rgba(220, 38, 38, 0.35)",
                      }
                    : {
                        backgroundColor: "white",
                        border: "1px solid oklch(0.93 0.005 80)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      }
                }
              >
                {plan.tag && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className="bg-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm font-body"
                      style={{ color: RED, fontFamily: FONT }}
                    >
                      {plan.tag}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3
                    className="font-display font-bold text-xl mb-1"
                    style={{ color: plan.highlight ? "white" : DARK }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className="text-sm font-body"
                    style={{
                      color: plan.highlight
                        ? "rgba(255,255,255,0.75)"
                        : MUTED,
                      fontFamily: FONT,
                    }}
                  >
                    {plan.unit}
                  </p>
                </div>

                <div className="flex items-baseline gap-2 mb-5">
                  <span
                    className="font-display font-bold text-4xl md:text-5xl"
                    style={{ color: plan.highlight ? "white" : DARK }}
                  >
                    {plan.price}
                  </span>
                </div>

                <p
                  className="text-sm leading-relaxed mb-6 font-body"
                  style={{
                    color: plan.highlight ? "rgba(255,255,255,0.85)" : BODY,
                    fontFamily: FONT,
                  }}
                >
                  {plan.blurb}
                </p>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{
                          color: plan.highlight
                            ? "rgba(255,255,255,0.9)"
                            : RED,
                        }}
                      />
                      <span
                        className="text-sm leading-snug font-body"
                        style={{
                          color: plan.highlight
                            ? "rgba(255,255,255,0.9)"
                            : DARK,
                          fontFamily: FONT,
                        }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <p
                  className="text-xs italic mb-5 font-body"
                  style={{
                    color: plan.highlight
                      ? "rgba(255,255,255,0.55)"
                      : MUTED,
                    fontFamily: FONT,
                  }}
                >
                  {plan.note}
                </p>

                <a
                  href={plan.href}
                  className="w-full text-center font-semibold rounded-full py-3 text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] font-body"
                  style={
                    plan.highlight
                      ? {
                          backgroundColor: "white",
                          color: RED,
                          fontFamily: FONT,
                        }
                      : {
                          backgroundColor: RED,
                          color: "white",
                          fontFamily: FONT,
                        }
                  }
                >
                  {plan.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p
            className="text-center text-sm md:text-base mt-8 max-w-xl mx-auto font-body"
            style={{ color: BODY, fontFamily: FONT }}
          >
            <strong style={{ color: DARK }}>Trip Check</strong> = one-time local
            review. <strong style={{ color: DARK }}>ChinaPal Pass</strong> =
            local help throughout your trip.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   HOW IT WORKS — three steps
   ════════════════════════════════════════════════════════════ */

function HowItWorks() {
  const steps = [
    {
      icon: ClipboardCheck,
      step: "01",
      title: "Choose your plan",
      desc: "Trip Check or 7-day ChinaPal Pass.",
    },
    {
      icon: Compass,
      step: "02",
      title: "Tell us your trip",
      desc: "Share your city, dates, hotel area, travel style, and questions.",
    },
    {
      icon: MessageCircle,
      step: "03",
      title: "Get local help",
      desc: "We reply by app chat or WhatsApp with practical local recommendations.",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <Eyebrow>How it works</Eyebrow>
            <h2
              className="font-display text-4xl md:text-5xl font-bold mb-4"
              style={{ color: DARK }}
            >
              Three steps to a{" "}
              <em className="not-italic" style={{ color: RED }}>
                better China trip.
              </em>
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-3 md:gap-5">
          {steps.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.08}>
              <div className="bg-white rounded-2xl p-6 md:p-7 border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: RED_BG }}
                  >
                    <s.icon className="w-5 h-5" style={{ color: RED }} />
                  </div>
                  <span
                    className="font-display text-xs tracking-widest"
                    style={{ color: MUTED }}
                  >
                    {s.step}
                  </span>
                </div>
                <h3
                  className="font-display font-bold text-lg md:text-xl mb-1.5"
                  style={{ color: DARK }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-sm md:text-base leading-relaxed font-body"
                  style={{ color: BODY, fontFamily: FONT }}
                >
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <p
            className="text-center text-sm md:text-base italic mt-8 font-body"
            style={{ color: BODY, fontFamily: FONT }}
          >
            Your 7-day pass starts when you send your first real support
            message.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   APP OR WHATSAPP
   ════════════════════════════════════════════════════════════ */

function AppOrWhatsApp() {
  return (
    <section
      className="py-16 md:py-24 px-4"
      style={{ backgroundColor: CREAM }}
    >
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="text-center mb-10">
            <h2
              className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight"
              style={{ color: DARK }}
            >
              Pay securely on ChinaPal.
              <br />
              <em className="not-italic" style={{ color: RED }}>
                Chat where you prefer.
              </em>
            </h2>
            <p
              className="text-base md:text-lg max-w-md mx-auto font-body"
              style={{ color: BODY, fontFamily: FONT }}
            >
              Checkout happens on the website — not inside WhatsApp. After
              payment, choose your support channel.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-3 md:gap-5">
          {[
            {
              icon: Smartphone,
              title: "In-app chat",
              desc: "Best for saved plans and organized recommendations you can come back to.",
            },
            {
              icon: MessageCircle,
              title: "WhatsApp",
              desc: "Best for quick on-the-go questions while you’re out exploring.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="bg-white rounded-2xl p-6 md:p-7 border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: RED_BG }}
                >
                  <item.icon className="w-5 h-5" style={{ color: RED }} />
                </div>
                <h3
                  className="font-display font-bold text-lg mb-1.5"
                  style={{ color: DARK }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed font-body"
                  style={{ color: BODY, fontFamily: FONT }}
                >
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   IS / IS NOT
   ════════════════════════════════════════════════════════════ */

function IsIsNot() {
  const isList = [
    "A local China trip advisor by text",
    "Planning and recommendation help",
    "Real human support",
    "China-specific judgment",
    "A way to make your trip feel more local",
  ];
  const isNotList = [
    "A forced package tour",
    "A hotel reseller",
    "A ticket markup service",
    "A generic AI chatbot",
    "A replacement for trusted booking platforms",
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-3 md:gap-5">
          <Reveal>
            <div
              className="rounded-2xl p-7 border border-stone-100 shadow-sm h-full"
              style={{ backgroundColor: CREAM }}
            >
              <h3
                className="font-display font-bold text-2xl mb-5"
                style={{ color: DARK }}
              >
                ChinaPal{" "}
                <em className="not-italic" style={{ color: RED }}>
                  is
                </em>
              </h3>
              <div className="space-y-3">
                {isList.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <Check
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: RED }}
                    />
                    <span
                      className="text-sm md:text-base font-body"
                      style={{ color: DARK, fontFamily: FONT }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              className="rounded-2xl p-7 border border-stone-100 shadow-sm h-full"
              style={{ backgroundColor: CREAM }}
            >
              <h3
                className="font-display font-bold text-2xl mb-5"
                style={{ color: DARK }}
              >
                ChinaPal is <em>not</em>
              </h3>
              <div className="space-y-3">
                {isNotList.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <XIcon
                      className="w-4 h-4 mt-1 flex-shrink-0"
                      style={{ color: MUTED }}
                    />
                    <span
                      className="text-sm md:text-base font-body"
                      style={{ color: BODY, fontFamily: FONT }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   FAQ
   ════════════════════════════════════════════════════════════ */

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid oklch(0.93 0.005 80)" }}>
      <button
        className="w-full flex items-center justify-between py-5 text-left group transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span
          className="text-sm md:text-base font-medium pr-4 font-body group-hover:opacity-70 transition-opacity"
          style={{ color: DARK, fontFamily: FONT }}
        >
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          style={{ color: MUTED }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-200"
        style={{ maxHeight: open ? 240 : 0, opacity: open ? 1 : 0 }}
      >
        <p
          className="text-sm md:text-base leading-relaxed pb-5 font-body"
          style={{ color: BODY, fontFamily: FONT }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "Do you book hotels and tickets for me?",
      a: "You can book on platforms you trust. We help you decide what to book, where to stay, what to do, and how to plan around it.",
    },
    {
      q: "Is this AI or real humans?",
      a: "ChinaPal Pass gives you real local human support by text. AI may help with instant ideas, but the paid support is human-backed.",
    },
    {
      q: "When does my 7-day pass start?",
      a: "It starts when you send your first real support message.",
    },
    {
      q: "Can I use WhatsApp?",
      a: "Yes. After checkout, you can choose app chat or WhatsApp.",
    },
    {
      q: "Who is this best for?",
      a: "First-time China travelers, couples, families, and independent travelers who want local help without joining a group tour.",
    },
    {
      q: "What if my trip is complex?",
      a: "For multi-city trips, large groups, or detailed full planning, contact us for a custom quote.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-16 md:py-24 px-4"
      style={{ backgroundColor: CREAM }}
    >
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <div className="text-center mb-10">
            <h2
              className="font-display text-4xl md:text-5xl font-bold"
              style={{ color: DARK }}
            >
              Frequently asked questions
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bg-white rounded-2xl px-6 md:px-8 border border-stone-100 shadow-sm">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   FINAL CTA — dark section
   ════════════════════════════════════════════════════════════ */

function FinalCTA() {
  return (
    <section className="py-24 px-4" style={{ backgroundColor: DARK }}>
      <Reveal>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-[1.05]">
            Better China trips start with
            <br />
            <em className="not-italic" style={{ color: RED_LIGHT }}>
              better local choices.
            </em>
          </h2>
          <p
            className="text-lg mb-10 max-w-xl mx-auto font-body"
            style={{ color: "rgba(255,255,255,0.65)", fontFamily: FONT }}
          >
            Text ChinaPal before and during your trip for planning,
            recommendations, and local judgment.
          </p>
          <div className="flex flex-row flex-wrap justify-center gap-3">
            <a
              href={PASS_HREF}
              className="text-white font-semibold px-8 py-4 rounded-full text-base transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2 font-body"
              style={{ backgroundColor: RED, fontFamily: FONT }}
            >
              Get 7 days of local help — $39
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={TRIP_CHECK_HREF}
              className="font-semibold px-8 py-4 rounded-full text-base border border-white/30 text-white hover:bg-white/10 transition-all inline-flex items-center gap-2 font-body bg-transparent"
              style={{ fontFamily: FONT }}
            >
              Check my trip — $19
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   STICKY MOBILE CTA
   ════════════════════════════════════════════════════════════ */

function StickyMobileCTA() {
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pt-3"
      style={{
        background:
          "linear-gradient(to top, oklch(0.985 0.005 80) 65%, transparent)",
      }}
    >
      <a
        href={PASS_HREF}
        className="flex items-center justify-center gap-2 w-full text-white font-semibold text-sm py-3.5 rounded-full active:scale-[0.98] transition-transform font-body"
        style={{
          backgroundColor: RED,
          boxShadow: "0 10px 30px rgba(220, 38, 38, 0.4)",
          fontFamily: FONT,
        }}
      >
        Get 7 days of local help — $39
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════ */

export default function HomePage2() {
  return (
    <div className="min-h-screen pb-24 md:pb-0" style={{ backgroundColor: CREAM }}>
      <Navbar />
      <Hero />
      <ValueCards />
      <TrustStrip />
      <Gallery />
      <UseCases />
      <Pricing />
      <HowItWorks />
      <AppOrWhatsApp />
      <IsIsNot />
      <FAQ />
      <FinalCTA />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
