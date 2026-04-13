import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

type ReviewStatus = "new" | "review" | "development" | "approved" | "rejected";

const STATUS_OPTIONS: ReviewStatus[] = ["new", "review", "development", "approved", "rejected"];

type Submission = {
  assignee: string | null;
  id: string;
  created_at: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  category: string | null;
  country: string | null;
  source: string | null;
  status: string | null;
  portfolio_url: string | null;
  sample_url: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  website: string | null;
  prequalification_results?: {
    outcome: string | null;
    score: number | null;
    critical_pass: boolean | null;
  }[];
};

type AdminNote = {
  id: string;
  created_at: string;
  note: string | null;
  submission_id: string | null;
};

const normalizeStatus = (value: string | null): ReviewStatus => {
  if (value && STATUS_OPTIONS.includes(value as ReviewStatus)) {
    return value as ReviewStatus;
  }
  return "new";
};

export default function AdminReview() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [notesBySubmission, setNotesBySubmission] = useState<Record<string, AdminNote[]>>({});
  const [statusDrafts, setStatusDrafts] = useState<Record<string, ReviewStatus>>({});
  const [assigneeDrafts, setAssigneeDrafts] = useState<Record<string, string>>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("ascend");
  const [search, setSearch] = useState("");
  const [savingStatusId, setSavingStatusId] = useState<string | null>(null);
  const [savingAssigneeId, setSavingAssigneeId] = useState<string | null>(null);
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data, error: submissionsError } = await supabase
        .from("submissions")
        .select("id, assignee, created_at, full_name, email, phone, city, category, country, source, status, portfolio_url, sample_url, instagram, tiktok, youtube, website, prequalification_results(outcome, score, critical_pass)")
        .order("created_at", { ascending: false });

      if (submissionsError) {
        setError(submissionsError.message);
        setLoading(false);
        return;
      }

      const submissionRows = (data as Submission[]) ?? [];
      setRows(submissionRows);
      setStatusDrafts(
        submissionRows.reduce<Record<string, ReviewStatus>>((acc, row) => {
          acc[row.id] = normalizeStatus(row.status);
          return acc;
        }, {}),
      );
      setAssigneeDrafts(
        submissionRows.reduce<Record<string, string>>((acc, row) => {
          acc[row.id] = row.assignee ?? "";
          return acc;
        }, {}),
      );

      const ascendSource = [...new Set(submissionRows.map((row) => row.source).filter(Boolean) as string[])].find(
        (option) => option.toLowerCase() === "ascend",
      );
      setFilterSource(ascendSource ?? "all");

      if (submissionRows.length > 0) {
        const ids = submissionRows.map((row) => row.id);
        const { data: notesData, error: notesError } = await supabase
          .from("admin_notes")
          .select("id, created_at, note, submission_id")
          .in("submission_id", ids)
          .order("created_at", { ascending: false });

        if (!notesError && notesData) {
          const grouped = notesData.reduce<Record<string, AdminNote[]>>((acc, note) => {
            if (!note.submission_id) return acc;
            const current = acc[note.submission_id] ?? [];
            acc[note.submission_id] = [...current, note as AdminNote];
            return acc;
          }, {});
          setNotesBySubmission(grouped);
        }
      }

      setLoading(false);
    })();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/sign-in", { replace: true });
  };

  const handleStatusSave = async (submissionId: string) => {
    const status = statusDrafts[submissionId];
    if (!status) return;

    setSavingStatusId(submissionId);
    const { error: updateError } = await supabase
      .from("submissions")
      .update({ status })
      .eq("id", submissionId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setRows((prev) => prev.map((row) => (row.id === submissionId ? { ...row, status } : row)));
    }
    setSavingStatusId(null);
  };

  const handleAddNote = async (submissionId: string) => {
    const note = noteDrafts[submissionId]?.trim();
    if (!note) return;

    setSavingNoteId(submissionId);
    const { data: inserted, error: noteError } = await supabase
      .from("admin_notes")
      .insert({ submission_id: submissionId, note })
      .select("id, created_at, note, submission_id")
      .single();

    if (noteError) {
      setError(noteError.message);
    } else if (inserted) {
      setNotesBySubmission((prev) => ({
        ...prev,
        [submissionId]: [inserted as AdminNote, ...(prev[submissionId] ?? [])],
      }));
      setNoteDrafts((prev) => ({ ...prev, [submissionId]: "" }));
    }
    setSavingNoteId(null);
  };

  const handleAssigneeSave = async (submissionId: string) => {
    const assignee = assigneeDrafts[submissionId]?.trim() || null;
    setSavingAssigneeId(submissionId);
    const { error: updateError } = await supabase
      .from("submissions")
      .update({ assignee })
      .eq("id", submissionId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setRows((prev) => prev.map((row) => (row.id === submissionId ? { ...row, assignee } : row)));
    }
    setSavingAssigneeId(null);
  };

  const renderAge = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Today";
    return `${days}d`;
  };

  const categoryOptions = useMemo(
    () => [...new Set(rows.map((row) => row.category).filter(Boolean) as string[])].sort(),
    [rows],
  );
  const sourceOptions = useMemo(
    () => [...new Set(rows.map((row) => row.source).filter(Boolean) as string[])].sort(),
    [rows],
  );

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const rowStatus = normalizeStatus(row.status);
        const categoryMatch = filterCategory === "all" || row.category === filterCategory;
        const statusMatch = filterStatus === "all" || rowStatus === filterStatus;
        const sourceMatch = filterSource === "all" || row.source === filterSource;
        const searchTerm = search.trim().toLowerCase();
        const searchMatch =
          searchTerm.length === 0 ||
          [row.full_name, row.email, row.phone, row.city, row.category]
            .filter(Boolean)
            .some((value) => value?.toLowerCase().includes(searchTerm));
        return categoryMatch && statusMatch && sourceMatch && searchMatch;
      }),
    [rows, filterCategory, filterStatus, filterSource, search],
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Submission Review</h1>
          <p className="text-sm text-muted-foreground">
            Internal only — founder/admin review workspace. Source is shown prominently to keep Ascend and Emerge separated.
          </p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Filter by category</label>
          <select
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={filterCategory}
            onChange={(event) => setFilterCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Filter by status</label>
          <select
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Filter by source</label>
          <select
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={filterSource}
            onChange={(event) => setFilterSource(event.target.value)}
          >
            <option value="all">All sources</option>
            {sourceOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Search</label>
          <input
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            placeholder="Name, email, phone, city, category"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-destructive">Error: {error}</p>}

      {!loading && !error && filteredRows.length === 0 && (
        <p className="text-sm text-muted-foreground">No submissions for the selected filters.</p>
      )}

      {!loading && filteredRows.length > 0 && (
        <div className="overflow-x-auto border border-border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left">
              <tr>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Age</th>
                <th className="px-3 py-2 font-medium">Source</th>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">Phone</th>
                <th className="px-3 py-2 font-medium">City</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Country</th>
                <th className="px-3 py-2 font-medium">Assignee</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">PQ Outcome</th>
                <th className="px-3 py-2 font-medium">Score</th>
                <th className="px-3 py-2 font-medium">Critical</th>
                <th className="px-3 py-2 font-medium">Evidence</th>
                <th className="px-3 py-2 font-medium">Admin Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const pq = row.prequalification_results?.[0];
                const notes = notesBySubmission[row.id] ?? [];

                return (
                  <tr key={row.id} className="border-t border-border/60 align-top hover:bg-secondary/30">
                    <td className="px-3 py-2 whitespace-nowrap">{new Date(row.created_at).toLocaleDateString()}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-muted-foreground">{renderAge(row.created_at)}</td>
                    <td className="px-3 py-2 font-semibold uppercase tracking-wide">{row.source ?? "—"}</td>
                    <td className="px-3 py-2">{row.full_name ?? "—"}</td>
                    <td className="px-3 py-2">{row.email ?? "—"}</td>
                    <td className="px-3 py-2">{row.phone ?? "—"}</td>
                    <td className="px-3 py-2">{row.city ?? "—"}</td>
                    <td className="px-3 py-2">{row.category ?? "—"}</td>
                    <td className="px-3 py-2">{row.country ?? "—"}</td>
                    <td className="px-3 py-2 min-w-48">
                      <div className="flex gap-2">
                        <input
                          className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                          value={assigneeDrafts[row.id] ?? ""}
                          onChange={(event) =>
                            setAssigneeDrafts((prev) => ({
                              ...prev,
                              [row.id]: event.target.value,
                            }))
                          }
                          placeholder="Assign owner"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={savingAssigneeId === row.id}
                          onClick={() => handleAssigneeSave(row.id)}
                        >
                          Save
                        </Button>
                      </div>
                    </td>
                    <td className="px-3 py-2 min-w-48">
                      <div className="flex gap-2">
                        <select
                          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                          value={statusDrafts[row.id] ?? normalizeStatus(row.status)}
                          onChange={(event) =>
                            setStatusDrafts((prev) => ({
                              ...prev,
                              [row.id]: event.target.value as ReviewStatus,
                            }))
                          }
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={savingStatusId === row.id}
                          onClick={() => handleStatusSave(row.id)}
                        >
                          Save
                        </Button>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                        {pq?.outcome ?? "—"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex rounded-full border border-border px-2 py-0.5 text-xs font-medium">
                        {pq?.score ?? "—"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium border border-border">
                        {pq?.critical_pass === true ? "Pass" : pq?.critical_pass === false ? "Fail" : "—"}
                      </span>
                    </td>
                    <td className="px-3 py-2 min-w-56">
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "Portfolio", value: row.portfolio_url },
                          { label: "Sample", value: row.sample_url },
                          { label: "Instagram", value: row.instagram },
                          { label: "TikTok", value: row.tiktok },
                          { label: "YouTube", value: row.youtube },
                          { label: "Website", value: row.website },
                        ]
                          .filter((item) => item.value)
                          .map((item) => (
                            <a
                              key={item.label}
                              href={item.value ?? undefined}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs underline underline-offset-2"
                            >
                              {item.label}
                            </a>
                          ))}
                        {!row.portfolio_url &&
                          !row.sample_url &&
                          !row.instagram &&
                          !row.tiktok &&
                          !row.youtube &&
                          !row.website && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2 min-w-72">
                      <div className="space-y-2">
                        {notes.length > 0 ? (
                          <div className="max-h-28 overflow-y-auto rounded-md border border-border/60 p-2">
                            {notes.map((note) => (
                              <p key={note.id} className="mb-2 text-xs leading-relaxed last:mb-0">
                                <span className="text-muted-foreground">{new Date(note.created_at).toLocaleString()}:</span>{" "}
                                {note.note ?? ""}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">No internal notes yet.</p>
                        )}

                        <Textarea
                          value={noteDrafts[row.id] ?? ""}
                          onChange={(event) =>
                            setNoteDrafts((prev) => ({
                              ...prev,
                              [row.id]: event.target.value,
                            }))
                          }
                          rows={2}
                          placeholder="Add internal note"
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={savingNoteId === row.id || !(noteDrafts[row.id] ?? "").trim()}
                          onClick={() => handleAddNote(row.id)}
                        >
                          Add note
                        </Button>
                      </div>
                    </td>
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
