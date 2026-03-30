import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TransportGuideContent from "./TransportGuideContent";
import RideHailingGuideContent from "./RideHailingGuideContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const GUIDES: Record<
  string,
  { title: string; description: string; component: "transport" | "ride-hailing" }
> = {
  "china-transport-guide": {
    title: "Getting Around China: The Complete Transport Guide",
    description:
      "From bullet trains to bike shares — everything a foreign traveler needs to navigate China's transport network. Metro, HSR, Didi, Alipay, and more.",
    component: "transport",
  },
  "ride-hailing-china": {
    title: "The Ultimate Guide to Ride-Hailing in China",
    description:
      "DiDi, taxis, payments, and everything a foreigner needs to navigate Chinese cities with confidence. Step-by-step setup with real screenshots.",
    component: "ride-hailing",
  },
};

export function generateStaticParams() {
  return [
    { slug: "china-transport-guide" },
    { slug: "ride-hailing-china" },
  ];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES[slug];
  if (!guide) return { title: "Not Found" };

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `https://chinapal.co/guides/${slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `https://chinapal.co/guides/${slug}`,
      type: "article",
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = GUIDES[slug];
  if (!guide) notFound();

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Navbar />
      {guide.component === "transport" && <TransportGuideContent />}
      {guide.component === "ride-hailing" && <RideHailingGuideContent />}
      <Footer />
    </div>
  );
}
