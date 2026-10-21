"use client";
/* eslint-disable @next/next/no-img-element */
import { ArrowDown, ArrowUpRight, Camera, Check, Plane, Sparkles, TrainFront } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ImageMap } from "@/lib/itinerary-images";
import ItineraryPage from "../ItineraryPage";
import { buildDoAnhTuConfig, finalDetails, photos } from "./config";
import styles from "./doanhtu.module.css";

export default function DoAnhTuClient({ images }: { images: ImageMap }) {
  return <div className={styles.page}>
    <Navbar />
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>A personalised journey · ChinaPal</p>
        <h1>Do Anh Tu’s<br />Shanghai & Hangzhou <em>week.</em></h1>
        <p className={styles.intro}>Beauty shopping · Photo spots · West Lake · Red pandas</p>
        <p className={styles.tripMeta}>24 October – 1 November 2026 <span>9 days · Shanghai, Hangzhou, Shanghai</span></p>
        <a className={styles.primary} href="#daily-plan">Explore your itinerary <ArrowDown size={16} /></a>
      </div>
      <figure className={styles.heroPhoto}>
        <img src={photos.hero} alt="Shanghai’s Pudong skyline across the Huangpu River from the Bund" fetchPriority="high" />
        <figcaption>Shanghai, then West Lake.<span>上海 · 杭州 · 24 OCT — 1 NOV</span></figcaption>
      </figure>
    </header>
    <nav className={styles.jumpLinks} aria-label="Itinerary sections"><a href="#your-stay">Your stays</a><a href="#daily-plan">Daily plan</a><a href="#final-details">To confirm</a></nav>
    <p className={styles.welcome}>Welcome to China! We’ve planned your free days around the DenTech congress and the places you saved: beauty shopping, photo spots, qipao, a custom lipstick and the red pandas. Every stop has its Chinese name and address so you can copy it into Amap or DiDi, plus the metro line to take. <strong>Your hotels are booked; trains, the salon and tickets are not booked yet.</strong></p>
    <section id="your-stay" className={styles.overview} aria-label="Your stays at a glance">
      <div className={styles.stays}>
        <article className={styles.stay}>
          <img src={photos.crystalOrange[0]} alt="Crystal Orange Shanghai the Bund Nanjing Road Pedestrian Street Hotel" loading="lazy" />
          <div><p className={styles.eyebrow}>Shanghai · 24 October · booked</p><h2>Crystal Orange</h2><p>Shanghai the Bund Nanjing Road Pedestrian Street Hotel</p><p className={styles.small}>桔子水晶上海外滩南京路步行街酒店<br />上海市黄浦区汉口路266号</p></div>
        </article>
        <article className={styles.stay}>
          <img src={photos.jianguo[0]} alt="White Horse Lake Jianguo Hotel, Hangzhou" loading="lazy" />
          <div><p className={styles.eyebrow}>Hangzhou · 25–28 October · booked</p><h2>White Horse Lake Jianguo</h2><p>Binjiang, across the river from West Lake</p><p className={styles.small}>杭州白马湖建国饭店<br />杭州市滨江区长江南路336号</p></div>
        </article>
        <div className={styles.pending}>
          <p className={styles.eyebrow}>Shanghai · 28 October – 1 November</p>
          <h2>Hotel to confirm</h2>
          <p>Send us your hotel once it’s booked and we’ll fine-tune days 5–8 around it. Near East Nanjing Road or People’s Square works best for your plans.</p>
        </div>
      </div>
      <div className={styles.flights}>
        <h2><TrainFront size={18} /> Arrival & trains</h2>
        <div className={styles.flight}><p>SAT 24 OCT <span>Arrival · Shanghai</span></p><div><strong>05:35</strong><small>Airport to confirm</small></div></div>
        <div className={styles.flight}><p>SUN 25 OCT <span>G1583 · suggested</span></p><div><strong>16:32 <small>Shanghai Hongqiao</small></strong><span>→</span><strong>17:24 <small>Hangzhou East</small></strong></div></div>
        <div className={styles.flight}><p>WED 28 OCT <span>G7506 or G262 · suggested</span></p><div><strong>09:53 <small>Hangzhou East</small></strong><span>→</span><strong>~10:40 <small>Shanghai Hongqiao</small></strong></div></div>
        <p className={styles.small}>Trains are not booked yet. Sunday afternoon trains sell out, so book soon on Trip.com with your passport, or let us book them for you. Carry your passport on every train.</p>
      </div>
    </section>
    <div className={styles.keyMoments} aria-label="Key moments">
      <p><Sparkles size={18} /><span><strong>Sun 25 Oct · 09:00–14:00</strong>DenTech congress, then the 16:32 train</span></p>
      <p><Camera size={18} /><span><strong>Tue 27 Oct · West Lake</strong>Lingyin Temple needs a reservation</span></p>
      <p><Plane size={18} /><span><strong>Sun 1 Nov</strong>Your group programme begins</span></p>
    </div>
    <section id="daily-plan" className={styles.dailyIntro} aria-labelledby="daily-title">
      <p className={styles.eyebrow}>One day at a time</p><h2 id="daily-title">Your week, planned.</h2>
      <p>Choose a day, then tap a card for the details. Optional stops can flex around how you feel.</p>
      <p className={styles.small}>~ marks an estimated journey time. Allow extra for traffic, queues and finding entrances. Restaurants and cafés are suggestions and have not been reserved.</p>
    </section>
    <ItineraryPage images={images} config={buildDoAnhTuConfig()} leadName="Do Anh Tu" chromeless />
    <section id="final-details" className={styles.finalDetails} aria-labelledby="final-title">
      <div><p className={styles.eyebrow}>The finishing touches</p><h2 id="final-title">A few details to confirm.</h2><p>Your hotels in Shanghai (24 October) and Hangzhou are booked. A few details will help us finalise the rest.</p><a href="https://wa.me/8618201806768?text=Hi%20ChinaPal%2C%20I%20have%20a%20question%20about%20my%20Shanghai%20and%20Hangzhou%20itinerary." target="_blank" rel="noopener noreferrer">Message ChinaPal <ArrowUpRight size={16} /></a></div>
      <ul>{finalDetails.map(detail => <li key={detail}><Check size={16} /><span>{detail}</span></li>)}</ul>
      <p className={styles.support}>Message us before or during your trip. We’ll share map pins and booking details on WeChat and reply as quickly as we can.</p>
    </section>
    <Footer />
  </div>;
}
