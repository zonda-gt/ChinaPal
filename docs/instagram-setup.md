# ChinaPal Instagram inbox

The private inbox is at `/inbox`. It uses one shared admin password, Instagram
API with Instagram Login, a dedicated Supabase database, and OpenAI Responses
for draft generation. Replies require explicit human approval. Nothing sends
when syncing messages, generating drafts, saving edits, or receiving webhooks.

`/inbox` shows the current design (code in `src/app/inbox-v2/`), with the trip
brief (`src/lib/inbox/brief.ts`, table `inbox_briefs`) and the team-only trip
assistant (`src/lib/inbox/ask.ts`). The right column has three tabs: Brief, Plan
(`src/lib/inbox/plan.ts`, table `inbox_plans`) and Questions
(`src/lib/inbox/question-store.ts`, table `inbox_questions`). The previous design stays at `/inbox-old` as a
temporary fallback, and `/inbox-v2` redirects to `/inbox`. Analytics never load on
any `/inbox…` page (`src/lib/private-pages.ts`).

## Server configuration

Set these in `.env.local` locally and Vercel Production before deploying:

| Variable | Purpose |
| --- | --- |
| `INBOX_ADMIN_PASSWORD` | Shared admin password, at least 16 characters. Rotation invalidates existing sessions. |
| `OPENAI_API_KEY` | OpenAI project API key for drafting and image input. |
| `INBOX_AI_MODEL` | Optional; defaults to `gpt-6.1-sol`. |
| `INBOX_AI_REASONING` | Optional reply-assistant reasoning effort: `low`, `medium` (default) or `high`. |
| `INBOX_PLAN_MODEL` | Optional trip-plan model; defaults to `INBOX_AI_MODEL`. |
| `INBOX_PLAN_EFFORT` | Optional trip-plan reasoning effort: `low`, `medium` (default) or `high`. |
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

The reply assistant's instructions are in `src/lib/inbox/prompt.ts`; keep its
service facts aligned with `docs/chinapal-service-brief.md` when changing terms.
Generation itself (`src/lib/inbox/draft-core.ts`) has no database access, so the
inbox and the offline evaluation (`scripts/inbox-eval/`) run the same request.
The saved About profile is included as a trip summary; the conversation wins
where they differ.

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
- AI receives up to 400 recent saved messages within a 60,000-character budget,
  the current Shanghai time, the customer's name, private notes, the saved trip
  summary, staff facts ("What we've done"), the current draft, revision
  instructions and up to six images from the latest 20 messages, in order.
  It has no web search or reservation tools. OpenAI response storage is disabled.
- A draft can hold up to three messages. Staff approve and send each one; after
  a send, the next message becomes the shared draft for review.
- Every generation is logged in `inbox_ai_generations` (prompt version, model,
  output, warnings, usage) so drafts can be compared with what was sent. Apply
  `supabase/migrations/202610190001_inbox_reply_assistant_v2.sql` before
  deploying this version.
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

## Trip plans and the questions list

Apply `supabase/migrations/202610220001_inbox_plans_questions.sql` before using
the Plan and Questions tabs (without it the brief and drafts keep working and the
two tabs show a migration message).

- **Questions**: what to ask the traveller ("customer") or check ourselves ("team").
  Updating the trip brief adds missing basics and marks questions asked or answered
  from the chat (each change must cite a real message). Building a plan adds the
  blockers it met. Ticked customer questions are given to the next AI draft and are
  marked asked when that draft is sent (or resolved as sent).
- **Plan**: an OpenAI background response with web search (`store: true` is required
  for background mode; the stored response is deleted once the plan is saved).
  Opening the Plan tab checks on a running job; jobs over 30 minutes are stopped.
  Item sources are kept only when they are pages the research actually opened.


## Comment replies (/comment)

`/comment` (code in `src/app/comment/`, `src/lib/inbox/comments.ts`) answers
keyword comments: when someone comments e.g. "CHINA" on one of our posts or
reels, we send them a DM (Instagram's private reply) and, optionally, reply
under their comment. Sign in with the inbox username and password. The team
writes every message; no AI is involved, and this is the one place the app
sends without a person approving each message.

- A reply for **every post** applies to all posts and reels, including future
  ones. A post can have its **own** reply for the same keyword, which wins.
- Keywords match as whole words, ignoring case, emoji and punctuation
  ("China!!" matches CHINA, "Chinatown" does not). Chinese or Japanese
  keywords match anywhere in the comment.
- Instagram allows one private reply per comment, within 7 days. Each comment
  is logged once in `inbox_comment_replies`, so webhook retries never send
  twice. A failed send shows Instagram's reason and a Retry button; parts
  already sent (the DM or the public reply) are not repeated.
- Our own comments, including our public replies, are ignored.

Setup, once:

1. Apply `supabase/migrations/202610300001_inbox_comment_replies.sql`.
2. In Meta → Instagram use case → API setup with Instagram login, make sure the
   app has `instagram_business_manage_comments` (as well as the messaging
   permission), regenerate `INSTAGRAM_ACCESS_TOKEN` if it was issued without
   it, and subscribe the webhook to the **comments** field next to `messages`.
3. Save a reply on `/comment`, comment the keyword on one of our posts from
   another account, and check the DM, the public reply and the log.

Meta sends every comment on our posts, not only keyword ones. Only matching
comments are logged, but each delivery is still kept in
`instagram_webhook_deliveries` like message webhooks.
