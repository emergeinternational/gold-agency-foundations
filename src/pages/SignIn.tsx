import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const redirect = new URLSearchParams(location.search).get("redirect") || "/admin/review";

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Signed in",
      description: "You are now authenticated.",
    });
    navigate(redirect, { replace: true });
    setLoading(false);
  };

  if (session) {
    return <Navigate to={redirect} replace />;
  }

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-narrow max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Use your email and password to access protected pages.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
              <p className="text-sm text-muted-foreground mt-4">
                No account yet?{" "}
                <Link to={`/sign-up?redirect=${encodeURIComponent(redirect)}`} className="text-primary hover:underline">
                  Create one
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
