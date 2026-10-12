"use client";
/* eslint-disable @next/next/no-img-element */
import { ArrowDown, ArrowUpRight, Camera, Check, ChevronDown, Plane } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ImageMap } from "@/lib/itinerary-images";
import ItineraryPage from "../ItineraryPage";
import { buildTheresaConfig, dinnerOptions, finalDetails, photos } from "./config";
import styles from "./theresa.module.css";

export default function TheresaClient({ images }: { images: ImageMap }) {
  return <div className={styles.page}>
    <Navbar />
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>A weekend for two · ChinaPal</p>
        <h1>Theresa’s<br />Shanghai <em>weekend.</em></h1>
        <p className={styles.intro}>Old Town photographs, tree-lined streets and a little time by the river. Good food and cocktails, with room to enjoy your hotel, too.</p>
        <p className={styles.tripMeta}>23–25 October 2026 <span>3 days · 2 nights</span></p>
        <a className={styles.primary} href="#daily-plan">Explore your itinerary <ArrowDown size={16} /></a>
      </div>
      <figure className={styles.heroPhoto}>
        <img src={photos.bund[0]} alt="Shanghai’s Pudong skyline across the Huangpu River from the Bund" fetchPriority="high" />
        <figcaption>Shanghai, together.<span>上海 · 23—25 OCTOBER</span></figcaption>
      </figure>
    </header>

    <nav className={styles.jumpLinks} aria-label="Itinerary sections">
      <a href="#your-stay">Your stay</a><a href="#daily-plan">Daily plan</a><a href="#dinner-options">Dinner options</a><a href="#final-details">To confirm</a>
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
      <p><Camera size={18} /><span><strong>Saturday · 9:00 AM</strong>Old Town photoshoot · confirmed</span></p>
      <p><Camera size={18} /><span><strong>Sunday · 10:40 AM</strong>Wukang Road photoshoot · confirmed</span></p>
      <p><Plane size={18} /><span><strong>Sunday · leave hotel 2:15 PM</strong>Airport transfer · ~60–90 min</span></p>
    </div>

    <section id="daily-plan" className={styles.dailyIntro} aria-labelledby="daily-title">
      <p className={styles.eyebrow}>One day at a time</p><h2 id="daily-title">Your weekend, planned.</h2>
      <p>Choose a day, then tap a place to see the details. Optional stops can flex around how you feel.</p>
      <p className={styles.small}>~ marks an estimated journey time, not live routing. Allow extra for traffic, queues and finding entrances. Photoshoot finish times and unbooked meals remain flexible.</p>
      <a href="#dinner-options">Compare your Saturday dinner options <ArrowDown size={14} /></a>
    </section>
    <ItineraryPage images={images} config={buildTheresaConfig()} leadName="Theresa" chromeless />

    <section id="dinner-options" className={styles.dinnerSection} aria-labelledby="dinner-title">
      <div className={styles.sectionHeading}><p className={styles.eyebrow}>Saturday evening · choose one</p><h2 id="dinner-title">A dinner to look forward to.</h2><p>Target: US$100–150 per person, ideally including drinks. An earlier seating is the preference; bar spending is separate.</p></div>
      <div className={styles.dinnerGrid}>{dinnerOptions.map(option => <details className={styles.dinnerCard} key={option.id}>
        <summary><div className={styles.dinnerPhotos}>{option.images.map((src, i) => <img src={src} key={src} alt={`${option.name} · ${i === 0 ? "restaurant photograph" : "a second look"}`} loading="lazy" />)}</div><div className={styles.dinnerCopy}><span className={styles.status}>{option.status}</span><h3>{option.name}<ChevronDown size={18} /></h3><p>{option.branch}</p></div></summary>
        <div className={styles.dinnerDetails}><p>{option.description}</p><p>{option.note}</p><p className={styles.address}>{option.address}</p><p className={styles.small}>{option.transfer}</p></div>
      </details>)}</div>
    </section>

    <section id="final-details" className={styles.finalDetails} aria-labelledby="final-title">
      <div><p className={styles.eyebrow}>The finishing touches</p><h2 id="final-title">A few details to confirm.</h2><p>We’ll refine the remaining arrangements around your preferred pace and restaurant choice.</p><a href="https://wa.me/8618201806768?text=Hi%20ChinaPal%2C%20I%20have%20a%20question%20about%20Theresa%27s%20Shanghai%20weekend." target="_blank" rel="noopener noreferrer">Message ChinaPal <ArrowUpRight size={16} /></a></div>
      <ul>{finalDetails.map(detail => <li key={detail}><Check size={16} /><span>{detail}</span></li>)}</ul>
      <p className={styles.support}>Message us before or during the trip for practical help. We can connect on WeChat to share addresses, map pins and booking details, and will reply as promptly as we can.</p>
    </section>
    <Footer />
  </div>;
}
