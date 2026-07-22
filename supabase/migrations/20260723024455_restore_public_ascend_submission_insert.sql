-- Restore public Ascend talent submission inserts without exposing applicant data.
-- The live public form writes to public.submissions as anon, then links media
-- metadata and prequalification results to the generated submission id.

grant insert on table public.submissions to anon, authenticated;
grant select, update on table public.submissions to authenticated;
grant all privileges on table public.submissions to service_role;

alter table public.submissions enable row level security;

drop policy if exists "Anyone can submit" on public.submissions;
drop policy if exists "Public can insert submissions" on public.submissions;
drop policy if exists "Public can insert Ascend submissions" on public.submissions;
drop policy if exists "Authenticated users can insert Ascend submissions" on public.submissions;

create policy "Public can insert Ascend submissions"
on public.submissions
for insert
to anon
with check (
  status = 'new'
  and source in ('ascend', 'emerge')
  and full_name is not null
  and email is not null
  and (application_mode is null or application_mode in (
    'casting',
    'representation',
    'media_opportunity',
    'brand_campaign',
    'training_development',
    'general'
  ))
  and assignee is null
  and level is null
  and next_action is null
  and candidate_outcome is null
  and (priority_tier is null or priority_tier = 'standard')
  and tags is null
  and telegram_chat_id is null
  and (
    (
      is_minor = false
      and parent_guardian_consent = false
      and parent_guardian_authorization_acknowledgment = false
      and parent_guardian_full_name is null
      and parent_guardian_relationship is null
      and parent_guardian_email is null
      and parent_guardian_phone is null
    )
    or
    (
      is_minor = true
      and parent_guardian_consent = true
      and parent_guardian_authorization_acknowledgment = true
      and parent_guardian_full_name is not null
      and parent_guardian_relationship is not null
      and parent_guardian_email is not null
      and parent_guardian_phone is not null
    )
  )
);

create policy "Authenticated users can insert Ascend submissions"
on public.submissions
for insert
to authenticated
with check (
  status = 'new'
  and source in ('ascend', 'emerge')
  and full_name is not null
  and email is not null
  and (application_mode is null or application_mode in (
    'casting',
    'representation',
    'media_opportunity',
    'brand_campaign',
    'training_development',
    'general'
  ))
  and assignee is null
  and level is null
  and next_action is null
  and candidate_outcome is null
  and (priority_tier is null or priority_tier = 'standard')
  and tags is null
  and (
    (
      is_minor = false
      and parent_guardian_consent = false
      and parent_guardian_authorization_acknowledgment = false
      and parent_guardian_full_name is null
      and parent_guardian_relationship is null
      and parent_guardian_email is null
      and parent_guardian_phone is null
    )
    or
    (
      is_minor = true
      and parent_guardian_consent = true
      and parent_guardian_authorization_acknowledgment = true
      and parent_guardian_full_name is not null
      and parent_guardian_relationship is not null
      and parent_guardian_email is not null
      and parent_guardian_phone is not null
    )
  )
);

revoke select on table public.submissions from anon;
