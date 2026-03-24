"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Train,
  Ticket,
  Utensils,
  CreditCard,
  Navigation,
  Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Asset URLs ── */
const HERO_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/mro47e2bMRoWx9zjMkgPGU/chinapal-hero-ebwo5evTUq9eXoXYnyDVwi.webp";
const CHAT_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/mro47e2bMRoWx9zjMkgPGU/chinapal-chat-mock-LPCzeYhXv7WyDsjCEkks5f.webp";
const SCENE_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/mro47e2bMRoWx9zjMkgPGU/chinapal-china-scene-HGGVxnit95R4RTqcWRfwyG.webp";
const ALIPAY_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/mro47e2bMRoWx9zjMkgPGU/chinapal-alipay-setup-5bvaS7tuYfQRsqirzRfqnW.webp";

/* ── Animation ── */
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07 },
  }),
};

/* ── Data ── */
const marqueeItems = [
  "Alipay setup",
  "Train tickets",
  "Attraction bookings",
  "Metro QR codes",
  "Restaurant picks",
  "DiDi taxi",
  "WeChat Pay",
  "Itinerary planning",
  "Local advice",
  "Language help",
  "Things to do",
  "Getting around",
];


const howItWorks = [
  {
    step: "01",
    title: "Purchase your Trip Pass",
    desc: "One flat fee of $49 unlocks 10 days of human-based text support. No subscriptions.",
  },
  {
    step: "02",
    title: "Message us anytime",
    desc: "Text on WhatsApp or WeChat — before your trip for setup, during for real-time help.",
  },
  {
    step: "03",
    title: "Travel with confidence",
    desc: "We handle the friction so you can focus on the experience.",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    location: "London → Shanghai",
    text: "ChinaPal sorted my Alipay in 20 minutes. I'd been struggling for days.",
    stars: 5,
  },
  {
    name: "James K.",
    location: "New York → Beijing",
    text: "Booked all my train tickets through them. They knew exactly which class and platform.",
    stars: 5,
  },
  {
    name: "Lena H.",
    location: "Berlin → Chengdu",
    text: "The restaurant recommendations alone were worth it. Every place was incredible.",
    stars: 5,
  },
];

export interface GuideCard {
  slug: string;
  citySlug: string;
  cityName: string;
  name_en: string;
  name_cn: string;
  type: string;
  time: string;
  img: string;
  href: string;
}

const chatMessages = [
  { from: "user", text: "My Alipay card isn't working — what do I do?" },
  { from: "pal", text: "Try switching to the 'International Card' option in Alipay settings. Go to Me → Bank Cards → Add Card → International. Takes about 2 mins 👍" },
  { from: "user", text: "Which train from Shanghai to Hangzhou?" },
  { from: "pal", text: "Take the G7505 at 09:12 — arrives 09:55. 2nd class is fine, costs ¥73. Book on Trip.com with your passport number." },
];

export default function HomePage({ guides }: { guides: GuideCard[] }) {
  const [activeCity, setActiveCity] = useState<string>("all");

  // Derive unique cities in order
  const cities = Array.from(new Map(guides.map((g) => [g.citySlug, g.cityName])));
  const filteredGuides = (activeCity === "all" ? guides : guides.filter((g) => g.citySlug === activeCity)).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Navbar />

      {/* ══════════════════════════════════════════
          HERO — Superhuman/Intercom dark gradient
          ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMG}
            alt="Traveler in China"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D]/90 via-[#1A0A0A]/80 to-[#2D0808]/70" />
          <div className="absolute inset-0 dot-grid opacity-40" />
        </div>

        <div className="relative z-10 cp-container pt-28 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: headline */}
            <div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0}
              >
                <span className="pill-badge bg-[#DC2626]/20 text-[#FCA5A5] border border-[#DC2626]/30 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
                  Available for your China trip
                </span>
              </motion.div>

              <motion.h1
                className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-6"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={1}
              >
                China travel,
                <br />
                <span className="italic text-[#FCA5A5]">without</span>
                <br />
                the friction.
              </motion.h1>

              <motion.p
                className="font-body text-lg text-white/65 leading-relaxed mb-8 max-w-md"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={2}
              >
                A local expert one text away — for setup, bookings, transport,
                and every question China throws at you.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-3"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={3}
              >
                <a href="https://wa.me/447549879026?text=Hey%21%20I%27m%20planning%20a%20trip%20to%20China%20and%20could%20use%20some%20help%20%F0%9F%87%A8%F0%9F%87%B3" target="_blank" rel="noopener noreferrer" className="btn-primary text-base">
                  Get ChinaPal
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white font-body text-base font-medium transition-colors py-3 px-2"
                >
                  How it works
                  <ChevronRight size={15} />
                </a>
              </motion.div>

              <motion.div
                className="mt-10 flex flex-wrap gap-x-6 gap-y-2"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={4}
              >
                {[
                  "No Chinese SIM needed",
                  "WhatsApp & WeChat",
                  "Pre-trip + in-trip",
                  "Flat fee, no surprises",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs font-body text-white/50">
                    <CheckCircle2 size={12} className="text-[#DC2626]" />
                    {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right: floating chat mockup */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="relative mx-auto max-w-sm">
                <div className="rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)] border border-white/10">
                  <div className="browser-chrome">
                    <div className="browser-dot bg-[#FF5F57]" />
                    <div className="browser-dot bg-[#FEBC2E]" />
                    <div className="browser-dot bg-[#28C840]" />
                    <div className="flex-1 mx-3 bg-white/60 rounded px-3 py-0.5 text-xs font-body text-[#78716C]">
                      chat.chinapal.com
                    </div>
                  </div>
                  <div className="bg-white p-4 space-y-3 min-h-[280px]">
                    <div className="flex items-center gap-2 pb-2 border-b border-[#F4F4F5]">
                      <div className="w-7 h-7 rounded-full bg-[#DC2626] flex items-center justify-center text-white text-xs font-display font-bold">CP</div>
                      <div>
                        <p className="text-xs font-body font-semibold text-[#111110]">ChinaPal</p>
                        <p className="text-[10px] font-body text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />Online</p>
                      </div>
                    </div>
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs font-body leading-relaxed ${
                            msg.from === "user"
                              ? "bg-[#DC2626] text-white rounded-br-sm"
                              : "bg-[#F4F4F5] text-[#111110] rounded-bl-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute -bottom-5 -left-8 glass-card bg-white/90 shadow-lg px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FEF2F2] flex items-center justify-center">
                    <MessageCircle size={15} className="text-[#DC2626]" />
                  </div>
                  <div>
                    <p className="text-xs font-body font-bold text-[#111110]">Avg. response</p>
                    <p className="text-xs font-body text-[#78716C]">Under 30 min</p>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 glass-card bg-white/90 shadow-lg px-3 py-2 flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-[#DC2626] text-[#DC2626]" />)}
                  </div>
                  <span className="text-xs font-body font-semibold text-[#111110]">4.9 / 5</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-white/50" />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MARQUEE — scrolling services strip
          ══════════════════════════════════════════ */}
      <div className="bg-[#DC2626] py-3 overflow-hidden">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="font-body text-sm font-medium text-white/90 whitespace-nowrap px-6 inline-flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white/50 shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          TRUST PILLARS
          ══════════════════════════════════════════ */}

      {/* ══════════════════════════════════════════
          BENTO GRID — Notion feature layout
          ══════════════════════════════════════════ */}
      <section id="included" className="section bg-[#FAFAF9]">
        <div className="cp-container">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <p className="font-body text-xs font-semibold text-[#DC2626] uppercase tracking-widest mb-3">
              What&apos;s included
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-[#111110] mb-4">
              Everything China throws at you,
              <br />
              <span className="italic">handled.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[160px]">
            <motion.div
              className="md:col-span-2 row-span-1 rounded-2xl bg-[#111110] p-6 flex flex-col justify-between card-hover"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <div className="w-10 h-10 rounded-xl bg-[#DC2626]/20 flex items-center justify-center">
                <CreditCard size={18} className="text-[#DC2626]" />
              </div>
              <div>
                <h3 className="font-display text-lg text-white mb-1">Alipay & App Setup</h3>
                <p className="font-body text-xs text-white/50">Get digital payments working before you land.</p>
              </div>
            </motion.div>

            <motion.div
              className="col-span-1 rounded-2xl bg-white border border-[#E7E5E4] p-5 flex flex-col justify-between card-hover"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
            >
              <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
                <Train size={16} className="text-[#DC2626]" />
              </div>
              <div>
                <h3 className="font-display text-sm text-[#111110] mb-0.5">Train & Transport</h3>
                <p className="font-body text-xs text-[#78716C]">High-speed rail, metro, taxis.</p>
              </div>
            </motion.div>

            <motion.div
              className="col-span-1 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] p-5 flex flex-col justify-between card-hover"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
            >
              <div className="w-9 h-9 rounded-xl bg-[#DC2626]/15 flex items-center justify-center">
                <Ticket size={16} className="text-[#DC2626]" />
              </div>
              <div>
                <h3 className="font-display text-sm text-[#111110] mb-0.5">Attraction Tickets</h3>
                <p className="font-body text-xs text-[#78716C]">Skip the queues.</p>
              </div>
            </motion.div>

            <motion.div
              className="col-span-1 rounded-2xl bg-white border border-[#E7E5E4] p-5 flex flex-col justify-between card-hover"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={3}
            >
              <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
                <Utensils size={16} className="text-[#DC2626]" />
              </div>
              <div>
                <h3 className="font-display text-sm text-[#111110] mb-0.5">Restaurant Picks</h3>
                <p className="font-body text-xs text-[#78716C]">Local, not tourist traps.</p>
              </div>
            </motion.div>

            <motion.div
              className="col-span-1 rounded-2xl bg-white border border-[#E7E5E4] p-5 flex flex-col justify-between card-hover"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={4}
            >
              <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
                <Navigation size={16} className="text-[#DC2626]" />
              </div>
              <div>
                <h3 className="font-display text-sm text-[#111110] mb-0.5">Getting Around</h3>
                <p className="font-body text-xs text-[#78716C]">Step-by-step directions.</p>
              </div>
            </motion.div>

            <motion.div
              className="md:col-span-2 col-span-2 rounded-2xl bg-[#111110] p-5 flex items-center gap-5 card-hover"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={5}
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <MessageCircle size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-display text-base text-white mb-0.5">Any China Question</h3>
                <p className="font-body text-xs text-white/50">Culture, customs, language, logistics — just ask.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════════ */}
      <section id="how-it-works" className="section bg-white">
        <div className="cp-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <p className="font-body text-xs font-semibold text-[#DC2626] uppercase tracking-widest mb-3">
                  How it works
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-[#111110] mb-10">
                  Simple as sending
                  <br />
                  <span className="italic">a message.</span>
                </h2>
              </motion.div>

              <div className="space-y-8">
                {howItWorks.map((step, i) => (
                  <motion.div
                    key={step.step}
                    className="flex gap-5 group"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i}
                  >
                    <div className="shrink-0 w-10 h-10 rounded-full border-2 border-[#E7E5E4] group-hover:border-[#DC2626] transition-colors flex items-center justify-center">
                      <span className="font-display text-sm text-[#DC2626]">{step.step}</span>
                    </div>
                    <div className="pt-1.5">
                      <h3 className="font-display text-lg text-[#111110] mb-1.5">{step.title}</h3>
                      <p className="font-body text-sm text-[#78716C] leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={3}
              >
                <a href="https://wa.me/447549879026?text=Hey%21%20I%27m%20planning%20a%20trip%20to%20China%20and%20could%20use%20some%20help%20%F0%9F%87%A8%F0%9F%87%B3" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Chat with us
                  <ArrowRight size={16} />
                </a>
              </motion.div>
            </div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-2xl overflow-hidden shadow-[0_8px_48px_rgba(0,0,0,0.12)] border border-[#E7E5E4]">
                <div className="browser-chrome">
                  <div className="browser-dot bg-[#FF5F57]" />
                  <div className="browser-dot bg-[#FEBC2E]" />
                  <div className="browser-dot bg-[#28C840]" />
                  <div className="flex-1 mx-3 bg-white/80 rounded px-3 py-0.5 text-xs font-body text-[#78716C]">
                    chat.chinapal.com
                  </div>
                </div>
                <img
                  src={CHAT_IMG}
                  alt="ChinaPal chat conversation"
                  className="w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SCENE BREAK
          ══════════════════════════════════════════ */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={SCENE_IMG}
          alt="China"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111110]/70 via-[#111110]/30 to-transparent" />
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="absolute bottom-0 left-0 right-0 cp-container pb-10">
          <p className="font-display text-2xl md:text-4xl text-white italic max-w-xl">
            &ldquo;China is incredible. Getting around it shouldn&apos;t be hard.&rdquo;
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════════ */}
      <section className="section bg-[#FAFAF9]">
        <div className="cp-container">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p className="font-body text-xs font-semibold text-[#DC2626] uppercase tracking-widest mb-3">
              Traveler stories
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-[#111110]">
              What travelers say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-white rounded-2xl border border-[#E7E5E4] p-6 card-hover"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={13} className="fill-[#DC2626] text-[#DC2626]" />
                  ))}
                </div>
                <p className="font-body text-sm text-[#111110] leading-relaxed mb-5 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FEF2F2] flex items-center justify-center text-xs font-display font-bold text-[#DC2626]">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-body font-semibold text-[#111110]">{t.name}</p>
                    <p className="text-xs font-body text-[#A8A29E]">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          DESTINATION GUIDES — card grid
          ══════════════════════════════════════════ */}
      <section id="guides" className="section bg-white">
        <div className="cp-container">
          <motion.div
            className="mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="mb-6">
              <p className="font-body text-xs font-semibold text-[#DC2626] uppercase tracking-widest mb-3">
                Free resources
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-[#111110]">
                Guides to China&apos;s
                <br />
                <span className="italic">top attractions.</span>
              </h2>
            </div>

            {/* City filter tags */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCity("all")}
                className={`font-body text-sm px-4 py-1.5 rounded-full border transition-all ${
                  activeCity === "all"
                    ? "bg-[#111110] text-white border-[#111110]"
                    : "bg-white text-[#52525B] border-[#E7E5E4] hover:border-[#111110]"
                }`}
              >
                All
              </button>
              {cities.map(([slug, name]) => (
                <button
                  key={slug}
                  onClick={() => setActiveCity(slug)}
                  className={`font-body text-sm px-4 py-1.5 rounded-full border transition-all ${
                    activeCity === slug
                      ? "bg-[#111110] text-white border-[#111110]"
                      : "bg-white text-[#52525B] border-[#E7E5E4] hover:border-[#111110]"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCity}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {filteredGuides.map((g) => (
                <Link
                  key={g.slug}
                  href={g.href}
                  className="group block bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden hover:border-[#DC2626] hover:shadow-lg transition-all no-underline"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={g.img}
                      alt={g.name_en}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg text-[#111110] leading-tight">
                      {g.name_en}
                      <span className="font-body text-sm text-[#A8A29E] ml-2">{g.name_cn}</span>
                    </h3>
                    <p className="font-body text-sm text-[#78716C] mt-1">
                      {g.cityName} · {g.type} · {g.time}
                    </p>
                  </div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ALIPAY FEATURE ROW
          ══════════════════════════════════════════ */}
      <section className="section bg-[#FAFAF9]">
        <div className="cp-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={ALIPAY_IMG}
                alt="Alipay setup"
                className="w-full h-80 object-cover rounded-2xl"
              />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2.5">
                <span className="text-xl">💳</span>
                <div>
                  <p className="text-xs font-body font-semibold text-[#111110]">Alipay setup</p>
                  <p className="text-xs font-body text-[#78716C]">~20 minutes</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <p className="font-body text-xs font-semibold text-[#DC2626] uppercase tracking-widest mb-3">
                The hardest part, solved
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-[#111110] mb-5">
                Alipay, WeChat Pay,
                <br />
                <span className="italic">and everything in between.</span>
              </h2>
              <p className="font-body text-[#78716C] text-base leading-relaxed mb-6">
                China runs on mobile payments. Without Alipay or WeChat Pay set up correctly,
                you can&apos;t pay at most restaurants, shops, or attractions. We walk you through
                the entire setup — step by step — before you board your flight.
              </p>
              <div className="space-y-3">
                {[
                  "Alipay international setup for your card",
                  "WeChat Pay configuration",
                  "Metro QR code activation",
                  "DiDi taxi app setup",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={15} className="text-[#DC2626] shrink-0" />
                    <span className="font-body text-sm text-[#111110]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
          ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#111110] py-24">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#DC2626]/10 via-transparent to-transparent" />
        <div className="relative z-10 cp-container text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-5 leading-[1.05]">
              Ready to explore China
              <br />
              <span className="italic text-[#FCA5A5]">without the friction?</span>
            </h2>
            <p className="font-body text-white/50 text-base mb-8 max-w-md mx-auto">
              $49 per trip. 10 days of human-based text support. Everything you need.
            </p>
            <a href="https://wa.me/447549879026?text=Hey%21%20I%27m%20planning%20a%20trip%20to%20China%20and%20could%20use%20some%20help%20%F0%9F%87%A8%F0%9F%87%B3" target="_blank" rel="noopener noreferrer" className="btn-primary text-base px-8 py-3.5">
              Get ChinaPal for my trip
              <ArrowRight size={16} />
            </a>
            <p className="font-body text-xs text-white/30 mt-4">
              No subscription. Pay once per trip.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
