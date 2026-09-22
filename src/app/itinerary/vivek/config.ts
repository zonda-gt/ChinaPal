import { Camera, Coffee, Footprints, Hotel, Plane, TrainFront, Utensils, Car, Sailboat, Music, Trees } from "lucide-react";
import type { ItineraryConfig } from "../ItineraryPage";

const photo = (name: string) => `/uploads/itinerary/vivek/${name}.webp`;
type Item = ItineraryConfig["days"][number]["items"][number];

function sight(id: string, time: string, title: string, image: string, description: string, tip: string, icon = Camera): Item {
  return { id: `v-${id}`, time, title, image: photo(image), previewImages: [photo(image)], description, tip, icon, iconBg: "#FFF0EE", type: "activity" };
}

export function buildVivekConfig(): ItineraryConfig {
  return {
    cityName: "Shanghai & Suzhou",
    title: "Shanghai & Suzhou Family Journey",
    location: "Shanghai · Suzhou",
    duration: "5 Days · November 25–29, 2026",
    heroImage: photo("pingjiang-road"),
    meiGreeting: "Vivek, this is a trip for all six of you: food and stories for the grown-ups, small discoveries for the kids, and time to sit down together. Friday follows your Shanghai wish list; Saturday swaps the city skyline for Suzhou’s gardens and canals.",
    overview: [
      { icon: "👨‍👩‍👧‍👦", label: "6 guests · three generations" },
      { icon: "🗓️", label: "Nov 25–29, 2026 · 4 nights" },
      { icon: "🗣️", label: "Guide requested · Nov 27 & 28" },
      { icon: "🚘", label: "Private PVG transfers requested" },
      { icon: "🍵", label: "Moderate pace · regular breaks" },
    ],
    departure: {
      time: "Sun, Nov 29 · 13:45",
      title: "CX367 · Shanghai Pudong → Hong Kong",
      description: "Your supplied departure is 13:45 from PVG on Cathay Pacific CX367. A 09:15 hotel pickup is proposed to allow more time for the drive, check-in and the whole family to move through the airport. Confirm the final pickup and terminal against the flight booking.",
    },
    departureNote: "Flight details are from your brief. Transfer arrangements, guide availability and tickets are still to be confirmed.",
    picks: [],
    days: [
      {
        label: "Day 1", city: "Shanghai", subtitle: "Wed, Nov 25 · Arrival & an easy evening", color: "#7B6CD9",
        items: [
          { id: "v-arrival", time: "16:15 · Flight arrival", icon: Plane, iconBg: "#E3F2FD", type: "transport", title: "Welcome to Shanghai · CX360", subtitle: "Hong Kong → Shanghai Pudong (PVG)", description: "Arrive on CX360 at 16:15, as supplied in your booking details. Allow time for immigration and luggage before meeting your private-transfer driver at the agreed arrivals meeting point.", tip: "Vehicle size will be confirmed for six passengers and all suitcases; a seven-seat vehicle may not have enough luggage room.", transportAfter: { mode: "car", duration: "Allow 60–90 min", note: "PVG → Radisson Collection Hotel, Hyland Shanghai · traffic dependent" } },
          { id: "v-checkin", time: "Early evening · after transfer", icon: Hotel, iconBg: "#E3F2FD", type: "hotel", title: "Settle into your Shanghai base", subtitle: "Radisson Collection Hotel, Hyland Shanghai", description: "505 Nanjing Road East, Huangpu, Shanghai 200001. Drop the bags, settle into your rooms and take a breather before dinner." },
          { id: "v-arrival-dinner", time: "Evening · at your own pace", icon: Utensils, iconBg: "#FFF1F3", type: "meal", title: "An easy first family dinner", description: "Keep tonight simple with dinner at or near the hotel. If everyone feels fresh, take a short look around Nanjing Road East; otherwise, save your energy for the days ahead. No guide is scheduled today." },
        ],
      },
      {
        label: "Day 2", city: "Shanghai", subtitle: "Thu, Nov 26 · Your own Shanghai plans", color: "#538B78",
        items: [
          { id: "v-own-day", time: "All day", icon: Footprints, iconBg: "#E8F5E9", type: "activity", title: "A day that stays entirely yours", subtitle: "Self-planned · no guide scheduled", description: "You already have Thursday planned, so we have left it open. Enjoy Shanghai on your own terms, with Radisson Collection Hotel, Hyland Shanghai as your base.", previewLine: "Your existing plans, with no extra stops added." },
          { id: "v-friday-prep", time: "Evening", icon: Coffee, iconBg: "#FFF3E0", type: "activity", title: "Ready for a day of stories & street food", description: "Keep comfortable walking shoes and a layer handy for Friday. Before the guided days, let us know about allergies or dietary preferences, any mobility needs, and what you would like to visit at 798 Huaihai Road. Dietary requirements are currently unconfirmed.", tip: "The guide can shorten a walking section, pause for a warm drink or skip an optional stop whenever the family needs." },
        ],
      },
      {
        label: "Day 3", city: "Shanghai", subtitle: "Fri, Nov 27 · Your Shanghai food & culture wish list", color: "#C23845",
        items: [
          { id: "v-guide", time: "08:30 · Proposed meetup", icon: Car, iconBg: "#E3F2FD", type: "transport", title: "Meet your English-speaking guide", subtitle: "Hotel lobby · all six of you", description: "Start with a quick check of everyone’s energy and food preferences. Today links Jing’an and Nanjing West Road with Huaihai Road, Fuxing Park, Sinan Mansions and Xintiandi. Short vehicle hops are proposed between the longer walking sections; city transport and guide hours need to be included in the final quote.", transportAfter: { mode: "car", duration: "20–30 min", note: "Hotel → Jing’an Temple · proposed vehicle hop" } },
          { ...sight("jingan", "09:00–10:00", "Jing’an Temple · a quieter start", "jingan-temple", "Begin with the golden roofs and courtyards of Jing’an Temple. Your guide introduces the temple and its place in the surrounding modern city. For the kids, turn the visit into a hunt for repeated animal shapes and roof details.", "Keep the visit to a comfortable route. Some halls have steps; access and seating should be checked rather than assuming the whole temple is step-free."), transportAfter: { mode: "car", duration: "15–20 min", note: "Jing’an Temple → HKRI Taikoo Hui" } },
          sight("louis", "10:20–10:45", "HKRI Taikoo Hui · the LV ship", "the-louis", "See The Louis, the ship-shaped Louis Vuitton landmark you asked for. Start with an exterior family photo and a short introduction to its travel-inspired design, then decide whether to spend longer inside.", "The exterior photo stop is the core plan. Any exhibition or café visit depends on November opening arrangements, reservations and the queue."),
          { ...sight("coffee", "10:45–11:30", "Starbucks Reserve Roastery · coffee & a pause", "roastery", "Continue to the Shanghai Roastery in the same complex for a warm drink and a pastry. The visible coffee equipment gives the children something to investigate while the adults take a seated break.", "Choose drinks individually, including non-coffee options for the children. Seats and pastry choices depend on availability.", Coffee), transportAfter: { mode: "car", duration: "20–30 min", note: "Nanjing West Road → Huaihai Middle Road" } },
          sight("huaihai", "12:00–12:20", "Huaihai Middle Road · your stop at No. 798", "huaihai-road", "A short walk along Huaihai Middle Road introduces the former French Concession and its mix of shops and older buildings. We have kept 798 Huaihai Road on your route exactly as requested.", "Please confirm the shop or venue intended at No. 798 so the guide can find the correct entrance. The photo shows Huaihai Road, not the unconfirmed venue.", Footprints),
          { id: "v-shanghai-lunch", time: "12:20–13:15", icon: Utensils, iconBg: "#FFF1F3", type: "meal", title: "A proper sit-down Shanghainese lunch", subtitle: "Restaurant to be selected with your guide", description: "A family-style lunch near Huaihai Road, with time for everyone to rest. The draft suggests Shucai Ji; the exact restaurant and availability need confirmation. Consider shengjian, rice dishes and vegetables, adapting the order once dietary needs are known.", tip: "Choose a seated restaurant over eating an entire lunch while standing in snack queues." },
          sight("bakery", "13:15–13:40", "Shanghai Harbin Foodstuff Factory · a shared tasting", "harbin-bakery", "Stop at the Huaihai Road bakery from your wish list. Pick a small selection of butterfly cookies or almond crisps to share and let everyone choose a favourite to bring home.", "Pastry pre-orders are a request to arrange, not a confirmed queue-skip service. Check ingredients once allergies are known."),
          sight("park", "14:00–14:45", "Fuxing Park · room to slow down", "fuxing-park", "Trade shopfronts for garden paths and a proper bench break. Your guide can talk about the area’s changing history while you enjoy a glimpse of everyday Shanghai. Keep this as a relaxed pause rather than another attraction to rush through.", "Take the shortest comfortable loop. November weather may call for moving the rest break indoors.", Trees),
          sight("sinan", "15:00–16:15", "Sinan Mansions · villas, stories & afternoon tea", "sinan-mansions", "Explore the garden-house architecture around Sinan Mansions at a gentle pace. Ask the kids to spot different roof and window shapes as the guide brings the neighbourhood’s past to life, then make time for a warm drink together.", "A seated café or tea stop is proposed. Private garden tea service inside a villa is subject to venue availability and a separate arrangement."),
          sight("xintiandi", "16:30–17:15", "Xintiandi · Shanghai through its stone gates", "xintiandi", "Finish the sightseeing among Xintiandi’s shikumen-style lanes. Compare the stone doorways and brick façades with the villas you have just seen, then take a final family photograph before dinner.", "If energy is low, shorten the lane walk and go straight to dinner. Evening guide hours must be agreed in advance."),
          { id: "v-shanghai-dinner", time: "17:15–18:15 · Optional", icon: Utensils, iconBg: "#FFF1F3", type: "meal", title: "Stay for a family dinner, or head back early", description: "For those who want to stay, a Shanghainese dinner near Xintiandi rounds out the day. Red-braised pork, fish and vegetables are possibilities once preferences are confirmed. Otherwise, return to the hotel for an easier evening.", transportAfter: { mode: "car", duration: "20–40 min", note: "Xintiandi → hotel · allow for Friday evening traffic" } },
        ],
      },
      {
        label: "Day 4", city: "Suzhou", subtitle: "Sat, Nov 28 · Garden paths, canal life & tea", color: "#538B78",
        items: [
          { id: "v-suzhou-out", time: "08:00 · Proposed hotel departure", icon: TrainFront, iconBg: "#E3F2FD", type: "transport", title: "Shanghai → Suzhou with your guide", subtitle: "Private station transfers + high-speed train proposed", description: "Meet at the hotel, transfer to Shanghai Hongqiao and take a high-speed train to Suzhou. The exact station pair, departure and reserved seats will be chosen when tickets become available. Allow time for station security and the transfer onward to the museum.", tip: "Bring the original travel documents used for train bookings. All times below are planning estimates; the final train and museum slots set the day’s pace.", transportAfter: { mode: "train", duration: "Service dependent", note: "High-speed train, then private transfer to central Suzhou" } },
          sight("museum", "10:00–11:00 · Target slot", "Suzhou Museum · a garden made of light", "suzhou-museum", "Start at the main museum designed by I. M. Pei. Focus on the courtyards, reflections and a few collection highlights instead of trying to see every gallery. Invite the children to find a view that looks like a painting.", "An advance reservation is required for the main museum. If a suitable slot cannot be secured, extend the garden and canal time; no museum booking is confirmed."),
          sight("garden", "11:15–12:15", "Lion Grove Garden · a landscape in miniature", "lion-grove", "Explore the garden’s ponds, pavilions and distinctive limestone formations. Anyone who prefers a gentler visit can enjoy the views while the children explore a short rockery section with a parent.", "The rock maze has uneven surfaces, narrow passages and steps. It is optional; agree a meeting point and keep an adult with the children.", Trees),
          { id: "v-suzhou-lunch", time: "12:30–13:30", icon: Utensils, iconBg: "#FFF1F3", type: "meal", title: "A slow Suzhou lunch near Pingjiang Road", description: "Sit down for a shared meal with Suzhou flavours. Squirrel-shaped sweet-and-sour fish and vegetable dishes are possible choices. If convenient, add local pan-fried buns; Yaba Shengjian is a suggestion from the draft, subject to branch routing and queues.", tip: "No need to chase a particular snack shop if it means a detour or a long wait." },
          sight("pingjiang", "13:30–14:15", "Pingjiang Road · little bridges, local stories", "pingjiang-road", "Follow a short stretch of the canal past white walls, dark roofs and small shops. This is time for unhurried discoveries: a bridge photograph, a pastry to share, or a look at a craft shop. Your guide can translate and explain what catches your eye.", "Walk only as far as the family feels comfortable. Leave room for a seated break instead of aiming to cover the full district.", Footprints),
          sight("boat", "14:15–14:45 · Optional", "A different view · hand-rowed canal boat", "pingjiang-road", "If conditions and availability allow, take a short boat ride for a different view of the canal-side houses and bridges. The canal photograph is a destination preview; the boat and departure point are still to be arranged.", "Confirm boarding access and boat capacity for six guests. The group may need two boats; singing by the boat operator is not guaranteed.", Sailboat),
          { id: "v-pingtan", time: "15:00–15:45 · Optional", icon: Music, iconBg: "#F3E8F5", type: "activity", title: "Tea & pingtan · listen to Suzhou", subtitle: "Proposed teahouse experience", description: "End the afternoon sitting together over tea, with a short pingtan storytelling-and-music performance if a suitable session is available. Your guide can explain the story and the instruments. A private performance needs separate confirmation and pricing.", tip: "If there is no suitable performance, keep this as a relaxed tea stop. Choose non-caffeinated drinks for anyone who prefers them." },
          { id: "v-suzhou-return", time: "16:15 onward · Aim for hotel around 18:30", icon: TrainFront, iconBg: "#E3F2FD", type: "transport", title: "Back to your Shanghai hotel", description: "Transfer to the station, take the booked train back to Shanghai and continue by private vehicle to the hotel. The return time depends on the final train and road traffic. The evening is free for a simple dinner and packing.", tip: "The hotel return estimate allows more breathing room than the draft’s 17:30 target." },
        ],
      },
      {
        label: "Day 5", city: "Shanghai", subtitle: "Sun, Nov 29 · Breakfast, checkout & onward to Hong Kong", color: "#7B6CD9",
        items: [
          { id: "v-checkout", time: "08:00–09:00", icon: Hotel, iconBg: "#E3F2FD", type: "hotel", title: "Breakfast & checkout", subtitle: "Radisson Collection Hotel, Hyland Shanghai", description: "Enjoy breakfast, check the rooms and gather all passports and bags before meeting your driver in the lobby." },
          { id: "v-departure-transfer", time: "09:15 · Recommended pickup, to confirm", icon: Car, iconBg: "#E3F2FD", type: "transport", title: "Private transfer to Pudong Airport", description: "A vehicle sized for six guests and luggage takes you directly to PVG. We propose an earlier pickup than the draft’s 10:30 to leave more breathing room for your 13:45 flight. Final timing and terminal will be confirmed before travel.", transportAfter: { mode: "car", duration: "Allow 60–90 min", note: "Hotel → PVG · traffic dependent" } },
        ],
      },
    ],
  };
}
