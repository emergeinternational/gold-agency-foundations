import { useEffect, useMemo, useState } from "react";
import { Archive, Loader2, Save } from "lucide-react";
import AdminBackLink from "@/components/admin/AdminBackLink";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type SourceTable = "partner_inquiries" | "partnership_inquiries";

type Inquiry = {
  id: string;
  sourceTable: SourceTable;
  created_at: string;
  inquiry_type: string | null;
  name: string | null;
  organization: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  status: string;
  notes: string | null;
};

const STATUS_OPTIONS = ["new", "review", "responded", "closed"];

const normalizeStatus = (value: string | null) =>
  value && STATUS_OPTIONS.includes(value) ? value : "new";

export default function AdminInquiries() {
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("open");

  const load = async () => {
    setLoading(true);
    const [genericResult, partnershipResult] = await Promise.all([
      supabase
        .from("partner_inquiries")
        .select("id, created_at, inquiry_type, name, email, phone, company, message, status, notes")
        .order("created_at", { ascending: false }),
      supabase
        .from("partnership_inquiries")
        .select("id, created_at, inquiry_type, contact_name, organization, email, phone, message, status, admin_notes")
        .order("created_at", { ascending: false }),
    ]);

    if (genericResult.error || partnershipResult.error) {
      console.error("admin inquiries load error", genericResult.error || partnershipResult.error);
      toast({ title: "Could not load inquiries", variant: "destructive" });
      setRows([]);
      setLoading(false);
      return;
    }

    const genericRows: Inquiry[] = (genericResult.data || []).map((row) => ({
      id: row.id,
      sourceTable: "partner_inquiries",
      created_at: row.created_at,
      inquiry_type: row.inquiry_type,
      name: row.name,
      organization: row.company,
      email: row.email,
      phone: row.phone,
      message: row.message,
      status: normalizeStatus(row.status),
      notes: row.notes,
    }));

    const partnershipRows: Inquiry[] = (partnershipResult.data || []).map((row) => ({
      id: row.id,
      sourceTable: "partnership_inquiries",
      created_at: row.created_at,
      inquiry_type: row.inquiry_type,
      name: row.contact_name,
      organization: row.organization,
      email: row.email,
      phone: row.phone,
      message: row.message,
      status: normalizeStatus(row.status),
      notes: row.admin_notes,
    }));

    setRows([...genericRows, ...partnershipRows].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateRow = (id: string, patch: Partial<Inquiry>) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const save = async (row: Inquiry) => {
    setSavingId(row.id);
    const payload =
      row.sourceTable === "partner_inquiries"
        ? { status: row.status, notes: row.notes?.trim() || null }
        : { status: row.status, admin_notes: row.notes?.trim() || null };
    const { error } = await supabase.from(row.sourceTable).update(payload).eq("id", row.id);
    setSavingId(null);

    if (error) {
      console.error("admin inquiry save error", error);
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Inquiry updated" });
  };

  const filteredRows = useMemo(() => {
    if (statusFilter === "all") return rows;
    if (statusFilter === "open") return rows.filter((row) => row.status !== "closed");
    return rows.filter((row) => row.status === statusFilter);
  }, [rows, statusFilter]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40">
        <div className="container-wide px-5 sm:px-8 lg:px-12 py-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <AdminBackLink />
            <h1 className="font-display text-2xl sm:text-3xl">Inquiry Manager</h1>
            <p className="text-sm text-muted-foreground">
              Contact, booking, and partnership inquiries from public site forms.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="status-filter" className="text-xs uppercase tracking-wide text-muted-foreground">
              Status
            </Label>
            <select
              id="status-filter"
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="open">Open</option>
              <option value="all">All</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="container-wide px-5 sm:px-8 lg:px-12 py-8 space-y-5">
        {loading ? (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading inquiries...
          </p>
        ) : filteredRows.length === 0 ? (
          <div className="card-premium p-8 text-center">
            <p className="text-sm text-muted-foreground">No inquiries match this filter.</p>
          </div>
        ) : (
          filteredRows.map((row) => (
            <article key={`${row.sourceTable}-${row.id}`} className="card-premium p-5 sm:p-6 border border-border/50 space-y-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {row.inquiry_type || "general"}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] bg-secondary text-muted-foreground px-2 py-0.5 rounded">
                      {row.status}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] bg-secondary text-muted-foreground px-2 py-0.5 rounded">
                      {row.sourceTable === "partner_inquiries" ? "Contact/Booking" : "Partnership"}
                    </span>
                  </div>
                  <h2 className="font-display text-xl">{row.organization || row.name || "Untitled inquiry"}</h2>
                  <p className="text-xs text-muted-foreground">{new Date(row.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={row.status}
                    onChange={(event) => updateRow(row.id, { status: event.target.value })}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <Button size="sm" onClick={() => save(row)} disabled={savingId === row.id}>
                    {savingId === row.id ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                    Save
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Contact</p>
                  <p>{row.name || "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                  <p>{row.email || "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Phone</p>
                  <p>{row.phone || "-"}</p>
                </div>
              </div>

              <div className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm whitespace-pre-wrap">
                {row.message || "No message provided."}
              </div>

              <div className="space-y-2">
                <Label>Admin notes</Label>
                <Textarea
                  value={row.notes || ""}
                  onChange={(event) => updateRow(row.id, { notes: event.target.value })}
                  placeholder="Add internal follow-up notes"
                  rows={3}
                />
              </div>

              {row.status !== "closed" && (
                <Button variant="outline" size="sm" onClick={() => updateRow(row.id, { status: "closed" })}>
                  <Archive className="w-4 h-4 mr-1" /> Mark closed
                </Button>
              )}
            </article>
          ))
        )}
      </main>
    </div>
  );
}
