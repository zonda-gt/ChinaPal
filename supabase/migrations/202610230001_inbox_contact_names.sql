-- Save each customer's Instagram display name with the conversation, so the
-- inbox and the AI drafts have it straight away instead of waiting on Meta.
-- Profile pictures are still fetched live: their CDN links expire.
alter table public.inbox_conversations add column if not exists name text;
