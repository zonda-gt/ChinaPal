"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const subscribe = () => () => {};
const publicAnalyticsLoaded = () =>
  !!(window as Window & { __chinaPalPublicAnalytics?: boolean })
    .__chinaPalPublicAnalytics;

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const privatePage = pathname === "/inbox" || pathname.startsWith("/inbox/");
  const safeToRender = useSyncExternalStore(
    subscribe,
    () => !publicAnalyticsLoaded(),
    () => false,
  );
  useEffect(() => {
    if (privatePage) {
      // A hard navigation drops analytics scripts loaded by a previous public page.
      // Keep private content unmounted until the document is free of public analytics.
      if (
        (window as Window & { __chinaPalPublicAnalytics?: boolean })
          .__chinaPalPublicAnalytics
      )
        window.location.reload();
      return;
    }
    (
      window as Window & { __chinaPalPublicAnalytics?: boolean }
    ).__chinaPalPublicAnalytics = true;
    posthog.init("phc_VdJUSJtZp2OqYmlNYHF9UaTystnuWBhLltqZKwh4Ogj", {
      api_host: "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true,
    });
  }, [privatePage]);

  if (privatePage) return safeToRender ? <>{children}</> : null;
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
