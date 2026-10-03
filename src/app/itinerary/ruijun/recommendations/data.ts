export type Category = "Shows" | "Bakeries & cafés" | "Qipao";
export type City = "Shanghai" | "Hangzhou";

export interface Recommendation {
  id: string;
  category: Category;
  city: City;
  name: string;
  chinese: string;
  neighbourhood: string;
  line: string;
  why: string;
  photos: string[];
  tags: string[];
  fit: string;
  time: string;
  budget: string;
  address: string;
  chineseAddress: string;
  transport: string;
  comfort: string;
  booking: string;
  sources: { label: string; url: string }[];
}

export const recommendations: Recommendation[] = [
  {
    id: "era", category: "Shows", city: "Shanghai",
    name: "ERA — Journey Through Time and Space 2", chinese: "时空之旅2", neighbourhood: "Shanghai Circus World",
    line: "An evening of acrobatics, movement and spectacle.",
    why: "Our pick if you want a show the three of you can enjoy through movement and music, with little reliance on dialogue. A seated evening after a proper hotel rest.",
    photos: ["era-1", "era-2", "era-3", "era-4", "era-5", "era-6"], tags: ["Acrobatics", "Indoor theatre", "Visually led"],
    fit: "14 October · Choose ERA or Phantom after the Wukang Road day. Pack earlier and keep the afternoon restful.",
    time: "Around 60–100 minutes, depending on the performance version; confirm when booking.",
    budget: "Tickets vary by seat and show version. Ask for the total for three seats together before booking.",
    address: "Shanghai Circus World, 2266 Gonghexin Road, Jing’an, Shanghai",
    chineseAddress: "上海市静安区共和新路2266号 上海马戏城",
    transport: "Allow roughly 30–45 minutes by taxi from the Huaihai dinner area, plus admission time. Take a taxi back to Demores Hotel afterwards.",
    comfort: "Choose seats together with an easy aisle route. Expect amplified music and dramatic lighting; check access requirements before choosing a seat category.",
    booking: "14 October is a proposed evening, not a confirmed booking. Check the performance version, start time and seats before arranging dinner.",
    sources: [{ label: "About ERA", url: "https://english.shanghai.gov.cn/en-Latest-WhatsNew/20251004/5b822b3aaf3841a6a0fa1d88a00ceb95.html" }],
  },
  {
    id: "phantom", category: "Shows", city: "Shanghai",
    name: "The Phantom of the Opera", chinese: "剧院魅影", neighbourhood: "Shanghai Grand Theatre · People’s Square",
    line: "A grand musical evening, with a little more time set aside.",
    why: "For a family who enjoys musical theatre: the music, costumes and stagecraft make this a special shared evening. Choose it if everyone is happy with a longer performance.",
    photos: ["phantom-1", "phantom-2", "phantom-3", "phantom-4", "phantom-5", "phantom-6"], tags: ["English-language musical", "Indoor theatre", "Longer evening"],
    fit: "14 October · An alternative to ERA. Have an early dinner and pack before going out for the next morning’s flight.",
    time: "Allow approximately 2½ hours for the musical, plus arrival and the journey home; confirm the running time and interval.",
    budget: "Published season prices span ¥280–1,580 per person. Your date, seat category and availability determine the quote.",
    address: "Shanghai Grand Theatre, 300 Renmin Avenue, Huangpu, Shanghai",
    chineseAddress: "上海市黄浦区人民大道300号 上海大剧院",
    transport: "Roughly 15–25 minutes by taxi from the Huaihai dinner area. Allow extra time to find your seats and take a taxi back afterwards.",
    comfort: "A longer seated commitment than the other shows. Check the performance language, surtitles and seating access when booking. Stage photos include earlier Shanghai engagements and the international tour; the cast may differ.",
    booking: "The 2026 Shanghai season covers the trip period. Confirm the 14 October performance and three seats together directly with the theatre before making it part of the plan.",
    sources: [{ label: "2026 season and published prices", url: "https://shanghaiconcerts.com/concerts/phantom-of-the-opera-40th-shanghai-farewell" }, { label: "Shanghai Grand Theatre", url: "https://www.shgtheatre.com/" }],
  },
  {
    id: "lake-show", category: "Shows", city: "Hangzhou",
    name: "Enduring Memories of Hangzhou", chinese: "最忆是杭州", neighbourhood: "West Lake · Yue Lake",
    line: "Music and dance, with West Lake itself as the stage.",
    why: "Our most atmospheric choice for a Hangzhou evening: light, reflections and performers on the water. It pairs naturally with your West Lake day if everyone still has energy.",
    photos: ["lake-show-1", "lake-show-2", "lake-show-3", "lake-show-4", "lake-show-5", "lake-show-6"], tags: ["Outdoor lake show", "Music & dance", "Weather dependent"],
    fit: "11 October · Optional after West Lake. Choose this only if the temple morning has not left everyone tired; adjust dinner around the confirmed performance.",
    time: "About 55 minutes for the performance. Allow additional time for admission and transport.",
    budget: "Seat categories have different prices. Confirm a current quote and the weather or cancellation terms before paying.",
    address: "Yue Lake performance area, 82 Beishan Road, opposite Yue Fei Temple, Hangzhou",
    chineseAddress: "杭州市西湖区北山路82号 岳庙对面 最忆是杭州演出场地",
    transport: "Use a taxi to the Beishan Road venue and back to SkyBird Hotel. Allow roughly 20–40 minutes each way from central Hangzhou, depending on lakeside traffic.",
    comfort: "Outdoor seating can feel cool beside the water in October. Bring a light layer, check the weather and choose seats with a manageable access route.",
    booking: "Confirm the actual performance time for 11 October before moving dinner. A quiet evening at the hotel remains an equally good choice.",
    sources: [{ label: "Venue and running time", url: "https://www.gewara.com/detail/309048" }],
  },
  {
    id: "songcheng", category: "Shows", city: "Hangzhou",
    name: "Hangzhou Songcheng Show", chinese: "宋城千古情", neighbourhood: "Songcheng scenic area · Zhijiang Road",
    line: "A colourful stage journey through Hangzhou’s stories.",
    why: "For a livelier cultural spectacle, with large dance scenes, costumes and theatrical effects. It is an alternative for a family who prefers an indoor stage show to an evening on the lake.",
    photos: ["songcheng-1", "songcheng-2", "songcheng-3", "songcheng-4", "songcheng-5", "songcheng-6"], tags: ["Large-scale stage show", "Chinese cultural stories", "More travel involved"],
    fit: "10 or 11 October · Replace part of an afternoon with this outing. We would not add Songcheng on top of the full temple, lake and evening-show day.",
    time: "The main show is around an hour. Set aside a half-day if you also want to explore the park, including the journeys.",
    budget: "Check the current park-and-show package, performance slot and seat category; confirm what the ticket includes.",
    address: "Hangzhou Songcheng, 148 Zhijiang Road, Xihu, Hangzhou",
    chineseAddress: "杭州市西湖区之江路148号 杭州宋城",
    transport: "Taxi is the simplest option for the family. Budget roughly 40–60 minutes each way from the central hotel area, with more time in heavy traffic.",
    comfort: "The show is seated, but getting around the park adds walking. Prioritise the main performance and a short browse; expect loud sound and dramatic effects.",
    booking: "Pick a performance slot before setting off. The park publishes the day’s schedule, which can change; keep this separate from the West Lake show option.",
    sources: [{ label: "Songcheng official show guide", url: "https://www.songcn.com/show" }, { label: "Show production and running time", url: "https://www.ju-cheng.com/hycase/2018/0305/258.html" }],
  },
  {
    id: "apoli", category: "Bakeries & cafés", city: "Shanghai",
    name: "APOLI ITABAKERY", chinese: "AP意大利料理面包坊", neighbourhood: "Xingguo Road · by Wukang Mansion",
    line: "A little Italian-style bakery pause on your Wukang morning.",
    why: "This fits your route especially well: a browse of the pastry counter and a drink near Wukang Mansion, without turning a café stop into another cross-city journey.",
    photos: ["apoli-1", "apoli-2", "apoli-3", "apoli-4", "apoli-5", "apoli-6"], tags: ["Near Wukang Mansion", "Bakery & drinks", "Check ingredients"],
    fit: "14 October · During the Wukang Road morning, before lunch at Linhu Vegetarian.",
    time: "Suggested visit: 30–45 minutes, if the queue and seating work for you.",
    budget: "Planning allowance: about ¥40–80 per person for a drink and a pastry, depending on what you choose. Check the menu on arrival.",
    address: "380 Xingguo Road, Changning, Shanghai, diagonally opposite Wukang Mansion",
    chineseAddress: "上海市长宁区兴国路380号 APOLI ITABAKERY",
    transport: "A short walk from the Wukang Mansion area; allow about 5–10 minutes for crossings and a relaxed pace.",
    comfort: "Look for a seat before ordering if your parents need a break. It can be busy; take away or skip it rather than spending a long time standing.",
    booking: "Ask staff to check the specific pastry, filling, glaze and toppings. Some savoury breads contain meat or seafood; a sweet appearance does not rule out gelatine or animal fat.",
    sources: [{ label: "APOLI profile and address", url: "https://www.timeoutshanghai.cn/features/7442.html" }, { label: "Location listing", url: "https://ditu.amap.com/place/B0K2HANSIQ" }],
  },
  {
    id: "foamy", category: "Bakeries & cafés", city: "Hangzhou",
    name: "Foamy Foamy", chinese: "Foamy Foamy · 湖滨银泰", neighbourhood: "Hubin IN77 · exact unit to confirm",
    line: "A small dessert detour while you are already by the lake.",
    why: "A chance to choose a cake to share after your lakeside stroll. Keeping it within the Hubin outing makes this an easy optional treat rather than a separate excursion.",
    photos: ["foamy-1", "foamy-2", "foamy-3", "foamy-4", "foamy-5", "foamy-6"], tags: ["Near the lake", "Cakes to share", "Confirm branch"],
    fit: "11 October · During the Hubin afternoon, if you would like a dessert before the early dinner.",
    time: "Suggested visit: 20–40 minutes; extend only if comfortable seating is available.",
    budget: "Planning allowance: about ¥30–60 per person, depending on drinks and whether you share a cake. Current menu prices need checking.",
    address: "Hubin Yintai IN77, Shangcheng, Hangzhou. Exact zone and unit need confirmation.",
    chineseAddress: "杭州市上城区湖滨银泰in77 Foamy Foamy（请确认分区和店铺位置）",
    transport: "Walk from the Hubin lakeside once the branch is confirmed; allow roughly 10–20 minutes depending on your starting point and mall entrance.",
    comfort: "The proposed stop is in IN77. Listings differ between zones C and D, so confirm the current unit and seating before making a special trip. Photos show desserts from the listed Hubin branch, not a guarantee of the current menu.",
    booking: "Check gelatine in mousse, cream fillings and glazes before choosing a cake. Eggs and dairy are fine for your family, but each item still needs an ingredient check.",
    sources: [{ label: "Hubin branch listing and photographs", url: "https://sg.trip.com/restaurant/china/hangzhou/detail/foamy-foamy-45451173/" }],
  },
  {
    id: "butter", category: "Bakeries & cafés", city: "Shanghai",
    name: "BUTTERFUL & CREAMOROUS", chinese: "黄油与面包 · 新天地店", neighbourhood: "Xintiandi · Xingye Road",
    line: "A pastry-counter browse among Xintiandi’s old lanes.",
    why: "An easy extra while you are already exploring Xintiandi. Pick something small to share, then keep the evening unhurried rather than planning another full meal.",
    photos: ["butter-1", "butter-2", "butter-3", "butter-4", "butter-5", "butter-6"], tags: ["Pairs with Xintiandi", "Bakery stop", "Takeaway option"],
    fit: "12 October · With the optional Xintiandi visit. Check closing time first if going after dinner.",
    time: "Suggested visit: 15–30 minutes; treat this primarily as a bakery stop.",
    budget: "Planning allowance: about ¥30–70 per person for pastries or a drink. Final spend depends on your order.",
    address: "Xintiandi Style, Building 6, Lane 123 Xingye Road, Huangpu, Shanghai; confirm the current ground-floor unit.",
    chineseAddress: "上海市黄浦区兴业路123弄6号 新天地时尚 黄油与面包",
    transport: "Walk from the Xintiandi browsing area; allow around 5–10 minutes depending on where you start. Return to the hotel by taxi when ready.",
    comfort: "Do not rely on this being a seated café break. Check seating and queues first, and take pastries away if that is more comfortable.",
    booking: "Ask about meat or seafood fillings, lard, alliums and gelatine, including toppings and glazes. Check the exact item instead of assuming all butter pastries are suitable.",
    sources: [{ label: "Brand and Shanghai branch list", url: "https://butterfulcreamorous.com/chinese/" }, { label: "Xintiandi branch", url: "https://gs.ctrip.com/html5/you/foods/fooddetail/1445215/25042345.html" }],
  },
  {
    id: "longfeng", category: "Qipao", city: "Shanghai",
    name: "Longfeng Qipao", chinese: "龙凤旗袍", neighbourhood: "Shaanxi North Road · Jing’an",
    line: "A special stop for traditional Shanghai craftsmanship.",
    why: "Our pick for a more considered qipao browse: look closely at the fabric, edging and handmade knotted buttons, and try a few shapes without feeling rushed to buy.",
    photos: ["longfeng-1", "longfeng-2", "longfeng-3", "longfeng-4", "longfeng-5", "longfeng-6"], tags: ["Heritage since 1936", "Ready-made & custom", "Allow fitting time"],
    fit: "13 October · Pair with the West Nanjing Road part of the day, replacing some general shopping. It is a separate stop from the Huaihai Road boutiques.",
    time: "Suggested visit: 45–60 minutes for browsing and trying on; a custom consultation may take longer.",
    budget: "Indicative starting budget from your trip brief: ready-made from ¥1,500; custom from ¥3,000. These are not a current shop quote; confirm fabric, tailoring and alteration costs directly.",
    address: "207–209 Shaanxi North Road, Jing’an, Shanghai",
    chineseAddress: "上海市静安区陕西北路207–209号 龙凤旗袍",
    transport: "A short taxi ride from the West Nanjing Road shopping area; allow about 10–20 minutes depending on where you are. Save a longer walk if your parents are tired.",
    comfort: "Start with ready-made pieces if you want something to take home during this trip. Ask for time to sit during a longer consultation and leave room for an unhurried fitting.",
    booking: "Agree any alteration or collection date before paying. A custom qipao may not be ready before your 15 October flight; ask about fittings, delivery and the total quote first.",
    sources: [{ label: "Heritage and craftsmanship", url: "https://www.jingan.gov.cn/rmtzx/003008/003008006/20240218/37233ec7-8c5d-4cce-b0c2-b0ba29134341.html" }, { label: "Official city guide and address", url: "https://french.shanghai.gov.cn/fr-OnlyinShanghai/20260602/b561d3e8259c4aadbf337c6042452f7c.html" }],
  },
];
