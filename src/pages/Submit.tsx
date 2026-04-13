import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { BRAND, TALENT_CATEGORIES } from "@/lib/brand";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Upload, CheckCircle } from "lucide-react";

type Question = {
  id: string;
  text: string;
  helper?: string;
  weight: number;
  critical?: boolean;
};

type CategoryGate = {
  label: string;
  helper?: string;
  threshold: number;
  questions: Question[];
};

const GATE_CONFIG: Record<string, CategoryGate> = {
  models: {
    label: "Models",
    helper: "Test shoots are a normal international industry standard and are typically unpaid.",
    threshold: 8,
    questions: [
      { id: "comp_card", text: "Do you currently have a professional comp card?", weight: 3, critical: true },
      { id: "portfolio", text: "Do you currently have a professional modeling portfolio?", weight: 3, critical: true },
      { id: "test_shoots", text: "Have you completed agency-standard test shoots before?", weight: 2 },
      { id: "client_work", text: "Have you worked with photographers, brands, designers, or productions?", weight: 2 },
      { id: "willing_development", text: "Are you willing to participate in test shoots and development work?", weight: 1 },
    ],
  },
  musicians: {
    label: "Musicians",
    helper:
      "YouTube alone does not equal international distribution readiness; major streaming platforms and structured release presence matter.",
    threshold: 9,
    questions: [
      { id: "pro_releases", text: "Have you released music professionally under your artist identity?", weight: 3, critical: true },
      { id: "dsp_distribution", text: "Is your music distributed on major DSPs (such as Spotify, Apple Music, or Amazon Music)?", weight: 3, critical: true },
      { id: "pro_recordings", text: "Do you have professional-quality recordings available now?", weight: 3, critical: true },
      { id: "live_experience", text: "Do you have live performance or structured event experience?", weight: 2 },
      { id: "industry_collab", text: "Have you worked with producers, studios, or labels?", weight: 2 },
    ],
  },
  "voice-narration": {
    label: "Voice / Narration",
    threshold: 6,
    questions: [
      { id: "voice_samples", text: "Do you have recorded voice samples ready for review?", weight: 3, critical: true },
      { id: "published_work", text: "Do you have published or paid voice work?", weight: 2 },
      { id: "recording_setup", text: "Do you have access to a quality recording setup or studio?", weight: 2 },
      { id: "commercial_readiness", text: "Are you currently ready for commercial, production, or narration assignments?", weight: 2 },
    ],
  },
  "media-hosts": {
    label: "Media Personalities / Hosts",
    threshold: 8,
    questions: [
      { id: "hosting_reel", text: "Do you have an on-camera or hosting reel?", weight: 3, critical: true },
      {
        id: "structured_media_work",
        text: "Have you completed television, radio, digital broadcast, or other structured media work?",
        weight: 3,
        critical: true,
      },
      { id: "active_production", text: "Are you currently active in media or content production?", weight: 2 },
      { id: "presentation_assets", text: "Do you have professional presentation assets or a portfolio?", weight: 2 },
    ],
  },
  "digital-creators": {
    label: "Digital Creators / Influencers",
    threshold: 8,
    questions: [
      { id: "branded_content", text: "Do you publish consistent branded content?", weight: 3, critical: true },
      { id: "audience_base", text: "Do you currently have a measurable audience base?", weight: 3, critical: true },
      { id: "brand_collabs", text: "Have you completed collaborations with recognized brands or campaigns?", weight: 2 },
      { id: "portfolio_quality", text: "Is your content quality currently portfolio-ready?", weight: 2 },
      { id: "active_consistent", text: "Are your platforms active and consistently maintained?", weight: 2 },
    ],
  },
  "actors-performers": {
    label: "Actors / Performers",
    threshold: 8,
    questions: [
      { id: "reel_clips", text: "Do you have a reel or performance clips available now?", weight: 3, critical: true },
      {
        id: "prior_performance_work",
        text: "Have you completed casting, production, film, stage, or other structured performance work?",
        weight: 2,
      },
      { id: "training", text: "Have you completed formal or structured performance training?", weight: 2 },
      {
        id: "headshots_assets",
        text: "Do you have professional headshots or performance assets ready for submission?",
        weight: 3,
        critical: true,
      },
    ],
  },
  "speakers-storytellers": {
    label: "Speakers / Storytellers",
    threshold: 8,
    questions: [
      { id: "speaking_samples", text: "Do you have speaking samples available now?", weight: 3, critical: true },
      {
        id: "speaking_experience",
        text: "Do you have prior event, panel, conference, or formal speaking experience?",
        weight: 3,
        critical: true,
      },
      { id: "subject_areas", text: "Do you have clearly defined subject-matter speaking areas?", weight: 2 },
      { id: "speaker_assets", text: "Do you have presentation assets or speaker materials prepared?", weight: 2 },
    ],
  },
};

const CATEGORY_TO_GATE: Record<string, keyof typeof GATE_CONFIG> = {
  models: "models",
  musicians: "musicians",
  "voice-narration": "voice-narration",
  "media-personalities": "media-hosts",
  "hosts-presenters": "media-hosts",
  influencers: "digital-creators",
  "digital-creators": "digital-creators",
  "actors-performers": "actors-performers",
  "speakers-storytellers": "speakers-storytellers",
};

export default function Submit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFromRoute = searchParams.get("category") ?? "";
  const recognizedCategory = TALENT_CATEGORIES.find((c) => c.id === categoryFromRoute)?.id ?? "";

  const [form, setForm] = useState({
    fullName: "", stageName: "", age: "", city: "", country: "",
    phone: "", email: "", instagram: "", tiktok: "", youtube: "", website: "",
    category: recognizedCategory, experienceLevel: "", shortBio: "", whyRepresentation: "",
    portfolioLinks: "", guardianName: "", guardianEmail: "", guardianPhone: "",
  });
  const [isMinor, setIsMinor] = useState(false);
  const [consent, setConsent] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [headshot, setHeadshot] = useState<File | null>(null);
  const [mediaKit, setMediaKit] = useState<File | null>(null);
  const [videoAudio, setVideoAudio] = useState<File | null>(null);

  const [gateComplete, setGateComplete] = useState(false);
  const [gateCategory, setGateCategory] = useState(recognizedCategory);
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [attestation, setAttestation] = useState(false);

  const gateKey = CATEGORY_TO_GATE[gateCategory] ?? null;
  const gateDefinition = gateKey ? GATE_CONFIG[gateKey] : null;

  const allQuestionsAnswered = useMemo(() => {
    if (!gateDefinition) return false;
    return gateDefinition.questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== null);
  }, [answers, gateDefinition]);

  const outcome = useMemo(() => {
    if (!gateDefinition || !allQuestionsAnswered || !attestation) return null;
    const criticalPass = gateDefinition.questions
      .filter((q) => q.critical)
      .every((q) => answers[q.id] === true);

    const score = gateDefinition.questions.reduce(
      (sum, q) => sum + (answers[q.id] ? q.weight : 0),
      0,
    );

    const qualify = criticalPass && score >= gateDefinition.threshold;

    return {
      qualify,
      criticalPass,
      score,
      threshold: gateDefinition.threshold,
    };
  }, [answers, attestation, allQuestionsAnswered, gateDefinition]);

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
        badge="Representation Review"
        title="Submit for Review"
        subtitle="We review talent with genuine potential across all categories. This is your introduction — take it seriously, and so will we. Submission does not guarantee representation. Selected talent may be invited to further development and positioning opportunities."
      />

      <section className="section-padding">
        <div className="container-narrow">
          {!gateComplete ? (
            <div className="card-premium p-6 sm:p-8 space-y-7">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Quick eligibility check · Step 1 of 2</p>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">International Representation Readiness</h2>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <p>We evaluate submissions against international representation standards, which may differ from local market expectations.</p>
                  <p>Development-stage talent often begins with preparation, positioning, and readiness-building before advanced representation.</p>
                  <p>Some preparation steps are unpaid or self-invested, including test shoots, portfolio building, and professional development assets.</p>
                  <p className="text-foreground/90 font-medium">This takes less than a minute.</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Step 2 · Category</p>
                {recognizedCategory ? (
                  <div className="rounded-sm border border-border/70 bg-secondary/40 px-4 py-3 text-sm text-foreground">
                    Category confirmed: <span className="font-medium">{TALENT_CATEGORIES.find((c) => c.id === recognizedCategory)?.label}</span>
                  </div>
                ) : (
                  <div>
                    <label className={labelClass}>Primary Category *</label>
                    <select
                      className={inputClass}
                      value={gateCategory}
                      onChange={(e) => {
                        setGateCategory(e.target.value);
                        setAnswers({});
                      }}
                    >
                      <option value="">Select your primary discipline</option>
                      {TALENT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {gateDefinition && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-foreground">Step 3 · Category readiness questions</p>
                  {gateDefinition.helper && <p className="text-xs text-gray-300">{gateDefinition.helper}</p>}
                  {gateDefinition.questions.map((q) => (
                    <div key={q.id} className="border border-border/70 rounded-sm p-4 bg-background/50">
                      <p className="text-sm text-foreground">{q.text}</p>
                      {q.helper && <p className="text-xs text-gray-300 mt-1">{q.helper}</p>}
                      <div className="mt-3 flex gap-2">
                        <Button
                          type="button"
                          variant={answers[q.id] === true ? "hero" : "gold-outline"}
                          size="sm"
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: true }))}
                        >
                          Yes
                        </Button>
                        <Button
                          type="button"
                          variant={answers[q.id] === false ? "hero" : "gold-outline"}
                          size="sm"
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: false }))}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Step 4 · Confirmation</p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attestation}
                    onChange={(e) => setAttestation(e.target.checked)}
                    className="mt-1 accent-primary"
                  />
                  <span className="text-sm text-muted-foreground">
                    I confirm these answers are accurate. Placement may include verification of claims or materials to ensure the right pathway.
                  </span>
                </label>
              </div>

              {outcome && (
                <div className="space-y-3 rounded-sm border border-border/70 bg-secondary/30 p-4">
                  <p className="text-sm font-medium text-foreground">Step 5 · Pathway result</p>
                  {outcome.qualify ? (
                    <>
                      <p className="text-sm text-foreground">
                        Your profile may align with advanced representation standards. <a href={BRAND.poweredByUrl} target="_blank" rel="noreferrer" className="underline text-primary">Emerge Globally</a> is the higher-level pathway for advanced-ready profiles.
                      </p>
                      <p className="text-xs text-gray-300">Proceed only if your responses are accurate and verifiable.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-foreground">
                        You are exactly where you should start. Ascend is built for development-stage talent to strengthen positioning, readiness, and access to international opportunities.
                      </p>
                      <p className="text-xs text-gray-300">Continue below to submit your application and begin with the correct pathway.</p>
                    </>
                  )}
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-foreground mb-3">Step 6 · Continue</p>
                <Button
                  type="button"
                  variant="hero"
                  size="xl"
                  disabled={!outcome || !gateCategory}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, category: gateCategory }));
                    setGateComplete(true);
                  }}
                >
                  Continue to Application
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="card-premium p-6 sm:p-8 mb-10">
                <div className="flex items-start gap-3 mb-6">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-foreground font-medium">Before you begin</p>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                      <li>This is an application for representation review — not a guarantee of representation</li>
                      <li>Response timelines vary depending on volume and category demand</li>
                      <li>Development and representation are separate tracks with structured progression</li>
                      <li>All talent categories and experience levels may apply</li>
                    </ul>
                    <p className="text-xs text-gray-300 mt-3">Certain development pathways include structured program participation.</p>
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
                  <legend className="font-display text-xl font-semibold text-foreground mb-6">Online Presence</legend>
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
                      <label className={labelClass}>Primary Category *</label>
                      <select className={inputClass} value={form.category} onChange={e => update("category", e.target.value)}>
                        <option value="">Select your primary discipline</option>
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
                      <textarea className={`${inputClass} min-h-[100px]`} value={form.shortBio} onChange={e => update("shortBio", e.target.value)} placeholder="Who you are, what you do, and what sets your work apart" maxLength={2000} />
                      {errors.shortBio && <p className={errorClass}>{errors.shortBio}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Why are you seeking representation? *</label>
                      <textarea className={`${inputClass} min-h-[100px]`} value={form.whyRepresentation} onChange={e => update("whyRepresentation", e.target.value)} placeholder="Your goals and why this agency is the right fit for your career direction" maxLength={2000} />
                      {errors.whyRepresentation && <p className={errorClass}>{errors.whyRepresentation}</p>}
                    </div>
                  </div>
                </fieldset>

                {/* Uploads */}
                <fieldset>
                  <legend className="font-display text-xl font-semibold text-foreground mb-6">Supporting Materials</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Headshot / Photo", accept: "image/*", file: headshot, setFile: setHeadshot, hint: "JPG, PNG, or WebP" },
                      { label: "Media Kit / Resume", accept: ".pdf,image/*", file: mediaKit, setFile: setMediaKit, hint: "PDF or image" },
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
                  <p className="text-xs text-gray-200 mt-3">File uploads will be fully active once the backend is connected.</p>
                </fieldset>

                {/* Guardian Info */}
                {isMinor && (
                  <fieldset>
                    <legend className="font-display text-xl font-semibold text-foreground mb-6">Guardian Information <span className="text-sm font-normal text-muted-foreground">(required under 18)</span></legend>
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
                      I consent to {BRAND.name} collecting and reviewing my submission materials for talent evaluation purposes. I understand this is an application for review and does not guarantee representation.
                    </span>
                  </label>
                  {errors.consent && <p className={errorClass}>{errors.consent}</p>}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={agreeTerms} onChange={e => { setAgreeTerms(e.target.checked); if (errors.agreeTerms) setErrors(prev => { const n = { ...prev }; delete n.agreeTerms; return n; }); }} className="mt-1 accent-primary" />
                    <span className="text-sm text-muted-foreground">
                      I have read and agree to the <Link to="/submission-terms" target="_blank" className="text-primary underline">Submission Terms</Link>.
                    </span>
                  </label>
                  {errors.agreeTerms && <p className={errorClass}>{errors.agreeTerms}</p>}
                </div>

                <Button type="submit" variant="hero" size="xl" className="w-full sm:w-auto">
                  Submit for Review
                </Button>
                <p className="text-xs text-gray-200">Reviewed by our representation team.</p>
              </form>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
