-- One-off WhatsApp link. Staff set whatsapp_id by hand on one Instagram
-- conversation; that chat then also receives and can send WhatsApp messages.
-- Every other conversation keeps working exactly as before.
begin;
alter table public.inbox_conversations add column if not exists whatsapp_id text unique
  check (whatsapp_id ~ '^[0-9]{6,20}$');
alter table public.inbox_messages add column if not exists channel text not null default 'instagram'
  check (channel in ('instagram','whatsapp'));
alter table public.inbox_drafts add column if not exists channel text
  check (channel in ('instagram','whatsapp'));

create or replace function public.inbox_store_message(p_message jsonb) returns void
language plpgsql security definer set search_path=public as $$
begin
 perform 1 from inbox_conversations where peer_id=p_message->>'peer_id' for update;
 insert into inbox_messages(id,peer_id,direction,sent_at,text,attachments,deleted,unavailable,channel)
 values(p_message->>'id',p_message->>'peer_id',p_message->>'direction',(p_message->>'sent_at')::timestamptz,
 coalesce(p_message->>'text',''),coalesce(p_message->'attachments','[]'),coalesce((p_message->>'deleted')::boolean,false),coalesce((p_message->>'unavailable')::boolean,false),
 coalesce(p_message->>'channel','instagram'))
 on conflict(id) do update set
 deleted=inbox_messages.deleted or excluded.deleted,
 text=case when inbox_messages.deleted or excluded.deleted then '' when excluded.text<>'' then excluded.text else inbox_messages.text end,
 attachments=case when inbox_messages.deleted or excluded.deleted then '[]'::jsonb when jsonb_array_length(excluded.attachments)>0 then excluded.attachments else inbox_messages.attachments end,
 unavailable=excluded.unavailable and inbox_messages.unavailable;
 update inbox_conversations set last_message_at=greatest(last_message_at,(p_message->>'sent_at')::timestamptz) where peer_id=p_message->>'peer_id';
end; $$;

-- Each channel has its own 24-hour window: a WhatsApp message must not open
-- Instagram sending, and the reverse. The old three-argument version is
-- replaced so calls without p_channel stay unambiguous (Instagram).
drop function if exists public.inbox_claim_send(uuid,integer,text);
create or replace function public.inbox_claim_send(p_id uuid,p_version integer,p_email text,p_channel text default 'instagram') returns public.inbox_drafts
language plpgsql security definer set search_path=public as $$
declare d inbox_drafts; c inbox_conversations; latest text; inbound timestamptz;
begin
 if p_channel not in ('instagram','whatsapp') then raise exception 'Unknown channel.'; end if;
 select * into d from inbox_drafts where id=p_id;
 if not found then raise exception 'Draft not found'; end if;
 select * into c from inbox_conversations where peer_id=d.peer_id for update;
 select * into d from inbox_drafts where id=p_id for update;
 if p_channel='whatsapp' and c.whatsapp_id is null then raise exception 'This chat is not linked to WhatsApp.'; end if;
 if c.sending_draft_id is not null then raise exception 'A send is already pending. Check the chat app before sending again.'; end if;
 if d.status<>'draft' or d.version<>p_version then raise exception 'Draft changed. Reload and review before sending.'; end if;
 select id into latest from inbox_messages where peer_id=d.peer_id order by sent_at desc,id desc limit 1;
 if latest is distinct from d.context_id then raise exception 'Conversation changed. Review the new messages and save your reply again.'; end if;
 select max(sent_at) into inbound from inbox_messages where peer_id=d.peer_id and direction='inbound' and not deleted and channel=p_channel;
 if inbound is null or inbound <= now()-interval '24 hours' or inbound > now() then
  if p_channel='whatsapp' then raise exception 'WhatsApp reply window has closed. Reply in WhatsApp.'; end if;
  raise exception 'Instagram reply window has closed. Reply in Instagram.';
 end if;
 update inbox_drafts set status='sending',channel=p_channel,edited_by=p_email,updated_at=now() where id=p_id returning * into d;
 update inbox_conversations set sending_draft_id=p_id where peer_id=d.peer_id;
 return d;
end; $$;
revoke all on function inbox_store_message(jsonb),inbox_claim_send(uuid,integer,text,text) from public,anon,authenticated;
grant execute on function inbox_store_message(jsonb),inbox_claim_send(uuid,integer,text,text) to service_role;
commit;
