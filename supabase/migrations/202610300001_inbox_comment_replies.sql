-- Comment replies (the /comment page): when someone comments a keyword on one
-- of our posts or reels, we DM them a set message and reply under the comment.
-- inbox_comment_rules: keyword → messages, for one post (media_id) or all (null).
-- inbox_comment_replies: each matching comment, once, and what was sent.
begin;
create table if not exists public.inbox_comment_rules (
  id uuid primary key default gen_random_uuid(),
  media_id text, -- Instagram media ID; null = every post and reel
  keyword text not null check (keyword <> ''), -- stored lower-case, as matched
  message text not null check (message <> ''), -- the private reply (DM)
  public_reply text not null default '', -- the reply under the comment; '' = none
  active boolean not null default true,
  updated_by text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists inbox_comment_rules_key on public.inbox_comment_rules(coalesce(media_id, ''), keyword);
create table if not exists public.inbox_comment_replies (
  comment_id text primary key,
  media_id text not null,
  rule_id uuid references public.inbox_comment_rules(id) on delete set null,
  commenter_id text not null,
  username text not null default '',
  comment text not null default '',
  commented_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'failed', 'skipped')),
  dm_sent_at timestamptz,
  public_sent_at timestamptz,
  attempts integer not null default 0,
  error text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists inbox_comment_replies_recent_idx on public.inbox_comment_replies(created_at desc);
create index if not exists inbox_comment_replies_open_idx on public.inbox_comment_replies(status) where status in ('pending', 'sending');
alter table public.inbox_comment_rules enable row level security;
alter table public.inbox_comment_replies enable row level security;
revoke all on public.inbox_comment_rules, public.inbox_comment_replies from public, anon, authenticated;
grant all on public.inbox_comment_rules, public.inbox_comment_replies to service_role;
commit;
