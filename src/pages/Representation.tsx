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
  { icon: TrendingUp, title: "Career Strategy", desc: "Tailored direction built around your strengths, market position, and long-term trajectory." },
  { icon: Sparkles, title: "Brand Architecture", desc: "Developing a compelling personal brand that resonates with industry and audiences alike." },
  { icon: Camera, title: "Campaign Placement", desc: "Connecting talent with brand campaigns, editorial projects, and commercial productions." },
  { icon: Users, title: "Booking Coordination", desc: "Professional management of event, production, and partnership bookings." },
  { icon: Megaphone, title: "Media Strategy", desc: "Press positioning, media training, and public profile development." },
  { icon: Globe, title: "Global Readiness", desc: "Preparing talent for cross-border opportunities and international market standards." },
  { icon: Shield, title: "Partnership Development", desc: "Facilitating endorsements, brand partnerships, and collaborative ventures with credible partners." },
  { icon: Laptop, title: "Digital Positioning", desc: "Social media optimization, content strategy, and digital presence management." },
];

export default function Representation() {
  return (
    <Layout>
      <PageHero
        badge="Representation"
        title="Selective. Strategic. Substantive."
        subtitle={`${BRAND.name} represents talent who are ready — or actively becoming ready — for the demands of a global stage. Our approach is built on trust, strategy, and genuine investment in every career we take on.`}
        cta={{ label: "Apply for Representation", href: "/submit" }}
      />

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="Services" title="What Representation Includes" />
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
            <SectionHeading badge="Next Step" title="How to Join Our Roster" subtitle="Representation is selective and merit-based. Submission does not guarantee signing — but every application is reviewed with care." />
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/submit">Begin Your Application</Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/academy">Prepare Through the Academy</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}