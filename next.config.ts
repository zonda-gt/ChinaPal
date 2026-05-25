import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native modules used by the planner backend — must run in Node, not bundled.
  serverExternalPackages: ["better-sqlite3", "sqlite-vec"],

  // Clean URLs for the Google Ads landing pages (static files in /public).
  // /landing-chat  ->  /public/landing-chat.html  (static files are matched
  // before this afterFiles rewrite, so /landing-chat.html still works too).
  async rewrites() {
    return [
      { source: "/landing-chat", destination: "/landing-chat.html" },
      { source: "/landing-guide", destination: "/landing-guide.html" },
      { source: "/landing-solo", destination: "/landing-solo.html" },
    ];
  },
};

export default nextConfig;
