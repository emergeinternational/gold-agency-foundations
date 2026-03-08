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
        badge="About Us"
        title="Where Talent Meets Opportunity"
        subtitle={`${BRAND.name} is a premier talent representation and development platform powered by ${BRAND.poweredBy}. We exist to discover, train, position, and elevate exceptional talent for the global stage.`}
        backgroundImage={addisImage}
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            <motion.div {...fadeUp}>
              <span className="badge-label mb-5 block">Our Story</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-[1.1] mb-8">Built for the Future of Talent</h2>
              <div className="gold-line mb-10" />
              <div className="space-y-5 text-muted-foreground leading-[1.8] text-[15px]">
                <p>
                  {BRAND.name} was founded with a clear vision: to create a world-class talent representation and development platform that bridges the gap between raw potential and global readiness.
                </p>
                <p>
                  Based in {BRAND.locationPrimary}, with strategic vision tied to {BRAND.locationVision}, we operate at the intersection of African creative excellence and international industry standards. Our platform combines selective talent representation with rigorous professional development.
                </p>
                <p>
                  Powered by {BRAND.poweredBy}, the agency brings together industry expertise, media access, and development infrastructure to ensure that every talent we work with is positioned for lasting success — not just momentary visibility.
                </p>
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
              <span className="badge-label mb-5 block">Our Approach</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-[1.1] mb-8">Representation Meets Development</h2>
              <div className="gold-line mb-10" />
              <div className="space-y-5 text-muted-foreground leading-[1.8] text-[15px]">
                <p>
                  We don't simply represent talent — we develop it. Our model integrates professional training, brand strategy, media positioning, and opportunity access into a unified ecosystem.
                </p>
                <p>
                  Through our academy, emerging and established talent gain access to structured learning tracks, industry-led workshops, and one-on-one mentorship. Through our representation arm, proven talent gains access to bookings, partnerships, and campaign opportunities.
                </p>
                <p>
                  This dual approach ensures that talent who joins our platform is not only visible — but genuinely ready for the opportunities ahead.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-card/50 border-y border-border/20">
        <div className="container-wide">
          <SectionHeading badge="Values" title="What Drives Us" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Excellence", desc: "We hold ourselves and our talent to the highest professional and creative standards." },
              { title: "Access", desc: "Opportunity should be earned through merit, not limited by geography or background." },
              { title: "Integrity", desc: "Transparent processes, honest communication, and ethical representation define every interaction." },
              { title: "Development", desc: "Growth is continuous. We invest in talent's long-term readiness, not just short-term exposure." },
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
