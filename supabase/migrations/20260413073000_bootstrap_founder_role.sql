-- Ensure the existing role model is present
DO $$
BEGIN
  IF to_regclass('public.user_roles') IS NULL THEN
    RAISE EXCEPTION 'Required table public.user_roles does not exist. Create it before bootstrapping founder access.';
  END IF;
END
$$;

-- One-time bootstrap: allows the currently authenticated user to claim founder
-- only when no roles exist yet in public.user_roles.
CREATE OR REPLACE FUNCTION public.bootstrap_current_user_founder()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();

  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'bootstrap_current_user_founder requires an authenticated user';
  END IF;

  -- If roles already exist, do not allow privilege escalation.
  IF EXISTS (SELECT 1 FROM public.user_roles) THEN
    RETURN EXISTS (
      SELECT 1
      FROM public.user_roles ur
      WHERE ur.user_id::text = current_user_id::text
        AND ur.role = 'founder'
    );
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (current_user_id, 'founder')
  ON CONFLICT DO NOTHING;

  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id::text = current_user_id::text
      AND ur.role = 'founder'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.bootstrap_current_user_founder() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bootstrap_current_user_founder() TO authenticated;
