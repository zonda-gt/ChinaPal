import { getAllAttractions, getCityNameEn } from "@/lib/attractions";
import HomePage from "./HomePage";
import type { GuideCard } from "./HomePage";

export default function Page() {
  const all = getAllAttractions();

  const guides: GuideCard[] = all.map((a) => ({
    slug: a.slug,
    citySlug: a.citySlug,
    cityName: getCityNameEn(a.citySlug),
    name_en: a.data.attraction_name_en,
    name_cn: a.data.attraction_name_cn,
    type: a.data.experience_type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    time: a.data.time_needed.recommended.replace(/\s*\(.*$/, ""),
    img: `/images/${a.slug}/ctrip_photo_01.jpg`,
    href: `/${a.citySlug}/${a.slug}`,
  }));

  return <HomePage guides={guides} />;
}
