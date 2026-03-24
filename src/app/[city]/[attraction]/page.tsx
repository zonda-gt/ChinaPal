import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllAttractions,
  getAttraction,
  getCityNameEn,
} from "@/lib/attractions";
import AttractionPage from "./AttractionPage";

interface PageProps {
  params: Promise<{ city: string; attraction: string }>;
}

export async function generateStaticParams() {
  const all = getAllAttractions();
  return all.map((a) => ({
    city: a.citySlug,
    attraction: a.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city, attraction: slug } = await params;
  const data = getAttraction(city, slug);
  if (!data) return { title: "Not Found" };

  const cityName = getCityNameEn(city);
  return {
    title: `${data.attraction_name_en} (${data.attraction_name_cn}) — ${cityName} Guide`,
    description: data.hook,
    openGraph: {
      title: `${data.attraction_name_en} — ChinaPal`,
      description: data.hook,
      type: "article",
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { city, attraction: slug } = await params;
  const data = getAttraction(city, slug);
  if (!data) notFound();

  return <AttractionPage data={data} citySlug={city} attractionSlug={slug} />;
}
