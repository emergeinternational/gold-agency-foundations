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
  evaluation_scores: Record<string, number> | null;
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

const GENERIC_EVALUATION_CRITERIA = ["potential", "professionalism", "market_fit"] as const;

const CATEGORY_EVALUATION_CRITERIA: Record<string, readonly string[]> = {
  model: ["look", "presence", "walk", "proportions", "potential"],
  musician: ["sound_quality", "originality", "performance", "market_fit", "potential"],
  "host/media": ["communication", "energy", "clarity", "presence", "professionalism"],
  influencer: ["content_quality", "engagement", "consistency", "brand_fit", "potential"],
  actor: ["performance", "range", "presence", "emotional_depth", "professionalism"],
  voice: ["clarity", "tone", "delivery", "versatility", "professionalism"],
};

export function normalizeCategory(category: string): string {
  const normalized = category.trim().toLowerCase();
  if (!normalized) return "";

  const compact = normalized.replace(/[_\s-]+/g, "");

  if (["model", "models", "modeling"].includes(compact)) return "model";
  if (["musician", "musicians", "music", "artist", "artists", "singer", "singers"].includes(compact)) {
    return "musician";
  }
  if (["host", "hosts", "media", "presenter", "presenters", "mediahosts", "mediapersonalities"].includes(compact)) {
    return "host/media";
  }
  if (["influencer", "influencers", "creator", "creators", "digitalcreator", "digitalcreators"].includes(compact)) {
    return "influencer";
  }
  if (["actor", "actors", "performer", "performers", "actorsperformers"].includes(compact)) {
    return "actor";
  }
  if (["voice", "voices", "voiceover", "voiceovers", "voicenarration", "narration"].includes(compact)) {
    return "voice";
  }

  return normalized;
}

const getEvaluationCriteria = (category: string | null): readonly string[] => {
  const normalizedCategory = normalizeCategory(category ?? "");
  return CATEGORY_EVALUATION_CRITERIA[normalizedCategory] ?? GENERIC_EVALUATION_CRITERIA;
};

const normalizeStatus = (value: string | null): ReviewStatus => {
  if (value && STATUS_OPTIONS.includes(value as ReviewStatus)) {
    return value as ReviewStatus;
  }
  return "new";
};

const formatCriterionLabel = (value: string) =>
  value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default function AdminReview() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [notesBySubmission, setNotesBySubmission] = useState<Record<string, AdminNote[]>>({});
  const [statusDrafts, setStatusDrafts] = useState<Record<string, ReviewStatus>>({});
  const [assigneeDrafts, setAssigneeDrafts] = useState<Record<string, string>>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [evaluationDrafts, setEvaluationDrafts] = useState<Record<string, Record<string, number>>>({});
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("ascend");
  const [search, setSearch] = useState("");
  const [savingStatusId, setSavingStatusId] = useState<string | null>(null);
  const [savingAssigneeId, setSavingAssigneeId] = useState<string | null>(null);
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [savingEvaluationId, setSavingEvaluationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const { data, error: submissionsError } = await supabase
        .from("submissions")
        .select(
          "id, assignee, created_at, full_name, email, phone, city, category, country, source, status, evaluation_scores, portfolio_url, sample_url, instagram, tiktok, youtube, website, prequalification_results(outcome, score, critical_pass)",
        )
        .order("created_at", { ascending: false });

      if (submissionsError) {
        setError(submissionsError.message);
        setLoading(false);
        return;
      }

      const submissionRows = ((data as Submission[]) ?? []).map((row) => ({
        ...row,
        evaluation_scores: row.evaluation_scores ?? {},
      }));

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

      setEvaluationDrafts(
        submissionRows.reduce<Record<string, Record<string, number>>>((acc, row) => {
          const criteria = getEvaluationCriteria(row.category);
          const existingScores = row.evaluation_scores ?? {};

          acc[row.id] = criteria.reduce<Record<string, number>>((criteriaAcc, key) => {
            const value = existingScores[key];
            if (typeof value === "number" && value >= 1 && value <= 5) {
              criteriaAcc[key] = value;
            }
            return criteriaAcc;
          }, {});

          return acc;
        }, {}),
      );

      const uniqueSources = [...new Set(submissionRows.map((row) => row.source).filter(Boolean) as string[])];
      const ascendSource = uniqueSources.find((option) => option.toLowerCase() === "ascend");
      setFilterSource(ascendSource ?? "all");

      if (submissionRows.length > 0) {
        const ids = submissionRows.map((row) => row.id);
        const { data: notesData, error: notesError } = await supabase
          .from("admin_notes")
          .select("id, created_at, note, submission_id")
          .in("submission_id", ids)
          .order("created_at", { ascending: false });

        if (notesError) {
          setError(notesError.message);
        } else if (notesData) {
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
    };

    void load();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/sign-in", { replace: true });
  };

  const handleStatusSave = async (submissionId: string) => {
    const status = statusDrafts[submissionId];
    if (!status) return;

    setSavingStatusId(submissionId);
    setError(null);

    const { error: updateError } = await supabase.from("submissions").update({ status }).eq("id", submissionId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setRows((prev) => prev.map((row) => (row.id === submissionId ? { ...row, status } : row)));
    }

    setSavingStatusId(null);
  };

  const handleQuickDecision = async (
    submissionId: string,
    updates: { status: ReviewStatus; source?: string | null },
  ) => {
    setSavingStatusId(submissionId);
    setError(null);

    const { error: updateError } = await supabase.from("submissions").update(updates).eq("id", submissionId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setStatusDrafts((prev) => ({
        ...prev,
        [submissionId]: updates.status,
      }));
      setRows((prev) =>
        prev.map((row) =>
          row.id === submissionId
            ? {
                ...row,
                ...updates,
              }
            : row,
        ),
      );
    }

    setSavingStatusId(null);
  };

  const handleAddNote = async (submissionId: string) => {
    const note = noteDrafts[submissionId]?.trim();
    if (!note) return;

    setSavingNoteId(submissionId);
    setError(null);

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
    setError(null);

    const { error: updateError } = await supabase.from("submissions").update({ assignee }).eq("id", submissionId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setRows((prev) => prev.map((row) => (row.id === submissionId ? { ...row, assignee } : row)));
    }

    setSavingAssigneeId(null);
  };

  const handleEvaluationScoreChange = (submissionId: string, key: string, value: number | null) => {
    setEvaluationDrafts((prev) => {
      const next = { ...(prev[submissionId] ?? {}) };

      if (value === null || Number.isNaN(value)) {
        delete next[key];
      } else {
        next[key] = value;
      }

      return {
        ...prev,
        [submissionId]: next,
      };
    });
  };

  const handleEvaluationSave = async (submission: Submission) => {
    const criteria = getEvaluationCriteria(submission.category);
    const draft = evaluationDrafts[submission.id] ?? {};

    const sanitizedScores = criteria.reduce<Record<string, number>>((acc, key) => {
      const score = draft[key];
      if (typeof score === "number" && score >= 1 && score <= 5) {
        acc[key] = score;
      }
      return acc;
    }, {});

    setSavingEvaluationId(submission.id);
    setError(null);

    const { error: updateError } = await supabase
      .from("submissions")
      .update({ evaluation_scores: sanitizedScores })
      .eq("id", submission.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setRows((prev) =>
        prev.map((row) =>
          row.id === submission.id
            ? {
                ...row,
                evaluation_scores: sanitizedScores,
              }
            : row,
        ),
      );
    }

    setSavingEvaluationId(null);
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
    () => [...new Set(rows.map((row) => normalizeCategory(row.category ?? "")).filter(Boolean))].sort(),
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
        const normalizedCategory = normalizeCategory(row.category ?? "");
        const normalizedSource = row.source ?? "";
        const searchTerm = search.trim().toLowerCase();

        const categoryMatch = filterCategory === "all" || normalizedCategory === filterCategory;
        const statusMatch = filterStatus === "all" || rowStatus === filterStatus;
        const sourceMatch = filterSource === "all" || normalizedSource === filterSource;
        const searchMatch =
          searchTerm.length === 0 ||
          [row.full_name, row.email, row.phone, row.city, row.category, normalizedCategory]
            .filter(Boolean)
            .some((value) => value?.toLowerCase().includes(searchTerm));

        return categoryMatch && statusMatch && sourceMatch && searchMatch;
      }),
    [rows, filterCategory, filterStatus, filterSource, search],
  );

  return (
    <div className="min-h-screen bg-background p-6 text-foreground sm:p-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-semibold">Submission Review</h1>
          <p className="text-sm text-muted-foreground">
            Internal only — founder/admin review workspace. Source is shown prominently to keep Ascend and Emerge
            separated.
          </p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          Sign out
        </Button>
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
              <option key={option} value={option}>
                {formatCriterionLabel(option)}
              </option>
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
              <option key={status} value={status}>
                {formatCriterionLabel(status)}
              </option>
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
              <option key={option} value={option}>
                {option}
              </option>
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
        <div className="overflow-x-auto rounded-md border border-border">
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
                <th className="px-3 py-2 font-medium">Evaluation Criteria</th>
                <th className="px-3 py-2 font-medium">Country</th>
                <th className="px-3 py-2 font-medium">Assignee</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">PQ Outcome</th>
                <th className="px-3 py-2 font-medium">Score</th>
                <th className="px-3 py-2 font-medium">Critical</th>
                <th className="px-3 py-2 font-medium">Evidence</th>
                <th className="px-3 py-2 font-medium">Evaluation</th>
                <th className="px-3 py-2 font-medium">Admin Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const pq = row.prequalification_results?.[0];
                const notes = notesBySubmission[row.id] ?? [];
                const normalizedCategory = normalizeCategory(row.category ?? "");
                const criteria = getEvaluationCriteria(row.category);
                const draftScores = evaluationDrafts[row.id] ?? {};
                const scoreValues = criteria
                  .map((key) => draftScores[key])
                  .filter((value): value is number => typeof value === "number");
                const averageScore =
                  scoreValues.length > 0
                    ? (scoreValues.reduce((sum, value) => sum + value, 0) / scoreValues.length).toFixed(1)
                    : null;

                return (
                  <tr key={row.id} className="align-top hover:bg-secondary/30 border-t border-border/60">
                    <td className="whitespace-nowrap px-3 py-2">{new Date(row.created_at).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">{renderAge(row.created_at)}</td>
                    <td className="px-3 py-2 font-semibold uppercase tracking-wide">{row.source ?? "—"}</td>
                    <td className="px-3 py-2">{row.full_name ?? "—"}</td>
                    <td className="px-3 py-2">{row.email ?? "—"}</td>
                    <td className="px-3 py-2">{row.phone ?? "—"}</td>
                    <td className="px-3 py-2">{row.city ?? "—"}</td>
                    <td className="px-3 py-2">{normalizedCategory ? formatCriterionLabel(normalizedCategory) : "—"}</td>
                    <td className="min-w-56 px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {criteria.map((criterion) => (
                          <span key={criterion} className="inline-flex rounded-full border border-border px-2 py-0.5 text-xs">
                            {formatCriterionLabel(criterion)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2">{row.country ?? "—"}</td>
                    <td className="min-w-48 px-3 py-2">
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
                    <td className="min-w-48 px-3 py-2">
                      <div className="space-y-2">
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
                              <option key={status} value={status}>
                                {formatCriterionLabel(status)}
                              </option>
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
                        <div className="flex flex-wrap gap-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={savingStatusId === row.id}
                            onClick={() => handleQuickDecision(row.id, { status: "approved" })}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={savingStatusId === row.id}
                            onClick={() => handleQuickDecision(row.id, { status: "development" })}
                          >
                            Needs Dev
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={savingStatusId === row.id}
                            onClick={() => handleQuickDecision(row.id, { status: "rejected" })}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={savingStatusId === row.id}
                            onClick={() =>
                              handleQuickDecision(row.id, {
                                status: "approved",
                                source: "emerge_pipeline",
                              })
                            }
                          >
                            Refer → Emerge
                          </Button>
                        </div>
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
                      <span className="inline-flex rounded-full border border-border px-2 py-0.5 text-xs font-medium">
                        {pq?.critical_pass === true ? "Pass" : pq?.critical_pass === false ? "Fail" : "—"}
                      </span>
                    </td>
                    <td className="min-w-56 px-3 py-2">
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
                    <td className="min-w-80 px-3 py-2">
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 gap-2">
                          {criteria.map((key) => (
                            <label key={key} className="flex items-center justify-between gap-3 text-xs">
                              <span className="font-medium text-foreground">{formatCriterionLabel(key)}</span>
                              <select
                                className="h-8 w-20 rounded-md border border-input bg-background px-2 text-xs"
                                value={draftScores[key] ?? ""}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  handleEvaluationScoreChange(row.id, key, value ? Number(value) : null);
                                }}
                              >
                                <option value="">—</option>
                                {[1, 2, 3, 4, 5].map((score) => (
                                  <option key={score} value={score}>
                                    {score}
                                  </option>
                                ))}
                              </select>
                            </label>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">Average: {averageScore ?? "—"}</p>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={savingEvaluationId === row.id}
                            onClick={() => handleEvaluationSave(row)}
                          >
                            Save scores
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td className="min-w-72 px-3 py-2">
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
