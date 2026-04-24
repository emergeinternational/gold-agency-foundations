import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, Save, Loader2 } from "lucide-react";

type BannerRow = {
  id: string;
  text: string;
  featured: boolean;
  is_active: boolean;
  sort_order: number;
  display_ms: number;
  link_url: string | null;
};

type Draft = Omit<BannerRow, "id"> & { id?: string; _dirty?: boolean };

const blankDraft = (sort_order: number): Draft => ({
  text: "",
  featured: false,
  is_active: true,
  sort_order,
  display_ms: 4500,
  link_url: "",
  _dirty: true,
});

export default function AdminBanners() {
  const [rows, setRows] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("banner_messages")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    } else {
      setRows((data || []) as Draft[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setAuthorized(false);
        return;
      }
      const { data: roleRows } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id);
      const ok = (roleRows || []).some((r: any) =>
        ["admin", "superadmin", "founder"].includes(r.role),
      );
      setAuthorized(ok);
      if (ok) load();
    })();
  }, []);

  const update = (idx: number, patch: Partial<Draft>) => {
    setRows((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch, _dirty: true };
      return next;
    });
  };

  const save = async (idx: number) => {
    const row = rows[idx];
    if (!row.text.trim()) {
      toast({ title: "Message text required", variant: "destructive" });
      return;
    }
    setSavingId(row.id || `new-${idx}`);
    const payload = {
      text: row.text,
      featured: row.featured,
      is_active: row.is_active,
      sort_order: row.sort_order,
      display_ms: row.display_ms,
      link_url: row.link_url || null,
    };
    if (row.id) {
      const { error } = await supabase.from("banner_messages").update(payload).eq("id", row.id);
      if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
      else toast({ title: "Saved" });
    } else {
      const { data, error } = await supabase.from("banner_messages").insert(payload).select().single();
      if (error) toast({ title: "Create failed", description: error.message, variant: "destructive" });
      else {
        setRows((prev) => {
          const next = [...prev];
          next[idx] = data as Draft;
          return next;
        });
        toast({ title: "Created" });
      }
    }
    setSavingId(null);
  };

  const remove = async (idx: number) => {
    const row = rows[idx];
    if (!confirm("Delete this banner message?")) return;
    if (row.id) {
      const { error } = await supabase.from("banner_messages").delete().eq("id", row.id);
      if (error) {
        toast({ title: "Delete failed", description: error.message, variant: "destructive" });
        return;
      }
    }
    setRows((prev) => prev.filter((_, i) => i !== idx));
    toast({ title: "Deleted" });
  };

  const addNew = () => {
    const maxOrder = rows.reduce((m, r) => Math.max(m, r.sort_order || 0), 0);
    setRows((prev) => [...prev, blankDraft(maxOrder + 1)]);
  };

  if (authorized === false) {
    return (
      <Layout>
        <div className="container-wide px-5 sm:px-8 lg:px-12 py-16">
          <h1 className="text-2xl font-serif">Access denied</h1>
          <p className="text-muted-foreground mt-2">You need admin privileges to manage banners.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-wide px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif">Announcement Banner</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage the rotating messages shown at the top of every page. Featured messages display longer.
            </p>
          </div>
          <Button onClick={addNew} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" /> Add message
          </Button>
        </div>

        {loading || authorized === null ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground">No banner messages yet. Click "Add message" to create one.</p>
        ) : (
          <div className="space-y-5">
            {rows.map((row, idx) => (
              <div
                key={row.id || `new-${idx}`}
                className="border border-border rounded-lg p-5 bg-card space-y-4"
              >
                <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-start">
                  <div className="space-y-2">
                    <Label>Message text</Label>
                    <Textarea
                      value={row.text}
                      onChange={(e) => update(idx, { text: e.target.value })}
                      rows={2}
                      placeholder="Your announcement…"
                    />
                  </div>
                  <div className="flex sm:flex-col gap-3 sm:items-end">
                    <Button
                      size="sm"
                      onClick={() => save(idx)}
                      disabled={savingId === (row.id || `new-${idx}`)}
                      className="gap-2"
                    >
                      {savingId === (row.id || `new-${idx}`) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(idx)} className="gap-2 text-destructive">
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Sort order</Label>
                    <Input
                      type="number"
                      value={row.sort_order}
                      onChange={(e) => update(idx, { sort_order: parseInt(e.target.value || "0", 10) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Display time (ms)</Label>
                    <Input
                      type="number"
                      step={500}
                      value={row.display_ms}
                      onChange={(e) => update(idx, { display_ms: parseInt(e.target.value || "4500", 10) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link URL (optional)</Label>
                    <Input
                      value={row.link_url || ""}
                      onChange={(e) => update(idx, { link_url: e.target.value })}
                      placeholder="/opportunities"
                    />
                  </div>
                  <div className="flex flex-col gap-3 justify-end pb-1">
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor={`featured-${idx}`} className="text-xs uppercase tracking-wider text-muted-foreground">
                        Featured
                      </Label>
                      <Switch
                        id={`featured-${idx}`}
                        checked={row.featured}
                        onCheckedChange={(v) => update(idx, { featured: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor={`active-${idx}`} className="text-xs uppercase tracking-wider text-muted-foreground">
                        Active
                      </Label>
                      <Switch
                        id={`active-${idx}`}
                        checked={row.is_active}
                        onCheckedChange={(v) => update(idx, { is_active: v })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
