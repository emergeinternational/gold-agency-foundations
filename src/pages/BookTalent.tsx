import { useState } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { BRAND } from "@/lib/brand";

export default function BookTalent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "", contactPerson: "", email: "", phone: "",
    projectType: "", talentType: "", date: "", location: "",
    budgetRange: "", projectDescription: "", preferredContact: "email",
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
    if (!form.contactPerson.trim()) e.contactPerson = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
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
      <PageHero badge="Book Talent" title="Access Our Roster" subtitle={`${BRAND.name} connects brands, event organizers, media houses, and production teams with exceptional talent. Tell us about your project.`} />

      <section className="section-padding">
        <div className="container-narrow">
          <form onSubmit={handleSubmit} className="space-y-8">
            <fieldset>
              <legend className="font-display text-xl font-semibold text-foreground mb-6">Your Details</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Company / Organization *</label>
                  <input className={inputClass} value={form.companyName} onChange={e => update("companyName", e.target.value)} placeholder="Company name" />
                  {errors.companyName && <p className={errorClass}>{errors.companyName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Contact Person *</label>
                  <input className={inputClass} value={form.contactPerson} onChange={e => update("contactPerson", e.target.value)} placeholder="Your full name" />
                  {errors.contactPerson && <p className={errorClass}>{errors.contactPerson}</p>}
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input className={inputClass} type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@company.com" />
                  {errors.email && <p className={errorClass}>{errors.email}</p>}
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input className={inputClass} type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+251..." />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-display text-xl font-semibold text-foreground mb-6">Project Details</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Project Type *</label>
                  <select className={inputClass} value={form.projectType} onChange={e => update("projectType", e.target.value)}>
                    <option value="">Select type</option>
                    <option value="brand-campaign">Brand Campaign</option>
                    <option value="event">Event / Live Appearance</option>
                    <option value="media-production">Media Production</option>
                    <option value="casting">Casting / Audition</option>
                    <option value="endorsement">Endorsement</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.projectType && <p className={errorClass}>{errors.projectType}</p>}
                </div>
                <div>
                  <label className={labelClass}>Talent Type Needed</label>
                  <input className={inputClass} value={form.talentType} onChange={e => update("talentType", e.target.value)} placeholder="e.g., Host, Model, Musician" />
                </div>
                <div>
                  <label className={labelClass}>Date</label>
                  <input className={inputClass} type="date" value={form.date} onChange={e => update("date", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input className={inputClass} value={form.location} onChange={e => update("location", e.target.value)} placeholder="City, Country" />
                </div>
                <div>
                  <label className={labelClass}>Budget Range</label>
                  <select className={inputClass} value={form.budgetRange} onChange={e => update("budgetRange", e.target.value)}>
                    <option value="">Select range</option>
                    <option value="under-1000">Under $1,000</option>
                    <option value="1000-5000">$1,000 – $5,000</option>
                    <option value="5000-15000">$5,000 – $15,000</option>
                    <option value="15000-50000">$15,000 – $50,000</option>
                    <option value="50000+">$50,000+</option>
                    <option value="negotiable">Negotiable</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Preferred Contact Method</label>
                  <select className={inputClass} value={form.preferredContact} onChange={e => update("preferredContact", e.target.value)}>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Project Description *</label>
                  <textarea className={`${inputClass} min-h-[120px]`} value={form.projectDescription} onChange={e => update("projectDescription", e.target.value)} placeholder="Describe the project, goals, and what you're looking for in talent." maxLength={3000} />
                  {errors.projectDescription && <p className={errorClass}>{errors.projectDescription}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Attach Brief or Reference (Optional)</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/40 transition-colors bg-secondary/30">
                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">{file ? file.name : "Choose file (PDF, image)"}</span>
                    <input type="file" accept=".pdf,image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>
            </fieldset>

            <Button type="submit" variant="hero" size="xl" className="w-full sm:w-auto">
              Submit Booking Request
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
