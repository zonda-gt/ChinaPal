import { Camera, Car, Coffee, Footprints, Hotel, Moon, Plane, ShoppingBag, Sparkles, Sun, Sunset, TrainFront, Utensils } from "lucide-react";
import type { ItineraryConfig } from "../ItineraryPage";

/* Places, opening hours, metro exits and journey times were checked in Amap on
   21 Oct 2026. Taxi times include an allowance for traffic at the planned time.
   Photo sources: photo-sources.json. */
type Item = ItineraryConfig["days"][number]["items"][number];
const T = (name: string) => `/uploads/itinerary/doanhtu/${name}.webp`;
const R = "/uploads/itinerary/ruijun";
const HZ = "/uploads/itinerary/hangzhou";
const SH = "/uploads/itinerary/shanghai/scraper";

export const photos = {
  crystalOrange: [T("crystal-orange"), T("crystal-orange-2")],
  dahuchun: [T("dahuchun"), T("dahuchun-2")],
  expo: [T("expo"), T("expo-2")],
  tx: [T("txhuaihai"), T("txhuaihai-2"), "/uploads/itinerary/vivek/huaihai-road.webp"],
  harmay: [T("harmay"), T("harmay-2")],
  wukang: [`${R}/wukang-2.webp`, "/uploads/itinerary/xhs/wukang.webp"],
  lailai: [T("lailai"), T("lailai-2"), "/uploads/itinerary/antonio/xiaolongbao.webp"],
  train: [T("hongqiao"), T("hongqiao-2")],
  jianguo: [T("jianguo"), T("jianguo-2")],
  baima: [T("baima-lake"), T("baima-lake-2")],
  qiantang: [T("qiantang"), T("qiantang-2")],
  lingyin: [`${R}/temple-2.webp`, `${R}/feilai.webp`, `${HZ}/lingyin1.jpg`, `${R}/feilai-2.webp`, `${HZ}/lingyin2.jpg`],
  hubin: [T("hubin"), `${HZ}/westlake1.jpg`],
  boat: [T("westlake-boat"), T("westlake-boat-2"), `${HZ}/westlake2.jpg`],
  zhiwei: [T("zhiweiguan"), T("zhiweiguan-2")],
  fountain: [T("fountain"), T("fountain-2"), `${HZ}/westlake3.jpg`],
  tianzifang: [`${SH}/tianzifang-shikumen.jpg`, T("tianzifang-lipstick"), T("tianzifang-lipstick-2")],
  xintiandi: ["/uploads/itinerary/antonio/xintiandi-1.webp", "/uploads/itinerary/antonio/xintiandi-2.webp", "/uploads/itinerary/vivek/xintiandi.webp"],
  zoo: [T("redpanda"), T("redpanda-2")],
  lujiazui: [T("lujiazui-bridge"), T("lujiazui-bridge-2"), `${SH}/shanghai-tower.webp`],
  longfeng: [`${R}/recommendations/longfeng-1.webp`, `${R}/recommendations/longfeng-2.webp`, `${R}/recommendations/longfeng-3.webp`],
  northBund: [`${R}/north-bund.webp`, `${R}/north-bund-2.webp`],
  snacks: [T("hema"), T("snack-shop")],
  bund: [`${SH}/bund-skyline.jpg`, `${SH}/bund-buildings.png`, "/uploads/itinerary/xhs/bund.webp"],
};

const SHANGHAI = "#D0021B";
const HANGZHOU = "#0E7C7B";
function stop(id: string, time: string, title: string, description: string, options: Partial<Item> = {}, pictures?: string[]): Item {
  return {
    id: `tu-${id}`, time, title, description, icon: Footprints, iconBg: "#FFF0EE", type: "activity", ...options,
    ...(pictures?.length ? { image: pictures[0], previewImages: pictures } : {}),
  };
}

export const finalDetails = [
  "Whether you will visit the congress on 24 October as well.",
  "Your trains on 25 and 28 October: we are booking them and will send you the tickets.",
  "Lingyin Temple on 27 October: we are making your free reservation.",
  "Where and when your group meets on 1 November.",
];

export function buildDoAnhTuConfig(): ItineraryConfig {
  return {
    cityName: "Shanghai & Hangzhou",
    title: "Shanghai & Hangzhou Week",
    location: "Shanghai · Hangzhou",
    duration: "9 Days · 24 Oct – 1 Nov",
    heroImage: photos.bund[0],
    overview: [
      { icon: "🛍️", label: "HARMAY · TX Huaihai · Qipao" },
      { icon: "📸", label: "Wukang Road · Lujiazui · North Bund" },
      { icon: "🌊", label: "Lingyin Temple & West Lake" },
      { icon: "🐼", label: "Red pandas · Wild Animal Park" },
    ],
    picks: [],
    meiGreeting: "Here’s your week, day by day: every stop has its Chinese name and address for Amap or DiDi, plus the metro line and exit or the taxi time to get there.",
    departure: {
      time: "Sun 1 Nov · Morning",
      title: "Join your group programme",
      description: "Your group week begins today, including Longjing tea village and Zhujiajiao, so we’ve left those out of this plan. Check out of WOW Hotels (by 12:00) and head to the group’s meeting point.",
    },
    departureNote: "Send us the meeting time and place and we’ll help with the journey there. We’re still here on WeChat during the group week.",
    days: [
      /* ═══════ SHANGHAI · 24 Oct ═══════ */
      { label: "Day 1", city: "Shanghai", subtitle: "Sat 24 Oct · Arrival · Beauty shopping · Wukang Road", color: SHANGHAI, items: [
        stop("arrive", "05:35", "Land in Shanghai", "Welcome to China! You land at Shanghai Pudong (PVG). Allow about an hour for immigration and baggage. Then follow the “Taxi” (出租车) signs to the official taxi queue, or book a DiDi, and show the driver your hotel’s Chinese address.\n\nTaxi to your hotel: about 55–65 minutes, around ¥240.\n\nCheaper: Metro Line 2 runs from the airport to East Nanjing Road (南京东路, Exit 3), about 1 hour 15 minutes for under ¥10. You may need to change trains at Guanglan Road (广兰路). With luggage after a night flight, the taxi is much easier.", { icon: Plane, iconBg: "#E3F2FD", type: "transport", subtitle: "Shanghai Pudong (PVG) · no transfer booked", previewLine: "Taxi or DiDi · 桔子水晶上海外滩南京路步行街酒店", tip: "Our tip: Only take a taxi from the official queue. Ignore anyone in the arrivals hall offering you a ride. Save the hotel’s Chinese name in your phone before you fly.", transportAfter: { mode: "taxi", duration: "55–65 min", note: "Pudong Airport → Crystal Orange, 汉口路266号, ~¥240" } }),
        stop("hotel", "~08:00", "Crystal Orange · leave your bags", "Your first night: Crystal Orange Shanghai the Bund Nanjing Road Pedestrian Street Hotel, 230 m from East Nanjing Road metro. Check-in is from 14:00, so leave your luggage at the front desk (free) and head out for breakfast.\n\n桔子水晶上海外滩南京路步行街酒店 · 上海市黄浦区汉口路266号", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Booked · 24 October", previewLine: "Free luggage storage · check-in from 14:00", transportAfter: { mode: "walk", duration: "7 min", note: "Walk to Da Hu Chun, 四川中路136号" } }, photos.crystalOrange),
        stop("dahuchun", "~08:30", "Breakfast · Da Hu Chun", "Shanghai’s famous pan-fried buns, crisp on the bottom and juicy inside.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Pan-fried buns · 7 min from your hotel", restaurants: [
          { name: "大壶春（四川中路店）", englishName: "Da Hu Chun", cuisine: "Shengjian buns", note: "Michelin Bib Gourmand. Try the classic pork, then shrimp or crab if you’re hungry. Opens 07:00, closes 19:30. 四川中路136号.", price: "~¥30–50 pp", rating: 4.6, image: photos.dahuchun[1] },
        ], transportAfter: { mode: "taxi", duration: "25–30 min", note: "Taxi ~¥36 · or Line 14 豫园 → Line 8 大世界 → 中华艺术宫 Exit 3, 41 min" } }, photos.dahuchun),
        stop("dentech-24", "Morning · optional", "DenTech Congress (optional)", "If you’d like to visit the congress today too: Shanghai World Expo Exhibition & Convention Center, Halls 1, 2 and 4. The north entrance is a 6-minute walk from China Art Museum station (中华艺术宫), Exit 3.\n\n上海世博展览馆 · 浦东新区博成路850号（北入口）", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Optional · open 09:00–16:30", previewLine: "Expo Center · Halls 1, 2 and 4", transportAfter: { mode: "taxi", duration: "20–25 min", note: "Taxi ~¥35 · or Line 13 世博大道 (Exit 1) → 淮海中路 (Exit 1), 40 min" } }, photos.expo),
        stop("tx", "~13:00", "TX Huaihai · 淮海中路523号", "A youth-culture shopping centre packed with designer and street brands. On your list: Pane sneakers (L1-06, by door 1, 10:00–22:00) and MUVA leather bags (F2, L2-14, 11:00–22:00). Mason Prince streetwear is across the road at 530 Middle Huaihai Road.", { icon: ShoppingBag, iconBg: "#FFF0EE", subtitle: "Shopping · Pane · MUVA · Mason Prince", previewLine: "Pane sneakers, MUVA bags and Shanghai street brands", tip: "Our tip: Pane can have a 20–30 minute queue and popular sizes sell out, so make it your first stop here. There’s also a HARMAY at Xintiandi (黄陂南路380号), 10 minutes’ walk away, if you’d rather not travel further.", transportAfter: { mode: "taxi", duration: "15–20 min", note: "Taxi ~¥20 · the metro takes 41 min with a long walk" } }, photos.tx),
        stop("harmay", "~15:00", "HARMAY · 话梅", "The beauty store from your list. It moved in July 2026 from Anfu Road to 55 Wukang Road, so use this address, not the old Anfu Road pin.\n\nHARMAY话梅（上海武康路店）· 徐汇区武康路55号 · 09:30–22:00", { icon: ShoppingBag, iconBg: "#FFF0EE", subtitle: "Beauty shopping · open 09:30–22:00", previewLine: "Shanghai’s cult beauty store · new Wukang Road address", transportAfter: { mode: "walk", duration: "14 min", note: "Walk along Wukang Road to Wukang Mansion" } }, photos.harmay),
        stop("wukang", "~16:30", "Wukang Road & Anfu Road photo walk", "Plane-tree streets with old villas, cafés and boutiques. Finish at Wukang Mansion, the wedge-shaped 1924 apartment building at the Huaihai Road junction, for golden-hour photos around 17:00.\n\n武康大楼 · 徐汇区淮海中路1850号", { icon: Camera, iconBg: "#E8F5E9", subtitle: "Photo spots · golden hour", previewLine: "Wukang Mansion · Anfu Road · golden hour", tip: "Our tip: Wukang Mansion is a residential building, so photograph it from the street. The traffic island opposite gives the classic angle.", transportAfter: { mode: "taxi", duration: "25–30 min", note: "Taxi ~¥32 · or Line 10 交通大学 (Exit 7) → 南京东路 (Exit 1), 46 min" } }, photos.wukang),
        stop("lailai", "~18:30", "Dinner · Lai Lai Xiao Long", "Soup dumplings one block north of Nanjing Road, 12 minutes’ walk from your hotel.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Soup dumplings · arrive by 19:00", restaurants: [
          { name: "莱莱小笼", englishName: "Lai Lai Xiao Long", cuisine: "Shanghai xiaolongbao", note: "Michelin Bib Gourmand. Crab-roe xiaolongbao is the autumn speciality. Order and pay at the counter, then share a table. Open 08:00–14:00 and 15:00–20:00. 天津路506号.", price: "~¥60–100 pp", rating: 4.7, image: photos.lailai[1] },
        ], tip: "Our tip: Cards aren’t always accepted here, so have Alipay or cash ready.", transportAfter: { mode: "walk", duration: "12 min", note: "Walk back to your hotel" } }, photos.lailai),
      ] },

      /* ═══════ SHANGHAI → HANGZHOU · 25 Oct ═══════ */
      { label: "Day 2", city: "Shanghai", subtitle: "Sun 25 Oct · DenTech Congress · Train to Hangzhou", color: SHANGHAI, items: [
        stop("checkout", "08:15", "Check out & leave your suitcase", "Check out of Crystal Orange and ask the front desk to keep your suitcase until the afternoon (free). Keep your passport with you: you need it for the train.", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Crystal Orange · luggage storage", transportAfter: { mode: "taxi", duration: "~25 min", note: "Taxi ~¥35 · or Line 2 to 人民广场 → Line 8 to 中华艺术宫 Exit 3, 41 min" } }),
        stop("dentech", "09:00–14:00", "DenTech Congress", "Your day at the congress. Have lunch at the venue before you leave: the afternoon is all travel.\n\n上海世博展览馆 · 浦东新区博成路850号（北入口）", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Shanghai World Expo Exhibition & Convention Center", previewLine: "Halls 1, 2 and 4 · north entrance", transportAfter: { mode: "taxi", duration: "~25 min", note: "Taxi ~¥38 · or Line 8 → 老西门 → Line 10 → 南京东路, 39 min" } }, photos.expo),
        stop("collect", "~14:45", "Collect your suitcase", "Pick up your suitcase at Crystal Orange and head straight to the station.", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", transportAfter: { mode: "taxi", duration: "35–45 min", note: "Taxi ~¥84 · or Line 2 direct: 南京东路 (Exit 3) → 虹桥火车站 (Exit B), 44 min, ¥5" } }),
        stop("train", "16:32", "High-Speed Train to Hangzhou", "Train G1583, Shanghai Hongqiao 16:32 → Hangzhou East 17:24, about ¥87 in second class (二等座). We’re booking it for you and will send your ticket with the coach and seat numbers. Backups: G1343 at 16:37 or G231 at 17:13.\n\nBe at Hongqiao by about 15:45: the station is huge, with a passport check and security.\n\nFinding your train: follow the signs for Departures (出发) and scan your passport at the entrance and security. Then find G1583 on the big departure boards. They show your gate (检票口, for example A12). Boarding opens about 15–20 minutes before departure and closes 5 minutes before. Scan your passport at the gate, go down to the platform and find your coach number painted on the floor.", { icon: TrainFront, iconBg: "#E3F2FD", type: "transport", subtitle: "Hongqiao → Hangzhou East · 52 min · we’re booking it", previewLine: "G1583 · 16:32 → 17:24 · ~¥87", tip: "Our tip: Your passport is your ticket. Keep it with you, not in your suitcase.", transportAfter: { mode: "taxi", duration: "30–45 min", note: "Hangzhou East → your hotel, ~¥60 (Sunday evening traffic)" } }, photos.train),
        stop("jianguo", "~18:15", "White Horse Lake Jianguo Hotel", "Your Hangzhou base for three nights, in Binjiang across the river from West Lake. Dinner at or near the hotel and an easy evening.\n\n杭州白马湖建国饭店 · 杭州市滨江区长江南路336号", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Booked · 25–28 October", previewLine: "长江南路336号 · Binjiang" }, photos.jianguo),
      ] },

      /* ═══════ HANGZHOU · 26–27 Oct ═══════ */
      { label: "Day 3", city: "Hangzhou", subtitle: "Mon 26 Oct · Salon · White Horse Lake · River light show", color: HANGZHOU, items: [
        stop("salon", "10:30", "Your perm at Pinbai · 品柏造型", "Your digital perm on the ends of your hair, at Pinbai, one of the best-reviewed salons in Binjiang. The stylist will look at your hair in person first, because of last year’s highlights. Your appointment is booked for 10:30. Allow 3–4 hours.\n\nThe salon is on the 4th floor of the Binjiang Intime shopping mall (滨江银泰), Zone D. Leave your hotel by about 10:05. Copy this into Amap or DiDi:\n品柏造型（滨江银泰店）· 杭州市滨江区滨和路518号滨江银泰D区4层", { icon: Sparkles, iconBg: "#F3E8FF", type: "transport", subtitle: "Booked · 10:30", previewLine: "Binjiang Intime mall, 4th floor", tip: "Our tip: Bring your inspiration photos on your phone. We’ll send you photos of the mall and the shop front before your appointment.", transportAfter: { mode: "taxi", duration: "~16 min", note: "Taxi back to your hotel, ~¥19" } }),
        stop("baima", "~14:30", "White Horse Lake · 白马湖", "Your hotel sits right by White Horse Lake and the China Cartoon & Animation Museum. Take a gentle lakeside walk, rest at the hotel or use the indoor pool.", { icon: Coffee, iconBg: "#E8F5E9", subtitle: "Easy afternoon next to your hotel", previewLine: "A quiet lake on your hotel’s doorstep", transportAfter: { mode: "taxi", duration: "~25 min", note: "Taxi to Binjiang Pier 滨江码头, 闻涛路, ~¥21" } }, photos.baima),
        stop("qiantang", "19:30", "Qiantang River Light Show", "The skyline of Qianjiang New City lights up across the river in a synchronised show (19:30, Sunday–Thursday). Watch it from Binjiang Pier on your side of the river.\n\n杭州钱塘江夜游（滨江码头）· 滨江区闻涛路", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Free · about 15 minutes", previewLine: "The city skyline lights up over the river", tip: "Our tip: For something special, the Qiantang night river cruise leaves from the same pier, so you could watch the show from the water. We can check times and tickets.", transportAfter: { mode: "taxi", duration: "~25 min", note: "Taxi back to your hotel, ~¥21" } }, photos.qiantang),
      ] },
      { label: "Day 4", city: "Hangzhou", subtitle: "Tue 27 Oct · Lingyin Temple · Hubin · West Lake by boat", color: HANGZHOU, items: [
        stop("lingyin", "~08:45", "Lingyin Temple & Feilai Peak", "Hangzhou’s most famous temple, founded over 1,600 years ago, with hundreds of Buddhist carvings in the limestone cliffs of Feilai Peak opposite. Mornings are calmest.\n\n灵隐寺 · 杭州市西湖区法云弄1号 · 07:30–17:30", { icon: Sun, iconBg: "#FFF3E0", subtitle: "Free · we’re booking your reservation", previewLine: "Temple halls, cliff carvings and forest paths", tip: "Our tip: The temple is free but needs a reservation with your passport. We’re making it for you and will send the confirmation. Bring the same passport: it’s checked at the gate.", transportAfter: { mode: "taxi", duration: "25–30 min", note: "Taxi to Hubin, ~¥25 · or the Lingyin–Longxiangqiao bus line (龙翔桥至灵隐专线), 56 min" } }, photos.lingyin),
        stop("muspring", "~13:00", "Hubin, in77 & MU SPRING Qipao", "Lunch in the Hubin area, then browse in77 (湖滨银泰in77) by the lake. MU SPRING, the qipao store from your list, is on the ground floor at 延安路238号 (1F, unit 105), near Longxiangqiao metro (龙翔桥) Exit D. Open 11:00–23:00.\n\n沐迎春（杭州西湖旗舰店）· 上城区延安路238号1层105室", { icon: ShoppingBag, iconBg: "#FFF0EE", subtitle: "Lunch · shopping · qipao", previewLine: "in77 by the lake · MU SPRING qipao", transportAfter: { mode: "walk", duration: "11 min", note: "Walk to Pier 5 五公园码头, 湖滨路41号" } }, photos.hubin),
        stop("boat", "~16:00", "Hand-Rowed Boat on West Lake", "Glide across the lake in a traditional rowing boat as the light softens: about ¥150 per boat for the first hour. Boats leave from Pier 5 (五公园码头), opposite the Overseas Chinese Hotel.", { icon: Sunset, iconBg: "#FFF3E0", subtitle: "About 1 hour · pay at the pier", previewLine: "The classic West Lake view, from the water", transportAfter: { mode: "walk", duration: "8 min", note: "Walk to Zhiweiguan, 仁和路83-1号" } }, photos.boat),
        stop("zhiwei", "~17:30", "Dinner · Zhiweiguan", "Hangzhou classics in a century-old restaurant by the lake.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Hangzhou dishes · by the lake", restaurants: [
          { name: "知味观（湖滨总店）", englishName: "Zhiweiguan", cuisine: "Hangzhou cuisine", note: "Try West Lake vinegar fish (西湖醋鱼), Dongpo pork (东坡肉) and shrimp with Longjing tea (龙井虾仁), plus their little dim-sum pastries. Open 08:30–21:30. 仁和路83-1号.", price: "~¥80–120 pp", rating: 4.6, image: photos.zhiwei[0] },
        ], transportAfter: { mode: "walk", duration: "5 min", note: "Walk to Hubin Park 3 for the fountain" } }, photos.zhiwei),
        stop("fountain", "19:30", "West Lake Musical Fountain", "A 15-minute fountain show set to music at Hubin Park 3 (湖滨三公园). Arrive by about 19:10: it gets busy and there’s a security check.", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Free · one show nightly", previewLine: "Water, music and lights on the lake", transportAfter: { mode: "taxi", duration: "~30 min", note: "Taxi back to your hotel, ~¥39" } }, photos.fountain),
      ] },

      /* ═══════ HANGZHOU → SHANGHAI · 28 Oct ═══════ */
      { label: "Day 5", city: "Shanghai", subtitle: "Wed 28 Oct · Train back · Tianzifang & DIY lipstick", color: SHANGHAI, items: [
        stop("checkout-hz", "08:30", "Check out & taxi to Hangzhou East", "Check out of the White Horse Lake Jianguo Hotel. Morning traffic makes the taxi to Hangzhou East (杭州东站) 40–50 minutes, about ¥60.", { icon: Car, iconBg: "#E3F2FD", type: "transport", subtitle: "Leave by 08:30 for the 09:53 train", transportAfter: { mode: "taxi", duration: "40–50 min", note: "Hotel → Hangzhou East, ~¥60" } }),
        stop("train-back", "09:53", "High-Speed Train to Shanghai", "We’re booking your train back: G7506 at 09:53 (or G262 at 10:48), about 47 minutes to Shanghai Hongqiao, about ¥80 in second class. Tell us if you’d prefer a later train: there are trains roughly every 15 minutes.\n\nFinding your train works the same as on the 25th: passport at the entrance, then the departure boards for your gate (检票口).", { icon: TrainFront, iconBg: "#E3F2FD", type: "transport", subtitle: "Hangzhou East → Shanghai Hongqiao · ~47 min · we’re booking it", previewLine: "G7506 09:53 or G262 10:48 · ~¥80", transportAfter: { mode: "taxi", duration: "~40 min", note: "Taxi ~¥82 · or Line 2 direct: 虹桥火车站 → 南京东路 (Exit 3), 44 min, ¥5, then 7 min walk" } }),
        stop("hotel-2", "~11:30", "WOW Hotels · leave your bags", "Your Shanghai base for the next four nights, a block south of Nanjing Road: 5 minutes’ walk to People’s Square metro (Lines 1, 2 and 8) and 7 minutes to East Nanjing Road (Lines 2 and 10). Check-in is from 14:00, so leave your bags at the front desk (free) and head out.\n\nWOW Hotels · 上海南京东路铂金万澳酒店 · 上海市黄浦区九江路619号", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Booked · 28 October – 1 November", previewLine: "九江路619号 · near People’s Square", transportAfter: { mode: "taxi", duration: "12–15 min", note: "Taxi ~¥22 · or Line 8 人民广场 → Line 9 → 打浦桥 Exit 1, 36 min" } }),
        stop("tianzifang", "~14:30", "Tianzifang & DIY Lipstick", "A maze of narrow shikumen lanes full of small shops, studios and cafés. Inside is the Lipstick Lab from your list (口红学苑 · Lipstick Lab Creative Studio), where you choose your colour, scent and case and make your own lipstick. Open 09:00–21:00.\n\n口红学苑（田子坊店）· 黄浦区泰康路248弄23号楼", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Shikumen lanes · make your own lipstick", previewLine: "Narrow lanes, small shops and a lipstick studio", tip: "Our tip: We’ll check the price and whether to book a time slot before you go.", transportAfter: { mode: "taxi", duration: "~11 min", note: "Taxi to Xintiandi ~¥18 · or a 28-min walk" } }, photos.tianzifang),
        stop("xintiandi", "Evening", "Dinner · Xintiandi 新天地", "Restored stone-gate houses with restaurants, bars and shops: an easy place for dinner on your first evening back.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Dinner & an evening stroll", previewLine: "Stone-gate lanes · dinner and drinks", transportAfter: { mode: "taxi", duration: "~8 min", note: "Taxi back to your hotel ~¥18 · or Line 1 一大会址·黄陂南路 → 人民广场, then 5 min walk, 25 min" } }, photos.xintiandi),
      ] },

      /* ═══════ SHANGHAI · 29–31 Oct ═══════ */
      { label: "Day 6", city: "Shanghai", subtitle: "Thu 29 Oct · Shanghai Wild Animal Park · Red pandas", color: SHANGHAI, items: [
        stop("to-park", "08:45", "To the Wild Animal Park", "Quickest: a taxi or DiDi from your hotel straight to the park gate, 60–70 minutes, around ¥185 each way.\n\nCheaper: walk 5 minutes to People’s Square, take Line 2 to Longyang Road (龙阳路), change to Line 16 to Wild Animal Park station (野生动物园), leave by Exit 2 and take bus 浦东125路 one stop to the gate. About 1.5 hours, ¥9.", { icon: Car, iconBg: "#E3F2FD", type: "transport", subtitle: "~1 hour by taxi from your hotel", previewLine: "Taxi ~60–70 min · or metro + bus ~1.5 h", transportAfter: { mode: "taxi", duration: "60–70 min", note: "Taxi ~¥185 · or Line 2 → Line 16 → bus 浦东125路, ~1.5 h, ¥9" } }),
        stop("park", "~10:00", "Shanghai Wild Animal Park", "A big safari park with a drive-through section by park bus and walking areas. The red pandas are the highlight for you: paid feeding sessions usually run around midday on weekdays, which is why we’ve picked a Thursday.\n\n上海野生动物园 · 浦东新区南六公路178号 · 09:00–17:00 (tickets until 16:00) · about ¥190", { icon: Camera, iconBg: "#E8F5E9", subtitle: "Full day · red panda feeding", previewLine: "Red pandas, safari bus and feeding sessions", tip: "Our tip: We’ll confirm the red panda feeding time and price for 29 October before you go. Feeding is paid separately and depends on the animals.", transportAfter: { mode: "taxi", duration: "~60 min", note: "Taxi back ~¥187 · or bus 125 → Line 16 → Line 2, ~1 h 40" } }, photos.zoo),
        stop("evening-29", "Evening", "Rest & dinner near your hotel", "It’s a long day out, so keep the evening easy. Nanjing Road and Lai Lai Xiao Long’s street (天津路) are a few minutes’ walk from WOW Hotels.", { icon: Moon, iconBg: "#EDE7F6", type: "hotel", subtitle: "Free evening" }),
      ] },
      { label: "Day 7", city: "Shanghai", subtitle: "Fri 30 Oct · Lujiazui · Qipao · North Bund · Snacks", color: SHANGHAI, items: [
        stop("lujiazui", "~09:45", "Lujiazui Escalators & Skyline", "Ride the escalators up to the circular pedestrian bridge (明珠环) above Lujiazui station for framed views of the Oriental Pearl Tower, then walk to the famous “three towers” photo spot by Jin Mao Tower.", { icon: Camera, iconBg: "#E8F5E9", subtitle: "Photo spots · Line 2, two stops from People’s Square", previewLine: "Circular bridge · Shanghai Tower · Jin Mao", tip: "Our tip: Ignore people offering to sell you photos; the official photo spot by Jin Mao is free.", transportAfter: { mode: "metro", duration: "25 min", note: "Line 2 陆家嘴 → 南京西路, Exit 4, then 8 min walk · or taxi ~25 min, ¥35" } }, photos.lujiazui),
        stop("longfeng", "~12:30", "Longfeng Qipao · 龙凤旗袍", "One of Shanghai’s best-known qipao houses, with ready-to-wear dresses as well as made-to-measure. Open 10:00–21:00.\n\n龙凤旗袍（平安大楼店）· 静安区陕西北路207-209号", { icon: ShoppingBag, iconBg: "#FFF0EE", subtitle: "Qipao shopping", previewLine: "A classic Shanghai qipao house", tip: "Our tip: Made-to-measure takes time, so ready-to-wear is best for this trip. Ask about small alterations before you pay.", transportAfter: { mode: "taxi", duration: "~20 min", note: "Taxi ~¥28 · or Line 12 direct: 南京西路 → 国际客运中心 Exit 3, 39 min" } }, photos.longfeng),
        stop("snacks", "~15:45", "Hema & snack shops", "Next to the North Bund: Hema (盒马鲜生) at White Magnolia Plaza B2, 8 minutes’ walk from the riverside, for local food to take home. The snack shops from your list are close by on Sichuan North Road: 零食很忙 at 四川北路1500号 and 好想来 at 四川北路1661号 (taxi ~13 min, ¥19).", { icon: ShoppingBag, iconBg: "#FFF0EE", subtitle: "Snacks & souvenirs to take home", previewLine: "Hema · 零食很忙 · 好想来", transportAfter: { mode: "walk", duration: "8 min", note: "Walk to the North Bund riverside" } }, photos.snacks),
        stop("north-bund", "~17:00", "North Bund at Sunset · 北外滩", "The riverside park by the International Cruise Terminal gives you the Bund and Lujiazui in one frame, with far fewer people than the Bund itself. Sunset is around 17:15.\n\n北外滩滨江绿地 · 虹口区东大名路558-678号", { icon: Sunset, iconBg: "#FFF3E0", subtitle: "Free · best at sunset", previewLine: "The Bund and Lujiazui in one view", transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi ~¥18 · or a 19-min walk along the river" } }, photos.northBund),
        stop("bund", "Evening", "The Bund at Night · 外滩", "Walk the Bund as the skyline lights up, then have dinner nearby. Back to your hotel: walk about 20 minutes along Nanjing Road pedestrian street, or a taxi (~10 min).", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Evening walk & dinner", previewLine: "The skyline lit up across the river" }, photos.bund),
      ] },
      { label: "Day 8", city: "Shanghai", subtitle: "Sat 31 Oct · Free day", color: SHANGHAI, items: [
        stop("free", "All day", "A free day for anything you missed", "Use today for anything you skipped or want more of: HARMAY, Wukang Road, TX Huaihai or another look at qipao. Pack for the group week tonight.", { icon: Footprints, iconBg: "#FFF0EE", type: "hotel", subtitle: "Flexible" }),
      ] },
      { label: "Day 9", city: "Shanghai", subtitle: "Sun 1 Nov · Your group programme begins", color: SHANGHAI, items: [] },
    ],
  };
}
