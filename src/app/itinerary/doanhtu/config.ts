import { Camera, Coffee, Footprints, Hotel, Moon, Plane, ShoppingBag, Sparkles, Sunset, TrainFront, Utensils } from "lucide-react";
import type { ItineraryConfig } from "../ItineraryPage";

type Item = ItineraryConfig["days"][number]["items"][number];
const local = (name: string) => `/uploads/itinerary/doanhtu/${name}.webp`;
const R = "/uploads/itinerary/ruijun";
const HZ = "/uploads/itinerary/hangzhou";
const SH = "/uploads/itinerary/shanghai/scraper";
export const photos = {
  hero: `${SH}/bund-skyline.jpg`,
  crystalOrange: [local("crystal-orange"), local("crystal-orange-2")],
  jianguo: [local("jianguo"), local("jianguo-2")],
  dahuchun: [local("dahuchun"), local("dahuchun-2")],
  expo: [local("expo")],
  txHuaihai: [local("txhuaihai"), "/uploads/itinerary/vivek/huaihai-road.webp"],
  harmay: [local("harmay"), local("harmay-2")],
  wukang: [`${R}/wukang-2.webp`, "/uploads/itinerary/xhs/wukang.webp"],
  lailai: [local("lailai"), "/uploads/itinerary/antonio/xiaolongbao.webp"],
  train: [local("hongqiao")],
  lingyin: [`${R}/temple.webp`, `${R}/feilai.webp`, `${HZ}/lingyin2.jpg`],
  hubin: [local("hubin"), `${HZ}/westlake1.jpg`],
  boat: [local("westlake-boat"), `${HZ}/westlake2.jpg`],
  fountain: [local("fountain"), `${HZ}/westlake3.jpg`],
  qiantang: [local("qiantang"), local("qiantang-2")],
  tianzifang: [`${SH}/tianzifang-shikumen.jpg`, local("tianzifang-lipstick")],
  xintiandi: ["/uploads/itinerary/antonio/xintiandi-2.webp", "/uploads/itinerary/vivek/xintiandi.webp"],
  redPanda: [local("redpanda"), local("redpanda-2")],
  lujiazui: [local("lujiazui-bridge"), `${SH}/shanghai-tower.webp`],
  qipao: [`${R}/recommendations/longfeng-1.webp`, `${R}/recommendations/longfeng-2.webp`],
  northBund: [`${R}/north-bund.webp`, `${R}/north-bund-2.webp`],
  bund: [`${SH}/bund-buildings.png`, "/uploads/itinerary/xhs/bund.webp"],
};
function stop(id: string, time: string, title: string, description: string, options: Partial<Item> = {}, pictures?: string[]): Item {
  return {
    id: `tu-${id}`, time, title, description, icon: Footprints, iconBg: "#FFF0EE", type: "activity", ...options,
    ...(pictures?.length ? { image: pictures[0], previewImages: pictures, showPhotoPreview: true } : {}),
  };
}
export const finalDetails = [
  "Which airport you land at on 24 October (Pudong or Hongqiao), or your flight number, so we can send the best way to your hotel.",
  "Your Shanghai hotel for 28 October – 1 November once booked. Days 5–8 are planned around central Shanghai and will be fine-tuned to it.",
  "Whether you will visit the congress on 24 October as well, and roughly when.",
  "Your salon appointment: we will confirm the salon and time with you.",
  "Whether you would like us to book your trains on 25 and 28 October.",
  "Lingyin Temple needs a free reservation 1–7 days ahead. We can book it for 27 October once you confirm.",
  "Where and when your group meets on 1 November.",
];
const KEEP = "#AA4250";
export function buildDoAnhTuConfig(): ItineraryConfig {
  return {
    cityName: "Shanghai & Hangzhou", title: "Shanghai & Hangzhou week", location: "Shanghai · Hangzhou", duration: "24 October – 1 November 2026", heroImage: photos.hero,
    overview: [
      { icon: "🗓️", label: "24 Oct – 1 Nov 2026" },
      { icon: "🛍️", label: "Beauty shopping & photo spots" },
      { icon: "🌊", label: "Two days by West Lake" },
      { icon: "🐼", label: "Red pandas at the Wild Animal Park" },
    ],
    picks: [], meiGreeting: "Shopping · Photo spots · West Lake · Red pandas",
    departure: {
      time: "Sunday 1 November",
      title: "Your group programme begins",
      description: "Today you join your group for the week ahead, including Longjing tea village and Zhujiajiao, so we have left them out of this plan. Check out of your Shanghai hotel and head to the group's meeting point.",
    },
    departureNote: "Send us the meeting time and place when you have them, and we'll help with the journey there. We're still here for you on WeChat during the group week.",
    days: [
      { label: "Day 1", city: "Shanghai", subtitle: "Sat 24 Oct · Arrival, breakfast buns & beauty shopping", color: KEEP, items: [
        stop("arrive", "05:35", "Land in Shanghai", "Welcome to China! After immigration and baggage, take a taxi from the official taxi queue or book a DiDi to your hotel. Show the driver the hotel's Chinese name below.\n\nHotel: 桔子水晶上海外滩南京路步行街酒店, 上海市黄浦区汉口路266号.", { icon: Plane, type: "transport", subtitle: "Airport to confirm · no transfer booked", previewLine: "Taxi or DiDi to Crystal Orange · 汉口路266号", tip: "Tell us your airport or flight number and we'll send exact directions. From Pudong the taxi takes about an hour; from Hongqiao about 40 minutes.", transportAfter: { mode: "taxi", duration: "~40–60 min", note: "Airport → Crystal Orange" } }),
        stop("hotel", "~07:00", "Crystal Orange · leave your bags", "Your first night is at Crystal Orange Shanghai the Bund Nanjing Road Pedestrian Street Hotel. Check-in is from 14:00, so leave your luggage at the front desk (free) and head out for breakfast.", { icon: Hotel, type: "hotel", subtitle: "Booked · 汉口路266号", previewLine: "Free luggage storage · check-in from 14:00", transportAfter: { mode: "walk", duration: "2 min", note: "Walk to Da Hu Chun" } }, photos.crystalOrange),
        stop("dahuchun", "08:00", "Breakfast at Da Hu Chun · 大壶春", "Shanghai's famous pan-fried buns (生煎), crisp on the bottom and juicy inside. Michelin Bib Gourmand. Try the pork, and the shrimp or crab versions if you're hungry.\n\nAddress: 上海市黄浦区四川中路136号. Open 08:00–21:00.", { icon: Utensils, type: "meal", subtitle: "2 minutes from your hotel", previewLine: "Pan-fried buns · Michelin Bib Gourmand", tip: "There is often a queue at lunchtime; breakfast is the quietest time.", transportAfter: { mode: "metro", duration: "~35 min", note: "Line 2 to People's Square, then Line 8 to China Art Museum (中华艺术宫)" } }, photos.dahuchun),
        stop("dentech-24", "Morning · optional", "DenTech congress", "If you'd like to visit the congress today too, it is at the Shanghai World Expo Exhibition & Convention Center (上海世博展览馆), 浦东新区国展路1099号. Visiting hours are 09:00–16:30.", { icon: Sparkles, subtitle: "Optional · only if you're going today", previewLine: "Expo Center · Halls 1, 2 and 4", transportAfter: { mode: "metro", duration: "~25 min", note: "Line 13 from Expo Avenue (世博大道) to Middle Huaihai Road (淮海中路)" } }, photos.expo),
        stop("tx", "~13:00", "TX Huaihai · 淮海中路523号", "A youth-culture shopping centre with designer and street brands: Pane sneakers (L1), MUVA leather bags (2F) and pop-ups, with Mason Prince streetwear across the road at 530 Middle Huaihai Road.", { icon: ShoppingBag, subtitle: "Shopping · open about 10:00–22:00", previewLine: "Pane · MUVA · Mason Prince", tip: "Pane sometimes has a queue of 20–30 minutes. Popular sizes sell out, so go early if it's your main stop.", transportAfter: { mode: "metro", duration: "~20 min", note: "Line 10 from Xintiandi (新天地) to Shanghai Library (上海图书馆), then walk" } }, photos.txHuaihai),
        stop("harmay", "~15:00", "HARMAY · 话梅 Wukang Road", "The beauty store from your list. It moved in July 2026 from Anfu Road to 武康路55号 (55 Wukang Road), so use this address, not the old Anfu Road pin.", { icon: ShoppingBag, subtitle: "Beauty shopping · open 10:00–22:00", previewLine: "New address: 武康路55号", transportAfter: { mode: "walk", duration: "5–10 min", note: "Walk along Wukang Road" } }, photos.harmay),
        stop("wukang", "~16:30", "Wukang Road & Anfu Road photo walk", "Tree-lined streets with old villas, cafés and boutiques. Finish at Wukang Mansion (武康大楼) at the Huaihai Road junction for golden-hour photos around 17:00.", { icon: Camera, subtitle: "Photo spots", previewLine: "Wukang Mansion · Anfu Road · golden hour", tip: "Wukang Mansion is a residential building: photograph it from the street, not inside.", transportAfter: { mode: "metro", duration: "~30 min", note: "Line 10 from Jiaotong University (交通大学) to East Nanjing Road (南京东路)" } }, photos.wukang),
        stop("lailai", "Dinner", "Lai Lai Xiao Long · 莱莱小笼", "Soup dumplings near your hotel, one block north of Nanjing Road. The crab-roe xiaolongbao is the speciality in autumn. Order and pay at the counter, then share a table.\n\nAddress: 天津路506号, Huangpu.", { icon: Utensils, type: "meal", subtitle: "Michelin Bib Gourmand · about 10 minutes' walk from your hotel", previewLine: "Crab-roe xiaolongbao · bring cash or Alipay", tip: "Cards aren't always accepted here, so have Alipay or cash ready." }, photos.lailai),
      ] },
      { label: "Day 2", city: "Shanghai → Hangzhou", subtitle: "Sun 25 Oct · Congress, then the train to Hangzhou", color: KEEP, items: [
        stop("checkout", "Before 08:30", "Check out & leave your suitcase", "Check out of Crystal Orange and ask the front desk to keep your suitcase until the afternoon. Hotel luggage storage is free. Keep your passport with you: you need it for the train.", { icon: Hotel, type: "hotel", subtitle: "Crystal Orange · luggage storage", transportAfter: { mode: "metro", duration: "~35 min", note: "Line 2 to People's Square, then Line 8 to China Art Museum (中华艺术宫)" } }),
        stop("dentech", "09:00–14:00", "DenTech congress", "Your day at the congress. Have lunch at the venue before you leave, as the afternoon is all travel.", { icon: Sparkles, subtitle: "Shanghai World Expo Exhibition & Convention Center · 国展路1099号", transportAfter: { mode: "metro", duration: "~35 min", note: "Line 8 to People's Square, then Line 2 to East Nanjing Road" } }, photos.expo),
        stop("collect", "~14:40", "Collect your suitcase", "Pick up your suitcase at Crystal Orange and head straight to the station.", { icon: Hotel, type: "hotel", transportAfter: { mode: "metro", duration: "~45 min", note: "Line 2 direct from East Nanjing Road to Hongqiao Railway Station (虹桥火车站)" } }),
        stop("train", "16:32 → 17:24", "Train G1583 to Hangzhou East", "Our suggested train: G1583, Shanghai Hongqiao → Hangzhou East, 16:32–17:24, about ¥87 in second class. Backups: G1343 at 16:37 or G231 at 17:13.\n\nBe at Hongqiao by about 15:45: the station is huge and there is a passport check and security.", { icon: TrainFront, type: "transport", subtitle: "Suggested · not booked yet", previewLine: "Hongqiao 16:32 · Hangzhou East 17:24", tip: "Sunday afternoon trains sell out, so book soon on Trip.com with your passport, or let us book it for you.", transportAfter: { mode: "taxi", duration: "~40 min", note: "Taxi from Hangzhou East to your hotel, about ¥75" } }, photos.train),
        stop("jianguo", "~18:15", "White Horse Lake Jianguo Hotel", "Your Hangzhou base for three nights, in Binjiang across the river from West Lake. Have dinner at or near the hotel and an easy evening.\n\nAddress: 杭州白马湖建国饭店, 杭州市滨江区长江南路336号.", { icon: Hotel, type: "hotel", subtitle: "Booked · 25–28 October", previewLine: "长江南路336号 · Binjiang" }, photos.jianguo),
      ] },
      { label: "Day 3", city: "Hangzhou", subtitle: "Mon 26 Oct · Salon day & the river light show", color: KEEP, items: [
        stop("salon", "Morning · to confirm", "Your salon appointment", "We'll confirm the salon and the time with you. Allow most of the morning.", { icon: Sparkles, subtitle: "Time to confirm" }),
        stop("baima", "Afternoon", "White Horse Lake & a slow afternoon", "Your hotel sits next to White Horse Lake (白马湖) and the China Cartoon & Animation Museum. Take a gentle lakeside walk, rest at the hotel, or use the indoor pool.", { icon: Coffee, subtitle: "Easy afternoon near your hotel", transportAfter: { mode: "taxi", duration: "~20 min", note: "Taxi to the Binjiang riverside" } }),
        stop("qiantang", "19:30", "Qiantang River light show", "The skyline across the Qiantang River lights up in a synchronised show, best seen from the Binjiang riverside on your side of the river. Sunday to Thursday shows start at 19:30.", { icon: Moon, subtitle: "Free · evening", previewLine: "City-wide light show over the river", tip: "We'll send you a map pin for a good viewing spot on the day." }, photos.qiantang),
      ] },
      { label: "Day 4", city: "Hangzhou", subtitle: "Tue 27 Oct · Lingyin Temple & West Lake", color: KEEP, items: [
        stop("lingyin", "~08:30", "Lingyin Temple & Feilai Peak · 灵隐寺 / 飞来峰", "Hangzhou's most famous temple, with Buddhist carvings in the cliffs of Feilai Peak opposite. Mornings are calmest.\n\nThe temple itself is free but needs a reservation 1–7 days ahead in the \"杭州灵隐飞来峰\" mini-program (Alipay or WeChat) with your passport. Same-day booking isn't possible.", { icon: Camera, subtitle: "Reservation needed · open 07:30–17:30", previewLine: "Temple, cliff carvings & forest paths", tip: "Book by the evening of 26 October at the latest. We can do it for you with your passport details.", transportAfter: { mode: "taxi", duration: "~20 min", note: "Taxi or bus 7 to Hubin (湖滨)" } }, photos.lingyin),
        stop("hubin", "~13:00", "Hubin, in77 & MU SPRING qipao · 沐迎春", "Lunch in the Hubin area by the lake, then browse in77 (湖滨银泰in77). The MU SPRING qipao store from your list is just outside entrance C3, near Longxiangqiao metro (龙翔桥) Exit D.", { icon: ShoppingBag, subtitle: "Lunch & shopping by the lake", previewLine: "in77 · MU SPRING qipao · lakeside cafés", transportAfter: { mode: "walk", duration: "5 min", note: "Walk to the lakeshore piers" } }, photos.hubin),
        stop("boat", "~16:00", "Hand-rowed boat on West Lake", "Glide across the lake in a traditional rowing boat as the afternoon light softens. It's around ¥150 per boat for the first hour, with boats leaving from the Hubin Park piers (湖滨公园).", { icon: Sunset, subtitle: "About 1 hour · pay at the pier", previewLine: "The classic West Lake view, from the water" }, photos.boat),
        stop("dinner-hz", "Dinner", "Hangzhou dishes by the lake", "Try Hangzhou classics such as West Lake vinegar fish (西湖醋鱼), Dongpo pork (东坡肉) and shrimp with Longjing tea (龙井虾仁) at a restaurant in the Hubin area. We'll send you a couple of options nearby.", { icon: Utensils, type: "meal", subtitle: "Suggested · no booking" }),
        stop("fountain", "19:30", "West Lake musical fountain", "A 15-minute fountain show set to music at Hubin Park 3 (湖滨三公园). Arrive by about 19:10, as it gets busy and there is a security check.", { icon: Moon, subtitle: "Free · one show nightly", previewLine: "Water, music and lights on the lake", transportAfter: { mode: "taxi", duration: "~40 min", note: "Taxi back to your hotel" } }, photos.fountain),
      ] },
      { label: "Day 5", city: "Hangzhou → Shanghai", subtitle: "Wed 28 Oct · Back to Shanghai & Tianzifang", color: KEEP, items: [
        stop("checkout-hz", "~08:45", "Check out & head to Hangzhou East", "Check out of the White Horse Lake Jianguo Hotel and take a taxi to Hangzhou East station (杭州东站).", { icon: Hotel, type: "hotel", transportAfter: { mode: "taxi", duration: "~40 min", note: "Taxi to Hangzhou East, about ¥75" } }),
        stop("train-back", "09:53 or 10:48", "Train back to Shanghai Hongqiao", "Suggested trains: G7506 at 09:53 or G262 at 10:48, each about 47 minutes to Shanghai Hongqiao, about ¥80 in second class. There are trains roughly every 15 minutes if you'd prefer another time.", { icon: TrainFront, type: "transport", subtitle: "Suggested · not booked yet", previewLine: "About 47 minutes to Hongqiao", transportAfter: { mode: "metro", duration: "~40 min", note: "Line 2 towards the city centre; route depends on your hotel" } }, photos.train),
        stop("hotel-2", "Midday", "Check in to your Shanghai hotel", "Drop your bags at your hotel for the next four nights. Staying near East Nanjing Road or People's Square keeps Line 2 direct to Hongqiao, Lujiazui and the Wild Animal Park line.", { icon: Hotel, type: "hotel", subtitle: "Hotel to confirm" }),
        stop("tianzifang", "~14:30", "Tianzifang & DIY lipstick · 田子坊", "A maze of narrow shikumen lanes full of small shops and cafés. This is where we think the custom lipstick studio from your list is: 口红学苑, 泰康路248弄. Create your own colour and case.", { icon: Sparkles, subtitle: "Lipstick studio to confirm", previewLine: "Shikumen lanes · make your own lipstick", tip: "Send us the link or screenshot you saved for \"Lipstick Lab\" and we'll confirm the right studio, price and whether to book.", transportAfter: { mode: "walk", duration: "~15 min", note: "Walk to Xintiandi" } }, photos.tianzifang),
        stop("xintiandi", "Evening", "Xintiandi · 新天地", "Restored stone-gate houses with restaurants, bars and shops. An easy place for dinner on your first evening back.", { icon: Utensils, type: "meal", subtitle: "Dinner & a stroll" }, photos.xintiandi),
      ] },
      { label: "Day 6", city: "Shanghai", subtitle: "Thu 29 Oct · Shanghai Wild Animal Park", color: KEEP, items: [
        stop("to-park", "~08:30", "Head to the Wild Animal Park", "Take Line 2 to Longyang Road (龙阳路), change to Line 16 to Wild Animal Park station (野生动物园), then take bus 惠南6路 two stops or a short taxi to the gate. Allow 1–1.5 hours from central Shanghai.", { icon: TrainFront, type: "transport", subtitle: "Metro + short bus or taxi", transportAfter: { mode: "taxi", duration: "~10 min", note: "From Exit 2 to the park gate" } }),
        stop("park", "09:30–16:00", "Shanghai Wild Animal Park · 上海野生动物园", "A big safari-style park with a drive-through section by park bus and walking areas. The red pandas are on your list: paid feeding sessions usually run around midday on weekdays, which is why we've picked a Thursday.\n\nTickets: about ¥190 for adults. Open 09:00–17:00 (last entry 16:00). Address: 浦东新区南六公路178号.", { icon: Camera, subtitle: "Full day · tickets about ¥190", previewLine: "Red pandas · safari bus · feeding sessions", tip: "We'll confirm the red panda feeding time and price for 29 October before you go. Feeding is paid separately and isn't guaranteed." }, photos.redPanda),
        stop("evening-29", "Evening", "Rest & dinner near your hotel", "It's a long day out, so keep the evening easy.", { icon: Utensils, type: "meal", subtitle: "Free evening" }),
      ] },
      { label: "Day 7", city: "Shanghai", subtitle: "Fri 30 Oct · Skyline photos & qipao", color: KEEP, items: [
        stop("lujiazui", "Morning", "Lujiazui escalators & skyline · 陆家嘴", "Ride up the escalators to the circular pedestrian bridge (明珠环) above Lujiazui station for framed views of the Oriental Pearl Tower, then walk to the famous \"three towers\" photo spot by Jin Mao Tower.", { icon: Camera, subtitle: "Photo spots", previewLine: "Circular bridge · Shanghai Tower · Jin Mao", tip: "Ignore people offering to sell you photos; the official photo spot by Jin Mao is free.", transportAfter: { mode: "metro", duration: "~15 min", note: "Line 2 from Lujiazui to West Nanjing Road (南京西路)" } }, photos.lujiazui),
        stop("qipao", "~13:30", "Longfeng Qipao · 龙凤旗袍", "One of Shanghai's best-known qipao houses, with ready-to-wear dresses as well as made-to-measure. Address: 静安区陕西北路207号.", { icon: ShoppingBag, subtitle: "Qipao shopping", previewLine: "A classic Shanghai qipao house", tip: "Made-to-measure takes time; ready-to-wear is best for this trip. Ask about alterations before you pay.", transportAfter: { mode: "taxi", duration: "~25 min", note: "Taxi to the North Bund" } }, photos.qipao),
        stop("north-bund", "~17:00", "North Bund at sunset · 北外滩", "The riverside green space by the International Cruise Terminal gives you the Bund and Lujiazui in one frame, with far fewer people than the Bund itself. Sunset is around 17:15.", { icon: Sunset, subtitle: "Free · best at sunset", previewLine: "Bund + Lujiazui in one view", transportAfter: { mode: "walk", duration: "~20 min", note: "Walk along the river to the Bund" } }, photos.northBund),
        stop("bund", "Evening", "The Bund at night · 外滩", "Walk the Bund as the skyline lights up, then dinner nearby. If you didn't make it to Da Hu Chun or Lai Lai earlier, they're both close.", { icon: Moon, subtitle: "Evening walk & dinner" }, photos.bund),
      ] },
      { label: "Day 8", city: "Shanghai", subtitle: "Sat 31 Oct · Free day for snacks & last shopping", color: KEEP, items: [
        stop("snacks", "Daytime", "Snack shops & Hema · 零食很忙 / 赵一鸣 / 好想来 / 盒马", "The snack chains from your list are everywhere in Shanghai. Search their names in Amap from your hotel and pick the closest. Hema (盒马) is great for packaged local food to take home.", { icon: ShoppingBag, subtitle: "Near your hotel", previewLine: "Snacks and souvenirs to take home" }),
        stop("catch-up", "Afternoon", "Anything you missed", "Use the afternoon for anything you skipped: HARMAY, Wukang Road photos, TX Huaihai, or another look at qipao. Pack for the group week tonight.", { icon: Footprints, subtitle: "Flexible" }),
      ] },
      { label: "Day 9", city: "Shanghai", subtitle: "Sun 1 Nov · Join your group", color: KEEP, items: [] },
    ],
  };
}
