import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type SubmissionMessage = {
  id: string;
  direction: "inbound" | "outbound";
  message_type: string | null;
  template_key: string | null;
  content: string | null;
  file_url: string | null;
  delivery_status: string | null;
  reviewed: boolean;
  created_at: string;
};

type Props = {
  submissionId: string;
  telegramChatId: string | null;
  applicationMode: string | null;
  candidateOutcome: string | null;
  priorityTier: string | null;
  tags: string[] | null;
  onSegmentationSaved?: (next: {
    candidate_outcome: string | null;
    priority_tier: string | null;
    tags: string[] | null;
  }) => void;
};

const TEMPLATES: Array<{ key: string; label: string; needsStructured?: boolean }> = [
  { key: "", label: "— No template (custom only) —" },
  { key: "request_photos", label: "Request photos" },
  { key: "request_video", label: "Request video" },
  { key: "request_links", label: "Request links" },
  { key: "casting_invite", label: "Casting invite", needsStructured: true },
  { key: "not_selected", label: "Not selected (saved for future)" },
  { key: "recommend_training", label: "Recommend training" },
  { key: "fast_track", label: "Fast-track talent" },
];

const OUTCOME_OPTIONS = [
  "",
  "connected",
  "under_review",
  "needs_more_info",
  "invited_to_next_step",
  "selected_for_casting",
  "not_selected_current_opportunity",
  "saved_for_future_opportunities",
  "recommended_for_training",
  "scheduled",
  "completed",
];

const PRIORITY_OPTIONS = ["standard", "priority", "high_value"];

const formatLabel = (value: string) =>
  value
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export function CandidateMessagingPanel({
  submissionId,
  telegramChatId,
  applicationMode,
  candidateOutcome,
  priorityTier,
  tags,
  onSegmentationSaved,
}: Props) {
  const [messages, setMessages] = useState<SubmissionMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [templateKey, setTemplateKey] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [link, setLink] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);

  const [outcomeDraft, setOutcomeDraft] = useState(candidateOutcome ?? "");
  const [priorityDraft, setPriorityDraft] = useState(priorityTier ?? "standard");
  const [tagsDraft, setTagsDraft] = useState((tags ?? []).join(", "));
  const [savingSeg, setSavingSeg] = useState(false);

  const isConnected = Boolean(telegramChatId);
  const selectedTemplate = TEMPLATES.find((t) => t.key === templateKey);
  const showStructured = selectedTemplate?.needsStructured ?? false;

  const loadMessages = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("submission_messages")
      .select("id, direction, message_type, template_key, content, file_url, delivery_status, reviewed, created_at")
      .eq("submission_id", submissionId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (err) setError(err.message);
    else setMessages((data ?? []) as SubmissionMessage[]);
    setLoading(false);
  };

  useEffect(() => {
    void loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId]);

  const unreviewedInbound = messages.filter((m) => m.direction === "inbound" && !m.reviewed).length;

  const handleSend = async () => {
    setSending(true);
    setSendStatus(null);
    setError(null);

    try {
      const { data, error: err } = await supabase.functions.invoke("admin-telegram-message", {
        body: {
          submission_id: submissionId,
          template_key: templateKey || null,
          body: customBody.trim() || undefined,
          structured: showStructured
            ? {
                date: date || null,
                time: time || null,
                location: location || null,
                contact: contact || null,
                link: link || null,
              }
            : null,
        },
      });

      if (err) {
        setError(err.message ?? "Failed to send");
      } else if (data && typeof data === "object") {
        const result = data as { ok?: boolean; delivery_status?: string; error?: string };
        if (result.ok) {
          setSendStatus(`Sent (${result.delivery_status ?? "ok"})`);
          setCustomBody("");
          setTemplateKey("");
          setDate("");
          setTime("");
          setLocation("");
          setContact("");
          setLink("");
          await loadMessages();
        } else {
          setError(result.error ?? `Delivery failed (${result.delivery_status ?? "unknown"})`);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
      setConfirming(false);
    }
  };

  const handleMarkReviewed = async (messageId: string) => {
    const { error: err } = await supabase
      .from("submission_messages")
      .update({ reviewed: true })
      .eq("id", messageId);
    if (!err) {
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, reviewed: true } : m)));
    }
  };

  const handleSaveSegmentation = async () => {
    setSavingSeg(true);
    setError(null);
    const parsedTags = tagsDraft
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = {
      candidate_outcome: outcomeDraft || null,
      priority_tier: priorityDraft || "standard",
      tags: parsedTags.length > 0 ? parsedTags : null,
    };
    const { error: err } = await supabase.from("submissions").update(payload).eq("id", submissionId);
    if (err) setError(err.message);
    else onSegmentationSaved?.(payload);
    setSavingSeg(false);
  };

  return (
    <div className="space-y-4 rounded-md border border-border/60 bg-background/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Telegram</span>
          {isConnected ? (
            <span className="rounded-full bg-green-900/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-green-300">
              Connected
            </span>
          ) : (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              Not Connected
            </span>
          )}
          {applicationMode && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary">
              {formatLabel(applicationMode)}
            </span>
          )}
          {priorityTier && priorityTier !== "standard" && (
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary">
              {formatLabel(priorityTier)}
            </span>
          )}
          {candidateOutcome && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-foreground/80">
              {formatLabel(candidateOutcome)}
            </span>
          )}
          {unreviewedInbound > 0 && (
            <span className="rounded-full bg-destructive/30 px-2 py-0.5 text-[10px] uppercase tracking-wider text-destructive-foreground">
              {unreviewedInbound} new reply{unreviewedInbound === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </div>

      {!isConnected && (
        <p className="rounded-sm border border-amber-700/40 bg-amber-900/20 px-3 py-2 text-xs text-amber-200">
          Telegram not connected. Candidate must press Start in @AscendAgencybot before direct updates can be sent.
        </p>
      )}

      {/* Send controls */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Send Telegram update</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <select
            value={templateKey}
            onChange={(e) => setTemplateKey(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            {TEMPLATES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {showStructured && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Input placeholder="Date (e.g. 2026-05-12)" value={date} onChange={(e) => setDate(e.target.value)} />
            <Input placeholder="Time (e.g. 14:00)" value={time} onChange={(e) => setTime(e.target.value)} />
            <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <Input placeholder="Contact phone" value={contact} onChange={(e) => setContact(e.target.value)} />
            <Input
              className="sm:col-span-2"
              placeholder="Optional link (https://...)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
        )}

        <Textarea
          rows={3}
          placeholder="Optional custom message (appended after template)"
          value={customBody}
          onChange={(e) => setCustomBody(e.target.value)}
        />

        {!confirming ? (
          <Button
            size="sm"
            variant="gold"
            disabled={!isConnected || sending || (!templateKey && !customBody.trim())}
            onClick={() => setConfirming(true)}
          >
            Preview & send
          </Button>
        ) : (
          <div className="space-y-2 rounded-md border border-primary/30 bg-primary/5 p-3">
            <p className="text-xs uppercase tracking-wide text-primary">Confirm send</p>
            <p className="text-xs text-muted-foreground">
              Destination: Telegram chat <code>{telegramChatId}</code>
            </p>
            <p className="text-xs text-muted-foreground">
              Template: <strong>{selectedTemplate?.label ?? "Custom only"}</strong>
            </p>
            {customBody.trim() && (
              <pre className="whitespace-pre-wrap rounded-sm bg-background/60 p-2 text-xs">{customBody}</pre>
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="gold" disabled={sending} onClick={handleSend}>
                {sending ? "Sending…" : "Confirm send"}
              </Button>
              <Button size="sm" variant="outline" disabled={sending} onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {sendStatus && <p className="text-xs text-green-400">{sendStatus}</p>}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      {/* Segmentation */}
      <div className="space-y-2 border-t border-border/60 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Segmentation</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <select
            value={outcomeDraft}
            onChange={(e) => setOutcomeDraft(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            {OUTCOME_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o ? formatLabel(o) : "— Outcome —"}
              </option>
            ))}
          </select>
          <select
            value={priorityDraft}
            onChange={(e) => setPriorityDraft(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {formatLabel(p)}
              </option>
            ))}
          </select>
          <Input placeholder="Tags (comma-separated)" value={tagsDraft} onChange={(e) => setTagsDraft(e.target.value)} />
        </div>
        <Button size="sm" variant="secondary" disabled={savingSeg} onClick={handleSaveSegmentation}>
          {savingSeg ? "Saving…" : "Save segmentation"}
        </Button>
      </div>

      {/* Message history */}
      <div className="space-y-2 border-t border-border/60 pt-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message history</p>
          <Button size="sm" variant="ghost" onClick={loadMessages} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </Button>
        </div>
        {messages.length === 0 ? (
          <p className="text-xs text-muted-foreground">No messages yet.</p>
        ) : (
          <ul className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {messages.map((m) => (
              <li
                key={m.id}
                className={`rounded-sm border px-2 py-1.5 text-xs ${
                  m.direction === "inbound"
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/60 bg-secondary/40"
                }`}
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {m.direction === "inbound" ? "← Candidate" : "→ Admin"} ·{" "}
                    {m.message_type ?? "text"}
                    {m.template_key ? ` · ${m.template_key}` : ""}
                    {" · "}
                    {new Date(m.created_at).toLocaleString()}
                  </span>
                  {m.direction === "inbound" && !m.reviewed && (
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px]" onClick={() => handleMarkReviewed(m.id)}>
                      Mark reviewed
                    </Button>
                  )}
                </div>
                {m.content && <pre className="whitespace-pre-wrap text-xs">{m.content}</pre>}
                {m.file_url && (
                  <p className="text-[10px] text-muted-foreground">
                    File ID: <code>{m.file_url}</code>
                  </p>
                )}
                {m.delivery_status && m.delivery_status !== "sent" && m.delivery_status !== "received" && (
                  <p className="mt-1 text-[10px] text-amber-300">Delivery: {m.delivery_status}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
