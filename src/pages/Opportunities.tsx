import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
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
  { type: "Open Call", title: "New Faces — 2026 Talent Search", desc: "We're looking for fresh faces across all talent categories. Open to beginners and emerging professionals.", status: "Active" },
  { type: "Showcase", title: "Addis Creative Showcase", desc: "A curated evening of live performances, presentations, and networking with industry professionals.", status: "Upcoming" },
  { type: "Internal Casting", title: "Brand Campaign — Spring 2026", desc: "Internal casting for a major brand campaign. Represented talent will be considered first.", status: "Active" },
  { type: "Partner Opportunity", title: "East Africa Media Fellowship", desc: "A partnership opportunity for media-focused talent to gain exposure and mentorship through regional networks.", status: "Upcoming" },
  { type: "Academy-Linked", title: "Academy Spotlight Series", desc: "Outstanding academy participants may be featured in our spotlight content series across digital platforms.", status: "Ongoing" },
  { type: "Talent Spotlight", title: "Monthly Featured Talent", desc: "Each month, we spotlight one emerging talent across our channels and partner networks.", status: "Ongoing" },
];

export default function Opportunities() {
  return (
    <Layout>
      <PageHero badge="Opportunities" title="Real Opportunities. Honest Expectations." subtitle="Explore current openings, showcases, and pathways. We believe in transparency — visibility of an opportunity does not guarantee selection." />

      <section className="section-padding">
        <div className="container-wide">
          <div className="card-premium p-6 mb-10 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Important:</strong> Visibility of an opportunity on this page does not guarantee selection or participation. All opportunities are subject to review, eligibility criteria, and availability. Apply only to opportunities that match your current readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.05 }} className="bg-card border border-border rounded-lg p-6 card-hover flex flex-col">
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
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">Don't See What You're Looking For?</h2>
            <p className="mt-4 text-muted-foreground text-lg">Submit your talent profile and we'll match you with relevant opportunities as they become available.</p>
            <div className="mt-8">
              <Button variant="hero" size="xl" asChild><Link to="/submit">Submit Your Talent</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
