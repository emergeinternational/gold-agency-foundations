-- Phase 1/2/5: Additive schema only. No drops, no renames.

-- 1. Submissions: add Telegram + segmentation columns (idempotent)
alter table public.submissions
  add column if not exists telegram_chat_id text,
  add column if not exists application_mode text,
  add column if not exists candidate_outcome text,
  add column if not exists priority_tier text default 'standard',
  add column if not exists tags text[];

create index if not exists idx_submissions_telegram_chat_id
  on public.submissions(telegram_chat_id)
  where telegram_chat_id is not null;

create index if not exists idx_submissions_application_mode
  on public.submissions(application_mode);

-- 2. submission_messages table for two-way Telegram comms
create table if not exists public.submission_messages (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references public.submissions(id) on delete cascade,
  telegram_chat_id text,
  direction text not null check (direction in ('inbound','outbound')),
  message_type text,
  content text,
  file_url text,
  telegram_message_id text,
  template_key text,
  sent_by_admin_id uuid,
  delivery_status text,
  reviewed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_submission_messages_submission_id
  on public.submission_messages(submission_id);

create index if not exists idx_submission_messages_created_at
  on public.submission_messages(created_at desc);

create index if not exists idx_submission_messages_unreviewed
  on public.submission_messages(submission_id)
  where reviewed = false and direction = 'inbound';

alter table public.submission_messages enable row level security;

-- Drop & re-create policies idempotently
drop policy if exists "privileged_select_submission_messages" on public.submission_messages;
drop policy if exists "privileged_insert_submission_messages" on public.submission_messages;
drop policy if exists "privileged_update_submission_messages" on public.submission_messages;
drop policy if exists "privileged_delete_submission_messages" on public.submission_messages;

create policy "privileged_select_submission_messages"
  on public.submission_messages
  for select
  to authenticated
  using (public.is_privileged_user());

create policy "privileged_insert_submission_messages"
  on public.submission_messages
  for insert
  to authenticated
  with check (public.is_privileged_user());

create policy "privileged_update_submission_messages"
  on public.submission_messages
  for update
  to authenticated
  using (public.is_privileged_user())
  with check (public.is_privileged_user());

create policy "privileged_delete_submission_messages"
  on public.submission_messages
  for delete
  to authenticated
  using (public.is_privileged_user());
-- (service_role bypasses RLS automatically; used by edge functions for inbound capture.)
