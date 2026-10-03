import type { Metadata } from "next";
import RecommendationsClient from "./client";

export const metadata: Metadata = {
  title: "A few places picked for Ruijun & family — ChinaPal",
  description: "A personal collection of shows, bakery stops and qipao craftsmanship in Shanghai and Hangzhou, chosen for Ruijun and her parents.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <RecommendationsClient />;
}
