"use client";
/* eslint-disable @next/next/no-img-element */
import { ArrowDown, ArrowUpRight, Check, Clock, Glasses, Plane, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ImageMap } from "@/lib/itinerary-images";
import ItineraryPage from "../ItineraryPage";
import { buildAntonioConfig, finalDetails, glassesChecklist, photos } from "./config";
import styles from "./antonio.module.css";

export default function AntonioClient({ images }: { images: ImageMap }) {
  return <div className={styles.page}>
    <Navbar />
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>A personalised journey · ChinaPal</p>
        <h1>Antonio’s<br />Shanghai <em>escape.</em></h1>
        <p className={styles.intro}>Local flavours, neighbourhood walks and a little discovery — with time to enjoy each stop.</p>
        <p className={styles.tripMeta}>11–13 November 2026 <span>3 days · 2 nights</span></p>
        <a className={styles.primary} href="#daily-plan">Explore your itinerary <ArrowDown size={16} /></a>
      </div>
      <figure className={styles.heroPhoto}>
        <img src={photos.hero} alt="Shanghai’s Pudong skyline across the Huangpu River from the Bund" fetchPriority="high" />
        <figcaption>A little taste of Shanghai.<span>上海 · 11—13 NOVEMBER</span></figcaption>
      </figure>
    </header>
    <nav className={styles.jumpLinks} aria-label="Itinerary sections"><a href="#your-stay">Your stay</a><a href="#daily-plan">Daily plan</a><a href="#rokid-visit">Rokid visit</a><a href="#final-details">To confirm</a></nav>
    <p className={styles.welcome}>Welcome to Shanghai, Antonio. We’ve planned this short visit around what matters most to you: experiencing the city through its food, seeing a few memorable sights and exploring at a comfortable pace. <strong>Your November 12 accompaniment is confirmed.</strong> The itinerary below is our proposed plan, with room to adjust together.</p>
    <section id="your-stay" className={styles.overview} aria-label="Your stay at a glance">
      <article className={styles.stay}>
        <img src={photos.hotelOverview} alt="Homeinn Selected Hotel, Shanghai Bund World Metro Station branch" loading="lazy" />
        <div><p className={styles.eyebrow}>Your Shanghai address</p><h2>Homeinn Selected</h2><p>Shanghai Bund World Metro Station Hotel</p><p>如家商旅酒店<br />（上海外滩大世界地铁站店）</p><p className={styles.small}>68 Huaihai East Road, Huangpu District<br />上海市黄浦区淮海东路68号</p></div>
      </article>
      <div className={styles.flights}>
        <h2><Plane size={18} /> Arrival & departure</h2>
        <div className={styles.flight}><p>WED 11 NOV <span>Arrival · Shanghai Pudong (PVG)</span></p><strong>Around 3:00 PM</strong></div>
        <div className={styles.flight}><p>FRI 13 NOV <span>Departure · Shanghai Pudong (PVG)</span></p><strong>Time to confirm</strong></div>
        <p className={styles.small}>Times are local. Once you share your departure flight details, we’ll plan the airport transfer around them.</p>
      </div>
    </section>
    <div className={styles.keyMoments} aria-label="Your day with Steven">
      <p><Users size={18} /><span><strong>12 November · confirmed</strong>A private day with Steven</span></p>
      <p><Clock size={18} /><span><strong>10:30 AM–6:30 PM · proposed</strong>Meet in your hotel lobby · up to eight hours</span></p>
      <p><Glasses size={18} /><span><strong>Rokid · one store visit</strong>Allow 45–60 minutes to try the glasses</span></p>
    </div>
    <section id="daily-plan" className={styles.dailyIntro} aria-labelledby="daily-title">
      <p className={styles.eyebrow}>One day at a time</p><h2 id="daily-title">Your Shanghai, at an easy pace.</h2>
      <p>Choose a day, then tap a card for the details. November 11 and 13 are independent; November 12 is your accompanied day.</p>
      <p className={styles.small}>~ marks an estimated journey time, not live routing. Restaurant choices and the exact Rokid store can change with the final route. Lunch, coffee, transfers and any dinner with Steven all fit within the eight-hour arrangement.</p>
    </section>
    <ItineraryPage images={images} config={buildAntonioConfig()} leadName="Antonio" chromeless />
    <section id="rokid-visit" className={styles.rokidSection} aria-labelledby="rokid-title">

      <div><p className={styles.eyebrow}>A little discovery · 12 November</p><h2 id="rokid-title">Try it. See if it suits you.</h2><p>Huaihai Middle Road is our preferred Rokid stop; the Bund branch is the alternative. We’ll visit one store and help you check the details before you decide.</p><ul>{glassesChecklist.map(item => <li key={item}><Check size={16} /><span>{item}</span></li>)}</ul><p className={styles.price}><strong>Indicative price: around CNY 2,800</strong><br />From your supplied plan; depends on the model. Confirm the final price and availability in store.</p><p>There’s no pressure to buy — the visit is a chance to see whether the glasses suit you.</p></div>
    </section>
    <section id="final-details" className={styles.finalDetails} aria-labelledby="final-title">
      <div><p className={styles.eyebrow}>The finishing touches</p><h2 id="final-title">A few details to confirm.</h2><p>Your accompanied day is booked. We’ll refine the route and remaining arrangements together.</p><a href="https://wa.me/8618201806768?text=Hi%20ChinaPal%2C%20I%20have%20a%20question%20about%20Antonio%27s%20Shanghai%20itinerary." target="_blank" rel="noopener noreferrer">Message ChinaPal <ArrowUpRight size={16} /></a></div>
      <ul>{finalDetails.map(detail => <li key={detail}><Check size={16} /><span>{detail}</span></li>)}</ul>
      <p className={styles.support}>Mild dishes, no strong garlic flavours and a comfortable pace. Let us know if you would like to adjust anything.</p>
    </section>
    <Footer />
  </div>;
}
