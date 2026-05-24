import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Trip Planner",
  description:
    "Plan your China trip in about 90 seconds. Tell us a few details and we'll draft a complete itinerary — bookings, local tips, and the things worth skipping included.",
  openGraph: {
    title: "ChinaPal — AI Trip Planner",
    description:
      "Tell us a few details and we'll draft a complete China itinerary in about 90 seconds.",
  },
};

export default function AIPlannerPage() {
  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "oklch(0.985 0.005 80)",
      }}
    >
      <iframe
        src="/planner-app.html"
        title="ChinaPal AI Trip Planner"
        style={{
          width: "100%",
          height: "100%",
          border: 0,
          display: "block",
          background: "transparent",
        }}
        allow="clipboard-write"
      />
    </main>
  );
}
