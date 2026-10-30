import { Car, Castle, Footprints, Hotel, Moon, Mountain, Plane, Ship, ShoppingBag, Sparkles, Sun, Sunset, TrainFront, Utensils } from "lucide-react";
import type { ItineraryConfig } from "../ItineraryPage";

/* First draft, 30 Oct 2026. Flights, the Xi'an night of 16 Dec and the
   Zhangjiajie and Shanghai hotels are still to confirm with the family.
   Journey times are estimates, to check in Amap before the trip.
   Photo sources: photo-sources.json. */
type Item = ItineraryConfig["days"][number]["items"][number];
type Alternative = NonNullable<Item["alternatives"]>[number];
const J = (name: string) => `/uploads/itinerary/jashim/${name}.webp`;
const BJ = "/uploads/itinerary/beijing";
const SH = "/uploads/itinerary/shanghai/scraper";
const DO = "/uploads/itinerary/doanhtu";

export const photos = {
  forbidden: [`${BJ}/forbidden2.jpg`, `${BJ}/scraper/forbidden-taihe.jpg`, `${BJ}/forbidden3.jpg`],
  siji: [J("siji-duck"), J("siji-view")],
  mutianyu: [`${BJ}/scraper/mutianyu-towers.webp`, `${BJ}/mutianyu2.jpg`],
  taikooli: [J("taikooli"), J("taikooli-2")],
  panda: [J("panda"), J("panda-snow"), J("zoo-gate")],
  shichahai: [`${BJ}/shichahai2.jpg`, `${BJ}/shichahai3.jpg`, `${BJ}/hutong2.jpg`],
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
  datang: [J("datang"), J("datang-2"), J("goose")],
  changan: [J("changan"), J("changan-2")],
  shaanxiMuseum: [J("shaanxi-museum"), J("shaanxi-museum-2")],
  hiltonZjj: [J("hilton-zjj"), J("hilton-zjj-2")],
  tianzi: ["/uploads/itinerary/tianzi_clouds.jpeg", J("tianzi-sunrise"), "/uploads/itinerary/tianzi.jpeg"],
  golden: [J("golden"), J("golden-2")],
  bailong: [J("bailong"), J("bailong-2")],
  yuanjiajie: [J("yuanjiajie"), J("yuanjiajie-2"), "/uploads/itinerary/avatar.jpeg"],
  xibu: [J("xibu"), J("xibu-2")],
  huanglong: [J("huanglong"), J("huanglong-2")],
  baofeng: [J("baofeng"), J("baofeng-2"), "/uploads/itinerary/baofeng_lake.jpg"],
  wyndhamZjj: [J("wyndham-zjj"), J("wyndham-zjj-2")],
  tianmen: [J("tianmen"), "/uploads/itinerary/tianmen_cablecar.webp"],
  qilou: [J("qilou"), J("qilou-2"), J("dayong")],
  xiangxi: [J("xiangxi"), J("xiangxi-2")],
  furong: [J("furong"), J("furong-2")],
  atour: [J("atour"), J("atour-2")],
  yangs: [J("yangs"), J("yangs-2")],
  nanxiang: ["/uploads/itinerary/theresa/nanxiang.webp", "/uploads/itinerary/theresa/nanxiang-2.webp"],
  yugarden: ["/uploads/itinerary/ardio/yugarden.webp", J("yugarden-2"), `${SH}/yugarden-bridge.jpg`],
  xmas: [J("xmas"), J("xmas-2"), J("xmas-3")],
  lujiazui: [`${SH}/shanghai-tower.webp`, `${DO}/lujiazui-bridge-2.webp`],
  lailai: [`${DO}/lailai.webp`, `${DO}/lailai-2.webp`],
  cruise: [`${SH}/huangpu-cruise.jpg`, "/uploads/itinerary/thebund.jpeg"],
  wukang: ["/uploads/itinerary/xhs/wukang.webp", "/uploads/itinerary/ruijun/wukang-2.webp", "/uploads/itinerary/ardio/anfu-street.webp"],
  hikiniku: [J("hikiniku"), J("hikiniku-2")],
  whitefoods: [J("whitefoods"), J("whitefoods-2")],
  xintiandi: ["/uploads/itinerary/antonio/xintiandi-1.webp", "/uploads/itinerary/antonio/xintiandi-2.webp"],
  jiajia: ["/uploads/itinerary/ardio/jiajia.webp", "/uploads/itinerary/antonio/xiaolongbao.webp"],
  disney: ["/uploads/itinerary/ardio/disney-castle.webp", "/uploads/itinerary/shdisney.jpg"],
  hanfuSh: [J("hanfu-sh"), J("hanfu-sh-2")],
  shMuseum: [J("shmuseum"), J("shmuseum-2")],
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
  return stop(id, time, title, description, { icon: Utensils, iconBg: "#FFF1F3", type: "meal", showPhotoPreview: true, ...options });
}
function alt(tag: string, title: string, description: string, extra: Partial<Alternative> = {}): Alternative {
  return { tag, title, description, ...extra };
}

/* Places we like but left out of the daily plan, shown as cards at the end. */
export const recommended = [
  { id: "temple-heaven", city: "Beijing", title: "Temple of Heaven", tag: "Flat paths · easy with the stroller", images: photos.templeHeaven, desc: "The round blue-roofed Hall of Prayer for Good Harvests, in a huge park where locals dance, sing and play cards in the mornings.", note: "Combined ticket about ¥28 in winter. East Gate: Line 5 to Tiantandongmen. 天坛公园东门 · 东城区天坛东路." },
  { id: "summer-palace", city: "Beijing", title: "Summer Palace in winter", tag: "A snowy morning · ~1 hour away", images: photos.summerPalace, desc: "The emperors’ lakeside garden, with the Seventeen-Arch Bridge and the Long Corridor. Beautiful after snow.", note: "When Kunming Lake freezes (usually later in December) people ride ice carts on it. 颐和园 · 海淀区新建宫门路19号." },
  { id: "hanfu-bj", city: "Beijing", title: "Hanfu family photoshoot", tag: "Book ahead · indoor studio", images: photos.hanfuBj, desc: "Dress up in Qing-dynasty or Ming-style robes, with hair and makeup, for photos by the red palace walls. A lovely keepsake with the baby in costume too.", note: "Studios near the Forbidden City’s east gate (南池子大街) dress you and walk you to the photo spots. Commercial shoots aren’t allowed inside the palace itself." },
  { id: "dadong", city: "Beijing", title: "Da Dong Roast Duck", tag: "Modern Peking duck", images: photos.dadong, desc: "The upscale take on Peking duck: crisp, lean skin carved at the table, in a sleek dining room. Roomier than the busy old duck houses.", note: "The Wangfujing branch is on the 5th floor of 王府井喜悦购物中心. Expect a short queue at peak times." },
  { id: "jubaoyuan", city: "Beijing", title: "Ju Bao Yuan · copper-pot hotpot", tag: "Old Beijing classic · Niujie", images: photos.copperpot, desc: "Hand-sliced mutton swished in a clear broth in a charcoal copper pot, dipped in sesame sauce, with sesame flatbreads on the side.", note: "About ¥110–140 per person, with queues at mealtimes. 聚宝源（牛街总店）· 西城区牛街. Man Heng Ji (满恒记) on the same street is a cheaper Michelin Bib Gourmand pick." },
  { id: "changan", city: "Xi'an", title: "Chang'an Twelve Hours", tag: "Tang-dynasty theme street · next to Datang", images: photos.changan, desc: "An indoor street recreated from the TV drama: lanterns, costumed performers, shows and snacks. You can rent Tang-style costumes here for photos.", note: "Open about 10:00–22:00. The Tang banquet is about ¥392 for two. 长安十二时辰主题街区 · 雁塔区曼蒂广场. Warm and indoors, so good on a cold evening." },
  { id: "shaanxi-museum", city: "Xi'an", title: "Shaanxi History Museum", tag: "Free · book 5–7 days ahead", images: photos.shaanxiMuseum, desc: "China’s great collection of Tang gold, murals and bronzes, all indoors and warm.", note: "Free, but tickets are real-name and go fast. Closed on Mondays. 陕西历史博物馆 · 雁塔区小寨东路91号." },
  { id: "xiangxi", city: "Zhangjiajie", title: "Charming Xiangxi show", tag: "Evening · ~7 pm · Wulingyuan", images: photos.xiangxi, desc: "Wulingyuan’s signature show of Tujia and Miao songs, dance and stunts, indoors with a bonfire finale outside.", note: "About ¥180. It’s loud, so it’s best if the baby sleeps through noise. 魅力湘西大剧院 · 武陵源区." },
  { id: "furong", city: "Zhangjiajie", title: "Furong Town", tag: "25 min by train · in place of Tianmen", images: photos.furong, desc: "An old Tujia town built on a cliff around a waterfall that pours right through it.", note: "High-speed train 张家界西站 → 芙蓉镇站, about 25 minutes. Lots of steps, so bring the carrier. Swap it for Tianmen on Day 11 if you prefer." },
  { id: "jiajia", city: "Shanghai", title: "Jia Jia Tang Bao", tag: "Soup dumplings · by People’s Square", images: photos.jiajia, desc: "A tiny, no-frills shop often called the city’s best for soup dumplings, with queues out of the door.", note: "Go early: it sells out. 佳家汤包 · 黄浦区黄河路90号." },
  { id: "disney", city: "Shanghai", title: "Shanghai Disneyland", tag: "A full day · Christmas season", images: photos.disney, desc: "Christmas decorations and the castle lighting show at about 17:00. A long day with a baby, so only if you’re keen.", note: "The staffed Baby Care Center is on Mickey Avenue, for feeding and changing. Use Rider Switch to take turns on the rides. 上海迪士尼乐园 · 浦东新区." },
  { id: "hanfu-sh", city: "Shanghai", title: "Hanfu or qipao photoshoot", tag: "Yu Garden · old town", images: photos.hanfuSh, desc: "A soft, ancient look in hanfu by the Yu Garden pavilions, or a 1920s Old Shanghai look in a qipao.", note: "Studios around Yu Garden do the outfit, hair and makeup. The Nine-Turn Bridge and the City God Temple are the classic spots." },
  { id: "shmuseum", city: "Shanghai", title: "Shanghai Museum", tag: "Free · indoors · rainy-day pick", images: photos.shMuseum, desc: "Bronzes, ceramics, jade and furniture in a building shaped like an ancient cooking pot, on People’s Square next to your hotel.", note: "Free, with an advance reservation. Closed on Mondays. 上海博物馆 · 黄浦区人民大道 · People’s Square." },
];

export function buildJashimConfig(withOptions: boolean): ItineraryConfig {
  const days: ItineraryConfig["days"] = [
    /* ═══════ BEIJING · 10 Dec ═══════ */
    { label: "Day 1", city: "Beijing", subtitle: "Thu 10 Dec · Arrival in Beijing", color: BEIJING, items: [
      stop("arrive", "Flight TBC", "Land in Beijing", "Welcome to China! Once you send us your flight, we’ll book a car with a rear-facing infant seat to meet you in arrivals and take you to your apartment. Ordinary taxis and DiDi don’t have infant seats.", { icon: Plane, iconBg: "#E3F2FD", type: "transport", subtitle: "Pickup with an infant seat · we’ll book it", previewLine: "Car with an infant seat to your apartment", transportAfter: { mode: "car", duration: "~40–60 min", note: "Airport → your apartment, depending on Capital or Daxing" } }),
      stop("apartment", "Evening", "Your Beijing apartment", "Your base for four nights, in the embassy area about 1.1 km from Chaoyangmen metro (Lines 2 and 6). The walk to the station is a bit long with the stroller, so take a taxi when you’re tired. Settle in, check the heating and the baby’s sleeping set-up, and pick up water and snacks at a convenience store nearby.\n\nBeijing High-Rise Panoramic European International Mansion · near Chaoyangmen", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Booked · 10–14 December", previewLine: "Embassy area · ~1.1 km to Chaoyangmen metro", tip: "Baby tip: Beijing is very dry in December and the heating is strong. A small humidifier or a wet towel over a chair helps the baby sleep." }),
    ] },

    /* ═══════ BEIJING · 11 Dec ═══════ */
    { label: "Day 2", city: "Beijing", subtitle: "Fri 11 Dec · Forbidden City · Peking duck", color: BEIJING, items: [
      leave("go-palace", "08:30", "To the Forbidden City", "Taxi ~20 min · or Line 2 → Line 1, ~25 min", { mode: "taxi", duration: "~20 min", note: "Taxi to the Tiananmen East / Donghuamen drop-off · or Line 2 朝阳门 → 建国门, then Line 1 to 天安门东" }),
      stop("palace", "09:00", "Forbidden City · 故宫", "The emperors’ palace: go in at the Meridian Gate in the south and walk out at the Gate of Divine Prowess in the north, about 1 km along the central halls. Allow 2½–3 hours and keep to the main axis. About ¥40 per adult in winter; children under 6 are free but still need a reservation on their own passport. Closed on Mondays.\n\n故宫博物院 · 东城区景山前街4号 · enter at 午门", { icon: Castle, iconBg: "#FFF3E0", subtitle: "About ¥40 · book with all three passports", previewLine: "The emperors’ palace, south to north", tip: "Baby tip: There’s a baby care room with three private nursing rooms near Qianqing Palace Square, about halfway along. The halls have raised thresholds and steps, so use the carrier and leave the stroller in the car.", pictures: photos.forbidden, transportAfter: { mode: "walk", duration: "~10 min", note: "Walk round to Siji Minfu by the east gate, 南池子大街11号" } }),
      meal("lunch-2", "~12:30", "Lunch · Siji Minfu, by the palace", "Beijing’s most queued-for Peking duck, at the moat-side branch next to the Forbidden City’s east gate. Join the queue in its WeChat mini-program while you’re still inside the palace, and ask for a window seat facing the palace walls.", { subtitle: "Peking duck · join the queue on WeChat", previewLine: "Peking duck with a view of the palace walls", pictures: photos.siji, restaurants: [
        { name: "四季民福烤鸭店（故宫店）", englishName: "Siji Minfu, Forbidden City branch", cuisine: "Peking duck", note: "Order a whole duck, carved at the table, with pancakes and sweet sauce. Free tea and snacks while you wait. 东城区南池子大街11号.", price: "Whole duck ~¥240–300", rating: 4.8, image: photos.siji[0] },
      ], transportAfter: { mode: "taxi", duration: "~20 min", note: "Taxi back to your apartment to rest" } }),
      stop("rest-2", "Afternoon", "Rest at the apartment", "A slow afternoon for naps and feeds after a big morning. If you’re all still going strong, Jingshan Park opposite the palace’s north gate has the classic view back over the golden roofs (about 10 minutes of stairs).", { icon: Sun, iconBg: "#FFF3E0", subtitle: "Naps and feeds", previewLine: "Nap time · or the Jingshan Park view" }),
    ] },

    /* ═══════ BEIJING · 12 Dec ═══════ */
    { label: "Day 3", city: "Beijing", subtitle: "Sat 12 Dec · Mutianyu Great Wall · Sanlitun", color: BEIJING, items: [
      leave("go-wall", "08:00", "To Mutianyu", "Private car ~1½ hours · we’ll quote one with an infant seat", { mode: "car", duration: "~1½ h", note: "Private car with an infant seat to Mutianyu, waiting for you all day" }),
      stop("wall", "~09:30", "Mutianyu Great Wall · 慕田峪长城", "The most family-friendly restored section of the Wall. Take the enclosed cable car up, walk a short stretch between the watchtowers, and ride back down. Entry about ¥40, cable car about ¥140 return. Back in the car by early afternoon.\n\n慕田峪长城 · 怀柔区渤海镇慕田峪村", { icon: Mountain, iconBg: "#E8F5E9", subtitle: "Enclosed cable car up and down", previewLine: "Watchtowers along the mountain ridges", tip: "Baby tip: Use the carrier on the Wall (steep steps, narrow tower doorways) and leave the stroller in the car. Take the enclosed cable car, not the open chairlift or the toboggan. It’s windy up there, so bring a cover for the carrier. If the forecast is icy or very windy, swap today with Sunday.", pictures: photos.mutianyu, transportAfter: { mode: "car", duration: "~1½ h", note: "Same car back to Beijing" } }),
      stop("sanlitun", "Evening", "Sanlitun Taikoo Li · 三里屯太古里", "Beijing’s trendiest shopping area, a short ride from your apartment: flagship stores, art installations and great people-watching, best after dark when it’s all lit up. Have dinner in one of its restaurants and keep the evening easy after the Wall.\n\n三里屯太古里 · 朝阳区三里屯路19号 · 10:00–22:00", { icon: ShoppingBag, iconBg: "#FFF0EE", subtitle: "Free · lights, shops and dinner", previewLine: "Beijing’s trendiest street, lit up at night", tip: "Baby tip: The malls are heated and have mother-and-baby rooms (母婴室), so it’s an easy evening with the stroller.", pictures: photos.taikooli, transportAfter: { mode: "taxi", duration: "~10–15 min", note: "Taxi back to your apartment" } }),
    ] },

    /* ═══════ BEIJING · 13 Dec ═══════ */
    { label: "Day 4", city: "Beijing", subtitle: "Sun 13 Dec · Pandas · Shichahai hutongs", color: BEIJING, items: [
      leave("go-zoo", "07:30", "To Beijing Zoo", "Taxi ~30 min · or Line 2 → Line 4, ~35 min", { mode: "taxi", duration: "~30 min", note: "Taxi to the zoo’s south gate · or Line 2 to 西直门, then Line 4 to 动物园 (Exit C1)" }),
      stop("pandas", "08:00", "Panda House · Beijing Zoo", "The new Giant Panda House opened in July 2026, and it’s home to the internet-famous Meng Lan. 08:00–10:00 is when the pandas eat and play, so be there early: by late morning it gets crowded and they nap. Zoo and Panda House together are about ¥14 in winter.\n\n北京动物园 大熊猫馆 · 西城区西直门外大街137号", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "About ¥14 · go at opening", previewLine: "Meng Lan and the pandas at breakfast", tip: "Baby tip: The Panda House is indoors and warm, and the zoo paths are wide, so the stroller is fine. You can rent one at the South Gate for about ¥30 a day.", pictures: photos.panda, transportAfter: { mode: "taxi", duration: "~30 min", note: "Taxi back to your apartment for lunch and naps" } }),
      stop("shichahai", "~15:30", "Shichahai & the hutongs", "Beijing’s old lakes and the lanes around them: willow-lined water, courtyard houses and little shops, lovely at golden hour as the lights come on. Line 6 runs direct from your area. The famous ice rink usually opens in late December, so it may not be ready yet.\n\n什刹海 · 西城区 · Line 6 北海北 · Nanluoguxiang 南锣鼓巷 nearby", { icon: Sunset, iconBg: "#FFF3E0", subtitle: "Free · lakes and old lanes", previewLine: "The lakes and hutongs at golden hour", tip: "Baby tip: The lakeside paths are fine for the stroller; the hutong lanes are narrow and busy, so switch to the carrier there.", pictures: photos.shichahai, transportAfter: { mode: "taxi", duration: "~15–20 min", note: "Taxi back to your apartment · pack for tomorrow’s train" } }),
    ] },

    /* ═══════ BEIJING → XI'AN · 14 Dec ═══════ */
    { label: "Day 5", city: "Xi'an", subtitle: "Mon 14 Dec · High-speed train to Xi’an", color: XIAN, items: [
      leave("go-bjw", "~08:30", "Check out & to Beijing West", "Taxi ~40–60 min · be there an hour early", { mode: "taxi", duration: "40–60 min", note: "Taxi to Beijing West station (北京西站) · arrive an hour before the train" }),
      stop("train-xa", "~09:30", "High-speed train to Xi’an", "Beijing West → Xi’an North, about 4½–6 hours. Tickets open about 15 days ahead (around 29–30 Nov), and we’ll book seats together for you.\n\nYour son travels free on your lap, but must be added to the ticket with his own passport. Bring your passports: they are your tickets.", { icon: TrainFront, iconBg: "#E3F2FD", type: "transport", subtitle: "Beijing West → Xi’an North · ~4½–6 h", previewLine: "Tickets open ~29–30 Nov · we’ll book", tip: "Baby tip: Every train has hot water for bottles. A late-morning train keeps the trip inside a nap or two.", transportAfter: { mode: "metro", duration: "~30 min", note: "Line 2 from Xi’an North direct to 钟楼 (Bell Tower), then ~10 min walk · or taxi ~40 min" } }),
      stop("mercure", "Afternoon", "Mercure Xi’an Downtown", "Your Xi’an base, inside the old city walls and about 720 m from Bell Tower (Zhonglou) metro station. Check in, then a short walk out for dinner.\n\n新城区西新街8号", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Booked 14–16 Dec · we’ll add the night of 16 Dec", previewLine: "西新街8号 · ~720 m to Bell Tower metro", pictures: photos.mercure }),
    ] },

    /* ═══════ XI'AN · 15 Dec ═══════ */
    { label: "Day 6", city: "Xi'an", subtitle: "Tue 15 Dec · Terracotta Warriors · Muslim Quarter", color: XIAN, items: [
      leave("go-tc", "08:00", "To the Terracotta Warriors", "Private car ~1 hour · we’ll quote one with an infant seat", { mode: "car", duration: "~1 h", note: "Private car with an infant seat, waiting while you visit" }),
      stop("terracotta", "~09:00", "Terracotta Warriors · 兵马俑", "Thousands of life-size clay soldiers, each with a different face, guarding China’s first emperor for 2,200 years. Start with Pit 1, the huge hall, then Pits 2 and 3 if everyone’s happy. Allow 2½–3 hours. About ¥120 per adult; book with your passports.\n\n秦始皇帝陵博物院 · 临潼区秦陵北路", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "About ¥120 · book with passports", previewLine: "Thousands of life-size clay soldiers", tip: "Baby tip: The pit halls have long, flat walkways, so the stroller works. Feed the baby in the car before you go in.", pictures: photos.terracotta, transportAfter: { mode: "car", duration: "~1 h", note: "Back into the city for lunch near the Bell Tower" } }),
      meal("lunch-6", "~13:00", "Lunch · Lao Sun Jia paomo", "Xi’an’s signature dish: you tear flatbread into small pieces in your bowl, then the kitchen cooks it in rich mutton soup. Lao Sun Jia has served it since 1898.", { subtitle: "Yangrou paomo · since 1898", previewLine: "Tear your own bread into mutton soup", pictures: photos.paomo, restaurants: [
        { name: "老孙家饭庄（东关正街店）", englishName: "Lao Sun Jia", cuisine: "Mutton paomo", note: "The historic flagship. Tear the bread small, about pea-sized, so it soaks up the soup, and eat it with sweet pickled garlic and chilli sauce. 08:00–21:30. 碑林区东关正街78号.", price: "~¥35 a bowl", image: photos.paomo[0] },
        { name: "老米家泡馍", englishName: "Lao Mi Jia", cuisine: "Mutton paomo", note: "The one many locals swear by, in the Muslim Quarter. It sells out, so go early. 莲湖区西羊市.", price: "~¥50 pp" },
        { name: "同盛祥", englishName: "Tongshengxiang", cuisine: "Paomo & Xi’an dishes", note: "The other grand old paomo house, with a much bigger menu.", price: "~¥40–60 pp" },
      ] }),
      stop("towers", "~17:30", "Bell & Drum Towers at night", "The two Ming-dynasty towers in the heart of the old city, glowing gold after dark. Walk across the square between them; the Muslim Quarter starts just behind the Drum Tower.\n\n钟楼 · 鼓楼 · 钟鼓楼广场", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Free outside · ~¥50 to go up both", previewLine: "The old towers lit up in gold", pictures: photos.towers, transportAfter: { mode: "walk", duration: "~5 min", note: "Walk behind the Drum Tower into the Muslim Quarter" } }),
      stop("muslimq", "~18:00", "Dinner · Muslim Quarter street food", "Xi’an’s famous food street, under red lanterns: graze your way through roujiamo (Xi’an’s meat bun), lamb skewers, biangbiang noodles on Dapiyuan and warm persimmon cakes.\n\n回民街 · 北院门 · 莲湖区", { icon: Utensils, iconBg: "#FFF1F3", subtitle: "Street food under the lanterns", previewLine: "Roujiamo, skewers and biangbiang noodles", tip: "Baby tip: The lanes are narrow and crowded in the evening, so use the carrier here.", pictures: photos.muslimQuarter, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to the hotel · or a 15–20 min walk" } }),
    ] },

    /* ═══════ XI'AN · 16 Dec ═══════ */
    { label: "Day 7", city: "Xi'an", subtitle: "Wed 16 Dec · City Wall · Yongxingfang · Datang Everbright City", color: XIAN, items: [
      leave("go-wall", "09:45", "To the South Gate", "Line 2, one stop from the Bell Tower · or taxi ~10 min", { mode: "metro", duration: "~10 min", note: "Line 2 钟楼 → 永宁门, one stop · or taxi ~10 min" }),
      stop("citywall", "10:00", "Xi’an City Wall · South Gate", "The best-preserved city wall in China, 14 km round the old town. Walk a short stretch on top from the South Gate (Yongningmen) for views over the rooftops. About ¥54 per adult.\n\n西安城墙 永宁门（南门）· 碑林区", { icon: Castle, iconBg: "#FFF3E0", subtitle: "About ¥54 · a short walk on top", previewLine: "China’s best-preserved city wall", tip: "Baby tip: The top is wide and flat, but the way up is stairs, so bring the carrier.", pictures: photos.cityWall, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi to Yongxingfang, by the wall’s Zhongshan Gate" } }),
      meal("lunch-7", "~12:00", "Lunch · Yongxingfang food street", "A viral food street by the city wall with 100+ Shaanxi dishes in one place, under red lanterns. The easiest way to try lots of Xi’an food at once.\n\n永兴坊 · 新城区东新街（中山门）", { subtitle: "100+ Shaanxi dishes in one street", previewLine: "Lanterns and Shaanxi snacks by the wall", pictures: photos.yongxing, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to the hotel for an afternoon rest" } }),
      stop("datang", "~18:00", "Datang Everbright City · 大唐不夜城", "A 1.5 km Tang-dynasty boulevard that lights up gold after dark, from the Big Wild Goose Pagoda southwards. Look for the viral “Tumbler Lady”, a performer in Tang dress swaying on a giant wobbling base, and the street performances from about 19:00. Free; allow 2 hours.\n\n大唐不夜城 · 雁塔区慈恩路 · Line 3/4 大雁塔 Exit C", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Free · shows from about 19:00", previewLine: "A Tang-dynasty boulevard lit up in gold", tip: "Baby tip: It’s wide and flat, so the stroller is fine. It gets busy after 19:00, so arrive at dusk and keep to the edges.", pictures: photos.datang, transportAfter: { mode: "taxi", duration: "~20 min", note: "Taxi back to the hotel · early night before the flight" } }),
    ] },

    /* ═══════ XI'AN → ZHANGJIAJIE · 17 Dec ═══════ */
    { label: "Day 8", city: "Zhangjiajie", subtitle: "Thu 17 Dec · Fly to Zhangjiajie", color: ZHANGJIAJIE, items: [
      leave("go-xiy", "Flight TBC", "Check out & to Xi’an Airport", "Car ~50–75 min · we’ll pick a late-morning flight", { mode: "car", duration: "50–75 min", note: "Car with an infant seat to Xi’an Xianyang Airport" }),
      stop("fly-zjj", "Flight TBC", "Flight to Zhangjiajie", "Xi’an → Zhangjiajie Hehua Airport, about 1½ hours direct. We’ll look for a late-morning flight rather than a dawn one, and book it with an infant ticket for your son.", { icon: Plane, iconBg: "#E3F2FD", type: "transport", subtitle: "Direct · ~1½ h", previewLine: "Xi’an → Zhangjiajie · we’ll book", transportAfter: { mode: "car", duration: "45–60 min", note: "Car with an infant seat to Wulingyuan" } }),
      stop("hilton-zjj", "Afternoon", "Hilton Garden Inn Wulingyuan", "Our pick for your three park nights: opened in 2025 near the Forest Park’s east side, with family rooms, an outdoor pool and a children’s play area. The afternoon is free to settle in.\n\n张家界武陵源希尔顿花园酒店 · 武陵源区宝峰路108号", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Our pick · 17–20 December · to book", previewLine: "宝峰路108号 · near the park’s east gate", pictures: photos.hiltonZjj }),
    ] },

    /* ═══════ ZHANGJIAJIE · 18 Dec ═══════ */
    { label: "Day 9", city: "Zhangjiajie", subtitle: "Fri 18 Dec · Tianzi Mountain", color: ZHANGJIAJIE, items: [
      leave("go-park", "08:30", "To the Forest Park", "Taxi ~10 min to the Wulingyuan gate · then the park bus", { mode: "taxi", duration: "~10 min", note: "Taxi to the Wulingyuan gate (武陵源门票站), then the free park bus to the Tianzi Mountain cable car" }),
      stop("tianzi", "~09:00", "Tianzi Mountain · 天子山", "Ride the Tianzi cable car up (about 6½ minutes, about ¥72 each way) to a forest of sandstone peaks, often floating in mist. Walk the paved viewpoints at the top, Helong Park and Imperial Brush Peak, then ride back down. The park ticket (about ¥225) covers four days, so it also covers tomorrow.\n\n天子山索道 · 武陵源区 · 贺龙公园 · 御笔峰", { icon: Mountain, iconBg: "#E8F5E9", subtitle: "Cable car up and down · park ticket 4 days", previewLine: "A forest of peaks floating in the mist", tip: "Baby tip: Use the carrier on the summit paths. It’s much colder up top than in town, so bring an extra layer and a hat for the baby. The park buses have no English signs: show the driver “天子山索道”.", pictures: photos.tianzi, transportAfter: { mode: "shuttle", duration: "~20 min", note: "Park bus to the Ten-Mile Gallery (optional) · or back to the gate" }, alternatives: [
        alt("🌧 Foggy or rainy?", "Huanglong Cave · 黄龙洞", "A huge cave with an underground river you cross by boat, lit up in colours. Indoors, about 15 minutes from the hotel. There are stairs throughout, so use the carrier.", { images: photos.huanglong, gettingThere: "Taxi ~15 min · 武陵源区索溪峪镇河口村 · about ¥100–120" }),
      ] }),
      stop("tenmile", "~13:00", "Ten-Mile Gallery (optional)", "On the way out, a little sightseeing train runs along a valley of pillar formations with names like “Old Man Picking Herbs”. Skip it if the baby is ready for a nap.\n\n十里画廊 · 武陵源区索溪峪", { icon: TrainFront, iconBg: "#E3F2FD", type: "transport", subtitle: "Optional · mini-train along the valley", previewLine: "A mini-train past the pillar formations", transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to the hotel for an afternoon rest" } }),
    ] },

    /* ═══════ ZHANGJIAJIE · 19 Dec ═══════ */
    { label: "Day 10", city: "Zhangjiajie", subtitle: "Sat 19 Dec · Golden Whip Stream · Yuanjiajie", color: ZHANGJIAJIE, items: [
      leave("go-park-2", "08:30", "To Shuiraosimen", "Taxi ~10 min to the gate · park bus to Shuiraosimen", { mode: "taxi", duration: "~10 min", note: "Taxi to the Wulingyuan gate, then the park bus to 水绕四门 (Shuiraosimen)" }),
      stop("golden", "~09:00", "Golden Whip Stream · 金鞭溪", "A flat, paved path along a clear stream at the foot of the stone pillars, through quiet forest. Walk in from the Shuiraosimen end as far as feels good, then turn back. Most people turn round after the first stretch, so the further you go, the quieter it gets.\n\n金鞭溪 · 水绕四门", { icon: Footprints, iconBg: "#E8F5E9", subtitle: "Flat · walk as far as you like", previewLine: "A flat forest walk under the pillars", tip: "Baby tip: This is the one place in the park where the stroller works well. Keep snacks in a zipped bag: the macaques are bold.", pictures: photos.golden, transportAfter: { mode: "walk", duration: "~10 min", note: "Walk back to the Bailong Elevator, ~700 m away" } }),
      stop("bailong", "~10:30", "Bailong Elevator · 百龙天梯", "A glass lift up the outside of a 326 m cliff, the tallest outdoor elevator in the world, in about a minute. About ¥65 each way.\n\n百龙天梯 · 武陵源区水绕四门", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "About ¥65 each way · ~1 min up", previewLine: "A glass lift up a 326 m cliff", tip: "Baby tip: At the entrance and exit you may need to lift the stroller over a short slope.", pictures: photos.bailong, transportAfter: { mode: "shuttle", duration: "~5 min", note: "Park bus from the top of the lift to Yuanjiajie" } }),
      stop("yuanjiajie", "~11:00", "Yuanjiajie · the “Avatar” peaks", "The floating mountains from Avatar: see Hallelujah Mountain (乾坤柱) and the First Natural Bridge, then take the Bailong Elevator back down. If Saturday looks clearer than Friday, swap the two days so you get the views here.\n\n袁家界 · 武陵源区张家界国家森林公园内", { icon: Mountain, iconBg: "#E8F5E9", subtitle: "The Avatar Hallelujah Mountains", previewLine: "The floating mountains from Avatar", tip: "Baby tip: Some sections are steep, so use the carrier.", pictures: photos.yuanjiajie, transportAfter: { mode: "taxi", duration: "~10 min", note: "Down the elevator, then taxi back to the hotel to rest" }, alternatives: [
        alt("🌧 Rainy day?", "Baofeng Lake · 宝峰湖", "A green lake among the peaks, crossed by boat with folk singers along the way. There’s a short, steep climb up to the boat, so use the carrier.", { images: photos.baofeng, gettingThere: "Taxi ~10 min · 武陵源区宝峰路 · boat about ¥96" }),
      ] }),
      stop("xibu", "Evening", "XiBu Street · 溪布街", "Wulingyuan’s lit-up riverside street of wooden Tujia buildings, snack stalls and crafts, a short taxi ride from the hotel. Pick somewhere along it for dinner.\n\n溪布街 · 武陵源区", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Free · riverside lights", previewLine: "Wooden houses lit up along the river", tip: "Baby tip: Flat and fine for the stroller.", pictures: photos.xibu, transportAfter: { mode: "taxi", duration: "~5–10 min", note: "Taxi back to the hotel" } }),
    ] },

    /* ═══════ ZHANGJIAJIE CITY · 20 Dec ═══════ */
    { label: "Day 11", city: "Zhangjiajie", subtitle: "Sun 20 Dec · Tianmen Mountain · 72 Wonder Buildings", color: ZHANGJIAJIE, items: [
      leave("go-city", "08:30", "Check out & to Zhangjiajie city", "Car ~1 hour · leave your bags at the hotel", { mode: "car", duration: "~1 h", note: "Car with an infant seat from Wulingyuan to your city hotel" }),
      stop("wyndham-zjj", "~09:30", "Wyndham Garden Tianmen Mountain", "Our pick for your last Zhangjiajie night: about 600 m from the Tianmen Mountain cable-car station, and 15–20 minutes from the airport for tomorrow. Leave your bags and head out.\n\n永定区 · near 天门山索道", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Our pick · 20–21 December · to book", previewLine: "~600 m to the Tianmen cable car", pictures: photos.wyndhamZjj, transportAfter: { mode: "walk", duration: "~10 min", note: "Walk to the Tianmen cable-car station for the shuttle" } }),
      stop("tianmen", "~10:00", "Tianmen Mountain · Route C", "The long city cable car has been closed since 13 October 2026, so for now only Route C runs: a shuttle from the city cable-car station to the mountain gate (about 20 minutes), the Tianmen Cave express cable car, then indoor escalators to the summit and its cliff-top views. About ¥288 per adult. Take snacks from the hotel; the café at the top is basic.\n\n天门山国家森林公园 · 永定区天门路", { icon: Mountain, iconBg: "#E8F5E9", subtitle: "Route C · ~¥288 · we’ll confirm before you go", previewLine: "Tianmen Cave and the summit above the clouds", tip: "Baby tip: Route C is a shuttle, a cable car and escalators, so carrier only. We’d skip the 999 steps and the glass skywalk with the baby.", pictures: photos.tianmen, transportAfter: { mode: "walk", duration: "~10 min", note: "Shuttle back down, then a short walk to the hotel to rest" } }),
      stop("qilou", "~18:00", "72 Wonder Buildings & Dayong Ancient Town", "A towering Tujia-style complex that lights up gold after dark, with a food street of stalls each selling one local speciality. Dayong Ancient Town, the city’s old quarter, is 5 minutes’ walk away. Evening entry about ¥88.\n\n七十二奇楼 · 永定区武陵山大道1号 · 大庸府城 · 解放路", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Lit up after dark · ~¥88 evening entry", previewLine: "A Tujia fantasy building glowing gold", tip: "Baby tip: Fine for the stroller.", pictures: photos.qilou, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to the hotel" } }),
    ] },

    /* ═══════ ZHANGJIAJIE → SHANGHAI · 21 Dec ═══════ */
    { label: "Day 12", city: "Shanghai", subtitle: "Mon 21 Dec · Fly to Shanghai", color: SHANGHAI, items: [
      leave("go-dyg", "Flight TBC", "Slow morning, then to the airport", "Taxi 15–20 min from the hotel", { mode: "taxi", duration: "15–20 min", note: "Taxi to Zhangjiajie Hehua Airport" }),
      stop("fly-sh", "Flight TBC", "Flight to Shanghai", "Zhangjiajie → Shanghai, about 2–2½ hours direct, usually into Pudong. We’ll book it with an infant ticket.", { icon: Plane, iconBg: "#E3F2FD", type: "transport", subtitle: "Direct · ~2–2½ h", previewLine: "Zhangjiajie → Shanghai · we’ll book", transportAfter: { mode: "metro", duration: "~1¼ h", note: "Line 2 from Pudong direct to People’s Square · or taxi ~50–60 min" } }),
      stop("atour", "Afternoon", "Atour Hotel, People’s Square", "Our pick for Shanghai: opened in 2024 in the heart of People’s Square, with family rooms and the Bund and Nanjing Road a short walk away.\n\n亚朵酒店 · 黄浦区北京西路199号", { icon: Hotel, iconBg: "#E3F2FD", type: "hotel", subtitle: "Our pick · 21–25 December · to book", previewLine: "北京西路199号 · People’s Square", pictures: photos.atour, transportAfter: { mode: "walk", duration: "~10 min", note: "Walk to dinner" } }),
      meal("dinner-12", "~18:00", "Dinner · Yang’s Dumpling", "Shanghai’s famous pan-fried pork buns (shengjianbao): crispy bottoms, juicy inside. A quick, easy dinner after a travel day.", { subtitle: "Shengjianbao · quick and easy", previewLine: "Crispy pan-fried pork buns", pictures: photos.yangs, restaurants: [
        { name: "小杨生煎（宁波路店）", englishName: "Yang’s Dumpling, Ningbo Road", cuisine: "Shengjianbao", note: "Bite a small hole and sip the soup first: it’s very hot. The Huanghe Road flagship is listed as temporarily closed, so this branch near the hotel is the one to go to.", price: "~¥30–50 pp", image: photos.yangs[0] },
        { name: "佳家汤包", englishName: "Jia Jia Tang Bao", cuisine: "Soup dumplings", note: "If you’d rather have soup dumplings. Go early: it sells out. 黄河路90号.", price: "~¥30–40 pp", image: photos.jiajia[0] },
      ] }),
    ] },

    /* ═══════ SHANGHAI · 22 Dec ═══════ */
    { label: "Day 13", city: "Shanghai", subtitle: "Tue 22 Dec · Yu Garden · Christmas market", color: SHANGHAI, items: [
      leave("go-yu", "08:15", "To Yu Garden", "Taxi ~10 min · or Line 10, two stops", { mode: "taxi", duration: "~10 min", note: "Taxi ~¥15 · or Line 10 南京东路 → 豫园, two stops" }),
      meal("breakfast-13", "08:30", "Breakfast · Nanxiang Steamed Bun", "Shanghai’s most famous soup dumplings, next to the Yu Garden bridge since 1900. Go before 9:00 to beat the queue, and sit upstairs rather than queuing at the takeaway window.\n\n南翔馒头店（城隍庙店）· 豫园路87号", { subtitle: "Soup dumplings · before 9:00", previewLine: "Shanghai’s most famous soup dumplings", pictures: photos.nanxiang, transportAfter: { mode: "walk", duration: "~5 min", note: "Walk to the Yu Garden entrance" } }),
      stop("yugarden", "09:00", "Yu Garden · 豫园", "A Ming-dynasty garden of pavilions, rockeries and koi ponds in the old town. Go at opening, before the crowds. About ¥30 per adult in December.\n\n上海豫园 · 黄浦区福佑路168号 · 09:00–16:30", { icon: Sun, iconBg: "#FFF3E0", subtitle: "About ¥30 · book with your passports", previewLine: "Pavilions, rockeries and koi ponds", tip: "Baby tip: Lots of steps and raised thresholds, so use the carrier.", pictures: photos.yugarden, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to the hotel for lunch and naps" } }),
      stop("xmas", "~17:00", "Christkindlmarkt on the Bund", "Shanghai’s big German-style Christmas market, in the old red-brick buildings of Rockbund: 40+ wooden stalls, mulled wine, a carousel, a giant tree and “snow” a couple of times an hour. Listed for 25 Nov–27 Dec 2026, about ¥30–40 entry. Weekdays are calmer than weekends.\n\n外滩源 · 黄浦区圆明园路 · near 北京东路", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "About ¥30–40 · buy on WeChat", previewLine: "Wooden stalls, lights and mulled wine", tip: "Baby tip: Fine for the stroller, but it fills up after dark, so go early in the evening.", pictures: photos.xmas, transportAfter: { mode: "walk", duration: "~15 min", note: "Walk back to the hotel along Nanjing Road" } }),
    ] },

    /* ═══════ SHANGHAI · 23 Dec ═══════ */
    { label: "Day 14", city: "Shanghai", subtitle: "Wed 23 Dec · Lujiazui · Lai Lai · River cruise", color: SHANGHAI, items: [
      leave("go-ljz", "09:30", "To Lujiazui", "Line 2 to Lujiazui · ~15 min", { mode: "metro", duration: "~15 min", note: "Line 2 人民广场 → 陆家嘴" }),
      stop("lujiazui", "~10:00", "Shanghai Tower & the IFC Christmas tree", "Go up to the 118th-floor viewing deck of China’s tallest building for a 360° view over the city (adults about ¥180), then see the giant Christmas tree and indoor ice rink at IFC Mall next door.\n\n上海中心大厦 · 浦东新区银城中路501号 · 国金中心 IFC · 世纪大道8号", { icon: Sparkles, iconBg: "#F3E8FF", subtitle: "Viewing deck ~¥180 · Christmas tree free", previewLine: "The city from the 118th floor", tip: "Baby tip: It’s all lifts and malls, so the stroller is fine.", pictures: photos.lujiazui, transportAfter: { mode: "metro", duration: "~20 min", note: "Line 2 back to 人民广场 for lunch, near Lai Lai" } }),
      meal("lunch-14", "~12:30", "Lunch · Lai Lai Xiao Long", "The top pick for crab-roe soup dumplings, Michelin-recognised, near the hotel. Order at the front of the queue, then share a table. Expect a 20–30 minute wait.\n\n莱莱小笼 · 天津路506号", { subtitle: "Crab-roe soup dumplings", previewLine: "Crab-roe soup dumplings", pictures: photos.lailai, transportAfter: { mode: "walk", duration: "~10 min", note: "Back to the hotel for a nap" } }),
      stop("cruise", "~17:00", "Huangpu River night cruise", "About 45 minutes on the river from Shiliupu pier: the 1920s Bund glowing gold on one side, the Pudong skyscrapers lit up on the other. Adults about ¥120.\n\n十六铺旅游码头 · 黄浦区中山东二路531号", { icon: Ship, iconBg: "#EDE7F6", subtitle: "About ¥120 · ~45 min", previewLine: "The Bund and Pudong lit up, from the water", tip: "Baby tip: Use the carrier for boarding. The indoor deck is heated.", pictures: photos.cruise, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to the hotel" } }),
    ] },

    /* ═══════ SHANGHAI · 24 Dec ═══════ */
    { label: "Day 15", city: "Shanghai", subtitle: "Thu 24 Dec · French Concession · Christmas Eve", color: SHANGHAI, items: [
      leave("go-ffc", "10:00", "To Wukang Road", "Line 10 to Jiaotong University · or taxi ~20 min", { mode: "metro", duration: "~25 min", note: "Line 10 南京东路 → 交通大学 · or taxi ~20 min" }),
      stop("wukang", "~10:30", "Wukang Road & Anfu Road", "The prettiest part of old Shanghai: Wukang Mansion, a 1924 building shaped like a ship’s bow, then leafy streets of plane trees, villas, cafés and small shops along Wukang Road and Anfu Road.\n\n武康大楼 · 徐汇区淮海中路1850号 · 安福路", { icon: Footprints, iconBg: "#FFF0EE", subtitle: "Free · a slow walk", previewLine: "Plane trees, villas and cafés", tip: "Baby tip: Flat, tree-lined streets, good for the stroller.", pictures: photos.wukang, transportAfter: { mode: "walk", duration: "~15 min", note: "Walk to Donghu Road for lunch" } }),
      meal("lunch-15", "~12:30", "Lunch · Hikiniku To Come", "New in 2026 and viral: the Tokyo spot for wagyu hamburger steak over rice, grilled over charcoal and served at a counter. It has had queues since the day it opened.\n\n挽肉と米 · 东湖路 FUFU", { subtitle: "Wagyu hamburg over rice · new in 2026", previewLine: "Charcoal-grilled wagyu over rice", pictures: photos.hikiniku, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi to White Foods on Hengshan Road" } }),
      meal("cafe-15", "~14:00", "Coffee · White Foods", "A calm, light-filled café-restaurant famous for its six-flavour toast and matcha desserts. A nice slow afternoon stop.\n\n白膳鸣 · 徐汇区衡山路", { icon: Sparkles, iconBg: "#FFF1F3", subtitle: "Six-flavour toast · matcha", previewLine: "Matcha desserts and viral toast", pictures: photos.whitefoods, transportAfter: { mode: "taxi", duration: "~15 min", note: "Taxi to Xintiandi" } }),
      stop("xintiandi", "~16:30", "Xintiandi at Christmas", "Old stone-gate lanes of cafés, shops and restaurants, dressed up with Christmas lights. A lovely Christmas Eve stroll and dinner. The Bund and Nanjing Road get extremely crowded tonight with police crowd control, so we’d skip them this evening.\n\n上海新天地 · 黄浦区太仓路181弄", { icon: Moon, iconBg: "#EDE7F6", subtitle: "Christmas lights · dinner", previewLine: "Christmas lights in the old lanes", pictures: photos.xintiandi, transportAfter: { mode: "taxi", duration: "~10 min", note: "Taxi back to the hotel · pack for tomorrow" } }),
    ] },

    /* ═══════ 25 Dec ═══════ */
    { label: "Day 16", city: "Shanghai", subtitle: "Fri 25 Dec · Flight home", color: SHANGHAI, items: [] },
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
      { icon: "⛰️", label: "Avatar peaks · Tianmen Mountain" },
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
