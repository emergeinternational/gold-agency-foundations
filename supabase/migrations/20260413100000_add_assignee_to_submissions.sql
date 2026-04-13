ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS assignee text;
