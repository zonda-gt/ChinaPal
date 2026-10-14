import type { Metadata } from "next";
import HomePageDraft from "./HomePageDraft";

export const metadata: Metadata = {
  title: { absolute: "ChinaPal — Local China Travel Help, One Message Away" },
  description:
    "Plan your China trip, navigate trains and attraction bookings, get local recommendations and solve problems on the ground with a real team in China.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HomePageDraft />;
}
