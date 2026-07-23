import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, TrendingUp, Globe, Camera, Users, Sparkles, Megaphone, Laptop } from "lucide-react";
import { BRAND } from "@/lib/brand";

const managementBanner =
  "/Management.PNG";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7 as const },
};

const services = [
  { icon: TrendingUp, title: "Career Strategy", desc: "Individual direction shaped by professional strengths, market fit, and long-term career objectives." },
  { icon: Sparkles, title: "Brand Positioning", desc: "Clear personal positioning designed to communicate value to audiences, partners, and industry decision-makers." },
  { icon: Camera, title: "Opportunity Positioning", desc: "Preparation and positioning for appropriate campaigns, castings, editorial opportunities, and commercial productions." },
  { icon: Users, title: "Booking Coordination", desc: "Professional handling of approved inquiries, schedules, requirements, and communications for confirmed engagements." },
  { icon: Megaphone, title: "Media Readiness", desc: "Interview preparation, message development, and public-profile guidance for credible and consistent visibility." },
  { icon: Globe, title: "International Readiness", desc: "Support for talent adapting their materials, conduct, and positioning to cross-border professional standards." },
  { icon: Shield, title: "Partnership Guidance", desc: "Strategic review of suitable sponsorship, endorsement, and brand-collaboration opportunities." },
  { icon: Laptop, title: "Digital Presence", desc: "Professional guidance for platform positioning, content direction, and a credible digital footprint." },
];

export default function Representation() {
  return (
    <Layout>
      <PageHero
        badge="Management"
        title="Management & Representation"
        subtitle="Selective. Strategic. Development-led."
        backgroundImage={managementBanner}
        backgroundPosition="center 24%"
        overlayVariant="enhanced"
        cta={{ label: "Submit for Review", href: "/submit?mode=representation" }}
      />

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="Scope" title="Support Built Around Career Readiness" subtitle="Services are tailored to the talent's stage, discipline, market fit, and approved pathway." />
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
                <p className="text-sm text-gray-300 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-card">
        <div className="container-narrow text-center">
          <motion.div {...fadeUp}>
            <SectionHeading badge="Consideration" title="A Selective Review Process" subtitle="Submitting an application begins a review; it does not guarantee development placement, management, bookings, or representation. Decisions are based on readiness, professionalism, market fit, and current capacity." />
            <p className="text-sm text-gray-300">
              Talent demonstrating advanced readiness may be considered separately by{" "}
              <a href={BRAND.poweredByUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-gold-light transition-colors">
                Emerge Globally
              </a>
              .
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/submit?mode=representation">Submit for Review</Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/academy">Explore Development Pathways</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-gray-300">Every submission is assessed against professional readiness and current opportunity fit.</p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
