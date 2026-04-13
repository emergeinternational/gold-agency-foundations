ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS emerge_ready boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.set_submission_emerge_ready()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  avg_score numeric;
BEGIN
  SELECT AVG(value::numeric)
  INTO avg_score
  FROM jsonb_each_text(COALESCE(NEW.evaluation_scores, '{}'::jsonb)) AS score(key, value)
  WHERE value ~ '^[0-9]+(\.[0-9]+)?$'
    AND (value::numeric) >= 1
    AND (value::numeric) <= 5;

  NEW.emerge_ready := (
    NEW.status = 'approved'
    AND NEW.level IN ('advanced', 'elite')
    AND avg_score IS NOT NULL
    AND avg_score >= 3.8
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_submission_emerge_ready ON public.submissions;

CREATE TRIGGER trg_set_submission_emerge_ready
BEFORE INSERT OR UPDATE OF status, level, evaluation_scores
ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.set_submission_emerge_ready();

UPDATE public.submissions
SET emerge_ready = (
  status = 'approved'
  AND level IN ('advanced', 'elite')
  AND (
    SELECT AVG(value::numeric)
    FROM jsonb_each_text(COALESCE(evaluation_scores, '{}'::jsonb)) AS score(key, value)
    WHERE value ~ '^[0-9]+(\.[0-9]+)?$'
      AND (value::numeric) >= 1
      AND (value::numeric) <= 5
  ) >= 3.8
);
