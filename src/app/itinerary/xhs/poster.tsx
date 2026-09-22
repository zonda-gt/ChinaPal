"use client";

/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { ArrowDown, ArrowRight, BriefcaseBusiness, ShoppingBag, Utensils } from "lucide-react";
import type { ItineraryConfig } from "../ItineraryPage";
import { budget, budgetTotal, euroRange, photos } from "./config";
import photoSources from "./photo-sources.json";

const slides = [
  { image: photos.bund, label: "Shanghai · the Bund skyline" },
  { image: photos.lake, label: "Hangzhou · West Lake" },
  { image: photos.tea, label: "Hangzhou · Longjing tea country" },
  { image: photos.garden, label: "Shanghai · Yu Garden" },
];

const highlights = [
  { city: "Shanghai", stay: "Days 1–5 & 8–10", places: [
    { image: photos.shopping, title: "Find your kind of shopping", caption: "West Nanjing Road · flagships & discoveries" },
    { image: photos.garden, title: "A little old Shanghai", caption: "Yu Garden · details worth slowing down for" },
    { image: photos.bund, title: "Stay for the evening", caption: "The Bund · your first Shanghai skyline" },
  ] },
  { city: "Hangzhou", stay: "Days 6–7 · 2 nights", places: [
    { image: photos.lake, title: "A breath of fresh air", caption: "West Lake · walks without a checklist" },
    { image: photos.temple, title: "A quieter morning", caption: "Lingyin · temple grounds & wooded hills" },
    { image: photos.tea, title: "Tea tastes better here", caption: "Longjing · a village afternoon" },
  ] },
];

const chapters = [
  { title: "Settle into Shanghai", start: 0, end: 5 },
  { title: "Two nights in Hangzhou", start: 5, end: 7 },
  { title: "Back to your favourites", start: 7, end: 10 },
];

const waLink = `https://wa.me/8618201806768?text=${encodeURIComponent("Hi ChinaPal! I'd like to refine my 10-day Shanghai and Hangzhou itinerary.")}`;

export default function XhsPoster({ config }: { config: ItineraryConfig }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  function goToSlide(index: number) {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollTo({ left: index * scroller.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="bg-stone-100 px-4 pb-8 pt-20" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="mx-auto max-w-[420px] space-y-4">
        <section className="-mx-4 overflow-hidden bg-white" aria-label="Your trip introduction">
          <div className="relative">
            <div
              ref={scrollerRef}
              onScroll={(event) => setActiveSlide(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))}
              className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Destination photographs"
              tabIndex={0}
            >
              {slides.map((slide, index) => (
                <img key={slide.image} src={slide.image} alt={slide.label} loading={index === 0 ? "eager" : "lazy"} className="h-[420px] w-full shrink-0 snap-center object-cover sm:h-[500px]" draggable={false} />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/75 to-transparent" />
            <p className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#912F34]">Made around you · first draft</p>
            <div className="absolute inset-x-5 bottom-5 text-white">
              <p className="mb-2 text-xs font-semibold" aria-live="polite">{slides[activeSlide]?.label}</p>
              <div className="flex gap-1">
                {slides.map((slide, index) => (
                  <button key={slide.image} type="button" aria-label={`Show ${slide.label}`} aria-pressed={activeSlide === index} onClick={() => goToSlide(index)} className="flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                    <span className={`block h-2 w-2 rounded-full ${activeSlide === index ? "bg-white" : "bg-white/40"}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4 px-5 py-6">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C23845]">10 days · 9 nights · just for you</p>
            <h1 className="text-[32px] leading-[1.1] text-[#342B29]" style={{ fontFamily: "'Fraunces', serif", fontWeight: 700 }}>Your first<br />China chapter.</h1>
            <p className="text-[13px] leading-relaxed text-stone-600">Shanghai for the food, the finds and a little nightlife. Hangzhou for the lake, the tea and a change of pace.</p>
            <div className="flex flex-wrap gap-2">
              {["Solo, at your pace", "Time for suppliers", "Prices in euros"].map((tag) => <span key={tag} className="border border-[#F0C8D1] px-2 py-1 text-[10px] font-bold text-[#A34355]">{tag}</span>)}
            </div>
            <a href="#daily-plan" className="inline-flex items-center gap-2 text-xs font-bold text-[#B42F3D]">Explore your daily plan <ArrowDown size={14} /></a>
          </div>
        </section>

        <section className="rounded-xl border border-[#E9DDD0] bg-[#FAF6EE] p-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9C7860]">A little note for you</p>
          <p className="mt-3 text-[13px] leading-7 text-[#5C4840]">{config.meiGreeting}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#E9DDD0] pt-4 text-center text-[10px] font-semibold text-[#76544A]">
            {[{ Icon: Utensils, label: "Eat well" }, { Icon: ShoppingBag, label: "Find your style" }, { Icon: BriefcaseBusiness, label: "Meet suppliers" }].map(({ Icon, label }) => <div key={label}><Icon size={18} className="mx-auto mb-2" />{label}</div>)}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl bg-[#C23845] p-4 shadow-md" aria-labelledby="highlights-title">
          <div className="px-2 pb-5 pt-3 text-center text-white">
            <h2 id="highlights-title" className="text-5xl italic" style={{ fontFamily: "'Fraunces', serif" }}>China</h2>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80">Two cities · ten days · your way</p>
            <p className="mt-2 text-[13px] font-semibold text-white/90">A few things to look forward to</p>
          </div>
          <div className="space-y-6">
            {highlights.map((city) => (
              <div key={city.city} className="space-y-3">
                <div className="flex items-baseline justify-between gap-2 px-1 text-white"><h3 className="text-base font-extrabold">{city.city}</h3><p className="text-[10px] text-white/80">{city.stay}</p></div>
                {city.places.map((place, index) => (
                  <figure key={place.title} className={`overflow-hidden rounded-sm bg-white p-2 shadow-sm ${index < 2 ? "grid grid-cols-2 items-center gap-3" : ""}`}>
                    <img src={place.image} alt={place.caption} loading="lazy" className={`${index < 2 ? "h-32" : "h-44"} w-full rounded-[2px] object-cover ${index === 1 ? "order-2" : ""}`} />
                    <figcaption className="px-2 py-3 text-center"><p className="text-[13px] font-bold leading-snug text-[#912F34]">{place.title}</p><p className="mt-2 text-[10px] leading-relaxed text-stone-500">{place.caption}</p></figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-xl bg-[#3B0A11] text-white shadow-md" aria-labelledby="overview-title">
          <img src={photos.bund} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-15" />
          <div className="relative space-y-6 px-5 py-6">
            <h2 id="overview-title" className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">Your trip at a glance</h2>
            {chapters.map((chapter) => (
              <div key={chapter.title} className="space-y-4">
                <h3 className="border-b border-white/20 pb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#F5C6CB]">{chapter.title}</h3>
                {config.days.slice(chapter.start, chapter.end).map((day) => (
                  <div key={day.label} className="flex items-start gap-3">
                    <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold uppercase text-[#C23845]">{day.label}</span>
                    <div><p className="text-[13px] font-bold leading-snug">{day.subtitle}</p><p className="mt-1 text-[11px] leading-relaxed text-white/65">{day.city}</p></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#E8E1D7] bg-white p-5" aria-labelledby="budget-title">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#C23845]">Your budget, in euros</p>
          <h2 id="budget-title" className="mt-3 text-[30px] font-bold tracking-tight text-[#342B29]" style={{ fontFamily: "'Fraunces', serif" }}>{budgetTotal}</h2>
          <p className="mt-1 text-[11px] leading-relaxed text-stone-500">Planning estimate for one person · 10 days / 9 nights</p>
          <dl className="mt-5 space-y-3">
            {budget.map((row) => <div key={row.label} className="flex items-start justify-between gap-3 border-t border-stone-100 pt-3"><dt><p className="text-xs font-bold text-stone-700">{row.label}</p><p className="mt-1 text-[10px] leading-relaxed text-stone-500">{row.detail}</p></dt><dd className="shrink-0 text-xs font-bold text-[#912F34]">{euroRange(row.low, row.high)}</dd></div>)}
          </dl>
          <p className="mt-5 rounded-lg bg-[#FAF6EE] p-3 text-[11px] leading-relaxed text-[#796452]">These are spending allowances, not a package quote. International flights, personal shopping, insurance and any ChinaPal service, guide, interpreter or supplier-related charges are separate. Actual prices depend on dates, availability and exchange rates.</p>
        </section>

        <section className="rounded-xl bg-[#E9EFEB] p-5 text-[#354F42]">
          <h2 className="text-lg font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Let’s make it yours.</h2>
          <p className="mt-2 text-xs leading-relaxed">The next version starts with your dates, supplier locations, shopping style, food preferences and hotel comfort level.</p>
          <p className="mt-3 text-[11px] leading-relaxed">Dates and bookings are still open. Your supplier city may change the route; evenings and shopping blocks can move around it.</p>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#354F42] px-4 py-3 text-xs font-bold text-white">Tell us what you think <ArrowRight size={14} /></a>
        </section>

        <details className="px-1 text-[10px] leading-relaxed text-stone-500">
          <summary className="cursor-pointer py-2 font-semibold">Photo credits & planning references</summary>
          <div className="space-y-2 pt-2">
            {(photoSources as { title: string; source: string; credit: string; license?: string; licenseUrl?: string }[]).map((photo) => <p key={photo.source}><a href={photo.source} target="_blank" rel="noopener noreferrer" className="underline">{photo.title}</a> · {photo.credit}{photo.license && <> · <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">{photo.license}</a></>}</p>)}
            <p>Place references: <a className="underline" href="https://www.meet-in-shanghai.net/en/jingan-district/zhangyuan-106825/" target="_blank" rel="noopener noreferrer">Zhangyuan</a>, <a className="underline" href="https://www.meet-in-shanghai.net/en/news/citys-glitziest-new-retail-landmark-taikoo-li-qiantan-opens-216882/" target="_blank" rel="noopener noreferrer">Taikoo Li Qiantan</a>, <a className="underline" href="https://www.ehangzhou.gov.cn/2018-06/14/c_242885.htm" target="_blank" rel="noopener noreferrer">Lingyin Temple</a>. Opening and booking arrangements will be checked for your dates.</p>
          </div>
        </details>
      </div>
    </div>
  );
}
