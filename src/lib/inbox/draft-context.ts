import type { PlanCore, PlanItem } from "./plan-data";

// The trip plan as reference text for the reply drafter. Only
// customer-safe facts go in: the plan's verify and source notes are left out,
// and long descriptions are cut to their first sentence to keep drafts short.

/** True once we've sent the customer a link to their itinerary page. */
export function planShared(messages: { direction: string; text: string; deleted?: boolean }[]) {
  return messages.some((m) => m.direction === "outbound" && !m.deleted && /chinapal\.co\/itinerary\//i.test(m.text));
}

function firstSentence(text: string) {
  const flat = text.replace(/\s+/g, " ").trim();
  const end = flat.search(/[.!?](\s|$)/);
  return end >= 0 ? flat.slice(0, end + 1) : flat;
}

function stopLine(item: PlanItem) {
  const paragraphs = item.detail.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const restaurants = paragraphs.find((p) => p.startsWith("Restaurants:"));
  const options = paragraphs.filter((p) => p.startsWith("Other option")).map((p) => p.split(". ")[0]);
  const summary = paragraphs.find((p) => !p.startsWith("Restaurants:") && !p.startsWith("Other option") && !p.startsWith("Nearby:"));
  const place = [item.place_cn, item.address_cn].filter(Boolean).join(" · ");
  return [
    `- ${item.time ? `${item.time} ` : ""}${item.title}${item.kind === "option" ? " (optional)" : ""}`,
    summary && `  ${firstSentence(summary)}`,
    place && `  Chinese name/address: ${place}`,
    item.getting_there && `  Getting there: ${item.getting_there}`,
    item.cost && `  Cost: ${item.cost}`,
    // Restaurant names and cuisines only; the full notes stay in the Plan tab.
    restaurants &&
      `  Restaurants: ${restaurants.slice("Restaurants:".length).split(" | ").map((r) => r.split(": ")[0].trim()).join(" | ")}`,
    ...options.map((o) => `  ${o}`),
  ].filter(Boolean).join("\n");
}

export function planForDraft(plan: PlanCore) {
  const days = plan.days.map((d, i) =>
    [`Day ${i + 1} · ${d.label || d.date}${d.base ? ` · staying at ${d.base}` : ""}`, ...d.items.map(stopLine)].join("\n"));
  const bookings = plan.bookings.map((b) => `- ${b.item} (${b.when}): ${b.status.replace("_", " ")}${b.deadline ? `; ${b.deadline}` : ""}`);
  return [
    plan.overview && `Overview: ${plan.overview}`,
    ...days,
    bookings.length && `Bookings:\n${bookings.join("\n")}`,
    plan.tips.length && `Tips:\n${plan.tips.map((t) => `- ${t}`).join("\n")}`,
  ].filter(Boolean).join("\n\n");
}
