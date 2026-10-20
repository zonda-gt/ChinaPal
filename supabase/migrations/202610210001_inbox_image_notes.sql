-- Image notes: each chat image described once in words, reused by drafts,
-- trip briefs and the trip assistant.
begin;
create table if not exists public.inbox_image_notes (
  message_id text not null references public.inbox_messages(id) on delete cascade,
  idx integer not null,
  peer_id text not null references public.inbox_conversations(peer_id) on delete cascade,
  note text not null,
  model text not null,
  version text not null,
  created_at timestamptz not null default now(),
  primary key (message_id, idx)
);
create index if not exists inbox_image_notes_peer_idx on public.inbox_image_notes(peer_id);
alter table public.inbox_image_notes enable row level security;
revoke all on public.inbox_image_notes from public, anon, authenticated;
grant all on public.inbox_image_notes to service_role;
commit;
