import { useState } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";
import { Handshake, Building, Mic, MapPin, BookOpen, TrendingUp } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7 as const },
};

const partnerTypes = [
  { icon: Building, title: "Sponsors", desc: "Align your brand with premium talent and high-visibility creative projects." },
  { icon: Handshake, title: "Brand Collaborators", desc: "Co-create campaigns, content, and experiences with our talent roster." },
  { icon: Mic, title: "Studios & Venues", desc: "Partner with us for events, productions, and creative programming." },
  { icon: MapPin, title: "Media Houses", desc: "Access our talent network for editorial, broadcast, and digital content." },
  { icon: BookOpen, title: "Educators", desc: "Contribute to our academy as guest instructors, mentors, or curriculum advisors." },
  { icon: TrendingUp, title: "Investors & Institutions", desc: "Support the growth of Africa's creative economy through strategic partnership." },
];

export default function Partnerships() {
  const [form, setForm] = useState({ org: "", name: "", email: "", type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.org.trim()) errs.org = "Required";
    if (!form.email.trim()) errs.email = "Required";
    if (!form.message.trim()) errs.message = "Required";
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  };

  const inputClass = "w-full px-4 py-3 bg-secondary/60 border border-border/60 rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300 text-sm";

  return (
    <Layout>
      <PageHero badge="Partnerships" title="Build With Us" subtitle={`${BRAND.name} partners with forward-thinking brands, institutions, and creative leaders who share our commitment to elevating talent and culture.`} />

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="Partner Types" title="How We Collaborate" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerTypes.map((p, i) => (
              <motion.div key={p.title} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.05 }} className="card-premium p-7 card-hover">
                <p.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-card">
        <div className="container-narrow">
          <SectionHeading badge="Get in Touch" title="Partnership Inquiry" />
          {submitted ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-2">Inquiry Received</h3>
              <p className="text-muted-foreground">Thank you for your interest in partnering with {BRAND.name}. Our team will review your inquiry and respond within 5 business days.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <label className="block text-sm font-medium text-foreground mb-1.5">Partnership Type</label>
                  <select className={inputClass} value={form.type} onChange={e => update("type", e.target.value)}>
                    <option value="">Select</option>
                    {partnerTypes.map(p => <option key={p.title} value={p.title}>{p.title}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
                <textarea className={`${inputClass} min-h-[120px]`} value={form.message} onChange={e => update("message", e.target.value)} placeholder="Tell us about your partnership vision" maxLength={2000} />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" variant="gold" size="lg">Submit Inquiry</Button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
