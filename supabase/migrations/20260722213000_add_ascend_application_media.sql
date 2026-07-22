-- Add private applicant media support for Ascend public submissions.
-- Safe to run repeatedly.

begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ascend-applicant-media',
  'ascend-applicant-media',
  false,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'video/mp4',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav'
  ]
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.submission_media (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  bucket_id text not null default 'ascend-applicant-media',
  object_path text not null,
  file_name text,
  file_role text not null check (file_role in ('headshot', 'media_kit', 'sample')),
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create index if not exists idx_submission_media_submission_id
  on public.submission_media(submission_id);

alter table public.submission_media enable row level security;

drop policy if exists "Public can insert own submission media metadata" on public.submission_media;
drop policy if exists "Privileged users can read submission media" on public.submission_media;
drop policy if exists "Privileged users can manage submission media" on public.submission_media;

create policy "Public can insert own submission media metadata"
on public.submission_media
for insert
to anon, authenticated
with check (
  bucket_id = 'ascend-applicant-media'
  and object_path like 'submissions/%'
  and submission_id is not null
);

create policy "Privileged users can read submission media"
on public.submission_media
for select
to authenticated
using (public.is_privileged_user());

create policy "Privileged users can manage submission media"
on public.submission_media
for all
to authenticated
using (public.is_privileged_user())
with check (public.is_privileged_user());

grant insert on table public.submission_media to anon;
grant select, insert, update, delete on table public.submission_media to authenticated;
grant all privileges on table public.submission_media to service_role;

drop policy if exists "Public can upload Ascend applicant media" on storage.objects;
drop policy if exists "Privileged users can read Ascend applicant media" on storage.objects;
drop policy if exists "Privileged users can manage Ascend applicant media" on storage.objects;

create policy "Public can upload Ascend applicant media"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'ascend-applicant-media'
  and name like 'submissions/%'
);

create policy "Privileged users can read Ascend applicant media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'ascend-applicant-media'
  and public.is_privileged_user()
);

create policy "Privileged users can manage Ascend applicant media"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'ascend-applicant-media'
  and public.is_privileged_user()
)
with check (
  bucket_id = 'ascend-applicant-media'
  and public.is_privileged_user()
);

commit;
