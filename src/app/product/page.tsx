"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  MessageCircle,
  Smartphone,
  Train,
  Utensils,
  X,
  Star,
  Zap,
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

const plans = [
  {
    name: "Essential",
    price: "$29",
    duration: "3 days",
    desc: "Short trip or just need help getting set up.",
    features: [
      "3 days of text support",
      "Alipay & app setup help",
      "Up to 20 messages",
      "WhatsApp or WeChat",
    ],
    cta: "Get Essential",
    highlight: false,
    tag: null,
  },
  {
    name: "Trip Pass",
    price: "$49",
    duration: "10 days",
    desc: "The most popular option for a standard China trip.",
    features: [
      "10 days of text support",
      "Pre-trip setup help",
      "Unlimited messages",
      "Train & attraction booking help",
      "Restaurant & activity advice",
      "Fast troubleshooting",
      "WhatsApp or WeChat",
    ],
    cta: "Get ChinaPal for my trip",
    highlight: true,
    tag: "Most popular",
  },
  {
    name: "Extended Trip",
    price: "$79",
    duration: "21 days",
    desc: "Longer itinerary or multiple cities across China.",
    features: [
      "21 days of text support",
      "Everything in Trip Pass",
      "Multi-city itinerary help",
      "Priority response",
      "WhatsApp or WeChat",
    ],
    cta: "Get Extended",
    highlight: false,
    tag: null,
  },
];

const scenarios = [
  { q: "My Alipay card is not working — what should I do?", emoji: "💳" },
  { q: "Which train from Shanghai to Hangzhou?", emoji: "🚄" },
  { q: "Is this restaurant worth going to, or a tourist trap?", emoji: "🍜" },
  { q: "I'm stuck trying to buy this ticket — workaround?", emoji: "🎟️" },
  { q: "What should I do in this area tonight?", emoji: "🌆" },
  { q: "Best way to get to this attraction?", emoji: "🗺️" },
];

const faqs = [
  {
    q: "Is this a tour guide service?",
    a: "No — ChinaPal is text-based travel support for independent travelers. We help you navigate China's digital systems and answer your questions, but we are not a guided tour service.",
  },
  {
    q: "Can you help before my trip starts?",
    a: "Yes — your plan includes help during your trip window. We recommend activating it a few days before you fly so we can help with setup and preparation.",
  },
  {
    q: "Do you book everything for me directly?",
    a: "We help with booking-related questions and support, and where applicable we guide or assist with the process. For most bookings we walk you through it step by step.",
  },
  {
    q: "What if I'm traveling longer than 10 days?",
    a: "Choose the Extended Trip plan for 21 days, or purchase an additional Trip Pass to extend your support window.",
  },
  {
    q: "Which messaging apps do you support?",
    a: "We support WhatsApp and WeChat. You can choose whichever is more convenient for you.",
  },
  {
    q: "Is this for emergencies?",
    a: "ChinaPal is for travel support and local guidance, not emergency services. For genuine emergencies, contact local services (110 police, 120 ambulance in China).",
  },
  {
    q: "Can I ask more than one question?",
    a: "Trip Pass and Extended Trip plans include unlimited messages. The Essential plan includes up to 20 messages.",
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
          className={`shrink-0 text-[#78716C] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
            <p className="font-body text-sm text-[#78716C] leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Product() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Navbar />

      {/* ══════════════════════════════════════════
          HERO — Superhuman centered
          ══════════════════════════════════════════ */}
      <section className="pt-32 pb-20 text-center">
        <div className="cp-container max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0 }}>
            <span className="pill-badge bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
              Simple, flat pricing
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-6xl text-[#111110] leading-[1.05] mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            Your China trip,
            <br />
            <span className="italic text-[#DC2626]">backed up.</span>
          </motion.h1>

          <motion.p
            className="font-body text-base text-[#78716C] leading-relaxed max-w-md mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
          >
            10 days of local help by text — for setup, bookings, transport, and
            day-to-day questions. Travel independently, with backup.
          </motion.p>

          {/* Mini social proof */}
          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
          >
            <div className="flex -space-x-1.5">
              {["S", "J", "L", "M", "A"].map((l, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white bg-[#FEF2F2] flex items-center justify-center text-[10px] font-display font-bold text-[#DC2626]"
                >
                  {l}
                </div>
              ))}
            </div>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => <Star key={s} size={12} className="fill-[#DC2626] text-[#DC2626]" />)}
            </div>
            <span className="font-body text-xs text-[#78716C]">500+ travelers helped</span>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRICING CARDS
          ══════════════════════════════════════════ */}
      <section className="pb-20">
        <div className="cp-container max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
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
                    <p className={`font-body text-xs font-semibold uppercase tracking-widest mb-2 ${plan.highlight ? "text-white/50" : "text-[#78716C]"}`}>
                      {plan.name}
                    </p>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className={`font-display text-4xl ${plan.highlight ? "text-white" : "text-[#111110]"}`}>
                        {plan.price}
                      </span>
                      <span className={`font-body text-sm ${plan.highlight ? "text-white/40" : "text-[#A8A29E]"}`}>
                        per trip
                      </span>
                    </div>
                    <p className={`font-body text-xs mb-3 ${plan.highlight ? "text-white/40" : "text-[#A8A29E]"}`}>
                      {plan.duration} of support
                    </p>
                    <p className={`font-body text-sm leading-relaxed ${plan.highlight ? "text-white/60" : "text-[#78716C]"}`}>
                      {plan.desc}
                    </p>
                  </div>

                  <div className="flex-1 space-y-2.5 mb-7">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5">
                        <CheckCircle2
                          size={14}
                          className={`shrink-0 mt-0.5 ${plan.highlight ? "text-[#DC2626]" : "text-[#A8A29E]"}`}
                        />
                        <span className={`font-body text-sm ${plan.highlight ? "text-white/80" : "text-[#111110]"}`}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
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
            custom={3}
          >
            No subscription. No hidden fees. Pay once per trip.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHAT'S INCLUDED — bento mini
          ══════════════════════════════════════════ */}
      <section className="section bg-white">
        <div className="cp-container max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p className="font-body text-xs font-semibold text-[#DC2626] uppercase tracking-widest mb-3">
              What&apos;s included
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-[#111110]">
              Four areas.
              <span className="italic"> Full coverage.</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Smartphone, title: "Pre-trip setup", desc: "Alipay, essential apps, transport basics, and practical prep before arrival." },
              { icon: MessageCircle, title: "In-trip troubleshooting", desc: "Get help when payments, transport, bookings, or local systems get confusing." },
              { icon: Train, title: "Booking & transport", desc: "Guidance with trains, attractions, taxis, and key trip logistics." },
              { icon: Utensils, title: "Local travel advice", desc: "Ask about places, timing, routes, food, neighborhoods, and what's worth doing." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="bg-[#FAFAF9] rounded-2xl border border-[#E7E5E4] p-6 card-hover"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center mb-4">
                  <item.icon size={16} className="text-[#DC2626]" />
                </div>
                <h3 className="font-display text-base text-[#111110] mb-1.5">{item.title}</h3>
                <p className="font-body text-sm text-[#78716C] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EXAMPLE SCENARIOS — dark section
          ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#111110] py-20">
        <div className="absolute inset-0 dot-grid opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#DC2626]/8 via-transparent to-transparent" />
        <div className="relative z-10 cp-container max-w-3xl mx-auto">
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
            <h2 className="font-display text-3xl text-white">
              What travelers ask us
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-3">
            {scenarios.map((s, i) => (
              <motion.div
                key={s.q}
                className="glass-card px-5 py-4 flex items-start gap-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <span className="text-xl shrink-0 mt-0.5">{s.emoji}</span>
                <p className="font-body text-sm text-white/75 italic leading-relaxed">&ldquo;{s.q}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHO IT'S FOR
          ══════════════════════════════════════════ */}
      <section className="section bg-[#FAFAF9]">
        <div className="cp-container max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <div className="bg-white rounded-2xl border border-[#E7E5E4] p-7">
                <h3 className="font-display text-xl text-[#111110] mb-5">Best for</h3>
                <div className="space-y-3">
                  {[
                    "First-time travelers to China",
                    "Independent travelers who want backup",
                    "Anyone worried about payments & transport",
                    "Couples, families, and solo travelers",
                    "Anyone who wants local knowledge by text",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 size={14} className="text-[#DC2626] shrink-0" />
                      <span className="font-body text-sm text-[#111110]">{item}</span>
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
              <div className="bg-white rounded-2xl border border-[#E7E5E4] p-7">
                <h3 className="font-display text-xl text-[#111110] mb-5">
                  What ChinaPal is <span className="italic">not</span>
                </h3>
                <div className="space-y-3">
                  {[
                    "Guided tours or in-person accompaniment",
                    "Visa applications or immigration services",
                    "24/7 emergency rescue services",
                    "In-person translation",
                    "Full luxury concierge services",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <X size={14} className="text-[#A8A29E] shrink-0" />
                      <span className="font-body text-sm text-[#78716C]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
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
              Travel independently.
              <br />
              <span className="italic text-[#DC2626]">With backup.</span>
            </h2>
            <p className="font-body text-sm text-[#78716C] mb-8 leading-relaxed">
              $49 per trip. 10 days of human-based text support.
            </p>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="btn-primary text-base px-8 py-3.5"
            >
              Get ChinaPal for my trip
              <ArrowRight size={16} />
            </a>
            <p className="font-body text-xs text-[#A8A29E] mt-4">
              No subscription. Pay once per trip.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
