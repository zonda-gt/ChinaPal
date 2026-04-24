import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "China Trip, Planned For You",
  description:
    "Stop spending 40 hours on Reddit and Trip.com. Tell us your dates and cities — we'll send a full itinerary with everything booked.",
};

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663383502924/dCuiiEQEkteYUXqqZRtP5i/chinapal-hero-bg-FDnCEqDWTZRbZZSyCrbHwY.webp";

export default function PlanningPage() {
  return (
    <div className="planning">
      <style>{`
        .planning { font-family: 'Plus Jakarta Sans', sans-serif; background-color: oklch(0.985 0.005 80); color: oklch(0.18 0.01 260); }
        .planning .font-display { font-family: 'Fraunces', serif; }
        .planning .text-red-cp { color: oklch(0.48 0.22 25); }
        .planning .bg-red-cp { background-color: oklch(0.48 0.22 25); }
        .planning .bg-cream { background-color: oklch(0.96 0.006 80); }
        .planning .text-muted { color: oklch(0.52 0.01 260); }
        .planning .border-red-soft { border-color: oklch(0.85 0.08 25); }
        .planning .bg-red-soft { background-color: oklch(0.92 0.05 25); }
        .planning .bg-red-tint { background-color: oklch(0.97 0.02 25); }
        .planning .border-red-tint { border-color: oklch(0.88 0.06 25); }
        @keyframes pulse-cta { 0%,100% { box-shadow: 0 0 0 0 oklch(0.48 0.22 25 / 0.4);} 50% { box-shadow: 0 0 0 12px oklch(0.48 0.22 25 / 0); } }
        .planning .pulse-cta { animation: pulse-cta 2s ease-in-out infinite; }
        .planning .hero-bg { background-image: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 60%, rgba(24,20,20,0.95) 100%), url('${HERO_BG}'); background-size: cover; background-position: center; }
        .planning .day-card { background: white; border-radius: 1rem; border: 1px solid oklch(0.93 0.005 260); overflow: hidden; }
        .planning .day-tag { display: inline-block; background: oklch(0.95 0.01 260); color: oklch(0.18 0.01 260); padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .planning .day-tag-red { background: oklch(0.92 0.05 25); color: oklch(0.48 0.22 25); padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; display: inline-block; }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-[22px] font-extrabold tracking-tight text-white">
              China<span className="text-red-cp">Pal</span>
            </Link>
            <Link
              href="/planning/start"
              className="text-white text-sm font-semibold py-2 px-5 rounded-full bg-red-cp"
            >
              Plan my trip
            </Link>
          </div>
        </div>
      </header>

      <section className="hero-bg min-h-screen flex flex-col">
        <div className="pt-28 pb-16 px-4 flex-1 flex items-center">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border border-white/20 bg-white/10 backdrop-blur-sm text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Custom plan in 24 hours
                </div>
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
                  Your China trip,
                  <br />
                  <em className="not-italic text-red-cp">planned for you.</em>
                </h1>
                <p className="text-base md:text-xl text-white/80 mb-8 max-w-md leading-relaxed">
                  Stop spending 40 hours on Reddit and Trip.com. Tell us your dates and cities — we&apos;ll send a full itinerary with everything booked.
                </p>
                <div className="flex flex-row flex-wrap gap-3">
                  <Link
                    href="/planning/start"
                    className="text-white font-semibold px-8 py-4 rounded-full text-base bg-red-cp hover:opacity-90 inline-flex items-center gap-2"
                  >
                    Plan my trip
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-6 mt-10">
                  <div className="flex items-center gap-2 text-sm text-white/70">Free — custom itinerary in 24h</div>
                  <div className="flex items-center gap-2 text-sm text-white/70">Built by humans in China</div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-sm w-full">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
                    <div className="w-7 h-7 rounded-full bg-red-cp flex items-center justify-center text-white font-bold text-xs">
                      CP
                    </div>
                    <div className="font-semibold text-sm">Shanghai · Family of 4</div>
                    <div className="ml-auto text-xs text-muted">4 days</div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { day: "DAY 1", title: "Yu Garden · The Bund · Wukang Rd", sub: "Tickets + private driver included" },
                      { day: "DAY 2", title: "Shanghai Disneyland", sub: "Disney tickets + transport" },
                      { day: "DAY 3", title: "Jing'an Temple · Shanghai Tower", sub: "Tower tickets + Maglev ride" },
                      { day: "DAY 4", title: "Sleeper train → Guangzhou", sub: "Train booked + station drop-off" },
                    ].map((d) => (
                      <div key={d.day} className="flex gap-3">
                        <div className="text-xs font-bold text-red-cp w-12">{d.day}</div>
                        <div className="text-xs flex-1">
                          <span className="font-semibold">{d.title}</span>
                          <br />
                          <span className="text-muted">{d.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-center text-muted italic">
                    A real plan we built last week
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 px-4 bg-white border-y border-stone-100">
        <div className="max-w-5xl mx-auto grid grid-cols-4 gap-3 md:gap-8 text-center">
          {[
            { num: "40h", label: "Research saved" },
            { num: "24h", label: "Turnaround" },
            { num: "240+", label: "Trips handled" },
            { num: "4.9/5", label: "Rating" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display text-xl md:text-2xl font-bold text-red-cp leading-none">{s.num}</div>
              <div className="text-[11px] md:text-xs text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            <div className="rounded-xl p-4 md:p-8 border border-stone-200" style={{ backgroundColor: "oklch(0.97 0.003 260)" }}>
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-stone-400 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✕</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted">Plan it yourself</span>
              </div>
              <h3 className="font-display text-lg md:text-2xl font-bold mb-2">40 hours, 80 tabs, no idea.</h3>
              <p className="text-xs md:text-sm leading-snug text-muted">
                Reddit threads, outdated blogs, Trip.com upsells, broken 12306, and the constant fear you missed something.
              </p>
            </div>
            <div className="rounded-xl p-4 md:p-8 border bg-red-tint border-red-tint">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-red-cp flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-red-cp">With ChinaPal</span>
              </div>
              <h3 className="font-display text-lg md:text-2xl font-bold mb-2">One message. Done.</h3>
              <p className="text-xs md:text-sm leading-snug text-muted">
                Your dates and cities → a complete day-by-day plan with every booking handled. Just show up.
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/planning/start"
              className="pulse-cta flex flex-col items-center gap-1 px-12 py-5 rounded-full bg-red-cp text-center"
            >
              <span className="text-white font-display text-xl md:text-2xl font-bold">Plan my China trip</span>
              <span className="text-white/70 text-xs md:text-sm">Free — custom itinerary in 24h</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-cream">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 bg-red-soft text-red-cp border border-red-soft">
              Sample plan
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Here&apos;s what you&apos;d actually get.</h2>
            <p className="text-muted max-w-md mx-auto text-sm md:text-base">
              A 4-day plan we built for a family of 4 from France — every day, every booking, every detail.
            </p>
          </div>

          {[
            {
              day: "DAY 1",
              head: "17 May · Yu Garden · The Bund · Wukang Road",
              tags: [
                { label: "Private 6-seater car" },
                { label: "Citywalk guide" },
              ],
              bullets: [
                "Yu Garden + Yuyuan Bazaar street food",
                "French Concession walk + Wukang Road + Tianzifang art alleys",
                "The Bund sunset walk + Pudong skyline photos",
                "Hotel: 4★ Pudong",
              ],
            },
            {
              day: "DAY 2",
              head: "18 May · Shanghai Disneyland",
              tags: [
                { label: "Private 6-seater car" },
              ],
              bullets: [
                "Full-day Disney (Monday weekday recommended for lighter crowds)",
                "Hotel: 4★ Pudong",
              ],
            },
            {
              day: "DAY 3",
              head: "19 May · Jing'an Temple · Shanghai Tower",
              tags: [
                { label: "Citywalk guide" },
              ],
              bullets: [
                "Jing'an Temple morning visit",
                "Shanghai Tower 632m observation deck",
                "Maglev train return ride at 431 km/h",
              ],
            },
            {
              day: "DAY 4",
              head: "20 May · Departure to Guangzhou",
              tags: [
                { label: "Sleeper train booked", red: true },
                { label: "Station drop-off" },
              ],
              bullets: [
                "Morning city walk along Suzhou Creek + Xintiandi",
                "Sleeper train Shanghai → Guangzhou",
              ],
            },
          ].map((d, idx, arr) => (
            <div key={d.day} className={`day-card ${idx < arr.length - 1 ? "mb-4" : ""}`}>
              <div className="bg-red-cp text-white px-4 py-3 flex items-center gap-3">
                <span className="font-bold">{d.day}</span>
                <span className="text-sm opacity-90">{d.head}</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {d.tags.map((t) => (
                    <span key={t.label} className={t.red ? "day-tag-red" : "day-tag"}>
                      {t.label}
                    </span>
                  ))}
                </div>
                <ul className="text-sm space-y-1.5 text-muted">
                  {d.bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <div className="text-center mt-8">
            <Link href="/itinerary" className="text-red-cp font-semibold text-sm underline">
              See the full day-by-day version →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 bg-red-soft text-red-cp border border-red-soft">
              How it works
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Three messages. One plan. Done.</h2>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {[
              { n: "1", title: "Tell us your trip", body: "Cities, dates, who's going." },
              { n: "2", title: "We build the plan", body: "Day-by-day, sent in 24h." },
              { n: "3", title: "We book everything", body: "Tickets, trains, drivers — done." },
            ].map((s) => (
              <div key={s.n} className="bg-white rounded-xl p-3 md:p-6 border border-stone-100 shadow-sm">
                <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-red-soft flex items-center justify-center mb-2 md:mb-4 font-display font-bold text-red-cp text-sm md:text-base">
                  {s.n}
                </div>
                <h3 className="font-display font-bold text-sm md:text-lg mb-1 md:mb-2 leading-tight">{s.title}</h3>
                <p className="text-xs md:text-sm text-muted leading-snug">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="flex justify-center">
          <Link
            href="/planning/start"
            className="pulse-cta flex flex-col items-center gap-1 px-12 py-5 rounded-full bg-red-cp text-center"
          >
            <span className="text-white font-display text-xl md:text-2xl font-bold">Plan my China trip</span>
            <span className="text-white/70 text-xs md:text-sm">Free — custom itinerary in 24h</span>
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 bg-red-cp text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Ready to stop researching?</h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">Send us your dates. Get a real plan in 24h.</p>
        <Link
          href="/planning/start"
          className="inline-block bg-white text-red-cp font-semibold px-10 py-4 rounded-full text-base hover:opacity-90"
        >
          Plan my trip on WhatsApp →
        </Link>
      </section>

      <footer className="py-10 px-4 bg-stone-900 text-white/60 text-center text-sm">
        <div className="font-display text-xl font-bold text-white mb-2">
          China<span className="text-red-cp">Pal</span>
        </div>
        <p className="mb-4">Travel independently in China, with a local expert one text away.</p>
        <p className="text-xs">© 2026 ChinaPal. All rights reserved.</p>
      </footer>
    </div>
  );
}
