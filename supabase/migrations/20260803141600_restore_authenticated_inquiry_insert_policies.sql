drop policy if exists "Anyone can submit a partner inquiry" on public.partner_inquiries;
create policy "Anyone can submit a partner inquiry"
  on public.partner_inquiries
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Anyone can submit partnership inquiry" on public.partnership_inquiries;
create policy "Anyone can submit partnership inquiry"
  on public.partnership_inquiries
  for insert
  to anon, authenticated
  with check (true);
