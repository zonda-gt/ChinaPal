import { Camera, Car, Footprints, Hotel, Utensils } from "lucide-react";
import type { ItineraryConfig } from "../ItineraryPage";

const photo = (name: string) => `/uploads/itinerary/vivek/${name}.webp`;
const gallery = (first: string, second: string) => ({
  image: photo(first),
  previewImages: [photo(first), photo(second)],
  showPhotoPreview: true,
});

export function buildVivekDay3(): ItineraryConfig["days"][number] {
  return {
    label: "Day 3",
    city: "Shanghai",
    subtitle: "Fri, Nov 27 · Shanghai Heritage, Michelin Dining & The Louis Evening Experience",
    color: "#C23845",
    items: [
      {
        id: "v-d3-pickup", time: "09:30", icon: Car, iconBg: "#E3F2FD", type: "transport",
        title: "Hotel pickup · your guide & driver",
        subtitle: "Radisson Collection Hotel, Hyland Shanghai",
        description: "Your private English-speaking guide and driver will meet all six of you in the hotel lobby. Today follows one story: Old Shanghai → Modern Shanghai, with private transport throughout and time built in to rest. We begin with a quieter, more intimate side of the city.",
        previewLine: "Private guide & driver · Family of six · Hotel lobby",
        transportAfter: { mode: "car", duration: "09:30–10:00", note: "Hotel → Prada Rong Zhai · time allowed for transfer" },
      },
      {
        id: "v-d3-rongzhai", time: "10:00–11:30", icon: Camera, iconBg: "#FFF0EE", type: "activity",
        title: "Prada Rong Zhai · Historic Shanghai Residence",
        subtitle: "Shaanxi North Road · heritage & restoration",
        ...gallery("rong-zhai-exterior", "rong-zhai-interior"),
        previewLine: "A merchant family’s residence, restored interiors and stories of old Shanghai.",
        description: "Begin at Prada Rong Zhai, a restored early-20th-century mansion associated with Shanghai industrialist Rong Zongjing and his family. Prada began the restoration in 2011, preserving historic interiors, stained glass, woodwork and decorative details over several years.\n\nYour guide will connect the Rong family’s story with Shanghai’s industrial history: how wealthy merchant families lived, the mix of Chinese and Western design influences, and how the residence has become a contemporary cultural space.\n\nFor the children, look for architectural clues, decorative details and hints of how people once used the different rooms. This is a chance to explore the house’s story, rather than just take a photograph.",
        tip: "Exhibitions and interior access change throughout the year. We will reconfirm the November programme and arrange the best available experience; the photographs show the residence, not a confirmed exhibition.",
        transportAfter: { mode: "car", duration: "11:30–12:00", note: "Rong Zhai → Xin Rong Ji, West Nanjing Road" },
      },
      {
        id: "v-d3-xinrongji", time: "12:00–14:00", icon: Utensils, iconBg: "#FFF1F3", type: "meal",
        title: "Michelin Lunch · Xin Rong Ji",
        subtitle: "West Nanjing Road · One MICHELIN Star",
        ...gallery("xin-rong-ji-dish", "xin-rong-ji-cuisine"),
        previewLine: "Seasonal Taizhou cuisine · an unhurried family lunch.",
        description: "Lunch is planned at Xin Rong Ji on West Nanjing Road, known for seasonal ingredients and refined Taizhou-style cuisine. At 2F, 688 Plaza, 688 West Nanjing Road, this is the specific branch selected for your day.\n\nAs your visit falls in crab season, we will discuss seasonal crab dishes with the restaurant for family members who would like them. The menu will be arranged closer to November, when the restaurant can advise what ingredients are at their best.\n\nFor the guest with the shellfish restriction, we will confirm requirements directly with the restaurant before finalising the menu, including suitable dishes, sauces, stocks and cross-contact precautions.",
        tip: "The reservation and final menu are still to be confirmed. Dish photos illustrate the restaurant’s cooking; they are not a fixed menu or a promise that a dish is suitable for the shellfish-restricted guest.",
        transportAfter: { mode: "car", duration: "14:00–14:30", note: "Xin Rong Ji → Waitanyuan / Rockbund" },
      },
      {
        id: "v-d3-rockbund", time: "14:30–16:30", icon: Footprints, iconBg: "#E8F5E9", type: "activity",
        title: "Rockbund / Waitanyuan · Historic Architecture Walk",
        subtitle: "Quieter streets around Yuanmingyuan Road",
        ...gallery("rockbund-street", "rockbund-architecture"),
        previewLine: "Trading history, historic façades and a gentle walk near the rivers.",
        description: "Explore Waitanyuan and Rockbund near the meeting point of Suzhou Creek and the Huangpu River. The quieter streets around Yuanmingyuan Road offer a different perspective from the main Bund promenade.\n\nYour guide will explain Shanghai’s early trading history, the banks and commercial institutions that shaped the area, and the architectural styles you see along the way. Discover why the two waterways mattered to the city’s growth and how historic buildings are being preserved and reused today.\n\nThe walk will stay relaxed, with a comfortable total distance for the family. Your guide can shorten the route or pause whenever anyone needs a break.",
        tip: "This is an architecture walk through the neighbourhood. Entry to individual buildings or exhibitions is not assumed.",
      },
      {
        id: "v-d3-rest", time: "16:30–17:15", icon: Hotel, iconBg: "#E3F2FD", type: "hotel",
        title: "Return to Hotel & Rest",
        subtitle: "Radisson Collection Hotel, Hyland Shanghai",
        ...gallery("hyland-exterior", "hyland-lobby"),
        previewLine: "Private transfer back, then time to freshen up before the evening.",
        description: "Your driver will take you back to the hotel after the afternoon walk. This block includes the return journey and a short rest, giving the grandparents time to sit down, the children time to recharge, and everyone a chance to freshen up.\n\nThe pause is intentional: fewer, better experiences leave room to enjoy the evening together.",
      },
      {
        id: "v-d3-dinner-transfer", time: "17:15", icon: Car, iconBg: "#E3F2FD", type: "transport",
        title: "Depart for Dinner",
        description: "Your driver will collect the family from the hotel. We will monitor Friday evening traffic and adjust the departure slightly if necessary.",
        transportAfter: { mode: "car", duration: "17:15–17:45", note: "Hotel → Canton 8, Huangpu · traffic dependent" },
      },
      {
        id: "v-d3-canton8", time: "17:45–19:15", icon: Utensils, iconBg: "#FFF1F3", type: "meal",
        title: "Michelin Dinner · Canton 8, Huangpu",
        subtitle: "63 Runan Street · Two MICHELIN Stars",
        ...gallery("canton8-interior", "canton8-dish"),
        previewLine: "Cantonese cooking, family-style dishes and a table arranged for six.",
        description: "Dinner is planned at Canton 8’s Huangpu restaurant, known for traditional Cantonese cooking, dim sum, soups and carefully prepared family-style dishes.\n\nWe will coordinate a reservation for all six guests and discuss your dining preferences, the shellfish restriction, suitable seasonal dishes and seating. We can request a private room or quieter table where available, and check which signature dishes should be ordered in advance.\n\nThe menu will be agreed closer to your visit so the restaurant can make the most of November’s ingredients. Shellfish-related ingredients and cross-contact requirements must be confirmed with the restaurant before the menu is finalised.",
        tip: "Seating requests and any private room depend on the restaurant’s confirmation. Food photographs are examples, not a confirmed menu for the family.",
      },
      {
        id: "v-d3-louis-transfer", time: "19:15–20:00", icon: Car, iconBg: "#E3F2FD", type: "transport",
        title: "Private Transfer to HKRI Taikoo Hui",
        description: "Travel to West Nanjing Road for the evening’s main experience. Extra transfer time is built in so Friday evening traffic does not make the arrival feel rushed.",
        previewLine: "Private vehicle · Friday traffic buffer · West Nanjing Road",
      },
      {
        id: "v-d3-louis", time: "20:00–21:30 · Target entry time", icon: Camera, iconBg: "#FFF0EE", type: "activity",
        title: "The Louis · Louis Vuitton Visionary Journeys",
        subtitle: "Your main evening experience · HKRI Taikoo Hui",
        ...gallery("the-louis", "louis-exhibition"),
        previewLine: "The illuminated LV ship and an immersive journey through travel, design and craftsmanship.",
        description: "Finish with your requested evening visit to The Louis, Louis Vuitton’s ship-inspired destination at HKRI Taikoo Hui. The space combines retail with the immersive Visionary Journeys exhibition, exploring the Maison’s heritage through travel, trunks, fashion, craftsmanship, fragrance and design.\n\nIt connects the day’s story: from Shanghai’s historic merchant families and architecture to contemporary design and an international luxury landmark.\n\nReservations for your family: ChinaPal will follow the release of November 27 slots, coordinate a suitable entry time for all six guests, assist with official My LV / WeChat registration, reconfirm the booking and provide the reservation information before you arrive. The final entry time depends on official availability.\n\nIf you would also like to shop, tell us which products, styles or collections interest you. We can request a Client Advisor appointment, check product availability and ask about product reservations where offered. Additional services are confirmed only after the boutique confirms availability.",
        tip: "20:00–21:30 is the planned visit window, not a confirmed reservation. Entry slots, exhibition arrangements and store hours will be reconfirmed before travel.",
      },
      {
        id: "v-d3-return", time: "21:30", icon: Car, iconBg: "#E3F2FD", type: "transport",
        title: "Private Transfer Back to Hotel",
        description: "Your driver will take the family back to Radisson Collection Hotel, Hyland Shanghai. If you would like more time at The Louis, we can adjust the return around the confirmed reservation, store hours and agreed vehicle and guide arrangements.",
        previewLine: "The Louis → Radisson Collection Hotel, Hyland Shanghai",
      },
    ],
  };
}
