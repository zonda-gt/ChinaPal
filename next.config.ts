import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native modules used by the planner backend — must run in Node, not bundled.
  serverExternalPackages: ["better-sqlite3", "sqlite-vec"],

  // ffmpeg takes still frames from shared reels (src/lib/inbox/reels.ts). It is
  // run as a program, so the build has to be told to ship it with these routes.
  outputFileTracingIncludes: {
    "/api/webhooks/instagram": ["./node_modules/@ffmpeg-installer/linux-x64/ffmpeg"],
    "/api/inbox/\\[\\.\\.\\.path\\]": ["./node_modules/@ffmpeg-installer/linux-x64/ffmpeg"],
  },

  // Clean URLs for the Google Ads landing pages (static files in /public).
  // /landing-chat  ->  /public/landing-chat.html  (static files are matched
  // before this afterFiles rewrite, so /landing-chat.html still works too).
  // The inbox redesign moved from its preview address to /inbox.
  async redirects() {
    return [{ source: "/inbox-v2", destination: "/inbox", permanent: false }];
  },
  async rewrites() {
    return [
      { source: "/landing-chat", destination: "/landing-chat.html" },
      { source: "/landing-guide", destination: "/landing-guide.html" },
      { source: "/landing-solo", destination: "/landing-solo.html" },
    ];
  },
};

export default nextConfig;
