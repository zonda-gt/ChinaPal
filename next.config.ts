import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native modules used by the planner backend — must run in Node, not bundled.
  serverExternalPackages: ["better-sqlite3", "sqlite-vec"],

  // Clean URL for the Google Ads chat landing page (static file in /public).
  // /landing-chat  ->  /public/landing-chat.html  (static files are matched
  // before this afterFiles rewrite, so /landing-chat.html still works too).
  async rewrites() {
    return [{ source: "/landing-chat", destination: "/landing-chat.html" }];
  },
};

export default nextConfig;
