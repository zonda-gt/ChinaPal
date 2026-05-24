# Enrichment Spec — Pipeline A Stage 3 + 4

Generate clean, structured data per place for the AI trip planner. For each assigned place, produce **one JSON file** at:

```
/Users/zonda/Documents/ClaudeCode/ChinaPal/data/cache/place/<id>.json
```

Each file contains two artifacts:
1. **`enrichment`** — closed-vocabulary tags
2. **`ai_summary`** — 200–300 word decision-dense block

You are tagging **for an AI trip planner that will read this later**, not for human display.

---

## Step 1 — Read the source

The `source_path` is the canonical processed JSON. Schema differs by category:

- **attraction** + **experience**: top-level keys (`attraction_name_cn/en`, `hook`, `honest_description`, `vibe`, `getting_in`, `best_time`, `physical_accessibility`, `best_for`, `pair_with`, `highlights`, `cultural_context`, `photo_spots`, `useful_chinese`)
- **restaurant**: layered shape — `layer1_card` (`identity`, `hook`, `vibe`, `price`, `dietary`, `tags`) + `layer2_detail` (`what_to_order`, `getting_there`, `practical`, `warnings`)

Read the full file before tagging. Don't infer from the name alone.

---

## Step 2 — Generate `enrichment`

**You may use ONLY the closed vocabulary values below. Do not invent new values.**

### `kid_suitability` — array (can be empty)
- `"toddler"` (0–3): stroller-friendly, no scary content, low energy
- `"child"` (4–9): can be entertained, no extreme heights/horror
- `"tween"` (10–13): engaged with cultural/active content
- `"teen"` (14–17): cool factor, can handle adult themes

A nightclub: `[]`. The Bund (iconic free walk): `["toddler", "child", "tween", "teen"]`. A high-end whisky bar: `["teen"]` if any.

### `mobility` — single value
- `"easy"`: flat paved, stroller-OK, wheelchair-accessible
- `"moderate"`: some stairs / some uphill / mostly accessible
- `"hard"`: significant climb, rough terrain, long walking

### `indoor_outdoor` — single value
- `"indoor"` | `"outdoor"` | `"mixed"`

### `weather_resilience` — single value
- `"high"`: rain or heat doesn't affect experience (museums, malls)
- `"medium"`: tolerable in light rain, less appealing
- `"low"`: rain/extreme heat ruins it (open-top observation, riverside walks)

### `energy_intensity` — single value
- `"low"`: relaxed pace, can sit
- `"medium"`: walking, moderate engagement
- `"high"`: physical activity, lots of stairs, full-day exhaustion

### `foreigner_friction_score` — integer 1–5
- **1**: zero friction (bilingual, no booking, walk-up)
- **2**: minimal (English signage, easy logistics)
- **3**: some friction (booking app helps, some Mandarin useful)
- **4**: notable friction (Chinese ID issues, Mandarin needed for full experience)
- **5**: high friction (locals-only, real language barrier, complex logistics)

Source signals: `getting_in.language_barrier_rating`, `passport_accepted`, `booking_method`, `useful_chinese` length.

### `best_time_of_day` — array
- `"dawn"` | `"morning"` | `"midday"` | `"afternoon"` | `"evening"` | `"night"`

Pick the 1–3 best slots. Source signals: `best_time.best_time_of_day`, `best_time.worst_time`.

### `dietary_flags` — object
For **non-restaurants**, describe nearby food options for visitors with restrictions:
```json
{
  "halal_ok": true|false,
  "veg_ok": true|false,
  "vegan_ok": true|false,
  "pork_free": true|false,
  "note": "optional 1-line context, e.g. 'multiple halal options on Yunnan Rd 5min walk'"
}
```

For **restaurants**, normalize the existing `layer1_card.dietary` to booleans:
- `"yes"` → `true`
- `"no"` → `false`
- `"limited"` / `"possible"` → `true` (and mention the caveat in `note`)

### `narrative_role` — single value
- `"iconic"`: must-see, defines the city (Bund, Yu Garden, Disney)
- `"hidden_gem"`: under-the-radar but excellent
- `"day_filler"`: solid choice but not destination-worthy
- `"highlight"`: strong supporting choice on a themed day
- `"wildcard"`: niche, only for specific interests (e.g. cat cafe, retro arcade)

### `interest_tags` — array from CLOSED list
```
["food", "culture", "history", "nature", "art", "nightlife", "shopping",
 "family", "adventure", "wellness", "photography", "architecture",
 "local-life", "iconic"]
```
Pick **2–5 most relevant** tags. **No tags outside this list.**

---

## Step 3 — Generate `ai_summary`

**200–300 words. Not marketing. Decision-dense facts only.**

The AI planner reads this to decide "should I put this in slot 3 of day 2?" Give it:
- What it is, in one phrase
- Cost + booking model (numeric where possible)
- Time required, best slot
- Who it suits / who it doesn't
- Logistics (transit, accessibility, food nearby)
- Pair-with suggestions (other places)
- Foreigner-specific traps if any
- One unique selling point

Skip:
- Flowery prose ("immerse yourself in the timeless beauty of...")
- Marketing copy
- General travel tips that apply to any place
- Restating the name

### Good vs bad summary

❌ **Bad** (marketing fluff):
> "Discover the magical riverside promenade where Shanghai's storied past meets its dazzling modern future. Walk along the Bund and feel the romance of a city in motion..."

✅ **Good** (decision-dense):
> The Bund. Free outdoor 1.5km riverside promenade, 24/7, no tickets. Best 30 min before sunset through 11pm summer / 10pm winter for the lights. Iconic — first-time-essential. Stroller-friendly, all kid bands. Foreigner-friction 1/5 — bilingual signage, no booking, no language needed. Walk-on alternative to the ¥120 cruise: ¥2 commuter ferry from Jinling East Rd pier (10 min). Pairs naturally with Yu Garden (south, 10 min) and Nanjing East Rd (west, 10 min). Eat 2-3 blocks west — the riverside-facing restaurants are tourist traps. Watch for the tea-scam touts targeting foreigners. ~2hrs typical, 30 min minimum. Crowds peak weekend evenings 7-9pm — avoid with kids; weekday evenings or 6am are excellent. Skip the Sightseeing Tunnel.

---

## Step 4 — Write the file

Path: `/Users/zonda/Documents/ClaudeCode/ChinaPal/data/cache/place/<id>.json`

```json
{
  "id": "<the place id from your batch>",
  "name_cn": "<from source>",
  "category": "<attraction|experience|restaurant>",
  "enrichment": {
    "kid_suitability": [...],
    "mobility": "...",
    "indoor_outdoor": "...",
    "weather_resilience": "...",
    "energy_intensity": "...",
    "foreigner_friction_score": 1-5,
    "best_time_of_day": [...],
    "dietary_flags": {...},
    "narrative_role": "...",
    "interest_tags": [...]
  },
  "ai_summary": "...",
  "generated_at": "<ISO timestamp>"
}
```

---

## Process for each assigned place

1. Read `source_path` JSON.
2. Generate `enrichment` (closed vocabulary, no new values).
3. Generate `ai_summary` (200–300 words, decision-dense).
4. Write to `data/cache/place/<id>.json`. Overwrite if exists.
5. Move to next place.

If a source file is missing or malformed, write a minimal file with `enrichment: null`, `ai_summary: null`, and a `quality_flags` array noting the issue. Don't skip silently.

Report only: total places assigned, count succeeded, count failed (with one-line reason per failure). Do **not** dump generated content to stdout — it's already in the files.
