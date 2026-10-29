import { Camera, Car, Castle, Footprints, Hotel, Moon, Plane, Ship, ShoppingBag, Sparkles, Sun, Sunset, TrainFront, Utensils } from "lucide-react";
import type { ItineraryConfig } from "../ItineraryPage";

/* A sample 10-day trip to show leads what a ChinaPal itinerary looks like:
   a couple on their first trip, Beijing → Chongqing → Shanghai, 14–23 April
   2027. Opening days, prices and booking rules come from ChinaPal's
   attractions database (src/data/attractions); the Shanghai stops reuse the
   places checked in Amap for Ardio's page. Taxi fares and flight prices are
   estimates. Photo sources: photo-sources.json. */
type Item = ItineraryConfig["days"][number]["items"][number];
type Alternative = NonNullable<Item["alternatives"]>[number];
const S = (name: string) => `/uploads/itinerary/sample/${name}.webp`;
const A = (name: string) => `/uploads/itinerary/ardio/${name}.webp`;
const BJ = "/uploads/itinerary/beijing";
const CQ = "/uploads/itinerary/chongqing";
const SH = "/uploads/itinerary/shanghai/scraper";

export const photos = {
  hutong: [S("hutong"), S("drum-tower"), `${BJ}/hutong1.jpg`],
  shichahai: [S("shichahai"), `${BJ}/shichahai1.jpg`, `${BJ}/shichahai2.jpg`],
  forbidden: [S("fc-taihe"), `${BJ}/forbidden1.jpg`, S("fc-treasure"), S("fc-west")],
  jingshan: [S("jingshan"), `${BJ}/jingshan1.jpg`],
  beihai: [S("beihai"), S("beihai-2"), `${BJ}/beihai.jpg`],
  mutianyu: [S("mutianyu"), `${BJ}/mutianyu1.jpg`, S("mutianyu-toboggan"), `${BJ}/mutianyu2.jpg`],
  templeOfHeaven: [S("toh"), S("toh-morning"), S("toh-echo")],
  summerPalace: [S("sp-tower"), S("sp-bridge"), S("sp-corridor"), S("sp-boat")],
  lama: [S("lama"), `${BJ}/lama1.jpg`],
  art798: [S("art798"), `${BJ}/art798_1.jpg`],
  hongyadong: [S("hongyadong"), S("hongyadong-2"), `${CQ}/hongyadong2.jpg`],
  jiefangbei: [S("jiefangbei-night"), S("bayi"), S("jiefangbei")],
  ciqikou: [S("ciqikou"), S("ciqikou-2"), S("ciqikou-tea"), S("ciqikou-snacks")],
  liziba: [S("liziba"), S("liziba-2"), `${CQ}/liziba1.jpg`],
  cableway: [`${CQ}/cableway1.jpg`, `${CQ}/cableway2.jpg`, `${CQ}/cableway3.jpg`],
  nanshan: [S("nanshan"), S("nanshan-2")],
  sanxia: [S("sanxia"), S("sanxia-2"), S("greathall")],
  greatHall: [S("greathall"), S("greathall-night")],
  wulong: [S("wulong"), `${CQ}/wulong1.jpg`],
  show1949: [`${CQ}/cq1949-01.png`, `${CQ}/cq1949-02.png`],
  kuixing: ["/uploads/itinerary/giovanni/kuixing-01.jpg", "/uploads/itinerary/giovanni/kuixing-03.jpg"],
  bund: [`${SH}/bund-skyline.jpg`, "/uploads/itinerary/thebund.jpeg", `${SH}/bund-buildings.png`],
  nanjingRoad: [`${SH}/nanjing-road-neon.jpg`, `${SH}/bund-skyline.jpg`],
  lailai: ["/uploads/itinerary/doanhtu/lailai.webp", "/uploads/itinerary/doanhtu/lailai-2.webp"],
  yugarden: [A("yugarden"), `${SH}/yugarden-bridge.jpg`, "/uploads/itinerary/theresa/nanxiang-2.webp"],
  nanxiang: ["/uploads/itinerary/theresa/nanxiang.webp", "/uploads/itinerary/theresa/nanxiang-2.webp"],
  xintiandi: ["/uploads/itinerary/antonio/xintiandi-1.webp", "/uploads/itinerary/antonio/xintiandi-2.webp"],
  cruise: [`${SH}/huangpu-cruise.jpg`, "/uploads/itinerary/doanhtu/lujiazui-bridge.webp"],
  wukang: ["/uploads/itinerary/ruijun/wukang-2.webp", "/uploads/itinerary/xhs/wukang.webp"],
  zhangyuan: [A("zhangyuan"), A("zhangyuan-2")],
  louis: [A("louis-night")],
  jingan: [`${SH}/jingan-temple.jpg`],
  shtower: [S("shtower-top"), `${SH}/shanghai-tower.webp`, "/uploads/itinerary/doanhtu/lujiazui-bridge-2.webp"],
};

const BEIJING = "#D0021B";
const CHONGQING = "#C2410C";
const SHANGHAI = "#1E5AA8";

type StopOptions = Partial<Item> & { pictures?: string[] };
function stop(id: string, time: string, title: string, description: string, { pictures, ...options }: StopOptions = {}): Item {
  return {
    id: `sample-${id}`, time, title, description, icon: Footprints, iconBg: "#FFF0EE", type: "activity", ...options,
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
  { id: "lama", city: "Beijing", title: "Lama Temple · 雍和宫", tag: "Beijing’s busiest temple", image: photos.lama[0], desc: "A working Tibetan Buddhist temple of incense smoke and golden roofs, with an 18-metre Buddha carved from one sandalwood tree.", note: "¥25. Open daily 09:00–17:00, last entry 16:30. Incense is free at the gate. 东城区雍和宫大街12号, Line 2 or 5 to 雍和宫." },
  { id: "798", city: "Beijing", title: "798 Art District", tag: "Galleries in old factories", image: photos.art798[0], desc: "1950s Bauhaus-style factories turned into galleries, design shops, cafés and street art. A good half day if you like contemporary art.", note: "Free to walk around. Most galleries open Tuesday–Sunday 10:00–18:00. 朝阳区酒仙桥路4号." },
  { id: "wulong", city: "Chongqing", title: "Wulong Three Natural Bridges", tag: "A full day · ~2½ hours away", image: photos.wulong[0], desc: "Three giant stone arches over a deep gorge, where Transformers 4 was filmed. You walk along the canyon floor under them.", note: "About ¥95–125, including the park shuttle and the lift down. Open 08:30–16:30. We can book a car for the day. 武隆区银杏大道32号." },
  { id: "1949", city: "Chongqing", title: "Chongqing 1949 show", tag: "An evening show", image: photos.show1949[0], desc: "A huge immersive theatre show about the city in 1949, with rotating stages, projections and the audience moving between sets.", note: "About 75 minutes, in the evening. Tickets sell out, so we book them. Eat before you go: there’s no food inside." },
  { id: "kuixing", city: "Chongqing", title: "Kuixing Building · 魁星楼", tag: "Near Hongyadong · 30 minutes", image: photos.kuixing[0], desc: "Walk in at street level and you are on the 22nd floor. Chongqing’s most famous ‘8D city’ photo, with a sky bridge between two towers.", note: "Free. Easy to add on Day 5 before Hongyadong. Best before 11:00 or after 15:00." },
  { id: "suzhou", city: "Shanghai", title: "A day in Suzhou", tag: "25 minutes by fast train", image: A("zhuozheng"), desc: "Classical gardens, canals and stone bridges: the Humble Administrator’s Garden and Pingjiang Road in one easy day.", note: "Trains from Shanghai Station every few minutes, about ¥46. Swap it in for Day 9 if gardens appeal more than shopping." },
  { id: "museum-east", city: "Shanghai", title: "Shanghai Museum East", tag: "Lujiazui · free", image: S("museum-east"), desc: "The city’s new museum: bronzes, ceramics and calligraphy from 5,000 years of Chinese history, in a building made for it.", note: "Free, book with your passport. Open 10:00–18:00, closed Tuesdays. 浦东新区世纪大道1952号. Fits before Shanghai Tower on Day 9." },
  { id: "disney", city: "Shanghai", title: "Shanghai Disneyland", tag: "A full day · ~45 min away", image: "/uploads/itinerary/shdisney.jpg", desc: "With a whole Zootopia land and the TRON coaster. A day of its own if you add an extra day.", note: "Tickets change price by date, so we check for yours. Line 11 goes straight there." },
];

export function buildSampleConfig(): ItineraryConfig {
  const days: ItineraryConfig["days"] = [
    /* ═══════ BEIJING · 14 Apr ═══════ */
    { label: "Day 1", tryNearby: { spots: [
      { name: "Wenyu Cheese Shop", cn: "文宇奶酪店（南锣鼓巷店）· 南锣鼓巷49号", order: "A cold, silky Beijing milk pudding (奶酪), a recipe from the imperial kitchens. It sells out by the evening.", near: "On Nanluoguxiang", price: "~¥20 pp" },
    ], takeHome: "Beijing pastries from Daoxiangcun (北京稻香村): the date and rose cakes come in pretty gift boxes." }, city: "Beijing", subtitle: "Wed 14 Apr · Arrival · Hutongs & Houhai at sunset", color: BEIJING, items: [
      stop("arrive", "~14:00", "Land in Beijing", "Welcome to China! Allow about an hour for immigration and your bags. Many passports can now visit China without a visa; we check yours when we plan. Follow the signs to the taxi rank, or meet the driver we book for you.", { icon: Plane, iconBg: "#E3F2FD", type: "transport", subtitle: "Beijing Capital Airport (PEK)", previewLine: "Taxi 40–50 min · or the Airport Express", transportAfter: { mode: "taxi", duration: "40–50 min", note: "Taxi ~¥100–120 to your hotel · or the Airport Express to 东直门, 20 min, ¥25, then Line 2" } }),
      stop("hotel-bj", "~16:00", "Your hotel in Dongcheng", "We’d book you near Dongsi (东四), in the old city: walking distance to the hutongs, one metro stop from Nanluoguxiang, and 15 minutes from the Forbidden City. Check in and rest for an hour.", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "4 nights · 14–18 April", previewLine: "Old Beijing, by Dongsi station (Lines 5 & 6)", transportAfter: { mode: "metro", duration: "~15 min", note: "Line 6, one stop: 东四 → 南锣鼓巷 · or taxi ~10 min, ~¥14" } }),
      stop("hutong-walk", "~17:30", "Hutongs & Houhai at sunset", "Your first evening, as one easy walk through old Beijing’s lanes to the lakes: the famous lane, the quiet ones beside it, the Drum Tower, and Houhai as the sun goes down at about 18:50.", { icon: Footprints, iconBg: "#FFF0EE", subtitle: "City walk · ~2 km · free", tip: "Our tip: Rickshaw drivers will offer hutong tours. If you’d like one, agree the price for the whole trip first (about ¥100–180 per person), or ask us to book one.", walk: [
        { name: "Nanluoguxiang · 南锣鼓巷", note: "The best-known hutong, 800 metres of snack shops and little stores. Step into the side lanes like Mao’er Hutong (帽儿胡同) to see where people really live.", place: "东城区南锣鼓巷", image: photos.hutong[0], hero: photos.hutong[0], next: "10 min walk" },
        { name: "Drum & Bell Towers · 鼓楼 · 钟楼", note: "Two towers that kept Beijing’s time for 600 years, facing each other across a little square where locals play shuttlecock in the evening.", place: "东城区钟楼湾胡同", image: photos.hutong[1], next: "5 min walk" },
        { name: "Yandai Xiejie · 烟袋斜街", note: "A crooked old lane named after the long tobacco pipes once sold here, now tea, souvenirs and little cafés.", place: "西城区烟袋斜街", image: S("hutong-snacks"), next: "3 min walk" },
        { name: "Yinding Bridge & Houhai · 银锭桥 · 后海", note: "The little stone bridge between the two lakes, Beijing’s classic sunset spot, with the Western Hills on a clear evening. Walk along the water as the lake bars light up.", place: "西城区什刹海 银锭桥", image: photos.shichahai[0], hero: photos.shichahai[0] },
      ], transportAfter: { mode: "walk", duration: "3 min", note: "Walk along the lake to Kao Rou Ji" } }),
      stop("dinner-1", "~19:00", "Dinner · Kao Rou Ji · 烤肉季", "A Beijing name since 1848, on the edge of the lake.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Old Beijing · by the lake", restaurants: [
        { name: "烤肉季（什刹海店）", englishName: "Kao Rou Ji", cuisine: "Beijing barbecue", note: "Lamb sliced thin and grilled with onions and coriander, wrapped in sesame buns. Ask for a table by the window over the lake. 西城区前海东沿14号.", price: "~¥150 pp" },
        { name: "姚记炒肝店（鼓楼店）", englishName: "Yao Ji Chao Gan", cuisine: "Beijing snacks", note: "For something quick and local: little steamed pork buns (包子) and Beijing’s liver stew (炒肝). A US vice-president ate here in 2011. 鼓楼东大街311号.", price: "~¥40 pp" },
      ], transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi ~¥14 back to your hotel" } }),
    ] },

    /* ═══════ BEIJING · 15 Apr ═══════ */
    { label: "Day 2", tryNearby: { spots: [
      { name: "Wu Yu Tai", cn: "吴裕泰（王府井店）· 王府井大街", order: "Jasmine tea, Beijing’s favourite, and their green-tea soft-serve ice cream.", near: "10 minutes from dinner", price: "~¥20 for an ice cream" },
    ], takeHome: "A tin of jasmine tea from Wu Yu Tai, a Beijing tea shop since 1887." }, city: "Beijing", subtitle: "Thu 15 Apr · Forbidden City · Jingshan · Beihai · Peking duck", color: BEIJING, items: [
      leave("go-fc", "07:50", "To Tiananmen", "Taxi ~15 min · or metro, ~25 min", { mode: "taxi", duration: "~15 min", note: "Taxi ~¥15 to 天安门东 · or Line 5 to 东单, then Line 1 to 天安门东 (Exit B), ~25 min" }, "Taxi to Tiananmen East, about 15 minutes. Cars can’t stop on Chang’an Avenue, so the driver drops you nearby. Or take Line 5 to Dongdan and change to Line 1 for Tiananmen East (Exit B). Bring your passports: there is a security check to walk through Tiananmen."),
      stop("forbidden", "08:30", "The Forbidden City · 故宫", "Home of 24 emperors for nearly 500 years: 980 buildings and courtyard after courtyard of golden roofs. Walk the central axis from the Meridian Gate through the Hall of Supreme Harmony, then turn east into the Treasure Gallery, where it is quieter, and finish in the Imperial Garden. You exit at the north gate; there’s no going back in. ¥60 in April, plus ¥10 for the Treasure Gallery. It’s closed on Mondays, which is why it’s today.\n\n故宫博物院 · 东城区景山前街4号 · 08:30–17:00, last entry 16:10", { icon: Castle, iconBg: "#FFF3E0", subtitle: "¥60 · we book it 7 days ahead", previewLine: "Golden roofs, the throne halls and the Treasure Gallery", tip: "Our tip: Tickets go on sale at 20:00 Beijing time, 7 days before, and sell out in minutes. We book them for you with your passport numbers; your passport is the ticket. For lunch, the Ice Cellar restaurant (冰窖餐厅), in the palace’s old ice store by the Longzong Gate, serves noodles and set meals.", pictures: photos.forbidden, transportAfter: { mode: "walk", duration: "5 min", note: "Cross the road from the north gate to Jingshan Park" } }),
      stop("jingshan", "~13:00", "Jingshan Park · 景山", "A 10-minute climb to the pavilion at the top, for the view everyone wants: the whole Forbidden City’s roofs laid out below. Mid-April is peony season here, so the hillside is in flower.\n\n景山公园 · 西城区景山西街44号 · 06:00–21:00", { icon: Camera, iconBg: "#E8F5E9", subtitle: "¥2 · ¥10 in the peony festival", previewLine: "The Forbidden City’s roofs from above", pictures: photos.jingshan, transportAfter: { mode: "walk", duration: "8 min", note: "Leave by the west gate and walk to Beihai’s east gate" } }),
      stop("beihai", "~14:00", "Beihai Park · 北海公园", "An imperial lake garden, and one of the most relaxing hours in Beijing: walk up to the White Dagoba on Jade Island, then hire a little pedal boat on the lake. Locals sing, dance and practise calligraphy with water on the paths. ¥20 including the White Dagoba.\n\n北海公园 · 西城区文津街1号 · 06:00–21:00", { icon: Sun, iconBg: "#E8F5E9", subtitle: "Lake, boats and the White Dagoba · ¥20", previewLine: "The White Dagoba, the lake and a pedal boat", pictures: photos.beihai, transportAfter: { mode: "taxi", duration: "~15 min", note: "Taxi ~¥14 back to your hotel to rest" } }),
      stop("dinner-2", "~18:00", "Dinner · Peking duck at Siji Minfu", "The meal of the trip in Beijing, a few minutes from the palace’s east gate.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Peking duck · our favourite", restaurants: [
        { name: "四季民福烤鸭店（故宫店）", englishName: "Siji Minfu", cuisine: "Peking duck", note: "Crisp duck carved at your table, with thin pancakes, scallion and sweet bean sauce. Dip the crispy skin in sugar first, the old way. They don’t take bookings, so we take a queue number for you before you arrive. 东城区南池子大街11号.", price: "~¥180 pp", image: S("duck") },
        { name: "大董烤鸭店（南新仓店）", englishName: "Da Dong", cuisine: "Peking duck · smart", note: "The famous modern duck, leaner and more elegant, in a 600-year-old granary. Bookable, and more expensive. 东四十条甲22号.", price: "~¥350 pp" },
      ], transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi ~¥14 back to your hotel · or a walk along Wangfujing first" } }),
    ] },

    /* ═══════ BEIJING · 16 Apr ═══════ */
    { label: "Day 3", city: "Beijing", subtitle: "Fri 16 Apr · The Great Wall at Mutianyu · Zhajiangmian", color: BEIJING, items: [
      leave("go-wall", "07:00", "To the Great Wall", "Private car ~1½ hours · we book it", { mode: "car", duration: "1h20–1h40", note: "Private car with a driver who waits for you, about ¥600–800 for the day" }, "We book a car and driver for the day, about ¥600–800 in total. The driver waits at the car park while you’re on the Wall, which matters here: taxis can’t pick up at Mutianyu, and getting back is the hard part for most visitors. Leave at 07:00 to be there soon after it opens."),
      stop("mutianyu", "~08:30", "The Great Wall at Mutianyu · 慕田峪长城", "The most beautiful restored section near Beijing: 23 watchtowers along a forested ridge, and far fewer people than at Badaling. Take the cable car up to Tower 14 (¥100), then walk east along the Wall to Tower 6, about an hour with photo stops, mostly downhill. From there, ride the toboggan down: a metal slide winding down the mountain (¥100). If you’re fit, walk west from Tower 14 towards Tower 20 first, for the steepest and best views. Allow 2½–3 hours on the Wall. Entry ¥40, plus the shuttle bus from the visitor centre.\n\n慕田峪长城 · 怀柔区渤海镇慕田峪村 · 07:30–18:00", { icon: Castle, iconBg: "#FFF3E0", subtitle: "Cable car up · walk · toboggan down", previewLine: "Watchtowers on a green ridge, and a toboggan down", tip: "Our tip: Wear proper shoes: the steps are steep and uneven. There’s almost nothing to buy on the Wall, so bring water and a snack. The first hour after opening is the quietest.", pictures: photos.mutianyu, transportAfter: { mode: "walk", duration: "10 min", note: "Shuttle bus back to the village by the car park" }, alternatives: [
        alt("🥾 Wilder", "Jinshanling · 金山岭长城", "A longer, unrestored-looking section where you walk for hours with almost no one around. About 2½ hours each way, so it’s a long day; best if hiking is the point.", { images: [`${BJ}/mutianyu3.jpg`], gettingThere: "Private car ~2½ hours · we book it" }),
      ] }),
      stop("lunch-3", "~12:30", "Lunch · Mutianyu village", "Huairou’s mountain streams are known for trout, and the village restaurants by the car park grill it with cumin and chilli.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Grilled trout · farmhouse dishes", restaurants: [
        { name: "慕田峪村农家菜", englishName: "Village farmhouse restaurants", cuisine: "Grilled trout (烤虹鳟鱼)", note: "Several family restaurants next to the car park. Order the trout and a couple of vegetable dishes; your driver knows the good ones.", price: "~¥80–120 pp" },
      ], transportAfter: { mode: "car", duration: "1h20–1h40", note: "Drive back to your hotel to rest" } }),
      stop("dinner-3", "~18:30", "Dinner · Zhajiangmian in the hutongs", "Beijing’s own noodles, in a little hutong shop.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Beijing noodles · cheap and good", restaurants: [
        { name: "方砖厂69号炸酱面", englishName: "Fangzhuanchang No. 69", cuisine: "Zhajiangmian", note: "Hand-pulled noodles with a rich fried pork-and-bean sauce and fresh vegetables you stir in yourself. There’s usually a queue, but it moves fast. 东城区方砖厂胡同69号, by Nanluoguxiang.", price: "~¥40 pp", image: S("zhajiang") },
      ], transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to your hotel · or the acrobatics show" } }),
      stop("acrobats", "19:15", "Beijing acrobatics (optional)", "If you still have energy after the Wall: a show of plate-spinning, contortion, and eight motorbikes in a steel globe, at the Chaoyang Theatre. About 70 minutes, from about ¥180. There are two shows a night, and we book seats for the one that fits.\n\n朝阳剧场 · 朝阳区东三环北路36号", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Optional · ~70 minutes", previewLine: "Plate-spinning, contortion and motorbikes in a globe", transportAfter: { mode: "taxi", duration: "~20 min", note: "Taxi ~¥25 back to your hotel" } }),
    ] },

    /* ═══════ BEIJING · 17 Apr ═══════ */
    { label: "Day 4", city: "Beijing", subtitle: "Sat 17 Apr · Temple of Heaven · Summer Palace · Copper-pot hotpot", color: BEIJING, items: [
      leave("go-toh", "07:30", "To the Temple of Heaven", "Line 5 direct, ~20 min · or taxi ~20 min", { mode: "metro", duration: "~20 min", note: "Line 5 东四 direct to 天坛东门 (Exit A), 7 stops · or taxi ~20 min, ~¥20" }),
      stop("toh", "07:50", "Temple of Heaven · 天坛", "Come early for the best part: from 6am the park fills with locals doing tai chi, ballroom dancing, singing in choirs and playing cards under the long corridor. At 08:00 the halls open: the round, blue-roofed Hall of Prayer for Good Harvests, the Echo Wall and the Circular Mound altar. Get the combination ticket (¥34); the ¥15 one doesn’t let you into any of the buildings.\n\n天坛公园 · 东城区天坛东里甲1号（东门）· park 06:00–22:00", { icon: Sun, iconBg: "#FFF3E0", subtitle: "Combination ticket ¥34 · halls from 08:00", previewLine: "Tai chi in the park, then the Hall of Prayer", tip: "Our tip: Tickets are booked in a Chinese WeChat mini-program with your passport, so we do it for you. The halls close on Mondays; the park doesn’t.", pictures: photos.templeOfHeaven, transportAfter: { mode: "taxi", duration: "50–60 min", note: "Taxi ~¥80 to the Summer Palace’s East Palace Gate · or metro, ~70 min" }, alternatives: [
        alt("🙏 Temples", "Lama Temple · 雍和宫", "Prefer incense and monks to parks? Beijing’s great Tibetan Buddhist temple opens at 09:00, two metro stops from your hotel. ¥25.", { images: photos.lama, gettingThere: "Line 5, 2 stops: 东四 → 雍和宫 · 东城区雍和宫大街12号" }),
      ] }),
      stop("summer-palace", "~11:00", "The Summer Palace · 颐和园", "The emperors’ summer escape: a lake, a hill of temples and the 728-metre painted Long Corridor. Walk the corridor to the Marble Boat, climb to the Tower of Buddhist Incense for the view, then take a boat across Kunming Lake to the 17-Arch Bridge (¥30–40). In April the peach trees are flowering along the West Causeway. Snacks on Suzhou Street for lunch. ¥60 for the full ticket.\n\n颐和园 · 海淀区新建宫门路19号 · 06:00–19:00, last entry 17:00", { icon: Ship, iconBg: "#E3F2FD", subtitle: "¥60 full ticket · allow 3–4 hours", previewLine: "The Long Corridor, the lake and the 17-Arch Bridge", tip: "Our tip: It’s much bigger than it looks: 10,000–15,000 steps. Take the boat across the lake to save your legs, and wear your most comfortable shoes.", pictures: photos.summerPalace, transportAfter: { mode: "taxi", duration: "50–60 min", note: "Taxi ~¥90 back to your hotel" } }),
      stop("dinner-4", "~18:30", "Dinner · Copper-pot hotpot", "Beijing’s own hotpot: mild, with paper-thin lamb, nothing like Chongqing’s. A good contrast before tomorrow.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Old Beijing · mild", restaurants: [
        { name: "东来顺饭庄（王府井店）", englishName: "Dong Lai Shun", cuisine: "Copper-pot mutton hotpot (涮羊肉)", note: "Charcoal copper pots of clear broth since 1903. Swish the lamb for a few seconds, then dip it in sesame sauce. 王府井大街198号 新东安市场5楼.", price: "~¥150 pp" },
      ], transportAfter: { mode: "walk", duration: "~15 min", note: "Walk down Wangfujing, then taxi ~¥14 back to your hotel" } }),
    ] },

    /* ═══════ CHONGQING · 18 Apr ═══════ */
    { label: "Day 5", tryNearby: { spots: [
      { name: "Hao You Lai", cn: "好又来酸辣粉 · 八一好吃街", order: "Chongqing’s famous sour-and-spicy sweet-potato noodles (酸辣粉). Expect a short queue.", near: "On the Bayi food street, by Jiefangbei", price: "~¥15 pp" },
    ] }, city: "Chongqing", subtitle: "Sun 18 Apr · Fly to Chongqing · Hotpot · Hongyadong at night", color: CHONGQING, items: [
      leave("go-pek", "08:30", "Check out & to the airport", "Taxi 40–50 min · ~¥100–120", { mode: "taxi", duration: "40–50 min", note: "Taxi ~¥100–120 to Beijing Capital Airport" }),
      stop("flight-cq", "~10:30", "Flight to Chongqing", "About 2 hours 50 minutes, with flights every hour or so; roughly ¥700–1,300 per person in economy. There are fast trains too, but they take 7 hours or more, so flying saves most of a day. We pick the flight and help you book it.", { icon: Plane, iconBg: "#E3F2FD", type: "transport", subtitle: "Beijing → Chongqing Jiangbei (CKG)", previewLine: "~2h50 · lands about 13:20", transportAfter: { mode: "taxi", duration: "40–50 min", note: "Taxi ~¥70 to your hotel by Jiefangbei" } }),
      stop("hotel-cq", "~14:30", "Your hotel by Jiefangbei", "We’d book you in the city centre, by Jiefangbei: Hongyadong, the cableway and the food streets are all a walk away. Chongqing is built on mountains, so ‘a walk’ often includes stairs and lifts.", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "2 nights · 18–20 April", previewLine: "City centre · walk to Hongyadong", transportAfter: { mode: "walk", duration: "~5 min", note: "Walk to the Jiefangbei monument" } }),
      stop("jiefangbei", "~16:00", "Jiefangbei & the food streets", "Chongqing’s heart: a war memorial clock tower surrounded by skyscrapers and giant screens, and the Bayi food street (八一好吃街) one block away. Snack your way down it, then head back to rest before dinner.\n\n解放碑 · 渝中区邹容路100号", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Free · snacks on Bayi street", previewLine: "Skyscrapers, giant screens and street food", pictures: photos.jiefangbei, transportAfter: { mode: "walk", duration: "~10 min", note: "Walk to dinner" } }),
      stop("dinner-5", "~18:00", "Dinner · Chongqing hotpot", "Hotpot was born here. Go at 18:00, before the evening queues.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Hotpot · as spicy as you like", tip: "Our tip: Order a split pot (鸳鸯锅), one side spicy and one side mild, and ask for 微辣 (mildly spicy): even that is hot here. Try the tripe (毛肚): dip it up and down for about 15 seconds and it’s done.", restaurants: [
        { name: "珮姐老火锅", englishName: "Pei Jie", cuisine: "Chongqing hotpot", note: "One of the city’s best-known hotpot names, with a rich beef-tallow broth. Several branches; we’d pick the one nearest your hotel.", price: "~¥120 pp", image: S("hotpot") },
        { name: "周师兄大刀腰片", englishName: "Zhou Shixiong", cuisine: "Chongqing hotpot", note: "Locals’ favourite, famous for its knife-cut kidney slices and fresh duck intestine. Always busy.", price: "~¥120 pp" },
      ], transportAfter: { mode: "walk", duration: "~10 min", note: "Walk to the top entrance of Hongyadong, on Cangbai Road" } }),
      stop("hongyadong", "~19:45", "Hongyadong at night · 洪崖洞", "An 11-storey stilt-house complex built down the cliff to the river, lit up gold after dark: people call it the real-life Spirited Away. You go in at the top, at street level, and walk down through the floors of shops and snacks to the river. Then cross the Qianximen Bridge on foot for the famous view of the whole building lit up.\n\n洪崖洞 · 渝中区嘉陵江滨江路88号 · lights ~19:00–23:00", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Free · lit up after sunset", previewLine: "The cliffside building glowing gold", tip: "Our tip: It is very crowded on weekend evenings, so keep your phone and wallet in a front pocket. Taking the stairs is quicker than the lifts. Taxis are hard to get here at night, so walk back: it’s 10 minutes to your hotel.", pictures: photos.hongyadong, transportAfter: { mode: "walk", duration: "~10 min", note: "Walk back to your hotel" }, alternatives: [
        alt("🛳 From the water", "Two-rivers night cruise", "See Hongyadong and the skyline from a boat where the Jialing and Yangtze rivers meet. About an hour, from about ¥138.", { images: [S("hongyadong-2")], gettingThere: "Chaotianmen pier, 10 min walk · 朝天门码头" }),
      ] }),
    ] },

    /* ═══════ CHONGQING · 19 Apr ═══════ */
    { label: "Day 6", tryNearby: { spots: [
      { name: "Chen Mahua", cn: "陈昌银麻花 · 磁器口古镇", order: "Crunchy twisted dough sticks (麻花), sweet or spicy. Free tastings at the counter.", near: "On Ciqikou’s main street", price: "~¥20 a bag" },
    ], takeHome: "A bag of Ciqikou mahua, or a hotpot base (火锅底料) to make Chongqing hotpot at home." }, city: "Chongqing", subtitle: "Mon 19 Apr · Ciqikou · Liziba monorail · Yangtze cableway · Nanshan night view", color: CHONGQING, items: [
      leave("go-ciqikou", "08:30", "To Ciqikou", "Line 1, ~30 min, ¥4 · or taxi ~30 min", { mode: "metro", duration: "~30 min", note: "Line 1 小什字 or 较场口 → 磁器口, ¥4 · or taxi ~30 min, ~¥35" }),
      stop("ciqikou", "09:00", "Ciqikou Old Town · 磁器口", "A thousand-year-old river port of stone lanes and wooden houses. Go early, before the crowds: by 11:00 the main street is packed. Wander the quieter side lanes, climb to Baolun Temple, and sit in a teahouse with a bowl of tea.\n\n磁器口古镇 · 沙坪坝区磁南街1号 · free", { icon: Sun, iconBg: "#FFF3E0", subtitle: "Free · best before 11:00", previewLine: "Stone lanes, teahouses and street snacks", tip: "Our tip: If someone invites you into a tea shop for a ‘free tasting’, say no thank you: some charge hundreds of yuan afterwards. Stick to teahouses with prices on the wall.", pictures: photos.ciqikou, transportAfter: { mode: "taxi", duration: "~20 min", note: "Taxi ~¥25 to Liziba" }, alternatives: [
        alt("🏞 Nature day", "Wulong Three Natural Bridges", "Swap today for a day trip to the giant stone arches and gorges where Transformers 4 was filmed. About 2½ hours each way by car, which we book.", { images: photos.wulong, gettingThere: "Private car ~2½ hours · 武隆区银杏大道32号" }),
      ] }),
      stop("lunch-6", "~11:45", "Lunch · Liziba Liangshan Chicken", "A Chongqing classic, right by the monorail.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Spicy chicken pot · local favourite", restaurants: [
        { name: "李子坝梁山鸡", englishName: "Liziba Liangshan Chicken", cuisine: "Chongqing · spicy", note: "A bubbling pot of chicken with chillies and Sichuan pepper, then noodles or vegetables in the sauce at the end. Ask for 微辣. On 李子坝正街, a few minutes from the viewing platform.", price: "~¥80 pp" },
      ], transportAfter: { mode: "walk", duration: "5 min", note: "Walk to the Liziba viewing platform" } }),
      stop("liziba", "~13:00", "Liziba · the train through a building", "Line 2’s monorail runs straight through the middle of a 19-storey apartment block, with a station inside it. Watch a couple of trains go through from the platform below, then ride it yourself along the river.\n\n李子坝轻轨站观景台 · 渝中区李子坝正街39号 · free", { icon: TrainFront, iconBg: "#E3F2FD", subtitle: "Free · a train every few minutes", previewLine: "A monorail through an apartment block", tip: "Our tip: For the best video, ride Line 2 and stand at the front of the first carriage as it goes into the building.", pictures: photos.liziba, transportAfter: { mode: "taxi", duration: "~5 min", note: "Taxi ~¥10 up the hill to Eling Er Chang · or a 15-min climb" } }),
      stop("eling", "~14:00", "Eling Er Chang · 鹅岭二厂", "An old printing factory on the hilltop, turned into cafés, little shops and a rooftop with a view down over the river. A calm break in the afternoon.\n\n鹅岭二厂文创公园 · 渝中区鹅岭正街1号", { icon: Camera, iconBg: "#E8F5E9", subtitle: "Cafés with a view · free", previewLine: "Rooftop cafés above the river", transportAfter: { mode: "taxi", duration: "~15 min", note: "Taxi ~¥15 back to your hotel to rest" } }),
      stop("cableway", "~18:00", "Yangtze River Cableway · 长江索道", "A retro cable car across the Yangtze, built in 1987 as public transport. Four minutes in the air with the skyline all around you, as the sun sets at about 19:20. Take it one way (¥20) to the south bank.\n\n长江索道北站 · 渝中区新华路151号 · 08:00–22:00", { icon: Sunset, iconBg: "#FFF3E0", subtitle: "¥20 one way · sunset over the river", previewLine: "Across the Yangtze in a retro cable car", tip: "Our tip: The sunset queue can take 30–60 minutes. Get on first and stand at a window. We check the live queue for you on the day.", pictures: photos.cableway, transportAfter: { mode: "taxi", duration: "~25 min", note: "Taxi ~¥40 up Nanshan from the south station" } }),
      stop("nanshan", "~19:30", "Dinner & the night view from Nanshan", "Up the mountain on the south bank: first spring-water chicken (泉水鸡), Nanshan’s own dish, in one of the farmhouse restaurants along the road; then the One Tree viewpoint, for the whole lit-up city between its two rivers.\n\n南山一棵树观景台 · 南岸区南山风景区 · 09:00–22:30 · ¥30", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Chongqing’s best night view · ¥30", previewLine: "The whole city lit up between two rivers", tip: "Our tip: Taxis are hard to find up here at night. Book your DiDi back before you’re ready to leave, or ask us and we’ll arrange a car. If it’s foggy, we’ll swap tonight with another evening.", pictures: photos.nanshan, transportAfter: { mode: "taxi", duration: "~30 min", note: "DiDi ~¥50 back to your hotel" } }),
    ] },

    /* ═══════ CHONGQING → SHANGHAI · 20 Apr ═══════ */
    { label: "Day 7", tryNearby: { spots: [
      { name: "Shen Da Cheng", cn: "沈大成（南京东路店）· 南京路步行街636号 · 07:30–22:00", order: "Old Shanghai sweets: soft glutinous rice cakes like 双酿团 and 条头糕.", near: "On tonight’s Nanjing Road walk", price: "~¥43 pp" },
    ], takeHome: "White Rabbit milk candy and Shanghai snacks from the No.1 Food Store (上海市第一食品商店, 南京东路720号), on the same walk." }, city: "Shanghai", subtitle: "Tue 20 Apr · Three Gorges Museum · Fly to Shanghai · The Bund at night", color: SHANGHAI, items: [
      stop("sanxia", "09:00", "Three Gorges Museum · 三峡博物馆", "The story of the Yangtze, the Three Gorges and the city, including the years Chongqing was China’s wartime capital. Free; book in their WeChat mini-program with your passport, which we do for you. It’s closed on Mondays, so we kept it for today. Across the square is the Great Hall of the People, a palace-like 1950s hall with a blue dome, for photos.\n\n重庆中国三峡博物馆 · 渝中区人民路236号 · 09:00–17:00", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Free · English audio guide ¥20", previewLine: "The Yangtze, the Gorges and wartime Chongqing", pictures: photos.sanxia, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi ~¥12 back towards your hotel for lunch" } }),
      stop("lunch-7", "~11:30", "Lunch · Chongqing noodles", "Before you leave: a bowl of xiaomian (小面), the noodles Chongqing eats for breakfast, lunch and late at night.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Noodles · quick and cheap", restaurants: [
        { name: "花市豌杂面", englishName: "Huashi Wan Za Mian", cuisine: "Chongqing noodles", note: "Noodles with soft yellow peas and crispy minced pork, spicy or not. Order 豌杂面, and 不辣 if you’ve had enough chilli.", price: "~¥20 pp" },
      ], transportAfter: { mode: "taxi", duration: "40–50 min", note: "Collect your bags · taxi ~¥70 to Chongqing airport" } }),
      stop("flight-sh", "~14:30", "Flight to Shanghai", "About 2 hours 20 minutes to Hongqiao, the airport closest to the city centre; roughly ¥600–1,200 per person. We pick the flight that fits.", { icon: Plane, iconBg: "#E3F2FD", type: "transport", subtitle: "Chongqing → Shanghai Hongqiao (SHA)", previewLine: "~2h20 · lands about 16:50", transportAfter: { mode: "taxi", duration: "35–45 min", note: "Taxi ~¥85 to your hotel · or Line 2 direct to 南京东路, ~45 min" } }),
      stop("hotel-sh", "~17:45", "Your hotel by Nanjing Road", "We’d book you near Nanjing Road East: a 10-minute walk to the Bund, and on Lines 2 and 10, which go straight to almost everything on Days 8–10, including the airport train.", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "3 nights · 20–23 April", previewLine: "Walk to the Bund · Lines 2 & 10", transportAfter: { mode: "walk", duration: "~12 min", note: "Walk to Lai Lai Xiao Long, 天津路506号" } }),
      stop("dinner-7", "18:30", "Dinner · Lai Lai Xiao Long", "Shanghai soup dumplings, one block north of Nanjing Road, to start Shanghai.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Soup dumplings · arrive by 19:00", restaurants: [
        { name: "莱莱小笼", englishName: "Lai Lai Xiao Long", cuisine: "Shanghai xiaolongbao", note: "Michelin Bib Gourmand. Order at the counter, then share a table. Bite a little hole and drink the soup first. Open until 20:00. 天津路506号.", price: "~¥60–100 pp", image: photos.lailai[1] },
        { name: "馋三尺蟹粉小笼（人民广场店）", englishName: "Chan San Chi", cuisine: "Crab-roe soup dumplings", note: "If Lai Lai has a long queue: paper-thin dumplings with golden crab broth. 5 minutes’ walk from Lai Lai. 西藏中路500号.", price: "~¥50 pp", image: A("r-chansanchi") },
      ], transportAfter: { mode: "walk", duration: "~20 min", note: "Walk down Nanjing Road to the Bund" } }),
      stop("bund-night", "~19:30", "Nanjing Road & the Bund at night", "Walk down Nanjing Road’s pedestrian street, all lit up, to the river. At the end is the Bund: the 1920s banks glowing gold on your side, and the Lujiazui skyscrapers across the water. Three cities in one trip, and this is the view people remember.\n\n南京路步行街 → 外滩 · 黄浦区中山东一路", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Free · Shanghai’s famous skyline", previewLine: "The skyline lit up on your first night", pictures: [...photos.nanjingRoad.slice(0, 1), ...photos.bund], transportAfter: { mode: "walk", duration: "~12 min", note: "Walk back to your hotel" } }),
    ] },

    /* ═══════ SHANGHAI · 21 Apr ═══════ */
    { label: "Day 8", tryNearby: { spots: [
      { name: "Da Hu Chun", cn: "大壶春（豫园店）· 豫园老街64号 · 08:30–21:30", order: "Shanghai pan-fried pork buns (生煎) with a crisp golden base.", near: "In the Yu Garden bazaar", price: "~¥40 pp" },
      { name: "Shu Cai Ji", cn: "舒蔡记生煎菜饭 · 淮海中路462弄口 · 07:00–19:30", order: "A tiny local favourite for pan-fried buns (生煎) and Shanghai vegetable rice (菜饭).", near: "On Huaihai Road, near the start of your walk", price: "~¥25 pp" },
    ] }, city: "Shanghai", subtitle: "Wed 21 Apr · Yu Garden · Huaihai Road walk · River cruise at night", color: SHANGHAI, items: [
      leave("go-yu", "08:40", "To Yu Garden", "Line 10, one stop, ~15 min · or taxi ~10 min", { mode: "metro", duration: "~15 min", note: "Line 10 南京东路 → 豫园 (Exit 7), one stop · or taxi ~10 min, ~¥14" }),
      stop("yugarden", "09:00", "Yu Garden · 豫园", "A Ming-dynasty garden of pavilions, rockeries and koi ponds in the old town. Go at opening, before the crowds. About ¥40 in April.\n\n上海豫园 · 黄浦区福佑路168号 · 09:00–16:30", { icon: Sun, iconBg: "#FFF3E0", subtitle: "~¥40 · book with your passports", previewLine: "Pavilions, rockeries and koi ponds", tip: "Our tip: Tickets are booked on the “上海豫园” WeChat account with your passports. We do it for you a few days ahead.", pictures: photos.yugarden, transportAfter: { mode: "walk", duration: "5 min", note: "Walk through the bazaar to Nanxiang" } }),
      stop("lunch-8", "~10:30", "Early lunch · Nanxiang Mantou Dian", "Shanghai’s most famous xiaolongbao, right by the garden.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Soup dumplings · arrive before 10:30", restaurants: [
        { name: "南翔馒头店（城隍庙店）", englishName: "Nanxiang Mantou Dian", cuisine: "Xiaolongbao", note: "Michelin Bib Gourmand. Sit upstairs rather than queuing for the takeaway window. Get there before 10:30 to beat the queue. 豫园路87号.", price: "~¥60–100 pp", image: photos.nanxiang[0] },
        { name: "绿波廊", englishName: "Lu Bo Lang", cuisine: "Shanghai dim sum", note: "For a proper sit-down meal: Shanghai dishes and little pastries, also Bib Gourmand. Open 11:00–16:00. 豫园路115号.", price: "~¥150 pp" },
      ], transportAfter: { mode: "taxi", duration: "15–18 min", note: "Taxi ~¥14 to Xintiandi · or Line 14, one stop: 豫园 (Exit 7) → 一大会址·黄陂南路 (Exit 2), 30 min" } }),
      stop("huaihai-walk", "~11:45", "Xintiandi & Huaihai Road", "Your free afternoon, as an easy walk west along Huaihai Road, Shanghai’s big shopping street, with the local names people come for, one after another.", { icon: ShoppingBag, iconBg: "#FFF0EE", subtitle: "City walk · ~1.4 km · free time", walk: [
        { name: "Xintiandi · 新天地", note: "Old stone-gate lanes of cafés, shops and restaurants, with the Xintiandi Style and K11 malls next door.", place: "上海新天地 · 黄浦区太仓路181弄", image: photos.xintiandi[0], next: "9 min walk" },
        { name: "Matcha Wang", note: "The viral latte with little lambs drawn in the foam, about ¥34. Grab-and-go.", place: "淮海中路550号 HAI550 1楼 · 10:00–22:00", image: A("matchawang"), next: "5 min walk" },
        { name: "Adidas Brand Center", note: "Adidas’s big Shanghai flagship on Huaihai Road.", place: "阿迪达斯（淮海路品牌中心）· 淮海中路691号 · 10:00–22:00", image: A("adidas-huaihai"), next: "4 min walk" },
        { name: "HAUS NOWHERE", note: "Gentle Monster’s flagship: the giant robotic face, sunglasses, and Nudake’s pastries displayed like sculptures.", place: "淮海中路798号 · 10:00–22:00", image: A("haus-face"), next: "1 min walk" },
        { name: "Songmont · 山下有松", note: "The Chinese designer bag brand, in a store built to feel like rocks and pine forest.", place: "Songmont山下有松（淮海中路店）· 淮海中路817-821号 · 10:00–22:00", image: A("songmont-huaihai") },
      ], transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to your hotel to rest · or straight on to dinner" } }),
      stop("dinner-8", "~17:30", "Dinner · Yuan Yuan · 圆苑", "Shanghai’s famous red-braised pork, a few minutes from Xintiandi.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Shanghainese", restaurants: [
        { name: "圆苑（淮海路店）", englishName: "Yuan Yuan", cuisine: "Shanghainese", note: "Order the red-braised pork belly (红烧肉) and pour the sauce over your rice. We book a table for you. 淮海中路222号 力宝广场2楼.", price: "~¥180 pp", image: A("r-yuanyuan") },
      ], transportAfter: { mode: "taxi", duration: "~15 min", note: "Taxi ~¥16 to Shiliupu pier" } }),
      stop("cruise", "~19:00", "Huangpu River Cruise", "About 45 minutes on the river from Shiliupu pier, once the lights are on: the Bund on one side, Lujiazui’s towers on the other. Night cruises leave every half hour or so; about ¥100–150 per person.\n\n十六铺旅游码头 · 黄浦区中山东二路531号", { icon: Ship, iconBg: "#EDE7F6", subtitle: "Both skylines lit up, from the water", previewLine: "The Bund and Lujiazui lit up, from the water", pictures: photos.cruise, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi ~¥14 back to your hotel · or a 20-min walk along the Bund" } }),
    ] },

    /* ═══════ SHANGHAI · 22 Apr ═══════ */
    { label: "Day 9", tryNearby: { spots: [
      { name: "Xinya Tea House", cn: "新雅（丰盛里店）· 茂名北路281弄 · 11:00–16:00", order: "Cantonese dim sum and pastries in a Shanghai institution.", near: "Next to Zhangyuan", price: "~¥126 pp" },
      { name: "BUTTERFUL & CREAMOROUS", cn: "BUTTERFUL&CREAMOROUS（上海旗舰店）· 吴江路289号 · 11:00–22:00", order: "A popular bakery for fresh butter breads and pastries.", near: "3 minutes from Zhangyuan", price: "~¥45 pp" },
    ] }, city: "Shanghai", subtitle: "Thu 22 Apr · Wukang Road · Zhangyuan · The Louis · Shanghai Tower at sunset", color: SHANGHAI, items: [
      leave("go-wukang", "08:30", "To Wukang Road", "Line 10 direct, ~25 min · or taxi ~25 min", { mode: "metro", duration: "~25 min", note: "Line 10 南京东路 direct to 交通大学 (Exit 7), then a 7-min walk to Wukang Mansion · or taxi ~25 min, ~¥30" }),
      stop("wukang-walk", "~09:00", "Wukang Road & Anfu Road", "Your morning, as one easy walk through the prettiest part of old Shanghai: the famous building while it’s quiet, breakfast at the bakery, then up leafy Wukang Road to the cafés and shops of Anfu Road. Most shops open at about 10:00.", { icon: Footprints, iconBg: "#FFF0EE", subtitle: "City walk · ~1.7 km · morning", tip: "Our tip: Wukang Mansion is a residential building, so take photos from the street. The traffic island opposite gives the classic view.", walk: [
        { name: "Wukang Mansion · 武康大楼", note: "Shanghai’s most photographed building, a 1924 wedge on a corner of plane-tree streets.", place: "徐汇区淮海中路1850号", image: photos.wukang[0], hero: photos.wukang[0], next: "2 min walk" },
        { name: "The “Harry Potter” bakery · Apoli", note: "An Italian bakery that looks like a wizard’s kitchen: stone walls, arched windows and lanterns. Have breakfast here.", place: "APOLI ITABAKERY · 兴国路380号 · 09:00–21:00", image: A("apoli"), hero: A("apoli"), next: "16 min walk up Wukang Road" },
        { name: "Adidas Originals", note: "The Originals flagship on Anfu Road.", place: "阿迪达斯（上海安福路店）· 安福路322号 · 10:00–22:00", image: A("adidas-anfu"), next: "same courtyard" },
        { name: "13DE MARZO · the teddy-bear café", note: "Giant teddy bears climbing out of the windows, with a café downstairs and a shop upstairs.", place: "13DE MARZO（上海安福路店）· 安福路322号4号楼 · 10:00–21:30", image: A("anfu-market"), next: "6 min walk" },
        { name: "LOOKNOW & FLOW", note: "A buyer shop for Chinese and international designer labels.", place: "安福路168号 · 10:00–21:00", image: A("looknow") },
      ], transportAfter: { mode: "taxi", duration: "~7 min", note: "Taxi ~¥14 back to Rose Hall, 兴国路372弄 · or a 20-min walk" } }),
      stop("lunch-9", "~12:00", "Lunch · Rose Hall · 玫瑰厅", "Shanghai cooking in a century-old mansion, next door to the bakery.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Shanghainese · in a 1920s mansion", restaurants: [
        { name: "玫瑰厅上海菜（兴国路店）", englishName: "Rose Hall", cuisine: "Shanghainese", note: "Inside the former home of shipping magnate Y. K. Pao: brick walls, chandeliers and a garden courtyard. We book for 12:00. 兴国路372弄1号.", price: "~¥216 pp", image: A("r-rosehall") },
      ], transportAfter: { mode: "taxi", duration: "~20 min", note: "Taxi ~¥20 to Zhangyuan, 茂名北路258号" } }),
      stop("zhangyuan", "~13:45", "Zhangyuan · 张园", "Shanghai’s largest group of old stone-gate (shikumen) lane houses, restored into quiet lanes of flagship shops, pop-ups and cafés. This is where Shanghai shops now.\n\n张园 · 静安区茂名北路258号 · 南京西路 station, Exit 13", { icon: ShoppingBag, iconBg: "#FFF0EE", subtitle: "Free time · shopping in restored lanes", previewLine: "Restored 1900s lanes, flagship shops and cafés", pictures: photos.zhangyuan, transportAfter: { mode: "walk", duration: "8 min", note: "Walk along Nanjing West Road to The Louis, 南京西路789号" } }),
      stop("louis", "~14:45", "The Louis · Louis Vuitton’s ship", "A full-size silver ocean liner built onto Nanjing West Road, with a free exhibition on Louis Vuitton’s history of travel inside. Allow about an hour.\n\nLV路易威登非凡之旅 · 静安区南京西路789号 兴业太古汇 · 10:00–22:00", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Free · we book the time slot", previewLine: "A silver ocean liner on Nanjing West Road", tip: "Our tip: Entry is free, but time slots are booked in the “My LV” WeChat mini-program, one per person. We book them a few days ahead.", pictures: photos.louis, transportAfter: { mode: "metro", duration: "~10 min", note: "Line 2 南京西路 → 静安寺, one stop · or a 15-min walk" } }),
      stop("jingan", "~16:00", "Jing’an Temple · 静安寺", "A golden Buddhist temple in the middle of the skyscrapers. Ten minutes of calm, and one of Shanghai’s best photos. ¥50.\n\n静安寺 · 静安区南京西路1686号 · 07:30–17:00", { icon: Camera, iconBg: "#FFF3E0", subtitle: "¥50 · go in before 16:30", previewLine: "Golden roofs among the skyscrapers", pictures: photos.jingan, transportAfter: { mode: "walk", duration: "~5 min", note: "Walk to Renhe Guan, 愚园路142号" } }),
      stop("dinner-9", "~17:00", "Early dinner · Renhe Guan · 人和馆", "Famous Shanghai home cooking, by Jing’an Temple.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Shanghainese", restaurants: [
        { name: "人和馆（静安寺店）", englishName: "Renhe Guan", cuisine: "Shanghainese", note: "Classic Shanghai dishes like red-braised pork and smoked fish. Popular, so we book for 17:00, when it opens. 愚园路142号.", price: "~¥154 pp" },
        { name: "吉品小鲜Jhouse（静安店）", englishName: "Jhouse", cuisine: "Shanghainese · Zhejiang seafood", note: "If Renhe Guan is full: the yellow croaker with fried dough sticks (绝味吉品黄鱼), 3 minutes away. 南京西路1818号 1788广场2楼.", price: "~¥210 pp", image: A("r-jhouse") },
      ], transportAfter: { mode: "metro", duration: "~20 min", note: "Line 2 静安寺 → 陆家嘴, 5 stops (Exit 6) · or taxi ~25 min, ~¥35" } }),
      stop("shtower", "~18:15", "Shanghai Tower at sunset · 上海中心", "The 118th floor of China’s tallest building, 546 metres up, reached by one of the world’s fastest lifts. Arrive just before the 18:26 sunset and stay as the whole city lights up below you. ¥180.\n\n上海中心大厦 · 浦东新区陆家嘴银城中路501号 · 08:30–22:00", { icon: Sunset, iconBg: "#FFF3E0", subtitle: "¥180 · the sun sets at about 18:26", previewLine: "The whole city lighting up, 546 metres below", pictures: photos.shtower, transportAfter: { mode: "metro", duration: "~10 min", note: "Line 2 陆家嘴 → 南京东路, one stop, back to your hotel" } }),
    ] },

    /* ═══════ SHANGHAI · 23 Apr ═══════ */
    { label: "Day 10", city: "Shanghai", subtitle: "Fri 23 Apr · Last morning · The Maglev to Pudong", color: SHANGHAI, items: [
      stop("last-morning", "~09:30", "Last morning on Nanjing Road", "A slow breakfast, then last presents: White Rabbit candy and Shanghai snacks at the No.1 Food Store, and old Shanghai sweets at Shen Da Cheng, both on Nanjing Road East.\n\n上海市第一食品商店 · 南京东路720号", { icon: ShoppingBag, iconBg: "#FFF0EE", subtitle: "Free time · presents to take home", previewLine: "White Rabbit candy and Shanghai sweets", pictures: [photos.nanjingRoad[0]], transportAfter: { mode: "walk", duration: "~10 min", note: "Back to the hotel to check out" } }),
      leave("go-maglev", "~12:00", "Check out & to the Maglev", "Line 2 direct to 龙阳路, ~25 min", { mode: "metro", duration: "~25 min", note: "Line 2 南京东路 direct to 龙阳路 · or taxi ~25 min, ~¥45" }),
      stop("maglev", "~12:30", "The Maglev to Pudong Airport", "A floating train that reaches 300 km/h and gets you to the airport in 8 minutes. A last ‘wow’ on the way home. ¥50, or ¥40 with your plane ticket.\n\n上海磁浮 · 龙阳路站 → 浦东国际机场", { icon: TrainFront, iconBg: "#E3F2FD", type: "transport", subtitle: "8 minutes · up to 300 km/h", previewLine: "Shanghai to the airport in 8 minutes", pictures: [S("maglev")] }),
    ] },
  ];

  return {
    cityName: "Beijing, Chongqing & Shanghai",
    title: "China in 10 Days",
    location: "Beijing · Chongqing · Shanghai",
    duration: "10 Days · 14–23 Apr",
    heroImage: photos.mutianyu[0],
    overview: [
      { icon: "🏯", label: "Forbidden City · Temple of Heaven · Summer Palace" },
      { icon: "🧱", label: "The Great Wall at Mutianyu" },
      { icon: "🌃", label: "Chongqing’s 3D city · hotpot · Hongyadong" },
      { icon: "🌆", label: "The Bund · Wukang Road · Shanghai Tower" },
    ],
    picks: [],
    meiGreeting: "Here’s a sample trip, day by day, with the Chinese name and address of every stop for Amap or DiDi.",
    departure: {
      time: "Fri 23 Apr · from 12:40",
      title: "Flight home from Pudong",
      description: "The Maglev arrives at Terminal 2, a short walk from Terminal 1. With an afternoon flight, you have time to check in without rushing.",
    },
    departureNote: "This is a sample. For your trip, we check every opening day, price, booking and journey time for your dates, and stay on chat with you the whole way.",
    days,
  };
}
