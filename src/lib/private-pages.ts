// Team-only pages (the inbox, its variants and /comment) never load analytics, since
// they show customer conversations and commenters. The inline scripts in app/layout.tsx use the same pattern.
export const PRIVATE_PATH = /^\/(?:inbox(?:-[a-z0-9]+)?|comment)(?:\/|$)/;
export const isPrivatePath = (pathname: string | null) => !!pathname && PRIVATE_PATH.test(pathname);
