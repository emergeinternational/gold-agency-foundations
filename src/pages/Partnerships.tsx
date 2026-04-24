import { useState } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";
import { Handshake, Building, Mic, MapPin, BookOpen, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const partnershipBanner = "/partnerwithus.PNG";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7 as const },
};

const partnerTypes = [
  { icon: Building, title: "Sponsors", desc: "Align your brand with premium talent and high-visibility creative projects that reach engaged audiences." },
  { icon: Handshake, title: "Brand Collaborators", desc: "Co-create campaigns, content, and cultural experiences with professionals from our curated roster." },
  { icon: Mic, title: "Studios & Venues", desc: "Host or co-produce events, live programming, and creative productions through our network." },
  { icon: MapPin, title: "Media Partners", desc: "Access our talent pool for editorial, broadcast, digital, and branded content opportunities." },
  { icon: BookOpen, title: "Educators & Mentors", desc: "Contribute to our development programs as guest instructors, curriculum advisors, or mentorship leads." },
  { icon: TrendingUp, title: "Investors & Institutions", desc: "Support the growth of Ethiopia's creative economy through strategic, long-term collaboration." },
];

// Structured inquiry types stored on the inquiry record (separate from legacy "partner type" UI categories above).
const INQUIRY_TYPES: Array<{ value: string; label: string }> = [
  { value: "brand_partnership", label: "Brand Partnership" },
  { value: "campaign_collaboration", label: "Campaign Collaboration" },
  { value: "venue_partnership", label: "Venue Partnership" },
  { value: "media_partnership", label: "Media Partnership" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "general", label: "General Partnership Inquiry" },
];

export default function Partnerships() {
  const [form, setForm] = useState({ org: "", name: "", email: "", phone: "", inquiryType: "", type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.org.trim()) errs.org = "Required";
    if (!form.email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email";
    if (!form.inquiryType) errs.inquiryType = "Please select an inquiry type";
    if (!form.message.trim()) errs.message = "Required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("partnership_inquiries").insert({
        organization: form.org.trim(),
        contact_name: form.name.trim() || null,
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        inquiry_type: form.inquiryType,
        partnership_type_legacy: form.type || null,
        message: form.message.trim(),
        status: "new",
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error("partnership inquiry submit error", err);
      setErrors({ form: "Something went wrong. Please try again, or email us directly." });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-secondary/60 border border-border/60 rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300 text-sm";

  return (
    <Layout>
      <PageHero
        badge="Partnerships"
        title="Collaborate With Purpose"
        subtitle={`${BRAND.name} works with forward-thinking brands, institutions, and creative leaders invested in elevating talent and culture at the highest level.`}
        backgroundImage={partnershipBanner}
        backgroundPosition="center 22%"
        overlayVariant="enhanced"
      />

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="Models" title="Ways to Work Together" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerTypes.map((p, i) => (
              <motion.div key={p.title} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.05 }} className="card-premium p-7 card-hover">
                <p.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-card">
        <div className="container-narrow">
          <SectionHeading badge="Inquire" title="Start a Conversation" />
          {submitted ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-2">Your inquiry has been received.</h3>
              <p className="text-gray-300">Our team will review and follow up shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                Tell us briefly what you are looking to build or collaborate on. Our team reviews all partnership inquiries.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Organization *</label>
                  <input className={inputClass} value={form.org} onChange={e => update("org", e.target.value)} placeholder="Your organization" />
                  {errors.org && <p className="text-xs text-destructive mt-1">{errors.org}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Contact Name</label>
                  <input className={inputClass} value={form.name} onChange={e => update("name", e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                  <input className={inputClass} type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@org.com" />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Phone (optional)</label>
                  <input className={inputClass} value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+1 555 555 5555" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Inquiry Type *</label>
                  <select className={inputClass} value={form.inquiryType} onChange={e => update("inquiryType", e.target.value)}>
                    <option value="">Select inquiry type</option>
                    {INQUIRY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  {errors.inquiryType && <p className="text-xs text-destructive mt-1">{errors.inquiryType}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Partnership Type (optional)</label>
                  <select className={inputClass} value={form.type} onChange={e => update("type", e.target.value)}>
                    <option value="">Select</option>
                    {partnerTypes.map(p => <option key={p.title} value={p.title}>{p.title}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
                <textarea className={`${inputClass} min-h-[120px]`} value={form.message} onChange={e => update("message", e.target.value)} placeholder="Describe the collaboration you have in mind" maxLength={2000} />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
              </div>
              {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
              <Button type="submit" variant="gold" size="lg" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Inquiry"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
