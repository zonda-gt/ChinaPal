// Reels travellers share: the note the AI writes about each one, how a place in
// it was matched on Amap, and the one line the reply drafter sees.

export type ReelKind = "place" | "places" | "ranking" | "itinerary" | "how_to" | "mood";
export type AmapMatch = {
  status: "confirmed" | "close" | "several" | "not_found" | "not_a_place" | "error";
  id?: string;
  name?: string;
  address?: string;
  location?: string; // "lng,lat"
  hours?: string;
  relation?: string; // for close: how the Amap place relates, e.g. "the escalator is inside this scenic area"
  reason: string;
};
export type ReelPlace = {
  name: string;
  name_cn: string;
  city: string;
  city_cn: string;
  category: string;
  what: string;
  tips: string[];
  rank: number; // position in a ranking, 0 when not ranked
  confidence: "named" | "likely" | "guess";
  evidence: string[];
  mappable: boolean;
  amap?: AmapMatch;
};
export type ReelNote = {
  kind: ReelKind;
  summary: string;
  short: string;
  cities: string[];
  places: ReelPlace[];
  tips: string[];
  route: string[];
  interests: string[];
  identified: "yes" | "partly" | "no";
  promo: boolean;
};
export type ReelStatus = "pending" | "working" | "done" | "failed";
/** What the inbox shows for a shared reel. */
export type ReelView = {
  code: string;
  url: string;
  caption: string;
  owner: string;
  status: ReelStatus;
  note: ReelNote | null;
  error: string;
};

export const MAX_ATTEMPTS = 3;
/** A reel stuck in "working" this long is taken to have crashed and is tried again. */
export const STALE_MS = 10 * 60 * 1000;

/** The reel's shortcode from an Instagram link, or "" when it isn't a post or reel link. */
export function reelCode(url: unknown) {
  if (typeof url !== "string") return "";
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" || !/(^|\.)instagram\.com$/.test(u.hostname)) return "";
    return u.pathname.match(/^\/(?:p|reel|reels)\/([A-Za-z0-9_-]{5,40})\/?$/)?.[1] ?? "";
  } catch {
    return "";
  }
}
export const reelUrl = (code: string) => `https://www.instagram.com/reel/${code}/`;

/** Whether this reel still needs reading, now or after a failed or stuck attempt. */
export function needsWork(r: { status: ReelStatus; attempts: number; updated_at: string }, now = Date.now()) {
  if (r.status === "pending") return true;
  if (r.status === "failed") return r.attempts < MAX_ATTEMPTS;
  if (r.status === "working") return now - Date.parse(r.updated_at) > STALE_MS && r.attempts < MAX_ATTEMPTS;
  return false;
}

/** How the reply drafter sees a shared reel in the conversation. */
export function reelLine(r: Pick<ReelView, "status" | "note" | "caption">) {
  if (r.status === "done" && r.note) return `[Shared reel: ${r.note.short}]`;
  const caption = r.caption.replace(/\s+/g, " ").trim().slice(0, 200);
  return caption ? `[Shared reel, not read yet. Caption: "${caption}"]` : "[Shared reel, not read yet]";
}

const str = { type: "string" };
export const NOTE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["kind", "summary", "short", "cities", "places", "tips", "route", "interests", "identified", "promo"],
  properties: {
    kind: { type: "string", enum: ["place", "places", "ranking", "itinerary", "how_to", "mood"] },
    summary: str,
    short: str,
    cities: { type: "array", items: str },
    places: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "name_cn", "city", "city_cn", "category", "what", "tips", "rank", "confidence", "evidence", "mappable"],
        properties: {
          name: str,
          name_cn: str,
          city: str,
          city_cn: str,
          category: {
            type: "string",
            enum: ["attraction", "nature", "viewpoint", "food", "cafe", "bar", "shopping", "activity", "neighbourhood", "hotel", "transport", "event"],
          },
          what: str,
          tips: { type: "array", items: str },
          rank: { type: "integer" },
          confidence: { type: "string", enum: ["named", "likely", "guess"] },
          evidence: { type: "array", items: { type: "string", enum: ["caption", "location_tag", "on_screen_text", "voiceover", "visual"] } },
          mappable: { type: "boolean" },
        },
      },
    },
    tips: { type: "array", items: str },
    route: { type: "array", items: str },
    interests: { type: "array", items: str },
    identified: { type: "string", enum: ["yes", "partly", "no"] },
    promo: { type: "boolean" },
  },
};

export const NOTE_INSTRUCTIONS = `You turn an Instagram reel about travel in China into a note a trip planner can use. You get the caption (any language), the location tag if any, the account that posted it, a transcript of the audio (it may be a voice-over, or just song lyrics or noise: ignore those) and still frames from the video in time order. Read the on-screen text in the frames carefully: reels often name places only there. Use what you recognise in the frames (landmarks, signs, shop names), but mark it as visual and only call it named or likely when you are sure.

- kind: place (one place), places (several), ranking (a ranked or tier list), itinerary (a sample trip or route), how_to (practical advice: payments, apps, transport, how to reach a spot or a photo angle), mood (no specific place, just a vibe).
- summary: one plain English sentence on what the reel shows.
- short: one line of at most 30 words (shorten place lists to stay within it) for someone replying to the traveller, giving the point of the reel, not just its places. By kind: place = what and where; places = the first 4 to 6 places, then "(+N)"; ranking = what is ranked, the top and the bottom; itinerary = the route with days per stop; how_to = the actual answer or steps; mood = the vibe, and say no place is named. Start with "Tour ad:" when promo.
- cities: the Chinese cities or regions involved, in English.
- places: every specific place in China the reel names or clearly shows. name in English; name_cn the usual Chinese name, your best guess when you are not sure (a map search will check it), "" only when you have no idea; city in English and city_cn in Chinese (the prefecture-level city, e.g. 张家界 for Tianmen Mountain, 湘西 for Fenghuang); what = what to do or eat there, in one short sentence; tips = at most 3, each one short line, only details about this place that change what a visitor does: how to get there or which entrance or exit, timing or how long it takes, tickets or booking, what to order, where to stand. Leave out anything generic, the creator's own story, and calls to follow or comment. rank = its position in a ranking, else 0. confidence: named (the reel names it), likely (strongly implied or clearly recognisable), guess. evidence = where you got it. mappable = false for things that are not one spot on a map (an event, a river, a skyline, a whole city or an administrative district such as 天河区). Leave out whole cities or provinces that are just destinations: those go in cities. A neighbourhood, street, viewpoint, shop or restaurant is a place.
- tips: at most 3 pieces of advice not tied to one place, only when the reel's point is that advice (a how-to or explainer) and it is specific (e.g. "stay in Puxi, not Pudong"). Leave out things every China trip guide says (VPN, Alipay, plug adapters, use Amap) unless the reel adds a specific detail.
- route: for itinerary reels only, the stops in order with days, e.g. "Chongqing (3 days)"; else [].
- interests: what a traveller who shared it probably likes, 1 to 4 short phrases.
- identified: yes when you know the places the reel is about, partly when only the city or some of them, no when you can't tell where.
- promo: true when it is an advert for a tour company or guide.
Never invent facts the reel doesn't give. English output.`;

export const MATCH_INSTRUCTIONS = `You match places from an Instagram travel reel to Amap (Gaode), China's map, so a trip planner gets the right Chinese name and address. You get the reel's summary and its places as the note-writer understood them; the Chinese names may contain mistakes (wrong characters, typos, informal names).

Use the tools like a careful local would: search in the right city, read the results, try the suggestions or another name if needed, search near a landmark the reel mentions, and check details when unsure what a result is. For a gate, hall or spot inside a bigger site, also try the site's name in front (e.g. 故宫东华门). Prefer the main place or its entrance over its ticket office, car park or a shop named after it; if only a car park or ticket office exists, report close and say so. For a chain, only pick a branch the reel shows; otherwise report several. When the reel names something with many sites but not which one (e.g. "the Great Wall" with no section), report several. A whole city or administrative district (区, 县) is not_a_place, even if Amap lists it. Don't force a match: not_found is better than a wrong place. Usually 1 to 3 searches per place are enough.

Call report_match once for every place in the list, then stop.`;
