alter table public.submissions
add column if not exists level text;

alter table public.submissions
drop constraint if exists submissions_level_check;

alter table public.submissions
add constraint submissions_level_check
check (level is null or level in ('beginner', 'intermediate', 'advanced', 'elite'));
