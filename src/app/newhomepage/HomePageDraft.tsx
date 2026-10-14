"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ClipboardCheck,
  Compass,
  Send,
  TrainFront,
  ShoppingBag,
  CarFront,
  Languages,
  CalendarCheck,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { PLANS } from "@/lib/plans";
import styles from "./draft.module.css";
import Navbar from "./DraftNavbar";
import Footer from "./DraftFooter";

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
const MUTED = "oklch(0.48 0.01 260)";
const CREAM = "oklch(0.985 0.005 80)";
const FONT = "'Plus Jakarta Sans', sans-serif";

/* ════════════════════════════════════════════════════════════
   HERO — dark bg image, white headline with red emphasis
   ════════════════════════════════════════════════════════════ */

function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [heroSrc, setHeroSrc] = useState(HERO_BG);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ backgroundColor: DARK }}>
        <Image
          fill
          unoptimized
          preload
          sizes="100vw"
          src={heroSrc}
          onError={() => setHeroSrc("/places/wulong-arches.jpg")}
          alt=""
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
                  Local China travel support
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-6">
                  Travel China independently.
                  <br />
                  <em className="not-italic" style={{ color: RED_LIGHT }}>
                    With a local on your side.
                  </em>
                </h1>

                <p
                  className="text-base md:text-lg text-white/90 mb-8 max-w-md leading-relaxed font-body"
                  style={{ fontFamily: FONT }}
                >
                  From planning your itinerary to train tickets, attraction
                  bookings, local purchases, transport, recommendations and
                  last-minute problems — message our real team in China before
                  and during your trip.
                </p>

                <div className="flex flex-row flex-wrap gap-3">
                  <a
                    href={PASS_HREF}
                    className="text-white font-semibold px-8 py-4 rounded-full text-base transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 font-body"
                    style={{ backgroundColor: RED, fontFamily: FONT }}
                  >
                    Get ChinaPal — ${PLANS["chinapal-pass"].price}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={TRIP_CHECK_HREF}
                    className="font-semibold px-8 py-4 rounded-full text-base border border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2 font-body bg-transparent"
                    style={{ fontFamily: FONT }}
                  >
                    Check my itinerary
                  </a>
                </div>

                <p className="text-sm text-white/90 mt-5 font-body">
                  7 days of support · App chat or WhatsApp
                </p>
                <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-2 mt-7 text-sm text-white/90 font-body">
                  {[
                    "Real people in China",
                    "Help before & during your trip",
                    "Travel independently",
                    "No package tour required",
                  ].map((text) => (
                    <li key={text} className="flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                      {text}
                    </li>
                  ))}
                </ul>
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
                Your team in China
              </p>
            </div>
          </div>
          <span
            className="text-[10px] font-body"
            style={{ color: MUTED, fontFamily: FONT }}
          >
            Example chat
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
                This booking app asks for a Chinese phone number. Can you help?
              </div>
              <p
                className="text-[10px] mt-1 text-right font-body"
                style={{ color: MUTED, fontFamily: FONT }}
              >
                Traveler
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
                Send us the booking page and your preferred date. We&apos;ll
                check the requirements and help you work out the next step.
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

function ProblemStatement() {
  return (
    <section className="py-14 md:py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 md:gap-12 items-center">
        <h2
          className="font-display text-3xl md:text-4xl font-bold leading-tight"
          style={{ color: DARK }}
        >
          China is incredible.
          <br />
          <span style={{ color: RED }}>
            Some of the practical stuff isn&apos;t simple.
          </span>
        </h2>
        <div
          className="font-body text-base leading-relaxed space-y-4"
          style={{ color: BODY }}
        >
          <p>
            Train release times, Chinese-only booking systems, WeChat
            mini-programs, local phone-number requirements and unfamiliar maps
            can make an independent trip harder than it needs to be.
          </p>
          <p style={{ color: DARK }}>
            With ChinaPal, you have someone local to message when you need help
            figuring it out.
          </p>
        </div>
      </div>
    </section>
  );
}

function ValueCards() {
  const values = [
    {
      icon: ClipboardCheck,
      title: "Plan a realistic itinerary",
      desc: "Send your draft China itinerary. We’ll help spot rushed days, awkward transfers, closures and better ways to organize your trip.",
    },
    {
      icon: TrainFront,
      title: "Navigate trains & tickets",
      desc: "Get help with China train tickets, release times, station choices, ticket rules, attraction reservations and Chinese booking systems.",
    },
    {
      icon: CalendarCheck,
      title: "Arrange tricky local bookings",
      desc: "If something is difficult to arrange from overseas, we can help with selected local tickets, transport or reservations where available.",
    },
    {
      icon: ShoppingBag,
      title: "Find & buy things in China",
      desc: "We can check Chinese stores and platforms, compare options and help arrange local purchases when practical.",
    },
    {
      icon: CarFront,
      title: "Solve transport questions",
      desc: "Airports, railway stations, private transfers, DiDi, luggage and route choices — ask before you move.",
    },
    {
      icon: MessageCircle,
      title: "Get help when plans change",
      desc: "Too tired? Weather changed? Send us a message and we’ll help you work out a practical Plan B.",
    },
    {
      icon: MapPin,
      title: "Find places worth going",
      desc: "Food, neighborhoods, family activities, shopping or nightlife — find places that fit the trip you want.",
    },
    {
      icon: Languages,
      title: "Bridge the language gap",
      desc: "When a booking page, business or local service is difficult to communicate with, we can help you understand what to do next.",
    },
  ];
  return (
    <section className="py-14 md:py-20 px-4" style={{ backgroundColor: CREAM }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Eyebrow>Practical help, from real people</Eyebrow>
          <h2
            className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight"
            style={{ color: DARK }}
          >
            One message. A lot less figuring things out.
          </h2>
          <p className="font-body text-base md:text-lg" style={{ color: BODY }}>
            Ask us before your trip or while you&apos;re already in China.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: RED_BG }}
              >
                <v.icon
                  className="w-4 h-4"
                  style={{ color: RED }}
                  aria-hidden="true"
                />
              </div>
              <h3
                className="font-display font-bold text-lg mb-2"
                style={{ color: DARK }}
              >
                {v.title}
              </h3>
              <p
                className="text-sm leading-relaxed font-body"
                style={{ color: BODY }}
              >
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const GALLERY_TILES: { src: string; caption: string }[] = [
  {
    src: "/places/guanyinge-teahouse.jpg",
    caption: "300-year teahouse, last coal stove in Sichuan",
  },
  {
    src: "/places/luzu-temple-fire.jpg",
    caption: "Fire-breathing on a 1923 temple stage",
  },
  {
    src: "/places/wulong-arches.jpg",
    caption: "Karst arches where Transformers filmed",
  },
  {
    src: "/places/via-ferrata-yangtze.jpg",
    caption: "Cliff walk above the Yangtze",
  },
  {
    src: "/places/liziba-train.jpg",
    caption: "The train that pierces a building",
  },
  {
    src: "/places/xiahaoli-stilt-houses.jpg",
    caption: "Stilt houses descending to the river",
  },
  {
    src: "/places/paramount-livehouse.jpg",
    caption: "Mandopop in a 1933 ballroom",
  },
  {
    src: "/places/east-suburb-memory.jpg",
    caption: "Soviet factory turned art zone at dusk",
  },
  {
    src: "/places/liyuan-face-changing.jpg",
    caption: "Face-changing two minutes from Taikoo Li",
  },
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
              Find the China
              <br />
              <em className="not-italic" style={{ color: RED }}>
                you came for.
              </em>
            </h2>
            <p
              className="text-base md:text-lg max-w-xl mx-auto font-body"
              style={{ color: BODY, fontFamily: FONT }}
            >
              Tell us what you actually enjoy — street food, design,
              photography, family activities, nightlife, quiet neighborhoods or
              scenic detours. We’ll help you find places that fit your trip.
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
                  <Image
                    fill
                    sizes="(max-width: 639px) 72vw, (max-width: 767px) 256px, (max-width: 1023px) 288px, 320px"
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

function UseCases() {
  const cases = [
    {
      label: "Attraction bookings",
      q: "I can’t book the Summer Palace. It keeps asking for a Chinese phone number.",
      reply:
        "Send us your preferred date and time. We’ll check the booking requirements and help you work out the easiest way to arrange it.",
    },
    {
      label: "Train tickets",
      q: "When do our Shanghai → Beijing train tickets go on sale?",
      reply:
        "We’ll check the release date and station, and help you prepare the passenger details so you’re ready when booking opens.",
    },
    {
      label: "Buying locally",
      q: "We need a child hiking carrier when we arrive in Shanghai. Can you help us find one?",
      reply:
        "We can check local stores and Chinese shopping platforms, compare suitable options and help arrange a purchase if a suitable carrier is available.",
    },
    {
      label: "Maps & locations",
      q: "Google says our hotel is a 15-minute walk from this attraction. Is that right?",
      reply:
        "Send us the hotel and attraction. We’ll check the location using local map data and tell you the realistic travel time.",
    },
    {
      label: "Changing plans",
      q: "We’re exhausted and won’t make everything we planned today. What should we skip?",
      reply:
        "Send us where you are and what’s left on your plan. We’ll help simplify the day without missing the things you care about most.",
    },
    {
      label: "Food & neighborhoods",
      q: "Where should we eat near Jing’an tonight?",
      reply:
        "Tell us what you feel like eating, your budget and how far you want to walk. We’ll narrow it down.",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-10 md:mb-12">
            <Eyebrow>Example conversations</Eyebrow>
            <h2
              className="font-display text-4xl md:text-5xl font-bold mb-3"
              style={{ color: DARK }}
            >
              Whatever comes up in China,{" "}
              <em className="not-italic" style={{ color: RED }}>
                just message us.
              </em>
            </h2>
            <p
              className="text-base md:text-lg max-w-xl mx-auto font-body"
              style={{ color: BODY, fontFamily: FONT }}
            >
              From “Where should we eat?” to “Why won’t this booking app accept
              my passport?” — we’ll help you work out what to do next.
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

                {/* ChinaPal reply */}
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
                    <div className="px-4 pt-3 pb-3.5">
                      <p
                        className="font-display font-bold text-sm leading-tight mb-1"
                        style={{ color: DARK }}
                      >
                        ChinaPal
                      </p>
                      <p
                        className="text-sm leading-relaxed font-body"
                        style={{ color: BODY, fontFamily: FONT }}
                      >
                        {c.reply}
                      </p>
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
      name: "Itinerary Check",
      price: `$${PLANS["trip-check"].price}`,
      unit: PLANS["trip-check"].unit,
      blurb:
        "Already planned your trip? Send your draft and we’ll review the route for unrealistic days, backtracking, difficult transfers, closures and ways to make it smoother.",
      features: [
        "Itinerary review",
        "Hotel area check",
        "Route improvements",
        "What to skip / what to add",
        "Food and neighborhood ideas",
        "One round of local feedback",
      ],
      cta: "Check my itinerary",
      href: TRIP_CHECK_HREF,
      note: "Best before your trip. Not live on-trip support.",
      highlight: false,
    },
    {
      name: "ChinaPal Pass",
      price: `$${PLANS["chinapal-pass"].price}`,
      unit: "7 days of China travel support",
      blurb:
        "Your local China team by message during your active support period. Ask before departure or while you’re traveling, using app chat or WhatsApp.",
      features: [
        "Itinerary questions",
        "Train & attraction help",
        "China-specific booking guidance",
        "Selected local booking assistance",
        "Transport questions",
        "Shopping & local sourcing help",
        "Local recommendations",
        "Translation / communication help",
        "Last-minute plan changes",
      ],
      cta: "Get ChinaPal",
      href: PASS_HREF,
      note: "Your 7 days start with your first real support message.",
      highlight: true,
      tag: "Before & during your trip",
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
              Pay once. No subscription. Prices in USD.
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
                      className="bg-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 whitespace-nowrap rounded-full shadow-sm font-body"
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
                      color: plan.highlight ? "rgba(255,255,255,0.75)" : MUTED,
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
                          color: plan.highlight ? "rgba(255,255,255,0.9)" : RED,
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
                    color: plan.highlight ? "rgba(255,255,255,0.85)" : MUTED,
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
            ChinaPal’s fee covers our support. Tickets, transport, products and
            other third-party services are separate. We’ll explain any cost and
            get your approval before arranging anything.
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
      title: "Tell us about your trip",
      desc: "Dates, cities, your rough itinerary, what you enjoy and anything you’re already worried about.",
    },
    {
      icon: Compass,
      step: "02",
      title: "Message when you need help",
      desc: "Before departure or while traveling, send your question, screenshot, location or problem by app chat or WhatsApp.",
    },
    {
      icon: MessageCircle,
      step: "03",
      title: "You make the final call",
      desc: "We’ll give you practical local options and, where applicable, help arrange selected things after you approve them.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <Eyebrow>How it works</Eyebrow>
            <h2
              className="font-display text-4xl md:text-5xl font-bold mb-4"
              style={{ color: DARK }}
            >
              Travel independently.{" "}
              <em className="not-italic" style={{ color: RED }}>
                We’re one message away.
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

function CustomerStory() {
  return (
    <section
      id="traveler-story"
      className="py-14 md:py-20 px-4"
      style={{ backgroundColor: CREAM }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl md:text-5xl font-bold leading-tight mb-10 max-w-3xl"
          style={{ color: DARK }}
        >
          What having a local on your side looks like
        </h2>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
          <figure>
            <Image
              src="/newhomepage/aamir.jpg"
              width={1200}
              height={1600}
              sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1056px) calc((100vw - 64px) / 2), 484px"
              alt="A group of adults and a child outdoors, holding a ChinaPal banner."
              className="w-full h-auto rounded-2xl"
            />
          </figure>
          <div>
            <Eyebrow>Real ChinaPal traveler</Eyebrow>
            <blockquote
              className="font-display text-3xl lg:text-4xl font-bold leading-tight mb-5"
              style={{ color: DARK }}
            >
              “You&apos;ve been an amazing help from the very start.”
            </blockquote>
            <p className="font-body font-semibold" style={{ color: DARK }}>
              Aamir
            </p>
            <p className="font-body text-sm mb-6" style={{ color: BODY }}>
              Family trip across China
            </p>
            <p
              className="font-body text-base leading-relaxed mb-6"
              style={{ color: BODY }}
            >
              Aamir was planning a multi-city family trip through China and
              wanted to travel independently. ChinaPal helped refine the
              itinerary, track train-ticket release dates, navigate attraction
              bookings and research local products, with help as practical
              questions came up.
            </p>
            <ul
              className="space-y-2 mb-7 font-body text-sm"
              style={{ color: DARK }}
            >
              {[
                "Multi-city itinerary advice",
                "Train-ticket timing & booking help",
                "Attraction booking support",
                "Local product research",
                "On-trip questions & plan changes",
              ].map((text) => (
                <li key={text} className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 shrink-0 mt-1"
                    style={{ color: RED }}
                    aria-hidden="true"
                  />
                  {text}
                </li>
              ))}
            </ul>
            <a
              href={PASS_HREF}
              className="inline-flex items-center gap-2 text-sm font-semibold font-body underline underline-offset-4"
              style={{ color: RED }}
            >
              Travel with a local on your side{" "}
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const answerId = useId();
  return (
    <div style={{ borderBottom: "1px solid oklch(0.93 0.005 80)" }}>
      <button
        className="w-full flex items-center justify-between py-5 text-left group transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={answerId}
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
      <div id={answerId} hidden={!open}>
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
      q: "Is ChinaPal a tour company?",
      a: "No. ChinaPal is for travelers who want to explore China independently. Our real team in China helps with planning, practical questions and local logistics, and can help arrange selected services when needed.",
    },
    {
      q: "Can ChinaPal book train or attraction tickets for me?",
      a: "You can always book things yourself, and we’re happy to guide you. When something is difficult to arrange from overseas, we can also help with selected tickets, transport and local bookings where available. We’ll explain the cost and get your approval before arranging anything.",
    },
    {
      q: "Do I have to book everything through ChinaPal?",
      a: "No. You’re free to use the platforms and services you prefer. ChinaPal helps you make good decisions and steps in when something is difficult to arrange yourself.",
    },
    {
      q: "Can you help while I’m already in China?",
      a: "Yes. During your active ChinaPal support period, message us with practical questions, screenshots, route problems, changing plans and other travel issues.",
    },
    {
      q: "Can you help me buy something locally in China?",
      a: "When practical, yes. We can check local stores or Chinese shopping platforms, compare options and help arrange a local purchase. Product, delivery and other third-party costs are separate.",
    },
    {
      q: "What if my itinerary changes?",
      a: "Message us. Tell us where you are, what changed and what you still want to do, and we’ll help you work out a practical alternative.",
    },
    {
      q: "Are tickets and transport included in the ChinaPal fee?",
      a: "No. The ChinaPal fee covers our support. Train tickets, attraction tickets, cars, tours, products and other third-party purchases are charged separately. We’ll explain costs and get your approval before arranging anything.",
    },
    {
      q: "When does my 7-day pass start?",
      a: "It starts when you send your first real support message.",
    },
    {
      q: "Can I use WhatsApp?",
      a: "Yes. After checkout, you can choose app chat or WhatsApp.",
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
            Travel China yourself.
            <br />
            <em className="not-italic" style={{ color: RED_LIGHT }}>
              Never figure it all out alone.
            </em>
          </h2>
          <p
            className="text-lg mb-10 max-w-xl mx-auto font-body"
            style={{ color: "rgba(255,255,255,0.65)", fontFamily: FONT }}
          >
            Tell us where you’re going and keep exploring China your way. When
            you need local help, ChinaPal is one message away.
          </p>
          <div className="flex flex-row flex-wrap justify-center gap-3">
            <a
              href={PASS_HREF}
              className="text-white font-semibold px-8 py-4 rounded-full text-base transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2 font-body"
              style={{ backgroundColor: RED, fontFamily: FONT }}
            >
              Get ChinaPal — ${PLANS["chinapal-pass"].price}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={TRIP_CHECK_HREF}
              className="font-semibold px-8 py-4 rounded-full text-base border border-white/30 text-white hover:bg-white/10 transition-all inline-flex items-center gap-2 font-body bg-transparent"
              style={{ fontFamily: FONT }}
            >
              Check my itinerary
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
        Get ChinaPal — ${PLANS["chinapal-pass"].price}
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════ */

export default function HomePageDraft() {
  return (
    <div
      className={`${styles.draft} min-h-screen pb-24 md:pb-0`}
      style={{ backgroundColor: CREAM }}
    >
      <Navbar />
      <main>
        <Hero />
        <ProblemStatement />
        <ValueCards />
        <UseCases />
        <HowItWorks />
        <CustomerStory />
        <Gallery />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
