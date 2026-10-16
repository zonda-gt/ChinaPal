begin;
create table if not exists public.inbox_sessions (
  token_hash text primary key, password_version text not null, expires_at timestamptz not null
);
create table if not exists public.inbox_conversations (
  peer_id text primary key, thread_id text, username text not null,
  stage text not null default 'inquiry' check(stage in ('inquiry','customer','archived')),
  notes text not null default '', last_message_at timestamptz, last_seen_at timestamptz,
  history_cursor text, history_complete boolean not null default false, synced_at timestamptz,
  sending_draft_id uuid
);
create table if not exists public.inbox_messages (
  id text primary key, peer_id text not null references public.inbox_conversations(peer_id) on delete cascade,
  direction text not null check(direction in ('inbound','outbound')), sent_at timestamptz not null,
  text text not null default '', attachments jsonb not null default '[]',
  deleted boolean not null default false, unavailable boolean not null default false
);
create index if not exists inbox_messages_thread_idx on public.inbox_messages(peer_id,sent_at desc,id desc);
create table if not exists public.inbox_drafts (
  id uuid primary key default gen_random_uuid(), peer_id text not null references public.inbox_conversations(peer_id) on delete cascade,
  body text not null, version integer not null default 1, context_id text,
  status text not null default 'draft' check(status in ('draft','sending','sent','failed','unknown')),
  warnings jsonb not null default '[]', edited_by text not null, updated_at timestamptz not null default now(),
  sent_message_id text
);
create unique index if not exists inbox_one_open_draft on public.inbox_drafts(peer_id) where status='draft';
create index if not exists inbox_drafts_thread_idx on public.inbox_drafts(peer_id,updated_at desc);
create table if not exists public.inbox_operations (
  key text primary key, until_at timestamptz not null
);
-- Lease for bounded sync/AI operations; never used to automatically retry a send.
create or replace function public.inbox_take_lease(p_key text,p_seconds integer) returns boolean
language plpgsql security definer set search_path=public as $$
begin
 insert into inbox_operations(key,until_at) values(p_key,now()+make_interval(secs=>p_seconds))
 on conflict(key) do update set until_at=excluded.until_at where inbox_operations.until_at<now();
 return found;
end; $$;
create or replace function public.inbox_store_message(p_message jsonb) returns void
language plpgsql security definer set search_path=public as $$
begin
 perform 1 from inbox_conversations where peer_id=p_message->>'peer_id' for update;
 insert into inbox_messages(id,peer_id,direction,sent_at,text,attachments,deleted,unavailable)
 values(p_message->>'id',p_message->>'peer_id',p_message->>'direction',(p_message->>'sent_at')::timestamptz,
 coalesce(p_message->>'text',''),coalesce(p_message->'attachments','[]'),coalesce((p_message->>'deleted')::boolean,false),coalesce((p_message->>'unavailable')::boolean,false))
 on conflict(id) do update set
 deleted=inbox_messages.deleted or excluded.deleted,
 text=case when inbox_messages.deleted or excluded.deleted then '' when excluded.text<>'' then excluded.text else inbox_messages.text end,
 attachments=case when inbox_messages.deleted or excluded.deleted then '[]'::jsonb when jsonb_array_length(excluded.attachments)>0 then excluded.attachments else inbox_messages.attachments end,
 unavailable=excluded.unavailable and inbox_messages.unavailable;
 update inbox_conversations set last_message_at=greatest(last_message_at,(p_message->>'sent_at')::timestamptz) where peer_id=p_message->>'peer_id';
end; $$;
create or replace function public.inbox_claim_send(p_id uuid,p_version integer,p_email text) returns public.inbox_drafts
language plpgsql security definer set search_path=public as $$
declare d inbox_drafts; c inbox_conversations; latest text; inbound timestamptz;
begin
 select * into d from inbox_drafts where id=p_id;
 if not found then raise exception 'Draft not found'; end if;
 select * into c from inbox_conversations where peer_id=d.peer_id for update;
 select * into d from inbox_drafts where id=p_id for update;
 if c.sending_draft_id is not null then raise exception 'A send is already pending. Check Instagram before sending again.'; end if;
 if d.status<>'draft' or d.version<>p_version then raise exception 'Draft changed. Reload and review before sending.'; end if;
 select id into latest from inbox_messages where peer_id=d.peer_id order by sent_at desc,id desc limit 1;
 if latest is distinct from d.context_id then raise exception 'Conversation changed. Review the new messages and save your reply again.'; end if;
 select max(sent_at) into inbound from inbox_messages where peer_id=d.peer_id and direction='inbound' and not deleted;
 if inbound is null or inbound <= now()-interval '24 hours' or inbound > now() then raise exception 'Instagram reply window has closed. Reply in Instagram.'; end if;
 update inbox_drafts set status='sending',edited_by=p_email,updated_at=now() where id=p_id returning * into d;
 update inbox_conversations set sending_draft_id=p_id where peer_id=d.peer_id;
 return d;
end; $$;
create or replace function public.inbox_resolve_send(p_peer text,p_id uuid,p_sent boolean,p_email text) returns void
language plpgsql security definer set search_path=public as $$
declare c inbox_conversations; d inbox_drafts;
begin
 select * into c from inbox_conversations where peer_id=p_peer for update;
 select * into d from inbox_drafts where id=p_id and peer_id=p_peer for update;
 if c.sending_draft_id is distinct from p_id or d.id is null then raise exception 'Pending reply changed. Refresh first.'; end if;
 if d.updated_at > now()-interval '2 minutes' then raise exception 'The send may still be running. Wait two minutes before resolving it.'; end if;
 if d.status not in ('sending','unknown','sent') then raise exception 'Reply status changed. Refresh first.'; end if;
 -- A confirmed API send can never be changed to failed by a browser resolution.
 if d.status='sent' and not p_sent then raise exception 'Instagram already confirmed this reply was sent.'; end if;
 update inbox_drafts set status=case when p_sent then 'sent' else 'failed' end,
 edited_by=p_email,updated_at=now(),warnings='["Delivery manually checked in Instagram."]'::jsonb where id=p_id;
 update inbox_conversations set sending_draft_id=null where peer_id=p_peer;
end; $$;
-- All customer records are accessed through authenticated server routes only.
alter table inbox_sessions enable row level security;
alter table inbox_conversations enable row level security;
alter table inbox_messages enable row level security;
alter table inbox_drafts enable row level security;
alter table inbox_operations enable row level security;
revoke all on inbox_sessions,inbox_conversations,inbox_messages,inbox_drafts,inbox_operations from public,anon,authenticated;
grant all on inbox_sessions,inbox_conversations,inbox_messages,inbox_drafts,inbox_operations to service_role;
revoke all on function inbox_take_lease(text,integer),inbox_store_message(jsonb),inbox_claim_send(uuid,integer,text),inbox_resolve_send(text,uuid,boolean,text) from public,anon,authenticated;
grant execute on function inbox_take_lease(text,integer),inbox_store_message(jsonb),inbox_claim_send(uuid,integer,text),inbox_resolve_send(text,uuid,boolean,text) to service_role;
commit;
