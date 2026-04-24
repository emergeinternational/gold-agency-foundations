alter table public.submissions
  add column if not exists application_mode text,
  add column if not exists state_region text,
  add column if not exists market text,
  add column if not exists additional_skills text[] ,
  add column if not exists candidate_outcome text,
  add column if not exists priority_tier text not null default 'standard',
  add column if not exists tags text[];

alter table public.submissions
  drop constraint if exists submissions_application_mode_check;

alter table public.submissions
  add constraint submissions_application_mode_check
  check (
    application_mode is null
    or application_mode in (
      'casting',
      'representation',
      'training_development',
      'general_database',
      'brand_campaign',
      'media_opportunity'
    )
  );

alter table public.submissions
  drop constraint if exists submissions_candidate_outcome_check;

alter table public.submissions
  add constraint submissions_candidate_outcome_check
  check (
    candidate_outcome is null
    or candidate_outcome in (
      'connected',
      'under_review',
      'needs_more_info',
      'invited_to_next_step',
      'selected_for_casting',
      'not_selected_current_opportunity',
      'saved_for_future_opportunities',
      'recommended_for_training',
      'scheduled',
      'completed'
    )
  );

alter table public.submissions
  drop constraint if exists submissions_priority_tier_check;

alter table public.submissions
  add constraint submissions_priority_tier_check
  check (priority_tier in ('standard', 'priority', 'high_value'));

create table if not exists public.submission_messages (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  direction text not null check (direction in ('admin_to_candidate', 'candidate_to_admin')),
  message_type text,
  template_key text,
  body text,
  link_url text,
  event_date text,
  event_time text,
  location text,
  contact_phone text,
  media_type text,
  media_url text,
  telegram_file_id text,
  telegram_message_id text,
  sent_by_admin_id uuid,
  delivery_status text,
  review_status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.submission_messages enable row level security;

create policy "Admins can read submission messages"
  on public.submission_messages
  for select
  using (public.is_privileged_user());

create policy "Admins can insert submission messages"
  on public.submission_messages
  for insert
  with check (public.is_privileged_user());

create policy "Admins can update submission messages"
  on public.submission_messages
  for update
  using (public.is_privileged_user());

create index if not exists idx_submission_messages_submission_created_at
  on public.submission_messages (submission_id, created_at desc);
