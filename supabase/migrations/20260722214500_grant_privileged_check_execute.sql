-- Allow RLS policies and explicit RPC checks to evaluate the boolean privilege
-- helper for public/authenticated requests without exposing protected rows.

grant execute on function public.is_privileged_user() to anon, authenticated, service_role;
