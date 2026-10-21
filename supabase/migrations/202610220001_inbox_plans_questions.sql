-- Trip plans and the questions list for the redesigned inbox.
-- inbox_questions: what we still need to ask the traveller or check ourselves,
-- found by the trip brief, the trip plan or added by the team.
-- inbox_plans: the AI's researched day-by-day plan, one per conversation.
begin;
create table if not exists public.inbox_questions (
  id uuid primary key default gen_random_uuid(),
  peer_id text not null references public.inbox_conversations(peer_id) on delete cascade,
  text text not null,
  why text not null default '',
  owner text not null check (owner in ('customer', 'team')),
  urgent boolean not null default false,
  source text not null check (source in ('brief', 'plan', 'team')),
  status text not null default 'open' check (status in ('open', 'asked', 'answered', 'dismissed')),
  include boolean not null default false,
  answer text not null default '',
  draft_id uuid,
  created_by text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists inbox_questions_peer_idx on public.inbox_questions(peer_id, created_at);
alter table public.inbox_questions enable row level security;
revoke all on public.inbox_questions from public, anon, authenticated;
grant all on public.inbox_questions to service_role;

create table if not exists public.inbox_plans (
  peer_id text primary key references public.inbox_conversations(peer_id) on delete cascade,
  plan jsonb,
  status text not null default 'idle' check (status in ('idle', 'running', 'failed')),
  job text,
  instruction text not null default '',
  error text not null default '',
  model text,
  usage jsonb,
  started_by text not null default '',
  started_at timestamptz,
  generated_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.inbox_plans enable row level security;
revoke all on public.inbox_plans from public, anon, authenticated;
grant all on public.inbox_plans to service_role;
commit;
