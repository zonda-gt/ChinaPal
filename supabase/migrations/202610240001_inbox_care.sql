-- Care tab: reminders for travellers close to and during their trip.
-- The reminders themselves are worked out from the trip plan; this table keeps
-- each reminder's status ("status" rows) and appointments the team adds ("event" rows).
begin;
create table if not exists public.inbox_care (
  peer_id text not null references public.inbox_conversations(peer_id) on delete cascade,
  key text not null,
  kind text not null check (kind in ('status', 'event')),
  status text not null default 'todo' check (status in ('todo', 'drafted', 'sent', 'skipped')),
  date text not null default '',
  time text not null default '',
  title text not null default '',
  detail text not null default '',
  draft_id uuid,
  updated_by text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (peer_id, key)
);
alter table public.inbox_care enable row level security;
revoke all on public.inbox_care from public, anon, authenticated;
grant all on public.inbox_care to service_role;
commit;
