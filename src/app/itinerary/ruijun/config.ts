import { Bus, Camera, Coffee, Footprints, Hotel, Moon, Plane, ShoppingBag, Theater, TrainFront, Utensils } from "lucide-react";
import type { ItineraryConfig } from "../ItineraryPage";

type Item = ItineraryConfig["days"][number]["items"][number];
type Day = ItineraryConfig["days"][number];
type TransportLeg = NonNullable<Item["transportAfter"]> & { duration: string };

export const photos = {
  lake: "/uploads/itinerary/xhs/lake.webp",
  temple: "/uploads/itinerary/xhs/temple.webp",
  hefang: "/uploads/itinerary/xhs/hefang.webp",
  garden: "/uploads/itinerary/xhs/garden.webp",
  wukang: "/uploads/itinerary/xhs/wukang.webp",
  xintiandi: "/uploads/itinerary/xhs/evening.webp",
  huaihai: "/uploads/itinerary/vivek/huaihai-road.webp",
  qipao: "/uploads/itinerary/ruijun/qipao.webp",
  northBund: "/uploads/itinerary/ruijun/north-bund.webp",
  silk: "/uploads/itinerary/ruijun/silk-town.webp",
  feilai: "/uploads/itinerary/ruijun/feilai.webp",
  era: "/uploads/itinerary/ruijun/era.webp",
};

const secondPhotos: Record<string, string> = {
  [photos.lake]: "/uploads/itinerary/hangzhou/westlake2.jpg",
  [photos.temple]: "/uploads/itinerary/ruijun/temple-2.webp",
  [photos.hefang]: "/uploads/itinerary/hangzhou/hefang2.jpg",
  [photos.garden]: "/uploads/itinerary/shanghai/scraper/yugarden-bridge.jpg",
  [photos.wukang]: "/uploads/itinerary/ruijun/wukang-2.webp",
  [photos.xintiandi]: "/uploads/itinerary/vivek/xintiandi.webp",
  [photos.northBund]: "/uploads/itinerary/ruijun/north-bund-2.webp",
  [photos.silk]: "/uploads/itinerary/ruijun/silk-2.webp",
  [photos.feilai]: "/uploads/itinerary/ruijun/feilai-2.webp",
  [photos.era]: "/uploads/itinerary/ruijun/era-2.webp",
};

export const dietaryNote = "No meat, seafood, alliums or gelatine — including stocks, sauces, fillings and desserts. Eggs and dairy are fine. Each restaurant must confirm these requirements before the meal.";

export const trains = [
  { date: "10 Oct · Saturday", number: "G1509", from: "Shanghai Hongqiao", to: "Hangzhou East", departure: "08:32", arrival: "09:31", note: "After the 05:00 arrival at Pudong. Check train-change options promptly if immigration or the flight is delayed." },
  { date: "12 Oct · Monday", number: "G204", from: "Hangzhou East", to: "Shanghai Hongqiao", departure: "14:22", arrival: "15:09", note: "Collect luggage after lunch and aim to reach Hangzhou East by 13:20." },
];

export const daySummaries = [
  { date: "10 Oct · Sat", title: "Arrive & ease into Hangzhou", detail: "Pudong → G1509 → SkyBird Hotel. Optional silk shopping and a short old-street walk." },
  { date: "11 Oct · Sun", title: "Temple carvings & the lake", detail: "Shuttle via Xixi Road 608, a shorter Feilai Peak–Lingyin route and a relaxed Hubin stroll." },
  { date: "12 Oct · Mon", title: "A slow morning, then Shanghai", detail: "Early lunch, G204 at 14:22, Demores Hotel and optional Xintiandi browsing." },
  { date: "13 Oct · Tue", title: "Yu Garden & the North Bund", detail: "A garden morning, vegetarian favourites and a short evening skyline walk." },
  { date: "14 Oct · Wed", title: "Wukang Road & time to shop", detail: "Cafés, Huaihai Road and a hotel break. Optional evening: choose ERA or The Phantom of the Opera." },
  { date: "15 Oct · Thu", title: "A comfortable journey home", detail: "Leave the hotel around 07:00; aim for Pudong at 08:30 for the 11:30 flight." },
];

const transfers: Record<string, TransportLeg> = {
  pudong: { mode: "train", duration: "~60–90 min", note: "Airport Link Line: Pudong → Hongqiao T2. About 40 min on the train, plus waiting and walking to the railway station. Allow extra for immigration, baggage and railway security." },
  g1509: { mode: "taxi", duration: "~30–50 min", note: "Hangzhou East station → SkyBird Hotel for luggage drop and rest." },
  skybird: { mode: "taxi", duration: "~15–25 min", note: "SkyBird Hotel → Qingchun Li at Kerry Centre; a taxi saves walking after the flight." },
  "qingchun-li": { mode: "taxi", duration: "~10–20 min", note: "Optional: Kerry Centre → China Silk Town. Return to the hotel instead if tired." },
  "silk-town": { mode: "taxi", duration: "~15–30 min", note: "China Silk Town → Southern Song Imperial Street / Hefang Street. Time is for the direct ride; add time for a hotel break if needed." },
  "hefang-first": { mode: "taxi", duration: "~10–20 min", note: "Old streets → Su Man Xiang Pro at Hubin Yintai IN77, if dinner is confirmed." },
  sumanxiang: { mode: "taxi", duration: "~10–20 min", note: "After dinner → SkyBird Hotel." },
  "temple-start": { mode: "taxi", duration: "~35–55 min", note: "SkyBird Hotel → Xixi Road 608 transfer point. Then take the Lingyin shuttle; Sunday restrictions prevent a direct taxi to the scenic area." },
  "temple-transfer": { mode: "walk", duration: "~15–25 min", note: "Shuttle drop-off → Lingyin–Feilai Peak entrance → lower carvings; allow extra for entry queues and checks." },
  feilai: { mode: "walk", duration: "~10–15 min", note: "Lower carvings beside Cold Spring Stream → Lingyin’s Hall of Heavenly Kings; take breaks on uneven paths." },
  lingyin: { mode: "walk", duration: "~15–25 min", note: "Follow the exit signs towards optional Zhi Zhu; skip the sweet-soup stop and go to lunch if tired." },
  zhizhu: { mode: "walk", duration: "~5–15 min", note: "Zhi Zhu → Qingchun Perma for lunch; check the walking route locally before setting off." },
  "qingchun-perma": { mode: "shuttle", duration: "~45–75 min", note: "Take the available shuttle / public transport out, then continue to Hubin. Ask restaurant or transport staff for the departure stop." },
  "west-lake": { mode: "taxi", duration: "~10–20 min", note: "Hubin lakeside → Yi Jia Su, Jiefang Road, for dinner around 17:00–17:30." },
  "yi-jia-su": { mode: "taxi", duration: "~10–15 min", note: "Dinner → SkyBird Hotel. If choosing the optional lake show, confirm the performance and dinner-to-show route first." },
  "hangzhou-show": { mode: "taxi", duration: "~20–40 min", note: "If attending the show: venue → SkyBird Hotel afterwards." },
  "hangzhou-start": { mode: "walk", duration: "~10–15 min", note: "SkyBird Hotel → nearby Hefang Street / Southern Song Imperial Street. A qipao collection at another shop may need a taxi; confirm its location first." },
  "hangzhou-morning": { mode: "taxi", duration: "~15–30 min", note: "Morning browsing → Qingchun Shitang for lunch around 11:00; confirm the restaurant branch before pickup." },
  "qingchun-shitang": { mode: "taxi", duration: "~45–75 min", note: "Lunch → SkyBird Hotel to collect luggage → Hangzhou East station, including a brief luggage pickup. Confirm the lunch branch; aim to arrive by 13:20 for G204 at 14:22." },
  g204: { mode: "metro", duration: "~45–60 min", note: "Line 10: Hongqiao Railway Station → Laoximen, then walk to Demores Hotel. Estimate includes station access and waiting; taxi alternative about 35–60 min." },
  demores: { mode: "taxi", duration: "~10–20 min", note: "Demores Hotel → Ruo Wu Liang Du C for dinner; confirm the restaurant address with the reservation." },
  breeze: { mode: "taxi", duration: "~10–15 min", note: "Optional: dinner → Xintiandi by a short ride, or walk if comfortable. Otherwise return to Demores Hotel." },
  xintiandi: { mode: "taxi", duration: "~10–20 min", note: "Xintiandi → Demores Hotel when everyone is ready." },
  "garden-start": { mode: "metro", duration: "~20–30 min", note: "Line 10: Laoximen → Yuyuan Garden, including station and entrance walks. Taxi from Demores Hotel: about 10–20 min." },
  "yu-garden": { mode: "walk", duration: "~5–10 min", note: "Garden / bazaar area → Chunfeng Songyue Lou for lunch; keep any qipao browsing within this area." },
  songyue: { mode: "metro", duration: "~25–40 min", note: "Yu Garden area → People’s Square / Nanjing Road; check the metro connection before setting off." },
  "peoples-square": { mode: "taxi", duration: "~10–20 min", note: "Shopping / café stop → Gong De Lin on West Nanjing Road; use a taxi if everyone has had enough walking." },
  gongdelin: { mode: "taxi", duration: "~20–35 min", note: "After dinner and optional East Nanjing Road browsing → North Bund, near the International Cruise Terminal / White Magnolia Plaza." },
  "north-bund": { mode: "taxi", duration: "~20–35 min", note: "North Bund waterfront → Demores Hotel. The fabric-market card below is a separate morning alternative." },
  "fabric-alternative": { mode: "taxi", duration: "~10–20 min", note: "Alternative morning route only: South Bund Fabric Market → Songyue Lou for lunch. Afterwards, allow a further 5–10 min walk to the Yu Garden area." },
  "wukang-start": { mode: "metro", duration: "~30–45 min", note: "Line 10: Laoximen → Shanghai Library, including the walk towards Wukang Road. Taxi directly to Wukang Mansion: about 20–35 min." },
  wukang: { mode: "taxi", duration: "~20–35 min", note: "Wukang / Anfu Road → Linhu Vegetarian at Poly Time for lunch; metro is another option." },
  linhu: { mode: "taxi", duration: "~20–35 min", note: "Poly Time → your chosen Huaihai Road shopping stop; use a short ride to save energy." },
  huaihai: { mode: "taxi", duration: "~15–30 min", note: "Huaihai Road / Maoming South Road / Changle Road → Demores Hotel for rest and packing." },
  rest: { mode: "walk", duration: "~20–30 min", note: "Demores Hotel → Hui Yuan Vegetarian at Huaihai Road Food Court. Taxi alternative: about 5–15 min." },
  huiyuan: { mode: "taxi", duration: "~15–45 min", note: "Choose one: ERA at Shanghai Circus World, about 30–45 min by taxi; Phantom at Shanghai Grand Theatre, about 15–25 min. Allow extra for admission. Metro to ERA: roughly 40–55 min including walks and waiting." },
  era: { mode: "taxi", duration: "~25–45 min", note: "After ERA: Shanghai Circus World → Demores Hotel. Phantom below is the alternative show, not the next stop." },
  phantom: { mode: "taxi", duration: "~15–25 min", note: "After Phantom: Shanghai Grand Theatre → Demores Hotel for rest before the morning airport transfer." },
  "breakfast-home": { mode: "car", duration: "~60–90 min", note: "Taxi / arranged car: Demores Hotel → Pudong Airport. Leave around 07:00; target arrival 08:30 for the 11:30 flight." },
};

function stop(id: string, time: string, title: string, description: string, options: Partial<Omit<Item, "id" | "time" | "title" | "description">> = {}): Item {
  const previewImages = options.previewImages ?? (options.image
    ? [options.image, secondPhotos[options.image]].filter(Boolean)
    : undefined);
  return { id: `ruijun-${id}`, time, title, description, icon: Footprints, iconBg: "#FFF0EE", type: "activity", transportAfter: transfers[id], ...options, previewImages };
}

function meal(id: string, time: string, title: string, chinese: string, description: string): Item {
  return stop(id, time, title, description, { type: "meal", icon: Utensils, subtitle: `${chinese} · reservation pending`, tip: dietaryNote });
}

function day(index: number, city: string, items: Item[]): Day {
  const summary = daySummaries[index - 1];
  return { label: `Day ${index}`, city, subtitle: `${summary.date} · ${summary.title}`, color: city === "Hangzhou" ? "#537466" : "#C23845", items };
}

export function buildRuijunConfig(): ItineraryConfig {
  return {
    cityName: "China", title: "Hangzhou & Shanghai", location: "Hangzhou · Shanghai", duration: "10–15 October 2026 · 6 days · 5 nights",
    heroImage: photos.lake,
    overview: [
      { icon: "🗓️", label: "10–15 October 2026" },
      { icon: "👨‍👩‍👧", label: "Ruijun & parents · 3 travellers" },
      { icon: "🚄", label: "G1509 & G204 booked" },
      { icon: "🌿", label: "Vegetarian · no alliums" },
      { icon: "☕", label: "Short walks & regular rests" },
    ],
    meiGreeting: "Ruijun, this trip leaves room to enjoy the little things together: a quiet temple courtyard, a warm dessert, a qipao that catches your eye. Shorter walks, seated breaks and easy taxi options keep each day comfortable for you and your parents.",
    departure: { time: "15 October · flight at 11:30", title: "Depart from Shanghai Pudong", description: "Leave Demores Hotel by taxi or arranged car around 07:00. Aim to reach Shanghai Pudong Airport around 08:30 for your 11:30 flight, allowing for morning traffic. Confirm your terminal and car arrangements before departure." },
    departureNote: "Arrange a simple breakfast the night before if needed. Keep the morning clear for the airport journey.",
    picks: [],
    days: [
      day(1, "Hangzhou", [
        stop("pudong", "05:00 · arrival", "Land at Shanghai Pudong", "After immigration and baggage collection, head straight to Shanghai Hongqiao Railway Station. Take the Airport Link Line to Hongqiao Terminal 2, then follow the signs to the railway station. Allow time for walking and railway security. A taxi is an alternative depending on traffic.", { icon: Plane, type: "transport", iconBg: "#E3F2FD", previewLine: "Pudong Airport → Hongqiao Terminal 2 → railway station" }),
        stop("g1509", "08:32 → 09:31 · booked", "G1509 · Shanghai Hongqiao → Hangzhou East", "Your booked train leaves Shanghai Hongqiao at 08:32 and reaches Hangzhou East at 09:31. If the flight or immigration is delayed, check train-change options promptly.", { icon: TrainFront, type: "transport", iconBg: "#E3F2FD", previewLine: "G1509 · departs 08:32 · arrives 09:31 · booked" }),
        stop("skybird", "After the train", "SkyBird Hotel · luggage drop & rest", "Take a taxi to SkyBird Hotel and drop off your luggage. Early check-in depends on room availability. This is your Hangzhou base for the nights of 10 and 11 October; breakfast is included.", { icon: Hotel, subtitle: "Hangzhou · 2 nights · breakfast included", iconBg: "#E3F2FD" }),
        meal("qingchun-li", "From 11:00 · lunch", "Qingchun Li · Kerry Centre", "庆春里·嘉里中心店", "Have an early lunch after your journey. Ask which osmanthus desserts are available and whether they can be served warm; check the ingredients before ordering."),
        stop("silk-town", "Afternoon · optional", "Hangzhou China Silk Town", "If everyone feels rested, enjoy some light qipao and silk shopping at 中国丝绸城. Otherwise take a longer hotel break or a short nearby walk. Shanghai offers more chances to browse, so there is no need to decide today.", { icon: ShoppingBag, image: photos.silk, previewLine: "Light qipao browsing, only if everyone feels rested", tip: "Agree any alteration and collection dates directly with the shop before placing an order." }),
        stop("hefang-first", "Early evening", "Southern Song Imperial Street & Hefang Street", "Explore a short section of the old streets, with plenty of flexibility after the early flight. Keep the walk brief and return to the hotel whenever you are ready.", { image: photos.hefang, previewLine: "A little evening atmosphere · keep the walk short" }),
        meal("sumanxiang", "Dinner · candidate", "Su Man Xiang Pro · Hubin Yintai IN77", "素满香Pro·湖滨银泰IN77店", "This dinner candidate is still to be confirmed. Keep the meal time flexible and confirm the restaurant’s suitability for your dietary requirements before reserving."),
      ]),
      day(2, "Hangzhou", [
        stop("temple-start", "After breakfast · leave around 08:00", "Leave SkyBird Hotel for the Lingyin transfer point", "Have breakfast at the hotel, then take a taxi to Xixi Road 608 transfer point (西溪路608号换乘点). Allow roughly 35–55 minutes for the taxi, with extra time if Sunday traffic is heavy.", { icon: Hotel, type: "hotel", iconBg: "#E3F2FD" }),
        stop("temple-transfer", "Shuttle ride · approximately 15–25 min", "Shuttle from Xixi Road 608 to Lingyin", "At Xixi Road 608 transfer point (西溪路608号换乘点), follow signs for the Lingyin shuttle. Allow roughly 15–25 minutes on the bus, plus queueing time. Sunday daytime restrictions mean taxis cannot drive directly into the area. After getting off, follow signs for the Lingyin–Feilai Peak scenic area entrance (灵隐飞来峰景区入口). There is still a walk to the entrance, so allow extra time for entry checks.", { icon: Bus, type: "transport", iconBg: "#E3F2FD", previewLine: "Shuttle ~15–25 min → walk ~15–25 min · queues extra", tip: "All three travellers need advance reservations for Lingyin–Feilai Peak, currently free to visit. Under the current rules, reservations for 11 October open at 08:00 China time on 4 October through the official ‘杭州灵隐飞来峰’ WeChat or Alipay mini programme. Choose a morning slot and bring the passports used to book." }),
        stop("feilai", "09:00–09:30 · aim to start sightseeing", "Feilai Peak’s lower rock carvings", "From the scenic area entrance, follow a shorter route past the lower Feilai Peak rock carvings beside Cold Spring Stream, then continue to Lingyin Temple. Your start time depends on traffic and queues. Some steps and uneven paths remain, so take regular breaks and adjust the distance to everyone’s comfort.", { icon: Camera, image: photos.feilai, previewLine: "Lower carvings beside Cold Spring Stream → Lingyin", tip: "Allow roughly 2–2.5 hours for the whole Feilai Peak and Lingyin visit, including rest stops." }),
        stop("lingyin", "Morning · after the carvings", "Lingyin Temple", "Visit the Hall of Heavenly Kings (天王殿), then the Grand Hall (大雄宝殿), at an easy pace. Take breaks on the steps and uneven paths. Finish the temple visit here if your parents have had enough walking, then follow the signs to the exit.", { image: photos.temple, previewLine: "Hall of Heavenly Kings → Grand Hall → exit" }),
        meal("zhizhu", "Before lunch · optional", "Zhi Zhu · a sweet-soup break", "知竹", "Consider a short rest and a peach-gum and honey-locust-seed sweet soup to share. Check the ingredients, and skip this stop if there is a queue or you would rather head straight to lunch."),
        meal("qingchun-perma", "Lunch", "Qingchun Perma", "庆春朴门", "Enjoy lunch followed by time to rest. Afterwards use the available shuttle or public transport connection out of the area, then continue to West Lake’s eastern lakeside around Hubin (湖滨). Check the departure stop with the restaurant or transport staff before setting off."),
        stop("west-lake", "Afternoon", "West Lake · an easy Hubin stroll", "Enjoy a short walk along the eastern lakeside and a seated tea or coffee break. A boat ride is optional, depending on the weather, available services and everyone’s energy.", { icon: Coffee, image: photos.lake, previewLine: "Short lakeside walk · seated break · optional boat ride" }),
        meal("yi-jia-su", "17:00–17:30 · dinner", "Yi Jia Su · Jiefang Road", "一家素·解放路店", "Take a taxi from the lakeside to save walking. Have an early dinner, then return to SkyBird Hotel for a relaxed evening."),
        stop("hangzhou-show", "Evening · optional", "Enduring Memories of Hangzhou", "《最忆是杭州》 can be considered if you feel up to it. The performance time, tickets and dinner route need to be confirmed before this is added; a restful evening at the hotel remains the main plan.", { icon: Theater, subtitle: "Optional · performance and tickets to confirm", iconBg: "#EDE7F6" }),
      ]),
      day(3, "Shanghai", [
        stop("hangzhou-start", "After breakfast · hotel departure", "Check out & leave luggage at SkyBird Hotel", "Have breakfast, check out and leave your luggage with the hotel before your relaxed morning. Return for the bags after lunch.", { icon: Hotel, type: "hotel", iconBg: "#E3F2FD" }),
        stop("hangzhou-morning", "After breakfast", "A relaxed last morning in Hangzhou", "Keep the morning easy around Hefang Street or Southern Song Imperial Street, or collect qipao alterations only if the shop has confirmed they are ready. Check out and leave your luggage with the hotel.", { image: photos.hefang, previewLine: "Gentle browsing or a confirmed qipao collection" }),
        meal("qingchun-shitang", "Around 11:00 · early lunch", "Qingchun Shitang", "庆春食堂", "Have an early lunch, then collect your luggage and take a taxi to Hangzhou East Railway Station. Aim to reach the station by 13:20."),
        stop("g204", "14:22 → 15:09 · booked", "G204 · Hangzhou East → Shanghai Hongqiao", "Your booked train leaves Hangzhou East at 14:22 and arrives at Shanghai Hongqiao at 15:09. Keep the lunch and hotel pickup comfortably ahead of your 13:20 station-arrival target.", { icon: TrainFront, type: "transport", iconBg: "#E3F2FD", previewLine: "G204 · departs 14:22 · arrives 15:09 · booked" }),
        stop("demores", "After arrival", "Demores Hotel · check in & rest", "Take a taxi to Demores Hotel at 1465 Zhonghua Road (中华路1465号). Alternatively, Metro Line 10 runs directly from Hongqiao Railway Station to Laoximen, near the hotel. Check in and have a proper rest. Shanghai breakfast inclusion and suitable options still need confirmation.", { icon: Hotel, subtitle: "1465 Zhonghua Road · 中华路1465号", iconBg: "#E3F2FD" }),
        meal("breeze", "Dinner", "Ruo Wu Liang Du C · Breeze Two Degrees", "若无两度C", "Keep dinner unhurried after the train journey. The restaurant reservation and dietary arrangements are pending."),
        stop("xintiandi", "After dinner · optional", "A little evening browsing in Xintiandi", "Take a short ride or walk towards Xintiandi, depending on your parents’ energy. Browse a small area, then return to the hotel when you feel ready.", { icon: Moon, image: photos.xintiandi, previewLine: "A short evening outing, if everyone feels comfortable", iconBg: "#EDE7F6" }),
      ]),
      day(4, "Shanghai", [
        stop("garden-start", "After breakfast · hotel departure", "Leave Demores Hotel for Yu Garden", "Choose Metro Line 10 from Laoximen or a taxi to the garden, depending on everyone’s energy.", { icon: Hotel, type: "hotel", iconBg: "#E3F2FD" }),
        stop("yu-garden", "Morning", "Yu Garden & the Nine-Turn Bridge area", "After breakfast, take a taxi or Metro Line 10 from Laoximen to Yuyuan Garden. Visit the garden, then explore a short section of the bazaar and Nine-Turn Bridge area. If qipao browsing appeals, allow 45–60 minutes in the surrounding shops in place of some general browsing.", { icon: Camera, image: photos.garden, previewLine: "Garden details, a short bazaar walk & optional qipao browsing" }),
        meal("songyue", "Lunch", "Chunfeng Songyue Lou", "春风松月楼", "Have a simple vegetarian noodle lunch. Confirm the broth, toppings and seasonings meet your requirements before ordering."),
        stop("peoples-square", "Afternoon", "People’s Square & Nanjing Road", "Continue by metro to People’s Square and Nanjing Road. Keep time for a seated café break and shorten the shopping if everyone would prefer a slower afternoon.", { icon: ShoppingBag, previewLine: "Browse a little, then sit down for a café break" }),
        meal("gongdelin", "Around 17:00 · early dinner", "Gong De Lin · West Nanjing Road", "功德林·南京西路店", "Enjoy an early vegetarian dinner. Afterwards, have a short look around East Nanjing Road only if you feel up to it."),
        stop("north-bund", "Evening", "North Bund waterfront", "Take a taxi to the waterfront near the International Cruise Terminal / White Magnolia Plaza. Enjoy the skyline from a short stretch of the riverside, then return to the hotel by taxi.", { icon: Camera, image: photos.northBund, previewLine: "A short skyline walk · taxi there and back" }),
        stop("fabric-alternative", "Alternative route · replaces the morning", "More qipao time at South Bund Fabric Market", "If qipao shopping becomes a priority, visit 南外滩轻纺面料市场 in the morning instead. Take a taxi to Songyue Lou for lunch and visit Yu Garden in the afternoon, shortening or skipping People’s Square. The market focuses on tailoring, with some ready-made pieces; agree any alteration or collection date with the shop.", { icon: ShoppingBag, subtitle: "An alternative, not an additional stop", tip: "Choose this route before setting off so the day stays comfortable." }),
      ]),
      day(5, "Shanghai", [
        stop("wukang-start", "After breakfast · hotel departure", "Leave Demores Hotel for Wukang Road", "Take Metro Line 10 towards Shanghai Library, or a taxi directly to Wukang Mansion to save walking.", { icon: Hotel, type: "hotel", iconBg: "#E3F2FD" }),
        stop("wukang", "After breakfast", "Wukang Mansion & Wukang Road", "Take Metro Line 10 to Shanghai Library or a taxi to Wukang Mansion. Enjoy a gentle walk along part of Wukang Road, with a café stop. Continue towards Anfu Road only if comfortable, and use a taxi to shorten the walk whenever needed.", { icon: Coffee, image: photos.wukang, previewLine: "Tree-lined streets, a café pause & easy taxi options" }),
        meal("linhu", "Lunch", "The Linhu Vegetarian · Poly Time", "临湖素食·保利时光里店", "Take the metro or a taxi from the Wukang Road area for lunch. This meal is subject to the restaurant confirming your dietary requirements."),
        stop("huaihai", "Early afternoon", "Huaihai Road & optional qipao browsing", "Spend the early afternoon shopping around Huaihai Road. If you have not found a qipao yet, browse nearby shops around Maoming South Road / Changle Road. Keep some energy for the return journey to the hotel.", { icon: ShoppingBag, image: photos.huaihai, previewImages: [photos.huaihai, photos.qipao], previewLine: "Shopping time, with another chance to find a qipao" }),
        stop("rest", "Later afternoon", "Back to Demores Hotel for a proper rest", "Pause at the hotel before dinner. This break is part of the day’s plan, especially if you are considering an evening show. If you choose a show, pack now so you can rest afterwards before your morning airport transfer.", { icon: Hotel, iconBg: "#E3F2FD" }),
        meal("huiyuan", "Early dinner · time to confirm", "Hui Yuan Vegetarian · Huaihai Road Food Court", "慧缘素食·淮海路美食城店", "Walk from the hotel if everyone feels comfortable, or take a short taxi ride. The dinner and departure times will be set once the optional 14 October performance and tickets are confirmed."),
        stop("era", "Optional evening · option 1 of 2 · choose one", "ERA — Journey Through Time and Space 2", "《时空之旅2》 is an acrobatic show combining dance, music and visual effects at Shanghai Circus World, 2266 Gonghexin Road. Take the metro or a taxi after dinner, allowing time for traffic and admission. Choose this show or The Phantom of the Opera. The 14 October performance and tickets still need confirmation; dinner and departure times will then be set. Take a taxi back to the hotel afterwards.", { icon: Theater, image: photos.era, subtitle: "Optional · performance and tickets to confirm", previewLine: "Shanghai Circus World · 2266 Gonghexin Road", iconBg: "#EDE7F6" }),
        stop("phantom", "Optional evening · option 2 of 2 · choose one", "The Phantom of the Opera", "《剧院魅影》, the original musical production at Shanghai Grand Theatre, 300 Renmin Avenue, is another option if you would prefer an evening of musical theatre. Choose this show or ERA. The 14 October performance and tickets still need confirmation; dinner and departure times will then be set. Take a taxi back to the hotel afterwards, with packing already done so you can rest before the morning airport transfer.", { icon: Theater, subtitle: "Optional · performance and tickets to confirm", previewLine: "Shanghai Grand Theatre · 300 Renmin Avenue", iconBg: "#EDE7F6" }),
        stop("restaurant-alternatives", "Alternative dining routes", "Two restaurant alternatives", "美悦界 at Longhua can replace Linhu for lunch if preferred. 若无 on Kangding Road is another option; it works better with West Nanjing Road shopping and would require adjusting the afternoon. These replace parts of the plan rather than adding more travel.", { icon: Utensils, subtitle: "Choose in advance · dietary confirmation required" }),
      ]),
      day(6, "Shanghai", [
        stop("breakfast-home", "Before departure", "A simple breakfast & final packing", "Arrange a simple breakfast the night before if needed. Check that passports and travel essentials are ready, then leave time to check out of Demores Hotel.", { icon: Coffee }),
        stop("airport-home", "Around 07:00 · hotel departure", "Demores Hotel → Shanghai Pudong Airport", "Leave by taxi or arranged car around 07:00. Aim to arrive at Pudong around 08:30 for the 11:30 flight, allowing for morning traffic. Confirm the terminal and pickup arrangements in advance.", { icon: Plane, type: "transport", iconBg: "#E3F2FD", previewLine: "07:00 hotel pickup · 08:30 airport target · 11:30 flight" }),
      ]),
    ],
  };
}
