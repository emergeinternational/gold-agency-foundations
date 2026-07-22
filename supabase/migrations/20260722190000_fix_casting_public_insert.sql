-- Fix anonymous public casting submissions without exposing applicant PII.
-- Safe to run repeatedly.

begin;

-- PostgREST requires table privileges in addition to RLS policies.
grant usage on schema public to anon, authenticated, service_role;
grant insert on table public.casting_submissions to anon;
grant select, insert, update on table public.casting_submissions to authenticated;
grant all privileges on table public.casting_submissions to service_role;

alter table public.casting_submissions enable row level security;

-- Remove the previously broken public insert policy, regardless of whether it exists.
drop policy if exists "Public can insert casting submissions" on public.casting_submissions;
drop policy if exists "Anyone can insert casting submissions" on public.casting_submissions;
drop policy if exists "Users can insert casting submissions" on public.casting_submissions;

-- Anonymous applicants may only create anonymous rows. Authenticated applicants may
-- only associate a submission with their own account.
create policy "Public can insert casting submissions"
on public.casting_submissions
for insert
to anon, authenticated
with check (
  (auth.uid() is null and user_id is null)
  or
  (auth.uid() is not null and user_id = auth.uid())
);

-- Do not grant anon SELECT. Duplicate checking is intentionally boolean-only.
revoke select on table public.casting_submissions from anon;

create or replace function public.check_casting_duplicate(
  _phone text,
  _handle text default null
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.casting_submissions cs
    where
      nullif(regexp_replace(coalesce(_phone, ''), '[^0-9+]', '', 'g'), '') is not null
      and regexp_replace(coalesce(cs.phone, ''), '[^0-9+]', '', 'g') =
          regexp_replace(coalesce(_phone, ''), '[^0-9+]', '', 'g')
  )
  or (
    nullif(lower(trim(coalesce(_handle, ''))), '') is not null
    and exists (
      select 1
      from public.casting_submissions cs
      where lower(trim(coalesce(cs.messaging_handle, ''))) = lower(trim(_handle))
         or lower(trim(coalesce(cs.instagram, ''))) = lower(trim(_handle))
         or lower(trim(coalesce(cs.tiktok, ''))) = lower(trim(_handle))
    )
  );
$$;

revoke all on function public.check_casting_duplicate(text, text) from public;
grant execute on function public.check_casting_duplicate(text, text) to anon, authenticated, service_role;

comment on function public.check_casting_duplicate(text, text) is
'Returns only whether a casting submission already exists for the normalized phone or supplied social/messaging handle. Does not expose applicant records.';

commit;
