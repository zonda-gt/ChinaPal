"use client";

/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { ArrowDown, ArrowRight, TrainFront } from "lucide-react";
import { daySummaries, photos, trains } from "./config";
import photoSources from "./photo-sources.json";

const slides = [
  { image: photos.lake, label: "Hangzhou · West Lake" },
  { image: photos.northBund, label: "Shanghai · the North Bund" },
  { image: photos.temple, label: "Hangzhou · Lingyin Temple" },
  { image: photos.wukang, label: "Shanghai · Wukang Road" },
];

const highlights = [
  { city: "Hangzhou", stay: "10–12 October · 2 nights", places: [
    { image: photos.temple, title: "Temple courtyards", caption: "Lingyin · a gentle morning together" },
    { image: photos.hefang, title: "A little old Hangzhou", caption: "Hefang Street · short, unhurried walks" },
    { image: photos.lake, title: "Pause by the water", caption: "West Lake · a stroll and a seated tea break" },
  ] },
  { city: "Shanghai", stay: "12–15 October · 3 nights", places: [
    { image: photos.garden, title: "Garden details", caption: "Yu Garden · bazaar lanes and time to browse" },
    { image: photos.wukang, title: "Find your favourite street", caption: "Wukang Road · a café along the way" },
    { image: photos.northBund, title: "An evening by the river", caption: "North Bund · a short walk, a wide view" },
  ] },
];

export default function RuijunPoster() {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  function goToSlide(index: number) {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollTo({ left: index * scroller.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="bg-stone-100 px-4 pb-8 pt-20" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="mx-auto max-w-[420px] space-y-4">
        <section className="-mx-4 overflow-hidden bg-white" aria-label="Ruijun’s trip introduction">
          <div className="relative">
            <div ref={scrollerRef} onScroll={(event) => setActiveSlide(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))} className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Destination photographs" tabIndex={0}>
              {slides.map((slide, index) => <img key={slide.image} src={slide.image} alt={slide.label} loading={index === 0 ? "eager" : "lazy"} className="h-[420px] w-full shrink-0 snap-center object-cover sm:h-[500px]" draggable={false} />)}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/75 to-transparent" />
            <p className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#912F34]">Ruijun & family · 10–15 October 2026</p>
            <div className="absolute inset-x-5 bottom-5 text-white">
              <p className="mb-2 text-xs font-semibold" aria-live="polite">{slides[activeSlide]?.label}</p>
              <div className="flex gap-1">{slides.map((slide, index) => <button key={slide.image} type="button" aria-label={`Show ${slide.label}`} aria-pressed={activeSlide === index} onClick={() => goToSlide(index)} className="flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><span className={`block h-2 w-2 rounded-full ${activeSlide === index ? "bg-white" : "bg-white/40"}`} /></button>)}</div>
            </div>
          </div>
          <div className="space-y-4 px-5 py-6">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C23845]">6 days · 5 nights · 3 travellers</p>
            <h1 className="text-[32px] leading-[1.15] text-[#342B29]" style={{ fontFamily: "'Fraunces', serif", fontWeight: 700 }}>Ruijun’s Hangzhou<br />& Shanghai.</h1>
            <p className="text-[13px] leading-relaxed text-stone-600">Temple mornings, lakeside pauses and city evenings — with vegetarian meals, a little qipao shopping, and time to enjoy it all together.</p>
            <div className="flex flex-wrap gap-2">{["Shorter walks", "Regular rest stops", "Vegetarian dining"].map((tag) => <span key={tag} className="border border-[#F0C8D1] px-2 py-1 text-[10px] font-bold text-[#A34355]">{tag}</span>)}</div>
            <a href="#daily-plan" className="inline-flex items-center gap-2 text-xs font-bold text-[#B42F3D]">Open your daily plan <ArrowDown size={14} /></a>
          </div>
        </section>

        <section className="rounded-xl border border-[#E8E1D7] bg-white p-5" aria-labelledby="trains-title">
          <div className="flex items-center gap-2 text-[#912F34]"><TrainFront size={17} /><h2 id="trains-title" className="text-sm font-extrabold">Your booked trains</h2></div>
          <div className="mt-4 space-y-5">{trains.map((train) => <div key={train.number} className="border-t border-stone-100 pt-4">
            <div className="flex items-center justify-between gap-3"><p className="text-[11px] font-bold text-stone-500">{train.date}</p><span className="rounded-full bg-[#EDF3EE] px-2 py-1 text-[10px] font-bold text-[#41644E]">{train.number} · booked</span></div>
            <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-start gap-3"><div><p className="text-2xl font-bold text-[#342B29]">{train.departure}</p><p className="mt-1 text-[11px] text-stone-500">{train.from}</p></div><ArrowRight size={16} className="mt-2 text-stone-400" /><div className="text-right"><p className="text-2xl font-bold text-[#342B29]">{train.arrival}</p><p className="mt-1 text-[11px] text-stone-500">{train.to}</p></div></div>
            <p className="mt-3 text-[11px] leading-relaxed text-stone-500">{train.note}</p>
          </div>)}</div>
          <p className="mt-4 text-[10px] leading-relaxed text-stone-500">All times are local China time. Train booking status follows your supplied itinerary.</p>
        </section>

        <section className="overflow-hidden rounded-xl bg-[#C23845] p-4 shadow-md" aria-labelledby="highlights-title">
          <div className="px-2 pb-5 pt-3 text-center text-white"><h2 id="highlights-title" className="text-5xl italic" style={{ fontFamily: "'Fraunces', serif" }}>Together in China</h2><p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">Hangzhou · Shanghai · six days</p></div>
          <div className="space-y-6">{highlights.map((city) => <div key={city.city} className="space-y-3">
            <div className="flex items-baseline justify-between gap-2 px-1 text-white"><h3 className="text-base font-extrabold">{city.city}</h3><p className="text-[10px] text-white/80">{city.stay}</p></div>
            {city.places.map((place, index) => <figure key={place.title} className={`overflow-hidden rounded-sm bg-white p-2 shadow-sm ${index < 2 ? "grid grid-cols-2 items-center gap-3" : ""}`}><img src={place.image} alt={place.caption} loading="lazy" className={`${index < 2 ? "h-32" : "h-44"} w-full rounded-[2px] object-cover ${index === 1 ? "order-2" : ""}`} /><figcaption className="px-2 py-3 text-center"><p className="text-[13px] font-bold leading-snug text-[#912F34]">{place.title}</p><p className="mt-2 text-[10px] leading-relaxed text-stone-500">{place.caption}</p></figcaption></figure>)}
          </div>)}</div>
        </section>

        <section className="relative overflow-hidden rounded-xl bg-[#3B0A11] text-white shadow-md" aria-labelledby="overview-title">
          <img src={photos.lake} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-15" />
          <div className="relative space-y-5 px-5 py-6"><h2 id="overview-title" className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">Your trip at a glance</h2>
            {daySummaries.map((day, index) => <div key={day.date} className="flex items-start gap-3"><span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold uppercase text-[#C23845]">Day {index + 1}</span><div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#F5C6CB]">{day.date}</p><h3 className="mt-1 text-[13px] font-bold leading-snug">{day.title}</h3><p className="mt-1 text-[11px] leading-relaxed text-white/75">{day.detail}</p></div></div>)}
          </div>
        </section>

        <section className="rounded-xl border border-[#E8E1D7] bg-white p-5" aria-labelledby="hotels-title">
          <h2 id="hotels-title" className="text-lg font-bold text-[#342B29]" style={{ fontFamily: "'Fraunces', serif" }}>Your two bases</h2>
          <div className="mt-4 space-y-4 text-xs leading-relaxed text-stone-600">
            <div><p className="font-bold text-[#912F34]">SkyBird Hotel · Hangzhou</p><p>10–12 October · 2 nights</p><p className="mt-1">Breakfast included. Drop bags on arrival; early check-in depends on room availability.</p></div>
            <div className="border-t border-stone-100 pt-4"><p className="font-bold text-[#912F34]">Demores Hotel · Shanghai</p><p>12–15 October · 3 nights</p><p className="mt-1">1465 Zhonghua Road · 中华路1465号<br />Near Laoximen. Breakfast inclusion and suitable options still need confirmation.</p></div>
          </div>
        </section>

        <details className="px-1 text-[10px] leading-relaxed text-stone-500"><summary className="cursor-pointer py-2 font-semibold">Photo credits & planning notes</summary><div className="space-y-2 pt-2">
          {(photoSources as { title: string; source: string; credit: string }[]).map((photo) => <p key={photo.title}><a href={photo.source} target="_blank" rel="noopener noreferrer" className="underline">{photo.title}</a> · {photo.credit}</p>)}
          <p>Photographs are resized and cropped for the page. The plan follows your updated 10–15 October 2026 itinerary. Train bookings are recorded as supplied; meals and optional shows remain subject to confirmation.</p>
          <p>Lingyin: <a className="underline" href="https://en.lingyinsi.org/detail_15105.html" target="_blank" rel="noopener noreferrer">reservation rules</a> and <a className="underline" href="https://en.lingyinsi.org/detail_15142.html" target="_blank" rel="noopener noreferrer">online-only reservation update</a>.</p>
        </div></details>
      </div>
    </div>
  );
}
