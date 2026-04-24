import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface RequireAdminProps {
  children: JSX.Element;
}

/**
 * Gate around all /admin/* pages.
 * Verifies an authenticated session AND that the user passes
 * the existing public.is_privileged_user() RPC (admin / superadmin / founder).
 */
export default function RequireAdmin({ children }: RequireAdminProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isPrivileged, setIsPrivileged] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const check = async (nextSession: Session | null) => {
      if (!mounted) return;
      setSession(nextSession);
      if (!nextSession) {
        setIsPrivileged(false);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.rpc("is_privileged_user");
      if (!mounted) return;
      if (error) {
        console.error("is_privileged_user check failed:", error);
        setIsPrivileged(false);
      } else {
        setIsPrivileged(!!data);
      }
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => check(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setLoading(true);
      check(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 sm:p-10">
        <p className="text-sm text-muted-foreground">Verifying admin access…</p>
      </div>
    );
  }

  if (!session) {
    const redirectTo = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/sign-in?redirect=${redirectTo}`} replace />;
  }

  if (!isPrivileged) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="font-display text-2xl text-foreground">Restricted area</h1>
          <p className="text-sm text-muted-foreground">
            Your account does not have admin access. If you believe this is an error, contact the team.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
