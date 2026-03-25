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
  const url = `https://chinapal.co/${city}/${slug}`;
  const imageUrl = `https://chinapal.co/images/${slug}/ctrip_photo_01.jpg`;

  // Truncate hook to ~155 chars for meta description, breaking at last word boundary
  const hook = data.hook;
  const description =
    hook.length <= 155
      ? hook
      : hook.slice(0, 155).replace(/\s+\S*$/, "") + "…";

  return {
    title: `${data.attraction_name_en} (${data.attraction_name_cn}) — ${cityName} Guide`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${data.attraction_name_en} — ${cityName} Travel Guide`,
      description,
      type: "article",
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: data.attraction_name_en,
        },
      ],
    },
  };
}

function AttractionJsonLd({
  data,
  citySlug,
  attractionSlug,
}: {
  data: NonNullable<ReturnType<typeof getAttraction>>;
  citySlug: string;
  attractionSlug: string;
}) {
  const cityName = getCityNameEn(citySlug);
  const url = `https://chinapal.co/${citySlug}/${attractionSlug}`;
  const imageUrl = `https://chinapal.co/images/${attractionSlug}/ctrip_photo_01.jpg`;

  const attractionSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: data.attraction_name_en,
    alternateName: data.attraction_name_cn,
    description: data.hook,
    address: {
      "@type": "PostalAddress",
      addressLocality: cityName,
      addressCountry: "CN",
      streetAddress: data.address_cn,
    },
    image: imageUrl,
    url,
    openingHours: data.getting_in.opening_hours,
    isAccessibleForFree: /^free/i.test(data.getting_in.price_rmb),
    ...(!(/^free/i.test(data.getting_in.price_rmb)) && {
        priceRange: data.getting_in.price_rmb,
      }),
    touristType: data.best_for,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://chinapal.co",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${cityName} Guide`,
        item: `https://chinapal.co/${citySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.attraction_name_en,
        item: url,
      },
    ],
  };

  const faqSchema =
    data.foreigner_top_questions.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data.foreigner_top_questions.map((q) => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: q.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(attractionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}

export default async function Page({ params }: PageProps) {
  const { city, attraction: slug } = await params;
  const data = getAttraction(city, slug);
  if (!data) notFound();

  return (
    <>
      <AttractionJsonLd data={data} citySlug={city} attractionSlug={slug} />
      <AttractionPage data={data} citySlug={city} attractionSlug={slug} />
    </>
  );
}
