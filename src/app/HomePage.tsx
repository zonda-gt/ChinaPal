"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, MessageCircle, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatMockup from "@/components/ChatMockup";
import ComparisonSection from "@/components/ComparisonSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/chinapal-hero-bg-FDnCEqDWTZRbZZSyCrbHwY.webp";

const START_LINK = "/start";
const WA_LINK = "https://wa.me/447447781385?text=Hi!%20I'd%20like%20to%20plan%20a%20trip%20to%20China";

function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BG}
          alt="China landscapes"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.45)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 60%, rgba(24,20,20,0.95) 100%)" }} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="pt-28 pb-16 px-4 flex-1 flex items-center">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div
                className="transition-all duration-1000"
                style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(40px)" }}
              >
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border border-white/20 bg-white/10 backdrop-blur-sm text-white font-body"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Available for your trip
                </div>

                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
                  China,<br />
                  <em className="not-italic" style={{ color: "oklch(0.70 0.18 25)" }}>handled.</em>
                </h1>

                <p className="text-sm md:text-xl text-white/80 mb-8 max-w-md leading-relaxed font-body">
                  Trains, tickets, restaurants, Didi — just message us. We speak Chinese so you don&apos;t have to.
                </p>

                <div className="flex flex-row flex-wrap gap-3">
                  <a
                    href={START_LINK}
                    className="text-white font-semibold px-8 py-4 rounded-full text-base transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 font-body"
                    style={{ backgroundColor: "oklch(0.48 0.22 25)" }}
                  >
                    Plan my trip
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => scrollTo("how-it-works")}
                    className="font-semibold px-8 py-4 rounded-full text-base border border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2 font-body bg-transparent"
                  >
                    See it in action
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-6 mt-10">
                  {[
                    { icon: MessageCircle, text: "WhatsApp & chat" },
                    { icon: Shield, text: "100% satisfaction guarantee" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-white/60" />
                      <span className="text-sm text-white/70 font-body">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="flex justify-center lg:justify-end transition-all duration-1000"
                style={{
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateY(0)" : "translateY(40px)",
                  transitionDelay: "0.2s"
                }}
              >
                <ChatMockup autoPlay={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: "2,400+", label: "Trips handled" },
    { value: "< 5 min", label: "Response time" },
    { value: "Zero", label: "Chinese apps needed" },
    { value: "4.9 / 5", label: "Traveler satisfaction" },
  ];

  return (
    <section className="py-16 px-4 bg-white border-y border-stone-100">
      <div ref={ref} className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div className="font-display text-3xl md:text-4xl font-bold mb-1" style={{ color: "oklch(0.48 0.22 25)" }}>
                {stat.value}
              </div>
              <div className="text-sm font-body" style={{ color: "oklch(0.52 0.01 260)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-12 md:py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <div
          ref={ref}
          className="grid grid-cols-2 gap-2 md:gap-6 transition-all duration-1000"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}
        >
          {/* Without */}
          <div className="rounded-xl md:rounded-2xl p-3 md:p-8 border border-stone-200" style={{ backgroundColor: "oklch(0.97 0.003 260)" }}>
            <div className="inline-flex items-center gap-1.5 md:gap-2 mb-2 md:mb-4">
              <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-stone-400 flex items-center justify-center">
                <span className="text-white text-[8px] md:text-xs font-bold">&#x2715;</span>
              </div>
              <span className="text-[8px] md:text-xs font-bold uppercase tracking-widest font-body" style={{ color: "oklch(0.52 0.01 260)" }}>Without ChinaPal</span>
            </div>
            <h3 className="font-display text-sm md:text-2xl font-bold mb-1 md:mb-2" style={{ color: "oklch(0.18 0.01 260)" }}>
              10+ Chinese apps. 0&nbsp;answers.
            </h3>
            <p className="text-[10px] md:text-sm leading-snug md:leading-relaxed font-body" style={{ color: "oklch(0.52 0.01 260)" }}>
              Hours lost to learning Chinese apps, wrong gates, and tourist traps.
            </p>
          </div>

          {/* With */}
          <div className="rounded-xl md:rounded-2xl p-3 md:p-8 border" style={{ backgroundColor: "oklch(0.97 0.02 25)", borderColor: "oklch(0.88 0.06 25)" }}>
            <div className="inline-flex items-center gap-1.5 md:gap-2 mb-2 md:mb-4">
              <div className="w-4 h-4 md:w-6 md:h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "oklch(0.48 0.22 25)" }}>
                <span className="text-white text-[8px] md:text-xs font-bold">&#x2713;</span>
              </div>
              <span className="text-[8px] md:text-xs font-bold uppercase tracking-widest font-body" style={{ color: "oklch(0.48 0.22 25)" }}>With ChinaPal</span>
            </div>
            <h3 className="font-display text-sm md:text-2xl font-bold mb-1 md:mb-2" style={{ color: "oklch(0.18 0.01 260)" }}>
              One message. Done.
            </h3>
            <p className="text-[10px] md:text-sm leading-snug md:leading-relaxed font-body" style={{ color: "oklch(0.52 0.01 260)" }}>
              Just show up. We handled the trains, tickets, tables, and taxis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AskUsButton() {
  return (
    <section className="py-10 px-4 bg-white">
      <div className="flex justify-center">
        <a
          href={START_LINK}
          className="group flex flex-col items-center gap-1 px-12 py-5 rounded-full text-center transition-all animate-[pulse-cta_2s_ease-in-out_infinite]"
          style={{ backgroundColor: "oklch(0.48 0.22 25)" }}
        >
          <span className="text-white font-display text-xl md:text-2xl font-bold">
            Ask us anything
          </span>
          <span className="text-white/70 text-xs md:text-sm font-body">
            about China — it&apos;s free
          </span>
        </a>
      </div>
    </section>
  );
}

function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 px-4" style={{ backgroundColor: "oklch(0.18 0.01 260)" }}>
      <div
        ref={ref}
        className="max-w-3xl mx-auto text-center transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)" }}
      >
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          Stop researching.<br />
          <em className="not-italic" style={{ color: "oklch(0.70 0.18 25)" }}>Start experiencing.</em>
        </h2>
        <p className="text-lg mb-10 max-w-xl mx-auto font-body" style={{ color: "rgba(255,255,255,0.65)" }}>
          Tell us your dates and where you want to go. We handle everything else in Chinese, so you don&apos;t have to.
        </p>
        <a
          href={START_LINK}
          className="text-white font-semibold px-10 py-4 rounded-full text-lg transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2 font-body"
          style={{ backgroundColor: "oklch(0.48 0.22 25)" }}
        >
          Plan my trip
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "oklch(0.985 0.005 80)" }}>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <BeforeAfterSection />
      <AskUsButton />
      <ComparisonSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
