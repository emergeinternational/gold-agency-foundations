import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, Star } from "lucide-react";
import opportunitiesHero from "@/assets/opportunities-hero.jpg";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7 as const },
};

type Opportunity = {
  type: string;
  title: string;
  desc: string;
  status: string;
  mode: string;
  slug: string;
  featured?: boolean;
  buttonLabel?: string;
};

// Fallback list (used only if Supabase is unreachable / empty).
// Mirrors the seeded opportunity_cards rows so the page never goes blank.
const FALLBACK: Opportunity[] = [
  { type: "Featured Casting", title: "Featured Casting Call", desc: "Submit for a featured casting opportunity. Selected applicants will receive date, time, location, and next-step details through Telegram.", status: "Upcoming", mode: "casting", slug: "featured_casting_call", featured: true },
  { type: "Casting", title: "Ongoing Casting Call", desc: "Submit for current and future casting opportunities across media, campaigns, productions, and live opportunities.", status: "Ongoing", mode: "casting", slug: "ongoing_casting_call" },
  { type: "Representation Review", title: "New Faces Talent Review", desc: "Seeking fresh creative talent across categories for review, development, representation readiness, and future opportunities. Submission does not guarantee selection.", status: "Active", mode: "representation", slug: "new_faces_talent_review" },
  { type: "Showcase", title: "Addis Creative Showcase", desc: "A curated evening of live performance, industry introductions, and creative presentation in Addis Ababa.", status: "Upcoming", mode: "media_opportunity", slug: "creative_showcase" },
  { type: "Internal Casting", title: "Brand Campaign — Spring 2026", desc: "Internal casting for a major commercial campaign. Priority consideration for represented talent.", status: "Active", mode: "brand_campaign", slug: "brand_campaign_spring_2026" },
  { type: "Partner Opportunity", title: "East Africa Media Fellowship", desc: "A regional mentorship and exposure program for media-focused talent, developed with industry partners.", status: "Upcoming", mode: "media_opportunity", slug: "east_african_media_fellowship" },
  { type: "Development-Linked", title: "Program Spotlight Series", desc: "Outstanding development program participants featured in our digital spotlight content across channels.", status: "Ongoing", mode: "media_opportunity", slug: "program_spotlight_series" },
  { type: "Talent Feature", title: "Monthly Creative Spotlight", desc: "Each month, one emerging talent is featured across our channels and shared with partner networks.", status: "Ongoing", mode: "media_opportunity", slug: "monthly_creative_spotlight" },
  { type: "Music Feature", title: "Music Talent Spotlight", desc: "A dedicated feature surface for emerging musicians, vocalists, and producers ready for broader audience exposure.", status: "Ongoing", mode: "media_opportunity", slug: "music_talent_spotlight" },
  { type: "Visual Creators", title: "Visual Creators Opportunity", desc: "For photographers, directors, and visual storytellers building portfolios for editorial, brand, and media partners.", status: "Active", mode: "media_opportunity", slug: "visual_creators_opportunity" },
  { type: "Brand Collaboration", title: "Creator Campaigns", desc: "Ongoing creator-led campaign opportunities with regional and international brand partners.", status: "Active", mode: "brand_campaign", slug: "creator_campaigns" },
  { type: "Development Pathway", title: "Training & Development Opportunities", desc: "Structured preparation, positioning, and readiness-building pathways for talent committed to international standards.", status: "Ongoing", mode: "training_development", slug: "training_development_opportunities" },
];

const buildSubmitHref = (opp: Opportunity) =>
  `/submit?mode=${encodeURIComponent(opp.mode)}&opportunity=${encodeURIComponent(opp.slug)}`;

const statusClass = (status: string) =>
  status === "Active"
    ? "bg-green-900/30 text-green-400"
    : status === "Upcoming"
      ? "bg-secondary text-muted-foreground"
      : status === "Closed"
        ? "bg-destructive/15 text-destructive"
        : status === "Closing Soon"
          ? "bg-yellow-500/15 text-yellow-400"
          : "bg-primary/5 text-primary";

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("opportunity_cards")
        .select("title, description, status_label, application_mode, opportunity_slug, type_label, featured, button_label, sort_order")
        .eq("is_active", true)
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (!error && data && data.length > 0) {
        setOpportunities(
          data.map((d) => ({
            type: d.type_label || "Opportunity",
            title: d.title,
            desc: d.description || "",
            status: d.status_label || "Active",
            mode: d.application_mode,
            slug: d.opportunity_slug,
            featured: !!d.featured,
            buttonLabel: d.button_label || "Submit for Review",
          })),
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Layout>
      <PageHero
        badge="Opportunities"
        title="Active Openings & Pathways"
        subtitle="Current opportunities, showcases, and talent calls. We believe in transparency — listing does not guarantee selection. Aligned with global casting, media, and distribution standards."
        backgroundImage={opportunitiesHero}
        backgroundPosition="center 40%"
        overlayVariant="enhanced"
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="card-premium p-6 mb-10 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-300">
              <strong className="text-foreground">Note:</strong> All opportunities are subject to eligibility and review. Listing here does not constitute an offer or guarantee. Apply only to opportunities that match your current level.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp, i) => (
              <motion.div
                key={opp.slug}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={`card-premium p-6 card-hover flex flex-col ${opp.featured ? "ring-1 ring-primary/40 border-primary/30" : ""}`}
              >
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-[10px] uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {opp.type}
                  </span>
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${statusClass(opp.status)}`}>
                    {opp.status}
                  </span>
                  {opp.featured && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-400 inline-flex items-center gap-1">
                      <Star className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{opp.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed flex-1 mb-4">{opp.desc}</p>
                <Button variant="gold-outline" size="sm" asChild>
                  <Link to={buildSubmitHref(opp)}>{opp.buttonLabel || "Submit for Review"}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-card">
        <div className="container-narrow text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">Nothing Here That Fits?</h2>
            <p className="mt-4 text-gray-300 text-lg font-light">Submit your profile and we'll match you with relevant opportunities as they come up, including advanced preparation pathways where appropriate.</p>
            <div className="mt-8">
              <Button variant="hero" size="xl" asChild><Link to="/submit?mode=casting">Submit for Review</Link></Button>
            </div>
            <p className="mt-3 text-xs text-gray-200">Selection is limited.</p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
