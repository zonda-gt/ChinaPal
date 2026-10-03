"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, Coffee, Copy, MapPin, Theater, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { recommendations, type Category, type City, type Recommendation } from "./data";
import photos from "./photos.json";
import styles from "./recommendations.module.css";

const categories: ("All" | Category)[] = ["All", "Shows", "Bakeries & cafés", "Qipao"];
const cities: ("Both cities" | City)[] = ["Both cities", "Shanghai", "Hangzhou"];
const photoMap = Object.fromEntries(photos.map((photo) => [photo.id, photo]));
const categoryDescriptions: Record<Category, { number: string; title: string; description: string }> = {
  Shows: { number: "01", title: "An evening to remember.", description: "Four different ways to enjoy a performance together. Choose the one that suits your mood and energy." },
  "Bakeries & cafés": { number: "02", title: "A little pause, something sweet.", description: "Small detours along routes you already have planned. No need to cross the city just for a pastry." },
  Qipao: { number: "03", title: "Something to bring home.", description: "Time to browse, notice the details and find a piece that feels like you." },
};

function Card({ item, onPhoto }: { item: Recommendation; onPhoto: (item: Recommendation, index: number) => void }) {
  const strip = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  function movePhotos(direction: number) {
    const track = strip.current;
    if (!track) return;
    const photo = track.firstElementChild as HTMLElement | null;
    const step = (photo?.offsetWidth ?? track.clientWidth / 2) + 8;
    track.scrollBy({ left: direction * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(item.chineseAddress);
      setCopied(true); setCopyError(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch { setCopyError(true); }
  }

  return <article className={styles.card} id={item.id}>
    <div className={styles.gallery}>
      <div ref={strip} className={styles.photoStrip} role="region" aria-roledescription="carousel" aria-label={`${item.name}: ${item.photos.length} photos. Swipe or use arrow keys to browse.`} tabIndex={0}
        onScroll={(event) => { const track = event.currentTarget; setEdges({ start: track.scrollLeft < 2, end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 2 }); }}
        onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); movePhotos(event.key === "ArrowRight" ? 1 : -1); } }}>
        {item.photos.map((id, index) => <button type="button" className={styles.photoButton} key={id} onClick={() => onPhoto(item, index)} aria-label={`Enlarge ${item.name} photo ${index + 1}`}>
          <img src={photoMap[id].path} alt={photoMap[id].alt} loading="lazy" draggable={false} />
        </button>)}
      </div>
      <button type="button" className={styles.galleryPrev} disabled={edges.start} aria-label={`Previous ${item.name} photos`} onClick={() => movePhotos(-1)}><ChevronLeft size={18} /></button>
      <button type="button" className={styles.galleryNext} disabled={edges.end} aria-label={`Next ${item.name} photos`} onClick={() => movePhotos(1)}><ChevronRight size={18} /></button>
    </div>
    <div className={styles.cardBody}>
      <div className={styles.placeHeading}><h3>{item.name}</h3><span className={`${styles.cityBadge} ${item.city === "Hangzhou" ? styles.hangzhou : ""}`}>{item.city}</span></div>
      <p className={styles.cardLine}>{item.line}</p>
      <p className={styles.placeType}>{item.tags[0]}</p>
    </div>
      <details className={styles.details}>
        <summary>Visit details <ChevronDown size={17} aria-hidden="true" /></summary>
        <div className={styles.detailContent}>
          <p className={styles.chinese} lang="zh-CN">{item.chinese}</p><p className={styles.neighbourhood}>{item.neighbourhood}</p>
          <div className={styles.why}><span>Why we picked it for you</span><p>{item.why}</p></div>
          <p className={styles.fit}><Clock3 size={15} aria-hidden="true" /><span>{item.fit}</span></p>
          <dl>
            <dt>Time to set aside</dt><dd>{item.time}</dd>
            <dt>Budget & tickets</dt><dd>{item.budget}</dd>
            <dt>Getting there</dt><dd>{item.transport}</dd>
            <dt>For a comfortable visit</dt><dd>{item.comfort}</dd>
            <dt>{item.category === "Bakeries & cafés" ? "Before ordering" : "Before you book"}</dt><dd>{item.booking}</dd>
          </dl>
          <div className={styles.address}><MapPin size={16} aria-hidden="true" /><div><p>{item.address}</p><p lang="zh-CN">{item.chineseAddress}</p><button type="button" onClick={copyAddress}>{copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Address copied" : "Copy Chinese address"}</button><span role="status">{copyError ? "Please select and copy the address above." : copied ? "Ready to show your driver." : ""}</span></div></div>
          <div className={styles.sources}><span>Useful references</span>{item.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</div>
        </div>
      </details>
  </article>;
}

export default function RecommendationsClient() {
  const [category, setCategory] = useState<"All" | Category>("All");
  const [city, setCity] = useState<"Both cities" | City>("Both cities");
  const [activePhoto, setActivePhoto] = useState<{ item: Recommendation; index: number } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lightboxTouch = useRef<number | null>(null);
  function moveLightbox(offset: number) {
    setActivePhoto((current) => current ? { ...current, index: (current.index + offset + current.item.photos.length) % current.item.photos.length } : null);
  }
  useEffect(() => { if (activePhoto && !dialog.current?.open) dialog.current?.showModal(); }, [activePhoto]);
  const visible = recommendations.filter((item) => (category === "All" || item.category === category) && (city === "Both cities" || item.city === city));
  const currentPhoto = activePhoto ? photoMap[activePhoto.item.photos[activePhoto.index]] : null;

  return <>
    <Navbar />
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <Link href="/itinerary/ruijun" className={styles.back}><ArrowLeft size={14} /> Your itinerary</Link>
          <p className={styles.eyebrow}>A personal collection · ChinaPal</p>
          <h1>A few places we picked <em>for you.</em></h1>
          <p className={styles.dedication}>For Ruijun & her parents</p>
          <p className={styles.intro}>Eight optional stops for your family. Swipe through the photos, then open a place for practical details.</p>
          <div className={styles.heroMeta}><span>10–15 October 2026</span><span>Two cities · your own pace</span></div>
        </div>
        <div className={styles.heroPhotos}>
          <figure className={styles.heroMain}><img src={photoMap["lake-show-2"].path} alt="Performers and moonlit reflections on the West Lake stage" /><figcaption>Evenings with a little magic.<span>最忆是杭州 · Hangzhou</span></figcaption></figure>

        </div>
      </header>

      <section id="collection" className={styles.collection} aria-label="Your recommendations">
        <div className={styles.filters}>
          <div className={styles.filterTop}><p>Your collection <span>08</span></p><span aria-live="polite">{visible.length} {visible.length === 1 ? "place" : "places"} to explore</span></div>
          <div className={styles.categoryFilters} role="group" aria-label="Filter by category">{categories.map((value) => <button type="button" key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{value === "Shows" ? <Theater size={15} /> : value === "Bakeries & cafés" ? <Coffee size={15} /> : null}{value}</button>)}</div>
          <div className={styles.cityFilters} role="group" aria-label="Filter by city">{cities.map((value) => <button type="button" key={value} aria-pressed={city === value} onClick={() => setCity(value)}>{value}</button>)}</div>
        </div>

        {visible.length === 0 && <div className={styles.empty}><p>No picks in this combination yet.</p><button type="button" onClick={() => { setCity("Both cities"); setCategory("All"); }}>Show all eight recommendations <ArrowRight size={15} /></button></div>}
        {(["Shows", "Bakeries & cafés", "Qipao"] as Category[]).map((group) => {
          const items = visible.filter((item) => item.category === group);
          if (!items.length) return null;
          const heading = categoryDescriptions[group];
          return <section key={group} className={styles.categorySection} aria-labelledby={`heading-${heading.number}`}>
            <div className={styles.sectionHeading}><span>{heading.number}</span><div><p>{group}</p><h2 id={`heading-${heading.number}`}>{heading.title}</h2><p>{heading.description}</p></div><span className={styles.sectionCount}>{items.length} {items.length === 1 ? "place" : "places"}</span></div>
            {group === "Bakeries & cafés" && <aside className={styles.dietary}><Coffee size={20} aria-hidden="true" /><div><strong>A small ingredient check before a sweet treat.</strong><p>Eggs and dairy are fine. Ask staff to confirm no meat, seafood, alliums or gelatine, including fillings and glazes. These are places to browse; individual items still need checking.</p></div></aside>}
            <div className={styles.cardGrid}>{items.map((item) => <Card key={item.id} item={item} onPhoto={(selected, index) => setActivePhoto({ item: selected, index })} />)}</div>
          </section>;
        })}
      </section>

      <section className={styles.closing}><p className={styles.eyebrow}>Make it your kind of trip</p><h2>Choose what you love. <em>Leave room to enjoy it.</em></h2><p>Keep these ideas beside your daily plan. A favourite stop and a comfortable pace are plenty for one day.</p><Link href="/itinerary/ruijun#daily-plan">Back to your daily itinerary <ArrowRight size={16} /></Link></section>
      <details className={styles.credits}><summary>Photo credits & planning notes</summary><p>Checked 3 October 2026. Travel times and café budgets are planning estimates. Show dates, seats, opening hours, menus and tailoring quotes need confirmation. Photographs show the named venues or productions; B&C also includes an official brand product photo. Displays, menus and casts may change.</p><div>{photos.map((photo) => <p key={photo.id}><a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.alt}</a> · {photo.credit}</p>)}</div></details>
    </main>
    <Footer />
    <dialog ref={dialog} className={styles.lightbox}
      onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); moveLightbox(event.key === "ArrowRight" ? 1 : -1); } }}
      onTouchStart={(event) => { lightboxTouch.current = event.touches[0].clientX; }}
      onTouchEnd={(event) => { if (lightboxTouch.current !== null) { const delta = event.changedTouches[0].clientX - lightboxTouch.current; if (Math.abs(delta) > 40) moveLightbox(delta < 0 ? 1 : -1); } lightboxTouch.current = null; }}
      aria-label={activePhoto ? `${activePhoto.item.name} photos` : "Recommendation photos"} onClose={() => setActivePhoto(null)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      {activePhoto && currentPhoto && <div className={styles.lightboxInner}>
        <button type="button" className={styles.closePhoto} onClick={() => dialog.current?.close()} aria-label="Close photo" autoFocus><X size={22} /></button>
        <img src={currentPhoto.path} alt={currentPhoto.alt} />
        <div className={styles.lightboxControls}><button type="button" aria-label="Previous photo" onClick={() => moveLightbox(-1)}><ChevronLeft /></button><div><p>{activePhoto.item.name} · {activePhoto.index + 1} / {activePhoto.item.photos.length}</p><a href={currentPhoto.source} target="_blank" rel="noopener noreferrer">{currentPhoto.credit} ↗</a></div><button type="button" aria-label="Next photo" onClick={() => moveLightbox(1)}><ChevronRight /></button></div>
      </div>}
    </dialog>
  </>;
}
