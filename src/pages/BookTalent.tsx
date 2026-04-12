import { useState } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { BRAND } from "@/lib/brand";

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "ETB", label: "ETB (Br)" },
  { value: "AED", label: "AED (د.إ)" },
  { value: "KES", label: "KES (KSh)" },
  { value: "ZAR", label: "ZAR (R)" },
  { value: "CAD", label: "CAD ($)" },
  { value: "other", label: "Other" },
];

const BUDGET_RANGES = [
  { value: "under-1000", label: "Under 1,000" },
  { value: "1000-5000", label: "1,000 – 5,000" },
  { value: "5000-15000", label: "5,000 – 15,000" },
  { value: "15000-50000", label: "15,000 – 50,000" },
  { value: "50000+", label: "50,000+" },
  { value: "discuss", label: "Prefer to discuss" },
];

const bookingHero = "/booktalent";

export default function BookTalent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "", fullName: "", email: "", phone: "",
    country: "", projectType: "", talentType: "", date: "", location: "",
    budgetCurrency: "USD", budgetRange: "", projectDescription: "", preferredContact: "email",
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.companyName.trim()) e.companyName = "Required";
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email";
    if (!form.projectType.trim()) e.projectType = "Required";
    if (!form.projectDescription.trim()) e.projectDescription = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) navigate("/booking-success");
  };

  const inputClass = "w-full px-4 py-3 bg-secondary/60 border border-border/60 rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300 text-sm";
  const labelClass = "block text-xs font-medium text-foreground/80 mb-1.5 tracking-wide uppercase";
  const errorClass = "text-[11px] text-destructive mt-1";

  return (
    <Layout>
      <PageHero
        badge="Global Talent Booking"
        title="Book From Our Roster"
        subtitle="We connect brands, production teams, event producers, and campaign directors worldwide with vetted professional talent across every creative discipline — locally and internationally."
        backgroundImage={bookingHero}
        backgroundPosition="center 24%"
        overlayVariant="enhanced"
      />

      <section className="section-padding">
        <div className="container-narrow">
          <p className="text-muted-foreground text-sm mb-10 max-w-2xl">
            We welcome inquiries from any market. Whether your project serves audiences across Africa and global markets — our team will respond with availability, recommendations, and next steps.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* --- Client Information --- */}
            <fieldset>
              <legend className="font-display text-xl font-semibold text-foreground mb-6">Client Information</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Company / Organization *</label>
                  <input className={inputClass} value={form.companyName} onChange={e => update("companyName", e.target.value)} placeholder="Organization or brand name" />
                  {errors.companyName && <p className={errorClass}>{errors.companyName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input className={inputClass} value={form.fullName} onChange={e => update("fullName", e.target.value)} placeholder="Your full name" />
                  {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input className={inputClass} type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@company.com" />
                  {errors.email && <p className={errorClass}>{errors.email}</p>}
                </div>
                <div>
                  <label className={labelClass}>Phone (with country code)</label>
                  <input className={inputClass} type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+1, +251, +44, +971…" />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input className={inputClass} value={form.country} onChange={e => update("country", e.target.value)} placeholder="Where are you based?" />
                </div>
                <div>
                  <label className={labelClass}>Preferred Contact Method</label>
                  <select className={inputClass} value={form.preferredContact} onChange={e => update("preferredContact", e.target.value)}>
                    <option value="email">Email</option>
                    <option value="phone">Phone / Video Call</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
              </div>
            </fieldset>

            {/* --- Project Details --- */}
            <fieldset>
              <legend className="font-display text-xl font-semibold text-foreground mb-6">Project Details</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Project Type *</label>
                  <select className={inputClass} value={form.projectType} onChange={e => update("projectType", e.target.value)}>
                    <option value="">Select type</option>
                    <option value="brand-campaign">Brand Campaign</option>
                    <option value="event">Event / Live Appearance</option>
                    <option value="media-production">Media / Film / TV Production</option>
                    <option value="casting">Casting / Audition</option>
                    <option value="endorsement">Endorsement / Ambassadorship</option>
                    <option value="digital">Digital / Social Content</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.projectType && <p className={errorClass}>{errors.projectType}</p>}
                </div>
                <div>
                  <label className={labelClass}>Talent Category Needed</label>
                  <input className={inputClass} value={form.talentType} onChange={e => update("talentType", e.target.value)} placeholder="e.g., Host, Model, Musician, Actor" />
                </div>
                <div>
                  <label className={labelClass}>Project Date</label>
                  <input className={inputClass} type="date" value={form.date} onChange={e => update("date", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Project Location</label>
                  <input className={inputClass} value={form.location} onChange={e => update("location", e.target.value)} placeholder="City, Country — or Remote" />
                </div>

                {/* --- Budget with Currency Selector --- */}
                <div>
                  <label className={labelClass}>Currency</label>
                  <select className={inputClass} value={form.budgetCurrency} onChange={e => update("budgetCurrency", e.target.value)}>
                    {CURRENCIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Indicative Budget Range</label>
                  <select className={inputClass} value={form.budgetRange} onChange={e => update("budgetRange", e.target.value)}>
                    <option value="">Select range</option>
                    {BUDGET_RANGES.map(b => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">Ranges are indicative — final terms are discussed with our team.</p>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Project Description *</label>
                  <textarea className={`${inputClass} min-h-[120px]`} value={form.projectDescription} onChange={e => update("projectDescription", e.target.value)} placeholder="Describe the scope, creative direction, timeline, and what you need from talent. Include any regional or market-specific details." maxLength={3000} />
                  {errors.projectDescription && <p className={errorClass}>{errors.projectDescription}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Attach Brief or Reference (Optional)</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/40 transition-colors bg-secondary/30">
                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">{file ? file.name : "Upload a brief, deck, or reference image · PDF or image"}</span>
                    <input type="file" accept=".pdf,image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>
            </fieldset>

            <Button type="submit" variant="hero" size="xl" className="w-full sm:w-auto">
              Send Booking Inquiry
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
