import { Camera, Coffee, Footprints, Hotel, Plane, TrainFront, Utensils, Car, Sailboat, Music, Trees } from "lucide-react";
import type { ItineraryConfig } from "../ItineraryPage";
import { buildVivekDay3 } from "./day3";

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
    meiGreeting: "Vivek, this is a trip for all six of you: food and stories for the grown-ups, small discoveries for the kids, and time to sit down together. Friday connects Prada Rong Zhai, Michelin dining and Rockbund with an evening at The Louis; Saturday swaps the city skyline for Suzhou’s gardens and canals.",
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
          { id: "v-friday-prep", time: "Evening", icon: Coffee, iconBg: "#FFF3E0", type: "activity", title: "Ready for Shanghai heritage & an evening at The Louis", description: "Keep comfortable walking shoes and a layer handy for Friday. Your guide and driver meet you in the hotel lobby at 09:30. We have noted the shellfish restriction; before confirming restaurant menus, please clarify the exact requirements, any other dietary preferences and mobility needs.", tip: "The guide can shorten a walking section, pause for a warm drink or skip an optional stop whenever the family needs." },
        ],
      },
      buildVivekDay3(),
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
