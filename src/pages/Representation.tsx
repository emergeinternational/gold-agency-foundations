import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";
import { Shield, TrendingUp, Globe, Camera, Users, Sparkles, Megaphone, Laptop } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7 as const },
};

const services = [
  { icon: TrendingUp, title: "Career Strategy", desc: "Tailored direction built around your strengths, market position, and long-term trajectory — not short-term visibility." },
  { icon: Sparkles, title: "Brand Architecture", desc: "Defining a personal brand that resonates with audiences and industry decision-makers alike." },
  { icon: Camera, title: "Campaign Placement", desc: "Positioning talent in brand campaigns, editorial features, and commercial productions with credible partners." },
  { icon: Users, title: "Booking Management", desc: "Professional coordination of event, production, and partnership bookings on your behalf." },
  { icon: Megaphone, title: "Media Positioning", desc: "Press strategy, interview preparation, and public profile development for sustained media presence." },
  { icon: Globe, title: "International Readiness", desc: "Preparing talent for cross-border opportunities, international standards, and global market demands." },
  { icon: Shield, title: "Partnership Facilitation", desc: "Connecting represented talent with endorsements, sponsorships, and strategic brand collaborations." },
  { icon: Laptop, title: "Digital Presence", desc: "Social media optimization, content direction, and digital footprint management for professional credibility." },
];

export default function Representation() {
  return (
    <Layout>
      <PageHero
        badge="Representation"
        title="Selective. Strategic. Invested."
        subtitle={`Representation at ${BRAND.name} is selective and intentional. Submission does not guarantee representation. Selected talent may be invited to further development and positioning opportunities.`}
        cta={{ label: "Submit for Review", href: "/submit" }}
      />

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="What's Included" title="The Full Scope of Representation" subtitle="Aligned with global casting, media, and distribution standards." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="card-premium p-7 card-hover"
              >
                <s.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-card">
        <div className="container-narrow text-center">
          <motion.div {...fadeUp}>
            <SectionHeading badge="How to Apply" title="Joining Our Roster" subtitle="Representation is earned through review, not guaranteed by application. Submission does not guarantee representation. Selected talent may be invited to further development and positioning opportunities." />
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/submit">Submit for Review</Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/academy">Explore Development Pathways</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Serious applicants only.</p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
