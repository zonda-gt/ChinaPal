"use client";

import { useState, useEffect } from "react";
import type { Attraction } from "@/lib/attractions";
import { CDN_BASE } from "@/lib/constants";

interface Props {
  data: Attraction;
  citySlug: string;
  attractionSlug: string;
}

const WA_BASE = "https://wa.me/8618201806768?text=";

export default function AttractionPage({ data, citySlug, attractionSlug }: Props) {
  const waLink = `${WA_BASE}${encodeURIComponent(`Hi! I'm interested in visiting ${data.attraction_name_en} — could you help me plan?`)}`;
  const img = (file: string) => `${CDN_BASE}/images/${attractionSlug}/${file}`;
  const heroImg = img("ctrip_photo_01.jpg");
  const highlightImg = (h: { image?: string; name: string }) =>
    h.image ? img(h.image) : heroImg;
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [flippedPhrases, setFlippedPhrases] = useState<Set<number>>(new Set());
  const [conciergeOpen, setConciergeOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection observer for active nav section
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const togglePhrase = (i: number) => {
    setFlippedPhrases((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 72;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const appealBadgeClass = (appeal: string) => {
    if (appeal.includes("UNIVERSAL"))
      return "bg-green-bg text-green";
    if (appeal.includes("CULTURALLY"))
      return "bg-amber-bg text-amber";
    return "bg-red-light text-red-dark";
  };

  const appealLabel = (appeal: string) => {
    if (appeal.includes("UNIVERSAL")) return "Universal Appeal";
    if (appeal.includes("CULTURALLY")) return "Culturally Interesting";
    return "Unique";
  };

  const intensityPercent = (intensity: string) => {
    switch (intensity) {
      case "light": return 25;
      case "moderate": return 50;
      case "moderate-heavy": return 65;
      case "heavy": return 80;
      case "extreme": return 95;
      default: return 50;
    }
  };

  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "highlights", label: "Highlights" },
    { id: "plan", label: "Plan Visit" },
    { id: "tickets", label: "Tickets" },
    { id: "tips", label: "Tips" },
    { id: "phrases", label: "Phrases" },
  ];

  // Parse smart route into steps
  const routeSteps = data.strategy.smart_route
    .split("→")
    .map((s) => s.trim())
    .filter(Boolean);

  // Parse seasonal notes
  const seasons = [
    { emoji: "🌸", name: "Spring", note: "" },
    { emoji: "☀️", name: "Summer", note: "" },
    { emoji: "🍂", name: "Autumn", note: "" },
    { emoji: "❄️", name: "Winter", note: "" },
  ];
  const seasonalText = data.best_time.seasonal_notes;
  const seasonPatterns = [/Spring[^.]*\.[^.]*\./i, /Summer[^.]*\.[^.]*\./i, /Autumn[^.]*\.[^.]*\./i, /Winter[^.]*\.[^.]*\./i];
  seasonPatterns.forEach((pat, i) => {
    const match = seasonalText.match(pat);
    if (match) seasons[i].note = match[0].replace(/^(Spring|Summer|Autumn|Winter)\s*/i, "").trim();
  });
  // Fallback: if no match, split by sentence
  if (seasons.every((s) => !s.note)) {
    const parts = seasonalText.split(/\.\s+/);
    parts.forEach((part, i) => {
      if (i < 4) seasons[i].note = part.replace(/\.$/, "");
    });
  }

  return (
    <>
      {/* ═══ TOP NAV ═══ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/97 backdrop-blur-md shadow-[0_1px_0_var(--color-border)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 lg:px-10 h-16 flex items-center gap-4 lg:gap-8">
          <a
            href="/"
            className={`text-xl lg:text-[22px] font-extrabold no-underline tracking-tight ${
              scrolled ? "text-dark" : "text-white"
            }`}
          >
            China<span className="text-red">Pal</span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex gap-1.5 flex-1 justify-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  scrolled
                    ? activeSection === item.id
                      ? "text-red font-bold bg-red-light"
                      : "text-mid hover:text-red hover:bg-red-light"
                    : activeSection === item.id
                    ? "text-white font-bold bg-white/20"
                    : "text-white/85 hover:text-red hover:bg-red-light"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setConciergeOpen(true)}
            className="ml-auto flex items-center gap-1.5 bg-red text-white border-none px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg text-xs lg:text-[13.5px] font-semibold cursor-pointer hover:bg-red-dark transition-colors whitespace-nowrap"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span className="hidden sm:inline">Ask Concierge</span>
          </button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[85vh] lg:min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt={data.attraction_name_en} className="w-full h-full object-cover object-[center_30%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 lg:bg-[linear-gradient(105deg,rgba(10,10,10,0.82)_0%,rgba(10,10,10,0.65)_50%,rgba(10,10,10,0.30)_100%)]" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 lg:px-10 pt-24 pb-12 lg:pt-[100px] lg:pb-[60px] w-full lg:grid lg:grid-cols-[1fr_520px] lg:gap-[50px] lg:items-center">
          <div>
            {/* Badges */}
            <div className="flex gap-2 flex-wrap mb-4 lg:mb-5">
              <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-red text-white">
                {data.card_type}
              </span>
              {data.best_for.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/15 text-white/90 border border-white/30">
                  {tag.replace(/-/g, " ")}
                </span>
              ))}
            </div>

            <h1 className="text-4xl lg:text-[clamp(44px,5vw,68px)] font-extrabold text-white leading-[1.05] tracking-tight">
              {data.attraction_name_en}
            </h1>
            <p className="font-serif text-lg lg:text-[22px] text-white/70 mt-2 tracking-wide">
              {data.attraction_name_cn}
            </p>
            <p className="text-base lg:text-[17px] text-white/75 mt-4 lg:mt-5 italic max-w-[520px] leading-relaxed">
              &ldquo;{data.card_hook}&rdquo;
            </p>

            {/* Stats */}
            <div className="flex items-center gap-0 mt-6 lg:mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 lg:px-6 py-4 lg:py-5 w-fit">
              <div className="text-center px-3 lg:px-6">
                <span className="block text-lg lg:text-[22px] font-extrabold text-white">{(() => { const m = data.getting_in.price_rmb.match(/(\d[\d,]*)\s*RMB/i); return m ? `¥${m[1]}` : data.getting_in.price_rmb.match(/free/i) ? "Free" : data.getting_in.price_rmb.substring(0, 15); })()}</span>
                <span className="block text-[11px] text-white/60 uppercase tracking-wider mt-0.5">Entry</span>
              </div>
              <div className="w-px h-9 bg-white/20" />
              <div className="text-center px-3 lg:px-6">
                <span className="block text-lg lg:text-[22px] font-extrabold text-white">{data.time_needed.recommended.match(/[\d–-]+\s*(?:hours?|hrs?|day)/i)?.[0] || "4-6 hrs"}</span>
                <span className="block text-[11px] text-white/60 uppercase tracking-wider mt-0.5">Recommended</span>
              </div>
              <div className="w-px h-9 bg-white/20" />
              <div className="text-center px-3 lg:px-6">
                <span className="block text-lg lg:text-[22px] font-extrabold text-white capitalize">{data.physical_accessibility.physical_intensity}</span>
                <span className="block text-[11px] text-white/60 uppercase tracking-wider mt-0.5">Intensity</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 lg:mt-7 flex-wrap">
              <button
                onClick={() => setConciergeOpen(true)}
                className="flex items-center gap-2 bg-red text-white border-none px-5 lg:px-6 py-3 lg:py-3.5 rounded-xl text-[15px] font-bold cursor-pointer hover:bg-red-dark transition-all hover:-translate-y-0.5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Plan My Visit
              </button>
              <button
                onClick={() => scrollToSection("highlights")}
                className="flex items-center gap-2 bg-white/12 text-white border border-white/30 px-5 lg:px-6 py-3 lg:py-3.5 rounded-xl text-[15px] font-semibold cursor-pointer hover:bg-white/20 transition-colors no-underline"
              >
                Explore Highlights ↓
              </button>
            </div>
          </div>

          {/* Desktop image grid */}
          <div className="hidden lg:grid grid-cols-2 gap-3 rounded-2xl overflow-hidden">
            <div className="col-span-2 relative h-[360px]">
              <img src={img("ctrip_photo_02.jpg")} alt="" className="w-full h-full object-cover" />
            </div>
            {[3, 4].map((n) => (
              <div key={n} className="relative h-[240px]">
                <img src={img(`ctrip_photo_${String(n).padStart(2, "0")}.jpg`)} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MOBILE SECTION NAV ═══ */}
      <nav className="lg:hidden sticky top-16 z-40 bg-white border-b border-border overflow-x-auto">
        <div className="flex gap-0 px-4 min-w-max">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer bg-transparent ${
                activeSection === item.id
                  ? "text-red border-red"
                  : "text-muted border-transparent hover:text-dark"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto">
        {/* ═══ OVERVIEW ═══ */}
        <section id="overview" className="py-12 lg:py-20 px-4 lg:px-10">
          <div className="mb-8 lg:mb-12">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-red mb-2">Overview</div>
            <h2 className="text-2xl lg:text-[clamp(28px,3vw,40px)] font-extrabold text-dark tracking-tight leading-tight">
              About {data.attraction_name_en}
            </h2>
          </div>

          <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-12">
            {/* Main column */}
            <div>
              {/* Vibe */}
              <div className="flex gap-3 lg:gap-4 bg-dark-2 rounded-xl p-5 lg:p-6 mb-6 lg:mb-7">
                <span className="text-gold text-xl flex-shrink-0 mt-0.5">✦</span>
                <p className="text-base lg:text-base italic text-white/85 leading-relaxed">
                  &ldquo;{data.vibe}&rdquo;
                </p>
              </div>

              {/* Description */}
              <p className="text-base text-mid leading-relaxed lg:leading-[1.75]">
                {data.honest_description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-5 lg:mt-6">
                {data.best_for.map((tag) => (
                  <span key={tag} className="text-[13px] font-medium bg-red-light text-red-dark px-3.5 py-1.5 rounded-full border border-red-mid">
                    {tag.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                ))}
              </div>

              {/* FAQ */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-dark mb-4">Top Questions from Travelers</h3>
                <div className="border border-border rounded-xl overflow-hidden">
                  {data.foreigner_top_questions.map((faq, i) => (
                    <div key={i} className={`${i < data.foreigner_top_questions.length - 1 ? "border-b border-border" : ""}`}>
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className={`w-full flex justify-between items-center gap-4 px-4 lg:px-5 py-4 bg-white border-none cursor-pointer text-left text-[15px] font-semibold transition-colors ${
                          openFaq === i ? "text-red bg-red-light" : "text-dark hover:bg-red-light"
                        }`}
                      >
                        <span>{faq.question}</span>
                        <svg
                          className={`w-[18px] h-[18px] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      {openFaq === i && (
                        <div className="px-4 lg:px-5 pb-4 bg-white">
                          <p className="text-[14.5px] text-mid leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="mt-8 lg:mt-0">
              {/* Cultural context card */}
              <div className="bg-dark rounded-2xl p-6 lg:p-7 text-white">
                <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-gold mb-2">Cultural Context</div>
                <h3 className="text-xl font-bold mb-3.5">Why This Place Matters</h3>
                <p className="text-sm text-white/72 leading-relaxed">{data.cultural_context}</p>
              </div>

              {/* Concierge card */}
              <div className="mt-4 bg-white border border-border rounded-2xl p-5 lg:p-6 shadow-md">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 bg-red rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-dark">Need help planning?</p>
                    <p className="text-xs text-muted mt-0.5">ChinaPal handles everything</p>
                  </div>
                </div>
                <ul className="list-none mb-5 space-y-0">
                  {["Book English-speaking guides", "Arrange transport & tickets", "Real-time help during your visit", "Restaurant reservations nearby"].map((item) => (
                    <li key={item} className="text-[13.5px] text-mid py-1.5 border-b border-border last:border-b-0 pl-4 relative before:content-['✓'] before:absolute before:left-0 before:text-green before:font-bold">
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setConciergeOpen(true)}
                  className="w-full bg-red text-white border-none py-3 rounded-xl text-sm font-bold cursor-pointer hover:bg-red-dark transition-colors"
                >
                  Message Us →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ HIGHLIGHTS ═══ */}
        <section id="highlights" className="py-12 lg:py-20 px-4 lg:px-10 bg-white">
          <div className="mb-8 lg:mb-12">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-red mb-2">Must-See</div>
            <h2 className="text-2xl lg:text-[clamp(28px,3vw,40px)] font-extrabold text-dark tracking-tight">Highlights</h2>
            <p className="text-base text-muted mt-2">{data.highlights.length} iconic experiences that define a visit</p>
          </div>

          {/* Featured highlight */}
          {data.highlights[0] && (
            <div className="lg:grid lg:grid-cols-[480px_1fr] bg-white rounded-2xl overflow-hidden shadow-md mb-8">
              <div className="relative h-[240px] lg:h-auto">
                <img src={highlightImg(data.highlights[0])} alt={data.highlights[0].name} className="w-full h-full object-cover min-h-[240px] lg:min-h-[360px]" />
              </div>
              <div className="p-5 lg:p-9 lg:px-10">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide inline-block mb-2.5 ${appealBadgeClass(data.highlights[0].foreigner_appeal)}`}>
                  {appealLabel(data.highlights[0].foreigner_appeal)}
                </span>
                <h3 className="text-xl lg:text-[26px] font-extrabold text-dark tracking-tight">{data.highlights[0].name}</h3>
                <p className="text-[15px] text-mid leading-relaxed mt-3">{data.highlights[0].description}</p>
                <p className="text-[15px] text-mid leading-relaxed mt-3">{data.highlights[0].foreigner_note}</p>
                <div className="flex gap-2.5 items-start bg-red-light border-l-[3px] border-red rounded-r-lg px-3 py-3 mt-5 text-[13.5px] text-red-dark leading-relaxed">
                  <svg className="flex-shrink-0 mt-0.5 text-red" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{data.highlights[0].tip}</span>
                </div>
              </div>
            </div>
          )}

          {/* Highlight grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-10 lg:mb-12">
            {data.highlights.slice(1).map((h, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all border border-border/50">
                <div className="relative h-[180px]">
                  <img src={highlightImg(h)} alt={h.name} className="w-full h-full object-cover" />
                  <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${appealBadgeClass(h.foreigner_appeal)}`}>
                    {appealLabel(h.foreigner_appeal)}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="text-base font-bold text-dark">{h.name}</h4>
                  <p className="text-[13px] text-mid leading-relaxed mt-2">{h.description.substring(0, 150)}...</p>
                  <div className="flex gap-1.5 items-start mt-2.5 text-[12px] text-red-dark bg-red-light px-2.5 py-2 rounded-md leading-snug">
                    <svg className="flex-shrink-0 mt-px text-red" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {h.tip.substring(0, 100)}...
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* What visitors miss */}
          <h3 className="text-lg font-bold text-dark mb-5 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            What Most Visitors Miss
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {data.what_visitors_miss.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 lg:p-6 border border-border hover:border-red transition-colors">
                <div className="text-4xl font-black text-red-mid leading-none mb-2.5 tracking-tight">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h4 className="text-sm font-bold text-dark mb-2">{item.what}</h4>
                <p className="text-[13px] text-mid leading-relaxed">{item.why}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ PLAN YOUR VISIT ═══ */}
        <section id="plan" className="py-12 lg:py-20 px-4 lg:px-10">
          <div className="mb-8 lg:mb-12">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-red mb-2">Planning</div>
            <h2 className="text-2xl lg:text-[clamp(28px,3vw,40px)] font-extrabold text-dark tracking-tight">Plan Your Visit</h2>
          </div>

          {/* Time needed */}
          <h3 className="text-lg font-bold text-dark mb-4">How Long to Visit</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Quick Visit", value: data.time_needed.quick_visit, featured: false },
              { label: "Full Experience", value: data.time_needed.recommended, featured: true },
              { label: "Deep Dive", value: data.time_needed.deep_dive, featured: false },
            ].map((t) => {
              const durMatch = t.value.match(/^[\d–-]+\s*(?:hours?|hrs?|day|Full day)/i);
              const dur = durMatch ? durMatch[0] : t.value.substring(0, 10);
              const desc = t.value.replace(durMatch?.[0] || "", "").replace(/^\s*\(?/, "").replace(/\)?\s*$/, "");
              return (
                <div key={t.label} className={`rounded-xl p-5 relative ${t.featured ? "border-2 border-red bg-red-light" : "bg-white border border-border"}`}>
                  {t.featured && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-red text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      Recommended
                    </div>
                  )}
                  <div className="text-[11px] font-bold text-muted uppercase tracking-wider">{t.label}</div>
                  <div className={`text-2xl font-extrabold mt-1.5 mb-2.5 ${t.featured ? "text-red-dark" : "text-dark"}`}>{dur}</div>
                  <p className="text-[13px] text-mid leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>

          {/* Smart Route */}
          <h3 className="text-lg font-bold text-dark mb-4">Smart Route</h3>
          <div className="flex flex-wrap gap-0 items-stretch mb-8">
            {routeSteps.map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex items-start gap-3 bg-white border border-border rounded-xl px-3.5 py-3 min-w-[130px] flex-1">
                  <div className="w-7 h-7 bg-red text-white rounded-full flex items-center justify-center text-[13px] font-extrabold flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-[13px] font-bold text-dark leading-snug">{step}</p>
                </div>
                {i < routeSteps.length - 1 && (
                  <span className="px-1 text-red font-bold text-base flex-shrink-0">→</span>
                )}
              </div>
            ))}
          </div>

          {/* Best time & seasons */}
          <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-12">
            <div>
              <h3 className="text-lg font-bold text-dark mb-4">Best Time to Visit</h3>
              <div className="flex flex-col gap-2.5 mb-6">
                <div className="rounded-xl px-4 py-3 flex items-center gap-3 bg-green-bg border border-[#B7E8D0]">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-green text-white px-2 py-0.5 rounded-full whitespace-nowrap">Best</span>
                  <div>
                    <p className="text-sm font-bold text-dark">{data.best_time.best_time_of_day.split(".")[0]}</p>
                  </div>
                </div>
                <div className="rounded-xl px-4 py-3 flex items-center gap-3 bg-red-light border border-red-mid">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red text-white px-2 py-0.5 rounded-full whitespace-nowrap">Avoid</span>
                  <div>
                    <p className="text-sm font-bold text-dark">{data.best_time.worst_time.split(".")[0]}</p>
                  </div>
                </div>
              </div>

              {/* Seasons */}
              <h3 className="text-lg font-bold text-dark mb-4">By Season</h3>
              <div className="border border-border rounded-xl overflow-hidden mb-4">
                {seasons.map((s, i) => (
                  <div key={i} className={`flex items-start gap-3.5 px-4 py-3.5 bg-white ${i < 3 ? "border-b border-border" : ""}`}>
                    <span className="text-[22px] flex-shrink-0">{s.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-dark">{s.name}</p>
                      <p className="text-[13px] text-mid mt-0.5 leading-snug">{s.note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pro tip */}
              <div className="bg-gold-light border border-[#E8D5A0] rounded-xl px-4 lg:px-5 py-4">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-gold mb-2">Pro Tip</div>
                <p className="text-[13.5px] text-[#6B5A2A] leading-relaxed">{data.best_time.pro_tip}</p>
              </div>
            </div>

            {/* Skip & tips sidebar */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-white border border-border rounded-xl p-5 mb-4">
                <h4 className="text-[15px] font-bold text-dark mb-3">What to Skip</h4>
                <p className="text-[13.5px] text-mid leading-relaxed">{data.strategy.what_to_skip}</p>
              </div>
              <div className="bg-white border border-border rounded-xl p-5">
                <h4 className="text-[15px] font-bold text-dark mb-3">Pro Tips</h4>
                <p className="text-[13.5px] text-mid leading-relaxed">{data.strategy.pro_tips}</p>
              </div>
            </div>
          </div>

          {/* Photo spots & pair with */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-10 lg:mt-12">
            <div className="bg-white rounded-2xl p-5 lg:p-7 border border-border">
              <h3 className="text-lg font-bold text-dark mb-5">Photo Spots</h3>
              <div className="flex flex-col gap-4">
                {data.photo_spots.map((spot, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-lg flex-shrink-0">📍</span>
                    <div>
                      <p className="text-sm font-semibold text-dark">{spot.location}</p>
                      <p className="text-[13px] text-mid mt-1 leading-snug">{spot.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 lg:p-7 border border-border">
              <h3 className="text-lg font-bold text-dark mb-5">Pair With</h3>
              <div className="flex flex-col gap-4">
                {data.pair_with.map((pair, i) => (
                  <div key={i} className="flex gap-3.5 items-start">
                    <span className="text-[22px] flex-shrink-0">🗺️</span>
                    <div>
                      <p className="text-sm font-bold text-dark">{pair.suggestion}</p>
                      <p className="text-[12px] text-red font-semibold mt-0.5 mb-1">{pair.travel_time}</p>
                      <p className="text-[13px] text-mid leading-snug">{pair.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TICKETS ═══ */}
        <section id="tickets" className="py-12 lg:py-20 px-4 lg:px-10 bg-white">
          <div className="mb-8 lg:mb-12">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-red mb-2">Getting In</div>
            <h2 className="text-2xl lg:text-[clamp(28px,3vw,40px)] font-extrabold text-dark tracking-tight">Tickets & Access</h2>
          </div>

          <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-10">
            <div>
              {/* Booking note */}
              <div className="flex gap-3 items-start bg-green-bg border border-[#B7E8D0] rounded-xl px-4 py-3.5 text-sm text-[#0F5132] leading-relaxed mb-5">
                <svg className="flex-shrink-0 text-green mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{data.getting_in.booking_required}</span>
              </div>

              {/* Price table */}
              <div className="bg-white rounded-2xl overflow-hidden border border-border">
                <div className="grid grid-cols-[1fr_100px_80px] gap-4 px-5 py-3 bg-dark text-white/70 text-[11px] font-bold uppercase tracking-wider">
                  <span>Ticket</span>
                  <span>Price</span>
                  <span>USD</span>
                </div>
                {data.getting_in.price_breakdown.map((ticket, i) => (
                  <div key={i} className={`grid grid-cols-[1fr_100px_80px] gap-4 px-5 py-4 border-b border-border last:border-b-0 items-center ${i === 1 ? "bg-red-light" : ""}`}>
                    <div>
                      <p className={`text-sm font-bold ${i === 1 ? "text-red-dark" : "text-dark"}`}>{ticket.item}</p>
                      <p className="text-[12px] text-muted mt-0.5 leading-snug">{ticket.highlight}</p>
                    </div>
                    <span className="text-base font-extrabold text-red">{ticket.price}</span>
                    <span className="text-[12px] text-muted">~{ticket.price.replace("¥", "$").replace(/(\d+)/g, (m) => String(Math.round(parseInt(m) / 7.1)))}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Side info */}
            <div className="mt-6 lg:mt-0 space-y-4">
              {/* Hours */}
              <div className="bg-white border border-border rounded-xl p-5">
                <h4 className="text-[15px] font-bold text-dark mb-3.5">Opening Hours</h4>
                <p className="text-[13px] text-mid leading-relaxed">{data.getting_in.opening_hours}</p>
              </div>

              {/* How to buy */}
              <div className="bg-white border border-border rounded-xl p-5">
                <h4 className="text-[15px] font-bold text-dark mb-3.5">How to Buy</h4>
                <p className="text-[13px] text-mid leading-relaxed">{data.getting_in.booking_method}</p>
                <p className="text-[12px] text-muted mt-2.5 leading-snug">Passport: {data.getting_in.passport_accepted}</p>
              </div>

              {/* Queue */}
              <div className="bg-white border border-border rounded-xl p-5">
                <h4 className="text-[15px] font-bold text-dark mb-3.5">Queue Situation</h4>
                <p className="text-[13px] text-mid leading-relaxed">{data.getting_in.queue_situation}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TIPS ═══ */}
        <section id="tips" className="py-12 lg:py-20 px-4 lg:px-10">
          <div className="mb-8 lg:mb-12">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-red mb-2">Know Before You Go</div>
            <h2 className="text-2xl lg:text-[clamp(28px,3vw,40px)] font-extrabold text-dark tracking-tight">Tips & Warnings</h2>
          </div>

          {/* Heads up / Warnings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
            {data.heads_up.map((item, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="text-2xl">⚠️</span>
                <h4 className="text-sm font-bold text-dark">{item.warning}</h4>
                <p className="text-[13px] text-mid leading-relaxed">{item.advice}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            {/* Preparation */}
            <div className="bg-white rounded-2xl p-5 lg:p-7 border border-border">
              <h3 className="text-lg font-bold text-dark mb-4">What to Bring</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-green mb-2">Wear</p>
                  <p className="text-[13px] text-mid leading-relaxed">{data.preparation.what_to_wear}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-green mb-2">Bring</p>
                  <p className="text-[13px] text-mid leading-relaxed">{data.preparation.what_to_bring}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-red mb-2">Don&apos;t Bring</p>
                  <p className="text-[13px] text-mid leading-relaxed">{data.preparation.what_not_to_bring}</p>
                </div>
              </div>
            </div>

            {/* Physical intensity */}
            <div className="bg-white rounded-2xl p-5 lg:p-7 border border-border">
              <h3 className="text-lg font-bold text-dark mb-4">Physical Reality</h3>
              <div className="mb-2">
                <div className="flex justify-between text-[11px] text-muted mb-1.5">
                  <span>Light</span><span>Moderate</span><span>Heavy</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green via-amber to-red"
                    style={{ width: `${intensityPercent(data.physical_accessibility.physical_intensity)}%` }}
                  />
                </div>
                <p className="text-sm font-bold text-amber mt-2 capitalize">{data.physical_accessibility.physical_intensity}</p>
              </div>
              <p className="text-[13px] text-mid leading-relaxed mt-3">{data.physical_accessibility.physical_details}</p>
              <div className="flex gap-2 items-start bg-bg rounded-lg px-3 py-2.5 text-[12.5px] text-mid leading-snug mt-3">
                <svg className="flex-shrink-0 mt-0.5 text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                <span>{data.physical_accessibility.age_notes}</span>
              </div>
            </div>

            {/* Foreigners watch out */}
            <div className="bg-white rounded-2xl p-5 lg:p-7 border border-border">
              <h3 className="text-lg font-bold text-dark mb-4">Foreigners Watch Out</h3>
              <ul className="list-none space-y-0">
                {data.foreigners_watch_out.map((item, i) => (
                  <li key={i} className="text-[13.5px] text-mid py-3 border-b border-border last:border-b-0 pl-5 relative leading-relaxed before:content-['→'] before:absolute before:left-0 before:text-red before:font-bold">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* If things go wrong */}
            <div className="bg-white rounded-2xl p-5 lg:p-7 border border-border">
              <h3 className="text-lg font-bold text-dark mb-4">If Things Go Wrong</h3>
              <div className="space-y-0">
                {data.if_things_go_wrong.map((item, i) => (
                  <div key={i} className={`py-3.5 ${i < data.if_things_go_wrong.length - 1 ? "border-b border-border" : ""}`}>
                    <p className="text-[13.5px] font-bold text-dark mb-1">{item.problem}</p>
                    <p className="text-[13px] text-mid leading-relaxed">
                      <span className="text-green font-bold">→ </span>{item.what_to_do}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ PHRASES ═══ */}
        <section id="phrases" className="py-12 lg:py-20 px-4 lg:px-10 bg-white">
          <div className="mb-8 lg:mb-12">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-red mb-2">Language</div>
            <h2 className="text-2xl lg:text-[clamp(28px,3vw,40px)] font-extrabold text-dark tracking-tight">Useful Chinese</h2>
            <p className="text-base text-muted mt-2">Tap to reveal the English meaning</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            {data.useful_chinese.map((phrase, i) => (
              <div
                key={i}
                onClick={() => togglePhrase(i)}
                className={`cursor-pointer rounded-xl h-[130px] relative transition-transform hover:-translate-y-0.5 overflow-hidden ${
                  phrase.english.length > 30 ? "sm:col-span-2" : ""
                }`}
              >
                {/* Front */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                  flippedPhrases.has(i) ? "opacity-0 -rotate-y-90" : "opacity-100"
                } bg-red text-white`}>
                  <span className="font-serif text-2xl lg:text-[28px] font-bold text-center leading-tight">{phrase.chinese}</span>
                  <span className="text-[12px] text-white/75 mt-1.5">{phrase.pinyin}</span>
                </div>
                {/* Back */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                  flippedPhrases.has(i) ? "opacity-100" : "opacity-0 rotate-y-90"
                } bg-dark text-white`}>
                  <span className="text-base font-bold text-center">{phrase.english}</span>
                  <span className="text-[12px] text-white/65 mt-1.5 text-center">{phrase.pinyin}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ═══ CTA BAND ═══ */}
      <section className="bg-dark py-12 lg:py-16">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div>
            <h2 className="text-2xl lg:text-[32px] font-extrabold text-white tracking-tight mb-2.5">
              Need help with {data.attraction_name_en}?
            </h2>
            <p className="text-base text-white/65 max-w-[520px] leading-relaxed">
              From booking guides to real-time help during your visit — ChinaPal handles the hard parts so you can enjoy {data.attraction_name_cn}.
            </p>
          </div>
          <button
            onClick={() => setConciergeOpen(true)}
            className="flex-shrink-0 bg-red text-white border-none px-8 py-4 rounded-xl text-base font-bold cursor-pointer hover:bg-red-dark transition-all hover:-translate-y-0.5 whitespace-nowrap"
          >
            Message Us →
          </button>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#111] py-12 lg:pt-12 lg:pb-6">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-10">
          <div className="flex flex-col lg:flex-row justify-between items-start pb-8 border-b border-white/8 gap-6">
            <div>
              <a href="/" className="text-xl font-extrabold text-white no-underline">
                China<span className="text-red">Pal</span>
              </a>
              <p className="text-[13px] text-white/40 mt-1.5">Your China travel concierge</p>
            </div>
            <div className="flex gap-6 flex-wrap">
              {["Beijing", "Shanghai", "Xi'an", "Chengdu", "Hangzhou"].map((city) => (
                <a key={city} href={`/${city.toLowerCase().replace("'", "")}`} className="text-[13px] text-white/50 no-underline hover:text-white transition-colors">
                  {city}
                </a>
              ))}
            </div>
          </div>
          <div className="pt-5">
            <p className="text-[12px] text-white/25">&copy; {new Date().getFullYear()} ChinaPal. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ═══ CONCIERGE MODAL ═══ */}
      {conciergeOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && setConciergeOpen(false)}
        >
          <div className="bg-white rounded-2xl w-[420px] max-w-[90vw] max-h-[90vh] overflow-y-auto shadow-xl animate-[modalIn_0.25s_ease]">
            {/* Close button */}
            <div className="flex justify-end p-4 pb-0">
              <button
                onClick={() => setConciergeOpen(false)}
                className="bg-bg border-none w-8 h-8 rounded-full cursor-pointer text-sm text-mid flex items-center justify-center hover:bg-border transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="px-6 pb-6 pt-2 text-center">
              {/* WhatsApp icon */}
              <div className="mx-auto mb-5 w-14 h-14 rounded-full flex items-center justify-center bg-[#25D366]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>

              <h3 className="text-2xl font-extrabold text-dark mb-1.5">Connect on WhatsApp</h3>
              <p className="text-sm text-muted mb-6 leading-relaxed">
                Tell us your dates and we&apos;ll help you plan {data.attraction_name_en} — for free.
              </p>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white font-bold px-10 py-3.5 rounded-full text-base transition-all hover:opacity-90 no-underline bg-[#25D366]"
              >
                Open WhatsApp
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>

              <p className="text-xs text-muted mt-4">
                Don&apos;t have WhatsApp?{" "}
                <a href="mailto:hello@chinapal.co" className="underline hover:no-underline text-muted">Email us instead</a>
              </p>

              {/* Divider */}
              <div className="flex items-center gap-4 mt-7 mb-5">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs uppercase tracking-widest text-muted">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <p className="text-sm text-mid mb-4">Get our app for on-the-go help during your trip</p>
              <div className="flex justify-center gap-3">
                <button type="button" className="cursor-pointer bg-transparent border-0 p-0">
                  <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="Download on the App Store"
                    className="h-10"
                  />
                </button>
                <button type="button" className="cursor-pointer bg-transparent border-0 p-0">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    className="h-10"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}
