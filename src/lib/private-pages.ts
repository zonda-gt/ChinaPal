// Team-only pages (the inbox and its variants) never load analytics, since they
// show customer conversations. The inline scripts in app/layout.tsx use the same pattern.
export const PRIVATE_PATH = /^\/inbox(?:-[a-z0-9]+)?(?:\/|$)/;
export const isPrivatePath = (pathname: string | null) => !!pathname && PRIVATE_PATH.test(pathname);
