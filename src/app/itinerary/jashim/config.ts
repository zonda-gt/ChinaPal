import { Car, Castle, Footprints, Hotel, Landmark, Moon, Mountain, Plane, Ship, ShoppingBag, Sparkles, Sun, Sunset, TrainFront, Utensils } from "lucide-react";
import type { ItineraryConfig } from "../ItineraryPage";

/* First draft, 30 Oct 2026. Flights, the Xi'an night of 16 Dec and the
   Zhangjiajie and Shanghai hotels are still to confirm with the family.
   Each day runs morning to evening: the baby naps in the carrier or stroller
   on the go, with a hotel break only when the hotel is close. Journey times
   are estimates, to check in Amap before the trip. Sunset is about 16:50 in
   Beijing and Shanghai and 17:40 in Xi'an and Zhangjiajie.
   Photo sources: photo-sources.json. */
type Item = ItineraryConfig["days"][number]["items"][number];
type Alternative = NonNullable<Item["alternatives"]>[number];
const J = (name: string) => `/uploads/itinerary/jashim/${name}.webp`;
const BJ = "/uploads/itinerary/beijing";
const SH = "/uploads/itinerary/shanghai/scraper";
const DO = "/uploads/itinerary/doanhtu";

export const photos = {
  ritan: [J("ritan"), J("ritan-2")],
  forbidden: [`${BJ}/forbidden2.jpg`, `${BJ}/scraper/forbidden-taihe.jpg`, `${BJ}/forbidden3.jpg`],
  siji: [J("siji-duck"), J("siji-view")],
  jingshan: [`${BJ}/forbidden1.jpg`, `${BJ}/jingshan1.jpg`],
  wangfujing: [J("wangfujing"), J("wangfujing-2")],
  mutianyu: [`${BJ}/scraper/mutianyu-towers.webp`, `${BJ}/mutianyu2.jpg`],
  taikooli: [J("taikooli"), J("taikooli-2")],
  panda: [J("panda"), J("panda-snow"), J("zoo-gate")],
  moscow: [J("moscow"), J("moscow-2")],
  shichahai: [`${BJ}/shichahai2.jpg`, J("shichahai-snow"), `${BJ}/shichahai3.jpg`, `${BJ}/hutong2.jpg`],
  templeHeaven: [`${BJ}/scraper/temple-heaven-qinian.png`, `${BJ}/temple_heaven2.jpg`],
  summerPalace: [`${BJ}/scraper/summer-palace-bridge.jpg`, `${BJ}/summer_palace1.jpg`],
  hanfuBj: [J("hanfu-bj"), J("hanfu-bj-2")],
  dadong: [J("dadong"), J("dadong-2")],
  copperpot: [J("copperpot"), J("copperpot-2")],
  mercure: [J("mercure"), J("mercure-2")],
  terracotta: [`${BJ}/xian.jpg`, J("terracotta-2"), "/uploads/itinerary/vaishvi-terracotta.jpg"],
  paomo: [J("paomo"), J("paomo-2")],
  towers: [J("belltower"), J("drumtower")],
  muslimQuarter: [J("muslimq"), J("skewers"), J("muslimq-2")],
  cityWall: [J("citywall"), J("citywall-2")],
  yongxing: [J("yongxing"), J("yongxing-2")],
  shaanxiMuseum: [J("shaanxi-museum"), J("shaanxi-museum-2")],
  goose: [J("goose-2"), J("goose")],
  datang: [J("datang"), J("datang-2")],
  changan: [J("changan"), J("changan-2")],
  hiltonZjj: [J("hilton-zjj"), J("hilton-zjj-2")],
  baofeng: [J("baofeng"), J("baofeng-2"), "/uploads/itinerary/baofeng_lake.jpg"],
  xibu: [J("xibu"), J("xibu-2")],
  tenMile: [J("tenmile"), J("tenmile-2")],
  tianzi: ["/uploads/itinerary/tianzi_clouds.jpeg", J("tianzi-sunrise"), "/uploads/itinerary/tianzi.jpeg"],
  xiangxi: [J("xiangxi"), J("xiangxi-2")],
  golden: [J("golden"), J("golden-2")],
  bailong: [J("bailong"), J("bailong-2")],
  yuanjiajie: [J("yuanjiajie"), "/uploads/itinerary/avatar.jpeg", J("yuanjiajie-2")],
  huanglong: [J("huanglong"), J("huanglong-2")],
  wyndhamZjj: [J("wyndham-zjj"), J("wyndham-zjj-2")],
  tianmen: [J("tianmen"), "/uploads/itinerary/tianmen_cablecar.webp"],
  qilou: [J("qilou"), J("qilou-2"), J("dayong")],
  furong: [J("furong"), J("furong-2")],
  atour: [J("atour"), J("atour-2")],
  bundWalk: [`${SH}/nanjing-road-neon.jpg`, `${SH}/bund-skyline.jpg`],
  yangs: [J("yangs"), J("yangs-2")],
  nanxiang: ["/uploads/itinerary/theresa/nanxiang.webp", "/uploads/itinerary/theresa/nanxiang-2.webp"],
  yugarden: ["/uploads/itinerary/ardio/yugarden.webp", J("yugarden-2"), `${SH}/yugarden-bridge.jpg`],
  lubolang: [J("lubolang"), J("lubolang-2")],
  shMuseum: [J("shmuseum"), J("shmuseum-2")],
  xmas: [J("xmas"), J("xmas-2"), J("xmas-3")],
  lujiazui: [`${SH}/shanghai-tower.webp`, `${DO}/lujiazui-bridge-2.webp`],
  lailai: [`${DO}/lailai.webp`, `${DO}/lailai-2.webp`],
  zhangyuan: ["/uploads/itinerary/ardio/zhangyuan.webp", `${SH}/jingan-temple.jpg`, "/uploads/itinerary/ardio/zhangyuan-2.webp"],
  cruise: [`${SH}/huangpu-cruise.jpg`, "/uploads/itinerary/thebund.jpeg"],
  wukang: ["/uploads/itinerary/xhs/wukang.webp", "/uploads/itinerary/ruijun/wukang-2.webp", "/uploads/itinerary/ardio/anfu-street.webp"],
  hikiniku: [J("hikiniku"), J("hikiniku-2")],
  whitefoods: [J("whitefoods"), J("whitefoods-2")],
  tianzifang: [J("tianzifang"), J("tianzifang-2")],
  xintiandi: ["/uploads/itinerary/antonio/xintiandi-1.webp", "/uploads/itinerary/antonio/xintiandi-2.webp"],
  jiajia: ["/uploads/itinerary/ardio/jiajia.webp", "/uploads/itinerary/antonio/xiaolongbao.webp"],
  disney: ["/uploads/itinerary/ardio/disney-castle.webp", "/uploads/itinerary/shdisney.jpg"],
  hanfuSh: [J("hanfu-sh"), J("hanfu-sh-2")],
};

const BEIJING = "#B91C1C";
const XIAN = "#B45309";
const ZHANGJIAJIE = "#2F7D4F";
const SHANGHAI = "#1D4ED8";

type StopOptions = Partial<Item> & { pictures?: string[] };
function stop(id: string, time: string, title: string, description: string, { pictures, ...options }: StopOptions = {}): Item {
  return {
    id: `jashim-${id}`, time, title, description, icon: Footprints, iconBg: "#FFF0EE", type: "activity", ...options,
    ...(pictures?.length ? { image: pictures[0], previewImages: pictures } : {}),
  };
}
/* A compact card for setting off: the journey is on the card itself, so it
   has no separate connector line underneath. */
function leave(id: string, time: string, title: string, previewLine: string, leg: NonNullable<Item["transportAfter"]>, description?: string): Item {
  return stop(id, time, title, description ?? `${leg.note}.`, { icon: Car, iconBg: "#E3F2FD", type: "transport", previewLine });
}
/* A restaurant worth the trip: shown with its photos, like a place. */
function meal(id: string, time: string, title: string, description: string, options: StopOptions): Item {
  return stop(id, time, title, description, { icon: Utensils, iconBg: "#FFF1F3", type: "meal", showPhotoPreview: !!options.pictures?.length, ...options });
}
/* A short break back at the hotel, kept for days when the hotel is close. */
function rest(id: string, time: string, description: string, title = "Rest at the hotel"): Item {
  return stop(id, time, title, description, { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Naps and feeds", previewLine: description });
}
function alt(tag: string, title: string, description: string, extra: Partial<Alternative> = {}): Alternative {
  return { tag, title, description, ...extra };
}

/* Places we like but left out of the daily plan, shown as cards at the end. */
export const recommended = [
  { id: "temple-heaven", city: "Beijing", title: "Temple of Heaven", tag: "Flat paths · easy with the stroller", images: photos.templeHeaven, desc: "The round blue-roofed Hall of Prayer for Good Harvests, in a huge park where locals dance, sing and play cards in the mornings.", note: "Combined ticket about ¥28 in winter. East Gate: Line 5 to Tiantandongmen. 天坛公园东门 · 东城区天坛东路." },
  { id: "summer-palace", city: "Beijing", title: "Summer Palace in winter", tag: "A snowy morning · ~1 hour away", images: photos.summerPalace, desc: "The emperors’ lakeside garden, with the Seventeen-Arch Bridge and the Long Corridor. Beautiful after snow.", note: "When Kunming Lake freezes (usually later in December) people ride ice carts on it. 颐和园 · 海淀区新建宫门路19号." },
  { id: "hanfu-bj", city: "Beijing", title: "Hanfu family photoshoot", tag: "Book ahead · indoor studio", images: photos.hanfuBj, desc: "Dress up in Qing-dynasty or Ming-style robes, with hair and makeup, for photos by the red palace walls. A lovely keepsake with the baby in costume too.", note: "Studios near the Forbidden City’s east gate (南池子大街) dress you and walk you to the photo spots. Commercial shoots aren’t allowed inside the palace itself." },
  { id: "dadong", city: "Beijing", title: "Da Dong Roast Duck", tag: "Modern Peking duck", images: photos.dadong, desc: "The upscale take on Peking duck: crisp, lean skin carved at the table, in a sleek dining room. Roomier than the busy old duck houses.", note: "The Wangfujing branch is on the 5th floor of 王府井喜悦购物中心, an easy swap for dinner on Day 2." },
  { id: "jubaoyuan", city: "Beijing", title: "Ju Bao Yuan · copper-pot hotpot", tag: "Old Beijing classic · Niujie", images: photos.copperpot, desc: "Hand-sliced mutton swished in a clear broth in a charcoal copper pot, dipped in sesame sauce, with sesame flatbreads on the side.", note: "About ¥110–140 per person, with queues at mealtimes. 聚宝源（牛街总店）· 西城区牛街. Man Heng Ji (满恒记) on the same street is a cheaper Michelin Bib Gourmand pick." },
  { id: "furong", city: "Zhangjiajie", title: "Furong Town", tag: "25 min by train · in place of Tianmen", images: photos.furong, desc: "An old Tujia town built on a cliff around a waterfall that pours right through it.", note: "High-speed train 张家界西站 → 芙蓉镇站, about 25 minutes. Lots of steps, so bring the carrier. Swap it for Tianmen on Day 11 if you prefer." },
  { id: "jiajia", city: "Shanghai", title: "Jia Jia Tang Bao", tag: "Soup dumplings · by People’s Square", images: photos.jiajia, desc: "A tiny, no-frills shop often called the city’s best for soup dumplings, with queues out of the door.", note: "Go early: it sells out. 佳家汤包 · 黄浦区黄河路90号, a few minutes from your hotel." },
  { id: "disney", city: "Shanghai", title: "Shanghai Disneyland", tag: "A full day · Christmas season", images: photos.disney, desc: "Christmas decorations and the castle lighting show at about 17:00. A long day with a baby, so only if you’re keen.", note: "The staffed Baby Care Center is on Mickey Avenue, for feeding and changing. Use Rider Switch to take turns on the rides. 上海迪士尼乐园 · 浦东新区." },
  { id: "hanfu-sh", city: "Shanghai", title: "Hanfu or qipao photoshoot", tag: "Yu Garden · old town", images: photos.hanfuSh, desc: "A soft, ancient look in hanfu by the Yu Garden pavilions, or a 1920s Old Shanghai look in a qipao.", note: "Studios around Yu Garden do the outfit, hair and makeup. The Nine-Turn Bridge and the City God Temple are the classic spots." },
];

export function buildJashimConfig(withOptions: boolean): ItineraryConfig {
  const days: ItineraryConfig["days"] = [
    /* ═══════ BEIJING · 10 Dec ═══════ */
    { label: "Day 1", city: "Beijing", subtitle: "Thu 10 Dec · Arrival · Ritan Park", color: BEIJING, items: [
      stop("arrive", "Flight TBC", "Land in Beijing", "Welcome to China! Once you send us your flight, we’ll book a car with a rear-facing infant seat to meet you in arrivals and take you to your apartment. Ordinary taxis and DiDi don’t have infant seats.", { icon: Plane, iconBg: "#E3F2FD", type: "transport", subtitle: "Pickup with an infant seat · we’ll book it", previewLine: "Car with an infant seat to your apartment", transportAfter: { mode: "car", duration: "~40–60 min", note: "Airport → your apartment, depending on Capital or Daxing" } }),
      stop("apartment", "On arrival", "Your Beijing apartment", "Your base for four nights, in the embassy area about 1.1 km from Chaoyangmen metro (Lines 2 and 6). The walk to the station is a bit long with the stroller, so take a taxi when you’re tired. Settle in, check the heating and the baby’s sleeping set-up, and pick up water and snacks at a convenience store nearby.\n\nBeijing High-Rise Panoramic European International Mansion · near Chaoyangmen", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Booked · 10–14 December", previewLine: "Embassy area · ~1.1 km to Chaoyangmen metro", tip: "Baby tip: Beijing is very dry in December and the heating is strong. A small humidifier or a wet towel over a chair helps the baby sleep.", transportAfter: { mode: "walk", duration: "~10 min", note: "Walk or a short taxi to Ritan Park" } }),
      stop("ritan", "~15:00", "Ritan Park · 日坛公园", "If you land before about 14:00: a gentle first stroll in the embassy district’s old park, built around the Ming-dynasty Altar of the Sun, with pavilions, a pond and locals doing tai chi and singing. Free. Then an early dinner near the apartment and an early night.\n\n日坛公园 · 朝阳区日坛北路6号 · 05:30–22:00", { icon: Sun, iconBg: "#FFF3E0", subtitle: "Free · if you land early", previewLine: "A gentle first walk near your apartment", tip: "Baby tip: Wide, flat paths, so the stroller is fine.", pictures: photos.ritan }),
    ] },

    /* ═══════ BEIJING · 11 Dec ═══════ */
    { label: "Day 2", city: "Beijing", subtitle: "Fri 11 Dec · Forbidden City · Jingshan · Wangfujing", color: BEIJING, items: [
      leave("go-palace", "08:30", "To the Forbidden City", "Taxi ~20 min · or Line 2 → Line 1, ~25 min", { mode: "taxi", duration: "~20 min", note: "Taxi to the Tiananmen East / Donghuamen drop-off · or Line 2 朝阳门 → 建国门, then Line 1 to 天安门东" }),
      stop("palace", "09:00", "Forbidden City · 故宫", "The emperors’ palace: go in at the Meridian Gate in the south and walk out at the Gate of Divine Prowess in the north, about 1 km along the central halls. Allow 2½–3 hours and keep to the main axis. About ¥40 per adult in winter; children under 6 are free but still need a reservation on their own passport. Closed on Mondays.\n\n故宫博物院 · 东城区景山前街4号 · enter at 午门", { icon: Castle, iconBg: "#FFF3E0", subtitle: "About ¥40 · book with all three passports", previewLine: "The emperors’ palace, south to north", tip: "Baby tip: There’s a baby care room with three private nursing rooms near Qianqing Palace Square, about halfway along. The halls have raised thresholds and steps, so use the carrier and leave the stroller in the car.", pictures: photos.forbidden, transportAfter: { mode: "walk", duration: "~10 min", note: "Walk round to Siji Minfu by the east gate, 南池子大街11号" } }),
      meal("lunch-2", "~12:30", "Lunch · Siji Minfu, by the palace", "Beijing’s most queued-for Peking duck, at the moat-side branch next to the Forbidden City’s east gate. Join the queue in its WeChat mini-program while you’re still inside the palace, and ask for a window seat facing the palace walls.", { subtitle: "Peking duck · join the queue on WeChat", previewLine: "Peking duck with a view of the palace walls", pictures: photos.siji, restaurants: [
        { name: "四季民福烤鸭店（故宫店）", englishName: "Siji Minfu, Forbidden City branch", cuisine: "Peking duck", note: "Order a whole duck, carved at the table, with pancakes and sweet sauce. Free tea and snacks while you wait. 东城区南池子大街11号.", price: "Whole duck ~¥240–300", rating: 4.8, image: photos.siji[0] },
      ], transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi to Jingshan Park’s south gate, opposite the palace’s north gate" } }),
      stop("jingshan", "~14:00", "Jingshan Park · 景山公园", "The hill behind the palace, made from the earth dug out for its moat. A 10-minute climb to the pavilion at the top gives the classic view over the golden roofs of the Forbidden City. About ¥2. Allow 45 minutes.\n\n景山公园南门 · 西城区景山西街44号", { icon: Sunset, iconBg: "#FFF3E0", subtitle: "About ¥2 · the view over the palace roofs", previewLine: "The Forbidden City’s golden roofs from above", tip: "Baby tip: The path up is steps, so use the carrier; it’s a good moment for a nap.", pictures: photos.jingshan, transportAfter: { mode: "taxi", duration: "~20 min", note: "Taxi back to the apartment" } }),
      rest("rest-2", "~15:00", "A couple of hours back at the apartment before the evening.", "Rest at the apartment"),
      stop("wangfujing", "~17:30", "Wangfujing in the evening", "Beijing’s big shopping street, lit up after dark, with St Joseph’s Church glowing at night and malls with warm food courts. Stroll, browse and have an easy dinner. Da Dong’s modern Peking duck is here too, if you’d like another duck night instead.\n\n王府井步行街 · 东城区 · Line 1 王府井 · or taxi ~10 min", { icon: ShoppingBag, iconBg: "#FFF0EE", subtitle: "Free · lights, shops and dinner", previewLine: "Beijing’s shopping street lit up", tip: "Baby tip: The pedestrian street and malls are flat and heated, so the stroller is easy; malls have mother-and-baby rooms (母婴室).", pictures: photos.wangfujing, transportAfter: { mode: "taxi", duration: "~10–15 min", note: "Taxi back to the apartment" } }),
    ] },

    /* ═══════ BEIJING · 12 Dec ═══════ */
    { label: "Day 3", city: "Beijing", subtitle: "Sat 12 Dec · Mutianyu Great Wall · Sanlitun", color: BEIJING, items: [
      leave("go-wall", "08:00", "To Mutianyu", "Private car ~1½ hours · we’ll quote one with an infant seat", { mode: "car", duration: "~1½ h", note: "Private car with an infant seat to Mutianyu, waiting for you all day" }),
      stop("wall", "~09:30", "Mutianyu Great Wall · 慕田峪长城", "The most family-friendly restored section of the Wall. Take the enclosed cable car up, walk a stretch between the watchtowers for an hour or so, and ride back down. Entry about ¥40, cable car about ¥140 return.\n\n慕田峪长城 · 怀柔区渤海镇慕田峪村", { icon: Mountain, iconBg: "#E8F5E9", subtitle: "Enclosed cable car up and down", previewLine: "Watchtowers along the mountain ridges", tip: "Baby tip: Use the carrier on the Wall (steep steps, narrow tower doorways) and leave the stroller in the car. Take the enclosed cable car, not the open chairlift or the toboggan. It’s windy up there, so bring a cover for the carrier. If the forecast is icy or very windy, swap today with Sunday.", pictures: photos.mutianyu, transportAfter: { mode: "walk", duration: "~5 min", note: "Down to the restaurants by the visitor centre" } }),
      stop("lunch-3", "~12:00", "Lunch at the foot of the Wall", "Have lunch at the restaurants by the Mutianyu visitor centre before the drive back. The well-known Schoolhouse restaurant closes for winter, so we’ll point you to one that’s open on the day.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "By the visitor centre", previewLine: "A warm lunch before the drive back", transportAfter: { mode: "car", duration: "~1½ h", note: "Same car back to Beijing" } }),
      rest("rest-3", "~14:30", "Back at the apartment to warm up and rest after the Wall.", "Rest at the apartment"),
      stop("sanlitun", "~17:30", "Sanlitun Taikoo Li · 三里屯太古里", "Beijing’s trendiest shopping area, a short ride from your apartment: flagship stores, art installations and great people-watching, best after dark when it’s all lit up. Have dinner in one of its restaurants.\n\n三里屯太古里 · 朝阳区三里屯路19号 · 10:00–22:00", { icon: ShoppingBag, iconBg: "#FFF0EE", subtitle: "Free · lights, shops and dinner", previewLine: "Beijing’s trendiest street, lit up at night", tip: "Baby tip: The malls are heated and have mother-and-baby rooms (母婴室), so it’s an easy evening with the stroller.", pictures: photos.taikooli, transportAfter: { mode: "taxi", duration: "~10–15 min", note: "Taxi back to your apartment" } }),
    ] },

    /* ═══════ BEIJING · 13 Dec ═══════ */
    { label: "Day 4", city: "Beijing", subtitle: "Sun 13 Dec · Pandas · Moscow Restaurant · Shichahai", color: BEIJING, items: [
      leave("go-zoo", "07:30", "To Beijing Zoo", "Taxi ~30 min · or Line 2 → Line 4, ~35 min", { mode: "taxi", duration: "~30 min", note: "Taxi to the zoo’s south gate · or Line 2 to 西直门, then Line 4 to 动物园 (Exit C1)" }),
      stop("pandas", "08:00", "Panda House & Aquarium · Beijing Zoo", "The new Giant Panda House opened in July 2026 and is home to the internet-famous Meng Lan. 08:00–10:00 is when the pandas eat and play, so go there first. Zoo and Panda House together are about ¥14 in winter.\n\nThen warm up in the Beijing Aquarium in the zoo’s north-east corner: sharks, a dolphin show and huge tanks, all indoors (about ¥175 per adult, 09:00–17:30).\n\n北京动物园 大熊猫馆 · 西城区西直门外大街137号", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Pandas ~¥14 · Aquarium ~¥175", previewLine: "Meng Lan at breakfast, then the aquarium", tip: "Baby tip: The Panda House and the Aquarium are indoors and warm, and the zoo paths are wide, so the stroller is fine. You can rent one at the South Gate for about ¥30 a day.", pictures: photos.panda, transportAfter: { mode: "walk", duration: "~5 min", note: "Walk next door to the Beijing Exhibition Center" } }),
      meal("lunch-4", "~11:30", "Lunch · Moscow Restaurant · 老莫", "Beijing’s grand Soviet-era dining hall, opened in 1954 next to the zoo: chandeliers, gilded columns, and accordion and folk-song performances at lunch. Locals call it “Lao Mo”. Order the stewed beef, the baked cream vegetables and the honey cake.", { subtitle: "A 1954 dining hall · lunch 11:00–14:00", previewLine: "Chandeliers and Russian classics since 1954", pictures: photos.moscow, restaurants: [
        { name: "莫斯科餐厅（老莫）", englishName: "Moscow Restaurant", cuisine: "Russian classics", note: "Lunch 11:00–14:00. 西城区西直门外大街135号, on the west side of the Beijing Exhibition Center.", price: "~¥250 pp", image: photos.moscow[1] },
      ], transportAfter: { mode: "taxi", duration: "~30 min", note: "Taxi back to the apartment" } }),
      rest("rest-4", "~13:00", "Back at the apartment for naps before the evening at the lakes.", "Rest at the apartment"),
      stop("shichahai", "~15:30", "Shichahai & the hutongs · dinner at Kao Rou Ji", "Beijing’s old lakes and the lanes around them: willow-lined water, courtyard houses and little shops, lovely at golden hour as the lights come on. Line 6 runs direct from your area. The famous ice rink usually opens in late December, so it may not be ready yet.\n\nStay for dinner at Kao Rou Ji, a lakeside barbecue house since 1848, right by the Yinding Bridge.\n\n什刹海 · 西城区 · Line 6 北海北 or Line 8 什刹海", { icon: Sunset, iconBg: "#FFF3E0", subtitle: "Free · lakes, old lanes and dinner", previewLine: "The lakes and hutongs at golden hour", tip: "Baby tip: The lakeside paths are fine for the stroller; the hutong lanes are narrow and busy, so switch to the carrier there.", pictures: photos.shichahai, restaurants: [
        { name: "烤肉季", englishName: "Kao Rou Ji", cuisine: "Old Beijing barbecue", note: "Roast lamb and sesame flatbreads, by the lake since 1848. 西城区前海东沿14号.", price: "~¥100 pp" },
      ], transportAfter: { mode: "taxi", duration: "~15–20 min", note: "Taxi back to your apartment · pack for tomorrow’s train" } }),
    ] },

    /* ═══════ BEIJING → XI'AN · 14 Dec ═══════ */
    { label: "Day 5", city: "Xi'an", subtitle: "Mon 14 Dec · Train to Xi’an · Bell Tower · Muslim Quarter", color: XIAN, items: [
      leave("go-bjw", "~08:30", "Check out & to Beijing West", "Taxi ~40–60 min · be there an hour early", { mode: "taxi", duration: "40–60 min", note: "Taxi to Beijing West station (北京西站) · arrive an hour before the train" }),
      stop("train-xa", "~09:30", "High-speed train to Xi’an", "Beijing West → Xi’an North, about 4½–6 hours, arriving around 14:30–15:00. Tickets open about 15 days ahead (around 29–30 Nov), and we’ll book seats together for you.\n\nYour son travels free on your lap, but must be added to the ticket with his own passport. Bring your passports: they are your tickets.", { icon: TrainFront, iconBg: "#E3F2FD", type: "transport", subtitle: "Beijing West → Xi’an North · ~4½–6 h", previewLine: "Tickets open ~29–30 Nov · we’ll book", tip: "Baby tip: Every train has hot water for bottles, and there’s a dining car for lunch on board.", transportAfter: { mode: "metro", duration: "~30 min", note: "Line 2 from Xi’an North direct to 钟楼 (Bell Tower), then ~10 min walk · or taxi ~40 min" } }),
      stop("mercure", "~15:30", "Mercure Xi’an Downtown", "Your Xi’an base, inside the old city walls and about 720 m from the Bell Tower. Check in and freshen up before the evening.\n\n新城区西新街8号", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Booked 14–16 Dec · we’ll add the night of 16 Dec", previewLine: "西新街8号 · ~10 min walk to the Bell Tower", pictures: photos.mercure, transportAfter: { mode: "walk", duration: "~10 min", note: "Walk to the Bell Tower" } }),
      stop("towers", "~16:45", "Bell & Drum Towers at dusk", "The two Ming-dynasty towers in the heart of the old city. Get there as the sun goes down (about 17:40) and watch them light up gold. Walk across the square between them; the Muslim Quarter starts right behind the Drum Tower.\n\n钟楼 · 鼓楼 · 钟鼓楼广场", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Free outside · ~¥50 to go up both", previewLine: "The old towers lighting up at dusk", pictures: photos.towers, transportAfter: { mode: "walk", duration: "~5 min", note: "Walk behind the Drum Tower into the Muslim Quarter" } }),
      stop("muslimq", "~18:00", "Dinner · Muslim Quarter street food", "Xi’an’s famous food street, under red lanterns: graze your way through roujiamo (Xi’an’s meat bun), lamb skewers, biangbiang noodles on Dapiyuan and warm persimmon cakes.\n\n回民街 · 北院门 · 莲湖区", { icon: Utensils, iconBg: "#FFF1F3", subtitle: "Street food under the lanterns", previewLine: "Roujiamo, skewers and biangbiang noodles", tip: "Baby tip: The lanes are narrow and crowded in the evening, so use the carrier here.", pictures: photos.muslimQuarter, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to the hotel · or a 15–20 min walk" } }),
    ] },

    /* ═══════ XI'AN · 15 Dec ═══════ */
    { label: "Day 6", city: "Xi'an", subtitle: "Tue 15 Dec · Terracotta Warriors · Yongxingfang", color: XIAN, items: [
      leave("go-tc", "08:00", "To the Terracotta Warriors", "Private car ~1 hour · we’ll quote one with an infant seat", { mode: "car", duration: "~1 h", note: "Private car with an infant seat, waiting while you visit" }),
      stop("terracotta", "~09:00", "Terracotta Warriors · 兵马俑", "Thousands of life-size clay soldiers, each with a different face, guarding China’s first emperor for 2,200 years. Start with Pit 1, the huge hall, then Pits 2 and 3. Allow 2½–3 hours. About ¥120 per adult; book with your passports.\n\n秦始皇帝陵博物院 · 临潼区秦陵北路", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "About ¥120 · book with passports", previewLine: "Thousands of life-size clay soldiers", tip: "Baby tip: The pit halls have long, flat walkways, so the stroller works. Feed the baby in the car before you go in.", pictures: photos.terracotta, transportAfter: { mode: "car", duration: "~1 h", note: "Back into the city for lunch near the Bell Tower" } }),
      meal("lunch-6", "~13:00", "Lunch · Lao Sun Jia paomo", "Xi’an’s signature dish: you tear flatbread into small pieces in your bowl, then the kitchen cooks it in rich mutton soup. Lao Sun Jia has served it since 1898.", { subtitle: "Yangrou paomo · since 1898", previewLine: "Tear your own bread into mutton soup", pictures: photos.paomo, restaurants: [
        { name: "老孙家饭庄（东关正街店）", englishName: "Lao Sun Jia", cuisine: "Mutton paomo", note: "The historic flagship. Tear the bread small, about pea-sized, so it soaks up the soup, and eat it with sweet pickled garlic and chilli sauce. 08:00–21:30. 碑林区东关正街78号.", price: "~¥35 a bowl", image: photos.paomo[0] },
        { name: "老米家泡馍", englishName: "Lao Mi Jia", cuisine: "Mutton paomo", note: "The one many locals swear by, in the Muslim Quarter. It sells out, so go early. 莲湖区西羊市.", price: "~¥50 pp" },
      ], transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to the hotel" } }),
      rest("rest-6", "~14:00", "Back at the hotel for naps after the early start."),
      stop("yongxing", "~16:30", "Yongxingfang & the City Wall at dusk", "A food street right by the city wall’s Zhongshan Gate, with 100+ Shaanxi dishes in one place under red lanterns. Walk up to the wall here for the sunset over the rooftops, then eat your way along the street for dinner: try the noodles, the cold skin noodles (liangpi) and the dumplings.\n\n永兴坊 · 新城区东新街（中山门）", { icon: Utensils, iconBg: "#FFF1F3", subtitle: "Free · dinner under the lanterns", previewLine: "Lanterns and Shaanxi snacks by the wall", tip: "Baby tip: The food street is flat; the steps up the wall need the carrier.", pictures: photos.yongxing, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to the hotel" } }),
    ] },

    /* ═══════ XI'AN · 16 Dec ═══════ */
    { label: "Day 7", city: "Xi'an", subtitle: "Wed 16 Dec · City Wall · History Museum · Datang Everbright City", color: XIAN, items: [
      leave("go-wall", "09:45", "To the South Gate", "Line 2, one stop from the Bell Tower · or taxi ~10 min", { mode: "metro", duration: "~10 min", note: "Line 2 钟楼 → 永宁门, one stop · or taxi ~10 min" }),
      stop("citywall", "10:00", "Xi’an City Wall · South Gate", "The best-preserved city wall in China, 14 km round the old town. Walk a stretch on top from the South Gate (Yongningmen) for views over the rooftops and the old gate towers. About ¥54 per adult. Allow 1½ hours.\n\n西安城墙 永宁门（南门）· 碑林区", { icon: Castle, iconBg: "#FFF3E0", subtitle: "About ¥54 · a walk on top", previewLine: "China’s best-preserved city wall", tip: "Baby tip: The top is wide and flat, but the way up is stairs, so bring the carrier.", pictures: photos.cityWall, transportAfter: { mode: "walk", duration: "~5 min", note: "Down to lunch near the South Gate" } }),
      stop("lunch-7", "~12:00", "Lunch near the South Gate", "Plenty of Xi’an noodle and dumpling restaurants just inside the South Gate. Keep it easy before the afternoon in the south of the city.", { icon: Utensils, iconBg: "#FFF1F3", type: "meal", subtitle: "Noodles and dumplings", previewLine: "An easy lunch by the gate", transportAfter: { mode: "taxi", duration: "~20 min", note: "Taxi to the Shaanxi History Museum, 小寨东路91号" } }),
      stop("museum-xa", "~14:00", "Shaanxi History Museum · 陕西历史博物馆", "China’s great collection of Tang gold, murals and bronzes, all indoors and warm. Allow about 2 hours. Free, but tickets are real-name and go fast, so we’ll book them 5–7 days ahead. Closed on Mondays.\n\n陕西历史博物馆 · 雁塔区小寨东路91号", { icon: Landmark, iconBg: "#F3E8FF", subtitle: "Free · we’ll book 5–7 days ahead", previewLine: "Tang gold, murals and bronzes", tip: "Baby tip: Indoors and step-free, so the stroller is fine, and a good place for an afternoon nap on the go.", pictures: photos.shaanxiMuseum, transportAfter: { mode: "walk", duration: "~20 min", note: "Walk or taxi 5 min to the Big Wild Goose Pagoda, ~1.5 km" } }),
      stop("goose", "~16:30", "Big Wild Goose Pagoda at sunset", "The 1,300-year-old Tang pagoda where the monk Xuanzang kept the scriptures he brought back from India. See it from the North Square as the sun goes down, then walk south into Datang Everbright City.\n\n大雁塔北广场 · 雁塔区雁塔路", { icon: Sunset, iconBg: "#FFF3E0", subtitle: "Free from the square", previewLine: "The Tang pagoda at sunset", pictures: photos.goose, transportAfter: { mode: "walk", duration: "~5 min", note: "Walk south into Datang Everbright City" } }),
      stop("datang", "~17:45", "Datang Everbright City & Chang’an Twelve Hours", "A 1.5 km Tang-dynasty boulevard that lights up gold after dark. Look for the viral “Tumbler Lady”, a performer in Tang dress swaying on a giant wobbling base, and the street shows from about 19:00. Free; allow 2 hours.\n\nFor dinner, go into Chang’an Twelve Hours next to it: an indoor Tang street from the TV drama, with lanterns, costumed performers, snacks and a Tang banquet (about ¥392 for two). It’s warm, so a good break from the cold.\n\n大唐不夜城 · 雁塔区慈恩路 · 长安十二时辰主题街区 · 曼蒂广场", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Free · shows from about 19:00 · dinner indoors", previewLine: "A Tang-dynasty boulevard lit up in gold", tip: "Baby tip: The boulevard is wide and flat, so the stroller is fine. It gets busy after 19:00, so keep to the edges.", pictures: [...photos.datang, photos.changan[0]], transportAfter: { mode: "taxi", duration: "~20 min", note: "Taxi back to the hotel · early night before the flight" } }),
    ] },

    /* ═══════ XI'AN → ZHANGJIAJIE · 17 Dec ═══════ */
    { label: "Day 8", city: "Zhangjiajie", subtitle: "Thu 17 Dec · Fly to Zhangjiajie · XiBu Street", color: ZHANGJIAJIE, items: [
      leave("go-xiy", "Flight TBC", "Check out & to Xi’an Airport", "Car ~50–75 min · we’ll pick a late-morning flight", { mode: "car", duration: "50–75 min", note: "Car with an infant seat to Xi’an Xianyang Airport" }),
      stop("fly-zjj", "Flight TBC", "Flight to Zhangjiajie", "Xi’an → Zhangjiajie Hehua Airport, about 1½ hours direct. We’ll look for a late-morning flight, landing around midday, and book it with an infant ticket for your son.", { icon: Plane, iconBg: "#E3F2FD", type: "transport", subtitle: "Direct · ~1½ h", previewLine: "Xi’an → Zhangjiajie · we’ll book", transportAfter: { mode: "car", duration: "45–60 min", note: "Car with an infant seat to Wulingyuan" } }),
      stop("hilton-zjj", "~14:30", "Hilton Garden Inn Wulingyuan", "Our pick for your three park nights: opened in 2025 near the Forest Park’s east side, with family rooms, an outdoor pool and a children’s play area.\n\n张家界武陵源希尔顿花园酒店 · 武陵源区宝峰路108号", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Our pick · 17–20 December · to book", previewLine: "宝峰路108号 · near the park’s east gate", pictures: photos.hiltonZjj, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi to XiBu Street when you’re ready" } }),
      stop("xibu", "~17:00", "XiBu Street · dinner", "After a slow afternoon settling in (the hotel has a pool and a play area), head to Wulingyuan’s lit-up riverside street of wooden Tujia buildings, snack stalls and crafts. Pick somewhere along it for dinner.\n\n溪布街 · 武陵源区", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Free · riverside lights", previewLine: "Wooden houses lit up along the river", tip: "Baby tip: Flat and fine for the stroller.", pictures: photos.xibu, transportAfter: { mode: "taxi", duration: "~5–10 min", note: "Taxi back to the hotel" } }),
    ] },

    /* ═══════ ZHANGJIAJIE · 18 Dec ═══════ */
    { label: "Day 9", city: "Zhangjiajie", subtitle: "Fri 18 Dec · National Forest Park, day 1 · Tianzi Mountain · Baofeng Lake", color: ZHANGJIAJIE, items: [
      leave("go-park", "08:30", "Into Zhangjiajie National Forest Park", "Taxi ~10 min to the Wulingyuan gate · buy the 4-day park ticket", { mode: "taxi", duration: "~10 min", note: "Taxi to the Wulingyuan gate (武陵源门票站). Buy the 4-day park ticket (about ¥225) with your passports; it covers today, tomorrow and the free park buses" }),
      stop("tenmile", "~09:00", "Ten-Mile Gallery · 十里画廊", "Ride the little sightseeing train along a valley lined with pillar formations with names like “Old Man Picking Herbs” and “Three Sisters”. About an hour there and back.\n\n十里画廊 · 张家界国家森林公园 · 索溪峪", { icon: TrainFront, iconBg: "#E3F2FD", subtitle: "In the National Forest Park · mini-train", previewLine: "A mini-train past the pillar formations", tip: "Baby tip: The train is the easy way with a baby; the flat path beside it also works with the stroller.", pictures: photos.tenMile, transportAfter: { mode: "shuttle", duration: "~20 min", note: "Park bus to the Tianzi Mountain cable car (天子山索道)" } }),
      stop("tianzi", "~10:30", "Tianzi Mountain · 天子山", "Ride the Tianzi cable car up (about 6½ minutes, about ¥72 each way) to a forest of sandstone peaks, often floating in mist. Walk the paved viewpoints at the top, Helong Park and Imperial Brush Peak, and have lunch up there: there are simple restaurants, and even a McDonald’s, with indoor seating to warm up. Ride back down at about 13:30.\n\n天子山索道 · 贺龙公园 · 御笔峰 · 张家界国家森林公园", { icon: Mountain, iconBg: "#E8F5E9", subtitle: "In the National Forest Park · cable car ~¥72 each way", previewLine: "A forest of peaks floating in the mist", tip: "Baby tip: Use the carrier on the summit paths. It’s much colder up top than in town, so bring an extra layer and a hat. The park buses have no English signs: show the driver “天子山索道”.", pictures: photos.tianzi, transportAfter: { mode: "taxi", duration: "~30 min", note: "Cable car down, park bus to the gate, taxi to the hotel" }, alternatives: [
        alt("🌫 Thick fog up top?", "Swap with Huanglong Cave", "If the peaks are hidden in fog this morning, do Huanglong Cave now and Tianzi Mountain on Saturday afternoon instead, when the fog often lifts. The park ticket covers both days.", { images: photos.huanglong, gettingThere: "Taxi ~15 min from the hotel · 黄龙洞" }),
      ] }),
      rest("rest-9", "~14:30", "An hour back at the hotel for naps before the lake."),
      stop("baofeng", "~15:45", "Baofeng Lake · 宝峰湖", "A green lake among the sandstone pillars, 10 minutes from the hotel, crossed by boat with Tujia folk singers along the way. About 1½ hours; boat about ¥96. Last boats are around 17:00, so don’t leave it later than about 15:45.\n\n宝峰湖 · 武陵源区宝峰路", { icon: Ship, iconBg: "#EDE7F6", subtitle: "Boat ~¥96 · 10 min from the hotel", previewLine: "A boat across a lake among the peaks", tip: "Baby tip: There’s a short, steep climb up to the boat, so use the carrier.", pictures: photos.baofeng, transportAfter: { mode: "taxi", duration: "~5 min", note: "Taxi back towards the hotel for dinner nearby" } }),
      stop("xiangxi", "~19:00", "Charming Xiangxi show (optional)", "Wulingyuan’s signature evening show of Tujia and Miao songs, dance and stunts, indoors with a bonfire finale outside. About ¥180. It’s loud, so it’s best if the baby sleeps through noise; otherwise have a quiet dinner near the hotel.\n\n魅力湘西大剧院 · 武陵源区", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Optional · about ¥180", previewLine: "Tujia and Miao songs, dance and a bonfire", pictures: photos.xiangxi }),
    ] },

    /* ═══════ ZHANGJIAJIE · 19 Dec ═══════ */
    { label: "Day 10", city: "Zhangjiajie", subtitle: "Sat 19 Dec · National Forest Park, day 2 · Golden Whip Stream · Yuanjiajie", color: ZHANGJIAJIE, items: [
      leave("go-park-2", "08:30", "Back into the National Forest Park", "Taxi ~10 min to the gate · park bus to Shuiraosimen", { mode: "taxi", duration: "~10 min", note: "Taxi to the Wulingyuan gate, then the park bus to 水绕四门 (Shuiraosimen). Yesterday’s ticket still works" }),
      stop("golden", "~09:00", "Golden Whip Stream · 金鞭溪", "A flat, paved path along a clear stream at the foot of the stone pillars, through quiet forest. Walk in from the Shuiraosimen end for about an hour, then turn back. Most people turn round after the first stretch, so the further you go, the quieter it gets.\n\n金鞭溪 · 水绕四门 · 张家界国家森林公园", { icon: Footprints, iconBg: "#E8F5E9", subtitle: "In the National Forest Park · flat walk", previewLine: "A flat forest walk under the pillars", tip: "Baby tip: This is the one place in the park where the stroller works well. Keep snacks in a zipped bag: the macaques are bold.", pictures: photos.golden, transportAfter: { mode: "walk", duration: "~10 min", note: "Walk back to the Bailong Elevator, ~700 m away" } }),
      stop("bailong", "~10:30", "Bailong Elevator · 百龙天梯", "A glass lift up the outside of a 326 m cliff, the tallest outdoor elevator in the world, in about a minute. About ¥65 each way.\n\n百龙天梯 · 水绕四门", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "About ¥65 each way · ~1 min up", previewLine: "A glass lift up a 326 m cliff", tip: "Baby tip: At the entrance and exit you may need to lift the stroller over a short slope.", pictures: photos.bailong, transportAfter: { mode: "shuttle", duration: "~5 min", note: "Park bus from the top of the lift to Yuanjiajie" } }),
      stop("yuanjiajie", "~11:00", "Yuanjiajie · the “Avatar” peaks", "The floating mountains from Avatar. Walk the loop to Hallelujah Mountain (乾坤柱), the First Natural Bridge and Mihun Terrace, about 2½ hours with stops, and have lunch at the restaurants by the Yuanjiajie bus stop. Then take the Bailong Elevator back down at about 13:45. If Saturday looks clearer than Friday, swap the two days so you get the best views here.\n\n袁家界 · 张家界国家森林公园", { icon: Mountain, iconBg: "#E8F5E9", subtitle: "In the National Forest Park · the Avatar mountains", previewLine: "The floating mountains from Avatar", tip: "Baby tip: Some sections are steep, so use the carrier.", pictures: photos.yuanjiajie, transportAfter: { mode: "taxi", duration: "~20 min", note: "Down the elevator, park bus to the gate, taxi to the hotel" } }),
      rest("rest-10", "~14:30", "An hour back at the hotel to rest before the cave."),
      stop("huanglong", "~15:30", "Huanglong Cave · 黄龙洞", "A huge cave of lit-up stalactites, with a boat ride on an underground river, 15 minutes from the hotel. Warm and dry whatever the weather. About 1½ hours; about ¥100–120. Then dinner near the hotel.\n\n黄龙洞 · 武陵源区索溪峪镇河口村", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Indoors · about ¥100–120", previewLine: "Lit-up caverns and an underground river", tip: "Baby tip: Stairs throughout, so use the carrier. It’s also the backup if the weather closes the peaks on either park day.", pictures: photos.huanglong, transportAfter: { mode: "taxi", duration: "~15 min", note: "Taxi back to the hotel · dinner nearby" } }),
    ] },

    /* ═══════ ZHANGJIAJIE CITY · 20 Dec ═══════ */
    { label: "Day 11", city: "Zhangjiajie", subtitle: "Sun 20 Dec · Tianmen Mountain · 72 Wonder Buildings", color: ZHANGJIAJIE, items: [
      leave("go-city", "08:30", "Check out & to Zhangjiajie city", "Car ~1 hour · leave your bags at the hotel", { mode: "car", duration: "~1 h", note: "Car with an infant seat from Wulingyuan to your city hotel" }),
      stop("wyndham-zjj", "~09:30", "Wyndham Garden Tianmen Mountain", "Our pick for your last Zhangjiajie night: about 600 m from the Tianmen Mountain cable-car station, and 15–20 minutes from the airport for tomorrow. Leave your bags and head out.\n\n永定区 · near 天门山索道", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Our pick · 20–21 December · to book", previewLine: "~600 m to the Tianmen cable car", pictures: photos.wyndhamZjj, transportAfter: { mode: "walk", duration: "~10 min", note: "Walk to the Tianmen cable-car station for the shuttle" } }),
      stop("tianmen", "~10:00", "Tianmen Mountain · Route C", "The long city cable car has been closed since 13 October 2026, so for now only Route C runs: a shuttle from the city cable-car station to the mountain gate (about 20 minutes), the Tianmen Cave express cable car, then indoor escalators to the summit and its cliff-top views. About ¥288 per adult. Allow until about 14:30, with lunch on the mountain: there’s a food hall near Tianmen Cave, or take snacks from the hotel.\n\n天门山国家森林公园 · 永定区天门路", { icon: Mountain, iconBg: "#E8F5E9", subtitle: "Route C · ~¥288 · we’ll confirm before you go", previewLine: "Tianmen Cave and the summit above the clouds", tip: "Baby tip: Route C is a shuttle, a cable car and escalators, so carrier only. We’d skip the 999 steps and the glass skywalk with the baby.", pictures: photos.tianmen, transportAfter: { mode: "walk", duration: "~10 min", note: "Shuttle back down, then a short walk to the hotel" } }),
      rest("rest-11", "~15:00", "Check in and rest before the evening."),
      stop("qilou", "~17:30", "72 Wonder Buildings & Dayong Ancient Town", "A towering Tujia-style complex that lights up gold after dark, with a food street of stalls each selling one local speciality: have dinner here. Dayong Ancient Town, the city’s old quarter, is 5 minutes’ walk away. Evening entry about ¥88.\n\n七十二奇楼 · 永定区武陵山大道1号 · 大庸府城 · 解放路", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Lit up after dark · dinner · ~¥88 evening entry", previewLine: "A Tujia fantasy building glowing gold", tip: "Baby tip: Fine for the stroller.", pictures: photos.qilou, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to the hotel" } }),
    ] },

    /* ═══════ ZHANGJIAJIE → SHANGHAI · 21 Dec ═══════ */
    { label: "Day 12", city: "Shanghai", subtitle: "Mon 21 Dec · Fly to Shanghai · Nanjing Road & the Bund", color: SHANGHAI, items: [
      leave("go-dyg", "Flight TBC", "To Zhangjiajie Airport", "Taxi 15–20 min from the hotel", { mode: "taxi", duration: "15–20 min", note: "Taxi to Zhangjiajie Hehua Airport" }),
      stop("fly-sh", "Flight TBC", "Flight to Shanghai", "Zhangjiajie → Shanghai, about 2–2½ hours direct, usually into Pudong. We’ll book it with an infant ticket, aiming to land by mid-afternoon.", { icon: Plane, iconBg: "#E3F2FD", type: "transport", subtitle: "Direct · ~2–2½ h", previewLine: "Zhangjiajie → Shanghai · we’ll book", transportAfter: { mode: "metro", duration: "~1¼ h", note: "Line 2 from Pudong direct to People’s Square · or taxi ~50–60 min" } }),
      stop("atour", "Afternoon", "Atour Hotel, People’s Square", "Our pick for Shanghai: opened in 2024 in the heart of People’s Square, with family rooms and the Bund and Nanjing Road a short walk away.\n\n亚朵酒店 · 黄浦区北京西路199号", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Our pick · 21–25 December · to book", previewLine: "北京西路199号 · People’s Square", pictures: photos.atour, transportAfter: { mode: "walk", duration: "~10 min", note: "Walk to Nanjing Road East" } }),
      stop("bund-walk", "~17:30", "Nanjing Road East to the Bund", "Walk Shanghai’s famous pedestrian street, all lit up, down to the river. At the end is the Bund: the 1920s buildings glowing gold on your side and the Pudong skyscrapers lit up across the water. About 30 minutes’ walk end to end. Stop for dinner on the way at Yang’s Dumpling.\n\n南京路步行街 → 外滩 · 黄浦区", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Free · Shanghai’s skyline at night", previewLine: "The Bund lit up on your first night", tip: "Baby tip: Flat all the way, so the stroller is easy.", pictures: photos.bundWalk }),
      meal("dinner-12", "~18:00", "Dinner · Yang’s Dumpling", "Shanghai’s famous pan-fried pork buns (shengjianbao): crispy bottoms, juicy inside. Quick and easy after a travel day.", { subtitle: "Shengjianbao · on the way to the Bund", previewLine: "Crispy pan-fried pork buns", pictures: photos.yangs, restaurants: [
        { name: "小杨生煎（宁波路店）", englishName: "Yang’s Dumpling, Ningbo Road", cuisine: "Shengjianbao", note: "Bite a small hole and sip the soup first: it’s very hot. The Huanghe Road flagship is listed as temporarily closed, so this branch near Nanjing Road is the one to go to.", price: "~¥30–50 pp", image: photos.yangs[0] },
      ], transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to the hotel from the Bund · or walk back along Nanjing Road" } }),
    ] },

    /* ═══════ SHANGHAI · 22 Dec ═══════ */
    { label: "Day 13", city: "Shanghai", subtitle: "Tue 22 Dec · Yu Garden · Shanghai Museum · Christmas market", color: SHANGHAI, items: [
      leave("go-yu", "08:15", "To Yu Garden", "Taxi ~10 min · or Line 10, two stops", { mode: "taxi", duration: "~10 min", note: "Taxi ~¥15 · or Line 10 南京东路 → 豫园, two stops" }),
      meal("breakfast-13", "08:30", "Breakfast · Nanxiang Steamed Bun", "Shanghai’s most famous soup dumplings, next to the Yu Garden bridge since 1900. Go before 9:00 to beat the queue, and sit upstairs rather than queuing at the takeaway window.\n\n南翔馒头店（城隍庙店）· 豫园路87号", { subtitle: "Soup dumplings · before 9:00", previewLine: "Shanghai’s most famous soup dumplings", pictures: photos.nanxiang, transportAfter: { mode: "walk", duration: "~5 min", note: "Walk to the Yu Garden entrance" } }),
      stop("yugarden", "09:00", "Yu Garden & the old town", "A Ming-dynasty garden of pavilions, rockeries and koi ponds. Go at opening, before the crowds, and allow about 1½ hours. About ¥30 per adult in December. Then wander the old-town bazaar around it: the Nine-Turn Bridge, the City God Temple and the snack and tea shops.\n\n上海豫园 · 黄浦区福佑路168号 · 09:00–16:30", { icon: Sun, iconBg: "#FFF3E0", subtitle: "About ¥30 · book with your passports", previewLine: "Pavilions, rockeries and the old bazaar", tip: "Baby tip: The garden has lots of steps and raised thresholds, so use the carrier.", pictures: photos.yugarden, transportAfter: { mode: "walk", duration: "~5 min", note: "Walk to Lu Bo Lang, by the Nine-Turn Bridge" } }),
      meal("lunch-13", "~12:00", "Lunch · Lu Bo Lang · 绿波廊", "A Michelin Bib Gourmand teahouse-restaurant by the Nine-Turn Bridge, famous for its little Shanghai pastries and crab-roe soup dumplings. Try the boneless eight-treasure duck and the salt-and-pepper gourd pastries.", { subtitle: "Michelin Bib Gourmand · 11:00–14:00", previewLine: "Shanghai pastries by the Nine-Turn Bridge", pictures: photos.lubolang, restaurants: [
        { name: "绿波廊（豫园店）", englishName: "Lu Bo Lang", cuisine: "Shanghainese & dim sum", note: "Lunch 11:00–14:00. It gets busy, so arrive by 12:00. 豫园路115号.", price: "~¥150 pp", image: photos.lubolang[0] },
      ], transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to the hotel" } }),
      rest("rest-13", "~13:15", "Back at the hotel for naps; the afternoon stops are all a short walk away."),
      stop("shmuseum", "~15:15", "Shanghai Museum · 上海博物馆", "Bronzes, ceramics, jade and furniture in a building shaped like an ancient cooking pot, on People’s Square next to your hotel. Free, with an advance reservation; last entry 16:00, closed on Mondays. An hour is plenty.\n\n上海博物馆 · 黄浦区人民大道 · People’s Square", { icon: Landmark, iconBg: "#F3E8FF", subtitle: "Free · we’ll reserve it", previewLine: "Bronzes, jade and ceramics, next to your hotel", tip: "Baby tip: Indoors, warm and step-free, so the stroller is fine.", pictures: photos.shMuseum, transportAfter: { mode: "walk", duration: "~20 min", note: "Walk down Nanjing Road to the Christmas market · or taxi ~10 min" } }),
      stop("xmas", "~16:45", "Christkindlmarkt on the Bund · dinner", "Shanghai’s big German-style Christmas market, in the old red-brick buildings of Rockbund: 40+ wooden stalls, mulled wine, a carousel, a giant tree and “snow” a couple of times an hour. Have dinner from the stalls. Listed for 25 Nov–27 Dec 2026, about ¥30–40 entry. Weekdays are calmer than weekends.\n\n外滩源 · 黄浦区圆明园路 · near 北京东路", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "About ¥30–40 · buy on WeChat", previewLine: "Wooden stalls, lights and mulled wine", tip: "Baby tip: Fine for the stroller, but it fills up later in the evening.", pictures: photos.xmas, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to the hotel" } }),
    ] },

    /* ═══════ SHANGHAI · 23 Dec ═══════ */
    { label: "Day 14", city: "Shanghai", subtitle: "Wed 23 Dec · Lujiazui · Zhangyuan · River cruise", color: SHANGHAI, items: [
      leave("go-ljz", "09:30", "To Lujiazui", "Line 2 to Lujiazui · ~15 min", { mode: "metro", duration: "~15 min", note: "Line 2 人民广场 → 陆家嘴" }),
      stop("lujiazui", "~10:00", "Shanghai Tower & the IFC Christmas tree", "Go up to the 118th-floor viewing deck of China’s tallest building for a 360° view over the city (adults about ¥180), then see the giant Christmas tree and indoor ice rink at IFC Mall next door, and walk the riverside promenade.\n\n上海中心大厦 · 浦东新区银城中路501号 · 国金中心 IFC · 世纪大道8号", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Viewing deck ~¥180 · Christmas tree free", previewLine: "The city from the 118th floor", tip: "Baby tip: It’s all lifts and malls, so the stroller is fine.", pictures: photos.lujiazui, transportAfter: { mode: "metro", duration: "~20 min", note: "Line 2 back to 人民广场 for lunch at Lai Lai" } }),
      meal("lunch-14", "~12:15", "Lunch · Lai Lai Xiao Long", "The top pick for crab-roe soup dumplings, Michelin-recognised, near the hotel. Order at the front of the queue, then share a table. Expect a 20–30 minute wait.\n\n莱莱小笼 · 天津路506号", { subtitle: "Crab-roe soup dumplings", previewLine: "Crab-roe soup dumplings", pictures: photos.lailai, transportAfter: { mode: "walk", duration: "~10 min", note: "Back to the hotel" } }),
      rest("rest-14", "~13:15", "Back at the hotel for naps before the afternoon."),
      stop("zhangyuan", "~15:00", "Zhangyuan & Jing’an Temple", "Shanghai’s largest group of old stone-gate lane houses, restored into quiet lanes of flagship shops and cafés, and five minutes away the golden roofs of Jing’an Temple among the skyscrapers. About 1½ hours.\n\n张园 · 静安区茂名北路258号 · 静安寺 · Line 2 南京西路 or 静安寺, 1–2 stops", { icon: ShoppingBag, iconBg: "#FFF0EE", subtitle: "Free · Jing’an Temple ~¥50", previewLine: "Restored lanes and a golden temple", tip: "Baby tip: The lanes are flat, so the stroller is fine; the temple has a few steps.", pictures: photos.zhangyuan, transportAfter: { mode: "taxi", duration: "~20 min", note: "Taxi to Shiliupu pier for the cruise" } }),
      stop("cruise", "~17:15", "Huangpu River night cruise", "About 45 minutes on the river from Shiliupu pier, just after the lights come on: the 1920s Bund glowing gold on one side, the Pudong skyscrapers on the other. Adults about ¥120. Have dinner along the Bund afterwards.\n\n十六铺旅游码头 · 黄浦区中山东二路531号", { icon: Ship, iconBg: "#EDE7F6", subtitle: "About ¥120 · ~45 min", previewLine: "The Bund and Pudong lit up, from the water", tip: "Baby tip: Use the carrier for boarding. The indoor deck is heated.", pictures: photos.cruise, transportAfter: { mode: "taxi", duration: "~10 min", note: "Dinner by the Bund, then taxi back to the hotel" } }),
    ] },

    /* ═══════ SHANGHAI · 24 Dec ═══════ */
    { label: "Day 15", city: "Shanghai", subtitle: "Thu 24 Dec · French Concession · Tianzifang · Christmas Eve", color: SHANGHAI, items: [
      leave("go-ffc", "10:00", "To Wukang Road", "Line 10 to Jiaotong University · or taxi ~20 min", { mode: "metro", duration: "~25 min", note: "Line 10 南京东路 → 交通大学 · or taxi ~20 min" }),
      stop("wukang", "~10:30", "Wukang Road & Anfu Road", "The prettiest part of old Shanghai: Wukang Mansion, a 1924 building shaped like a ship’s bow, then leafy streets of plane trees, villas, cafés and small shops along Wukang Road and Anfu Road.\n\n武康大楼 · 徐汇区淮海中路1850号 · 安福路", { icon: Footprints, iconBg: "#FFF0EE", subtitle: "Free · a slow walk", previewLine: "Plane trees, villas and cafés", tip: "Baby tip: Flat, tree-lined streets, good for the stroller.", pictures: photos.wukang, transportAfter: { mode: "walk", duration: "~15 min", note: "Walk to Donghu Road for lunch" } }),
      meal("lunch-15", "~12:30", "Lunch · Hikiniku To Come", "New in 2026 and viral: the Tokyo spot for wagyu hamburger steak over rice, grilled over charcoal and served at a counter. It has had queues since the day it opened.\n\n挽肉と米 · 东湖路 FUFU", { subtitle: "Wagyu hamburg over rice · new in 2026", previewLine: "Charcoal-grilled wagyu over rice", pictures: photos.hikiniku, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi to White Foods on Hengshan Road" } }),
      meal("cafe-15", "~14:00", "Coffee · White Foods", "A calm, light-filled café-restaurant famous for its six-flavour toast and matcha desserts.\n\n白膳鸣 · 徐汇区衡山路", { icon: Sparkles, iconBg: "#FFF1F3", subtitle: "Six-flavour toast · matcha", previewLine: "Matcha desserts and viral toast", pictures: photos.whitefoods, transportAfter: { mode: "taxi", duration: "~15 min", note: "Taxi to Tianzifang, 泰康路210弄" } }),
      stop("tianzifang", "~15:15", "Tianzifang · 田子坊", "A maze of old stone-gate lanes turned into 200+ little shops, galleries, cafés and bars. Free; allow about an hour.\n\n田子坊 · 黄浦区泰康路210弄 · Line 9 打浦桥 Exit 1", { icon: ShoppingBag, iconBg: "#FFF0EE", subtitle: "Free · lanes of little shops", previewLine: "Old lanes full of shops and cafés", tip: "Baby tip: The lanes are narrow and busy, so the carrier is easier than the stroller.", pictures: photos.tianzifang, transportAfter: { mode: "taxi", duration: "~5 min", note: "Taxi to Xintiandi · or a 20-min walk" } }),
      stop("xintiandi", "~16:45", "Xintiandi at Christmas · dinner", "Old stone-gate lanes of cafés, shops and restaurants, dressed up with Christmas lights, for a Christmas Eve stroll and dinner. The Bund and Nanjing Road get extremely crowded tonight with police crowd control, so we’d skip them this evening.\n\n上海新天地 · 黄浦区太仓路181弄", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Christmas lights · dinner", previewLine: "Christmas lights in the old lanes", tip: "Baby tip: Flat and fine for the stroller; the malls next door have baby rooms.", pictures: photos.xintiandi, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to the hotel · pack for tomorrow" } }),
    ] },

    /* ═══════ 25 Dec ═══════ */
    { label: "Day 16", city: "Shanghai", subtitle: "Fri 25 Dec · Flight home", color: SHANGHAI, items: [
      stop("bund-morning", "Morning", "A last walk on the Bund (if your flight is in the afternoon)", "The Bund is quiet and beautiful in the morning light, 15 minutes’ walk from the hotel. Allow an hour, then back to check out.\n\n外滩 · 黄浦区中山东一路", { icon: Sun, iconBg: "#FFF3E0", subtitle: "Free · if time allows", previewLine: "The Bund in the morning light", tip: "Baby tip: Flat all the way, so the stroller is easy.", pictures: [`${SH}/bund-buildings.png`, `${SH}/bund-skyline.jpg`] }),
    ] },
  ];

  return {
    cityName: "Beijing, Xi’an, Zhangjiajie & Shanghai",
    title: "Family Trip to China",
    location: "Beijing · Xi’an · Zhangjiajie · Shanghai",
    duration: "16 Days · 10–25 Dec",
    heroImage: photos.forbidden[0],
    overview: [
      { icon: "🏯", label: "Forbidden City · Great Wall · pandas" },
      { icon: "🗿", label: "Terracotta Warriors · Tang nights" },
      { icon: "⛰️", label: "Two days in Zhangjiajie National Forest Park" },
      { icon: "🎄", label: "Christmas in Shanghai" },
    ],
    picks: [],
    meiGreeting: "Here’s your family trip, day by day, with the Chinese name and address of every stop for Amap or DiDi, and a baby tip for each place.",
    departure: {
      time: "Fri 25 Dec · flight TBC",
      title: "Transfer to the airport",
      description: "Check out and head to the airport: Pudong is about 50–60 minutes by car from People’s Square. Aim to arrive 3 hours before your international flight. We’ll set the pickup time once we have your flight.",
    },
    departureNote: "Safe travels home, and message us any time during your trip!",
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
