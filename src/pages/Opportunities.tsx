import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7 as const },
};

const opportunities = [
  { type: "Open Call", title: "New Faces — 2026 Talent Search", desc: "Seeking fresh creative talent across all categories. Open to emerging professionals and first-time applicants.", status: "Active" },
  { type: "Showcase", title: "Addis Creative Showcase", desc: "A curated evening of live performance, industry introductions, and creative presentation in Addis Ababa.", status: "Upcoming" },
  { type: "Internal Casting", title: "Brand Campaign — Spring 2026", desc: "Internal casting for a major commercial campaign. Priority consideration for represented talent.", status: "Active" },
  { type: "Partner Opportunity", title: "East Africa Media Fellowship", desc: "A regional mentorship and exposure program for media-focused talent, developed with industry partners.", status: "Upcoming" },
  { type: "Academy-Linked", title: "Academy Spotlight Series", desc: "Outstanding academy participants featured in our digital spotlight content across channels.", status: "Ongoing" },
  { type: "Talent Feature", title: "Monthly Creative Spotlight", desc: "Each month, one emerging talent is featured across our platforms and shared with partner networks.", status: "Ongoing" },
];

export default function Opportunities() {
  return (
    <Layout>
      <PageHero badge="Opportunities" title="Active Openings & Pathways" subtitle="Current opportunities, showcases, and talent calls. We believe in transparency — listing does not guarantee selection." />

      <section className="section-padding">
        <div className="container-wide">
          <div className="card-premium p-6 mb-10 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> All opportunities are subject to eligibility and review. Listing here does not constitute an offer or guarantee. Apply only to opportunities that match your current level.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.05 }} className="card-premium p-6 card-hover flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">{opp.type}</span>
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${opp.status === "Active" ? "bg-green-900/30 text-green-400" : opp.status === "Upcoming" ? "bg-secondary text-muted-foreground" : "bg-primary/5 text-primary"}`}>{opp.status}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{opp.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{opp.desc}</p>
                <Button variant="gold-outline" size="sm" asChild>
                  <Link to="/submit">Express Interest</Link>
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
            <p className="mt-4 text-muted-foreground text-lg font-light">Submit your profile and we'll match you with relevant opportunities as they come up.</p>
            <div className="mt-8">
              <Button variant="hero" size="xl" asChild><Link to="/submit">Submit for Review</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}