import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Submission = {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  category: string | null;
  country: string | null;
  source: string | null;
  status: string | null;
  prequalification_results?: {
    outcome: string | null;
    score: number | null;
    critical_pass: boolean | null;
  }[];
};

export default function AdminReview() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase
        .from("submissions")
        .select("id, created_at, full_name, email, phone, category, country, source, status, prequalification_results(outcome, score, critical_pass)")
        .order("created_at", { ascending: false });

      if (err) {
        setError(err.message);
      } else {
        setRows((data as unknown as Submission[]) ?? []);
      }
      setLoading(false);
    })();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/sign-in", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Submission Review</h1>
          <p className="text-sm text-muted-foreground">Internal — read-only view of all submissions.</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-destructive">Error: {error}</p>}

      {!loading && !error && rows.length === 0 && (
        <p className="text-sm text-muted-foreground">No submissions yet.</p>
      )}

      {!loading && rows.length > 0 && (
        <div className="overflow-x-auto border border-border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left">
              <tr>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">Phone</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Country</th>
                <th className="px-3 py-2 font-medium">Source</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">PQ Outcome</th>
                <th className="px-3 py-2 font-medium">Score</th>
                <th className="px-3 py-2 font-medium">Critical</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const pq = r.prequalification_results?.[0];
                return (
                  <tr key={r.id} className="border-t border-border/60 hover:bg-secondary/30">
                    <td className="px-3 py-2 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-3 py-2">{r.full_name ?? "—"}</td>
                    <td className="px-3 py-2">{r.email ?? "—"}</td>
                    <td className="px-3 py-2">{r.phone ?? "—"}</td>
                    <td className="px-3 py-2">{r.category ?? "—"}</td>
                    <td className="px-3 py-2">{r.country ?? "—"}</td>
                    <td className="px-3 py-2">{r.source ?? "—"}</td>
                    <td className="px-3 py-2">{r.status ?? "—"}</td>
                    <td className="px-3 py-2">{pq?.outcome ?? "—"}</td>
                    <td className="px-3 py-2">{pq?.score ?? "—"}</td>
                    <td className="px-3 py-2">{pq?.critical_pass === true ? "✓" : pq?.critical_pass === false ? "✗" : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
