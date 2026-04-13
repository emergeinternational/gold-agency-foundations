import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface RequireAuthProps {
  children: JSX.Element;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 sm:p-10">
        <p className="text-sm text-muted-foreground">Checking authentication…</p>
      </div>
    );
  }

  if (!session) {
    const redirectTo = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/sign-in?redirect=${redirectTo}`} replace />;
  }

  return children;
}
