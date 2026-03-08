import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";
import addisImage from "@/assets/addis-skyline.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6 as const },
};

export default function About() {
  return (
    <Layout>
      <PageHero
        badge="About"
        title="Built for Talent That's Ready"
        subtitle={`${BRAND.name} is a premier talent representation and development platform powered by ${BRAND.poweredBy}. We exist to close the gap between potential and the global stage.`}
        backgroundImage={addisImage}
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            <motion.div {...fadeUp}>
              <span className="badge-label mb-5 block">Origin</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-[1.1] mb-8">A Platform, Not Just an Agency</h2>
              <div className="gold-line mb-10" />
              <div className="space-y-5 text-muted-foreground leading-[1.8] text-[15px]">
                <p>
                  {BRAND.name} was created to solve a specific problem: extraordinary talent exists everywhere, but the infrastructure to develop and position it rarely does. We built this platform to change that.
                </p>
                <p>
                  Headquartered in {BRAND.locationPrimary} with strategic ambition rooted in {BRAND.locationVision}, we operate where African creative excellence meets international industry standards. Our model combines selective representation with rigorous professional development — because visibility without readiness is a missed opportunity.
                </p>
                <p>
                  Powered by {BRAND.poweredBy}, the agency brings together industry expertise, media access, and development infrastructure designed for talent who want lasting careers — not just moments of attention.
                </p>
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
              <span className="badge-label mb-5 block">Philosophy</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-[1.1] mb-8">Representation Meets Preparation</h2>
              <div className="gold-line mb-10" />
              <div className="space-y-5 text-muted-foreground leading-[1.8] text-[15px]">
                <p>
                  We don't simply represent talent — we invest in it. Our model integrates professional training, brand strategy, media positioning, and opportunity access into a single, cohesive ecosystem.
                </p>
                <p>
                  Through our academy, creatives at every stage gain access to structured learning, industry-led workshops, and direct mentorship. Through our representation arm, proven talent gains access to bookings, brand partnerships, and campaign opportunities with credible partners.
                </p>
                <p>
                  The result: talent that arrives prepared, not just present. Professionals who are ready for the room — and memorable once they leave it.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-card/50 border-y border-border/20">
        <div className="container-wide">
          <SectionHeading badge="Values" title="What We Stand On" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Excellence", desc: "We hold ourselves and our talent to the highest professional and creative standards — no exceptions." },
              { title: "Access", desc: "Opportunity should follow merit, not geography. We build bridges where others build walls." },
              { title: "Integrity", desc: "Transparent processes, honest timelines, and ethical representation define how we operate." },
              { title: "Development", desc: "Growth is continuous. We invest in long-term readiness, not short-term exposure." },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="card-premium p-8 card-hover"
              >
                <h3 className="font-display text-xl font-semibold text-primary mb-3">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding-sm">
        <div className="container-narrow text-center">
          <motion.div {...fadeUp}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/40">
              {BRAND.poweredBy} · A subsidiary of {BRAND.legalEntity}
            </p>
            <p className="mt-2 text-xs text-muted-foreground/30">
              Headquartered in {BRAND.locationPrimary} · Global ambition rooted in {BRAND.locationVision}
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}