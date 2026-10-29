// The people who sign in to the inbox. Their id is what drafts record as the
// sender (edited_by), so keep ids stable; names are what the inbox shows.
export const TEAM = [
  { id: "steven", name: "Steven" },
  { id: "kira", name: "Kira" },
] as const;
export type TeamId = (typeof TEAM)[number]["id"];

/** Who sent or edited something, from a stored id; older records say "admin". */
export function teamName(id: string | null | undefined) {
  return TEAM.find((m) => m.id === id)?.name ?? null;
}
