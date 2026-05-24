"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  MessageCircle,
  Smartphone,
  CreditCard,
  ClipboardCheck,
  Compass,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07 },
  }),
};

const TRIP_CHECK_HREF = "/checkout?plan=trip-check";
const PASS_HREF = "/checkout?plan=chinapal-pass";

const plans = [
  {
    key: "trip-check",
    name: "Trip Check",
    price: "$19",
    unit: "one-time review",
    desc:
      "Already have a rough plan? Send it over. A local reviews it and shows you how to make it smoother, more local, and more realistic.",
    features: [
      "Itinerary review",
      "Hotel area check",
      "Route improvements",
      "What to skip, what to add",
      "Food and neighborhood ideas",
      "Day-trip decision help",
      "One round of local feedback",
    ],
    boundary: "One-time review — not live on-trip support.",
    cta: "Check my trip",
    href: TRIP_CHECK_HREF,
    highlight: false,
    tag: null,
  },
  {
    key: "chinapal-pass",
    name: "ChinaPal Pass",
    price: "$39",
    unit: "7 days of local text help",
    desc:
      "Text a real local team for 7 days. Planning, food, shopping, routes, ticket guidance, translation, and “what should we do next?” moments.",
    features: [
      "7 days of local text support",
      "Personalized itinerary help",
      "Simple day-by-day planning",
      "Restaurants, cafes, shopping, nightlife",
      "Hotel area & neighborhood advice",
      "Attraction & day-trip advice",
      "Ticket guidance before you book",
      "Route and transport suggestions",
      "Translation and Chinese message help",
      "App chat or WhatsApp support",
    ],
    boundary:
      "Best for independent travelers. Multi-city, large groups, or full detailed planning? Ask us for a custom quote.",
    cta: "Get 7 days of local help",
    href: PASS_HREF,
    highlight: true,
    tag: "Most popular",
  },
];

const comparison = {
  "Trip Check": [
    "One-time local review",
    "Best before booking",
    "Great for rough plans",
  ],
  "ChinaPal Pass": [
    "7 days of local text help",
    "Best before and during your trip",
    "Great for first-time China travelers",
  ],
};

const askQuestions = [
  "Is this hotel area good for first-time visitors?",
  "Can you improve my 3-day Shanghai itinerary?",
  "Where should we eat near our hotel tonight?",
  "Should we do Suzhou or Zhujiajiao?",
  "What should we do after Yu Garden?",
  "Which ticket should I book on Trip.com?",
  "Can you translate this menu and tell us what to order?",
  "Where can I buy interesting gifts that don’t feel touristy?",
  "Plan a relaxed family day with good food and low walking.",
];

const isList = [
  "A local trip advisor by text",
  "Planning and recommendation help",
  "Real human support",
  "China-specific local judgment",
];

const isNotList = [
  "A forced package tour",
  "A hotel reseller",
  "A ticket markup service",
  "A generic AI chatbot",
];

const faqs = [
  {
    q: "Do you book hotels and tickets for me?",
    a: "You book on platforms you trust — Trip.com, Booking.com, Klook, and the rest. We help you decide what to book and how to plan around it.",
  },
  {
    q: "Is this AI or real humans?",
    a: "ChinaPal Pass gives you real local human support by text.",
  },
  {
    q: "When does my 7-day pass start?",
    a: "It starts when you send your first real support message — not the moment you check out.",
  },
  {
    q: "Can I use WhatsApp?",
    a: "Yes. After checkout you can choose app chat or WhatsApp.",
  },
  {
    q: "Who is this best for?",
    a: "First-time China travelers, couples, families, and independent travelers who want local help without joining a group tour.",
  },
  {
    q: "What if my trip is very complex?",
    a: "For multi-city trips, large groups, or detailed full planning, contact us for a custom quote.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E7E5E4] last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="font-body text-sm font-medium text-[#111110] pr-4 group-hover:text-[#DC2626] transition-colors">
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-[#78716C] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="font-body text-sm text-[#78716C] leading-relaxed pb-5">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Product() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-24 md:pb-0">
      <Navbar />

      {/* ══════════════════════════════════════════
          HERO
          ══════════════════════════════════════════ */}
      <section className="pt-32 pb-16 text-center">
        <div className="cp-container max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="pill-badge bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
              Local help for your China trip
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-6xl text-[#111110] leading-[1.05] mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            Choose your level of
            <br />
            <span className="italic text-[#DC2626]">local China help.</span>
          </motion.h1>

          <motion.p
            className="font-body text-base text-[#78716C] leading-relaxed max-w-lg mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
          >
            Book hotels and tickets on platforms you trust. Use ChinaPal for
            local judgment, better recommendations, trip planning, and
            real-time help by text.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
          >
            <a
              href={PASS_HREF}
              className="btn-primary text-sm px-7 py-3.5 w-full sm:w-auto justify-center"
            >
              Get 7 days of local help
              <ArrowRight size={16} />
            </a>
            <a
              href={TRIP_CHECK_HREF}
              className="font-body font-semibold text-sm px-7 py-3.5 rounded-full border border-[#E7E5E4] text-[#111110] hover:border-[#DC2626] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-all w-full sm:w-auto text-center"
            >
              Check my trip
            </a>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32 }}
          >
            {[
              "No forced travel packages",
              "App or WhatsApp support",
              "Built for foreign travelers in China",
            ].map((chip) => (
              <div
                key={chip}
                className="flex items-center gap-1.5 font-body text-xs text-[#78716C]"
              >
                <CheckCircle2 size={12} className="text-[#DC2626] shrink-0" />
                {chip}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRICING CARDS (2 tiers)
          ══════════════════════════════════════════ */}
      <section className="pb-16">
        <div className="cp-container max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`relative rounded-2xl border flex flex-col ${
                  plan.highlight
                    ? "border-[#DC2626] bg-[#111110] shadow-[0_8px_48px_rgba(220,38,38,0.2)]"
                    : "border-[#E7E5E4] bg-white"
                }`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                {plan.tag && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="pill-badge bg-[#DC2626] text-white text-[11px] px-3 py-1">
                      {plan.tag}
                    </span>
                  </div>
                )}

                <div className="p-7 flex-1 flex flex-col">
                  <div className="mb-6">
                    <p
                      className={`font-body text-xs font-semibold uppercase tracking-widest mb-2 ${
                        plan.highlight ? "text-white/50" : "text-[#78716C]"
                      }`}
                    >
                      {plan.name}
                    </p>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span
                        className={`font-display text-4xl ${
                          plan.highlight ? "text-white" : "text-[#111110]"
                        }`}
                      >
                        {plan.price}
                      </span>
                      <span
                        className={`font-body text-sm ${
                          plan.highlight ? "text-white/40" : "text-[#A8A29E]"
                        }`}
                      >
                        {plan.unit}
                      </span>
                    </div>
                    <p
                      className={`font-body text-sm leading-relaxed mt-3 ${
                        plan.highlight ? "text-white/60" : "text-[#78716C]"
                      }`}
                    >
                      {plan.desc}
                    </p>
                  </div>

                  <div className="flex-1 space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5">
                        <CheckCircle2
                          size={14}
                          className={`shrink-0 mt-0.5 ${
                            plan.highlight ? "text-[#DC2626]" : "text-[#A8A29E]"
                          }`}
                        />
                        <span
                          className={`font-body text-sm ${
                            plan.highlight ? "text-white/85" : "text-[#111110]"
                          }`}
                        >
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p
                    className={`font-body text-xs italic leading-relaxed mb-5 ${
                      plan.highlight ? "text-white/45" : "text-[#A8A29E]"
                    }`}
                  >
                    {plan.boundary}
                  </p>

                  <a
                    href={plan.href}
                    className={`w-full text-center py-3 px-5 rounded-full text-sm font-body font-semibold transition-all ${
                      plan.highlight
                        ? "bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-[0_2px_12px_rgba(220,38,38,0.4)]"
                        : "border border-[#E7E5E4] text-[#111110] hover:border-[#DC2626] hover:text-[#DC2626] hover:bg-[#FEF2F2]"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="text-center font-body text-xs text-[#A8A29E] mt-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
          >
            Pay once. No subscription. No hidden fees.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COMPARISON STRIP
          ══════════════════════════════════════════ */}
      <section className="pb-20">
        <div className="cp-container max-w-3xl mx-auto">
          <motion.div
            className="grid sm:grid-cols-2 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            {Object.entries(comparison).map(([name, items], idx) => (
              <div
                key={name}
                className={`rounded-2xl p-6 border ${
                  idx === 1
                    ? "bg-[#FEF2F2] border-[#FECACA]"
                    : "bg-white border-[#E7E5E4]"
                }`}
              >
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-[#DC2626] mb-3">
                  {name}
                </p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="font-display text-base text-[#111110] leading-snug"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHAT CAN YOU ASK CHINAPAL?
          ══════════════════════════════════════════ */}
      <section className="section bg-white">
        <div className="cp-container max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p className="font-body text-xs font-semibold text-[#DC2626] uppercase tracking-widest mb-3">
              Real questions
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-[#111110]">
              What can you ask ChinaPal?
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {askQuestions.map((q, i) => (
              <motion.div
                key={q}
                className="bg-[#FAFAF9] rounded-2xl border border-[#E7E5E4] px-5 py-4 card-hover"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <p className="font-body text-sm text-[#111110] italic leading-relaxed">
                  &ldquo;{q}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════════ */}
      <section className="section bg-[#FAFAF9]">
        <div className="cp-container max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p className="font-body text-xs font-semibold text-[#DC2626] uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-[#111110]">
              Three simple steps.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: ClipboardCheck,
                step: "01",
                title: "Choose a plan",
                desc: "Trip Check for a one-time review, or ChinaPal Pass for 7 days of local text help.",
              },
              {
                icon: Compass,
                step: "02",
                title: "Tell us your trip",
                desc: "Share your dates, cities, hotel options, or questions. We get to work on local recommendations.",
              },
              {
                icon: MessageCircle,
                step: "03",
                title: "Get local help by app or WhatsApp",
                desc: "Chat where you prefer. Your 7-day Pass starts when you send your first real support message.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                className="bg-white rounded-2xl border border-[#E7E5E4] p-6 card-hover"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
                    <step.icon size={16} className="text-[#DC2626]" />
                  </div>
                  <span className="font-display text-xs text-[#A8A29E] tracking-widest">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-display text-lg text-[#111110] mb-1.5">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-[#78716C] leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHAT CHINAPAL IS / ISN'T
          ══════════════════════════════════════════ */}
      <section className="section bg-white">
        <div className="cp-container max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <div className="bg-[#FAFAF9] rounded-2xl border border-[#E7E5E4] p-7 h-full">
                <h3 className="font-display text-xl text-[#111110] mb-5">
                  ChinaPal <span className="italic text-[#DC2626]">is</span>
                </h3>
                <div className="space-y-3">
                  {isList.map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <CheckCircle2
                        size={14}
                        className="text-[#DC2626] shrink-0"
                      />
                      <span className="font-body text-sm text-[#111110]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
            >
              <div className="bg-[#FAFAF9] rounded-2xl border border-[#E7E5E4] p-7 h-full">
                <h3 className="font-display text-xl text-[#111110] mb-5">
                  ChinaPal is <span className="italic">not</span>
                </h3>
                <div className="space-y-3">
                  {isNotList.map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <X size={14} className="text-[#A8A29E] shrink-0" />
                      <span className="font-body text-sm text-[#78716C]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PAYMENT + CHAT CHANNEL
          ══════════════════════════════════════════ */}
      <section className="section bg-[#FAFAF9]">
        <div className="cp-container max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="font-display text-3xl md:text-4xl text-[#111110] mb-3">
              Pay securely on ChinaPal.
              <br />
              <span className="italic text-[#DC2626]">Chat where you prefer.</span>
            </h2>
            <p className="font-body text-sm text-[#78716C] max-w-md mx-auto">
              Checkout happens on the website — not inside WhatsApp. After
              payment, choose your support channel.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div
              className="bg-white rounded-2xl border border-[#E7E5E4] p-6 card-hover"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center mb-4">
                <Smartphone size={16} className="text-[#DC2626]" />
              </div>
              <h3 className="font-display text-base text-[#111110] mb-1.5">
                In-app chat
              </h3>
              <p className="font-body text-sm text-[#78716C] leading-relaxed">
                Best for saved plans and organized recommendations you can come
                back to.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl border border-[#E7E5E4] p-6 card-hover"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
            >
              <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center mb-4">
                <MessageCircle size={16} className="text-[#DC2626]" />
              </div>
              <h3 className="font-display text-base text-[#111110] mb-1.5">
                WhatsApp
              </h3>
              <p className="font-body text-sm text-[#78716C] leading-relaxed">
                Best for quick on-the-go help while you&apos;re out exploring.
              </p>
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 font-body text-xs text-[#A8A29E]">
            <CreditCard size={12} />
            Secure checkout. Pick your channel right after payment.
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FAQ
          ══════════════════════════════════════════ */}
      <section id="faq" className="section bg-white">
        <div className="cp-container max-w-2xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="font-display text-3xl text-[#111110]">
              Frequently asked questions
            </h2>
          </motion.div>

          <motion.div
            className="bg-[#FAFAF9] rounded-2xl border border-[#E7E5E4] px-7"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
          ══════════════════════════════════════════ */}
      <section className="section bg-[#FAFAF9]">
        <div className="cp-container max-w-xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="font-display text-4xl md:text-5xl text-[#111110] mb-4 leading-[1.05]">
              Plan smarter. Travel better.
              <br />
              <span className="italic text-[#DC2626]">
                Text a local when you need help.
              </span>
            </h2>
            <p className="font-body text-sm text-[#78716C] mb-8 leading-relaxed">
              Trip Check is for improving a plan once. ChinaPal Pass is for
              having a local China team you can text throughout your trip.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={PASS_HREF} className="btn-primary text-base px-8 py-3.5">
                Get 7 days of local help
                <ArrowRight size={16} />
              </a>
              <a
                href={TRIP_CHECK_HREF}
                className="font-body font-semibold text-sm px-7 py-3.5 rounded-full border border-[#E7E5E4] text-[#111110] hover:border-[#DC2626] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-all w-full sm:w-auto text-center"
              >
                Check my trip
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* ══════════════════════════════════════════
          STICKY MOBILE CTA
          ══════════════════════════════════════════ */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pt-3 bg-gradient-to-t from-[#FAFAF9] via-[#FAFAF9]/95 to-transparent">
        <a
          href={PASS_HREF}
          className="flex items-center justify-center gap-2 w-full bg-[#DC2626] text-white font-body font-semibold text-sm py-3.5 rounded-full shadow-[0_8px_24px_rgba(220,38,38,0.35)] active:scale-[0.98] transition-transform"
        >
          Get 7 days of local help — $39
          <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}
