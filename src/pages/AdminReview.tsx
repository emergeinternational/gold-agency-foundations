import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { CandidateMessagingPanel } from "@/components/admin/CandidateMessagingPanel";

type ReviewStatus = "new" | "review" | "development" | "approved" | "rejected";
type SubmissionLevel = "beginner" | "intermediate" | "advanced" | "elite";
type NextAction =
  | "schedule_audition"
  | "enroll_training"
  | "request_more_content"
  | "refer_to_emerge"
  | "hold"
  | "reject";

type ReviewViewMode = "standard" | "action_queue";

const STATUS_OPTIONS: ReviewStatus[] = ["new", "review", "development", "approved", "rejected"];
const LEVEL_OPTIONS: SubmissionLevel[] = ["beginner", "intermediate", "advanced", "elite"];
const NEXT_ACTION_OPTIONS: NextAction[] = [
  "schedule_audition",
  "enroll_training",
  "request_more_content",
  "refer_to_emerge",
  "hold",
  "reject",
];

const ACTION_HEADERS: Record<string, string> = {
  schedule_audition: "🎤 Audition Scheduling Required",
  enroll_training: "📚 Training Enrollment Required",
  request_more_content: "📎 More Content Needed",
  refer_to_emerge: "🚀 Referred for Emerge Review",
};

const CANDIDATE_MESSAGES: Record<string, string> = {
  schedule_audition:
    "Great news! You have been selected for an audition. Our team will contact you with scheduling details shortly.",
  enroll_training:
    "Great news! You have been selected for training. Our team will contact you with the next steps shortly.",
  request_more_content:
    "Thanks for your submission. Please send additional content so we can continue your review.",
  refer_to_emerge:
    "Congratulations! You have been selected for our premium Emerge consideration. Our team will contact you with next steps.",
};

const MINOR_SAFE_SUMMARY =
  "Thanks for your submission. Before any next step can move forward, legal parent/guardian authorization may be required. Our team will provide instructions if needed.";

const buildInternalTelegramPreview = (action: string, row: Submission): string => {
  const priority = row.emerge_ready ? "HIGH" : "STANDARD";
  const header = ACTION_HEADERS[action] ?? "📌 Submission Action Required";
  return [
    header,
    "",
    `Priority: ${priority}`,
    "",
    `Name: ${row.full_name ?? "n/a"}`,
    `Category: ${row.category ?? "n/a"}`,
    `Source: ${row.source ?? "n/a"}`,
    `Status: ${row.status ?? "n/a"}`,
    `Level: ${row.level ?? "n/a"}`,
    `Emerge Ready: ${row.emerge_ready ? "YES" : "NO"}`,
    `Next Action: ${action}`,
    `Email: ${row.email ?? "n/a"}`,
    `Phone: ${row.phone ?? "n/a"}`,
    `City: ${row.city ?? "n/a"}`,
  ].join("\n");
};

const buildCandidateTelegramPreview = (action: string, row: Submission): string => {
  const summary = CANDIDATE_MESSAGES[action] ?? "Your submission has been updated. Our team will contact you with details.";
  const firstName = row.full_name?.trim().split(" ")[0] ?? null;
  const body = row.is_minor ? MINOR_SAFE_SUMMARY : summary;
  return [firstName ? `Hi ${firstName},` : "Hi,", "", body, "", "— Gold Agency Team"].join("\n");
};

const ACTION_QUEUE_GROUP_ORDER = [
  "schedule_audition",
  "request_more_content",
  "hold",
  "enroll_training",
  "refer_to_emerge",
  "reject",
  "no_action",
] as const;

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
  level: string | null;
  next_action: string | null;
  emerge_ready: boolean;
  evaluation_scores: Record<string, number> | null;
  portfolio_url: string | null;
  sample_url: string | null;
  notes: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  website: string | null;
  telegram_chat_id: string | null;
  application_mode: string | null;
  opportunity_slug: string | null;
  opportunity_title: string | null;
  candidate_outcome: string | null;
  priority_tier: string | null;
  tags: string[] | null;
  applicant_age: number | null;
  is_minor: boolean | null;
  parent_guardian_full_name: string | null;
  parent_guardian_relationship: string | null;
  parent_guardian_email: string | null;
  parent_guardian_phone: string | null;
  parent_guardian_consent: boolean | null;
  parent_guardian_authorization_acknowledgment: boolean | null;
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

type SubmissionMedia = {
  id: string;
  submission_id: string;
  bucket_id: string;
  object_path: string;
  file_name: string | null;
  file_role: string;
  mime_type: string | null;
  size_bytes: number | null;
  signedUrl?: string;
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

const normalizeLevel = (value: string | null): SubmissionLevel | "" => {
  if (value && LEVEL_OPTIONS.includes(value as SubmissionLevel)) {
    return value as SubmissionLevel;
  }
  return "";
};

const normalizeNextAction = (value: string | null): NextAction | "" => {
  if (value && NEXT_ACTION_OPTIONS.includes(value as NextAction)) {
    return value as NextAction;
  }
  return "";
};

// Internal action definitions for admin workflow consistency:
// schedule_audition -> candidate ready for immediate audition scheduling
// enroll_training -> candidate not ready but suitable for development
// request_more_content -> insufficient data, requires additional submission
// refer_to_emerge -> high-value candidate for escalation

const resolveConsistentNextAction = (params: {
  status: ReviewStatus;
  level: SubmissionLevel | "";
  category: string | null;
  evaluationScores: Record<string, number> | null;
}): { nextAction: NextAction; emergeReady: boolean } => {
  const { status, level, category, evaluationScores } = params;

  if (status === "rejected") {
    return { nextAction: "reject", emergeReady: false };
  }

  const emergeReady = isEmergeReady({
    status,
    level,
    category,
    evaluationScores,
  });

  if (emergeReady) return { nextAction: "refer_to_emerge", emergeReady: true };
  if (status === "development") return { nextAction: "enroll_training", emergeReady: false };
  if (status === "review" || status === "approved") return { nextAction: "schedule_audition", emergeReady: false };

  return { nextAction: "request_more_content", emergeReady: false };
};

const getSuggestedNextAction = (row: Submission): NextAction | null => {
  if (row.emerge_ready) return "refer_to_emerge";
  if (row.status === "development") return "enroll_training";
  if (row.status === "review") return "schedule_audition";
  return null;
};

const formatCriterionLabel = (value: string) =>
  value
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatActionGroupLabel = (value: string | null): string => {
  if (!value) return "No Action Set";
  return formatCriterionLabel(value);
};

const getSuggestedLevelFromAverage = (averageScore: number): SubmissionLevel => {
  if (averageScore >= 4.5) return "elite";
  if (averageScore >= 3.8) return "advanced";
  if (averageScore >= 3.0) return "intermediate";
  return "beginner";
};

const getAverageFromScores = (criteria: readonly string[], scores: Record<string, number> | null): number | null => {
  const values = criteria
    .map((key) => scores?.[key])
    .filter((value): value is number => typeof value === "number" && value >= 1 && value <= 5);

  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const isEmergeReady = (params: {
  status: string | null;
  level: string | null;
  category: string | null;
  evaluationScores: Record<string, number> | null;
}): boolean => {
  const { status, level, category, evaluationScores } = params;
  if (status !== "approved") return false;
  if (level !== "advanced" && level !== "elite") return false;

  const averageScore = getAverageFromScores(getEvaluationCriteria(category), evaluationScores);
  return averageScore !== null && averageScore >= 3.8;
};

function TelegramPreviewPanel({ row }: { row: Submission }) {
  const [open, setOpen] = useState(false);
  const action = normalizeNextAction(row.next_action) || "request_more_content";
  const internal = buildInternalTelegramPreview(action, row);
  const candidate = buildCandidateTelegramPreview(action, row);
  const audience = row.is_minor ? "Minor — guardian-safe wording" : "Adult — standard wording";

  return (
    <div className="rounded-md border border-border/60 bg-muted/10 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Telegram Preview</p>
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${row.is_minor ? "border border-destructive/40 bg-destructive/10 text-destructive" : "border border-border bg-secondary text-foreground"}`}>
            {audience}
          </span>
          <span className="text-[11px] text-muted-foreground">Action: {action}</span>
        </div>
        <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide preview" : "Show preview"}
        </Button>
      </div>
      {open && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Internal (admin chat)</p>
            <pre className="whitespace-pre-wrap rounded-md border border-border/60 bg-background p-2 text-[11px] leading-snug text-foreground">{internal}</pre>
          </div>
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Candidate-facing</p>
            <pre className={`whitespace-pre-wrap rounded-md border p-2 text-[11px] leading-snug text-foreground ${row.is_minor ? "border-destructive/40 bg-destructive/5" : "border-border/60 bg-background"}`}>{candidate}</pre>
            {row.is_minor && (
              <p className="mt-1 text-[10px] text-destructive">Minor-safe override active — no booking, casting, travel, or media-use language sent.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminReview() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [notesBySubmission, setNotesBySubmission] = useState<Record<string, AdminNote[]>>({});
  const [statusDrafts, setStatusDrafts] = useState<Record<string, ReviewStatus>>({});
  const [assigneeDrafts, setAssigneeDrafts] = useState<Record<string, string>>({});
  const [levelDrafts, setLevelDrafts] = useState<Record<string, SubmissionLevel | "">>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [mediaBySubmission, setMediaBySubmission] = useState<Record<string, SubmissionMedia[]>>({});
  const [evaluationDrafts, setEvaluationDrafts] = useState<Record<string, Record<string, number>>>({});
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("ascend");
  const [filterNextAction, setFilterNextAction] = useState("all");
  const [filterReadiness, setFilterReadiness] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ReviewViewMode>("standard");
  const [savingStatusId, setSavingStatusId] = useState<string | null>(null);
  const [savingAssigneeId, setSavingAssigneeId] = useState<string | null>(null);
  const [savingLevelId, setSavingLevelId] = useState<string | null>(null);
  const [savingNextActionId, setSavingNextActionId] = useState<string | null>(null);
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
          "id, assignee, created_at, full_name, email, phone, city, category, country, source, status, level, next_action, emerge_ready, evaluation_scores, portfolio_url, sample_url, notes, instagram, tiktok, youtube, website, telegram_chat_id, application_mode, opportunity_slug, opportunity_title, candidate_outcome, priority_tier, tags, applicant_age, is_minor, parent_guardian_full_name, parent_guardian_relationship, parent_guardian_email, parent_guardian_phone, parent_guardian_consent, parent_guardian_authorization_acknowledgment, prequalification_results(outcome, score, critical_pass)",
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

      setLevelDrafts(
        submissionRows.reduce<Record<string, SubmissionLevel | "">>((acc, row) => {
          acc[row.id] = normalizeLevel(row.level);
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

        const { data: mediaData, error: mediaError } = await supabase
          .from("submission_media")
          .select("id, submission_id, bucket_id, object_path, file_name, file_role, mime_type, size_bytes")
          .in("submission_id", ids)
          .order("created_at", { ascending: true });

        if (mediaError) {
          console.error("submission media load error", mediaError);
        } else if (mediaData) {
          const signedMedia = await Promise.all(
            (mediaData as SubmissionMedia[]).map(async (media) => {
              const { data: signed } = await supabase.storage
                .from(media.bucket_id)
                .createSignedUrl(media.object_path, 60 * 10);
              return { ...media, signedUrl: signed?.signedUrl };
            }),
          );

          const groupedMedia = signedMedia.reduce<Record<string, SubmissionMedia[]>>((acc, media) => {
            const current = acc[media.submission_id] ?? [];
            acc[media.submission_id] = [...current, media];
            return acc;
          }, {});
          setMediaBySubmission(groupedMedia);
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
    const row = rows.find((item) => item.id === submissionId);
    if (!row) return;
    const { nextAction, emergeReady } = resolveConsistentNextAction({
      status,
      level: normalizeLevel(row.level),
      category: row.category,
      evaluationScores: row.evaluation_scores ?? {},
    });

    setSavingStatusId(submissionId);
    setError(null);

    const { error: updateError } = await supabase
      .from("submissions")
      .update({ status, emerge_ready: emergeReady, next_action: nextAction })
      .eq("id", submissionId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setRows((prev) =>
        prev.map((item) =>
          item.id === submissionId ? { ...item, status, emerge_ready: emergeReady, next_action: nextAction } : item,
        ),
      );
    }

    setSavingStatusId(null);
  };

  const handleQuickDecision = async (
    submissionId: string,
    updates: { status: ReviewStatus; source?: string | null },
  ) => {
    const row = rows.find((item) => item.id === submissionId);
    if (!row) return;
    const { nextAction, emergeReady } = resolveConsistentNextAction({
      status: updates.status,
      level: normalizeLevel(row.level),
      category: row.category,
      evaluationScores: row.evaluation_scores ?? {},
    });
    setSavingStatusId(submissionId);
    setError(null);

    const { error: updateError } = await supabase
      .from("submissions")
      .update({ ...updates, emerge_ready: emergeReady, next_action: nextAction })
      .eq("id", submissionId);

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
                emerge_ready: emergeReady,
                next_action: nextAction,
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

  const handleLevelSave = async (submissionId: string) => {
    const level = levelDrafts[submissionId] || null;
    const row = rows.find((item) => item.id === submissionId);
    if (!row) return;
    const { nextAction, emergeReady } = resolveConsistentNextAction({
      status: normalizeStatus(row.status),
      level: level ? level : "",
      category: row.category,
      evaluationScores: row.evaluation_scores ?? {},
    });

    setSavingLevelId(submissionId);
    setError(null);

    const { error: updateError } = await supabase
      .from("submissions")
      .update({ level, emerge_ready: emergeReady, next_action: nextAction })
      .eq("id", submissionId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setRows((prev) =>
        prev.map((item) =>
          item.id === submissionId ? { ...item, level, emerge_ready: emergeReady, next_action: nextAction } : item,
        ),
      );
    }

    setSavingLevelId(null);
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

    const decision = resolveConsistentNextAction({
      status: normalizeStatus(submission.status),
      level: normalizeLevel(submission.level),
      category: submission.category,
      evaluationScores: sanitizedScores,
    });

    const { error: updateError } = await supabase
      .from("submissions")
      .update({
        evaluation_scores: sanitizedScores,
        emerge_ready: decision.emergeReady,
        next_action: decision.nextAction,
      })
      .eq("id", submission.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setRows((prev) =>
        prev.map((row) =>
          row.id === submission.id
            ? (() => {
                const decision = resolveConsistentNextAction({
                  status: normalizeStatus(row.status),
                  level: normalizeLevel(row.level),
                  category: row.category,
                  evaluationScores: sanitizedScores,
                });

                return {
                  ...row,
                  evaluation_scores: sanitizedScores,
                  emerge_ready: decision.emergeReady,
                  next_action: decision.nextAction,
                };
              })()
            : row,
        ),
      );
    }

    setSavingEvaluationId(null);
  };

  const handleNextActionChange = async (row: Submission, selectedValue: NextAction | "") => {
    const normalizedStatus = normalizeStatus(row.status);
    const normalizedLevel = normalizeLevel(row.level);
    const selectedAction = selectedValue || "request_more_content";

    const statusFromAction: ReviewStatus =
      selectedAction === "reject"
        ? "rejected"
        : selectedAction === "enroll_training"
          ? "development"
          : selectedAction === "request_more_content"
            ? normalizedStatus === "new" ? "new" : "review"
            : "review";

    const { nextAction, emergeReady } = resolveConsistentNextAction({
      status: statusFromAction,
      level: normalizedLevel,
      category: row.category,
      evaluationScores: row.evaluation_scores ?? {},
    });

    setSavingNextActionId(row.id);
    setError(null);
    console.log("Saving next_action", row.id, selectedValue);

    const { error: updateError } = await supabase
      .from("submissions")
      .update({ status: statusFromAction, emerge_ready: emergeReady, next_action: nextAction })
      .eq("id", row.id);

    if (updateError) {
      console.error(updateError);
      setError(updateError.message);
    } else {
      console.log("next_action save success", row.id, selectedValue);
      setRows((prevRows) =>
        prevRows.map((prevRow) =>
          prevRow.id === row.id
            ? { ...prevRow, status: statusFromAction, emerge_ready: emergeReady, next_action: nextAction }
            : prevRow,
        ),
      );
      setStatusDrafts((prev) => ({ ...prev, [row.id]: statusFromAction }));
    }

    setSavingNextActionId((prev) => (prev === row.id ? null : prev));
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
        const normalizedNextAction = normalizeNextAction(row.next_action);
        const searchTerm = search.trim().toLowerCase();

        const categoryMatch = filterCategory === "all" || normalizedCategory === filterCategory;
        const statusMatch = filterStatus === "all" || rowStatus === filterStatus;
        const sourceMatch = filterSource === "all" || normalizedSource === filterSource;
        const nextActionMatch = filterNextAction === "all" || normalizedNextAction === filterNextAction;
        const readinessMatch =
          filterReadiness === "all" ||
          (filterReadiness === "ready" && row.emerge_ready) ||
          (filterReadiness === "not_ready" && !row.emerge_ready);
        const searchMatch =
          searchTerm.length === 0 ||
          [row.full_name, row.email, row.phone, row.city, row.category, normalizedCategory]
            .filter(Boolean)
            .some((value) => value?.toLowerCase().includes(searchTerm));

        return categoryMatch && statusMatch && sourceMatch && nextActionMatch && readinessMatch && searchMatch;
      }),
    [rows, filterCategory, filterStatus, filterSource, filterNextAction, filterReadiness, search],
  );



  const summaryCounts = useMemo(() => {
    const total = rows.length;
    const readyForEmerge = rows.filter((row) => row.emerge_ready).length;
    const inDevelopment = rows.filter((row) => row.status === "development").length;
    const awaitingAudition = rows.filter((row) => row.next_action === "schedule_audition").length;
    const requestMoreContent = rows.filter((row) => row.next_action === "request_more_content").length;
    const hold = rows.filter((row) => row.next_action === "hold").length;

    return {
      total,
      readyForEmerge,
      inDevelopment,
      awaitingAudition,
      requestMoreContent,
      hold,
    };
  }, [rows]);

  const actionQueueGroups = useMemo(() => {
    const grouped = filteredRows.reduce<Record<string, Submission[]>>((acc, row) => {
      const key = row.next_action || "no_action";
      acc[key] = [...(acc[key] ?? []), row];
      return acc;
    }, {});

    return ACTION_QUEUE_GROUP_ORDER.filter((key) => grouped[key]?.length).map((key) => ({
      key,
      rows: [...(grouped[key] ?? [])].sort((a, b) => {
        // Surface minors first within each action group so guardian
        // authorization gets reviewed before adult queue items.
        if (!!a.is_minor !== !!b.is_minor) {
          return a.is_minor ? -1 : 1;
        }
        if (a.emerge_ready !== b.emerge_ready) {
          return a.emerge_ready ? -1 : 1;
        }

        const aAverage = getAverageFromScores(getEvaluationCriteria(a.category), a.evaluation_scores) ?? -1;
        const bAverage = getAverageFromScores(getEvaluationCriteria(b.category), b.evaluation_scores) ?? -1;

        if (aAverage !== bAverage) {
          return bAverage - aAverage;
        }

        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }),
    }));
  }, [filteredRows]);
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

      <div className="mb-4 grid gap-3 sm:grid-cols-6">
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
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Filter by readiness</label>
          <select
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={filterReadiness}
            onChange={(event) => setFilterReadiness(event.target.value)}
          >
            <option value="all">All readiness states</option>
            <option value="ready">Ready only</option>
            <option value="not_ready">Not ready only</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Filter by next action</label>
          <select
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={filterNextAction}
            onChange={(event) => setFilterNextAction(event.target.value)}
          >
            <option value="all">All actions</option>
            {NEXT_ACTION_OPTIONS.map((action) => (
              <option key={action} value={action}>
                {formatCriterionLabel(action)}
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

      <div className="mb-4 grid gap-2 sm:grid-cols-6">
        {[
          { label: "Total Submissions", value: summaryCounts.total },
          { label: "Ready for Emerge", value: summaryCounts.readyForEmerge },
          { label: "In Development", value: summaryCounts.inDevelopment },
          { label: "Awaiting Audition", value: summaryCounts.awaitingAudition },
          { label: "Request More Content", value: summaryCounts.requestMoreContent },
          { label: "Hold", value: summaryCounts.hold },
        ].map((item) => (
          <div key={item.label} className="rounded-md border border-border/60 bg-muted/20 px-3 py-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{item.label}</p>
            <p className="text-lg font-semibold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">View mode:</span>
        <Button
          size="sm"
          variant={viewMode === "standard" ? "default" : "outline"}
          onClick={() => setViewMode("standard")}
        >
          Standard View
        </Button>
        <Button
          size="sm"
          variant={viewMode === "action_queue" ? "default" : "outline"}
          onClick={() => setViewMode("action_queue")}
        >
          Action Queue
        </Button>
      </div>

      <div className="mb-4 rounded-md border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
        <p>Review flow: Score talent → set level → confirm status → choose next action.</p>
        <p>Emerge Ready updates automatically when Status = Approved, Level = Advanced/Elite, and average score is 3.8+.</p>
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
                <th className="px-3 py-2 font-medium">Level</th>
                <th className="px-3 py-2 font-medium">Next Action</th>
                <th className="px-3 py-2 font-medium">Emerge Ready</th>
                <th className="px-3 py-2 font-medium">PQ Outcome</th>
                <th className="px-3 py-2 font-medium">Score</th>
                <th className="px-3 py-2 font-medium">Critical</th>
                <th className="px-3 py-2 font-medium">Evidence</th>
                <th className="px-3 py-2 font-medium">Evaluation</th>
                <th className="px-3 py-2 font-medium">Admin Notes</th>
              </tr>
            </thead>
            <tbody>
              {(viewMode === "action_queue" ? actionQueueGroups.flatMap((group) => group.rows) : filteredRows).map((row, index, activeRows) => {
                const previousRow = activeRows[index - 1];
                const startsNewGroup =
                  viewMode === "action_queue" && (index === 0 || previousRow?.next_action !== row.next_action);

                const pq = row.prequalification_results?.[0];
                const notes = notesBySubmission[row.id] ?? [];
                const media = mediaBySubmission[row.id] ?? [];
                const normalizedCategory = normalizeCategory(row.category ?? "");
                const criteria = getEvaluationCriteria(row.category);
                const draftScores = evaluationDrafts[row.id] ?? {};
                const savedScores = row.evaluation_scores ?? {};
                const savedAverageScore = getAverageFromScores(criteria, savedScores);
                const suggestedLevel = savedAverageScore !== null ? getSuggestedLevelFromAverage(savedAverageScore) : null;
                const suggestedNextAction = getSuggestedNextAction(row);
                const scoreValues = criteria
                  .map((key) => draftScores[key])
                  .filter((value): value is number => typeof value === "number");
                const averageScore =
                  scoreValues.length > 0
                    ? (scoreValues.reduce((sum, value) => sum + value, 0) / scoreValues.length).toFixed(1)
                    : null;

                return (
                  <Fragment key={row.id}>
                    {startsNewGroup && (
                      <tr className="border-t border-border bg-secondary/40">
                        <td colSpan={21} className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {formatActionGroupLabel(row.next_action)}
                        </td>
                      </tr>
                    )}
                    <tr className="align-top border-t border-border/60 hover:bg-secondary/30">
                    <td className="whitespace-nowrap px-3 py-2">{new Date(row.created_at).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">{renderAge(row.created_at)}</td>
                    <td className="px-3 py-2 font-semibold uppercase tracking-wide">{row.source ?? "—"}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-0.5">
                        <span>{row.full_name ?? "—"}</span>
                        {row.is_minor && (
                          <span className="inline-flex w-fit items-center rounded-full border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-destructive font-semibold">
                            Minor — Guardian Authorization Required
                          </span>
                        )}
                        {(row.application_mode || row.opportunity_title) && (
                          <span className="flex flex-wrap gap-1">
                            {row.application_mode && row.application_mode !== "general" && (
                              <span className="inline-flex rounded-full border border-primary/30 bg-primary/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-primary">
                                {row.application_mode.split("_").join(" ")}
                              </span>
                            )}
                            {row.opportunity_title && (
                              <span className="inline-flex rounded-full border border-border bg-secondary/40 px-1.5 py-0.5 text-[10px] text-muted-foreground" title={row.opportunity_slug ?? undefined}>
                                {row.opportunity_title}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </td>
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
                    <td className="min-w-48 px-3 py-2">
                      <div className="space-y-2">
                        <div className="rounded-md border border-border/60 bg-muted/20 px-2 py-1.5 text-xs">
                          <span className="text-muted-foreground">Suggested Level: </span>
                          <span className="font-medium">{suggestedLevel ? formatCriterionLabel(suggestedLevel) : "—"}</span>
                          {savedAverageScore !== null && (
                            <span className="text-muted-foreground"> ({savedAverageScore.toFixed(1)} avg)</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <select
                            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                            value={levelDrafts[row.id] ?? normalizeLevel(row.level)}
                            onChange={(event) =>
                              setLevelDrafts((prev) => ({
                                ...prev,
                                [row.id]: event.target.value as SubmissionLevel | "",
                              }))
                            }
                          >
                            <option value="">—</option>
                            {LEVEL_OPTIONS.map((level) => (
                              <option key={level} value={level}>
                                {formatCriterionLabel(level)}
                              </option>
                            ))}
                          </select>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={savingLevelId === row.id}
                            onClick={() => handleLevelSave(row.id)}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td className="min-w-52 px-3 py-2">
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <select
                            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                            disabled={savingNextActionId === row.id}
                            value={normalizeNextAction(row.next_action)}
                            onChange={(event) => handleNextActionChange(row, event.target.value as NextAction | "")}
                          >
                            <option value="">Select action</option>
                            {NEXT_ACTION_OPTIONS.map((action) => (
                              <option key={action} value={action}>
                                {action}
                              </option>
                            ))}
                          </select>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Suggested: {suggestedNextAction ? suggestedNextAction : "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            row.emerge_ready
                              ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
                              : "border border-border bg-secondary text-foreground"
                          }`}
                        >
                          {row.emerge_ready ? "READY" : "NOT READY"}
                        </span>
                        <p className="text-[11px] text-muted-foreground">Requires approved + advanced/elite + 3.8+ avg</p>
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
                          !row.website &&
                          media.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                        {media.map((item) => (
                          <a
                            key={item.id}
                            href={item.signedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs underline underline-offset-2"
                          >
                            {item.file_role.replace("_", " ")}
                          </a>
                        ))}
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
                        {/* Clear minor vs adult banner so reviewers can sort guardian-required submissions at a glance */}
                        <div className="flex items-center justify-between gap-2">
                          {row.is_minor ? (
                            <span className="inline-flex items-center rounded-full border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive">
                              Minor{row.applicant_age != null ? ` · age ${row.applicant_age}` : ""} — Guardian required
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                              Adult{row.applicant_age != null ? ` · age ${row.applicant_age}` : ""}
                            </span>
                          )}
                          {row.is_minor && (
                            <button
                              type="button"
                              onClick={() => {
                                const el = document.getElementById(`guardian-${row.id}`);
                                if (el) {
                                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                                  el.classList.add("ring-2", "ring-destructive");
                                  window.setTimeout(() => el.classList.remove("ring-2", "ring-destructive"), 1600);
                                }
                              }}
                              className="text-[10px] font-medium text-destructive underline underline-offset-2 hover:text-destructive/80"
                            >
                              Jump to guardian details →
                            </button>
                          )}
                        </div>
                        {row.is_minor && (
                          <div id={`guardian-${row.id}`} className="rounded-md border border-destructive/40 bg-destructive/5 p-2 text-xs space-y-0.5 transition-shadow">
                            <p className="font-semibold text-destructive uppercase tracking-wide text-[10px]">Guardian — Minor Applicant{row.applicant_age != null ? ` (age ${row.applicant_age})` : ""}</p>
                            <p><span className="text-muted-foreground">Name:</span> {row.parent_guardian_full_name ?? "—"}</p>
                            <p><span className="text-muted-foreground">Relationship:</span> {row.parent_guardian_relationship ?? "—"}</p>
                            <p><span className="text-muted-foreground">Email:</span> {row.parent_guardian_email ?? "—"}</p>
                            <p><span className="text-muted-foreground">Phone:</span> {row.parent_guardian_phone ?? "—"}</p>
                            <p><span className="text-muted-foreground">Consent:</span> {row.parent_guardian_consent ? "✓ Granted" : "✗ Not granted"}</p>
                            <p><span className="text-muted-foreground">Acknowledgment:</span> {row.parent_guardian_authorization_acknowledgment ? "✓ Confirmed" : "✗ Missing"}</p>
                          </div>
                        )}
                        {row.notes && (
                          <div className="max-h-36 overflow-y-auto rounded-md border border-primary/30 bg-primary/5 p-2 text-xs whitespace-pre-wrap">
                            <p className="mb-1 font-semibold uppercase tracking-wide text-[10px] text-primary">Applicant submission</p>
                            {row.notes}
                          </div>
                        )}
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
                    <tr className="border-b border-border bg-background/30">
                      <td colSpan={21} className="px-3 py-3 space-y-4">
                        <TelegramPreviewPanel row={row} />
                        <CandidateMessagingPanel
                          submissionId={row.id}
                          telegramChatId={row.telegram_chat_id}
                          applicationMode={row.application_mode}
                          candidateOutcome={row.candidate_outcome}
                          priorityTier={row.priority_tier}
                          tags={row.tags}
                          onSegmentationSaved={(next) => {
                            setRows((prev) =>
                              prev.map((item) => (item.id === row.id ? { ...item, ...next } : item)),
                            );
                          }}
                        />
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
