ALTER TABLE public.banner_messages
  ADD COLUMN starts_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN ends_at TIMESTAMP WITH TIME ZONE;

-- Replace the public SELECT policy to enforce schedule window
DROP POLICY IF EXISTS "Active banner messages are viewable by everyone" ON public.banner_messages;

CREATE POLICY "Active scheduled banner messages are viewable by everyone"
ON public.banner_messages
FOR SELECT
USING (
  public.is_privileged_user()
  OR (
    is_active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at IS NULL OR ends_at > now())
  )
);

CREATE INDEX IF NOT EXISTS idx_banner_messages_schedule
  ON public.banner_messages (is_active, starts_at, ends_at);