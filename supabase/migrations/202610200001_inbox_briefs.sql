-- Trip brief for the redesigned inbox: the AI brief plus the team's corrections.
begin;
create table if not exists public.inbox_briefs (
  peer_id text primary key references public.inbox_conversations(peer_id) on delete cascade,
  brief jsonb,
  edits jsonb not null default '[]'::jsonb,
  model text,
  usage jsonb,
  fingerprint text,
  generated_at timestamptz,
  coverage jsonb,
  updated_at timestamptz not null default now()
);
alter table public.inbox_briefs enable row level security;
revoke all on public.inbox_briefs from public, anon, authenticated;
grant all on public.inbox_briefs to service_role;
commit;
