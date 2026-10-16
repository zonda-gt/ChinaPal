"use client";
/* eslint-disable @next/next/no-img-element */
import { ArrowDown, ArrowUpRight, Camera, Check, ChevronDown, Plane } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ImageMap } from "@/lib/itinerary-images";
import ItineraryPage from "../ItineraryPage";
import { barAlternatives, buildTheresaConfig, dinnerDishes, dinnerReservation, finalDetails, photos, preorderNote } from "./config";
import styles from "./theresa.module.css";

export default function TheresaClient({ images }: { images: ImageMap }) {
  return <div className={styles.page}>
    <Navbar />
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>A weekend for two · ChinaPal</p>
        <h1>Theresa’s<br />Shanghai <em>weekend.</em></h1>
        <p className={styles.intro}>Photographs together, tree-lined streets and a little time by the river. Good food and cocktails, with room to enjoy your hotel, too.</p>
        <p className={styles.tripMeta}>23–25 October 2026 <span>3 days · 2 nights</span></p>
        <a className={styles.primary} href="#daily-plan">Explore your itinerary <ArrowDown size={16} /></a>
      </div>
      <figure className={styles.heroPhoto}>
        <img src={photos.bund[0]} alt="Shanghai’s Pudong skyline across the Huangpu River from the Bund" fetchPriority="high" />
        <figcaption>Shanghai, together.<span>上海 · 23—25 OCTOBER</span></figcaption>
      </figure>
    </header>

    <nav className={styles.jumpLinks} aria-label="Itinerary sections">
      <a href="#your-stay">Your stay</a><a href="#daily-plan">Daily plan</a><a href="#dinner-options">Saturday dinner</a><a href="#bar-options">Backup bars</a><a href="#final-details">To confirm</a>
    </nav>

    <section id="your-stay" className={styles.overview} aria-label="Your stay and flights">
      <article className={styles.stay}>
        <img src={photos.hotel[0]} alt="The St. Regis on the Bund, Shanghai hotel exterior" loading="lazy" />
        <div><p className={styles.eyebrow}>Your Shanghai address</p><h2>The St. Regis<br />on the Bund</h2><p>23–25 October · two nights</p><p className={styles.small}>Breakfast for two follows your original plan. Hotel benefits and late checkout still need confirming.</p></div>
      </article>
      <div className={styles.flights}>
        <h2><Plane size={18} /> Your flights</h2>
        <div className={styles.flight}><p>FRI 23 OCT <span>CX364 · Cathay Pacific</span></p><div><strong>17:25 <small>Hong Kong</small></strong><span>→</span><strong>20:15 <small>Shanghai Pudong</small></strong></div></div>
        <div className={styles.flight}><p>SUN 25 OCT <span>CX369 · Cathay Pacific</span></p><div><strong>17:30 <small>Pudong · Terminal 2</small></strong><span>→</span><strong>20:35 <small>Hong Kong</small></strong></div></div>
        <p className={styles.small}>All times are local, as supplied in your itinerary. Reconfirm flight times and Cathay’s standby reporting instructions.</p>
      </div>
    </section>

    <div className={styles.keyMoments} aria-label="Important trip timings">
      <p><Camera size={18} /><span><strong>Saturday · arrive by 8:45 AM</strong>Makeup & photoshoot · 9:00–11:00 AM</span></p>
      <p><Camera size={18} /><span><strong>Sunday · photoshoot undecided</strong>If kept: meet 10:40 AM · shoot 11:00 AM–noon</span></p>
      <p><Plane size={18} /><span><strong>Sunday · leave hotel 2:15 PM</strong>Airport transfer · ~60–90 min</span></p>
    </div>

    <section id="daily-plan" className={styles.dailyIntro} aria-labelledby="daily-title">
      <p className={styles.eyebrow}>One day at a time</p><h2 id="daily-title">Your weekend, planned.</h2>
      <p>Choose a day, then tap a place to see the details. Optional stops can flex around how you feel.</p>
      <p className={styles.small}>~ marks an estimated journey time, not live routing. Allow extra for traffic, queues and finding entrances. Sunday’s photoshoot remains undecided; its alternative walk replaces the session. Unbooked meals remain flexible.</p>
      <a href="#dinner-options">Your confirmed dinner & suggested dishes <ArrowDown size={14} /></a>
    </section>
    <ItineraryPage images={images} config={buildTheresaConfig()} leadName="Theresa" chromeless />

    <section id="dinner-options" className={styles.dinnerSection} aria-labelledby="dinner-title">
      <div className={styles.sectionHeading}><p className={styles.eyebrow}>Saturday 24 October · confirmed</p><h2 id="dinner-title">Your Saturday dinner.</h2><p>Shanghai Tang, Xintiandi · 7:30 PM. A Shanghainese dinner for two, followed by COA and then Pony Up.</p></div>
      <div className={styles.reservationGrid}>
        <article className={styles.dinnerCard}>
          <div className={styles.dinnerPhotos}>{photos.shanghaiTang.map((src, i) => <img src={src} key={src} alt={`Shanghai Tang, Xintiandi · ${i === 0 ? "restaurant dish" : "exterior"}`} loading="lazy" />)}</div>
          <div className={styles.dinnerCopy}><span className={styles.status}>{dinnerReservation.status}</span><h3>{dinnerReservation.name}</h3><p>{dinnerReservation.branch}</p></div>
          <div className={styles.dinnerDetails}><p>{dinnerReservation.description}</p><p>{dinnerReservation.note}</p><p className={styles.address}>{dinnerReservation.address}</p></div>
        </article>
        <article className={styles.menuCard}>
          <p className={styles.eyebrow}>Suggested advance-order dishes</p><h3>A few favourites, then choose the rest.</h3>
          <p>{preorderNote}</p>
          <ul className={styles.dishList}>{dinnerDishes.map(dish => <li key={dish.name}><div><strong>{dish.name}</strong><small>{dish.note}</small></div><span>RMB {dish.price}</span></li>)}</ul>
          <p className={styles.menuTotal}>First two dishes: RMB 228 together.<br />With the optional crab dish: RMB 586 together.</p>
          <p>{dinnerReservation.pricing}</p>
          <p><strong>Choose other dishes yourself at the restaurant.</strong> The dishes above are a starting point, not your complete meal.</p>
        </article>
      </div>
    </section>

    <section id="bar-options" className={styles.dinnerSection} aria-labelledby="bars-title">
      <div className={styles.sectionHeading}><p className={styles.eyebrow}>If you would rather skip a long queue</p><h2 id="bars-title">Two backup bars.</h2><p>COA first, then Pony Up remain your preferred plan. Both are walk-ins for this visit. The 60–90 minutes set aside at each is only a waiting buffer, not a prediction or confirmed queue. Use one of these alternatives if needed; you do not need to visit all four.</p></div>
      <div className={styles.backupGrid}>{barAlternatives.map(bar => <details className={styles.dinnerCard} key={bar.id}>
        <summary><div className={styles.dinnerPhotos}>{bar.images.map((src, i) => <img src={src} key={src} alt={`${bar.name} · ${i === 0 ? "venue photograph" : "a second look"}`} loading="lazy" />)}</div><div className={styles.dinnerCopy}><span className={styles.status}>Optional alternative · no reservation arranged</span><h3>{bar.name}<ChevronDown size={18} /></h3><p>{bar.summary}</p></div></summary>
        <div className={styles.dinnerDetails}><p>{bar.description}</p><p className={styles.address}>{bar.address}</p><p className={styles.small}>{bar.transfer}</p></div>
      </details>)}</div>
    </section>

    <section id="final-details" className={styles.finalDetails} aria-labelledby="final-title">
      <div><p className={styles.eyebrow}>The finishing touches</p><h2 id="final-title">A few details to confirm.</h2><p>Dinner is confirmed. We’ll refine the dish pre-order, Sunday’s plans and the remaining practical details.</p><a href="https://wa.me/8618201806768?text=Hi%20ChinaPal%2C%20I%20have%20a%20question%20about%20Theresa%27s%20Shanghai%20weekend." target="_blank" rel="noopener noreferrer">Message ChinaPal <ArrowUpRight size={16} /></a></div>
      <ul>{finalDetails.map(detail => <li key={detail}><Check size={16} /><span>{detail}</span></li>)}</ul>
      <p className={styles.support}>Message us before or during the trip for practical help. We can connect on WeChat to share addresses, map pins and booking details, and will reply as promptly as we can.</p>
    </section>
    <Footer />
  </div>;
}
