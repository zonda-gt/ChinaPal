-- Reply assistant V2: multi-message drafts, staff facts and a generation log.
-- Additive and safe to reapply. Apply before deploying the V2 inbox code.
begin;
-- Follow-up messages queued after the draft body; each becomes the next draft once
-- the previous message is sent. Staff facts are what the team verified or did.
alter table public.inbox_drafts add column if not exists parts jsonb not null default '[]';
alter table public.inbox_drafts add column if not exists staff_facts text not null default '';
alter table public.inbox_drafts add column if not exists generation_id uuid;

-- One row per AI generation, kept even after the draft is edited or sent, so drafts
-- can later be compared with what staff actually sent.
create table if not exists public.inbox_ai_generations (
  id uuid primary key default gen_random_uuid(),
  peer_id text not null references public.inbox_conversations(peer_id) on delete cascade,
  draft_id uuid,
  prompt_version text not null,
  model text not null,
  reasoning text not null default '',
  context_id text,
  instruction text not null default '',
  staff_facts text not null default '',
  messages jsonb not null default '[]',
  warnings jsonb not null default '[]',
  usage jsonb not null default '{}',
  latency_ms integer,
  created_by text not null,
  created_at timestamptz not null default now()
);
create index if not exists inbox_ai_generations_peer_idx on public.inbox_ai_generations(peer_id, created_at desc);
create index if not exists inbox_ai_generations_draft_idx on public.inbox_ai_generations(draft_id);

-- Server-only access, matching the other inbox tables.
alter table public.inbox_ai_generations enable row level security;
revoke all on public.inbox_ai_generations from public, anon, authenticated;
grant all on public.inbox_ai_generations to service_role;
commit;
