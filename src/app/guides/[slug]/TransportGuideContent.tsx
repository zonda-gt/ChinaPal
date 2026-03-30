"use client";

import { useEffect, useRef, useState } from "react";
import {
  Train,
  MapPin,
  Smartphone,
  CreditCard,
  Bike,
  Car,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Wallet,
  Bus,
  Star,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

// ── Image CDN URLs ──────────────────────────────────────────────
const HERO_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/DvJNue2SWyf3hxtYakDQVL/hero-china-transport-h5c7pRsgknHJU5wZAzjhCC.webp";
const METRO_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/DvJNue2SWyf3hxtYakDQVL/metro-section-mgztiwtSwo9NWP6RVYr2Jg.webp";
const APPS_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/DvJNue2SWyf3hxtYakDQVL/apps-section-Ey5V6fJ3b2PPngq4mKpdQ6.webp";
const BIKES_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/DvJNue2SWyf3hxtYakDQVL/bikes-section-5vfcFzVD6kdjxiLikT8tn3.webp";
const TRAIN_STATION_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/DvJNue2SWyf3hxtYakDQVL/bullet-train-station_9beab93d.jpg";
const ALIPAY_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/DvJNue2SWyf3hxtYakDQVL/alipay-wechat_a0c01489.webp";
const SUBWAY_MAP_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/DvJNue2SWyf3hxtYakDQVL/beijing-subway-map_4a39be27.webp";

// ── Table of Contents ───────────────────────────────────────────
const TOC_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "metro", label: "Metro & Subway" },
  { id: "hsr", label: "High-Speed Rail" },
  { id: "buses", label: "City Buses" },
  { id: "taxis", label: "Taxis & Didi" },
  { id: "bikes", label: "Bike Sharing" },
  { id: "payment", label: "Payment Methods" },
  { id: "maps", label: "Map Apps" },
  { id: "tips", label: "Pro Tips" },
];

// ── Reusable Components ─────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-[2px] bg-[#DC2626]" />
      <span className="font-body text-xs font-semibold uppercase tracking-widest text-[#DC2626]">
        {children}
      </span>
    </div>
  );
}

function TipBox({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-[#FEF2F2] border-l-[3px] border-[#DC2626] rounded-r-xl p-4 my-6">
      <div className="flex items-start gap-3">
        <span className="text-[#DC2626] mt-0.5 shrink-0">
          {icon || <AlertCircle size={18} />}
        </span>
        <div className="font-body text-sm text-[#78716C] leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

function TransportCard({
  icon,
  title,
  subtitle,
  tags,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tags?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden fade-in-up">
      <div className="p-5 border-b border-[#E7E5E4]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="font-display font-semibold text-[#111110] text-lg leading-tight">
              {title}
            </h3>
            <p className="font-body text-xs text-[#A8A29E] mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>
        {tags && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-body text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FAFAF9] border border-[#E7E5E4] text-[#78716C]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="font-body text-sm text-[#78716C] leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}

function AppCard({
  name,
  type,
  rating,
  description,
  pros,
  badge,
}: {
  name: string;
  type: string;
  rating: number;
  description: string;
  pros: string[];
  badge?: string;
}) {
  return (
    <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 fade-in-up">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-display font-semibold text-[#111110]">
              {name}
            </h4>
            {badge && (
              <span className="font-body text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#DC2626] text-white">
                {badge}
              </span>
            )}
          </div>
          <p className="font-body text-xs text-[#A8A29E] mt-0.5">{type}</p>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={
                i < rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-[#E7E5E4]"
              }
            />
          ))}
        </div>
      </div>
      <p className="font-body text-sm text-[#78716C] mb-3 leading-relaxed">
        {description}
      </p>
      <ul className="space-y-1.5">
        {pros.map((pro) => (
          <li key={pro} className="flex items-start gap-2">
            <CheckCircle2
              size={13}
              className="text-[#DC2626] mt-0.5 shrink-0"
            />
            <span className="font-body text-xs text-[#78716C]">{pro}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PriceTable() {
  const rows = [
    {
      mode: "Metro",
      beijing: "\u00A53\u20136",
      shanghai: "\u00A53\u20139",
      guangzhou: "\u00A52\u20137",
      note: "Distance-based",
    },
    {
      mode: "City Bus",
      beijing: "\u00A52",
      shanghai: "\u00A52",
      guangzhou: "\u00A52",
      note: "Flat fare",
    },
    {
      mode: "Taxi (flag drop)",
      beijing: "\u00A513",
      shanghai: "\u00A514",
      guangzhou: "\u00A510",
      note: "+ per km rate",
    },
    {
      mode: "Bike Share (30 min)",
      beijing: "\u00A51\u20132",
      shanghai: "\u00A51\u20132",
      guangzhou: "\u00A51\u20132",
      note: "Via Alipay",
    },
    {
      mode: "HSR (Beijing\u2013Shanghai)",
      beijing: "\u2014",
      shanghai: "\u00A5553",
      guangzhou: "\u2014",
      note: "~5.5 hrs, 2nd class",
    },
  ];
  return (
    <div className="overflow-x-auto rounded-xl border border-[#E7E5E4] fade-in-up">
      <table className="w-full text-sm font-body">
        <thead>
          <tr className="bg-[#F5F5F4]">
            <th className="text-left px-4 py-3 font-semibold text-[#111110] text-xs uppercase tracking-wide">
              Mode
            </th>
            <th className="text-center px-4 py-3 font-semibold text-[#111110] text-xs uppercase tracking-wide">
              Beijing
            </th>
            <th className="text-center px-4 py-3 font-semibold text-[#111110] text-xs uppercase tracking-wide">
              Shanghai
            </th>
            <th className="text-center px-4 py-3 font-semibold text-[#111110] text-xs uppercase tracking-wide">
              Guangzhou
            </th>
            <th className="text-left px-4 py-3 font-semibold text-[#111110] text-xs uppercase tracking-wide hidden sm:table-cell">
              Note
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.mode}
              className={i % 2 === 0 ? "bg-white" : "bg-[#FAFAF9]"}
            >
              <td className="px-4 py-3 font-medium text-[#111110]">
                {row.mode}
              </td>
              <td className="px-4 py-3 text-center text-[#78716C]">
                {row.beijing}
              </td>
              <td className="px-4 py-3 text-center text-[#78716C]">
                {row.shanghai}
              </td>
              <td className="px-4 py-3 text-center text-[#78716C]">
                {row.guangzhou}
              </td>
              <td className="px-4 py-3 text-[#A8A29E] hidden sm:table-cell">
                {row.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────

export default function TransportGuideContent() {
  const [activeSection, setActiveSection] = useState("overview");
  const [tocOpen, setTocOpen] = useState(false);

  // Scroll animation (IntersectionObserver)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document
      .querySelectorAll(".fade-in-up")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = TOC_ITEMS.map((item) =>
        document.getElementById(item.id)
      );
      const scrollY = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(TOC_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── CSS for scroll animations ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .fade-in-up {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-in-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}} />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[520px] max-h-[780px] overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Bullet train at Shanghai Hongqiao station"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,5,5,0.85) 0%, rgba(10,5,5,0.4) 50%, rgba(10,5,5,0.1) 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 pb-12 sm:pb-16 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-[#DC2626]" />
            <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-white/70">
              Travel Guide
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Getting Around China:
            <br />
            <span className="italic font-normal">
              The Complete Transport Guide
            </span>
          </h1>
          <p className="font-body text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed mb-6">
            From the world&apos;s fastest bullet trains to &yen;1.50 bike rides
            &mdash; everything a foreign traveler needs to navigate
            China&apos;s extraordinary transport network with confidence.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Metro", "High-Speed Rail", "Didi", "Alipay", "Amap"].map(
              (tag) => (
                <span
                  key={tag}
                  className="font-body text-xs px-3 py-1.5 rounded-full border border-white/30 text-white/80 backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
        <div className="absolute bottom-6 right-6 sm:right-10 flex items-center gap-2 text-white/50">
          <span className="font-body text-xs">Scroll to read</span>
          <div className="w-px h-8 bg-white/30" />
        </div>
      </section>

      {/* ── Mobile TOC Toggle ────────────────────────────────── */}
      <div className="lg:hidden sticky top-[64px] z-40 bg-[#FAFAF9]/95 backdrop-blur-sm border-b border-[#E7E5E4]">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="w-full flex items-center justify-between px-4 py-3 font-body text-sm font-medium text-[#111110]"
        >
          <span>
            In This Guide:{" "}
            <span className="text-[#DC2626]">
              {TOC_ITEMS.find((t) => t.id === activeSection)?.label}
            </span>
          </span>
          {tocOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        {tocOpen && (
          <div className="border-t border-[#E7E5E4] px-4 py-3 grid grid-cols-2 gap-2 bg-[#FAFAF9]">
            {TOC_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setTocOpen(false)}
                className={`font-body text-xs font-medium py-2 px-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-[#DC2626] text-white"
                    : "text-[#78716C] hover:bg-[#F5F5F4]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── Main Layout ──────────────────────────────────────── */}
      <div className="cp-container max-w-7xl mx-auto pt-12 pb-24">
        <div className="flex gap-12">
          {/* ── Sticky Sidebar TOC (desktop) ──────────────── */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-24">
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-[#DC2626] mb-4">
                In This Guide
              </p>
              <nav className="space-y-1">
                {TOC_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`flex items-center gap-2 py-1.5 px-3 rounded-lg font-body text-xs transition-all ${
                      activeSection === item.id
                        ? "bg-[#FEF2F2] text-[#DC2626] font-medium border-l-2 border-[#DC2626]"
                        : "text-[#78716C] hover:text-[#111110] hover:bg-[#F5F5F4]"
                    }`}
                  >
                    <ChevronRight
                      size={10}
                      className={
                        activeSection === item.id
                          ? "text-[#DC2626]"
                          : "text-[#E7E5E4]"
                      }
                    />
                    {item.label}
                  </a>
                ))}
              </nav>
              {/* Stats box */}
              <div className="mt-8 p-4 rounded-xl border border-[#E7E5E4] bg-white">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-[#DC2626] mb-3">
                  By the Numbers
                </p>
                <div className="space-y-3">
                  {[
                    { num: "40,000+", label: "km of HSR track" },
                    { num: "30+", label: "cities with metro" },
                    { num: "5B+", label: "annual train trips" },
                    { num: "1M+", label: "bikes in Shanghai" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="font-display font-bold text-[#DC2626] text-lg">
                        {stat.num}
                      </div>
                      <div className="font-body text-[10px] text-[#A8A29E] leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Article Body ──────────────────────────────── */}
          <main className="flex-1 min-w-0 max-w-3xl">
            {/* ── Overview ──────────────────────────────── */}
            <section id="overview" className="mb-16">
              <SectionLabel>Overview</SectionLabel>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111110] mb-6 leading-tight">
                China&apos;s Transport System is Unlike Anything You&apos;ve
                Seen
              </h2>
              <p className="font-body text-base text-[#78716C] leading-relaxed mb-4 first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-[#DC2626] first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                China has built one of the most comprehensive and
                technologically advanced transportation networks on the planet.
                In the past decade alone, the country has laid more than 40,000
                km of high-speed rail &mdash; more than the rest of the world
                combined &mdash; while simultaneously expanding metro systems in
                over 30 cities, deploying millions of shared bicycles, and
                digitizing payments so seamlessly that cash has become almost
                obsolete.
              </p>
              <p className="font-body text-base text-[#78716C] leading-relaxed mb-6">
                For foreign travelers, this can feel both exhilarating and
                overwhelming. Google Maps doesn&apos;t work. Signs are bilingual
                but apps are often in Mandarin. Yet with the right preparation
                &mdash; a few key apps, an Alipay account, and this guide
                &mdash; you&apos;ll navigate China&apos;s cities with the ease
                of a local.
              </p>

              {/* Quick-reference transport grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 fade-in-up">
                {[
                  {
                    icon: <Train size={18} />,
                    label: "High-Speed Rail",
                    desc: "Between cities",
                  },
                  {
                    icon: <MapPin size={18} />,
                    label: "Metro",
                    desc: "Within cities",
                  },
                  {
                    icon: <Bus size={18} />,
                    label: "City Bus",
                    desc: "Local coverage",
                  },
                  {
                    icon: <Car size={18} />,
                    label: "Didi / Taxi",
                    desc: "Door to door",
                  },
                  {
                    icon: <Bike size={18} />,
                    label: "Bike Share",
                    desc: "Last mile",
                  },
                  {
                    icon: <Smartphone size={18} />,
                    label: "Alipay",
                    desc: "Pay everything",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white border border-[#E7E5E4] rounded-xl p-4 flex items-center gap-3 fade-in-up"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-body text-xs font-semibold text-[#111110]">
                        {item.label}
                      </div>
                      <div className="font-body text-[10px] text-[#A8A29E]">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-l-[3px] border-[#DC2626] pl-6 py-2 mb-8">
                <p className="font-body text-lg text-[#DC2626] italic leading-relaxed">
                  &ldquo;Learning how to smartly utilize China&apos;s transport
                  services can radically transform your travel experience &mdash;
                  allowing you to admire its wonders while immersing yourself in
                  local life.&rdquo;
                </p>
              </div>
            </section>

            {/* ── Metro ─────────────────────────────────── */}
            <section id="metro" className="mb-16">
              <SectionLabel>Metro &amp; Subway</SectionLabel>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111110] mb-4 leading-tight">
                The Metro: Your Best Friend in Chinese Cities
              </h2>

              <div
                className="relative rounded-xl overflow-hidden mb-8 fade-in-up"
                style={{ height: "320px" }}
              >
                <img
                  src={METRO_IMG}
                  alt="Modern Chinese metro station"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-4"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                  }}
                >
                  <p className="font-body text-xs text-white/80">
                    Shanghai metro &mdash; bilingual signage, platform screen
                    doors, and real-time arrivals
                  </p>
                </div>
              </div>

              <p className="font-body text-base text-[#78716C] leading-relaxed mb-4">
                The metro is arguably the single best way to get around Chinese
                cities. With over 30 cities now operating modern underground
                networks &mdash; including Beijing&apos;s 27-line behemoth and
                Shanghai&apos;s 20-line system &mdash; you can reach virtually
                any major attraction, hotel, or neighborhood quickly and cheaply.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    title: "English Signage",
                    desc: "All major metro systems display bilingual Chinese/English signs, announcements, and ticket machine interfaces.",
                  },
                  {
                    title: "Clean & Efficient",
                    desc: "Stations are modern, air-conditioned, and maintained to a high standard. Toilets (including Western-style) are available at most stations.",
                  },
                  {
                    title: "Affordable Fares",
                    desc: "Trips typically cost \u00A53\u20139 depending on distance. Monthly passes (~\u00A5200) offer significant savings for regular users.",
                  },
                  {
                    title: "Tap-to-Pay",
                    desc: "Use Alipay's Transport QR code to tap in and out \u2014 no need to buy a physical ticket for each journey.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 fade-in-up"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-[#DC2626] mt-1 shrink-0"
                    />
                    <div>
                      <div className="font-body text-sm font-semibold text-[#111110] mb-1">
                        {item.title}
                      </div>
                      <div className="font-body text-sm text-[#78716C] leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <TipBox icon={<AlertCircle size={18} />}>
                <strong>Avoid rush hours:</strong> Subways are extremely crowded
                between 7&ndash;9 AM and 5&ndash;7 PM. If possible, travel
                between 9:30 AM&ndash;4 PM or after 7:30 PM for a much more
                comfortable experience.
              </TipBox>

              <div className="fade-in-up rounded-xl overflow-hidden border border-[#E7E5E4]">
                <img
                  src={SUBWAY_MAP_IMG}
                  alt="Beijing subway map"
                  className="w-full object-cover"
                  style={{ maxHeight: "220px" }}
                />
                <div className="p-4 bg-white">
                  <p className="font-body text-xs text-[#78716C]">
                    Beijing&apos;s metro map &mdash; download the{" "}
                    <strong>MetroMan app</strong> for offline access to 50+ city
                    maps with English station names and exit guides.
                  </p>
                </div>
              </div>
            </section>

            {/* ── High-Speed Rail ───────────────────────── */}
            <section id="hsr" className="mb-16">
              <SectionLabel>High-Speed Rail</SectionLabel>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111110] mb-4 leading-tight">
                High-Speed Rail: The World&apos;s Best Train Network
              </h2>

              <div
                className="relative rounded-xl overflow-hidden mb-8 fade-in-up"
                style={{ height: "300px" }}
              >
                <img
                  src={TRAIN_STATION_IMG}
                  alt="CRH bullet train at station"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 flex items-end p-6"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
                  }}
                >
                  <div>
                    <div className="font-body text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
                      Fuxing Hao &middot; CR400BF
                    </div>
                    <p className="font-display text-xl text-white font-semibold">
                      Up to 350 km/h &mdash; Beijing to Shanghai in 4.5 hours
                    </p>
                  </div>
                </div>
              </div>

              <p className="font-body text-base text-[#78716C] leading-relaxed mb-4">
                China&apos;s high-speed rail (HSR) network is the largest in the
                world &mdash; over 40,000 km of dedicated track, with a target
                of exceeding 50,000 km by 2030. The Fuxing trains connect major
                cities at speeds up to 350 km/h, offering punctuality, comfort,
                and economy that often beats flying when you factor in airport
                time.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-6 fade-in-up">
                {[
                  {
                    route: "Beijing \u2192 Shanghai",
                    time: "4.5 hrs",
                    price: "\u00A5553",
                    type: "G Train",
                  },
                  {
                    route: "Shanghai \u2192 Hangzhou",
                    time: "45 min",
                    price: "\u00A573",
                    type: "G Train",
                  },
                  {
                    route: "Beijing \u2192 Xi\u2019an",
                    time: "4.5 hrs",
                    price: "\u00A5515",
                    type: "G Train",
                  },
                ].map((route) => (
                  <div
                    key={route.route}
                    className="bg-white border border-[#E7E5E4] rounded-xl p-4 fade-in-up"
                  >
                    <div className="font-body text-xs font-semibold uppercase tracking-widest text-[#DC2626] mb-2">
                      {route.type}
                    </div>
                    <div className="font-display font-semibold text-[#111110] text-sm mb-2 leading-tight">
                      {route.route}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[#78716C]">
                        <Clock size={12} />
                        <span className="font-body text-xs">{route.time}</span>
                      </div>
                      <span className="font-body text-xs font-semibold text-[#DC2626]">
                        {route.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <TipBox icon={<CheckCircle2 size={18} />}>
                <strong>Book with Trip.com</strong> &mdash; the easiest
                English-language platform for foreign travelers to book HSR
                tickets. Pay with international cards, receive e-tickets (just
                scan your passport at the gate), and manage all bookings in one
                place. Book in advance for popular routes, especially during
                Golden Week and Spring Festival.
              </TipBox>

              <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 fade-in-up">
                <h4 className="font-display font-semibold text-[#111110] mb-3">
                  Train Classes Explained
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      cls: "G Train (\u9AD8\u94C1)",
                      desc: "Fastest, most comfortable. Speeds up to 350 km/h. Best for major city pairs.",
                    },
                    {
                      cls: "D Train (\u52A8\u8F66)",
                      desc: "High-speed but slightly slower (200\u2013250 km/h). Often cheaper than G trains.",
                    },
                    {
                      cls: "C Train (\u57CE\u9645)",
                      desc: "Intercity express for shorter routes between nearby cities.",
                    },
                    {
                      cls: "Regular Trains",
                      desc: "Slower, cheaper, great for overnight journeys with sleeper berths. Limited English.",
                    },
                  ].map((item) => (
                    <div
                      key={item.cls}
                      className="flex gap-3 py-2 border-b border-[#F5F5F4] last:border-0"
                    >
                      <span className="font-body text-xs font-semibold text-[#DC2626] w-28 shrink-0">
                        {item.cls}
                      </span>
                      <span className="font-body text-sm text-[#78716C]">
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── City Buses ────────────────────────────── */}
            <section id="buses" className="mb-16">
              <SectionLabel>City Buses</SectionLabel>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111110] mb-4 leading-tight">
                City Buses: The Local&apos;s Choice
              </h2>
              <p className="font-body text-base text-[#78716C] leading-relaxed mb-4">
                City buses cover areas that metro lines don&apos;t reach, and at
                just &yen;2 per trip, they&apos;re the cheapest way to get
                around. The challenge for foreigners is knowing when to get off
                &mdash; there are no automatic English announcements on most
                routes, and stops can be easy to miss.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 fade-in-up">
                  <h4 className="font-display font-semibold text-[#111110] mb-3">
                    What Works Well
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "All buses accept Alipay/WeChat Pay \u2014 same QR code as metro",
                      "Flat \u00A52 fare in most cities \u2014 extremely affordable",
                      "Great way to see the city from street level",
                      "Covers neighborhoods beyond metro reach",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2
                          size={13}
                          className="text-[#DC2626] mt-0.5 shrink-0"
                        />
                        <span className="font-body text-sm text-[#78716C]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 fade-in-up">
                  <h4 className="font-display font-semibold text-[#111110] mb-3">
                    Watch Out For
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "No English stop announcements on most routes",
                      "Crowded during peak hours \u2014 plan accordingly",
                      "Rural routes can be infrequent and unpredictable",
                      "Use Amap to track your stop in real-time",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <AlertCircle
                          size={13}
                          className="text-amber-500 mt-0.5 shrink-0"
                        />
                        <span className="font-body text-sm text-[#78716C]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <TipBox>
                Use <strong>Amap (Gaode Maps)</strong> in English to navigate
                bus routes. It shows real-time bus locations, stop names in
                English, and alerts you when your stop is approaching &mdash;
                making bus travel much more manageable for foreigners.
              </TipBox>
            </section>

            {/* ── Taxis & Didi ──────────────────────────── */}
            <section id="taxis" className="mb-16">
              <SectionLabel>Taxis &amp; Ride-Hailing</SectionLabel>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111110] mb-4 leading-tight">
                Didi: China&apos;s Uber (and It&apos;s Better)
              </h2>
              <p className="font-body text-base text-[#78716C] leading-relaxed mb-6">
                Didi Chuxing is China&apos;s dominant ride-hailing platform,
                operating like Uber but with a few key advantages for foreigners.
                The English-language app lets you enter your destination in
                English, see the fare estimate upfront, and pay via Alipay or
                international card &mdash; no Mandarin required.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <TransportCard
                  icon={<Car size={18} />}
                  title="Didi Chuxing"
                  subtitle="China's #1 ride-hailing app"
                  tags={[
                    "English App",
                    "International Cards",
                    "No Mandarin Needed",
                  ]}
                >
                  <p>
                    Works exactly like Uber. Enter destination in English, driver
                    is dispatched, you pay via Alipay. Drivers rarely speak
                    English but the app handles all communication.
                  </p>
                  <p className="mt-2">
                    <strong>Pro tip:</strong> Access Didi directly through Alipay
                    &rarr; Transport &rarr; Didi. This version requires no extra
                    ID verification and is the easiest option for tourists.
                  </p>
                </TransportCard>
                <TransportCard
                  icon={<MapPin size={18} />}
                  title="Street Taxis"
                  subtitle="Traditional metered cabs"
                  tags={[
                    "Cash & Alipay",
                    "Metered Fare",
                    "Available Everywhere",
                  ]}
                >
                  <p>
                    Traditional taxis are still widely available, but hailing one
                    during peak hours can be difficult. Always have your
                    destination written in Chinese characters to show the driver.
                  </p>
                  <p className="mt-2">
                    <strong>Flag drop:</strong> &yen;13 in Beijing, &yen;14 in
                    Shanghai, &yen;10 in Guangzhou. Night rates are higher.
                  </p>
                </TransportCard>
              </div>
              <TipBox icon={<CheckCircle2 size={18} />}>
                <strong>Always use Didi over street taxis</strong> &mdash;
                it&apos;s cheaper, safer (GPS-tracked), and you don&apos;t need
                to negotiate or worry about being taken the long way. Pin your
                exact pickup location to the hotel lobby entrance, not the
                street corner.
              </TipBox>
            </section>

            {/* ── Bike Sharing ──────────────────────────── */}
            <section id="bikes" className="mb-16">
              <SectionLabel>Bike Sharing</SectionLabel>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111110] mb-4 leading-tight">
                Bike Sharing: The Perfect Last-Mile Solution
              </h2>

              <div
                className="relative rounded-xl overflow-hidden mb-8 fade-in-up"
                style={{ height: "280px" }}
              >
                <img
                  src={BIKES_IMG}
                  alt="Shared bikes on a Shanghai street"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-4"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
                  }}
                >
                  <p className="font-body text-xs text-white/80">
                    Meituan (yellow) and Hellobike (orange) bikes lined up on a
                    Shanghai boulevard
                  </p>
                </div>
              </div>

              <p className="font-body text-base text-[#78716C] leading-relaxed mb-4">
                China has over 1 million shared bicycles in Shanghai alone.
                These dockless bikes are scattered throughout every major city
                and can be unlocked in seconds using Alipay. At &yen;1.50&ndash;3
                per hour, they&apos;re perfect for bridging the gap between
                metro stations and your final destination.
              </p>

              <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 mb-6 fade-in-up">
                <h4 className="font-display font-semibold text-[#111110] mb-4">
                  How to Unlock a Bike with Alipay
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      step: "1",
                      text: "Open Alipay and tap the Scan (\u626B\u4E00\u626B) button",
                    },
                    {
                      step: "2",
                      text: "Scan the QR code on the bike\u2019s lock",
                    },
                    {
                      step: "3",
                      text: "The lock opens automatically \u2014 ride away",
                    },
                    {
                      step: "4",
                      text: "Park in a designated zone (painted area) and lock manually",
                    },
                    {
                      step: "5",
                      text: "Alipay charges \u00A51.50\u20133/hour automatically",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#DC2626] text-white flex items-center justify-center font-body text-xs font-semibold shrink-0">
                        {item.step}
                      </div>
                      <span className="font-body text-sm text-[#78716C] pt-0.5">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <TipBox icon={<AlertCircle size={18} />}>
                <strong>Always park in designated zones</strong> (marked with
                painted lines on the pavement). Parking outside these zones can
                result in a &yen;5&ndash;20 fine charged to your Alipay. Meituan
                (yellow) and Didi (blue-green) bikes require their own apps
                &mdash; use Hellobike or generic bikes with Alipay Scan for the
                easiest experience.
              </TipBox>
            </section>

            {/* ── Payment Methods ───────────────────────── */}
            <section id="payment" className="mb-16">
              <SectionLabel>Payment Methods</SectionLabel>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111110] mb-4 leading-tight">
                Paying for Transport: The Cashless Revolution
              </h2>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="fade-in-up">
                  <img
                    src={ALIPAY_IMG}
                    alt="Alipay and WeChat Pay"
                    className="w-full rounded-xl object-cover mb-4"
                    style={{ height: "200px" }}
                  />
                </div>
                <div className="fade-in-up">
                  <p className="font-body text-base text-[#78716C] leading-relaxed mb-4">
                    China has essentially gone cashless. Alipay and WeChat Pay
                    are the primary payment methods for all public transport
                    &mdash; metro, buses, taxis, bikes, and trains. As a foreign
                    traveler,{" "}
                    <strong>Alipay is your best option</strong> as it accepts
                    international Visa/Mastercard directly.
                  </p>
                  <div className="space-y-3">
                    {[
                      {
                        app: "Alipay",
                        desc: "Links to international cards. One QR code for metro, bus, bike, and Didi.",
                      },
                      {
                        app: "WeChat Pay",
                        desc: "Requires a Chinese bank account or a friend to top up. Less convenient for tourists.",
                      },
                      {
                        app: "Transport Card",
                        desc: "Physical card (e.g., Beijing Yikatong) \u2014 rechargeable, works on metro, bus, and some taxis.",
                      },
                    ].map((item) => (
                      <div key={item.app} className="flex items-start gap-3">
                        <Wallet
                          size={14}
                          className="text-[#DC2626] mt-1 shrink-0"
                        />
                        <div>
                          <span className="font-body text-sm font-semibold text-[#111110]">
                            {item.app}:{" "}
                          </span>
                          <span className="font-body text-sm text-[#78716C]">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#FEF2F2] border border-[#DC2626]/20 rounded-xl p-5 mb-6 fade-in-up">
                <h4 className="font-display font-semibold text-[#111110] mb-3">
                  Setting Up Alipay for Metro (Step-by-Step)
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Open Alipay \u2192 tap \u2018Transport\u2019 (\u51FA\u884C)",
                    "Tap the city dropdown and select your city",
                    "Tap \u2018Get Now\u2019 and agree to terms",
                    "Your metro QR code is ready \u2014 scan at the gate",
                    "Repeat for each new city you visit",
                    "Buses use a separate QR code in the same menu",
                  ].map((step, i) => (
                    <div key={step} className="flex items-start gap-2">
                      <span className="font-body text-xs font-bold text-[#DC2626] w-5 shrink-0">
                        {i + 1}.
                      </span>
                      <span className="font-body text-sm text-[#78716C]">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="font-display text-xl font-semibold text-[#111110] mb-4">
                Transport Costs at a Glance
              </h3>
              <PriceTable />
            </section>

            {/* ── Map Apps ──────────────────────────────── */}
            <section id="maps" className="mb-16">
              <SectionLabel>Map Apps</SectionLabel>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111110] mb-4 leading-tight">
                Forget Google Maps &mdash; Use These Instead
              </h2>

              <div className="grid sm:grid-cols-2 gap-6 mb-8 items-center">
                <div>
                  <p className="font-body text-base text-[#78716C] leading-relaxed mb-4">
                    Google Maps is technically blocked in China and its data is
                    severely outdated. Even with a VPN, it&apos;s unreliable for
                    transit directions. The good news: China&apos;s own map apps
                    are excellent &mdash; and Amap now has a full English
                    interface.
                  </p>
                  <div className="bg-[#FEF2F2] border-l-[3px] border-[#DC2626] rounded-r-xl p-4">
                    <span className="font-body text-sm font-semibold text-[#DC2626]">
                      Our recommendation:
                    </span>{" "}
                    <span className="font-body text-sm text-[#78716C]">
                      iPhone users &rarr; Apple Maps. Android users &rarr; Amap
                      (Gaode). Both work offline and show real-time transit.
                    </span>
                  </div>
                </div>
                <div className="fade-in-up rounded-xl overflow-hidden">
                  <img
                    src={APPS_IMG}
                    alt="Navigation apps for China"
                    className="w-full object-cover rounded-xl"
                    style={{ height: "220px" }}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <AppCard
                  name="Apple Maps"
                  type="Maps & Navigation"
                  rating={4}
                  badge="Best for iPhone"
                  description="When you're physically in China, Apple Maps automatically switches to Gaode Maps data while keeping everything in English. Shockingly accurate for metro routes, bus schedules, and live traffic."
                  pros={[
                    "Full English interface",
                    "Uses Gaode data (most accurate in China)",
                    "Offline maps available",
                    "Real-time transit updates",
                  ]}
                />
                <AppCard
                  name="Amap (Gaode \u9AD8\u5FB7)"
                  type="Maps & Navigation"
                  rating={5}
                  badge="Best Overall"
                  description="China's most accurate map app, now with full English support as of 2025. Essential for Android users. Shows live traffic light timers, real-time bus positions, and hyper-local POI data."
                  pros={[
                    "Full English mode (change in settings)",
                    "Best real-time traffic data",
                    "Shows bus stop ETAs",
                    "3D city view for complex areas",
                  ]}
                />
                <AppCard
                  name="MetroMan"
                  type="Subway Maps"
                  rating={4}
                  description="English-first subway app covering 50+ Chinese cities. Works offline. Shows transfers, exits, and station layouts — ideal for first-timers in Beijing or Shanghai."
                  pros={[
                    "Works completely offline",
                    "50+ city metro maps",
                    "English station names & exits",
                    "Transfer time estimates",
                  ]}
                />
                <AppCard
                  name="Trip.com"
                  type="Train & Flight Booking"
                  rating={5}
                  badge="For Booking"
                  description="The easiest English platform for booking HSR tickets and flights as a foreigner. Accepts international cards, issues e-tickets (scan passport at gate), and has a clean English interface."
                  pros={[
                    "Full English interface",
                    "International card payments",
                    "E-tickets \u2014 no printing needed",
                    "Compare flights + trains together",
                  ]}
                />
              </div>

              <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 fade-in-up">
                <h4 className="font-display font-semibold text-[#111110] mb-3">
                  How to Set Amap to English
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-body text-xs font-semibold text-[#DC2626] mb-2">
                      On iPhone:
                    </p>
                    <ol className="space-y-1">
                      {[
                        "Go to iPhone Settings app",
                        "Scroll to Apps \u2192 find Amap",
                        "Language Settings \u2192 English",
                        "Restart the app",
                      ].map((step, i) => (
                        <li
                          key={step}
                          className="font-body text-sm text-[#78716C] flex gap-2"
                        >
                          <span className="text-[#DC2626] font-body text-xs font-semibold">
                            {i + 1}.
                          </span>{" "}
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <p className="font-body text-xs font-semibold text-[#DC2626] mb-2">
                      On Android:
                    </p>
                    <ol className="space-y-1">
                      {[
                        "Open Amap \u2192 tap person icon (bottom right)",
                        "Tap bolt icon (top right)",
                        "Select 6th option \u2018\u901A\u7528\u2019 (General)",
                        "Find \u2018\u8BED\u8A00\u8BBE\u7F6E\u2019 \u2192 change to English",
                      ].map((step, i) => (
                        <li
                          key={step}
                          className="font-body text-sm text-[#78716C] flex gap-2"
                        >
                          <span className="text-[#DC2626] font-body text-xs font-semibold">
                            {i + 1}.
                          </span>{" "}
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Pro Tips ──────────────────────────────── */}
            <section id="tips" className="mb-16">
              <SectionLabel>Pro Tips</SectionLabel>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111110] mb-6 leading-tight">
                Essential Tips for a Smooth Journey
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  {
                    icon: <Smartphone size={18} />,
                    title: "Set Up Alipay Before You Arrive",
                    desc: "Download Alipay and link your international Visa/Mastercard before landing. Activate the Transport QR code for your first city. This single app handles metro, bus, bike, Didi, and almost all payments.",
                  },
                  {
                    icon: <Navigation size={18} />,
                    title: "Download Offline Maps",
                    desc: "Download your destination city\u2019s offline map in Amap or Apple Maps before you travel. China\u2019s mobile data can be spotty in stations and tunnels.",
                  },
                  {
                    icon: <Clock size={18} />,
                    title: "Avoid Rush Hours",
                    desc: "Peak hours (7\u20139 AM, 5\u20137 PM) are intensely crowded on metro and buses. If your schedule allows, travel between 9:30 AM\u20134 PM or after 7:30 PM.",
                  },
                  {
                    icon: <MapPin size={18} />,
                    title: "Save Destinations in Chinese",
                    desc: "Screenshot or save your hotel address and key destinations in Chinese characters. Show these to taxi drivers or station staff \u2014 transport employees rarely speak English.",
                  },
                  {
                    icon: <CreditCard size={18} />,
                    title: "Get a Transport Card",
                    desc: "For longer stays, buy a rechargeable city transport card (e.g., Beijing Yikatong, Shanghai Public Transport Card). They offer small discounts and work across metro, bus, and sometimes taxis.",
                  },
                  {
                    icon: <Train size={18} />,
                    title: "Book HSR Tickets Early",
                    desc: "High-speed rail tickets open 15 days in advance and sell out fast, especially around Chinese holidays. Use Trip.com to book with your international card.",
                  },
                ].map((tip) => (
                  <div
                    key={tip.title}
                    className="bg-white border border-[#E7E5E4] rounded-xl p-5 fade-in-up"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] shrink-0">
                        {tip.icon}
                      </div>
                      <h4 className="font-display font-semibold text-[#111110] text-sm leading-tight">
                        {tip.title}
                      </h4>
                    </div>
                    <p className="font-body text-sm text-[#78716C] leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Etiquette section */}
              <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 fade-in-up">
                <h3 className="font-display text-xl font-semibold text-[#111110] mb-4">
                  Transport Etiquette in China
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Queue patiently \u2014 respect the order of arrival even in crowds",
                    "Let passengers exit before boarding the metro or bus",
                    "Avoid loud phone calls in metro cars",
                    "Offer your seat to elderly, pregnant, or disabled passengers",
                    "Keep belongings close \u2014 pickpockets target busy stations",
                    "Avoid eating on the metro \u2014 it\u2019s prohibited in many cities",
                  ].map((rule) => (
                    <div key={rule} className="flex items-start gap-2">
                      <ArrowRight
                        size={12}
                        className="text-[#DC2626] mt-1 shrink-0"
                      />
                      <span className="font-body text-sm text-[#78716C]">
                        {rule}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Useful Phrases ────────────────────────── */}
            <section className="mb-16 fade-in-up">
              <SectionLabel>Useful Mandarin</SectionLabel>
              <h2 className="font-display text-2xl font-bold text-[#111110] mb-4">
                A Few Words Go a Long Way
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    zh: "\u4F60\u597D",
                    pinyin: "N\u01D0 h\u01CEo",
                    en: "Hello",
                  },
                  {
                    zh: "\u8C22\u8C22",
                    pinyin: "Xi\u00E8xi\u00E8",
                    en: "Thank you",
                  },
                  {
                    zh: "\u5730\u94C1\u7AD9\u5728\u54EA\u91CC\uFF1F",
                    pinyin: "D\u00ECti\u011B zh\u00E0n z\u00E0i n\u01CEl\u01D0?",
                    en: "Where is the metro station?",
                  },
                  {
                    zh: "\u6211\u8981\u53BB\u2026",
                    pinyin: "W\u01D2 y\u00E0o q\u00F9\u2026",
                    en: "I want to go to\u2026",
                  },
                  {
                    zh: "\u591A\u5C11\u94B1\uFF1F",
                    pinyin: "Du\u014Dshao qi\u00E1n?",
                    en: "How much does it cost?",
                  },
                  {
                    zh: "\u8BF7\u505C\u5728\u8FD9\u91CC",
                    pinyin: "Q\u01D0ng t\u00EDng z\u00E0i zh\u00E8l\u01D0",
                    en: "Please stop here (for taxis)",
                  },
                ].map((phrase) => (
                  <div
                    key={phrase.zh}
                    className="bg-white border border-[#E7E5E4] rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className="text-2xl font-display font-bold text-[#DC2626] w-24 shrink-0">
                      {phrase.zh}
                    </div>
                    <div>
                      <div className="font-body text-xs text-[#A8A29E] italic">
                        {phrase.pinyin}
                      </div>
                      <div className="font-body text-sm text-[#111110]">
                        {phrase.en}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Final Summary ─────────────────────────── */}
            <section className="fade-in-up">
              <div className="bg-[#0D0D0D] rounded-2xl p-8 text-white relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5"
                  style={{
                    background: "#DC2626",
                    transform: "translate(30%, -30%)",
                  }}
                />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-[2px] bg-[#DC2626]" />
                    <span className="font-body text-xs font-semibold uppercase tracking-widest text-white/50">
                      The Bottom Line
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                    China&apos;s Transport is Extraordinary &mdash; Once You
                    Know the Rules
                  </h2>
                  <p className="font-body text-base text-white/70 leading-relaxed mb-6">
                    The combination of world-class infrastructure, near-zero
                    prices, and seamless digital payments makes China one of the
                    easiest countries to navigate &mdash; once you&apos;ve got
                    Alipay set up and Amap downloaded. The metro will be your
                    daily companion, HSR will connect cities faster than flying,
                    and Didi will handle everything in between.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      {
                        title: "Must-Have Apps",
                        items: [
                          "Alipay",
                          "Amap / Apple Maps",
                          "Trip.com",
                          "MetroMan",
                        ],
                      },
                      {
                        title: "Payment Setup",
                        items: [
                          "Link Alipay to Visa/MC",
                          "Activate Transport QR",
                          "Get city transport card",
                          "Keep some cash backup",
                        ],
                      },
                      {
                        title: "Transport Hierarchy",
                        items: [
                          "Metro for city travel",
                          "HSR between cities",
                          "Didi for door-to-door",
                          "Bikes for last mile",
                        ],
                      },
                    ].map((col) => (
                      <div key={col.title}>
                        <div className="font-body text-xs font-semibold text-white/50 mb-2">
                          {col.title}
                        </div>
                        <ul className="space-y-1">
                          {col.items.map((item) => (
                            <li
                              key={item}
                              className="font-body text-sm text-white/80 flex items-center gap-2"
                            >
                              <div className="w-1 h-1 rounded-full bg-[#DC2626]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
