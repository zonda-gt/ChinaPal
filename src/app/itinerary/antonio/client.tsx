"use client";
/* eslint-disable @next/next/no-img-element */
import { ArrowDown, ArrowUpRight, Check, Clock, Wallet, Plane, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ImageMap } from "@/lib/itinerary-images";
import ItineraryPage from "../ItineraryPage";
import { buildAntonioConfig, finalDetails, photos } from "./config";
import styles from "./antonio.module.css";

export default function AntonioClient({ images }: { images: ImageMap }) {
  return <div className={styles.page}>
    <Navbar />
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>A personalised journey · ChinaPal</p>
        <h1>Antonio’s<br />Shanghai <em>escape.</em></h1>
        <p className={styles.intro}>Local flavours · Neighbourhood walks · A relaxed pace</p>
        <p className={styles.tripMeta}>11–13 November 2026 <span>3 days · 2 nights</span></p>
        <a className={styles.primary} href="#daily-plan">Explore your itinerary <ArrowDown size={16} /></a>
      </div>
      <figure className={styles.heroPhoto}>
        <img src={photos.hero} alt="Shanghai’s Pudong skyline across the Huangpu River from the Bund" fetchPriority="high" />
        <figcaption>A little taste of Shanghai.<span>上海 · 11—13 NOVEMBER</span></figcaption>
      </figure>
    </header>
    <nav className={styles.jumpLinks} aria-label="Itinerary sections"><a href="#your-stay">Your stay</a><a href="#daily-plan">Daily plan</a><a href="#your-day">Your day with Steven</a><a href="#final-details">To confirm</a></nav>
    <p className={styles.welcome}>Welcome to Shanghai, Antonio. We’ve planned this short visit around what matters most to you: experiencing the city through its food, seeing a few memorable sights and exploring at a comfortable pace. <strong>Your November 12 accompaniment is confirmed.</strong> Your suggested itinerary is flexible. Restaurants, cafés and bars have not been reserved.</p>
    <section id="your-stay" className={styles.overview} aria-label="Your stay at a glance">
      <article className={styles.stay}>
        <img src={photos.hotelOverview} alt="Homeinn Selected Hotel, Shanghai Bund World Metro Station branch" loading="lazy" />
        <div><p className={styles.eyebrow}>Your booked Shanghai stay</p><h2>Homeinn Selected</h2><p>Shanghai Bund World Metro Station Hotel</p><p>如家商旅酒店<br />（上海外滩大世界地铁站店）</p><p className={styles.small}>68 Huaihai East Road, Huangpu District<br />上海市黄浦区淮海东路68号</p></div>
      </article>
      <div className={styles.flights}>
        <h2><Plane size={18} /> Arrival & departure</h2>
        <div className={styles.flight}><p>WED 11 NOV <span>Arrival · Shanghai Pudong (PVG)</span></p><strong>Around 15:00</strong></div>
        <div className={styles.flight}><p>FRI 13 NOV <span>Departure · Shanghai Pudong (PVG)</span></p><strong>13:20 · confirmed</strong></div>
        <p className={styles.small}>All times are local. Flight numbers, airline and departure terminal are still to confirm. The provisional hotel departure is around 09:00 on November 13; no airport transfer is booked.</p>
      </div>
    </section>
    <div className={styles.keyMoments} aria-label="Your day with Steven">
      <p><Users size={18} /><span><strong>12 November · confirmed</strong>A private day with Steven</span></p>
      <p><Clock size={18} /><span><strong>10:30–18:30 · proposed</strong>Meet in your hotel lobby · up to eight hours</span></p>
      <p><Wallet size={18} /><span><strong>CNY 800 · private accompaniment</strong>CNY 400 deposit paid · CNY 400 due on the day</span></p>
    </div>
    <section id="daily-plan" className={styles.dailyIntro} aria-labelledby="daily-title">
      <p className={styles.eyebrow}>One day at a time</p><h2 id="daily-title">Your Shanghai, at an easy pace.</h2>
      <p>Choose a day, then tap a card for the details. November 11 and 13 are independent; November 12 is your accompanied day.</p>
      <p className={styles.small}>All route timings are suggestions. Lunch, coffee, rest, travel between stops and any dinner with Steven are included in the eight-hour time allowance. Meals, drinks, admission, transport and personal purchases are paid separately.</p>
    </section>
    <ItineraryPage images={images} config={buildAntonioConfig()} leadName="Antonio" chromeless />
    <section id="your-day" className={styles.serviceSection} aria-labelledby="service-title">
      <div><p className={styles.eyebrow}>12 November · confirmed accompaniment</p><h2 id="service-title">A private day with Steven.</h2><p>Up to eight hours of local accompaniment for your solo visit, with a proposed hotel-lobby meeting at 10:30 and a planned finish at 18:30.</p><p className={styles.price}><strong>CNY 800 total · CNY 400 deposit paid</strong><br />The remaining CNY 400 is due on November 12. Meals, coffee, tickets, transport and personal purchases are extra.</p><p>Your booking covers November 12. November 11 and 13 are independent days, and airport transfers are not included.</p></div>
      <div><p className={styles.eyebrow}>Room to enjoy each stop</p><h2>A comfortable pace.</h2><p>We’ll focus on local food, culture and gentle walks, avoiding long queues. If time gets tight, we’ll shorten Xintiandi first to protect your coffee break and dinner window.</p><p>If the weather turns, we’ll reduce outdoor walking and allow more indoor rest, choosing suitable places on the day.</p><p>We’ve noted your preference for mild dishes and no strong garlic flavours. Steven can help discuss seasoning and portions with the restaurant.</p></div>
    </section>
    <section id="final-details" className={styles.finalDetails} aria-labelledby="final-title">
      <div><p className={styles.eyebrow}>The finishing touches</p><h2 id="final-title">A few details to confirm.</h2><p>Your November 12 accompaniment and 13:20 departure on November 13 are noted. Just a few details will help us refine the suggested route.</p><a href="https://wa.me/8618201806768?text=Hi%20ChinaPal%2C%20I%20have%20a%20question%20about%20Antonio%27s%20Shanghai%20itinerary." target="_blank" rel="noopener noreferrer">Message ChinaPal <ArrowUpRight size={16} /></a></div>
      <ul>{finalDetails.map(detail => <li key={detail}><Check size={16} /><span>{detail}</span></li>)}</ul>
      <p className={styles.support}>Mild dishes, no strong garlic flavours and a comfortable pace. Let us know if you would like to adjust anything.</p>
    </section>
    <Footer />
  </div>;
}
