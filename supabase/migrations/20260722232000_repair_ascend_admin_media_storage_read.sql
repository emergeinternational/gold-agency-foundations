-- Repair private Ascend applicant media previews for authenticated admins.
-- Storage signing was rejecting the helper-based policy path. Keep the bucket
-- private and use an explicit role check for this one bucket.

begin;

drop policy if exists "Privileged users can read Ascend applicant media" on storage.objects;
drop policy if exists "Privileged users can manage Ascend applicant media" on storage.objects;

create policy "Privileged users can read Ascend applicant media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'ascend-applicant-media'
  and exists (
    select 1
    from public.user_roles ur
    where ur.user_id::text = auth.uid()::text
      and ur.role in ('admin', 'superadmin', 'founder')
  )
);

create policy "Privileged users can manage Ascend applicant media"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'ascend-applicant-media'
  and exists (
    select 1
    from public.user_roles ur
    where ur.user_id::text = auth.uid()::text
      and ur.role in ('admin', 'superadmin', 'founder')
  )
)
with check (
  bucket_id = 'ascend-applicant-media'
  and exists (
    select 1
    from public.user_roles ur
    where ur.user_id::text = auth.uid()::text
      and ur.role in ('admin', 'superadmin', 'founder')
  )
);

commit;
