ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS evaluation_scores JSONB NOT NULL DEFAULT '{}'::jsonb;
