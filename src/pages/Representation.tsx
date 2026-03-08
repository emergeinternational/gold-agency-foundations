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
  transition: { duration: 0.7 },
};

const services = [
  { icon: TrendingUp, title: "Talent Positioning", desc: "Strategic career direction tailored to your unique strengths and market opportunities." },
  { icon: Sparkles, title: "Brand Development", desc: "Building a compelling personal brand that resonates with industry and audiences." },
  { icon: Camera, title: "Campaign Access", desc: "Connecting talent with brand campaigns, editorial projects, and commercial opportunities." },
  { icon: Users, title: "Booking Management", desc: "Professional booking coordination for events, productions, and partnerships." },
  { icon: Megaphone, title: "Media Development", desc: "Press strategy, media training, and public profile management." },
  { icon: Globe, title: "International Exposure", desc: "Preparing talent for cross-border opportunities and global market readiness." },
  { icon: Shield, title: "Partnership Pathways", desc: "Facilitating brand partnerships, endorsements, and collaborative ventures." },
  { icon: Laptop, title: "Digital Strategy", desc: "Social media optimization, content strategy, and digital presence management." },
];

export default function Representation() {
  return (
    <Layout>
      <PageHero
        badge="Representation"
        title="Selective. Strategic. High-Trust."
        subtitle={`${BRAND.name} represents talent who are ready — or becoming ready — for the global stage. Our approach is built on trust, strategy, and genuine investment in every talent's long-term success.`}
        cta={{ label: "Submit for Representation", href: "/submit" }}
      />

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="What We Offer" title="Comprehensive Talent Support" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="bg-card border border-border rounded-lg p-6 card-hover"
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
            <SectionHeading badge="How to Join" title="Becoming a Represented Talent" subtitle="Representation is selective and merit-based. Submission does not guarantee signing, but every application is reviewed by our team." />
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/submit">Begin Your Submission</Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/academy">Develop Through the Academy</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
