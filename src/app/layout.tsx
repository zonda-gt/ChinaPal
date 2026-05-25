import type { Metadata } from "next";
import "./globals.css";
import { PostHogProvider } from "./providers";
import { PostHogPageView } from "./PostHogPageView";

// Google Ads tag. Set NEXT_PUBLIC_GOOGLE_ADS_ID (e.g. "AW-1234567890") to enable.
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://chinapal.co"),
  title: {
    default: "ChinaPal — Your China Travel Concierge",
    template: "%s | ChinaPal",
  },
  description:
    "China travel, without the friction. A local expert one text away — for setup, bookings, and every question China throws at you.",
  openGraph: {
    siteName: "ChinaPal",
  },
  other: {
    "google-site-name": "ChinaPal",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ChinaPal",
              alternateName: "China Pal",
              url: "https://chinapal.co",
            }),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Fraunces:ital,wght@0,400;0,600;0,700;0,900;1,700&family=Inter:wght@300;400;500;600;700;800&family=Noto+Serif+SC:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {process.env.NODE_ENV === "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "w0yzfjrluq");`,
            }}
          />
        )}
        {GOOGLE_ADS_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body>
        <PostHogProvider>
          <PostHogPageView />
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
