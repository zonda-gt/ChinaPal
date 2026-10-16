# ChinaPal Instagram inbox

The private inbox is at `/inbox`. It uses one shared admin password, Instagram
API with Instagram Login, a dedicated Supabase database, and OpenAI Responses
for draft generation. Replies require explicit human approval. Nothing sends
when syncing messages, generating drafts, saving edits, or receiving webhooks.

## Server configuration

Set these in `.env.local` locally and Vercel Production before deploying:

| Variable | Purpose |
| --- | --- |
| `INBOX_ADMIN_PASSWORD` | Shared admin password, at least 16 characters. Rotation invalidates existing sessions. |
| `OPENAI_API_KEY` | OpenAI project API key for drafting and image input. |
| `INBOX_AI_MODEL` | Optional; defaults to `gpt-6.1-sol` with low reasoning effort. |
| `INSTAGRAM_ACCOUNT_ID` | Connected professional account's numeric ID. |
| `INSTAGRAM_ACCESS_TOKEN` | Instagram read/send authorization. Monitor expiry and renew as needed. |
| `INSTAGRAM_APP_SECRET` | Verifies Meta webhook signatures. |
| `INSTAGRAM_WEBHOOK_VERIFY_TOKEN` | Random value shared with Meta's callback verification form. |
| `CONCIERGE_SUPABASE_URL` | Dedicated concierge project URL. |
| `CONCIERGE_SUPABASE_SECRET_KEY` | Server-only database credential. |

Do not put secrets in `NEXT_PUBLIC_` variables. The concierge publishable key
is not needed for this password-based inbox. Existing website checkout/auth
Supabase variables belong to another project and must remain unchanged.

Run `supabase/inbox-setup.sql` in the dedicated **chinapal concierge** project.
It combines the two migrations, enables RLS on every table and revokes browser
access. The user applied this on 2026-10-16; live password login, conversation
import, message/image retrieval and draft persistence were verified afterward.

Before deploying travel profiles, also apply
`supabase/migrations/202610160002_inbox_profiles.sql`. This creates the private
`inbox_profiles` table with RLS and server-only grants. Development profiles
are stored locally under the ignored `data/cache/inbox-profiles` directory;
production profiles are stored in Supabase.

## Inbox layout and AI context

Drag the dividers beside the conversation list and contact details to adjust
panel widths. Drag above the reply assistant to adjust its height. Arrow keys
also resize a focused divider; double-click or Home resets it. Only panel sizes
are saved in browser localStorage. Customer messages are not persisted there.

The drafting instructions include the approved brief in
`docs/chinapal-service-brief.md`, mirrored in `src/lib/inbox/ai.ts`. Keep these
aligned when changing service terms. The About profile is not included in
reply generation.

About profiles use up to 1,000 saved messages, within a 120,000-character text
budget, and show source messages and history coverage. Images are not included.
The active conversation generates its first profile automatically and refreshes
after a pause when its saved history changes. Unchanged profiles are reused.

## Webhooks after deployment

1. Meta → Instagram use case → API setup with Instagram login → Configure webhooks.
2. Callback URL: `https://www.chinapal.co/api/webhooks/instagram`.
3. Verify token: the same `INSTAGRAM_WEBHOOK_VERIFY_TOKEN` set in Vercel.
4. Verify and save, subscribe to `messages`, then enable the account's webhook subscription.
5. Send a test DM manually and confirm it appears in the inbox without Refresh.

The app is published. Publication alone does not prove all permissions or webhook
delivery. Actual automatic delivery still needs this final Meta setup and test.
Until then, use Sync Instagram and Refresh messages for manual retrieval.
The webhook verifies its signature, saves the raw delivery, normalizes messages
and acknowledges only after successful storage. Retried deliveries deduplicate
by hash and messages by Instagram ID. It never invokes AI or sends a reply.

## Workflow and limits

- Sync Instagram lists conversations. Opening a chat imports its latest 30
  message records. Load older history follows API pagination; saved messages can
  be displayed up to 1,000 per open chat. More than 1,000 needs a future paginated
  message viewer. Instagram may omit deleted/unsupported content.
- The shared inbox polls saved data every 15 seconds while visible. Webhooks
  provide new data automatically once enabled; manual Refresh reads Instagram.
- AI receives the latest 80 saved messages, private notes, the current draft,
  revision instructions and up to six images from the latest 20 messages.
  It has no web search or reservation tools. OpenAI response storage is disabled.
- Attachment links are saved, not the media binaries. Images are fetched through
  an authenticated server proxy and may expire; refresh messages to renew links.
  V1 previews JPEG/PNG/WebP/GIF up to 5 MB. Other media opens in Instagram.
- Changes use version checks so a stale editor cannot overwrite a newer draft.
  New messages invalidate a draft's send approval until reviewed and saved again.
- API sends enforce a 24-hour window from the latest incoming message. Older
  replies can be handled manually in Instagram. No Human Agent exception is used.
- A pending/uncertain send blocks another send. Do not resend blindly. After two
  minutes, inspect Instagram and use the delivery-resolution controls.
- Both staff share an identity; this version does not attribute edits to an
  individual person. Sessions last 12 hours with hashed tokens, HttpOnly cookies,
  same-origin mutation checks, durable login throttling and server-only data.
- Public website analytics/session recording are excluded from the inbox.

## Validation

`npm run test:inbox` tests SQL migrations on isolated PostgreSQL (PGlite), private
access grants, message deduplication, deleted-message tombstones, conflicting
edits, reply-window enforcement, send reservations, webhook signatures,
storage failures, origin checks and image URL restrictions.

On 2026-10-16, the live read-only inspection enumerated 61 conversations and
1,392 message IDs across pages. The inbox imported 61 conversation summaries
and 11 messages plus one image from the designated test chat. OpenAI image draft
generation and English revision succeeded in the browser. Desktop and phone
layouts and the manual send-confirmation dialog were checked. No outbound
Instagram reply was sent during testing.
A real outgoing send and automatic Meta webhook delivery remain separate checks.

Local networking: on this Mac, Clash Verge's proxy is `http://127.0.0.1:7897`.
Use `NODE_USE_ENV_PROXY=1 HTTPS_PROXY=http://127.0.0.1:7897
NO_PROXY=localhost,127.0.0.1 npm run dev` for Node 24 local API access.
Never configure this local proxy address on Vercel.
