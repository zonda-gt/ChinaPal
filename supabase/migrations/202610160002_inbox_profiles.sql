-- Apply when the local travel-profile preview is approved for production.
begin;
create table if not exists public.inbox_profiles (
  peer_id text primary key references public.inbox_conversations(peer_id) on delete cascade,
  profile jsonb not null,
  model text not null,
  usage jsonb not null,
  fingerprint text not null,
  generated_at timestamptz not null,
  coverage jsonb not null
);
alter table public.inbox_profiles enable row level security;
revoke all on public.inbox_profiles from public, anon, authenticated;
grant all on public.inbox_profiles to service_role;
commit;
