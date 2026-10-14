# Homepage draft

Published separately at `/newhomepage`; preview the same route using the local development server.

- Edit `HomePageDraft.tsx` for the draft content and layout.
- Edit `DraftNavbar.tsx` and `DraftFooter.tsx` for draft navigation and footer changes.
- The current homepage remains in `src/app/HomePage2.tsx`, rendered by `src/app/page.tsx`.
- Keep draft styling in this folder or scoped to draft components. Root layout, global CSS, public assets, and linked checkout pages are still shared.

The draft includes revised travel-support messaging and proposed homepage SEO metadata, with search indexing disabled. It has no public navigation link or password protection; deploying this folder would make its URL accessible. Local edits can still be previewed before deployment.

The approved customer photo is stored at `public/newhomepage/aamir.jpg` (1200 × 1600, full frame, metadata removed) and rendered with responsive Next.js image optimization. The existing remote hero image has a local landscape fallback because its CDN returned HTTP 403 during testing.

Pricing reads from the existing checkout configuration: $19 for a one-time Trip Check and $39 for seven days of ChinaPal Pass. Checkout product names and IDs are unchanged; the draft calls Trip Check “Itinerary Check.” App chat/WhatsApp and first-message activation terms are retained.

Before publishing, review the product page and checkout descriptions, which still emphasize advice and ticket guidance rather than selected booking/purchase assistance. Existing response-time wording differs (“minutes,” “within the hour,” and 24 hours for Trip Check); the draft adds no timing or refund promises. The old homepage's satisfaction guarantee is omitted pending clear policy wording. Analytics and website structured data remain inherited from the root layout.

This page is published at `/newhomepage` by request. Replace the root homepage only when separately requested.
