import { MetadataRoute } from "next";
import { getAllAttractions, getAllCitySlugs } from "@/lib/attractions";

const BASE_URL = "https://chinapal.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const attractions = getAllAttractions().map((a) => ({
    url: `${BASE_URL}/${a.citySlug}/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const cities = getAllCitySlugs().map((city) => ({
    url: `${BASE_URL}/${city}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...cities,
    ...attractions,
  ];
}
