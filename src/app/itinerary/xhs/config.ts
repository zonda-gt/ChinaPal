import { BriefcaseBusiness, Camera, Coffee, Footprints, Hotel, Moon, Plane, ShoppingBag, TrainFront, Utensils } from "lucide-react";
import type { ItineraryConfig } from "../ItineraryPage";

type Item = ItineraryConfig["days"][number]["items"][number];
type Day = ItineraryConfig["days"][number];

export const photos = {
  bund: "/uploads/itinerary/xhs/bund.webp",
  garden: "/uploads/itinerary/xhs/garden.webp",
  shopping: "/uploads/itinerary/xhs/shopping.webp",
  wukang: "/uploads/itinerary/xhs/wukang.webp",
  evening: "/uploads/itinerary/xhs/evening.webp",
  lake: "/uploads/itinerary/xhs/lake.webp",
  tea: "/uploads/itinerary/xhs/tea.webp",
  temple: "/uploads/itinerary/xhs/temple.webp",
  hefang: "/uploads/itinerary/xhs/hefang.webp",
};

// Planning allowances supplied in the brief, not live supplier quotes.
// Nine nights: five Shanghai + two Hangzhou + two Shanghai.
export const budget = [
  { label: "A comfortable base", detail: "9 nights × €80–150 · your own room", low: 720, high: 1350 },
  { label: "Food, coffee & drinks", detail: "10 days × €30–60", low: 300, high: 600 },
  { label: "Getting around", detail: "Return train, metro & selected taxis", low: 150, high: 150 },
  { label: "Sights & small experiences", detail: "An allowance for your chosen extras", low: 100, high: 100 },
  { label: "A little breathing room", detail: "Contingency for changes along the way", low: 150, high: 150 },
];

const euro = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
export const euroRange = (low: number, high: number) => low === high ? euro.format(low) : `${euro.format(low)}–${euro.format(high)}`;
export const budgetTotal = euroRange(budget.reduce((sum, row) => sum + row.low, 0), budget.reduce((sum, row) => sum + row.high, 0));

function item(id: string, time: string, title: string, description: string, options: Partial<Omit<Item, "id" | "time" | "title" | "description">> = {}): Item {
  return {
    id: `xhs-${id}`, time, title, description,
    icon: Footprints, iconBg: "#FFF0EE", type: "activity",
    ...options,
    previewImages: options.previewImages ?? (options.image ? [options.image] : undefined),
  };
}

function meal(id: string, time: string, title: string, description: string): Item {
  return item(id, time, title, description, { type: "meal", icon: Utensils, iconBg: "#FFF0EE", previewLine: description });
}

function day(number: number, city: string, subtitle: string, items: Item[]): Day {
  return { label: `Day ${number}`, city, subtitle, color: city === "Hangzhou" ? "#537466" : "#C23845", items };
}

export function buildXhsConfig(): ItineraryConfig {
  return {
    cityName: "China",
    title: "Your first China chapter",
    location: "Shanghai · Hangzhou · Shanghai",
    duration: "10 days · 9 nights · dates to confirm",
    heroImage: photos.bund,
    overview: [
      { icon: "🧳", label: "10 days · 9 nights · solo" },
      { icon: "🛍️", label: "Food & shopping, at your pace" },
      { icon: "💼", label: "A day reserved for suppliers" },
      { icon: "🍃", label: "2 nights in Hangzhou" },
      { icon: "€", label: `${budgetTotal} planning estimate` },
    ],
    meiGreeting: "Your first China trip should feel like you: a great meal, an unexpected shop, a drink if the mood takes you, and space for your supplier visits. Here is a first draft we can shape together.",
    departure: {
      time: "Day 10 · timed to your flight",
      title: "Homeward, with a little extra in your suitcase",
      description: "Return to your confirmed Shanghai airport. Pudong is the working assumption; the airport, terminal and pickup time will be set once your flight is known. Keep the final morning open if you have an early departure.",
    },
    departureNote: "This is a proposed itinerary. Dates, hotels, tickets, supplier appointments and transfers are still to be confirmed; nothing has been booked.",
    picks: [],
    days: [
      day(1, "Shanghai", "Arrive, settle in & find your first favourite street", [
        item("arrival", "On arrival", "Welcome to Shanghai", "Take the first day gently after your journey from France. Once your airport and arrival time are known, choose a taxi or rail connection that works with your luggage. The afternoon below is optional if you land late.", { icon: Plane, type: "transport", iconBg: "#E3F2FD", previewLine: "Airport and transfer to confirm with your flights" }),
        item("hotel", "After arrival", "Your Shanghai base · nights 1–5", "Look for a hotel in Jing’an or Xuhui, close to the streets you will explore. Allow €80–150 per night for your own room. Hotel choice, luggage storage and early check-in depend on your dates and availability.", { icon: Hotel, type: "hotel", iconBg: "#E3F2FD" }),
        item("first-walk", "Afternoon · flexible", "Wukang Road → Anfu Road", "Ease into the city with a short wander, a coffee and time to stop whenever a shop catches your eye. No shopping mission today: just start a little list of places you want to return to.", { icon: Coffee, image: photos.wukang, previewLine: "A gentle first taste of Shanghai’s neighbourhood streets", tip: "Keep this to one neighbourhood. A nap is a perfectly good alternative after a long flight." }),
        meal("first-dinner", "Early evening", "Your first Shanghainese supper", "Try soup dumplings or pan-fried shengjian buns, with a vegetable dish or light soup. Pick somewhere near your hotel tonight; the longer food explorations can wait until you have slept."),
        item("first-night", "After dinner · optional", "One drink, or straight to bed", "If you still have energy, stop at a relaxed neighbourhood wine bar. There is no pressure to make the first night a late one.", { icon: Moon, iconBg: "#EDE7F6" }),
      ]),
      day(2, "Shanghai", "Big-name shopping, smaller discoveries & an easy night out", [
        item("flagships", "Late morning", "West Nanjing Road & Zhangyuan", "Start with the flagships around HKRI Taikoo Hui or Plaza 66, then explore Zhangyuan’s restored shikumen lanes. Make this a browse-first morning: compare the pieces you like before committing to your bigger purchases.", { icon: ShoppingBag, image: photos.shopping, previewLine: "Flagships around West Nanjing Road · then Zhangyuan" }),
        meal("shopping-lunch", "Lunch", "Sit down, recharge, compare your finds", "Take a proper lunch break around West Nanjing Road. A Cantonese meal or a simple noodle bowl keeps the afternoon flexible; choose according to your appetite rather than a fixed restaurant reservation."),
        item("independent-shops", "Afternoon", "Julu Road & Fumin Road", "Switch to independent fashion, smaller boutiques and café stops. Save photos and shop locations so your last Shanghai day can be about returning to the things you actually loved.", { icon: ShoppingBag, previewLine: "An afternoon for your own taste, with room to linger" }),
        meal("d2-dinner", "Evening", "A Shanghai comfort-food dinner", "Order a small selection: shengjian buns, scallion-oil noodles or a shared-style dish in a single-person portion where available. We will refine the food stops around any dietary preferences."),
        item("nightlife", "After dinner · optional", "Xintiandi, on your terms", "Choose a wine bar or live-music venue for an easy evening. A good seat and one drink can be the whole plan; performance schedules and reservations can be checked when your dates are set.", { icon: Moon, image: photos.evening, iconBg: "#EDE7F6", previewLine: "A relaxed evening, with an easy exit whenever you like" }),
      ]),
      day(3, "Shanghai", "Space for your suppliers", [
        item("meeting-prep", "Morning", "Coffee & a little meeting prep", "Keep breakfast close to your hotel and gather your product references, questions and any samples you want to discuss. Meeting addresses will determine today’s route.", { icon: Coffee }),
        item("suppliers", "Daytime · protected", "Your supplier appointments", "This day is reserved for the business side of your trip. We still need your product category, supplier locations and the number of meetings. Shanghai is only a placeholder base: if your suppliers are in another city, we will adjust the route before booking transport or hotels.", { icon: BriefcaseBusiness, iconBg: "#E8EDF8", previewLine: "Locations, industry and appointments to confirm", tip: "Any interpreter, factory visit, samples, shipping or additional business transport would need a separate quote." }),
        meal("meeting-lunch", "Between appointments", "Lunch wherever the day takes you", "Leave this stop flexible. Once the meeting locations are known, choose a nearby noodle shop or café so there is no cross-city detour in the middle of your working day."),
        meal("meeting-dinner", "Evening", "An easy dinner & time to decompress", "If your final meeting is nearby, explore the food options around Dingxi Road. Otherwise stay close to your hotel, make notes while the conversations are fresh, and leave the rest of the evening free."),
      ]),
      day(4, "Shanghai", "Old Shanghai & your first Bund sunset", [
        item("yugarden", "Morning", "Yu Garden & the old town", "Spend the morning in a classical Chinese garden, then wander the surrounding old-town area. The visiting day and entry arrangements will be checked once your dates are fixed.", { icon: Camera, image: photos.garden, previewLine: "Garden details, old-town lanes & a slower morning" }),
        meal("oldtown-lunch", "Lunch", "Soup dumplings, slowly", "Make time for a seated dumpling lunch rather than eating everything on the move. Add a small side dish and tea, and leave room for something sweet later."),
        item("bund", "Late afternoon", "Rockbund → the Bund", "Head towards Rockbund, then walk to the waterfront as the light changes. This is your unhurried skyline moment: take photos, find a place to pause and watch the city turn into evening.", { icon: Camera, image: photos.bund, previewLine: "One of the trip’s big views, with time to enjoy it" }),
        meal("bund-dinner", "Evening", "A dinner worth lingering over", "Choose a Shanghainese or Zhejiang-style restaurant around the riverfront. A rooftop drink afterwards is optional; prices and any minimum spend should be checked before reserving."),
      ]),
      day(5, "Shanghai", "Shopping with a purpose, or a second business window", [
        item("shopping-choice", "Morning", "Choose your shopping mood", "If clothing markets interest you, explore Qipu Road. If you prefer a slower neighbourhood day, try Gubei for cafés, browsing and a long lunch. We will choose once we know whether your style is designer, vintage, independent labels or bargains.", { icon: ShoppingBag, previewLine: "Clothing-market browsing or a relaxed Gubei day", tip: "A market browse is separate from a confirmed supplier or factory appointment." }),
        meal("gubei-lunch", "Lunch", "A familiar flavour, if you fancy it", "A French bistro or Japanese lunch in Gubei makes a change of pace. Or stay with Chinese food if there is something you have been wanting to try."),
        item("flex-window", "Afternoon", "Keep a little room in the plan", "Return to a favourite shop, follow up with a supplier or rest at your hotel. If a second meeting day is needed, this is the easiest Shanghai block to swap before your Hangzhou break.", { icon: BriefcaseBusiness, iconBg: "#E8EDF8" }),
        item("pack-hangzhou", "Evening", "A quiet night before Hangzhou", "Enjoy dinner near your hotel and pack for two nights away. Ask whether your Shanghai hotel can store larger shopping bags if you return to the same property; confirm this directly before relying on it.", { icon: Moon, iconBg: "#EDE7F6" }),
      ]),
      day(6, "Hangzhou", "Shanghai → Hangzhou · trade the skyline for the lake", [
        item("train-out", "Morning", "Train to Hangzhou", "Travel from Shanghai Hongqiao to Hangzhou East on a suitable high-speed service. Allow roughly 1–1½ hours on the train as a planning estimate, plus station time and transfers. The exact train will follow your dates.", { icon: TrainFront, type: "transport", iconBg: "#E3F2FD", previewLine: "High-speed rail · service and tickets to confirm" }),
        item("hangzhou-hotel", "Late morning", "Your lakeside base · nights 6–7", "Choose a hotel with convenient access to West Lake, allowing €80–150 per night. Drop your bags if the room is not ready, then ease into a different pace.", { icon: Hotel, type: "hotel", iconBg: "#E3F2FD" }),
        meal("hangzhou-noodles", "Lunch", "A bowl of pian’er chuan", "Try Hangzhou’s noodle soup with preserved greens, bamboo shoots and pork, if it suits your diet. Ask for an alternative if needed; this is a simple first lunch before the lake."),
        item("westlake", "Afternoon", "West Lake’s quieter western side", "Explore part of the Yanggong Causeway, Yuhu Bay or Maojiabu area. Choose a manageable stretch with time for tea; an optional boat ride depends on the weather, availability and the price offered on the day.", { image: photos.lake, previewLine: "Water, gardens and time to slow down" }),
        meal("lake-dinner", "Evening", "Sunset, then a Hangzhou supper", "If the weather cooperates, linger near Su Causeway before dinner. Try Dongpo pork with vegetables or another local dish close to your hotel, then call it a night whenever you like."),
      ]),
      day(7, "Hangzhou", "A temple morning & tea in the hills", [
        item("lingyin", "Morning", "Lingyin & its wooded surroundings", "Spend the morning around Lingyin Temple and the surrounding scenic area. Confirm current reservation and access requirements for your travel date. Keep Faxi Temple as an alternative if you would prefer a different temple visit.", { icon: Camera, image: photos.temple, previewLine: "A temple visit with time to pause" }),
        meal("tea-lunch", "Lunch", "A village lunch around Longjing", "Choose a small restaurant in the Longjing area for a vegetable-led lunch with seasonal dishes. Ask what is available and agree the price before ordering tea or a tasting."),
        item("longjing", "Afternoon", "Longjing tea village", "Walk a comfortable stretch around the tea-growing area and sit down for a pot of tea. If you find something you love, buy a small amount for home; tea purchases are part of your separate shopping budget.", { icon: Coffee, image: photos.tea, previewLine: "Tea, a village walk & a slower afternoon", tip: "Tea harvesting is seasonal. A tea-field visit does not automatically include a picking experience." }),
        item("hefang", "Evening · optional", "Hefang Street, or an early night", "If you feel like another wander, browse Hefang Street for snacks and small gifts. Otherwise stay near the lake for dinner. Shopping at Hangzhou Tower or MixC can replace this block if you prefer indoor browsing.", { icon: Moon, image: photos.hefang, iconBg: "#EDE7F6", previewLine: "A flexible evening to match your energy" }),
      ]),
      day(8, "Shanghai", "Back to Shanghai & a skyline evening", [
        item("train-back", "Morning", "A last breakfast, then back to Shanghai", "Check out and return by train to Shanghai Hongqiao. Leave time for the station transfer and choose the service after your dates are fixed. Return to your Shanghai hotel before making afternoon plans.", { icon: TrainFront, type: "transport", iconBg: "#E3F2FD", previewLine: "Hangzhou East → Shanghai Hongqiao · train to confirm" }),
        item("return-hotel", "Afternoon", "Check in & put your bags down · nights 8–9", "Returning to the same Shanghai hotel can make the final two nights feel easy. Collect any stored bags, take a break and decide whether you want to head out for the skyline this evening.", { icon: Hotel, type: "hotel", iconBg: "#E3F2FD" }),
        item("tower", "Late afternoon · optional", "Shanghai from above", "If visibility looks promising, consider the Shanghai Tower observation deck. Confirm tickets and the price before booking. A free riverside walk is an easy alternative if you would rather save the experience allowance for something else.", { icon: Camera, previewLine: "Optional observation deck, subject to visibility and tickets" }),
        meal("pudong-dinner", "Evening", "Dinner in Lujiazui", "If you go to the tower, keep dinner nearby around IFC before returning to your hotel. If you skip it, make tonight a relaxed neighbourhood meal instead."),
      ]),
      day(9, "Shanghai", "The things you loved, one more time", [
        item("last-shopping", "Morning & afternoon", "Your personal shopping shortlist", "Revisit the shops you saved earlier, or choose Taikoo Li Qiantan for a fresh shopping area. If outlet shopping is your priority, swap this block for a dedicated trip to Bailian Qingpu Outlets; allow for the extra journey instead of treating it as a quick stop on the Hangzhou train route.", { icon: ShoppingBag, previewLine: "Favourite finds, a new shopping area or an outlet half-day" }),
        meal("last-lunch", "Lunch", "Your favourite dish gets an encore", "By now you will know what you want more of. Return for the dumplings, noodles or meal you kept thinking about, and leave space for one final café stop."),
        item("souvenirs", "Late afternoon", "Small things to take home", "Pick up White Rabbit sweets, tea or a carefully chosen silk item. Keep receipts, compare quality and leave room in your luggage; personal purchases are separate from the trip estimate.", { icon: ShoppingBag }),
        meal("farewell", "Evening", "A farewell dinner that feels like you", "Choose a restaurant you are excited about, then take a final Bund walk or revisit a favourite bar. A Huangpu cruise is an optional alternative, with the operator, sailing and any meal inclusion checked before booking."),
      ]),
      day(10, "Shanghai", "One last breakfast & homeward", [
        meal("last-breakfast", "Before checkout", "Breakfast & a gentle finish", "If your flight allows, enjoy breakfast before packing the last few things. Keep today free of must-do activities so your departure can stay simple."),
        item("checkout", "Timed to your flight", "Check out & leave time for the airport", "Confirm the correct airport and terminal, then choose a transfer that works with your bags. Plan to reach the airport according to your airline’s international check-in guidance, with extra time for traffic.", { icon: Plane, type: "transport", iconBg: "#E3F2FD", previewLine: "Pickup time and airport to confirm" }),
      ]),
    ],
  };
}
