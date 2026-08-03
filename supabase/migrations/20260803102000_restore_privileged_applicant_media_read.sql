drop policy if exists "Privileged users can read Ascend applicant media" on storage.objects;

create policy "Privileged users can read Ascend applicant media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'ascend-applicant-media'
  and public.is_privileged_user()
);
