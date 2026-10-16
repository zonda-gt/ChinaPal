'use client';
/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Car, Check, ChevronDown, Clock3, MapPin, MessageCircle, TrainFront } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cities, confirmations, days, hero, type Stop } from './data';
import styles from './dominic.module.css';

function StopCard({ stop, index }: { stop: Stop; index: number }) {
 return <div className={styles.stopWrap}>
  <div className={styles.time}><span>{String(index + 1).padStart(2, '0')}</span><Clock3 size={13} />{stop.time}</div>
  <details className={styles.card}>
   <summary>
    {stop.photos && <div className={`${styles.photos} ${stop.photos.length === 1 ? styles.singlePhoto : ''}`}>{stop.photos.map(photo => <img key={photo.src} src={photo.src} alt={photo.alt} loading="lazy" />)}</div>}
    <div className={styles.cardCopy}>
     {stop.status && <p className={`${styles.status} ${stop.confirmed ? styles.confirmed : ''}`}>{stop.confirmed && <Check size={12} />}{stop.status}</p>}
     <h3>{stop.title}<ChevronDown size={20} className={styles.chevron} /></h3>
     {stop.cn && <p className={styles.chinese}>{stop.cn}</p>}
     <p className={styles.description}>{stop.intro}</p>
     <span className={styles.openHint}>Tap for the details</span>
    </div>
   </summary>
   <div className={styles.cardDetails}>{stop.details.map(detail => <p key={detail}>{detail}</p>)}{stop.caption && <p className={styles.caption}>{stop.caption}</p>}</div>
  </details>
  {stop.journey && <p className={styles.journey}><Car size={16}/><span>{stop.journey}</span></p>}
 </div>;
}
export default function DominicClient() {
 const [date, setDate] = useState(15);
 const dayIndex = days.findIndex(day => day.date === date);
 const day = days[dayIndex];
 const city = cities.find(city => city.name === day.city)!;
 const cityDays = days.filter(item => item.city === day.city);
 function selectDate(next: number, scroll = false) {
  setDate(next);
  if (scroll) document.getElementById('daily-plan')?.scrollIntoView({behavior:'smooth',block:'start'});
 }
 return <div className={styles.page}>
  <Navbar />
  <header className={styles.hero}>
   <div className={styles.heroCopy}>
    <p className={styles.eyebrow}>A personalised journey · ChinaPal</p>
    <h1>Dominic’s<br/>China <em>journey.</em></h1>
    <p className={styles.intro}>From Shanghai’s skyline to mountain peaks and a glimpse of the future. Culture, discovery and time to enjoy it all.</p>
    <p className={styles.tripMeta}>15–30 October 2026 <span>16 days · 6 cities</span></p>
    <a className={styles.primary} href="#daily-plan">Explore your itinerary <ArrowDown size={16}/></a>
   </div>
   <figure className={styles.heroPhoto}><img src={hero.src} alt={hero.alt} fetchPriority="high"/><figcaption>A journey of contrasts.<span>中国 · OCTOBER 2026</span></figcaption></figure>
  </header>
  <nav className={styles.jumpLinks} aria-label="Itinerary sections"><a href="#daily-plan">Your daily plan</a><a href="#your-stays">Your hotels</a><a href="#travel-details">Travel & confirmations</a></nav>
  <section className={styles.welcome}>
   <p>Welcome to China, Dominic. This journey brings together your interests in culture and technology, with comfortable breaks along the way. Some experiences are booked; others remain flexible so we can shape each day together.</p>
   <div className={styles.highlights}><span><MapPin size={16}/>Six cities, one journey</span><span><Clock3 size={16}/>Room to rest</span><span><MessageCircle size={16}/>Support through WeChat</span></div>
  </section>
  <section id="daily-plan" className={styles.plan} aria-labelledby="plan-title">
   <div className={styles.sectionHeading}><p className={styles.eyebrow}>One day at a time</p><h2 id="plan-title">Your China, at your pace.</h2><p>Choose a city and date. Tap any card to see the full arrangements.</p></div>
   <nav className={styles.cityNav} aria-label="Choose a city">{cities.map((item,i) => <button key={item.name} aria-pressed={city.name === item.name} onClick={()=>selectDate(days.find(d=>d.city===item.name)!.date)}><span className={styles.cityNumber}>{String(i+1).padStart(2,'0')}</span><span><strong>{item.name}</strong><small>{item.dates}</small></span></button>)}</nav>
   <div className={styles.planLayout}>
    <aside className={styles.stayPanel} aria-label={`Your ${city.name} hotel`}><p className={styles.eyebrow}>{city.name} · {city.cn}</p><h3>Your base.</h3><strong>{city.hotel}</strong><p>{city.nights}</p><hr/><p><MapPin size={15}/>{city.address}</p><p className={styles.chineseAddress}>{city.chineseAddress}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city.hotel+' '+city.chineseAddress)}`} target="_blank" rel="noopener noreferrer">Find on a map <ArrowUpRight size={14}/></a><p className={styles.small}>Use the Chinese address with your driver. Hotel dates follow your supplied itinerary.</p></aside>
    <div className={styles.dailyContent}>
     <nav className={styles.dateNav} aria-label={`Choose a date in ${city.name}`}>{cityDays.map(item=><button key={item.date} aria-pressed={date===item.date} onClick={()=>selectDate(item.date)}><small>{item.weekday.slice(0,3)}</small><strong>{item.date} Oct</strong></button>)}</nav>
     <div className={styles.dayHeading} aria-live="polite"><p className={styles.eyebrow}>Day {dayIndex+1} · {day.weekday}, {date} October</p><h2>{day.title}</h2><p>{day.note}</p></div>
     <div className={styles.stops} key={day.date}>{day.stops.map((stop,i)=><StopCard key={stop.title} stop={stop} index={i}/>)}</div>
     <p className={styles.estimateNote}>Journey times are planning estimates, not live routing or confirmed pickups. Traffic, queues and station or airport formalities can add time. All times are local to China.</p>
     <div className={styles.dayControls}><button disabled={dayIndex===0} onClick={()=>selectDate(days[dayIndex-1].date,true)}><ArrowLeft size={16}/>Previous day</button><span>{dayIndex+1} / {days.length}</span><button disabled={dayIndex===days.length-1} onClick={()=>selectDate(days[dayIndex+1].date,true)}>Next day<ArrowRight size={16}/></button></div>
    </div>
   </div>
  </section>
  <section id="your-stays" className={styles.hotelSection} aria-labelledby="hotels-title"><div className={styles.sectionHeading}><p className={styles.eyebrow}>A place to settle in</p><h2 id="hotels-title">Your stays along the way.</h2></div><div className={styles.hotelGrid}>{cities.map((item,i)=><article key={item.name}><p className={styles.eyebrow}>{String(i+1).padStart(2,'0')} · {item.name}</p><h3>{item.hotel}</h3><p>{item.nights}</p><p>{item.address}<br/><span lang="zh">{item.chineseAddress}</span></p></article>)}</div></section>
  <section id="travel-details" className={styles.finalSection} aria-labelledby="final-title">
   <div className={styles.sectionHeading}><p className={styles.eyebrow}>The practical details</p><h2 id="final-title">Ready for each next step.</h2><p>Booking status and quoted amounts follow the arrangements you shared. The latest issued ticket takes priority for flight and train details.</p></div>
   <div className={styles.practicalGrid}>
    <article className={styles.practicalCard}><h3><TrainFront size={20}/>Your rail journeys</h3><dl><dt>21 Oct · G2322 · 13:28–15:56</dt><dd>Zhangjiajie West → Chongqing East<br/>First class · coach 01 · seat 08A<br/>RMB 373 incl. insurance · paid</dd><dt>25 Oct · G8614 · 10:40–11:46</dt><dd>Chongqing West → Chengdu East<br/>Second class · coach 02 · seat 05F<br/>RMB 161 incl. insurance · ticket purchased; payment confirmation pending</dd><dt>28 Oct · D7593 · 11:10–12:40</dt><dd>Guangzhou East → Futian<br/>Ticket purchased · coach and seat to follow<br/>RMB 86 incl. insurance; combined with RMB 150 pickup in the RMB 236 payment link</dd></dl><p className={styles.small}>Carry your original passport. Check the latest train order and allow time for station security and boarding.</p></article>
    <article className={styles.practicalCard}><h3><MessageCircle size={20}/>Keeping everything handy</h3><p>Reservation confirmations and entry instructions are to be shared by both email and WeChat, so you can save them for offline use.</p><p>Before every travel day, check that you have the latest ticket, Chinese destination address and pickup contact.</p><p><strong>Any new purchase:</strong> we’ll confirm the price, timing and terms with you before proceeding.</p><p>Keep rest breaks in the plan. We can shorten optional stops and adjust the order around weather, traffic and how you feel.</p><a href="https://wa.me/8618201806768?text=Hi%20ChinaPal%2C%20I%20have%20a%20question%20about%20Dominic%27s%20itinerary." target="_blank" rel="noopener noreferrer">Message ChinaPal <ArrowUpRight size={16}/></a></article>
   </div>
   <details className={styles.confirmationList}><summary><span>A few details still to confirm</span><ChevronDown size={20}/></summary><div>{confirmations.map(([title,detail])=><p key={title}><strong>{title}</strong>{detail}</p>)}</div></details>
   <p className={styles.updated}>Prepared from your latest arrangements · checked 16 October 2026. Photographs show the named places or previous performances; live displays and operating conditions can vary.</p>
   <details className={styles.photoCredits}><summary>Photography credits</summary><p>Huacheng Square photograph by <a href="https://commons.wikimedia.org/wiki/File:Huacheng_Square,_Guangzhou.jpg" target="_blank" rel="noopener noreferrer">钉钉 / Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>. Resized, converted to WebP and cropped for display; this image adaptation is shared under the same licence.</p><p>Duoyun Books: Wutopia Lab / METALOCUS. Raffles City: CapitaLand and Safdie Architects / Shao Feng. Additional destination and performance photographs are sourced from venue, tourism, municipal and travel photography collections.</p></details>
  </section>
  <Footer/>
 </div>;
}
