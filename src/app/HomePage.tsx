"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, MessageCircle, Zap, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatMockup from "@/components/ChatMockup";
import ComparisonSection from "@/components/ComparisonSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/chinapal-hero-bg-FDnCEqDWTZRbZZSyCrbHwY.webp";
const HAPPY_TRAVELER = "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/chinapal-happy-traveler-apdXYVS7AUjaND4MGNMiZk.webp";
const STRESS_DIY = "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/chinapal-stress-diy-RRscBThD6EWMEdhQKQiWUM.webp";

const WA_LINK = "https://wa.me/447549879026?text=Hi!%20I'm%20planning%20a%20trip%20to%20%5Bcity%5D%20in%20%5Bmonth%5D%20%E2%80%94%20can%20you%20help%3F%20%F0%9F%87%A8%F0%9F%87%B3";

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

                <p className="text-xl text-white/80 mb-8 max-w-md leading-relaxed font-body">
                  Trains, tickets, restaurants, Didi — just message us. We speak Chinese so you don&apos;t have to.
                </p>

                <div className="flex flex-row flex-wrap gap-3">
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
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
                    { icon: Zap, text: "Response in minutes" },
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
    <section className="py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.97)" }}
        >
          <div className="relative">
            <img src={STRESS_DIY} alt="Stressed traveler trying to book China trip" className="w-full h-80 md:h-full object-cover" style={{ filter: "grayscale(30%) brightness(0.7)" }} />
            <div className="absolute inset-0 flex flex-col justify-end p-8" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }}>
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-stone-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">&#x2715;</span>
                </div>
                <span className="text-white/70 text-xs font-bold uppercase tracking-widest font-body">Without ChinaPal</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">5+ apps. 47 options. 0 answers.</h3>
              <p className="text-white/70 text-sm font-body">Hours lost to Chinese apps, wrong gates, and tourist traps.</p>
            </div>
          </div>

          <div className="relative">
            <img src={HAPPY_TRAVELER} alt="Happy couple at Zhangjiajie with ChinaPal" className="w-full h-80 md:h-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-end p-8" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)" }}>
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "oklch(0.48 0.22 25)" }}>
                  <span className="text-white text-xs font-bold">&#x2713;</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest font-body" style={{ color: "oklch(0.70 0.18 25)" }}>With ChinaPal</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">One message. Done.</h3>
              <p className="text-white/70 text-sm font-body">Just show up. We handled the trains, tickets, tables, and taxis.</p>
            </div>
          </div>
        </div>
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
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
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
      <ComparisonSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
