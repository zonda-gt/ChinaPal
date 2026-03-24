import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllCitySlugs,
  getAttractionsByCity,
  getCityNameEn,
  getCityNameCn,
} from "@/lib/attractions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return getAllCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const name = getCityNameEn(city);
  if (!name || name === city) return { title: "Not Found" };
  return {
    title: `${name} Travel Guide — Top Attractions`,
    description: `In-depth guides to ${name}'s best attractions. Written for foreign travelers, powered by local knowledge.`,
  };
}

export default async function CityPage({ params }: PageProps) {
  const { city } = await params;
  const cityName = getCityNameEn(city);
  const cityCn = getCityNameCn(city);
  if (!cityName || cityName === city) notFound();

  const attractions = getAttractionsByCity(city);
  if (attractions.length === 0) notFound();

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Navbar />

      <section className="pt-28 pb-12">
        <div className="cp-container max-w-5xl mx-auto">
          <p className="font-body text-xs font-semibold text-[#DC2626] uppercase tracking-widest mb-3">
            City Guide
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-[#111110] leading-[1.1] mb-2">
            {cityName}
            {cityCn && <span className="font-body text-2xl text-[#A8A29E] ml-3">{cityCn}</span>}
          </h1>
          <p className="font-body text-base text-[#78716C] mt-3 max-w-lg">
            {attractions.length} attraction {attractions.length === 1 ? "guide" : "guides"} — written for foreign travelers.
          </p>
        </div>
      </section>

      <main className="pb-20">
        <div className="cp-container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {attractions.map((a) => (
              <Link
                key={a.slug}
                href={`/${city}/${a.slug}`}
                className="group block bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden hover:border-[#DC2626] hover:shadow-lg transition-all no-underline"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={`/images/${a.slug}/ctrip_photo_01.jpg`}
                    alt={a.data.attraction_name_en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg text-[#111110] leading-tight">
                    {a.data.attraction_name_en}
                    <span className="font-body text-sm text-[#A8A29E] ml-2">{a.data.attraction_name_cn}</span>
                  </h3>
                  <p className="font-body text-sm text-[#78716C] mt-1">
                    {a.data.experience_type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} · {a.data.time_needed.recommended.replace(/\s*\(.*$/, "")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
