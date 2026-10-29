-- Reels travellers share with us: what each reel shows, read once and kept
-- (inbox_reels, one row per reel, shared across travellers), and which chat
-- message shared it (inbox_reel_shares).
begin;
create table if not exists public.inbox_reels (
  code text primary key, -- Instagram shortcode, e.g. DeYM7LqP60b
  url text not null,
  caption text not null default '',
  owner text not null default '',
  location text not null default '',
  duration real,
  transcript text not null default '',
  note jsonb, -- the AI's note: kind, short line, places (with their Amap match), tips
  status text not null default 'pending' check (status in ('pending', 'working', 'done', 'failed')),
  attempts integer not null default 0,
  error text not null default '',
  usage jsonb, -- tokens, frames and timings, to watch the cost
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.inbox_reel_shares (
  message_id text primary key references public.inbox_messages(id) on delete cascade,
  peer_id text not null references public.inbox_conversations(peer_id) on delete cascade,
  code text not null references public.inbox_reels(code) on delete cascade,
  shared_at timestamptz not null
);
create index if not exists inbox_reel_shares_peer_idx on public.inbox_reel_shares(peer_id, shared_at);
create index if not exists inbox_reels_status_idx on public.inbox_reels(status) where status <> 'done';
alter table public.inbox_reels enable row level security;
alter table public.inbox_reel_shares enable row level security;
revoke all on public.inbox_reels, public.inbox_reel_shares from public, anon, authenticated;
grant all on public.inbox_reels, public.inbox_reel_shares to service_role;
commit;
