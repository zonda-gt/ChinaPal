export type PlanKey = "trip-check" | "chinapal-pass";

// NOTE: Plan is plain serializable data only — it is passed from server
// components (checkout/success pages) into client components, so it must not
// contain functions. The first-message acknowledgement lives in firstAck()
// below, keyed by plan, instead of as a method on the object.
export type Plan = {
  key: PlanKey;
  name: string;
  price: number;
  unit: string;
  blurb: string;
  // Condensed "what's included" — a short value reminder for the checkout
  // order summary (not the full feature list, which lives on the pricing page).
  highlights: string[];
  successHeadline: string;
  successHint: string;
  whatsappPrefill: string;
};

export const PLANS: Record<PlanKey, Plan> = {
  "trip-check": {
    key: "trip-check",
    name: "Trip Check",
    price: 19,
    unit: "one-time review",
    blurb:
      "Send us your itinerary, hotel options, or trip questions. We review and send back local feedback within 24 hours.",
    highlights: [
      "Full itinerary review",
      "Hotel-area check",
      "Route improvements + what to skip",
      "Food & neighbourhood ideas",
      "One round of local feedback",
    ],
    successHeadline: "Your Trip Check is on the way.",
    successHint:
      "Share your draft itinerary, hotel options, and questions. A local will review and reply within 24 hours.",
    whatsappPrefill:
      "Hi ChinaPal! I just bought a Trip Check. Here's my itinerary:",
  },
  "chinapal-pass": {
    key: "chinapal-pass",
    name: "ChinaPal Pass",
    price: 39,
    unit: "7 days of local text help",
    blurb:
      "Text a real local team for 7 days. Planning, food, ticket guidance, translation, and \"what should we do next?\" moments.",
    highlights: [
      "7 days of local text support",
      "Personalized day-by-day planning",
      "Food, hotel-area & day-trip advice",
      "Ticket guidance + translation help",
      "App chat or WhatsApp",
    ],
    successHeadline: "You're in. Welcome to ChinaPal Pass.",
    successHint:
      "Your 7 days start when you send your first real support message. Tell us your trip and ask anything.",
    whatsappPrefill:
      "Hi ChinaPal! I just bought the 7-day Pass. Here's my trip:",
  },
};

/** First-message acknowledgement from the team, keyed by plan. */
export function firstAck(planKey: PlanKey, name: string): string {
  const hi = `Hey${name ? " " + name : ""}!`;
  if (planKey === "trip-check") {
    return `${hi} A local is reviewing your trip now. We'll send back feedback within 24 hours. Feel free to keep adding details (dates, hotels, links to attractions) while you wait.`;
  }
  return `${hi} A local is reading your message now and will reply within the hour. Keep sending details (dates, cities, hotels, anything you're unsure about) while you wait — that helps us help you faster.`;
}

export function isPlanKey(v: string | undefined | null): v is PlanKey {
  return v === "trip-check" || v === "chinapal-pass";
}

export const WHATSAPP_NUMBER = "8618201806768";

export function whatsappLink(plan: Plan): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(plan.whatsappPrefill)}`;
}
