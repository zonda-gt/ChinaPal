# WhatsApp for one linked chat

One Instagram conversation in `/inbox` can also receive and send WhatsApp
messages. Staff link it by hand to the customer's phone number. Every other
conversation is unchanged: the WhatsApp toggle, labels and send path appear only
in the linked chat.

- Incoming WhatsApp messages land in the same thread, tagged "WhatsApp", and the
  brief, plan, questions and AI drafts read them like any other message.
- The composer shows **Reply on: Instagram | WhatsApp**. It defaults to the app
  the customer last wrote on. Each app has its own 24-hour reply window.
- Messages from numbers that are not linked are dropped and never stored.
  WhatsApp has no history API, so link the number **before** the customer writes.
- Text only. Photos, voice notes, files and locations show as "View it in
  WhatsApp"; captions are kept.

Code: `src/app/api/webhooks/whatsapp/route.ts`, `src/lib/whatsapp/webhook.ts`
(parsing), `src/lib/inbox/events.ts` (`storeWhatsAppMessages`),
`src/lib/inbox/whatsapp.ts` (sending), migration
`supabase/migrations/202610290001_inbox_whatsapp.sql`.

## 1. Meta setup

1. In Meta for Developers, open the ChinaPal app (or create a Business app) and
   add the **WhatsApp** use case, connected to the ChinaPal business portfolio.
2. Add the business phone number in WhatsApp → API Setup. A number on the
   normal WhatsApp app cannot also be on the API. If the number is already in the
   **WhatsApp Business app** and you want to keep using the phone, choose the
   option to connect the existing Business app number (Meta calls this
   "coexistence") if Meta offers it. Otherwise use a separate number.
3. Copy the **Phone number ID** (not the phone number) from API Setup.
4. Create a permanent token: Business settings → Users → System users → add an
   admin system user → assign it the app and the WhatsApp account → Generate
   token with `whatsapp_business_messaging` and `whatsapp_business_management`.
   The temporary token on API Setup expires after 24 hours.
5. Copy the **App secret** from App settings → Basic. This is the Meta app's
   secret; it may differ from `INSTAGRAM_APP_SECRET`.
6. The app must be in **Live** mode for real customer messages to reach the webhook.

## 2. Server configuration

Add to Vercel Production (and `.env.local` for local testing):

| Variable | Purpose |
| --- | --- |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID from API Setup. Only this number's events are accepted. |
| `WHATSAPP_ACCESS_TOKEN` | System-user token from step 4. |
| `WHATSAPP_APP_SECRET` | Verifies webhook signatures. |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Any long random value; reused in the webhook form below. |

## 3. Database

Run `supabase/migrations/202610290001_inbox_whatsapp.sql` in the **chinapal
concierge** project. It adds `inbox_conversations.whatsapp_id`, a `channel`
on messages and drafts, and gives each app its own reply window when sending.
Rerunning it is safe. Instagram sending keeps working before and after it.

## 4. Webhook

1. Deploy, then in the app: WhatsApp → Configuration → Webhook → Edit.
2. Callback URL: `https://www.chinapal.co/api/webhooks/whatsapp`.
3. Verify token: the same `WHATSAPP_WEBHOOK_VERIFY_TOKEN`.
4. Verify and save, then subscribe to `messages`. If the number uses the
   Business app at the same time, also subscribe to `smb_message_echoes` so
   replies typed on the phone appear in the inbox.

## 5. Link the customer's chat

In the Supabase SQL editor, using the customer's Instagram username and their
number with country code, digits only (no `+`, spaces or leading `0`):

```sql
update inbox_conversations
set whatsapp_id = '447700900123'
where username = 'their_instagram_username';
```

Check exactly one row was updated. To unlink, set `whatsapp_id = null`; their
WhatsApp messages stay in the thread.

## 6. Test

1. Ask the customer to message the business number first (for example via
   `https://wa.me/<business number>`). Businesses cannot start a WhatsApp chat
   without an approved template, and this inbox does not send templates.
2. Their message should appear in the linked chat within the 15-second refresh,
   tagged "WhatsApp".
3. Pick **WhatsApp** in the composer, approve and send.

If nothing arrives, check Vercel logs. `Ignored a message from an unlinked
number` means the stored `whatsapp_id` differs from the number WhatsApp
reports; some countries' numbers are reported with or without an extra digit.
Fix `whatsapp_id` and ask them to send again.
