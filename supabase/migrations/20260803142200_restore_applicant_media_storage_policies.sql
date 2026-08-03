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
