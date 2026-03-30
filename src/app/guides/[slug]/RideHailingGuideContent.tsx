"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin, Smartphone, CreditCard, Shield, MessageCircle,
  ChevronDown, Clock, Globe, Car, Users, Zap, AlertTriangle,
  CheckCircle, ArrowUp, BookOpen, Navigation, Wallet, Settings,
  ChevronRight
} from "lucide-react";

/* ─── CDN Image URLs ─── */
const IMG = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/LHHw4pLcoN2RhHzzWiPFj4/hero-china-street-mMwjJE8kFm5BvRbDBzeWZf.webp",
  didiApp: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/LHHw4pLcoN2RhHzzWiPFj4/didi-app-mockup-H2vcho5Xdje9NtoQnQdZy2.webp",
  nightTaxi: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/LHHw4pLcoN2RhHzzWiPFj4/china-city-taxi-UYTfzraVtudQVomove4kGw.webp",
  payment: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/LHHw4pLcoN2RhHzzWiPFj4/alipay-payment-C7qs5NK2RKVVzM2X9akEzZ.webp",
  hutong: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/LHHw4pLcoN2RhHzzWiPFj4/china-travel-street-bgwumePtZDYbjaxNAVnipM.webp",
  ssHomeScreen: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/LHHw4pLcoN2RhHzzWiPFj4/IMG_6681-1-1002x2048_fa51ec3a.jpg",
  ssAccountMenu: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/LHHw4pLcoN2RhHzzWiPFj4/IMG_6682-1104x2048_4aaec981.jpg",
  ssWallet: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/LHHw4pLcoN2RhHzzWiPFj4/IMG_6683-989x2048_ce7dcd7c.jpg",
  ssPaymentMethods: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/LHHw4pLcoN2RhHzzWiPFj4/IMG_6684-1_737b9724.webp",
};

/* ─── Animation Helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

function Anim({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── TOC Data ─── */
const CHAPTERS = [
  { id: "what-is-didi", num: "01", label: "What is DiDi?" },
  { id: "can-foreigners-use", num: "02", label: "Can Foreigners Use It?" },
  { id: "how-to-use", num: "03", label: "How to Use DiDi" },
  { id: "ride-options", num: "04", label: "Ride Options & Pricing" },
  { id: "pro-tips", num: "05", label: "Pro Tips" },
  { id: "safety", num: "06", label: "Safety & Alternatives" },
  { id: "faq", num: "07", label: "FAQ" },
];

/* ─── Reusable Components ─── */

function RibbonDivider() {
  return (
    <div className="flex items-center gap-4 my-12 md:my-16">
      <div className="flex-1 h-px bg-[#E7E5E4]" />
      <div className="w-10 h-1.5 bg-[#DC2626] rounded-full" />
      <div className="flex-1 h-px bg-[#E7E5E4]" />
    </div>
  );
}

function ChapterHeading({ id, num, children }: { id: string; num: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24 mb-8">
      <span className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-[#DC2626] mb-2 block">
        Chapter {num}
      </span>
      <h2 className="font-display text-3xl md:text-[2.5rem] font-semibold text-[#111110] leading-tight">
        {children}
      </h2>
    </div>
  );
}

function StickyNote({ children, rotate = "1deg" }: { children: React.ReactNode; rotate?: string }) {
  return (
    <div
      className="bg-[#F0FDF4] border border-[#BBF7D0] p-4 md:p-5 shadow-[2px_3px_8px_rgba(0,0,0,0.06)]"
      style={{ transform: `rotate(${rotate})` }}
    >
      <div className="flex items-start gap-2.5">
        <Zap className="w-4 h-4 text-[#16A34A] mt-0.5 shrink-0" />
        <div className="font-body text-sm text-[#111110] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function ScreenshotCard({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-2 max-w-[220px] md:max-w-[240px]">
        <img src={src} alt={alt} className="w-full h-auto rounded-xl" loading="lazy" />
      </div>
      <p className="font-body text-xs text-[#78716C] mt-3 text-center max-w-[220px] leading-relaxed">
        {caption}
      </p>
    </div>
  );
}

function StepItem({ number, title, desc, icon: Icon }: { number: number; title: string; desc: string; icon: React.ElementType }) {
  return (
    <motion.div variants={fadeUp} className="flex gap-4">
      <div className="flex flex-col items-center shrink-0">
        <div className="font-display w-9 h-9 rounded-full bg-[#DC2626] text-white flex items-center justify-center text-sm font-bold">
          {number}
        </div>
        <div className="w-px flex-1 bg-[#E7E5E4] mt-2" />
      </div>
      <div className="pb-8">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4 text-[#DC2626]" />
          <h4 className="text-base font-semibold text-[#111110]">{title}</h4>
        </div>
        <p className="font-body text-[15px] text-[#44403C] leading-[1.75]">{desc}</p>
      </div>
    </motion.div>
  );
}

function InfoCard({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <motion.div variants={fadeUp} className="bg-white border border-[#E7E5E4] rounded-xl p-5 hover:shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-shadow">
      <div className="w-9 h-9 rounded-lg bg-[#FEF2F2] flex items-center justify-center mb-3">
        <Icon className="w-[18px] h-[18px] text-[#DC2626]" />
      </div>
      <h4 className="text-sm font-semibold text-[#111110] mb-1">{title}</h4>
      <p className="font-body text-sm text-[#44403C] leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E7E5E4]">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left gap-4">
        <span className="text-base font-medium text-[#111110]">{q}</span>
        <ChevronDown className={`w-5 h-5 text-[#DC2626] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
        className="overflow-hidden"
      >
        <p className="font-body pb-5 text-[15px] text-[#44403C] leading-[1.75]">{a}</p>
      </motion.div>
    </div>
  );
}

/* ─── Sidebar TOC ─── */
function SidebarTOC({ active }: { active: string }) {
  return (
    <nav className="hidden lg:block sticky top-24 w-52 shrink-0 self-start">
      <div className="flex items-center gap-2 mb-5">
        <BookOpen className="w-4 h-4 text-[#DC2626]" />
        <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-[#78716C]">
          Chapters
        </span>
      </div>
      <div className="space-y-1">
        {CHAPTERS.map((ch) => (
          <a
            key={ch.id}
            href={`#${ch.id}`}
            className={`font-body flex items-center gap-2.5 py-2 px-3 rounded-md text-sm transition-all duration-200 ${
              active === ch.id
                ? "bg-[#FEF2F2] text-[#DC2626] font-medium"
                : "text-[#78716C] hover:text-[#44403C] hover:bg-[#F5F5F4]"
            }`}
          >
            <span className="text-[10px] font-bold tracking-wider opacity-60">{ch.num}</span>
            <span>{ch.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ─── Main Component ─── */
export default function RideHailingGuideContent() {
  const [active, setActive] = useState("");
  const [showTop, setShowTop] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const st = window.scrollY;
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(dh > 0 ? (st / dh) * 100 : 0);
      setShowTop(st > 500);
      const sects = CHAPTERS.map((c) => document.getElementById(c.id));
      for (let i = sects.length - 1; i >= 0; i--) {
        if (sects[i] && sects[i]!.getBoundingClientRect().top <= 140) {
          setActive(CHAPTERS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px]">
        <div className="h-full bg-[#DC2626] transition-[width] duration-100" style={{ width: `${progress}%` }} />
      </div>

      {/* Header */}
      <header className="fixed top-[3px] left-0 right-0 z-40 bg-[#FAFAF9]/92 backdrop-blur-md border-b border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#DC2626]" />
            <span className="font-body text-sm font-semibold tracking-wide text-[#44403C]">
              Travel Guide
            </span>
          </div>
          <span className="font-body text-xs text-[#78716C]">
            Updated March 2026
          </span>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-[3px]">
        <div className="relative h-[55vh] md:h-[65vh] overflow-hidden">
          <motion.div initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: "easeOut" }} className="absolute inset-0">
            <img src={IMG.hero} alt="Busy Shanghai street at dusk with taxis" className="w-full h-full object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-1 bg-[#DC2626] rounded-full" />
                <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-white/70">Practical Guide</span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.12] mb-4">
                The Ultimate Guide to<br />Ride-Hailing in China
              </h1>
              <p className="font-body text-base md:text-lg text-white/75 max-w-xl leading-relaxed">
                DiDi, taxis, payments, and everything a foreigner needs to navigate Chinese cities with confidence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meta bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="font-body py-5 border-b border-[#E7E5E4] flex flex-wrap gap-5 md:gap-8 text-sm text-[#78716C]">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 12 min read</span>
          <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Mainland China</span>
          <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5" /> DiDi &middot; Alipay &middot; WeChat</span>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex gap-12 lg:gap-16">
          <SidebarTOC active={active} />

          <article className="flex-1 max-w-3xl">

            {/* ── Intro ── */}
            <Anim>
              <p className="font-body text-lg leading-[1.85] text-[#44403C] mb-5">
                <span className="font-display text-5xl font-bold float-left mr-3 mt-1 leading-[0.85] text-[#DC2626]">N</span>
                avigating China&rsquo;s vibrant cities can seem daunting, especially if you don&rsquo;t speak Mandarin. But getting around is surprisingly easy thanks to the country&rsquo;s highly efficient ride-hailing ecosystem. While Uber no longer operates in mainland China &mdash; having sold its operations to local giant DiDi Chuxing in 2016 &mdash; you have access to an even more comprehensive network of transport options.
              </p>
              <p className="font-body text-[17px] leading-[1.85] text-[#44403C]">
                This guide combines the best advice from multiple sources to walk you through everything you need to know, with real screenshots from the app to show you exactly what to expect.
              </p>
            </Anim>

            <RibbonDivider />

            {/* ── Ch 01: What is DiDi ── */}
            <Anim>
              <ChapterHeading id="what-is-didi" num="01">What is DiDi?</ChapterHeading>
              <p className="font-body text-[17px] leading-[1.85] text-[#44403C] mb-6">
                DiDi Chuxing is China&rsquo;s leading ride-hailing platform &mdash; the Chinese equivalent of Uber or Grab. Founded in 2012, it merged with a rival in 2015 and acquired Uber&rsquo;s China operations a year later. Today, with over <strong>550 million users</strong> worldwide, it&rsquo;s an essential tool for both locals and foreigners navigating Chinese cities.
              </p>
            </Anim>

            {/* Full-width image */}
            <Anim className="my-8 -mx-4 md:mx-0">
              <img src={IMG.didiApp} alt="DiDi app on phone with passport and tea" className="w-full h-auto md:rounded-lg" />
              <p className="font-body text-xs text-[#78716C] mt-3 px-4 md:px-0 italic">
                The DiDi app makes booking a ride as simple as a few taps on your phone.
              </p>
            </Anim>

            <Anim>
              <p className="font-body text-[17px] leading-[1.85] text-[#44403C] mb-4">
                Beyond basic ride-hailing, DiDi offers taxi dispatch for over 500 taxi companies, designated driving services, bike-sharing, and even food delivery. For travelers, the core ride-hailing service is what matters most.
              </p>
              <StickyNote rotate="-0.5deg">
                <strong>Good to know:</strong> DiDi operates in over 400 Chinese cities. Whether you&rsquo;re in Shanghai, Chengdu, or a smaller city, you&rsquo;ll likely find drivers available.
              </StickyNote>
            </Anim>

            <RibbonDivider />

            {/* ── Ch 02: Can Foreigners Use DiDi ── */}
            <Anim>
              <ChapterHeading id="can-foreigners-use" num="02">Can Foreigners Use DiDi?</ChapterHeading>
              <p className="font-body text-[17px] leading-[1.85] text-[#44403C] mb-8">
                Absolutely. DiDi is remarkably foreigner-friendly. The app features a full English interface, allows registration with international phone numbers, and includes a built-in real-time translation tool for messaging your driver.
              </p>
            </Anim>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={stagger} className="grid sm:grid-cols-2 gap-4 mb-8">
              <InfoCard icon={Smartphone} title="Phone Number" desc="International numbers work. A local SIM or eSIM ensures faster verification codes." />
              <InfoCard icon={CreditCard} title="Payment Method" desc="Link Alipay, WeChat Pay, or an international credit card. Local e-wallets are most reliable." />
              <InfoCard icon={Globe} title="English Interface" desc="Full English UI available. Built-in translator handles driver communication automatically." />
              <InfoCard icon={MapPin} title="Address Input" desc="Type destinations in English. Keep the Chinese name of your hotel saved on your phone." />
            </motion.div>

            <RibbonDivider />

            {/* ── Ch 03: How to Use DiDi ── */}
            <Anim>
              <ChapterHeading id="how-to-use" num="03">How to Use DiDi</ChapterHeading>
              <p className="font-body text-[17px] leading-[1.85] text-[#44403C] mb-4">
                There are two main ways to use DiDi: the standalone app or the mini-program inside Alipay/WeChat. For most travelers, the <strong>Alipay mini-program</strong> is the easiest method. Below we&rsquo;ll walk through the standalone app with real screenshots.
              </p>
            </Anim>

            {/* Method A: Standalone App with Screenshots */}
            <Anim className="mt-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="font-display w-7 h-7 bg-[#DC2626] text-white flex items-center justify-center text-xs font-bold rounded-md">A</div>
                <h3 className="font-display text-xl md:text-2xl font-semibold text-[#111110]">Using the DiDi App</h3>
              </div>
              <p className="font-body text-sm text-[#78716C] mb-6">
                Download &ldquo;DiDi China: Ride Hailing&rdquo; from the App Store or Google Play. Don&rsquo;t confuse it with &ldquo;DiDi Rider&rdquo; (for outside China).
              </p>
            </Anim>

            {/* Step 1: Home screen screenshot */}
            <Anim>
              <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 md:p-8 mb-6">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-[#DC2626] text-white flex items-center justify-center text-xs font-bold">1</div>
                      <h4 className="text-base font-semibold text-[#111110]">The Home Screen</h4>
                    </div>
                    <p className="font-body text-[15px] text-[#44403C] leading-[1.75] mb-4">
                      After opening DiDi, you&rsquo;ll see a map centered on your location. The main interface shows your pickup point and a <strong>&ldquo;Where to?&rdquo;</strong> field to enter your destination. Below the map you&rsquo;ll find quick-access buttons for different ride types: Ride, Taxi, Schedule, Airport, and more.
                    </p>
                    <StickyNote rotate="0.5deg">
                      <strong>Tip:</strong> Notice the &ldquo;Account&rdquo; tab at the bottom right &mdash; that&rsquo;s where you&rsquo;ll set up your payment methods and language preferences.
                    </StickyNote>
                  </div>
                  <div className="shrink-0 mx-auto md:mx-0">
                    <ScreenshotCard src={IMG.ssHomeScreen} alt="DiDi home screen showing map and ride options" caption="DiDi home screen with map, destination input, and ride type buttons" />
                  </div>
                </div>
              </div>
            </Anim>

            {/* Step 2: Account & Settings screenshot */}
            <Anim>
              <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 md:p-8 mb-6">
                <div className="flex flex-col md:flex-row-reverse gap-6 md:gap-8 items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-[#DC2626] text-white flex items-center justify-center text-xs font-bold">2</div>
                      <h4 className="text-base font-semibold text-[#111110]">Account & Settings</h4>
                    </div>
                    <p className="font-body text-[15px] text-[#44403C] leading-[1.75] mb-4">
                      Tap <strong>&ldquo;Account&rdquo;</strong> to access your profile. Here you&rsquo;ll find quick links to My Trips, Wallet, Invoice, and Help. Scroll down to find the <strong>Language/&#35821;&#35328;</strong> option &mdash; set it to English for the full translated interface. The Safety section lets you configure emergency contacts and trip sharing.
                    </p>
                    <StickyNote rotate="-0.8deg">
                      <strong>First thing to do:</strong> Set Language to English and configure your Safety settings before your first ride.
                    </StickyNote>
                  </div>
                  <div className="shrink-0 mx-auto md:mx-0">
                    <ScreenshotCard src={IMG.ssAccountMenu} alt="DiDi account menu showing settings and options" caption="Account page with Wallet, Language, Safety, and Settings options" />
                  </div>
                </div>
              </div>
            </Anim>

            {/* Step 3: Wallet screenshot */}
            <Anim>
              <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 md:p-8 mb-6">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-[#DC2626] text-white flex items-center justify-center text-xs font-bold">3</div>
                      <h4 className="text-base font-semibold text-[#111110]">My Wallet</h4>
                    </div>
                    <p className="font-body text-[15px] text-[#44403C] leading-[1.75] mb-4">
                      From the Account page, tap <strong>&ldquo;Wallet&rdquo;</strong> to manage your payment methods and balance. You&rsquo;ll see your current balance, linked payment methods, available coupons, and a Travel Card option. The <strong>Payment Methods</strong> section (highlighted in red) is where you&rsquo;ll add your preferred way to pay.
                    </p>
                    <StickyNote rotate="0.3deg">
                      <strong>Save money:</strong> Check the Coupons section regularly &mdash; DiDi often offers discount coupons for new users and during promotions.
                    </StickyNote>
                  </div>
                  <div className="shrink-0 mx-auto md:mx-0">
                    <ScreenshotCard src={IMG.ssWallet} alt="DiDi wallet screen showing balance and payment methods" caption="Wallet page with balance, payment methods, coupons, and travel card" />
                  </div>
                </div>
              </div>
            </Anim>

            {/* Step 4: Payment Methods screenshot */}
            <Anim>
              <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 md:p-8 mb-6">
                <div className="flex flex-col md:flex-row-reverse gap-6 md:gap-8 items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-[#DC2626] text-white flex items-center justify-center text-xs font-bold">4</div>
                      <h4 className="text-base font-semibold text-[#111110]">Payment Methods</h4>
                    </div>
                    <p className="font-body text-[15px] text-[#44403C] leading-[1.75] mb-4">
                      DiDi supports a wide range of payment options. As a foreigner, your best bets are <strong>Alipay Payment</strong>, <strong>Credit/Debit Card</strong> (Visa, MasterCard, JCB, Diners), or <strong>Apple Pay</strong>. You can also use WeChat Pay, e-CNY, or DiDi Pay. Tap &ldquo;Enable&rdquo; next to your preferred method and follow the setup instructions.
                    </p>
                    <StickyNote rotate="-0.4deg">
                      <strong>Recommended for foreigners:</strong> Set up Alipay first (it works everywhere in China), then add your credit card as a backup. Apple Pay is also a convenient option.
                    </StickyNote>
                  </div>
                  <div className="shrink-0 mx-auto md:mx-0">
                    <ScreenshotCard src={IMG.ssPaymentMethods} alt="DiDi payment methods showing Alipay, cards, Apple Pay" caption="Full list of payment options including Alipay, credit cards, and Apple Pay" />
                  </div>
                </div>
              </div>
            </Anim>

            {/* Method B: Alipay Mini-Program */}
            <Anim className="mt-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="font-display w-7 h-7 bg-[#16A34A] text-white flex items-center justify-center text-xs font-bold rounded-md">B</div>
                <h3 className="font-display text-xl md:text-2xl font-semibold text-[#111110]">Via Alipay Mini-Program</h3>
                <span className="font-body text-[10px] font-bold tracking-wider uppercase bg-[#FEF2F2] text-[#DC2626] px-2 py-0.5 rounded">Easiest</span>
              </div>
              <p className="font-body text-[15px] text-[#44403C] leading-[1.75] mb-6">
                If you already have Alipay set up, you don&rsquo;t need a separate app. DiDi is built right into Alipay as a mini-program, and payment is automatic.
              </p>
            </Anim>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={stagger} className="space-y-2 mb-6">
              <StepItem number={1} icon={Smartphone} title="Open Alipay" desc="Tap the 'Transport' icon on the homepage, or search for 'DiDi' in the search bar." />
              <StepItem number={2} icon={MapPin} title="Enter Your Destination" desc="Type in English (e.g., 'The Bund'). The app translates it for the driver automatically." />
              <StepItem number={3} icon={Car} title="Choose Your Ride Type" desc="Select Express (fixed price), Taxi (metered), or other options. Estimated fare shown upfront." />
              <StepItem number={4} icon={CheckCircle} title="Confirm & Ride" desc="Tap confirm, verify the license plate when the car arrives, and enjoy the ride." />
              <StepItem number={5} icon={CreditCard} title="Automatic Payment" desc="The fare is deducted from your Alipay balance automatically. No cash needed." />
            </motion.div>

            {/* Pull quote */}
            <Anim className="my-10">
              <div className="relative bg-[#FEF2F2] p-6 md:p-8 rounded-lg border-l-4 border-[#DC2626]">
                <p className="font-display text-xl md:text-2xl font-medium text-[#111110] leading-snug italic">
                  &ldquo;No extra app needed &mdash; use DiDi inside Alipay, just like Uber. No local phone number required.&rdquo;
                </p>
              </div>
            </Anim>

            {/* Night taxi image */}
            <Anim className="my-10 -mx-4 md:mx-0">
              <img src={IMG.nightTaxi} alt="Taxi on rain-slicked Chinese city street at night" className="w-full h-auto md:rounded-lg" />
              <p className="font-body text-xs text-[#78716C] mt-3 px-4 md:px-0 italic">
                A taxi navigates the neon-lit streets of a Chinese city at night.
              </p>
            </Anim>

            <RibbonDivider />

            {/* ── Ch 04: Ride Options ── */}
            <Anim>
              <ChapterHeading id="ride-options" num="04">Ride Options & Pricing</ChapterHeading>
              <p className="font-body text-[17px] leading-[1.85] text-[#44403C] mb-8">
                DiDi offers a range of ride types. Prices are always shown before you confirm, so there are no surprises.
              </p>
            </Anim>

            <Anim>
              <div className="overflow-x-auto -mx-4 md:mx-0 mb-8">
                <table className="font-body w-full min-w-[580px] text-sm">
                  <thead>
                    <tr className="border-b-2 border-[#DC2626]">
                      <th className="text-left py-3 px-4 font-semibold text-[#111110]">Ride Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#111110]">Description</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#111110]">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#111110]">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { t: "Express", d: "Standard rides, fixed pricing", p: "$", b: "Most trips" },
                      { t: "Premier", d: "High-end cars, top-rated drivers", p: "$$$", b: "Business, airports" },
                      { t: "Taxi", d: "Traditional metered taxis via app", p: "$$", b: "Short trips" },
                      { t: "Comfort", d: "Newer vehicles, higher-rated drivers", p: "$$", b: "Step up from Express" },
                      { t: "6-Seater", d: "Larger vehicles, up to 6 passengers", p: "$$", b: "Groups, luggage" },
                      { t: "Carpool", d: "Shared rides at reduced price", p: "$", b: "Solo budget travel" },
                    ].map((r, i) => (
                      <tr key={i} className={`border-b border-[#E7E5E4] hover:bg-[#F5F5F4] transition-colors ${i % 2 === 1 ? "bg-[#FAFAF9]" : ""}`}>
                        <td className="py-3 px-4 font-medium text-[#111110]">{r.t}</td>
                        <td className="py-3 px-4 text-[#44403C]">{r.d}</td>
                        <td className="py-3 px-4 text-[#DC2626] font-semibold">{r.p}</td>
                        <td className="py-3 px-4 text-[#44403C]">{r.b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Anim>

            <Anim>
              <StickyNote rotate="0.6deg">
                <strong>Price reference:</strong> A 20-minute Express ride in Shanghai or Beijing typically costs &#165;25-50 (roughly $3.50-7 USD). Very affordable by Western standards.
              </StickyNote>
            </Anim>

            {/* Payment image */}
            <Anim className="my-10 -mx-4 md:mx-0">
              <img src={IMG.payment} alt="QR code payment inside a Chinese taxi" className="w-full h-auto md:rounded-lg" />
              <p className="font-body text-xs text-[#78716C] mt-3 px-4 md:px-0 italic">
                Digital payments via Alipay or WeChat Pay are the standard way to pay for rides in China.
              </p>
            </Anim>

            <RibbonDivider />

            {/* ── Ch 05: Pro Tips ── */}
            <Anim>
              <ChapterHeading id="pro-tips" num="05">Pro Tips for a Smooth Ride</ChapterHeading>
              <p className="font-body text-[17px] leading-[1.85] text-[#44403C] mb-8">
                Practical advice gathered from experienced travelers and local guides.
              </p>
            </Anim>

            <div className="space-y-4 mb-8">
              {[
                { icon: Shield, title: "Always Verify the License Plate", desc: "Check that the arriving car's plate matches your app. The driver may also ask for the last four digits of your phone number." },
                { icon: MessageCircle, title: "Don't Panic When the Driver Calls", desc: "Drivers often call to confirm your location. Use the in-app messaging with auto-translation instead of trying to speak Chinese." },
                { icon: MapPin, title: "Use Taxi Stands at Large Venues", desc: "At hotels, malls, and airports, head to the designated pickup zone. It makes it much easier for the driver to find you." },
                { icon: Globe, title: "Save the Chinese Address", desc: "Always have the Chinese name of your hotel saved on your phone. Ask hotel staff to write it down if needed." },
                { icon: Zap, title: "Stay Connected", desc: "Get a local SIM card, eSIM, or reliable roaming plan. You need stable internet to book rides." },
                { icon: Users, title: "Add Multiple Stops", desc: "Tap the + icon next to the address field to add stops. Often more cost-effective than booking separate rides." },
              ].map((tip, i) => (
                <Anim key={i} delay={i * 0.05}>
                  <div className="flex gap-4 p-4 md:p-5 bg-white border border-[#E7E5E4] rounded-xl hover:border-[#DC2626]/30 transition-colors">
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-[#FEF2F2] flex items-center justify-center">
                      <tip.icon className="w-[18px] h-[18px] text-[#DC2626]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#111110] mb-1">{tip.title}</h4>
                      <p className="font-body text-sm text-[#44403C] leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                </Anim>
              ))}
            </div>

            {/* Hutong image */}
            <Anim className="my-10 -mx-4 md:mx-0">
              <img src={IMG.hutong} alt="Chinese hutong alley with red lanterns" className="w-full h-auto md:rounded-lg" />
              <p className="font-body text-xs text-[#78716C] mt-3 px-4 md:px-0 italic">
                Modern ride-hailing meets traditional China &mdash; navigating historic hutong alleys.
              </p>
            </Anim>

            <RibbonDivider />

            {/* ── Ch 06: Safety & Alternatives ── */}
            <Anim>
              <ChapterHeading id="safety" num="06">Safety & Alternatives</ChapterHeading>
            </Anim>

            {/* Safety features */}
            <Anim>
              <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 md:p-8 mb-8">
                <h3 className="font-display text-lg font-semibold text-[#111110] mb-5">Safety Features</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: MapPin, text: "GPS tracking of every ride" },
                    { icon: AlertTriangle, text: "Emergency SOS button" },
                    { icon: Users, text: "Share trip status with contacts" },
                    { icon: Shield, text: "Verified drivers with ID & ratings" },
                    { icon: MessageCircle, text: "24/7 in-app English support" },
                    { icon: CheckCircle, text: "Receipts and invoices for every trip" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <s.icon className="w-4 h-4 text-[#DC2626] shrink-0" />
                      <span className="font-body text-sm text-[#44403C]">{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Anim>

            {/* Alternatives comparison */}
            <Anim>
              <h3 className="font-display text-lg font-semibold text-[#111110] mb-4">Alternatives to DiDi</h3>
              <div className="overflow-x-auto -mx-4 md:mx-0 mb-6">
                <table className="font-body w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b-2 border-[#DC2626]">
                      <th className="text-left py-3 px-4 font-semibold text-[#111110]">App</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#111110]">English</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#111110]">Difficulty</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#111110]">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { a: "DiDi", e: "Yes", d: "Easy", b: "Best overall for foreigners" },
                      { a: "Amap (Gaode)", e: "Yes", d: "Moderate", b: "Price comparison across services" },
                      { a: "Meituan Taxi", e: "No", d: "Moderate", b: "Budget rides, wide coverage" },
                      { a: "WeChat Mini Programs", e: "Yes", d: "Moderate", b: "Backup when DiDi can't find drivers" },
                      { a: "Street Taxis", e: "No", d: "Hard", b: "Short trips without internet" },
                    ].map((r, i) => (
                      <tr key={i} className={`border-b border-[#E7E5E4] hover:bg-[#F5F5F4] transition-colors ${i % 2 === 1 ? "bg-[#FAFAF9]" : ""}`}>
                        <td className="py-3 px-4 font-medium text-[#111110]">{r.a}</td>
                        <td className="py-3 px-4 text-[#44403C]">{r.e}</td>
                        <td className="py-3 px-4 text-[#44403C]">{r.d}</td>
                        <td className="py-3 px-4 text-[#44403C]">{r.b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Anim>

            {/* App vs Street comparison */}
            <Anim>
              <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 md:p-8 mb-6">
                <h4 className="text-base font-semibold text-[#111110] mb-4">App-Based Rides vs. Street Taxis</h4>
                <div className="overflow-x-auto">
                  <table className="font-body w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E7E5E4]">
                        <th className="text-left py-2 px-3 font-semibold text-[#44403C]">Feature</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#DC2626]">Ride-Hailing App</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#78716C]">Street Taxi</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#44403C]">
                      {[
                        { f: "Language", app: "English interface", st: "Chinese only" },
                        { f: "Payment", app: "Auto via mobile wallet", st: "Cash or QR code" },
                        { f: "Pricing", app: "Transparent estimate upfront", st: "Metered, varies by route" },
                        { f: "Wait Time", app: "3-10 min in cities", st: "Varies, harder in rain" },
                        { f: "Safety", app: "GPS tracked, driver verified", st: "Less accountability" },
                      ].map((r, i) => (
                        <tr key={i} className="border-b border-[#E7E5E4] last:border-0">
                          <td className="py-2.5 px-3 font-medium text-[#111110]">{r.f}</td>
                          <td className="py-2.5 px-3">{r.app}</td>
                          <td className="py-2.5 px-3">{r.st}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Anim>

            <RibbonDivider />

            {/* ── Ch 07: FAQ ── */}
            <Anim>
              <ChapterHeading id="faq" num="07">Frequently Asked Questions</ChapterHeading>
            </Anim>

            <div className="mb-12">
              <FAQItem q="Is Uber available in China?" a="No. Uber sold its China operations to DiDi Chuxing in 2016. The global Uber app does not allow ride requests in mainland China. DiDi is the direct replacement and works in a very similar way." />
              <FAQItem q="Do I need a Chinese phone number?" a="Not necessarily. You can register for DiDi with an international phone number, and the Alipay mini-program doesn't require a Chinese number at all. However, a local SIM or eSIM is recommended for reliable internet access." />
              <FAQItem q="Can I pay with cash?" a="App-based rides are typically paid digitally through Alipay, WeChat Pay, or a linked credit card. If you hail a traditional street taxi, cash is usually accepted. Some street taxis also accept QR code payments." />
              <FAQItem q="What if I don't speak Chinese?" a="DiDi includes a built-in translation tool that automatically translates messages between you and the driver. The app interface is available in English, and DiDi provides 24/7 in-app English customer service." />
              <FAQItem q="How much does a typical ride cost?" a="Rides are very affordable by Western standards. A 20-minute Express ride in Shanghai or Beijing typically costs between ¥25-50 (roughly $3.50-7 USD). Prices are shown before you confirm." />
              <FAQItem q="Can I add multiple stops to one trip?" a="Yes. When entering your destination, tap the + icon next to the address field to add additional stops. This is often more cost-effective than booking separate rides." />
            </div>

            {/* Closing CTA */}
            <Anim>
              <div className="bg-[#FEF2F2] border border-[#DC2626]/15 rounded-xl p-6 md:p-8 mb-12">
                <h3 className="font-display text-xl font-bold text-[#111110] mb-3">Ready to Ride</h3>
                <p className="font-body text-[15px] leading-[1.8] text-[#44403C]">
                  With DiDi on your phone, navigating China&rsquo;s cities becomes remarkably straightforward. Whether you&rsquo;re heading from the airport to your hotel, exploring a new neighborhood, or making your way to a restaurant across town, ride-hailing makes the language barrier virtually disappear. Set up Alipay before your trip, and you&rsquo;ll be ready to go from the moment you land. Safe travels.
                </p>
              </div>
            </Anim>

          </article>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E7E5E4] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="font-body text-sm text-[#78716C]">
              Last updated March 2026. Information subject to change.
            </p>
            <p className="font-body text-xs text-[#A8A29E] mt-1">
              Sources: WildChina, Trip.com, Wise, ChinaSurvival
            </p>
          </div>
          <div className="w-8 h-1 bg-[#DC2626] rounded-full" />
        </div>
      </footer>

      {/* Back to top */}
      {showTop && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-11 h-11 bg-[#DC2626] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#B91C1C] transition-colors z-40"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
