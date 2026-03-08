import { useState } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const update = (f: string, v: string) => { setForm(p => ({ ...p, [f]: v })); if (errors[f]) setErrors(p => { const n = { ...p }; delete n[f]; return n; }); };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.email.trim()) errs.email = "Required";
    if (!form.message.trim()) errs.message = "Required";
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  };
  const inputClass = "w-full px-4 py-3 bg-secondary/60 border border-border/60 rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300 text-sm";

  return (
    <Layout>
      <PageHero badge="Contact" title="Let's Talk" subtitle="Whether you have a question, an opportunity, or simply want to learn more — we're listening." />
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {submitted ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                  <Send className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-2">Message Sent</h3>
                  <p className="text-muted-foreground">Thank you for reaching out. We'll respond within 2–3 business days.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-foreground mb-1.5">Name *</label><input className={inputClass} value={form.name} onChange={e => update("name", e.target.value)} placeholder="Your name" />{errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}</div>
                    <div><label className="block text-sm font-medium text-foreground mb-1.5">Email *</label><input className={inputClass} type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@email.com" />{errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}</div>
                  </div>
                  <div><label className="block text-sm font-medium text-foreground mb-1.5">Subject</label><input className={inputClass} value={form.subject} onChange={e => update("subject", e.target.value)} placeholder="What is this regarding?" /></div>
                  <div><label className="block text-sm font-medium text-foreground mb-1.5">Message *</label><textarea className={`${inputClass} min-h-[150px]`} value={form.message} onChange={e => update("message", e.target.value)} placeholder="Your message" maxLength={3000} />{errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}</div>
                  <Button type="submit" variant="gold" size="lg">Send Message</Button>
                </form>
              )}
            </div>
            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: BRAND.email },
                { icon: Phone, label: "Phone", value: BRAND.phone },
                { icon: MapPin, label: "Location", value: `${BRAND.locationPrimary}, Ethiopia` },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-3">
                  <c.icon className="w-5 h-5 text-primary mt-0.5" />
                  <div><p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{c.label}</p><p className="text-sm text-foreground">{c.value}</p></div>
                </div>
              ))}
              <div className="pt-4 border-t border-border">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {Object.entries(BRAND.socialLinks).map(([p, url]) => (
                    <a key={p} href={url} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">{p}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}