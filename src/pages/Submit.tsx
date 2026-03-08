import { useState } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { BRAND, TALENT_CATEGORIES } from "@/lib/brand";
import { useNavigate } from "react-router-dom";
import { Upload, CheckCircle } from "lucide-react";

export default function Submit() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", stageName: "", age: "", city: "", country: "",
    phone: "", email: "", instagram: "", tiktok: "", youtube: "", website: "",
    category: "", experienceLevel: "", shortBio: "", whyRepresentation: "",
    portfolioLinks: "", guardianName: "", guardianEmail: "", guardianPhone: "",
  });
  const [isMinor, setIsMinor] = useState(false);
  const [consent, setConsent] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [headshot, setHeadshot] = useState<File | null>(null);
  const [mediaKit, setMediaKit] = useState<File | null>(null);
  const [videoAudio, setVideoAudio] = useState<File | null>(null);

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email";
    if (!form.category) e.category = "Please select a category";
    if (!form.shortBio.trim()) e.shortBio = "A short bio is required";
    if (!form.whyRepresentation.trim()) e.whyRepresentation = "Please share your goals";
    if (!consent) e.consent = "Consent is required to proceed";
    if (!agreeTerms) e.agreeTerms = "You must agree to submission terms";
    if (isMinor && !form.guardianName.trim()) e.guardianName = "Required for applicants under 18";
    if (isMinor && !form.guardianEmail.trim()) e.guardianEmail = "Required for applicants under 18";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) navigate("/submission-success");
  };

  const inputClass = "w-full px-4 py-3 bg-secondary/60 border border-border/60 rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300 text-sm";
  const labelClass = "block text-xs font-medium text-foreground/80 mb-1.5 tracking-wide uppercase";
  const errorClass = "text-[11px] text-destructive mt-1";

  return (
    <Layout>
      <PageHero
        badge="Open Submissions"
        title="Show Us What You've Got"
        subtitle="We welcome talent across every category and experience level. This is your first step toward professional representation — take it seriously, and so will we."
      />

      <section className="section-padding">
        <div className="container-narrow">
          <div className="card-premium p-6 sm:p-8 mb-10">
            <div className="flex items-start gap-3 mb-6">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground font-medium">Before you begin</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                  <li>Submission is an application — it does not guarantee representation</li>
                  <li>Review timelines vary depending on volume and category</li>
                  <li>Academy enrollment is separate from representation consideration</li>
                  <li>All talent categories and experience levels are welcome</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info */}
            <fieldset>
              <legend className="font-display text-xl font-semibold text-foreground mb-8">Personal Information</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input className={inputClass} value={form.fullName} onChange={e => update("fullName", e.target.value)} placeholder="Your full legal name" />
                  {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Stage / Professional Name</label>
                  <input className={inputClass} value={form.stageName} onChange={e => update("stageName", e.target.value)} placeholder="If different from legal name" />
                </div>
                <div>
                  <label className={labelClass}>Age</label>
                  <input className={inputClass} type="number" min="1" max="100" value={form.age} onChange={e => { update("age", e.target.value); setIsMinor(Number(e.target.value) < 18); }} placeholder="Your age" />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input className={inputClass} value={form.city} onChange={e => update("city", e.target.value)} placeholder="Current city" />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input className={inputClass} value={form.country} onChange={e => update("country", e.target.value)} placeholder="Country of residence" />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input className={inputClass} type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+251..." />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Email *</label>
                  <input className={inputClass} type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="your@email.com" />
                  {errors.email && <p className={errorClass}>{errors.email}</p>}
                </div>
              </div>
            </fieldset>

            {/* Social Links */}
            <fieldset>
              <legend className="font-display text-xl font-semibold text-foreground mb-6">Social & Portfolio</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Instagram</label>
                  <input className={inputClass} value={form.instagram} onChange={e => update("instagram", e.target.value)} placeholder="@yourusername" />
                </div>
                <div>
                  <label className={labelClass}>TikTok</label>
                  <input className={inputClass} value={form.tiktok} onChange={e => update("tiktok", e.target.value)} placeholder="@yourusername" />
                </div>
                <div>
                  <label className={labelClass}>YouTube</label>
                  <input className={inputClass} value={form.youtube} onChange={e => update("youtube", e.target.value)} placeholder="Channel URL" />
                </div>
                <div>
                  <label className={labelClass}>Website / Portfolio</label>
                  <input className={inputClass} value={form.website} onChange={e => update("website", e.target.value)} placeholder="https://..." />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Additional Work Links</label>
                  <textarea className={`${inputClass} min-h-[80px]`} value={form.portfolioLinks} onChange={e => update("portfolioLinks", e.target.value)} placeholder="Any other links to your work — one per line" />
                </div>
              </div>
            </fieldset>

            {/* Professional Info */}
            <fieldset>
              <legend className="font-display text-xl font-semibold text-foreground mb-6">Professional Details</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category *</label>
                  <select className={inputClass} value={form.category} onChange={e => update("category", e.target.value)}>
                    <option value="">Select your primary category</option>
                    {TALENT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                  {errors.category && <p className={errorClass}>{errors.category}</p>}
                </div>
                <div>
                  <label className={labelClass}>Experience Level</label>
                  <select className={inputClass} value={form.experienceLevel} onChange={e => update("experienceLevel", e.target.value)}>
                    <option value="">Select level</option>
                    <option value="beginner">Emerging</option>
                    <option value="intermediate">Developing</option>
                    <option value="advanced">Experienced</option>
                    <option value="professional">Established Professional</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Short Bio *</label>
                  <textarea className={`${inputClass} min-h-[100px]`} value={form.shortBio} onChange={e => update("shortBio", e.target.value)} placeholder="Who you are, what you do, and what makes your work distinctive" maxLength={2000} />
                  {errors.shortBio && <p className={errorClass}>{errors.shortBio}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Why are you seeking representation? *</label>
                  <textarea className={`${inputClass} min-h-[100px]`} value={form.whyRepresentation} onChange={e => update("whyRepresentation", e.target.value)} placeholder="Your goals and why this platform is the right fit for your career" maxLength={2000} />
                  {errors.whyRepresentation && <p className={errorClass}>{errors.whyRepresentation}</p>}
                </div>
              </div>
            </fieldset>

            {/* Uploads */}
            <fieldset>
              <legend className="font-display text-xl font-semibold text-foreground mb-6">Media Uploads</legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Headshot / Photo", accept: "image/*", file: headshot, setFile: setHeadshot, hint: "JPG, PNG, or WebP" },
                  { label: "Media Kit / Resume", accept: ".pdf,image/*", file: mediaKit, setFile: setMediaKit, hint: "PDF or image format" },
                  { label: "Video / Audio Sample", accept: "video/*,audio/*", file: videoAudio, setFile: setVideoAudio, hint: "MP4, MP3, or WAV" },
                ].map(u => (
                  <div key={u.label}>
                    <label className={labelClass}>{u.label}</label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/40 transition-colors bg-secondary/30">
                      <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground text-center">{u.file ? u.file.name : `Select file · ${u.hint}`}</span>
                      <input type="file" accept={u.accept} className="hidden" onChange={e => u.setFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground/60 mt-3">File storage will be activated once the platform backend is connected.</p>
            </fieldset>

            {/* Guardian Info */}
            {isMinor && (
              <fieldset>
                <legend className="font-display text-xl font-semibold text-foreground mb-6">Guardian Information <span className="text-sm font-normal text-muted-foreground">(required for applicants under 18)</span></legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Guardian Full Name *</label>
                    <input className={inputClass} value={form.guardianName} onChange={e => update("guardianName", e.target.value)} placeholder="Guardian's full name" />
                    {errors.guardianName && <p className={errorClass}>{errors.guardianName}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Guardian Email *</label>
                    <input className={inputClass} type="email" value={form.guardianEmail} onChange={e => update("guardianEmail", e.target.value)} placeholder="guardian@email.com" />
                    {errors.guardianEmail && <p className={errorClass}>{errors.guardianEmail}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Guardian Phone</label>
                    <input className={inputClass} type="tel" value={form.guardianPhone} onChange={e => update("guardianPhone", e.target.value)} placeholder="+251..." />
                  </div>
                </div>
              </fieldset>
            )}

            {/* Consent */}
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={consent} onChange={e => { setConsent(e.target.checked); if (errors.consent) setErrors(prev => { const n = { ...prev }; delete n.consent; return n; }); }} className="mt-1 accent-primary" />
                <span className="text-sm text-muted-foreground">
                  I consent to {BRAND.name} collecting and reviewing my submission materials for talent evaluation purposes. I understand that submission does not guarantee representation.
                </span>
              </label>
              {errors.consent && <p className={errorClass}>{errors.consent}</p>}

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreeTerms} onChange={e => { setAgreeTerms(e.target.checked); if (errors.agreeTerms) setErrors(prev => { const n = { ...prev }; delete n.agreeTerms; return n; }); }} className="mt-1 accent-primary" />
                <span className="text-sm text-muted-foreground">
                  I have read and agree to the <a href="/submission-terms" target="_blank" className="text-primary underline">Submission Terms</a>.
                </span>
              </label>
              {errors.agreeTerms && <p className={errorClass}>{errors.agreeTerms}</p>}
            </div>

            <Button type="submit" variant="hero" size="xl" className="w-full sm:w-auto">
              Submit Application
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}