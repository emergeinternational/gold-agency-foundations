-- Add additive nullable guardian/minor fields to submissions for under-18 handling.
-- Existing fields are not modified; all new columns are nullable with safe defaults.
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS applicant_age integer,
  ADD COLUMN IF NOT EXISTS is_minor boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS parent_guardian_full_name text,
  ADD COLUMN IF NOT EXISTS parent_guardian_relationship text,
  ADD COLUMN IF NOT EXISTS parent_guardian_email text,
  ADD COLUMN IF NOT EXISTS parent_guardian_phone text,
  ADD COLUMN IF NOT EXISTS parent_guardian_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS parent_guardian_authorization_acknowledgment boolean NOT NULL DEFAULT false;