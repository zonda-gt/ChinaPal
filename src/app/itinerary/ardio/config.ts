import { Baby, Camera, Car, Castle, Footprints, Hotel, Moon, Plane, Ship, Sparkles, Sun, Sunset, TrainFront, Utensils } from "lucide-react";
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

export const finalDetails = [
  "Your flight on 16 December: is 08:00 the flight time or the pickup time? We’ll set the airport pickup to match.",
  "Trains: tickets for 9 December go on sale on 25 November, 11 December on 27 November and 12 December on 28 November. We’ll help you book them as soon as they open.",
  "Museums and gardens: the Natural History Museum, Science & Technology Museum, Suzhou Museum and Humble Administrator’s Garden open bookings about 7 days ahead. We’ll remind you and help you book with your passports.",
  "LEGOLAND and Disney tickets: LEGOLAND hasn’t published its December hours yet, and Disney prices for 14–15 December appear about a month ahead. We’ll confirm both.",
  "Your suitcases: we’ll confirm with YaQING that it can receive the bags you send ahead from Shanghai.",
  "Car seats: ordinary DiDi cars don’t have child seats. Let us know if you’d like a car with child seats for the longer rides (airport, LEGOLAND → Disney).",
  "How tall is your 5-year-old? Some rides have height limits, and children under 6 ride the train free on your lap. You can also buy them their own seat.",
  "Please bring your own stroller and a baby carrier. Rental strollers at Disney and LEGOLAND are for older children, and the gardens have steps.",
];

export function buildArdioConfig(withOptions: boolean): ItineraryConfig {
  const days: ItineraryConfig["days"] = [
    /* ═══════ SHANGHAI · 5 Dec ═══════ */
    { label: "Day 1", city: "Shanghai", subtitle: "Sat 5 Dec · Arrival · 1933 Old Millfun", color: SHANGHAI, items: [
      stop("arrive", "~15:00", "Land at Shanghai Pudong", "Welcome to China! Allow about an hour for immigration and your bags. Your pickup is already booked: the driver will meet you in arrivals and take you straight to the hotel.", { icon: Plane, iconBg: "#E3F2FD", type: "transport", subtitle: "Pudong Airport (PVG) · pickup booked", previewLine: "Pre-booked pickup · about 55–70 min", transportAfter: { mode: "car", duration: "55–70 min", note: "Pudong Airport → Sofitel North Bund" } }),
      stop("sofitel", "~17:00", "Sofitel Shanghai North Bund", "Your Shanghai base for six nights, next to Hailun Road metro (Lines 4 and 10). Check in and settle the children in.\n\n上海北外滩金辉索菲特酒店 · 虹口区溧阳路601号", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Booked · 5–11 December", previewLine: "溧阳路601号 · Hailun Road metro", pictures: photos.sofitelSh, transportAfter: { mode: "walk", duration: "2 min", note: "Walk to 1933 Old Millfun, 沙泾路10号" } }),
      stop("millfun", "17:30", "1933 Old Millfun · 1933老场坊", "A 1930s Art Deco former slaughterhouse, right next to your hotel: a maze of concrete ramps, sky-bridges and staircases that children love exploring. Free to walk around, open until 20:00.\n\n1933老场坊 · 虹口区沙泾路10号", { icon: Camera, iconBg: "#E8F5E9", subtitle: "Free · 2 minutes from your hotel", previewLine: "Art Deco ramps and sky-bridges to explore", pictures: photos.millfun, transportAfter: { mode: "walk", duration: "~15 min", note: "Walk to Jia Jia Tang Bao, 虬江支路180弄" } }),
      stop("dinner-1", "18:15", "Dinner · Shanghai soup dumplings", "An easy first dinner close to the hotel.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Near your hotel", restaurants: [
        { name: "佳家汤包（四川北路店）", englishName: "Jia Jia Tang Bao", cuisine: "Soup dumplings", note: "Famous Shanghai soup dumplings. Let them cool before giving them to the children. Open until 20:30. 虬江支路180弄1-4号.", price: "~¥40 pp", rating: 4.5 },
        { name: "麟笼坊", englishName: "Lin Long Fang", cuisine: "Soup dumplings", note: "Another favourite for xiaolongbao, open until 21:30. 乍浦路332号.", price: "~¥40 pp", rating: 4.6 },
        { name: "胖子川湘菜（武进路店）", englishName: "Pangzi Sichuan & Hunan", cuisine: "Spicy", note: "If you want something spicy. Ask for 不辣 (bù là, not spicy) for the children’s dishes. 武进路258号.", price: "~¥45 pp", rating: 4.1 },
      ], transportAfter: { mode: "walk", duration: "14 min", note: "Walk back to your hotel" } }),
    ] },

    /* ═══════ SHANGHAI · 6 Dec ═══════ */
    { label: "Day 2", city: "Shanghai", subtitle: "Sun 6 Dec · Yu Garden · The Bund · River cruise", color: SHANGHAI, items: [
      leave("go-yu", "08:45", "To Yu Garden", "Taxi 15–20 min · ~¥16 · or Line 10, 42 min", { mode: "taxi", duration: "15–20 min", note: "Taxi ~¥16 · or Line 10 海伦路 → 豫园 Exit 7, 42 min" }),
      stop("yugarden", "09:00", "Yu Garden · 豫园", "A Ming-dynasty garden of pavilions, rockeries and koi ponds in the old town. Go at opening, before the crowds. About ¥30 per adult in December; the children are free.\n\n上海豫园 · 黄浦区福佑路168号 · 09:00–16:30", { icon: Sun, iconBg: "#FFF3E0", subtitle: "About ¥30 · book with your passports", previewLine: "Pavilions, rockeries and koi ponds", tip: "Our tip: Book on the “上海豫园” WeChat account with your passports. The paths have some steps, so a baby carrier is handy.", pictures: [...photos.yugarden, photos.nanxiang[1]], transportAfter: { mode: "walk", duration: "5 min", note: "Walk through the bazaar to Nanxiang" } }),
      stop("lunch-2", "~10:30", "Early lunch · Nanxiang Mantou Dian", "Shanghai’s most famous xiaolongbao, right by the garden.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Soup dumplings · arrive before 10:30", restaurants: [
        { name: "南翔馒头店（城隍庙店）", englishName: "Nanxiang Mantou Dian", cuisine: "Xiaolongbao", note: "Michelin Bib Gourmand. Sit upstairs rather than queuing for the takeaway window. Get there before 10:30 to beat the queue. 豫园路87号.", price: "~¥60–100 pp", rating: 4.6, image: photos.nanxiang[0] },
        { name: "绿波廊", englishName: "Lu Bo Lang", cuisine: "Shanghai dim sum", note: "For a proper sit-down meal: Shanghai dishes and little pastries, also Bib Gourmand. Open 11:00–16:00. 豫园路115号.", price: "~¥150 pp", rating: 4.5 },
      ], transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi ~¥17 · or a 21-min walk" } }),
      stop("bund", "12:00", "The Bund · 外滩", "Shanghai’s famous riverside promenade: grand 1920s buildings on one side and the Lujiazui towers across the river. Flat and stroller-friendly.\n\n外滩 · 黄浦区中山东一路", { icon: Camera, iconBg: "#E8F5E9", subtitle: "Free · about an hour", previewLine: "Old Shanghai on one side, skyscrapers on the other", pictures: photos.bund, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to your hotel" } }),
      stop("nap-2", "13:00", "Back to the hotel for nap time", "A proper rest before the evening.", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Rest", transportAfter: { mode: "taxi", duration: "15–20 min", note: "Taxi to Shiliupu pier, 中山东二路531号" } }),
      stop("cruise", "~17:00", "Huangpu River Cruise", "About 45 minutes on the river from Shiliupu pier: the sun sets at about 16:50, and then the skyline lights up. Children under 1.3 m usually ride free (we’ll confirm). Adults about ¥120.\n\n十六铺旅游码头 · 黄浦区中山东二路531号", { icon: Ship, iconBg: "#EDE7F6", subtitle: "Sunset and the lights coming on", previewLine: "The Bund and Lujiazui lit up, from the water", pictures: photos.cruise, transportAfter: { mode: "taxi", duration: "~15 min", note: "Taxi to White Magnolia Plaza, 东长治路588号" }, alternatives: [
        alt("😴 Kids tired?", "MELAND Club indoor playground", "A big indoor playground 8 minutes from your hotel, open until 21:00, with a food court in the same mall for dinner.", { images: photos.meland, gettingThere: "Taxi 8 min, ¥14 · 瑞虹路181号 瑞虹新天地太阳宫 L3" }),
        alt("💰 Free", "North Bund riverside at sunset", "The riverside park near your hotel gives you the Bund and Lujiazui in one view, with far fewer people. Sunset is about 16:50.", { images: photos.northBund, gettingThere: "Taxi ~8 min · 北外滩滨江绿地, 东大名路" }),
      ] }),
      stop("dinner-2", "~18:00", "Dinner · White Magnolia Plaza", "A big mall 10 minutes from your hotel, with baby rooms and a Hema supermarket in the basement for nappies and snacks.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Shanghainese · Sichuan · Hunan", restaurants: [
        { name: "蘭心餐厅（白玉兰广场店）", englishName: "Lan Xin", cuisine: "Shanghainese", note: "Home-style Shanghai dishes: braised pork, smoked fish, scallion noodles. 3F, 东长治路588号.", price: "~¥125 pp", rating: 4.6 },
        { name: "映水芙蓉（白玉兰广场店）", englishName: "Ying Shui Fu Rong", cuisine: "Sichuan · spicy", note: "Proper Sichuan heat for the adults, with mild dishes for the children. 2F.", price: "~¥150 pp", rating: 4.6 },
        { name: "锅气·湖南饭店（白玉兰广场店）", englishName: "Guoqi Hunan", cuisine: "Hunan · spicy", note: "Smoky, spicy Hunan cooking at a good price. B2.", price: "~¥65 pp", rating: 4.1 },
      ], transportAfter: { mode: "taxi", duration: "~8 min", note: "Taxi back to your hotel" } }),
    ] },

    /* ═══════ SHANGHAI · 7 Dec ═══════ */
    { label: "Day 3", city: "Shanghai", subtitle: "Mon 7 Dec · Dinosaurs · Huanghe Road · Indoor play", color: SHANGHAI, items: [
      leave("go-nh", "08:45", "To the Natural History Museum", "Taxi 20–25 min · ~¥19 · or metro, 39 min", { mode: "taxi", duration: "20–25 min", note: "Taxi ~¥19 · or Line 12 → Line 13 to 自然博物馆 Exit 2, 39 min" }),
      stop("nathist", "09:00", "Shanghai Natural History Museum", "Life-size dinosaurs, a big animal hall and hands-on galleries, inside Jing’an Sculpture Park. Adults ¥30; children 6 and under are free. It’s closed on Tuesdays, which is why it’s today.\n\n上海自然博物馆 · 静安区北京西路510号 · 09:00–17:00", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Dinosaurs · ¥30 adults, kids free", previewLine: "Life-size dinosaurs and animal halls", tip: "Our tip: Book up to 7 days ahead in the “上海科技馆自然博物馆天文馆门票” WeChat mini-program with your passports. Children need a free ticket too.", pictures: photos.nathist, transportAfter: { mode: "walk", duration: "12 min", note: "Walk to Huanghe Road · or taxi 5 min" } }),
      stop("lunch-3", "12:00", "Lunch · Huanghe Road food street", "A hidden gem: Huanghe Road (黄河路) is an old food street made famous again by the TV series Blossoms Shanghai (繁花).", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Hidden gem · old Shanghai food street", restaurants: [
        { name: "佳家汤包（黄河路店）", englishName: "Jia Jia Tang Bao", cuisine: "Soup dumplings", note: "The original branch. 黄河路127号.", price: "~¥46 pp", rating: 4.6, image: photos.jiajia[1] },
        { name: "小杨生煎（黄河路店）", englishName: "Yang’s Dumplings", cuisine: "Pan-fried buns", note: "Crisp-bottomed pork buns, quick and cheap. 黄河路97号.", price: "~¥26 pp", rating: 4.5 },
        { name: "老瑞福上海菜（人民广场店）", englishName: "Lao Rui Fu", cuisine: "Shanghainese", note: "A sit-down Shanghai meal at the end of the street. 凤阳路238号.", price: "~¥90 pp", rating: 4.6 },
      ], transportAfter: { mode: "taxi", duration: "~15 min", note: "Taxi back to your hotel" } }),
      stop("nap-3", "13:30", "Back to the hotel for nap time", "Rest before the afternoon.", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Rest", transportAfter: { mode: "taxi", duration: "8 min", note: "Taxi ~¥14 · or Line 4 to 临平路 Exit 1, straight into the mall" } }),
      stop("meland", "16:00", "MELAND Club indoor playground", "A big indoor playground with climbing, slides and soft play, with a separate area for toddlers. Open until 21:00. Have dinner in the same mall: there’s a big food court and family restaurants, plus baby rooms.\n\nMELAND Club · 瑞虹新天地太阳宫 L3 · 虹口区瑞虹路181号", { icon: Baby, iconBg: "#FFF0EE", subtitle: "Indoor play · dinner in the mall", previewLine: "Climbing, slides and a toddler area", pictures: photos.meland, transportAfter: { mode: "taxi", duration: "8 min", note: "Taxi back to your hotel" }, alternatives: [
        alt("🌤 Nice weather?", "North Bund riverside", "Stay outdoors instead: a flat riverside walk with views of the Bund and Lujiazui, then dinner at White Magnolia Plaza.", { images: photos.northBund, gettingThere: "Taxi ~8 min · 北外滩滨江绿地, 东大名路" }),
      ] }),
    ] },

    /* ═══════ SHANGHAI · 8 Dec ═══════ */
    { label: "Day 4", city: "Shanghai", subtitle: "Tue 8 Dec · Science & Technology Museum · Century Park", color: SHANGHAI, items: [
      leave("go-sci", "08:30", "To the Science & Technology Museum", "Taxi 25–30 min · ~¥30 · or metro, 48 min", { mode: "taxi", duration: "25–30 min", note: "Taxi ~¥30 · or Line 4 → Line 2 to 上海科技馆 Exit 8, 48 min" }),
      stop("scitech", "09:00", "Shanghai Science & Technology Museum", "Your must-do. Hands-on galleries, robots, a rainforest and space halls. Adults ¥45; children 6 and under are free. It’s closed on Mondays, which is why it’s today.\n\n上海科技馆 · 浦东新区世纪大道2000号 · 09:00–17:00", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Your must-do · ¥45 adults, kids free", previewLine: "Robots, a rainforest and hands-on galleries", tip: "Our tip: Mini World (一米世界) is a zone built for ages 3–8. Its time slots open at 08:30 but can only be booked once you’re inside, and they go fast, so be at the door at 09:00. Book your entry tickets up to 7 days ahead in the same mini-program as the Natural History Museum. If the booking doesn’t work out, Thursday 10 December is the backup day.", pictures: photos.scitech, transportAfter: { mode: "walk", duration: "2 min", note: "Lunch inside the museum or next door" } }),
      stop("lunch-4", "~12:00", "Lunch · at the museum or next door", "Keep lunch simple and close.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Quick and close", restaurants: [
        { name: "科学时光餐厅", englishName: "Science Time Café", cuisine: "Museum café", note: "Inside the museum. Easy with the stroller.", price: "~¥90 pp", rating: 3.9 },
        { name: "花木时光里", englishName: "Huamu Shiguangli", cuisine: "Food court & restaurants", note: "A small mall 5 minutes’ walk away with lots of choice. 杨高南路99弄.", price: "~¥40–100 pp", rating: 4.5 },
      ], transportAfter: { mode: "taxi", duration: "~14 min", note: "Taxi to Century Park · or a 20-min walk" } }),
      stop("century", "13:00", "Century Park · 世纪公园", "Shanghai’s biggest park: lawns, a lake and a children’s play area. A stroller nap and a run-around after the museum.\n\n上海世纪公园 · 浦东新区锦绣路1001号", { icon: Sun, iconBg: "#E8F5E9", subtitle: "Free · lawns, lake and playground", previewLine: "Lawns, a lake and a playground", pictures: photos.century, transportAfter: { mode: "taxi", duration: "~30 min", note: "Taxi ~¥31 · or the metro, 58 min" }, alternatives: [
        alt("🌧 If it rains", "Stay longer in the museum", "Skip the park and spend the afternoon on the museum’s other floors: the Spider exhibition, the space hall and the rainforest. Your ticket lets you stay until 17:00.", { images: photos.scitech.slice(1) }),
      ] }),
      stop("jinchao", "Evening", "Dinner · Jinchao 8 Lane · 今潮8弄", "A hidden gem 14 minutes’ walk from your hotel: restored 1920s stone-gate lanes on Sichuan North Road, with small restaurants and shops.\n\n今潮8弄 · 虹口区四川北路989弄", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Hidden gem · restored stone-gate lanes", previewLine: "Restored 1920s lanes · dinner", pictures: photos.jinchao, restaurants: [
        { name: "庄氏隆兴·非遗蟹点（今潮8弄店）", englishName: "Zhuang’s Longxing", cuisine: "Crab dumplings", note: "Heritage-recipe crab dumplings and noodles. 四川北路989弄10号楼.", price: "~¥93 pp", rating: 4.5 },
        { name: "凯福·本帮小酒馆（今潮8弄店）", englishName: "Kaifu Bistro", cuisine: "Shanghainese", note: "A cosy Shanghai bistro in the lanes. 6号楼115单元.", price: "~¥117 pp", rating: 4.3 },
      ], transportAfter: { mode: "walk", duration: "14 min", note: "Walk back to your hotel" } }),
    ] },

    /* ═══════ SUZHOU · 9 Dec ═══════ */
    { label: "Day 5", city: "Suzhou", subtitle: "Wed 9 Dec · Suzhou day trip · Gardens & canals", color: SUZHOU, items: [
      leave("go-shst", "08:15", "To Shanghai Railway Station", "Taxi 20–25 min · ~¥19 · or Line 4, 35 min", { mode: "taxi", duration: "20–25 min", note: "Taxi ~¥19 · or Line 4, two stops to 上海火车站, 35 min" }),
      stop("train-sz", "09:00", "High-Speed Train to Suzhou", "G7006, Shanghai Station 09:00 → Suzhou 09:25, about ¥46 per adult in second class. Backups: G8254 at 09:05 or D2906 at 08:41. Children under 6 can travel free on your lap.\n\nBring your passports: they are your tickets. Be at the station by 08:30 for the passport check and security.", { icon: TrainFront, iconBg: "#E3F2FD", type: "transport", subtitle: "Shanghai → Suzhou · 25 min", previewLine: "G7006 · 09:00 → 09:25 · ~¥46", pictures: photos.train, showPhotoPreview: false, transportAfter: { mode: "taxi", duration: "15–20 min", note: "Taxi ~¥10 to the Humble Administrator’s Garden" } }),
      stop("zhuozheng", "09:45", "Humble Administrator’s Garden · 拙政园", "Suzhou’s most famous classical garden: ponds, bridges and pavilions. ¥70 per adult in December. Allow about 1½ hours.\n\n拙政园 · 苏州市姑苏区东北街178号 · 07:30–17:00", { icon: Sun, iconBg: "#E8F5E9", subtitle: "¥70 · book with your passports", previewLine: "Ponds, bridges and pavilions", tip: "Our tip: Book in the “苏州园林” mini-program with your passports. There are steps and arched bridges, so bring the baby carrier as well as the stroller.", pictures: photos.zhuozheng, transportAfter: { mode: "walk", duration: "3 min", note: "Walk to Suzhou Taitai, 园林路88号" } }),
      stop("lunch-5", "11:45", "Lunch · Suzhou cooking", "Suzhou food is mild and slightly sweet, which usually suits children.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Suzhou dishes · by the garden", restaurants: [
        { name: "苏州太太苏帮菜（拙政园店）", englishName: "Suzhou Taitai", cuisine: "Suzhou cuisine", note: "Highly rated and good value: squirrel fish, shrimp, Suzhou noodles. 园林路88号.", price: "~¥60 pp", rating: 4.7 },
        { name: "话雨楼·精品苏帮菜馆（拙政园店）", englishName: "Hua Yu Lou", cuisine: "Suzhou cuisine", note: "Next to the garden’s north gate. 百家巷8号.", price: "~¥78 pp", rating: 4.5 },
      ], transportAfter: { mode: "walk", duration: "5 min", note: "Walk to the Suzhou Museum, 东北街204号" } }),
      stop("szmuseum", "13:00", "Suzhou Museum · 苏州博物馆", "I. M. Pei’s beautiful museum, a modern take on a Suzhou garden. Free with a reservation 1–7 days ahead; closed on Mondays.\n\n苏州博物馆 · 东北街204号 · 09:00–17:00", { icon: Camera, iconBg: "#F3E8FF", subtitle: "Free · book 1–7 days ahead", previewLine: "I. M. Pei’s modern garden museum", pictures: photos.szmuseum, transportAfter: { mode: "taxi", duration: "10–15 min", note: "Taxi ~¥10 · or Line 6, one stop to 悬桥巷" } }),
      stop("pingjiang", "14:30", "Pingjiang Road · 平江路", "A canal-side lane of old houses, little bridges and snack shops: the Suzhou postcard. Stop for noodles at Tong De Xing: in winter, try the red-braised pork noodles (红汤焖肉面).\n\n平江路 · 苏州市姑苏区 · 同得兴, 平江路94号", { icon: Sunset, iconBg: "#FFF3E0", subtitle: "Canals · bridges · Suzhou noodles", previewLine: "Canals, bridges and a bowl of Suzhou noodles", pictures: [...photos.pingjiang, ...photos.tongdexing.slice(0, 1)], transportAfter: { mode: "taxi", duration: "20–30 min", note: "Taxi ~¥16 to Suzhou Station · or metro, 42 min" } }),
      stop("train-back-5", "17:14", "Train back to Shanghai", "G7019, Suzhou 17:14 → Shanghai Station ~17:40. Backup: G7021 at 18:14.", { icon: TrainFront, iconBg: "#E3F2FD", type: "transport", subtitle: "Suzhou → Shanghai · 26 min", previewLine: "G7019 · 17:14 → 17:40", transportAfter: { mode: "taxi", duration: "~20 min", note: "Taxi back to your hotel · dinner nearby" } }),
    ] },

    /* ═══════ SHANGHAI · 10 Dec ═══════ */
    { label: "Day 6", city: "Shanghai", subtitle: "Thu 10 Dec · Aquarium · Skyline · ¥2 ferry", color: SHANGHAI, items: [
      leave("go-ljz", "09:00", "To Lujiazui", "Taxi 13–15 min · ~¥15", { mode: "taxi", duration: "13–15 min", note: "Taxi ~¥15 to the aquarium" }),
      stop("aquarium", "09:30", "Shanghai Ocean Aquarium", "One of Asia’s biggest aquariums, with a long underwater tunnel where sharks and rays swim over your heads. Adults ¥160, children ¥110; little ones free (we’ll confirm the height rules).\n\n上海海洋水族馆 · 浦东新区陆家嘴环路1388号 · 09:00–18:00", { icon: Sparkles, iconBg: "#E3F2FD", subtitle: "Underwater tunnel · indoors", previewLine: "Sharks and rays over your heads", pictures: photos.aquarium, transportAfter: { mode: "walk", duration: "~10 min", note: "Walk to Shanghai Tower, 银城中路501号" } }),
      stop("deck", "11:30", "Shanghai Tower viewing deck · 上海之巅", "The 118th floor of China’s tallest building, with a 360° view over the city. The lift is one of the fastest in the world. Adults ¥180, children ¥90.\n\n上海之巅观光厅 · 银城中路501号 · 08:30–22:00", { icon: Camera, iconBg: "#E8F5E9", subtitle: "Highest in the city · ¥180 / ¥90", previewLine: "Shanghai from the 118th floor", pictures: photos.shtower, transportAfter: { mode: "walk", duration: "~8 min", note: "Walk to lunch" }, alternatives: [
        alt("🎢 Glass floor", "Oriental Pearl Tower", "The pink-and-silver tower with a glass floor the children can stand on. Adults ¥199, children ¥99.", { images: photos.pearl, gettingThere: "Walk ~5 min · 东方明珠, 世纪大道1号" }),
        alt("💰 Cheaper", "Jin Mao Tower, 88th floor", "A lower but closer view of Shanghai Tower, with fewer queues. Adults ¥120, children ¥60.", { images: photos.shtower.slice(1), gettingThere: "Walk ~5 min · 金茂大厦88层, 世纪大道88号" }),
      ] }),
      stop("lunch-6", "12:30", "Lunch · Lujiazui", "Plenty of choice around the towers.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Dumplings · or something spicy", restaurants: [
        { name: "鼎泰丰（国金中心店）", englishName: "Din Tai Fung", cuisine: "Taiwanese dumplings", note: "Very child-friendly, with high chairs. IFC mall, 世纪大道8号.", price: "~¥115 pp", rating: 4.5 },
        { name: "小杨生煎（东方明珠店）", englishName: "Yang’s Dumplings", cuisine: "Pan-fried buns", note: "Quick and cheap. 陆家嘴环路1406号.", price: "~¥39 pp", rating: 4.4 },
        { name: "麻六记（正大广场店）", englishName: "Ma Liu Ji", cuisine: "Sichuan · spicy", note: "Spicy Sichuan noodles and dishes. Super Brand Mall 6F, 陆家嘴西路168号.", price: "~¥100 pp", rating: 4.4 },
      ], transportAfter: { mode: "walk", duration: "~20 min", note: "Walk along the river to 东昌路渡口, 滨江大道3528号" } }),
      stop("ferry", "14:00", "The ¥2 ferry across the Huangpu", "A hidden gem: the ferry that Shanghai commuters take across the river. Five minutes on the water, for ¥2, with the Bund in front of you. Ferries leave about every 15 minutes until 18:15.\n\n东昌路渡口 → 金陵东路渡口", { icon: Ship, iconBg: "#E3F2FD", subtitle: "Hidden gem · ¥2 · 5 minutes", previewLine: "The commuter ferry, with the Bund ahead", pictures: photos.ferry, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi to the Post Museum, 天潼路395号" } }),
      stop("postmuseum", "14:45", "Shanghai Post Museum", "A grand 1924 post office building with old mail vans and stamps inside, and a rooftop garden over Suzhou Creek. Free; open Wednesday, Thursday and weekends 09:00–17:00.\n\n上海邮政博物馆 · 虹口区天潼路395号", { icon: Camera, iconBg: "#F3E8FF", subtitle: "Free · rooftop garden", previewLine: "A 1924 post office with a rooftop garden", tip: "Our tip: We’ll check that the rooftop garden is open that week.", pictures: photos.postmuseum, transportAfter: { mode: "taxi", duration: "~8 min", note: "Taxi back to your hotel · or a 21-min walk" } }),
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
        alt("😴 Kids tired?", "A flat lakeside walk", "Skip the boat and stroll along the lake from Liulang Wenying to Hubin, with benches and lake views the whole way. Back to the hotel for a nap whenever you need.", { images: photos.westlake }),
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
      stop("disney-1", "Early entry", "Shanghai Disneyland · Day 1", "As hotel guests you can go in up to an hour before the park opens. Take the hotel shuttle to the Disneytown entrance with your hotel card, tickets and passports.\n\nGood for your 5-year-old: Seven Dwarfs Mine Train (from 97 cm), Peter Pan’s Flight, Pirates of the Caribbean, Soaring Over the Horizon (from 102 cm), Winnie the Pooh, Dumbo and the carousel. The Christmas season should be on.\n\nTickets: children under 3 are free; ages 3–11 pay a child price (about 25% off), so your 5-year-old needs one.", { icon: Castle, iconBg: "#F3E8FF", subtitle: "Early entry · hotel guests", previewLine: "Early entry, then the big rides before the queues", tip: "Our tip: Use Rider Switch so one parent can ride while the other waits with the baby, then swap without queuing again. The Baby Care Center is on Mickey Avenue.", pictures: photos.disney, transportAfter: { mode: "shuttle", duration: "~15 min", note: "Hotel shuttle back for a nap" } }),
      stop("nap-10", "~12:00", "Back to the hotel for nap time", "Go back to your room for lunch and a proper nap while the park is at its busiest. Your hotel is next door, so it’s easy.", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Rest · 12:00–15:00", transportAfter: { mode: "shuttle", duration: "~15 min", note: "Hotel shuttle back to the park" } }),
      stop("disney-1pm", "~15:00", "Back to the park · parades & evening", "A few more favourites, the afternoon parade, and dinner in the park. Stay for the night-time show only if the children are still going strong.", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Afternoon & evening", previewLine: "Parade, favourites and maybe the night show", pictures: photos.disney.slice(1) }),
    ] },

    /* ═══════ DISNEY · 15 Dec ═══════ */
    { label: "Day 11", city: "Disney", subtitle: "Tue 15 Dec · Disneyland, day 2 · To Novotel", color: DISNEY, items: [
      stop("checkout-disney", "Before the park", "Check out & store your bags", "Check out (by 11:00) before you go in. The Bell Desk sends your bags to luggage storage opposite Wishing Star Park’s west gate, about ¥80 per item per day.", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Luggage storage · ~¥80 per item", transportAfter: { mode: "shuttle", duration: "~15 min", note: "Hotel shuttle to the park" } }),
      stop("disney-2", "Early entry", "Shanghai Disneyland · Day 2", "Early entry again, then a relaxed second day for the rides they loved. Without a room today, plan a stroller nap and an indoor show or two after lunch.", { icon: Castle, iconBg: "#F3E8FF", subtitle: "Early entry · favourites again", previewLine: "A relaxed second day for favourites", pictures: [photos.disney[1], photos.disney[0]], transportAfter: { mode: "taxi", duration: "15–20 min", note: "Collect your bags · taxi ~¥26 to Novotel" } }),
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
      time: "Wed 16 Dec · Early morning",
      title: "Pickup to Pudong Airport",
      description: "Your airport pickup is booked: the drive from the Novotel takes about 17–20 minutes at that hour. For an 08:00 flight, leave the hotel at about 05:15–05:30.",
    },
    departureNote: "Send us your flight number and we’ll set the pickup time to match. Safe travels!",
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
