import { Camera, Car, Castle, Coffee, Footprints, Hotel, Moon, Plane, Ship, ShoppingBag, Sparkles, Sun, Sunset, TrainFront, Utensils } from "lucide-react";
import type { ItineraryConfig } from "../ItineraryPage";

/* Places, opening days, addresses and journey times were checked in Amap on
   22 Oct 2026. Taxi times include an allowance for traffic at the planned time.
   Photo sources: photo-sources.json. */
type Item = ItineraryConfig["days"][number]["items"][number];
type Alternative = NonNullable<Item["alternatives"]>[number];
const A = (name: string) => `/uploads/itinerary/ardio/${name}.webp`;
const SH = "/uploads/itinerary/shanghai/scraper";
const HZ = "/uploads/itinerary/hangzhou";
const DO = "/uploads/itinerary/doanhtu";

export const photos = {
  sofitelSh: [A("sofitel-sh"), A("sofitel-sh-2")],
  millfun: [A("millfun"), A("millfun-2")],
  zoo: [A("zoo-panda"), A("zoo-2")],
  apoli: [A("apoli"), A("apoli-2")],
  matchaWang: [A("matchawang"), A("matchawang-2")],
  zhangyuan: [A("zhangyuan"), A("zhangyuan-2")],
  yuyuan: [A("yuyuan"), A("yuyuan-2")],
  wukang: ["/uploads/itinerary/ruijun/wukang-2.webp", "/uploads/itinerary/xhs/wukang.webp"],
  greenhouse: [A("greenhouse-db"), A("greenhouse-db-2"), A("greenhouse-db-3")],
  lionGrove: ["/uploads/itinerary/vivek/lion-grove.webp"],
  nanjingDay: [`${SH}/lego-flagship.jpg`, `${SH}/nanjing-road-neon.jpg`],
  lailai: [`${DO}/lailai.webp`, `${DO}/lailai-2.webp`],
  xintiandi: ["/uploads/itinerary/antonio/xintiandi-1.webp", "/uploads/itinerary/antonio/xintiandi-2.webp", "/uploads/itinerary/vivek/xintiandi.webp"],
  yugarden: [A("yugarden"), `${SH}/yugarden-bridge.jpg`],
  nanxiang: ["/uploads/itinerary/theresa/nanxiang.webp", "/uploads/itinerary/theresa/nanxiang-2.webp"],
  bund: [`${SH}/bund-skyline.jpg`, "/uploads/itinerary/thebund.jpeg", `${SH}/bund-buildings.png`],
  cruise: [`${SH}/huangpu-cruise.jpg`, `${DO}/lujiazui-bridge.webp`],
  northBund: ["/uploads/itinerary/ruijun/north-bund.webp", "/uploads/itinerary/ruijun/north-bund-2.webp"],
  nathist: [A("nathist"), A("nathist-2")],
  jiajia: [A("jiajia"), "/uploads/itinerary/antonio/xiaolongbao.webp"],
  huanghe: [A("huanghe")],
  meland: [A("meland"), A("meland-2")],
  scitech: [A("scitech"), A("scitech-2")],
  century: [A("century"), A("century-2")],
  jinchao: [A("jinchao")],
  zhuozheng: [A("zhuozheng"), A("zhuozheng-2")],
  szmuseum: ["/uploads/itinerary/vivek/suzhou-museum.webp"],
  pingjiang: [A("pingjiang"), A("pingjiang-2"), "/uploads/itinerary/vivek/pingjiang-road.webp"],
  tongdexing: [A("tongdexing"), "/uploads/itinerary/antonio/crab-noodles.webp"],
  aquarium: [A("aquarium"), A("aquarium-2")],
  shtower: [`${SH}/shanghai-tower.webp`, `${DO}/lujiazui-bridge-2.webp`],
  pearl: [A("pearl"), A("pearl-2")],
  ferry: [A("ferry"), A("ferry-2")],
  postmuseum: [A("postmuseum"), A("postmuseum-2")],
  train: [`${DO}/hongqiao.webp`, `${DO}/hongqiao-2.webp`],
  sofitelHz: [A("sofitel-hz"), A("sofitel-hz-2")],
  waipojia: [A("waipojia")],
  threePools: [A("three-pools"), A("three-pools-2"), `${DO}/westlake-boat.webp`],
  westlake: [`${HZ}/westlake1.jpg`, `${HZ}/westlake2.jpg`, `${DO}/hubin.webp`],
  brokenBridge: [A("broken-bridge"), A("broken-bridge-2"), `${HZ}/westlake3.jpg`],
  zhiwei: [`${DO}/zhiweiguan.webp`, `${DO}/zhiweiguan-2.webp`],
  fountain: [`${DO}/fountain.webp`, `${DO}/fountain-2.webp`],
  yaqing: [A("yaqing"), A("yaqing-2")],
  legoland: [A("legoland"), A("legoland-2")],
  fengjing: [A("fengjing"), A("fengjing-2")],
  disneyHotel: [A("disney-hotel"), A("disney-hotel-2")],
  disneytown: [A("disneytown"), A("disneytown-2")],
  disney: [A("disney-castle"), A("disney-castle-2"), "/uploads/itinerary/shdisney.jpg"],
  novotel: [A("novotel"), A("novotel-2")],
};

const SHANGHAI = "#D0021B";
const SUZHOU = "#2F7D4F";
const HANGZHOU = "#0E7C7B";
const LEGOLAND = "#B45309";
const DISNEY = "#6D28D9";

type StopOptions = Partial<Item> & { pictures?: string[] };
function stop(id: string, time: string, title: string, description: string, { pictures, ...options }: StopOptions = {}): Item {
  return {
    id: `ardio-${id}`, time, title, description, icon: Footprints, iconBg: "#FFF0EE", type: "activity", ...options,
    ...(pictures?.length ? { image: pictures[0], previewImages: pictures } : {}),
  };
}
/* A compact card for setting off: the journey is on the card itself, so it
   has no separate connector line underneath. */
function leave(id: string, time: string, title: string, previewLine: string, leg: NonNullable<Item["transportAfter"]>, description?: string): Item {
  return stop(id, time, title, description ?? `${leg.note}.`, { icon: Car, iconBg: "#E3F2FD", type: "transport", previewLine });
}
function alt(tag: string, title: string, description: string, extra: Partial<Alternative> = {}): Alternative {
  return { tag, title, description, ...extra };
}

/* Places we like but left out of the daily plan, shown as cards at the end. */
export const recommended = [
  { id: "aquarium", city: "Shanghai", title: "Shanghai Ocean Aquarium", tag: "Lujiazui · next to Shanghai Tower", image: photos.aquarium[0], desc: "One of Asia’s biggest aquariums, with a long underwater tunnel where sharks and rays swim over your heads.", note: "Adults ¥160, children ¥110. Open 09:00–18:00. Easy to add before Shanghai Tower on Day 6. 陆家嘴环路1388号." },
  { id: "pigcafe", city: "Shanghai", title: "Daydream Pig Petting Café", tag: "People’s Square", image: A("pigcafe"), desc: "Tiny piglets in sweaters run over for popcorn while you sit on beanbags.", note: "Allow 45–60 minutes, and hold the little one when the piglets rush over. Open 09:30–21:30. 人民大道221号 迪美购物中心B1." },
  { id: "haus", city: "Shanghai", title: "HAUS NOWHERE", tag: "Huaihai Road · 8 min walk from Matcha Wang (Day 2)", image: A("haus-face"), desc: "Gentle Monster’s flagship: four floors of art installations, including the giant robotic face that went viral, plus sunglasses and Nudake’s pastries displayed like sculptures. More gallery than shop, and fun even if you buy nothing.", note: "Free to walk in. Open 10:00–22:00. 淮海中路798号." },
  { id: "louis", city: "Shanghai", title: "The Louis · Louis Vuitton’s ship", tag: "Next to Zhangyuan · Day 6", image: A("louis-night"), desc: "A full-size silver ocean liner built onto Nanjing West Road, with a free exhibition on Louis Vuitton’s history of travel inside.", note: "Free, but book a time slot in the “My LV” WeChat mini-program (one booking per account). Open 10:00–22:00. 南京西路789号 兴业太古汇." },
  { id: "trees", city: "Shanghai", title: "1000 Trees · 天安千树", tag: "By Suzhou Creek · 16 min by taxi from your hotel", image: A("1000-trees"), desc: "Thomas Heatherwick’s terraced building, like a mountain with about a thousand trees growing on its columns, and a mall inside. Best seen from the riverside path across the creek.", note: "Free. Shops open 10:00–22:00. Next to the M50 art district. 莫干山路600号." },
  { id: "cubic3", city: "Shanghai", title: "CUBIC3 coffee · 三立方", tag: "On Yuyuan Road · Day 6", image: A("cubic3"), desc: "A local favourite for simple, good coffee at low prices: an espresso is about ¥10 and a latte ¥15, with fresh pastries.", note: "Yuyuan Road branch: 愚园路1429号, 09:00–21:00, at the west end of the road. Also on Yongkang Road, 永康路58号." },
  { id: "warehouse3", city: "Shanghai", title: "No. 3 Warehouse · 3号仓库", tag: "People’s Square · the viral spaceship restaurant", image: A("warehouse3"), desc: "Creative Chinese food in a dining room built like a spaceship: white spiral rings, mirrors and a jungle of plants. Some dishes arrive like little art pieces, such as a blue “planet” you crack open with a tiny hammer.", note: "The New World City branch is the one you see on Instagram: 南京西路2号 新世界城4楼, 10:00–21:30. Expect a long wait, often 1–3 hours: take a queue number and come back. Other branches are next to Yu Garden and on Sichuan North Road near your hotel, but their rooms look different." },
  { id: "nathist", city: "Shanghai", title: "Shanghai Natural History Museum", tag: "Dinosaurs · 20 min from your hotel", image: photos.nathist[0], desc: "Life-size dinosaurs, a whale overhead and a huge animal hall, in a spiral building inside a sculpture park.", note: "Adults ¥30; children 6 and under free. Closed on Tuesdays. Book in the 上海科技馆自然博物馆天文馆门票 mini-program. 北京西路510号." },
  { id: "wildpark", city: "Shanghai", title: "Shanghai Wild Animal Park", tag: "A full day · ~1 hour away", image: "/uploads/itinerary/doanhtu/redpanda-2.webp", desc: "A safari park where a bus drives you among giraffes, zebras and other animals, with red pandas and a walking zoo too.", note: "About an hour each way by taxi (~¥150). Open 09:00–17:00. Plan a whole day for it. 南六公路178号." },
  { id: "vangogh", city: "Shanghai", title: "Van Gogh Starry Sky Art Museum", tag: "On Nanjing Road · near Day 1’s walk", image: A("vangogh"), desc: "Walk into Starry Night and the sunflowers: glowing rooms and a mirror maze children love.", note: "About an hour. Stroller-friendly, but there are flashing lights. 南京东路800号 第一百货C馆8楼, next to the No.1 Food Store." },
  { id: "timecube", city: "Shanghai", title: "Space & Time Cube", tag: "In White Magnolia Plaza · Day 2", image: A("timecube"), desc: "A basement of interactive projections and a 3D light tunnel, made for ages 3–8.", note: "Children happily stay an hour; adults are done in 15 minutes. In the mall where you have dinner on Day 2. 东长治路588号 白玉兰广场B1." },
  { id: "map", city: "Shanghai", title: "Museum of Art Pudong", tag: "Lujiazui riverside · Day 6", image: A("map-pudong"), desc: "A riverside museum whose Mirror Hall reflects the Bund, with a children’s exhibition and rest area on the 4th floor.", note: "Stroller-friendly throughout. Easy to add after Shanghai Tower. 滨江大道2777号." },
  { id: "millfun", city: "Shanghai", title: "1933 Old Millfun", tag: "2 min walk from your hotel", image: photos.millfun[0], desc: "A 1930s concrete Art Deco building full of ramps, sky-bridges and staircases to explore.", note: "Free, open until 20:00, so it fits a spare half hour." },
  { id: "szmuseum", city: "Suzhou", title: "Suzhou Museum", tag: "5 min walk from the Humble Administrator’s Garden", image: photos.szmuseum[0], desc: "I. M. Pei’s museum, a modern take on a Suzhou garden, with ponds, white walls and rock paintings.", note: "Free, but book 1–7 days ahead. Closed on Mondays. 东北街204号." },
  { id: "leifeng", city: "Hangzhou", title: "Leifeng Pagoda", tag: "12 min from your Hangzhou hotel", image: "/uploads/itinerary/hangzhou/leifeng2.jpg", desc: "The pagoda from the legend of the White Snake, with a lift to the top and a view over the whole of West Lake.", note: "About ¥40 per adult, ¥20 per child. Open 08:00–20:00, and lit up at night. 南山路15号." },
  { id: "qinghefang", city: "Hangzhou", title: "Qinghefang Old Street", tag: "10 min from your Hangzhou hotel", image: "/uploads/itinerary/xhs/hefang.webp", desc: "Hangzhou’s old shopping street: wooden shopfronts, traditional snacks, tea and toy stalls.", note: "Open all day and liveliest in the evening, so it’s good after dinner. 河坊街180号." },
];

export function buildArdioConfig(withOptions: boolean): ItineraryConfig {
  const days: ItineraryConfig["days"] = [
    /* ═══════ SHANGHAI · 5 Dec ═══════ */
    { label: "Day 1", city: "Shanghai", subtitle: "Sat 5 Dec · Arrival · Nanjing Road & the Bund at night", color: SHANGHAI, items: [
      stop("arrive", "14:35", "Land at Shanghai Pudong · SQ 830", "Welcome to China! Your flight from Singapore lands at Terminal 2 at 14:35. Allow about an hour for immigration and your bags. Your pickup is already booked: the driver will meet you in arrivals and take you straight to the hotel.", { icon: Plane, iconBg: "#E3F2FD", type: "transport", subtitle: "Pudong Airport (PVG) Terminal 2 · pickup booked", previewLine: "Pre-booked pickup · about 55–70 min", transportAfter: { mode: "car", duration: "55–70 min", note: "Pudong Airport → Sofitel North Bund" } }),
      stop("sofitel", "~16:45", "Sofitel Shanghai North Bund", "Your Shanghai base for six nights, next to Hailun Road metro (Lines 4 and 10). Check in and settle the children in.\n\n上海北外滩金辉索菲特酒店 · 虹口区溧阳路601号", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Booked · 5–11 December", previewLine: "溧阳路601号 · Hailun Road metro", pictures: photos.sofitelSh, transportAfter: { mode: "taxi", duration: "15–20 min", note: "Taxi ~¥14 to Lai Lai Xiao Long, 天津路506号" } }),
      stop("dinner-1", "18:15", "Dinner · Lai Lai Xiao Long", "Shanghai soup dumplings, one block north of Nanjing Road, to start the trip.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Soup dumplings · arrive by 19:00", restaurants: [
        { name: "莱莱小笼", englishName: "Lai Lai Xiao Long", cuisine: "Shanghai xiaolongbao", note: "Michelin Bib Gourmand. Order at the counter, then share a table. Let the dumplings cool before giving them to the children. Open until 20:00. 天津路506号.", price: "~¥60–100 pp", rating: 4.7, image: photos.lailai[1] },
        { name: "馋三尺蟹粉小笼（人民广场店）", englishName: "Chan San Chi", cuisine: "Crab-roe soup dumplings", note: "If Lai Lai has a long queue: paper-thin dumplings with golden crab broth. Order the crab-and-pork ones. 5 minutes’ walk from Lai Lai. 西藏中路500号.", price: "~¥50 pp", rating: 4.5, image: A("r-chansanchi") },
      ], tip: "Our tip: Cards aren’t always accepted at Lai Lai, so have Alipay or cash ready.", transportAfter: { mode: "walk", duration: "~20 min", note: "Walk down Nanjing Road to the Bund" } }),
      stop("bund-night", "~19:15", "Nanjing Road & the Bund at Night", "Walk down Nanjing Road’s pedestrian street, all lit up, to the river. At the end is the Bund: the 1920s buildings glowing gold on your side, and the Lujiazui skyscrapers lit up across the water. It’s flat and easy with the stroller. Stay as long as the children last, then it’s 8 minutes back to the hotel.\n\n南京路步行街 → 外滩 · 黄浦区中山东一路", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Free · Shanghai’s famous skyline", previewLine: "The skyline lit up on your first night", pictures: [`${SH}/nanjing-road-neon.jpg`, ...photos.bund], transportAfter: { mode: "taxi", duration: "8–10 min", note: "Taxi ~¥14 back to your hotel" }, alternatives: [
        alt("😴 Tired after the flight?", "Dinner near the hotel, the Bund another night", "Have soup dumplings 12 minutes’ walk from the hotel and go to bed early. You’ll see the Bund from the river cruise on Day 2.", { gettingThere: "Walk ~12 min · 麟笼坊, 乍浦路332号" }),
      ] }),
    ] },

    /* ═══════ SHANGHAI · 6 Dec ═══════ */
    { label: "Day 2", city: "Shanghai", subtitle: "Sun 6 Dec · Yu Garden · Xintiandi shopping · Lamb latte · River cruise", color: SHANGHAI, items: [
      leave("go-yu", "08:45", "To Yu Garden", "Taxi 15–20 min · ~¥16 · or Line 10, 42 min", { mode: "taxi", duration: "15–20 min", note: "Taxi ~¥16 · or Line 10 海伦路 → 豫园 Exit 7, 42 min" }),
      stop("yugarden", "09:00", "Yu Garden · 豫园", "A Ming-dynasty garden of pavilions, rockeries and koi ponds in the old town. Go at opening, before the crowds. About ¥30 per adult in December; the children are free.\n\n上海豫园 · 黄浦区福佑路168号 · 09:00–16:30", { icon: Sun, iconBg: "#FFF3E0", subtitle: "About ¥30 · book with your passports", previewLine: "Pavilions, rockeries and koi ponds", tip: "Our tip: Book on the “上海豫园” WeChat account with your passports. The paths have some steps, so a baby carrier is handy.", pictures: [...photos.yugarden, photos.nanxiang[1]], transportAfter: { mode: "walk", duration: "5 min", note: "Walk through the bazaar to Nanxiang" } }),
      stop("lunch-2", "~10:30", "Early lunch · Nanxiang Mantou Dian", "Shanghai’s most famous xiaolongbao, right by the garden.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Soup dumplings · arrive before 10:30", restaurants: [
        { name: "南翔馒头店（城隍庙店）", englishName: "Nanxiang Mantou Dian", cuisine: "Xiaolongbao", note: "Michelin Bib Gourmand. Sit upstairs rather than queuing for the takeaway window. Get there before 10:30 to beat the queue. 豫园路87号.", price: "~¥60–100 pp", rating: 4.6, image: photos.nanxiang[0] },
        { name: "绿波廊", englishName: "Lu Bo Lang", cuisine: "Shanghai dim sum", note: "For a proper sit-down meal: Shanghai dishes and little pastries, also Bib Gourmand. Open 11:00–16:00. 豫园路115号.", price: "~¥150 pp", rating: 4.5 },
        { name: "圆苑（淮海路店）", englishName: "Yuan Yuan", cuisine: "Shanghainese", note: "For a later lunch at Xintiandi instead: Shanghai’s famous red-braised pork belly (pour the sauce over rice). 9 minutes’ walk from Xintiandi. Book ahead on weekends. 淮海中路222号 力宝广场2楼.", price: "~¥180 pp", rating: 4.8, image: A("r-yuanyuan") },
      ], transportAfter: { mode: "taxi", duration: "15–18 min", note: "Taxi ~¥14 to Xintiandi · or Line 14, one stop: 豫园 (Exit 7) → 一大会址·黄陂南路 (Exit 2), 30 min" } }),
      stop("xintiandi", "~11:45", "Xintiandi & Huaihai Road · 新天地", "Shanghai’s old stone-gate (shikumen) houses, restored into car-free lanes of cafés, shops and restaurants. This afternoon is free time for shopping: the Xintiandi Style mall, and K11 on Huaihai Road, Shanghai’s big shopping street, 6 minutes’ walk away. Have a late lunch here too.\n\n上海新天地 · 黄浦区太仓路181弄\n新天地时尚 · 马当路67号 · 10:00–22:00\nK11购物艺术中心 · 淮海中路300号 · 10:00–22:00", { icon: ShoppingBag, iconBg: "#FFF0EE", subtitle: "Free time · shopping", previewLine: "Stone-gate lanes and Huaihai Road malls", pictures: photos.xintiandi, transportAfter: { mode: "walk", duration: "9 min", note: "Walk along Huaihai Road to Matcha Wang, 淮海中路550号" } }),
      stop("matcha", "~15:30", "Matcha Wang · the lamb latte", "The matcha bar on Huaihai Road that went viral for its vanilla matcha latte, with little lambs drawn in the foam (about ¥34). It’s grab-and-go, so take your drinks and stroll Huaihai Road. At weekends the queue can take 30–40 minutes.\n\nMatcha Wang · 淮海中路550号 HAI550 1楼 · 10:00–22:00", { icon: Coffee, iconBg: "#E8F5E9", subtitle: "Lambs in the foam · ~¥34", previewLine: "The viral latte with lambs in the foam", pictures: photos.matchaWang, transportAfter: { mode: "metro", duration: "~25 min", note: "Line 14 一大会址·黄陂南路 → 豫园, one stop, then a 10-min walk to Shiliupu pier · or taxi 15–30 min, depending on traffic" } }),
      stop("cruise", "~17:00", "Huangpu River Cruise", "About 45 minutes on the river from Shiliupu pier: the sun sets at about 16:50, and then the skyline lights up. Children under 1.3 m usually ride free (we’ll confirm). Adults about ¥120.\n\n十六铺旅游码头 · 黄浦区中山东二路531号", { icon: Ship, iconBg: "#EDE7F6", subtitle: "Sunset and the lights coming on", previewLine: "The Bund and Lujiazui lit up, from the water", pictures: photos.cruise, transportAfter: { mode: "taxi", duration: "~15 min", note: "Taxi to White Magnolia Plaza, 东长治路588号" }, alternatives: [
        alt("💰 Free", "North Bund riverside at sunset", "The riverside park near your hotel gives you the Bund and Lujiazui in one view, with far fewer people. Sunset is about 16:50.", { images: photos.northBund, gettingThere: "Taxi ~8 min · 北外滩滨江绿地, 东大名路" }),
      ] }),
      stop("dinner-2", "~18:00", "Dinner · White Magnolia Plaza", "A big mall 10 minutes from your hotel, with baby rooms and a Hema supermarket in the basement for nappies and snacks.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Shanghainese · Sichuan · Hunan", restaurants: [
        { name: "蘭心餐厅（白玉兰广场店）", englishName: "Lan Xin", cuisine: "Shanghainese", note: "Home-style Shanghai dishes: braised pork, smoked fish, scallion noodles. 3F, 东长治路588号.", price: "~¥125 pp", rating: 4.6 },
        { name: "映水芙蓉（白玉兰广场店）", englishName: "Ying Shui Fu Rong", cuisine: "Sichuan · spicy", note: "Proper Sichuan heat for the adults, with mild dishes for the children. 2F.", price: "~¥150 pp", rating: 4.6 },
        { name: "锅气·湖南饭店（白玉兰广场店）", englishName: "Guoqi Hunan", cuisine: "Hunan · spicy", note: "Smoky, spicy Hunan cooking at a good price. B2.", price: "~¥65 pp", rating: 4.1 },
      ], transportAfter: { mode: "taxi", duration: "~8 min", note: "Taxi back to your hotel" } }),
    ] },

    /* ═══════ SHANGHAI · 7 Dec ═══════ */
    { label: "Day 3", city: "Shanghai", subtitle: "Mon 7 Dec · Wukang Road · “Harry Potter” bakery · Anfu Road", color: SHANGHAI, items: [
      leave("go-wukang", "09:45", "To Wukang Road", "Line 10 direct, ~40 min, ¥4 · or taxi ~26 min", { mode: "metro", duration: "~40 min", note: "Line 10 海伦路 (Exit 3) direct to 交通大学 (Exit 7), 8 stops, ¥4, then a 7-min walk to Wukang Mansion · or taxi ~26 min, ~¥30" }),
      stop("wukang", "~10:30", "Wukang Mansion & Wukang Road", "Shanghai’s most photographed building, a 1924 wedge on a corner of plane-tree streets. Walk a little way up Wukang Road for the old villas and the cafés of Ferguson Lane, then come back to the bakery next door.\n\n武康大楼 · 徐汇区淮海中路1850号\nFerguson Lane · 武康路376号", { icon: Camera, iconBg: "#FFF0EE", subtitle: "Old Shanghai streets · photos", previewLine: "Shanghai’s most photographed building", tip: "Our tip: Wukang Mansion is a residential building, so take photos from the street. The traffic island opposite gives the classic view.", pictures: photos.wukang, transportAfter: { mode: "walk", duration: "2 min", note: "Walk to Apoli, 兴国路380号" } }),
      stop("apoli", "~11:30", "The “Harry Potter” bakery · Apoli Itabakery", "An Italian bakery that looks like a wizard’s kitchen: stone walls, arched windows, lanterns and branches over the counters. Pick your pastries on a tray for a late-morning coffee, and keep it light: lunch is next door at 13:00. There are no bookings, and it gets busier from lunchtime.\n\nAPOLI ITABAKERY · 兴国路380号 · 09:00–21:00", { icon: Coffee, iconBg: "#FFF3E0", subtitle: "Coffee and pastries in a wizard’s kitchen", previewLine: "Stone walls, lanterns and Italian pastries", pictures: photos.apoli, transportAfter: { mode: "walk", duration: "1 min", note: "Rose Hall is next door, 兴国路372弄" } }),
      stop("lunch-3", "~13:00", "Lunch · Rose Hall · 玫瑰厅", "Shanghai cooking in a century-old mansion, next door to the bakery.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Shanghainese · in a 1920s mansion", restaurants: [
        { name: "玫瑰厅上海菜（兴国路店）", englishName: "Rose Hall", cuisine: "Shanghainese", note: "Inside the former home of shipping magnate Y. K. Pao: brick walls, chandeliers and a garden courtyard. Book ahead. 兴国路372弄1号.", price: "~¥216 pp", rating: 4.7, image: A("r-rosehall") },
      ], transportAfter: { mode: "walk", duration: "~25 min", note: "Stroll up Wukang Road to Anfu Road · or taxi ~8 min" } }),
      stop("anfu", "~14:30", "Anfu Road · cafés & shops", "A short, leafy street of cafés, bakeries and small fashion and design shops, popular with young Shanghainese: your free time for strolling and shopping. Good stops: Baker & Spice (No. 195), Plusone coffee (No. 156), the LOOKNOW & FLOW buyer shop (No. 168) and SMFK (No. 161). For an afternoon treat, Chateau Garden’s soufflé is 10 minutes’ walk away.\n\n安福路 · 徐汇区", { icon: ShoppingBag, iconBg: "#FFF0EE", subtitle: "Free time · cafés and boutiques", previewLine: "Cafés, bakeries and small shops", pictures: [A("anfu-market"), A("anfu-street"), A("anfu-cafe"), A("anfu-night")], restaurants: [
        { name: "夏朵花园（复兴西路店）", englishName: "Chateau Garden", cuisine: "Afternoon tea · soufflé", note: "A break in a garden villa 10 minutes’ walk from Anfu Road. The made-to-order soufflé takes 30 minutes, so order it as soon as you sit down. 华山路855号.", price: "Soufflé ~¥48", rating: 4.8, image: A("r-chateau") },
      ], transportAfter: { mode: "taxi", duration: "30–40 min", note: "Taxi ~¥33 to Shu Tan Ji, 瑞虹天地月亮湾" } }),
      stop("dinner-3", "~18:00", "Dinner · Shu Tan Ji · 蜀谭记", "Tonight’s spicy dinner, at Ruihong Tiandi, 9 minutes from your hotel.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Sichuan · spicy", restaurants: [
        { name: "蜀谭记·盐帮川菜（瑞虹天地月亮湾店）", englishName: "Shu Tan Ji", cuisine: "Sichuan · spicy", note: "Order the boiling fragrant fish (飘香沸腾鱼): hot chilli oil poured over it at the table. Even “mild” (微辣) is hot here, so add a non-spicy dish for the children. Portions are big: 2–3 dishes is plenty. 瑞虹路188号 月亮湾3楼.", price: "~¥99 pp", rating: 4.8, image: A("r-shutanji") },
      ], transportAfter: { mode: "taxi", duration: "~9 min", note: "Taxi ~¥14 back to your hotel" } }),
    ] },

    /* ═══════ SHANGHAI · 8 Dec ═══════ */
    { label: "Day 4", city: "Shanghai", subtitle: "Tue 8 Dec · Science & Technology Museum · Greenhouse Garden", color: SHANGHAI, items: [
      leave("go-sci", "08:30", "To the Science & Technology Museum", "Taxi 25–30 min · ~¥30 · or metro, 48 min", { mode: "taxi", duration: "25–30 min", note: "Taxi ~¥30 · or Line 4 → Line 2 to 上海科技馆 Exit 8, 48 min" }),
      stop("scitech", "09:00", "Shanghai Science & Technology Museum", "Your must-do. Hands-on galleries, robots, a rainforest and space halls. Adults ¥45; children 6 and under are free. It’s closed on Mondays, which is why it’s today.\n\n上海科技馆 · 浦东新区世纪大道2000号 · 09:00–17:00", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Your must-do · ¥45 adults, kids free", previewLine: "Robots, a rainforest and hands-on galleries", tip: "Our tip: Mini World (一米世界) is a zone built for ages 3–8. Its time slots open at 08:30 but can only be booked once you’re inside, and they go fast, so be at the door at 09:00. Book your entry tickets up to 7 days ahead in the “上海科技馆自然博物馆天文馆门票” WeChat mini-program, with your passports. If the booking doesn’t work out, Thursday 10 December is the backup day.", pictures: photos.scitech, transportAfter: { mode: "walk", duration: "2 min", note: "Lunch inside the museum or next door" } }),
      stop("lunch-4", "~12:00", "Lunch · at the museum or next door", "Keep lunch simple and close.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Quick and close", restaurants: [
        { name: "科学时光餐厅", englishName: "Science Time Café", cuisine: "Museum café", note: "Inside the museum. Easy with the stroller.", price: "~¥90 pp", rating: 3.9 },
        { name: "花木时光里", englishName: "Huamu Shiguangli", cuisine: "Food court & restaurants", note: "A small mall 5 minutes’ walk away with lots of choice. 杨高南路99弄.", price: "~¥40–100 pp", rating: 4.5 },
      ], transportAfter: { mode: "taxi", duration: "30–40 min", note: "Taxi ~¥32 to the Greenhouse Garden, 济明路199号" } }),
      stop("greenhouse", "~14:00", "Shanghai Greenhouse Garden · 上海温室花园", "Asia’s largest greenhouse, in the new Expo Culture Park: three glass halls of rainforest, desert and misty canyon, and warm even in December. The lights come on at 19:00 if you’d like to stay. About ¥98 per adult; we’ll confirm the children’s tickets. Closed on Mondays.\n\n上海温室花园 · 浦东新区济明路199号（世博文化公园内）· 09:00–21:00", { icon: Sun, iconBg: "#E8F5E9", subtitle: "Indoors and warm · ~¥98 adults", previewLine: "Rainforest, desert and misty canyon under glass", tip: "Our tip: It’s warm and humid inside, so dress the children in layers you can take off.", pictures: photos.greenhouse, transportAfter: { mode: "taxi", duration: "40–50 min", note: "Taxi ~¥39 to Jinchao 8 Lane, near your hotel" }, alternatives: [
        alt("🌤 Nice weather?", "Century Park · 世纪公园", "Shanghai’s biggest park, and free: lawns, a lake and a children’s play area, right next to the Science Museum. Best on a sunny day, since in December it’s mostly open lawns.", { images: photos.century, gettingThere: "Taxi ~14 min from the museum · or a 20-min walk · 锦绣路1001号" }),
      ] }),
      stop("jinchao", "~18:30", "Dinner · Jinchao 8 Lane · 今潮8弄", "Restored 1920s stone-gate lanes on Sichuan North Road, 14 minutes’ walk from your hotel, with small restaurants and shops.\n\n今潮8弄 · 虹口区四川北路989弄", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Restored 1920s lanes · near your hotel", previewLine: "Restored 1920s lanes · dinner", pictures: photos.jinchao, restaurants: [
        { name: "庄氏隆兴·非遗蟹点（今潮8弄店）", englishName: "Zhuang’s Longxing", cuisine: "Crab dumplings", note: "Heritage-recipe crab dumplings and noodles. 四川北路989弄10号楼.", price: "~¥93 pp", rating: 4.5 },
        { name: "凯福·本帮小酒馆（今潮8弄店）", englishName: "Kaifu Bistro", cuisine: "Shanghainese", note: "A cosy Shanghai bistro in the lanes. 6号楼115单元.", price: "~¥117 pp", rating: 4.3 },
      ], transportAfter: { mode: "walk", duration: "14 min", note: "Walk back to your hotel" } }),
    ] },

    /* ═══════ SUZHOU · 9 Dec ═══════ */
    { label: "Day 5", city: "Suzhou", subtitle: "Wed 9 Dec · Suzhou day trip · Garden & canals", color: SUZHOU, items: [
      leave("go-shst", "08:15", "To Shanghai Railway Station", "Taxi 20–25 min · ~¥19 · or Line 4, 35 min", { mode: "taxi", duration: "20–25 min", note: "Taxi ~¥19 · or Line 4, two stops to 上海火车站, 35 min" }),
      stop("train-sz", "09:00", "High-Speed Train to Suzhou", "G7006, Shanghai Station 09:00 → Suzhou 09:25, about ¥46 per adult in second class. Backups: G8254 at 09:05 or D2906 at 08:41. Children under 6 can travel free on your lap.\n\nBring your passports: they are your tickets. Be at the station by 08:30 for the passport check and security.", { icon: TrainFront, iconBg: "#E3F2FD", type: "transport", subtitle: "Shanghai → Suzhou · 25 min", previewLine: "G7006 · 09:00 → 09:25 · ~¥46", pictures: photos.train, showPhotoPreview: false, transportAfter: { mode: "taxi", duration: "15–20 min", note: "Taxi ~¥10 to the Humble Administrator’s Garden" } }),
      stop("zhuozheng", "09:45", "Humble Administrator’s Garden · 拙政园", "Suzhou’s most famous classical garden: ponds, bridges and pavilions. ¥70 per adult in December. Allow about an hour.\n\n拙政园 · 苏州市姑苏区东北街178号 · 07:30–17:00", { icon: Sun, iconBg: "#E8F5E9", subtitle: "¥70 · book with your passports", previewLine: "Ponds, bridges and pavilions", tip: "Our tip: Book in the “苏州园林” mini-program with your passports. There are steps and arched bridges, so bring the baby carrier as well as the stroller.", pictures: photos.zhuozheng, transportAfter: { mode: "walk", duration: "8 min", note: "Walk to Lion Grove, 园林路23号" } }),
      stop("liongrove", "~11:00", "Lion Grove Garden · 狮子林", "A small classical garden built around a giant rockery maze: tunnels, steps and little caves that children love to explore. About ¥30 in winter. Allow about an hour.\n\n狮子林 · 苏州市姑苏区园林路23号 · 07:30–17:00", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "A rockery maze for kids · ~¥30", previewLine: "Tunnels, steps and caves to explore", tip: "Our tip: The maze paths are narrow, with steps, so use the baby carrier here.", pictures: photos.lionGrove, transportAfter: { mode: "walk", duration: "4 min", note: "Walk to Suzhou Taitai, 园林路88号" } }),
      stop("lunch-5", "~12:15", "Lunch · Suzhou cooking", "Suzhou food is mild and slightly sweet, which usually suits children.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Suzhou dishes · by the garden", restaurants: [
        { name: "苏州太太苏帮菜（拙政园店）", englishName: "Suzhou Taitai", cuisine: "Suzhou cuisine", note: "Highly rated and good value: squirrel fish, shrimp, Suzhou noodles. 园林路88号.", price: "~¥60 pp", rating: 4.7 },
        { name: "话雨楼·精品苏帮菜馆（拙政园店）", englishName: "Hua Yu Lou", cuisine: "Suzhou cuisine", note: "Next to the garden’s north gate. 百家巷8号.", price: "~¥78 pp", rating: 4.5 },
      ], transportAfter: { mode: "taxi", duration: "10–15 min", note: "Taxi ~¥10 to Pingjiang Road · or Line 6, one stop to 悬桥巷" } }),
      stop("pingjiang", "~13:30", "Pingjiang Road · 平江路", "A canal-side lane of old houses, little bridges and snack shops: the Suzhou postcard. Take it slowly: find a canal-side teahouse for a break, and stop for noodles at Tong De Xing. In winter, try the red-braised pork noodles (红汤焖肉面).\n\n平江路 · 苏州市姑苏区 · 同得兴, 平江路94号", { icon: Sunset, iconBg: "#FFF3E0", subtitle: "Canals · bridges · Suzhou noodles", previewLine: "Canals, bridges and a bowl of Suzhou noodles", pictures: [...photos.pingjiang, ...photos.tongdexing.slice(0, 1)], transportAfter: { mode: "taxi", duration: "20–30 min", note: "Taxi ~¥16 to Suzhou Station · or metro, 42 min" } }),
      stop("train-back-5", "17:14", "Train back to Shanghai", "G7019, Suzhou 17:14 → Shanghai Station ~17:40. Backup: G7021 at 18:14.", { icon: TrainFront, iconBg: "#E3F2FD", type: "transport", subtitle: "Suzhou → Shanghai · 26 min", previewLine: "G7019 · 17:14 → 17:40", transportAfter: { mode: "taxi", duration: "~20 min", note: "Taxi back to your hotel · dinner nearby" } }),
    ] },

    /* ═══════ SHANGHAI · 10 Dec ═══════ */
    { label: "Day 6", city: "Shanghai", subtitle: "Thu 10 Dec · Free day · Shanghai Tower · Zhangyuan · Yuyuan Road", color: SHANGHAI, items: [
      leave("go-ljz", "09:15", "To Lujiazui", "Taxi 13–15 min · ~¥15", { mode: "taxi", duration: "13–15 min", note: "Taxi ~¥15 to Shanghai Tower, 银城中路501号" }),
      stop("deck", "09:30", "Shanghai Tower viewing deck (optional)", "The 118th floor of China’s tallest building, with a 360° view over the city. The lift is one of the fastest in the world. It opens at 08:30, so the morning is quietest. Adults ¥180, children ¥90. Today is your free day, so skip it for a slow morning if you’d rather.\n\n上海之巅观光厅 · 银城中路501号 · 08:30–22:00", { icon: Camera, iconBg: "#E8F5E9", subtitle: "Optional · ¥180 / ¥90", previewLine: "Shanghai from the 118th floor", pictures: photos.shtower, transportAfter: { mode: "walk", duration: "~5 min", note: "Same building: down to the 52nd floor" }, alternatives: [
        alt("🎢 Glass floor", "Oriental Pearl Tower", "The pink-and-silver tower with a glass floor the children can stand on. Adults ¥199, children ¥99.", { images: photos.pearl, gettingThere: "Walk ~5 min · 东方明珠, 世纪大道1号" }),
        alt("💰 Cheaper", "Jin Mao Tower, 88th floor", "A lower but closer view of Shanghai Tower, with fewer queues. Adults ¥120, children ¥60.", { images: photos.shtower.slice(1), gettingThere: "Walk ~5 min · 金茂大厦88层, 世纪大道88号" }),
      ] }),
      stop("duoyun", "~10:30", "Coffee with a view · Duoyun Books · 朵云书院", "A bookshop and café on the 52nd floor of Shanghai Tower, with big windows over the river and the Bund. A calm stop for a coffee, and a hot chocolate for the children.", { icon: Coffee, iconBg: "#FFF1F3", type: "meal", subtitle: "52nd floor of Shanghai Tower", restaurants: [
        { name: "朵云书院·旗舰店", englishName: "Duoyun Books", cuisine: "Bookshop café", note: "Open 10:30–20:00. 银城中路501号 上海中心大厦52楼.", price: "Coffee & cakes", rating: 4.6 },
      ], transportAfter: { mode: "walk", duration: "~7 min", note: "Walk to lunch" } }),
      stop("lunch-6", "~12:00", "Lunch · Lujiazui", "Three choices close to the towers. Din Tai Fung is inside the IFC mall.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Dumplings · pizza · or something spicy", restaurants: [
        { name: "鼎泰丰（国金中心店）", englishName: "Din Tai Fung", cuisine: "Taiwanese dumplings", note: "Very child-friendly, with high chairs. Inside the IFC mall, LG1. Lunch 11:00–15:00. 世纪大道8号.", price: "~¥115 pp", rating: 4.5 },
        { name: "COMMUNE幻师（上海环球金融中心店）", englishName: "COMMUNE", cuisine: "Pizza & pasta", note: "If the children want something familiar: wood-fired pizza and pasta right under the three towers. 8 minutes’ walk from Shanghai Tower. 世纪大道100号 环球金融中心B1.", price: "~¥150 pp", rating: 4.7, image: A("r-commune") },
        { name: "麻六记（正大广场店）", englishName: "Ma Liu Ji", cuisine: "Sichuan · spicy", note: "Spicy Sichuan noodles and dishes. Super Brand Mall 6F, 陆家嘴西路168号.", price: "~¥100 pp", rating: 4.4 },
      ], transportAfter: { mode: "metro", duration: "~35 min", note: "Line 2 陆家嘴 → 南京西路, two stops (Exit 4) · or taxi ~20 min, ~¥25" } }),
      stop("zhangyuan", "~13:30", "Zhangyuan · 张园", "Shanghai’s largest group of old stone-gate (shikumen) lane houses, restored into quiet lanes of flagship shops, pop-ups and cafés. This is where Shanghai shops now, and far calmer than Nanjing Road East.\n\n张园 · 静安区茂名北路258号 · 南京西路 station, Exit 13", { icon: ShoppingBag, iconBg: "#FFF0EE", subtitle: "Free time · shopping in restored lanes", previewLine: "Restored 1900s lanes, flagship shops and cafés", pictures: photos.zhangyuan, transportAfter: { mode: "metro", duration: "~15 min", note: "Line 2 南京西路 → 江苏路, two stops (Exit 6), right by the Yuyuan art block · or taxi ~10 min" }, alternatives: [
        alt("🛍️ Big brands", "IFC Mall, Lujiazui", "Lujiazui’s big mall, right by lunch: six floors of international brands, a huge Apple Store, and a free rooftop terrace with the Oriental Pearl Tower right in front of you.", { images: [A("ifc"), A("ifc-2")], gettingThere: "Walk ~5 min from Shanghai Tower · 世纪大道8号 · 10:00–22:00" }),
      ] }),
      stop("yuyuan", "~15:00", "Yuyuan Road · 愚园路", "A leafy street of 1930s lane houses, where locals come for coffee and small shops. Start at the Yuyuan Art & Life block, about 80 small shops, bookshops and cafés by Jiangsu Road station, then wander east along Yuyuan Road towards Jing’an Temple. There is no list to tick off: stop wherever looks good. For coffee, try MCB at No. 472.\n\n愚园艺术生活街区 · 长宁区愚园路（江苏路站6号口）→ 愚园路 · 静安区", { icon: Footprints, iconBg: "#FFF0EE", subtitle: "Free time · lanes, shops and cafés", previewLine: "Lane houses, small shops and cafés", pictures: photos.yuyuan, transportAfter: { mode: "walk", duration: "~18 min", note: "Walk east along Yuyuan Road to dinner, 南京西路1818号" } }),
      stop("dinner-6", "~18:00", "Dinner · Jhouse · 吉品小鲜", "Shanghai and Zhejiang cooking, a few minutes from Jing’an Temple, where Yuyuan Road begins.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Shanghainese · seafood", restaurants: [
        { name: "吉品小鲜Jhouse（静安店）", englishName: "Jhouse", cuisine: "Shanghainese · Zhejiang seafood", note: "Order the yellow croaker with fried dough sticks (绝味吉品黄鱼) to dip in the sauce, and the red-braised pork. Dinner from 17:00; book ahead. 南京西路1818号 1788广场2楼.", price: "~¥210 pp", rating: 4.6, image: A("r-jhouse") },
      ], transportAfter: { mode: "taxi", duration: "~22 min", note: "Taxi ~¥27 back to your hotel" } }),
      stop("bags", "Evening", "Send your extra suitcases ahead", "Tomorrow you travel to Hangzhou with one bag. Ask the hotel concierge tonight to send the other suitcases by SF Express (顺丰) to your LEGOLAND hotel, YaQING, for collection tomorrow morning. It costs about ¥50–100 per suitcase and arrives the next day.\n\nKeep passports, medicines, valuables and two days of the children’s things with you, not in the forwarded bags.", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Luggage · SF Express via the concierge", previewLine: "SF Express to YaQING · ~¥50–100 per bag" }),
    ] },

    /* ═══════ HANGZHOU · 11 Dec ═══════ */
    { label: "Day 7", city: "Hangzhou", subtitle: "Fri 11 Dec · Train to Hangzhou · West Lake", color: HANGZHOU, items: [
      leave("go-hq", "09:00", "Check out & to Hongqiao Station", "Taxi 45–55 min · ~¥77 · or Line 10, 59 min", { mode: "taxi", duration: "45–55 min", note: "Taxi ~¥77 · or Line 10 direct to 虹桥火车站 Exit B, 59 min" }, "Hand the extra suitcases to the concierge for SF Express and check out. Then taxi to Shanghai Hongqiao station, 45–55 minutes, about ¥77. Or take Line 10 direct from Hailun Road to 虹桥火车站, 59 minutes."),
      stop("train-hz", "10:00", "High-Speed Train to Hangzhou", "G201, Hongqiao 10:00 → Hangzhou East 10:45, about ¥87 per adult. Backups: G7461 at 10:02 or G7319 at 10:07. Hongqiao is huge, so be there by 09:30.", { icon: TrainFront, iconBg: "#E3F2FD", type: "transport", subtitle: "Hongqiao → Hangzhou East · 45 min", previewLine: "G201 · 10:00 → 10:45 · ~¥87", transportAfter: { mode: "taxi", duration: "25–35 min", note: "Taxi ~¥27 · or Line 1 to 定安路 Exit C, 35 min" } }),
      stop("sofitel-hz", "~11:30", "Sofitel Hangzhou Westlake", "Right by West Lake. Leave your bag and head out for lunch; check-in is usually from 14:00.\n\n杭州索菲特西湖大酒店 · 上城区西湖大道333号", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Booked · 11–12 December", previewLine: "西湖大道333号 · by the lake", pictures: photos.sofitelHz, transportAfter: { mode: "walk", duration: "4 min", note: "Walk to Grandma’s Home, 南山路147号" } }),
      stop("lunch-7", "11:45", "Lunch · Grandma’s Home · 外婆家", "Mild Hangzhou home cooking, and very used to families.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Hangzhou home cooking", restaurants: [
        { name: "外婆家（西湖天地涌金店）", englishName: "Grandma’s Home", cuisine: "Hangzhou cuisine", note: "Try the tea-smoked chicken, braised pork and Longjing shrimp. 南山路147号.", price: "~¥73 pp", rating: 4.6, image: photos.waipojia[0] },
      ], transportAfter: { mode: "walk", duration: "13 min", note: "Walk through Liulang Wenying park to the lakeside pier" } }),
      stop("boat", "13:30", "Boat to Three Pools Mirroring the Moon", "Walk through Liulang Wenying park by the hotel to the lake, then take a covered cruise boat to the island of Three Pools Mirroring the Moon (三潭印月), with its stone lanterns in the water. About ¥55 per adult. The covered boats are safer with a 1-year-old than the open rowing boats.", { icon: Ship, iconBg: "#E3F2FD", subtitle: "Covered boat · ~¥55", previewLine: "The island and stone lanterns in the lake", pictures: photos.threePools, transportAfter: { mode: "taxi", duration: "~12 min", note: "Taxi ~¥11 to the Broken Bridge" }, alternatives: [
        alt("😴 Kids tired?", "A flat lakeside walk", "Skip the boat and stroll along the lake from Liulang Wenying to Hubin, with benches and lake views the whole way. Head back to the hotel to rest whenever you like.", { images: photos.westlake }),
      ] }),
      stop("broken-bridge", "16:30", "Broken Bridge & Bai Causeway", "The most famous view of West Lake: a flat causeway lined with willows, perfect for the stroller at sunset.\n\n断桥 · 白堤 · 西湖东北角", { icon: Sunset, iconBg: "#FFF3E0", subtitle: "Free · sunset walk", previewLine: "Willows and the lake at sunset", pictures: photos.brokenBridge, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi to Zhiweiguan, 仁和路83-1号" } }),
      stop("dinner-7", "18:00", "Dinner · Zhiweiguan · 知味观", "Hangzhou classics in a century-old restaurant by the lake.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Hangzhou dishes", restaurants: [
        { name: "知味观（湖滨总店）", englishName: "Zhiweiguan", cuisine: "Hangzhou cuisine", note: "Dongpo pork, shrimp with Longjing tea and their little pastries. Open 08:30–21:30. 仁和路83-1号.", price: "~¥80–120 pp", rating: 4.6, image: photos.zhiwei[0] },
      ], transportAfter: { mode: "walk", duration: "5 min", note: "Walk to Hubin Park 3 for the fountain" } }),
      stop("fountain", "19:30", "West Lake Musical Fountain (optional)", "A 15-minute fountain show set to music at Hubin Park 3, every evening. Arrive by about 19:15. Skip it if the children are ready for bed.", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Optional · free · 15 minutes", previewLine: "Water, music and lights on the lake", pictures: photos.fountain, transportAfter: { mode: "walk", duration: "16 min", note: "Walk back to your hotel · or taxi ~8 min" } }),
    ] },

    /* ═══════ LEGOLAND · 12 Dec ═══════ */
    { label: "Day 8", city: "LEGOLAND", subtitle: "Sat 12 Dec · Train to Jinshan · LEGOLAND", color: LEGOLAND, items: [
      leave("go-hze", "07:30", "Check out & to Hangzhou East", "Taxi 30–35 min · ~¥29", { mode: "taxi", duration: "30–35 min", note: "Taxi ~¥29 · or Line 1, 35 min" }, "Check out after an early breakfast (ask the hotel for a breakfast box if needed). Taxi to Hangzhou East, 30–35 minutes, about ¥29."),
      stop("train-js", "08:15", "Train to Jinshan North", "G7502, Hangzhou East 08:15 → Jinshan North (金山北站) 09:09, about ¥55. Backup: G7492 at 07:31 → 08:45.", { icon: TrainFront, iconBg: "#E3F2FD", type: "transport", subtitle: "Direct · 54 min", previewLine: "G7502 · 08:15 → 09:09 · ~¥55", transportAfter: { mode: "taxi", duration: "6 min", note: "Taxi ~¥14 to YaQING" } }),
      stop("yaqing", "~09:20", "YaQING Resort Hotel · drop your bag", "Leave your bag here first: wheeled luggage isn’t allowed inside LEGOLAND. Check that the suitcases sent from Shanghai have arrived.\n\n雅青度假酒店（上海乐高乐园度假区店）· 金山区枫泾镇兰兴路600弄118号", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Booked · 12–13 December", previewLine: "Bags first · 10 minutes from LEGOLAND", pictures: photos.yaqing, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi ~¥15 to LEGOLAND, 乐缤路999号" } }),
      stop("legoland", "~09:45", "LEGOLAND Shanghai", "A whole day of LEGO. For your 5-year-old: Dragon Coaster (from 100 cm), NINJAGO The Ride, the Junior Driving School and Royal Joust. For the little one: the DUPLO play areas, DUPLO Express, the carousel and the miniature cities of Miniland. There are stroller rentals, baby rooms and hot-water points.\n\n上海乐高乐园度假区 · 金山区乐缤路999号", { icon: Castle, iconBg: "#FFF3E0", subtitle: "All day · children under 2 free", previewLine: "Rides, DUPLO play and Miniland", tip: "Our tip: December opening hours aren’t published yet (last year it was 09:00–19:00 on Saturdays). Expect about ¥350–399 per child and ¥439–499 per adult on a winter Saturday; family packs are cheaper. We’ll confirm before you book.", pictures: photos.legoland, transportAfter: { mode: "walk", duration: "5 min", note: "Walk to the 爱琴海缤纷里 mall next door" } }),
      stop("dinner-8", "Evening", "Dinner · next to the park", "The 爱琴海缤纷里 mall is right outside LEGOLAND.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Next to LEGOLAND", restaurants: [
        { name: "港丽餐厅（爱琴海缤纷里店）", englishName: "Charme", cuisine: "Hong Kong café", note: "Noodles, rice dishes and milk tea; easy for children. 乐纷路268号 南里2层.", price: "~¥113 pp", rating: 4.5 },
        { name: "Chili’s（爱琴海缤纷里店）", englishName: "Chili’s", cuisine: "American", note: "Burgers and familiar food if the children want a break from Chinese.", price: "~¥123 pp", rating: 4.3 },
      ], transportAfter: { mode: "taxi", duration: "~8 min", note: "Taxi back to YaQING" } }),
    ] },

    /* ═══════ DISNEY · 13 Dec ═══════ */
    { label: "Day 9", city: "Disney", subtitle: "Sun 13 Dec · Fengjing water town · To Disney", color: DISNEY, items: [
      stop("fengjing", "09:00", "Fengjing Ancient Town (optional)", "A free canal town 20 minutes from your hotel: stone bridges, old houses and the farmers’ paintings Jinshan is known for. Allow 1½–2 hours. The bridges have steps, so carry the stroller over them.\n\n枫泾古镇 · 金山区亭枫公路8588弄28号", { icon: Sun, iconBg: "#E8F5E9", subtitle: "Optional · free · 1½–2 hours", previewLine: "Canals, stone bridges and old houses", pictures: photos.fengjing, transportAfter: { mode: "taxi", duration: "~20 min", note: "Taxi ~¥30 back to YaQING · check out by 12:00" }, alternatives: [
        alt("😴 Slow morning", "Sleep in and rest at the hotel", "After LEGOLAND, have a slow breakfast and a quiet morning before the drive to Disney.", { images: photos.yaqing.slice(1) }),
      ] }),
      leave("go-disney", "12:00", "Check out & to the Disneyland Hotel", "Car 75–100 min · ~¥270–300", { mode: "car", duration: "75–100 min", note: "Book a 6-seat DiDi for the bags · public transport takes about 4 hours" }, "Check out of YaQING with all your bags. Book a 6-seat DiDi (or a car with child seats, if you’d like us to arrange one) to the Shanghai Disneyland Hotel: 75–100 minutes, about ¥270–300. Public transport takes about 4 hours, so a car is the only sensible option."),
      stop("disney-hotel", "~13:45", "Shanghai Disneyland Hotel", "Leave your bags at the hotel; check-in is from 15:00. Pick up the instructions for early park entry tomorrow and the day after.\n\n上海迪士尼乐园酒店 · 浦东新区申迪西路1009号", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Booked · 13–15 December", previewLine: "Check-in from 15:00 · early entry both days", pictures: photos.disneyHotel, transportAfter: { mode: "shuttle", duration: "~15 min", note: "Hotel shuttle or a lakeside walk to Disneytown" } }),
      stop("disneytown", "14:00", "Disneytown & Wishing Star Park", "Lunch and a stroll without a park ticket: Disneytown has restaurants, the LEGO and Disney stores and Christmas decorations, and Wishing Star Park is a calm lakeside walk.\n\n迪士尼小镇 · 星愿公园", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Free · no ticket needed", previewLine: "Christmas decorations and a lakeside walk", pictures: photos.disneytown, restaurants: [
        { name: "新旺茶餐厅（迪士尼小镇店）", englishName: "Sun Wong Kee", cuisine: "Hong Kong café", note: "Noodles, rice dishes and milk tea. Open 08:00–22:00.", price: "~¥79 pp", rating: 4.6 },
      ], transportAfter: { mode: "shuttle", duration: "~15 min", note: "Back to the hotel to check in and rest" } }),
    ] },

    /* ═══════ DISNEY · 14 Dec ═══════ */
    { label: "Day 10", city: "Disney", subtitle: "Mon 14 Dec · Shanghai Disneyland, day 1", color: DISNEY, items: [
      stop("disney-1", "Early entry", "Shanghai Disneyland · Day 1", "As hotel guests you can go in up to an hour before the park opens. Take the hotel shuttle to the Disneytown entrance with your hotel card, tickets and passports.\n\nGood for your 5-year-old: Seven Dwarfs Mine Train (from 97 cm), Peter Pan’s Flight, Pirates of the Caribbean, Soaring Over the Horizon (from 102 cm), Winnie the Pooh, Dumbo and the carousel. The Christmas season should be on.\n\nTickets: children under 3 are free; ages 3–11 pay a child price (about 25% off), so your 5-year-old needs one.", { icon: Castle, iconBg: "#F3E8FF", subtitle: "Early entry · hotel guests", previewLine: "Early entry, then the big rides before the queues", tip: "Our tip: Use Rider Switch so one parent can ride while the other waits with the baby, then swap without queuing again. The Baby Care Center is on Mickey Avenue.", pictures: photos.disney }),
      stop("disney-1pm", "Afternoon", "Parades, favourites & the evening", "Lunch in the park, then a few more favourites, the afternoon parade, and dinner in the park. Stay for the night-time show only if the children are still going strong.", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Afternoon & evening", previewLine: "Parade, favourites and maybe the night show", pictures: photos.disney.slice(1) }),
    ] },

    /* ═══════ DISNEY · 15 Dec ═══════ */
    { label: "Day 11", city: "Disney", subtitle: "Tue 15 Dec · Disneyland, day 2 · To Novotel", color: DISNEY, items: [
      stop("checkout-disney", "Before the park", "Check out & store your bags", "Check out (by 11:00) before you go in. The Bell Desk sends your bags to luggage storage opposite Wishing Star Park’s west gate, about ¥80 per item per day.", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Luggage storage · ~¥80 per item", transportAfter: { mode: "shuttle", duration: "~15 min", note: "Hotel shuttle to the park" } }),
      stop("disney-2", "Early entry", "Shanghai Disneyland · Day 2", "Early entry again, then a relaxed second day for the rides they loved. Without a room today, take it easy after lunch with an indoor show or two.", { icon: Castle, iconBg: "#F3E8FF", subtitle: "Early entry · favourites again", previewLine: "A relaxed second day for favourites", pictures: [photos.disney[1], photos.disney[0]], transportAfter: { mode: "taxi", duration: "15–20 min", note: "Collect your bags · taxi ~¥26 to Novotel" } }),
      stop("novotel", "~18:30", "Novotel Shanghai Chuansha", "Your last night, 17 minutes from the airport. Dinner at the hotel and an early night.\n\n上海浦东川沙诺富特酒店 · 浦东新区川沙路5989号", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Booked · 15–16 December", previewLine: "川沙路5989号 · 17 min from the airport", pictures: photos.novotel }),
    ] },

    /* ═══════ 16 Dec ═══════ */
    { label: "Day 12", city: "Disney", subtitle: "Wed 16 Dec · Flight home", color: DISNEY, items: [] },
  ];

  return {
    cityName: "Shanghai, Suzhou & Hangzhou",
    title: "Family Trip to Shanghai",
    location: "Shanghai · Suzhou · Hangzhou · LEGOLAND · Disney",
    duration: "12 Days · 5–16 Dec",
    heroImage: photos.bund[0],
    overview: [
      { icon: "🦖", label: "Dinosaurs · Science Museum · Aquarium" },
      { icon: "🏯", label: "Yu Garden · Suzhou gardens & canals" },
      { icon: "🌊", label: "West Lake by boat" },
      { icon: "🏰", label: "LEGOLAND · 2 days at Disney" },
    ],
    picks: [],
    meiGreeting: "Here’s your family trip, day by day, with the Chinese name and address of every stop for Amap or DiDi.",
    departure: {
      time: "Wed 16 Dec · 07:00 pickup",
      title: "Pickup to Pudong Airport",
      description: "Your flight to Jakarta leaves Pudong at 10:05. The Novotel is about 17–20 minutes from the airport, so set your booked pickup for about 07:00.",
    },
    departureNote: "Check your terminal on the day before you leave. Safe travels, and message us any time during your trip!",
    days: withOptions ? days : days.map((day) => ({ ...day, items: day.items.map(foldAlternatives) })),
  };
}

/* The main page has no swipe cards: the alternatives become a line at the end
   of the main card instead. */
function foldAlternatives(item: Item): Item {
  if (!item.alternatives?.length) return item;
  const { alternatives, ...rest } = item;
  const lines = alternatives.map((a) => `Other option · ${a.tag} ${a.title}. ${a.description}${a.gettingThere ? ` (${a.gettingThere})` : ""}`);
  return { ...rest, description: [item.description, ...lines].join("\n\n") };
}
