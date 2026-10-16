-- Durable intake only. A later inbox processor will normalize messages by mid
-- and create drafts. This table does not trigger AI calls or outgoing messages.
begin;

create table if not exists public.instagram_webhook_deliveries (
  delivery_hash text primary key check (delivery_hash ~ '^[0-9a-f]{64}$'),
  account_id text not null,
  payload jsonb not null,
  received_at timestamptz not null default now()
);

create index if not exists instagram_webhook_deliveries_received_at_idx
  on public.instagram_webhook_deliveries (received_at);

alter table public.instagram_webhook_deliveries enable row level security;
revoke all on table public.instagram_webhook_deliveries from public, anon, authenticated;
grant select, insert on table public.instagram_webhook_deliveries to service_role;

comment on table public.instagram_webhook_deliveries is
  'Private Instagram webhook deliveries; server-only access. Exact delivery retries are deduplicated by hash. Contains customer data.';

commit;
