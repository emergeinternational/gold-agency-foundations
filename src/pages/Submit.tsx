import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { BRAND, TALENT_CATEGORIES } from "@/lib/brand";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Upload, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Loose mapping from admin-defined category_options labels (e.g. "Model",
// "Singer / Music Artist") onto our internal TALENT_CATEGORIES ids. Used to
// filter the Primary Category dropdown when an opportunity is selected.
const LABEL_TO_CATEGORY_ID: Record<string, string> = {
  model: "models",
  models: "models",
  "actor / performer": "actors-performers",
  "actors / performers": "actors-performers",
  performer: "actors-performers",
  "host / media personality": "hosts-presenters",
  "media personality": "media-personalities",
  "host": "hosts-presenters",
  "event host": "hosts-presenters",
  "voiceover / narration": "voice-narration",
  "voice / narration": "voice-narration",
  "singer / music artist": "musicians",
  "rapper": "musicians",
  "dj": "musicians",
  "producer": "musicians",
  "songwriter": "musicians",
  "musician": "musicians",
  "musician / artist": "musicians",
  "performer (music)": "musicians",
  "influencer / content creator": "influencers",
  "tiktok creator": "influencers",
  "youtuber": "digital-creators",
  "podcaster": "digital-creators",
  "livestream personality": "digital-creators",
  "content creator": "digital-creators",
  "photographer": "digital-creators",
  "videographer": "digital-creators",
  "video editor": "digital-creators",
  "graphic designer": "digital-creators",
  "creative director": "digital-creators",
  "stylist": "digital-creators",
  "makeup artist": "digital-creators",
  "fashion designer": "digital-creators",
  "journalist / interviewer": "speakers-storytellers",
  "speaker": "speakers-storytellers",
  "brand ambassador": "influencers",
  "entrepreneur with media potential": "speakers-storytellers",
  "dancer": "actors-performers",
  "comedian": "actors-performers",
};

const labelsToCategoryIds = (labels: string[]): string[] => {
  const ids = new Set<string>();
  for (const raw of labels) {
    const key = raw.trim().toLowerCase();
    const id = LABEL_TO_CATEGORY_ID[key];
    if (id) ids.add(id);
  }
  return Array.from(ids);
};

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

const BLOCKED_FAKE_VALUES = new Set(["test", "abc", "123", "none", "na"]);
const REQUIRED_LINK_ERROR = "Please provide at least one valid portfolio, sample, or social link.";

const normalizeInput = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
const isBlockedFakeValue = (value: string) => BLOCKED_FAKE_VALUES.has(normalizeInput(value));

const isValidHttpUrl = (value: string) => {
  if (!value.trim()) return false;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export default function Submit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFromRoute = searchParams.get("category") ?? "";
  const recognizedCategory = TALENT_CATEGORIES.find((c) => c.id === categoryFromRoute)?.id ?? "";

  // Phase 5: capture application_mode + opportunity context from query
  // ?mode=casting | representation | media_opportunity | brand_campaign | training_development | general
  const ALLOWED_MODES = new Set([
    "casting",
    "representation",
    "media_opportunity",
    "brand_campaign",
    "training_development",
    "general",
  ]);
  const rawMode = (searchParams.get("mode") ?? "").toLowerCase().trim();
  const applicationMode: string = ALLOWED_MODES.has(rawMode) ? rawMode : "general";

  // Opportunity slug from query (e.g. new_faces_2026); store the slug verbatim,
  // and derive a human-readable title for downstream messaging.
  const rawOpportunitySlug = (searchParams.get("opportunity") ?? "").trim().toLowerCase();
  const opportunitySlug = /^[a-z0-9_]{1,80}$/.test(rawOpportunitySlug) ? rawOpportunitySlug : null;
  const OPPORTUNITY_TITLES: Record<string, string> = {
    new_faces_2026: "New Faces — 2026 Talent Search",
    new_faces_talent_review: "New Faces Talent Review",
    ongoing_casting_call: "Ongoing Casting Call",
    featured_casting_call: "Featured Casting Call",
    creative_showcase: "Addis Creative Showcase",
    brand_campaign_spring_2026: "Brand Campaign — Spring 2026",
    east_african_media_fellowship: "East Africa Media Fellowship",
    program_spotlight_series: "Program Spotlight Series",
    monthly_creative_spotlight: "Monthly Creative Spotlight",
    music_talent_spotlight: "Music Talent Spotlight",
    visual_creators_opportunity: "Visual Creators Opportunity",
    creator_campaigns: "Creator Campaigns",
    training_development_opportunities: "Training & Development Opportunities",
  };
  const opportunityTitle = opportunitySlug ? OPPORTUNITY_TITLES[opportunitySlug] ?? null : null;

  // Opportunity → relevant talent category IDs (filters the Primary Category dropdown).
  // If opportunity not in map (or no opportunity), show full TALENT_CATEGORIES list.
  const OPPORTUNITY_CATEGORY_MAP: Record<string, string[]> = {
    new_faces_talent_review: TALENT_CATEGORIES.map((c) => c.id) as string[],
    ongoing_casting_call: ["models", "actors-performers", "hosts-presenters", "media-personalities"],
    featured_casting_call: ["models", "actors-performers", "hosts-presenters", "media-personalities", "musicians"],
    creative_showcase: ["musicians", "speakers-storytellers", "actors-performers", "hosts-presenters", "digital-creators"],
    brand_campaign_spring_2026: ["models", "influencers", "actors-performers", "digital-creators"],
    east_african_media_fellowship: ["media-personalities", "hosts-presenters", "digital-creators", "speakers-storytellers"],
    program_spotlight_series: TALENT_CATEGORIES.map((c) => c.id) as string[],
    monthly_creative_spotlight: TALENT_CATEGORIES.map((c) => c.id) as string[],
    music_talent_spotlight: ["musicians", "voice-narration"],
    visual_creators_opportunity: ["digital-creators", "models"],
    creator_campaigns: ["influencers", "digital-creators", "models"],
    training_development_opportunities: TALENT_CATEGORIES.map((c) => c.id) as string[],
  };
  // Live lookup of the opportunity card from Supabase. If found, its
  // category_options + opportunity_title override the hardcoded fallbacks
  // above (admin-controlled). If not found, hardcoded fallback is used.
  const [oppLookup, setOppLookup] = useState<{
    title: string | null;
    categoryLabels: string[] | null;
  }>({ title: null, categoryLabels: null });

  useEffect(() => {
    if (!opportunitySlug) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("opportunity_cards")
        .select("opportunity_title, title, category_options")
        .eq("opportunity_slug", opportunitySlug)
        .eq("is_active", true)
        .maybeSingle();
      if (cancelled || error || !data) return;
      setOppLookup({
        title: data.opportunity_title || data.title || null,
        categoryLabels: Array.isArray(data.category_options)
          ? (data.category_options as string[])
          : null,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [opportunitySlug]);

  // Final values: prefer Supabase admin-controlled values, then hardcoded
  // fallbacks, then full category list.
  const effectiveOpportunityTitle =
    oppLookup.title ?? opportunityTitle;

  const supabaseDerivedCategoryIds =
    oppLookup.categoryLabels && oppLookup.categoryLabels.length > 0
      ? labelsToCategoryIds(oppLookup.categoryLabels)
      : null;

  const allowedCategoryIds: string[] =
    supabaseDerivedCategoryIds && supabaseDerivedCategoryIds.length > 0
      ? supabaseDerivedCategoryIds
      : opportunitySlug && OPPORTUNITY_CATEGORY_MAP[opportunitySlug]
        ? OPPORTUNITY_CATEGORY_MAP[opportunitySlug]
        : (TALENT_CATEGORIES.map((c) => c.id) as string[]);
  const filteredCategories = TALENT_CATEGORIES.filter((c) => allowedCategoryIds.includes(c.id));

  const [form, setForm] = useState({
    fullName: "", stageName: "", age: "", city: "", country: "",
    phone: "", email: "", instagram: "", tiktok: "", youtube: "", website: "",
    category: recognizedCategory, experienceLevel: "", shortBio: "", whyRepresentation: "",
    portfolioLinks: "",
    guardianName: "", guardianRelationship: "", guardianEmail: "", guardianPhone: "",
  });
  const [isMinor, setIsMinor] = useState(false);
  const [isUnder13, setIsUnder13] = useState(false);
  const [guardianConsent, setGuardianConsent] = useState(false);
  const [guardianAuthAck, setGuardianAuthAck] = useState(false);
  const [consent, setConsent] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [headshot, setHeadshot] = useState<File | null>(null);
  const [mediaKit, setMediaKit] = useState<File | null>(null);
  const [videoAudio, setVideoAudio] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    else if (isBlockedFakeValue(form.fullName)) e.fullName = "Please enter your real name";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email";
    if (form.city.trim() && isBlockedFakeValue(form.city)) e.city = "Please enter a real city";
    if (!form.category) e.category = "Please select a category";
    else if (isBlockedFakeValue(form.category)) e.category = "Please select a valid category";
    if (!form.shortBio.trim()) e.shortBio = "A short bio is required";
    if (!form.whyRepresentation.trim()) e.whyRepresentation = "Please share your goals";
    if (!consent) e.consent = "Consent is required to proceed";
    if (!agreeTerms) e.agreeTerms = "You must agree to submission terms";
    if (isMinor) {
      if (!form.guardianName.trim()) e.guardianName = "Required for applicants under 18";
      if (!form.guardianRelationship.trim()) e.guardianRelationship = "Required for applicants under 18";
      if (!form.guardianEmail.trim()) e.guardianEmail = "Required for applicants under 18";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.guardianEmail)) e.guardianEmail = "Please enter a valid guardian email";
      if (!form.guardianPhone.trim()) e.guardianPhone = "Required for applicants under 18";
      if (!guardianConsent) e.guardianConsent = "Guardian consent is required";
      if (!guardianAuthAck) e.guardianAuthAck = "Guardian acknowledgment is required";
    }

    const linkFields = [form.instagram, form.tiktok, form.youtube, form.website];
    const portfolioLinks = form.portfolioLinks
      .split(/\r?\n/)
      .map((link) => link.trim())
      .filter(Boolean);
    const nonEmptyLinks = [...linkFields.map((link) => link.trim()).filter(Boolean), ...portfolioLinks];
    const hasAtLeastOneValidLink = nonEmptyLinks.some(isValidHttpUrl);

    if (!hasAtLeastOneValidLink) {
      e.links = REQUIRED_LINK_ERROR;
    } else if (nonEmptyLinks.some((link) => !isValidHttpUrl(link))) {
      e.links = "All links must start with http:// or https://";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      // 1. Insert submission
      const ageNum = form.age ? Number(form.age) : null;
      const minorFlag = ageNum !== null && ageNum < 18;
      const { data: submission, error: subErr } = await supabase
        .from("submissions")
        .insert({
          full_name: form.fullName,
          email: form.email,
          phone: form.phone || null,
          country: form.country || null,
          city: form.city || null,
          category: form.category || null,
          instagram: form.instagram || null,
          tiktok: form.tiktok || null,
          youtube: form.youtube || null,
          website: form.website || null,
          experience_level: form.experienceLevel || null,
          portfolio_url: form.portfolioLinks.trim() || null,
          sample_url: null,
          source: outcome?.qualify ? "emerge" : "ascend",
          status: "new",
          notes: null,
          application_mode: applicationMode,
          opportunity_slug: opportunitySlug,
          opportunity_title: effectiveOpportunityTitle,
          applicant_age: ageNum,
          is_minor: minorFlag,
          parent_guardian_full_name: minorFlag ? form.guardianName || null : null,
          parent_guardian_relationship: minorFlag ? form.guardianRelationship || null : null,
          parent_guardian_email: minorFlag ? form.guardianEmail || null : null,
          parent_guardian_phone: minorFlag ? form.guardianPhone || null : null,
          parent_guardian_consent: minorFlag ? guardianConsent : false,
          parent_guardian_authorization_acknowledgment: minorFlag ? guardianAuthAck : false,
        })
        .select("id")
        .single();

      if (subErr) throw subErr;

      // 2. Insert prequalification result linked to submission
      if (outcome && submission) {
        const { error: pqErr } = await supabase
          .from("prequalification_results")
          .insert({
            submission_id: submission.id,
            category: gateCategory,
            score: outcome.score,
            critical_pass: outcome.criticalPass,
            outcome: outcome.qualify ? "qualify" : "develop",
            answers: answers as Record<string, boolean | null>,
          });
        if (pqErr) console.error("Prequalification save error:", pqErr);
      }

      // Phase 1 fix: pass submission id to success page so Telegram deep link works
      const successId = submission?.id;
      navigate(successId ? `/submission-success?id=${encodeURIComponent(successId)}` : "/submission-success");
    } catch (err) {
      console.error("Submission error:", err);
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
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
                {effectiveOpportunityTitle && (
                  <div className="rounded-sm border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground">
                    You are submitting for: <span className="font-medium text-primary">{effectiveOpportunityTitle}</span>
                  </div>
                )}
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
                      {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                    <p className="text-xs text-muted-foreground mt-1.5">Choose the category that best matches this opportunity.</p>
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
                      <input className={inputClass} type="number" min="1" max="100" value={form.age} onChange={e => {
                        update("age", e.target.value);
                        const n = Number(e.target.value);
                        setIsMinor(!!e.target.value && n < 18);
                        setIsUnder13(!!e.target.value && n > 0 && n < 13);
                      }} placeholder="Your age" />
                    </div>
                    <div>
                      <label className={labelClass}>City</label>
                      <input className={inputClass} value={form.city} onChange={e => update("city", e.target.value)} placeholder="Current city" />
                      {errors.city && <p className={errorClass}>{errors.city}</p>}
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
                  {errors.links && <p className={errorClass}>{errors.links}</p>}
                </fieldset>

                {/* Professional Info */}
                <fieldset>
                  <legend className="font-display text-xl font-semibold text-foreground mb-6">Professional Details</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Primary Category *</label>
                      <select className={inputClass} value={form.category} onChange={e => update("category", e.target.value)}>
                        <option value="">Select your primary discipline</option>
                        {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                      {effectiveOpportunityTitle && (
                        <p className="text-xs text-muted-foreground mt-1.5">Choose the category that best matches this opportunity.</p>
                      )}
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

                {/* Guardian Info — required when applicant is under 18 */}
                {isMinor && (
                  <fieldset className="border border-primary/30 rounded-md p-5 bg-primary/5">
                    <legend className="font-display text-xl font-semibold text-foreground px-2">
                      Under 18? Parent/Guardian Required
                    </legend>
                    <p className="text-sm text-muted-foreground mb-5">
                      Applicants under 18 may not move forward without legal parent or guardian authorization. Additional guardian information and consent are required before review can continue.
                    </p>
                    {isUnder13 && (
                      <p className="text-sm text-foreground bg-secondary/60 border border-border/60 rounded-sm p-3 mb-5">
                        Applicants under 13 require verified parent/guardian consent before any personal information can be reviewed or used.
                      </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Parent / Guardian Full Name *</label>
                        <input className={`${inputClass} ${errors.guardianName ? "border-destructive ring-1 ring-destructive/40" : ""}`} value={form.guardianName} onChange={e => update("guardianName", e.target.value)} placeholder="Guardian's full name" aria-invalid={!!errors.guardianName} />
                        {errors.guardianName && <p className={errorClass}>{errors.guardianName}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Relationship to Applicant *</label>
                        <input className={`${inputClass} ${errors.guardianRelationship ? "border-destructive ring-1 ring-destructive/40" : ""}`} value={form.guardianRelationship} onChange={e => update("guardianRelationship", e.target.value)} placeholder="e.g. Mother, Father, Legal Guardian" aria-invalid={!!errors.guardianRelationship} />
                        {errors.guardianRelationship && <p className={errorClass}>{errors.guardianRelationship}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Guardian Email *</label>
                        <input className={`${inputClass} ${errors.guardianEmail ? "border-destructive ring-1 ring-destructive/40" : ""}`} type="email" value={form.guardianEmail} onChange={e => update("guardianEmail", e.target.value)} placeholder="guardian@email.com" aria-invalid={!!errors.guardianEmail} />
                        {errors.guardianEmail && <p className={errorClass}>{errors.guardianEmail}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Guardian Phone *</label>
                        <input className={`${inputClass} ${errors.guardianPhone ? "border-destructive ring-1 ring-destructive/40" : ""}`} type="tel" value={form.guardianPhone} onChange={e => update("guardianPhone", e.target.value)} placeholder="+1..." aria-invalid={!!errors.guardianPhone} />
                        {errors.guardianPhone && <p className={errorClass}>{errors.guardianPhone}</p>}
                      </div>
                    </div>
                    <div className="space-y-4 mt-5">
                      <div className={errors.guardianConsent ? "rounded-sm border border-destructive/60 bg-destructive/5 p-2" : ""}>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={guardianConsent} onChange={e => { setGuardianConsent(e.target.checked); if (errors.guardianConsent) setErrors(prev => { const n = { ...prev }; delete n.guardianConsent; return n; }); }} className={`mt-1 accent-primary ${errors.guardianConsent ? "ring-2 ring-destructive/60" : ""}`} aria-invalid={!!errors.guardianConsent} />
                          <span className={`text-sm ${errors.guardianConsent ? "text-destructive" : "text-muted-foreground"}`}>
                            I confirm that I am the applicant's legal parent or guardian and authorize {BRAND.name} to review this submission. I understand that no casting, training, booking, representation, travel, media use, or participation may move forward without required legal authorization, releases, and any applicable permits.
                          </span>
                        </label>
                        {errors.guardianConsent && <p className={errorClass}>{errors.guardianConsent}</p>}
                      </div>

                      <div className={errors.guardianAuthAck ? "rounded-sm border border-destructive/60 bg-destructive/5 p-2" : ""}>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={guardianAuthAck} onChange={e => { setGuardianAuthAck(e.target.checked); if (errors.guardianAuthAck) setErrors(prev => { const n = { ...prev }; delete n.guardianAuthAck; return n; }); }} className={`mt-1 accent-primary ${errors.guardianAuthAck ? "ring-2 ring-destructive/60" : ""}`} aria-invalid={!!errors.guardianAuthAck} />
                          <span className={`text-sm ${errors.guardianAuthAck ? "text-destructive" : "text-muted-foreground"}`}>
                            I understand that additional documentation may be required before any minor can participate in any opportunity.
                          </span>
                        </label>
                        {errors.guardianAuthAck && <p className={errorClass}>{errors.guardianAuthAck}</p>}
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

                <Button type="submit" variant="hero" size="xl" className="w-full sm:w-auto" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit for Review"}
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
