import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import AdminBackLink from "@/components/admin/AdminBackLink";
import {
  Plus,
  Save,
  Trash2,
  Loader2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";

type OppRow = {
  id: string;
  title: string;
  description: string | null;
  status_label: string | null;
  application_mode: string;
  opportunity_slug: string;
  opportunity_title: string | null;
  button_label: string | null;
  type_label: string | null;
  category_options: string[] | null;
  featured: boolean;
  is_active: boolean;
  sort_order: number;
  starts_at: string | null;
  ends_at: string | null;
  location: string | null;
  contact_phone: string | null;
};

type Draft = OppRow & { _dirty?: boolean; _isNew?: boolean };

const APPLICATION_MODES = [
  "casting",
  "representation",
  "media_opportunity",
  "brand_campaign",
  "training_development",
  "general",
];

const STATUS_LABELS = ["Active", "Upcoming", "Ongoing", "Closing Soon", "Closed"];

const SLUG_RE = /^[a-z0-9_]{1,80}$/;

const blankDraft = (sort_order: number): Draft => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  status_label: "Active",
  application_mode: "casting",
  opportunity_slug: "",
  opportunity_title: "",
  button_label: "Submit for Review",
  type_label: "",
  category_options: [],
  featured: false,
  is_active: true,
  sort_order,
  starts_at: null,
  ends_at: null,
  location: null,
  contact_phone: null,
  _dirty: true,
  _isNew: true,
});

export default function AdminOpportunities() {
  const [rows, setRows] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("opportunity_cards")
      .select("*")
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load opportunities", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    setRows(
      (data ?? []).map((r) => ({
        ...(r as unknown as OppRow),
        category_options: Array.isArray(r.category_options)
          ? (r.category_options as string[])
          : [],
      })),
    );
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const updateRow = (idx: number, patch: Partial<Draft>) => {
    setRows((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch, _dirty: true };
      return next;
    });
  };

  const addRow = () => {
    const maxOrder = rows.reduce((m, r) => Math.max(m, r.sort_order), 0);
    setRows((prev) => [...prev, blankDraft(maxOrder + 1)]);
  };

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= rows.length) return;
    setRows((prev) => {
      const next = [...prev];
      const a = { ...next[idx] };
      const b = { ...next[target] };
      const tmp = a.sort_order;
      a.sort_order = b.sort_order;
      b.sort_order = tmp;
      a._dirty = true;
      b._dirty = true;
      next[idx] = b;
      next[target] = a;
      return next;
    });
  };

  const save = async (idx: number) => {
    const row = rows[idx];
    const trimmedSlug = (row.opportunity_slug || "").trim().toLowerCase();
    if (!row.title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    if (!row.application_mode || !APPLICATION_MODES.includes(row.application_mode)) {
      toast({ title: "Valid application mode required", variant: "destructive" });
      return;
    }
    if (!SLUG_RE.test(trimmedSlug)) {
      toast({
        title: "Invalid slug",
        description: "Use lowercase letters, numbers, underscores only (max 80).",
        variant: "destructive",
      });
      return;
    }

    // Duplicate slug guard against other rows
    const dup = rows.find((other, i) => i !== idx && (other.opportunity_slug || "").trim().toLowerCase() === trimmedSlug);
    if (dup) {
      toast({ title: "Duplicate slug", description: `Slug "${trimmedSlug}" already exists.`, variant: "destructive" });
      return;
    }

    setSavingId(row.id);
    const payload = {
      title: row.title.trim(),
      description: row.description?.trim() || null,
      status_label: row.status_label || null,
      application_mode: row.application_mode,
      opportunity_slug: trimmedSlug,
      opportunity_title: (row.opportunity_title || row.title).trim(),
      button_label: row.button_label?.trim() || "Submit for Review",
      type_label: row.type_label?.trim() || null,
      category_options: Array.isArray(row.category_options) ? row.category_options : [],
      featured: !!row.featured,
      is_active: !!row.is_active,
      sort_order: Number.isFinite(row.sort_order) ? row.sort_order : 0,
      starts_at: row.starts_at,
      ends_at: row.ends_at,
      location: row.location?.trim() || null,
      contact_phone: row.contact_phone?.trim() || null,
    };

    let resultId = row.id;
    if (row._isNew) {
      const { data, error } = await supabase
        .from("opportunity_cards")
        .insert(payload)
        .select("id")
        .single();
      if (error) {
        toast({ title: "Save failed", description: error.message, variant: "destructive" });
        setSavingId(null);
        return;
      }
      resultId = data.id;
    } else {
      const { error } = await supabase
        .from("opportunity_cards")
        .update(payload)
        .eq("id", row.id);
      if (error) {
        toast({ title: "Save failed", description: error.message, variant: "destructive" });
        setSavingId(null);
        return;
      }
    }

    setRows((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], id: resultId, _dirty: false, _isNew: false };
      return next;
    });
    setSavingId(null);
    toast({ title: "Saved", description: `"${payload.title}" saved.` });
  };

  const remove = async (idx: number) => {
    const row = rows[idx];
    if (row._isNew) {
      setRows((prev) => prev.filter((_, i) => i !== idx));
      return;
    }
    if (!confirm(`Delete "${row.title}"? This cannot be undone. Prefer marking inactive.`)) return;
    const { error } = await supabase.from("opportunity_cards").delete().eq("id", row.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setRows((prev) => prev.filter((_, i) => i !== idx));
    toast({ title: "Deleted" });
  };

  const dirtyCount = useMemo(() => rows.filter((r) => r._dirty).length, [rows]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40">
        <div className="container-wide px-5 sm:px-8 lg:px-12 py-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <AdminBackLink />
            <h1 className="font-display text-2xl sm:text-3xl">Opportunities Manager</h1>
            <p className="text-sm text-muted-foreground">
              Public Opportunities page reads from this list. Featured cards appear first. Inactive cards are hidden.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/opportunities" target="_blank" rel="noreferrer">Preview public page</a>
            </Button>
            <Button size="sm" onClick={addRow}>
              <Plus className="w-4 h-4 mr-1" /> New opportunity
            </Button>
          </div>
        </div>
      </header>

      <main className="container-wide px-5 sm:px-8 lg:px-12 py-8 space-y-6">
        {loading ? (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading opportunities…
          </p>
        ) : rows.length === 0 ? (
          <div className="card-premium p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">No opportunity cards yet.</p>
            <Button onClick={addRow}>
              <Plus className="w-4 h-4 mr-1" /> Create the first one
            </Button>
          </div>
        ) : (
          <>
            {dirtyCount > 0 && (
              <div className="text-xs text-primary bg-primary/10 border border-primary/30 rounded px-3 py-2">
                {dirtyCount} unsaved change{dirtyCount === 1 ? "" : "s"} — click Save on each row to publish.
              </div>
            )}
            <div className="space-y-5">
              {rows.map((row, idx) => (
                <article
                  key={row.id}
                  className="card-premium p-5 sm:p-6 border border-border/50 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-primary bg-primary/10 px-2 py-0.5 rounded">
                        #{row.sort_order}
                      </span>
                      {row.featured && (
                        <span className="text-[10px] uppercase tracking-[0.18em] bg-yellow-500/15 text-yellow-400 px-2 py-0.5 rounded inline-flex items-center gap-1">
                          <Star className="w-3 h-3" /> Featured
                        </span>
                      )}
                      <span
                        className={`text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded inline-flex items-center gap-1 ${
                          row.is_active
                            ? "bg-green-900/30 text-green-400"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {row.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {row.is_active ? "Live" : "Hidden"}
                      </span>
                      {row._dirty && (
                        <span className="text-[10px] uppercase tracking-[0.18em] text-yellow-400">Unsaved</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" onClick={() => move(idx, -1)} title="Move up">
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => move(idx, 1)} title="Move down">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Title</Label>
                      <Input
                        value={row.title}
                        onChange={(e) => updateRow(idx, { title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Type label (small chip)</Label>
                      <Input
                        value={row.type_label || ""}
                        onChange={(e) => updateRow(idx, { type_label: e.target.value })}
                        placeholder="e.g. Casting, Showcase"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <Textarea
                      rows={3}
                      value={row.description || ""}
                      onChange={(e) => updateRow(idx, { description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label>Status</Label>
                      <select
                        className="w-full px-3 py-2 bg-secondary/60 border border-border/60 rounded-md text-sm"
                        value={row.status_label || ""}
                        onChange={(e) => updateRow(idx, { status_label: e.target.value })}
                      >
                        {STATUS_LABELS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Application mode</Label>
                      <select
                        className="w-full px-3 py-2 bg-secondary/60 border border-border/60 rounded-md text-sm"
                        value={row.application_mode}
                        onChange={(e) => updateRow(idx, { application_mode: e.target.value })}
                      >
                        {APPLICATION_MODES.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Sort order</Label>
                      <Input
                        type="number"
                        value={row.sort_order}
                        onChange={(e) => updateRow(idx, { sort_order: Number(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Opportunity slug (URL identifier)</Label>
                      <Input
                        value={row.opportunity_slug}
                        onChange={(e) =>
                          updateRow(idx, {
                            opportunity_slug: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"),
                          })
                        }
                        placeholder="lowercase_with_underscores"
                      />
                      <p className="text-[10px] text-muted-foreground">
                        Routes to: /submit?mode={row.application_mode}&opportunity={row.opportunity_slug || "…"}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Public opportunity title (shown on Submit page)</Label>
                      <Input
                        value={row.opportunity_title || ""}
                        onChange={(e) => updateRow(idx, { opportunity_title: e.target.value })}
                        placeholder="Defaults to Title if empty"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Category options (one per line — leave empty to show all categories)</Label>
                    <Textarea
                      rows={5}
                      value={(row.category_options || []).join("\n")}
                      onChange={(e) =>
                        updateRow(idx, {
                          category_options: e.target.value
                            .split(/\r?\n/)
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder={"Model\nActor / Performer\n…"}
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Shown on the Submit page Primary Category dropdown for this opportunity.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Location (optional)</Label>
                      <Input
                        value={row.location || ""}
                        onChange={(e) => updateRow(idx, { location: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Contact phone (optional)</Label>
                      <Input
                        value={row.contact_phone || ""}
                        onChange={(e) => updateRow(idx, { contact_phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-wrap pt-2 border-t border-border/40">
                    <label className="flex items-center gap-2 text-sm">
                      <Switch
                        checked={row.featured}
                        onCheckedChange={(v) => updateRow(idx, { featured: v })}
                      />
                      Featured
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Switch
                        checked={row.is_active}
                        onCheckedChange={(v) => updateRow(idx, { is_active: v })}
                      />
                      Active (visible publicly)
                    </label>
                    <div className="flex-1" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => remove(idx)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => save(idx)}
                      disabled={savingId === row.id}
                    >
                      {savingId === row.id ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-1" />
                      )}
                      Save
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
