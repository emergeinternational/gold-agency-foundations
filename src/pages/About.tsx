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
        title="Built for Talent Ready to Advance"
        subtitle={`${BRAND.name} is the talent-development division of Emerge Globally, created to discover, prepare, and position emerging professionals for credible opportunities across media, entertainment, fashion, and the creator economy.`}
        backgroundImage={addisImage}
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            <motion.div {...fadeUp}>
              <span className="badge-label mb-5 block">Purpose</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-[1.1] mb-8">Closing the Readiness Gap</h2>
              <div className="gold-line mb-10" />
              <div className="space-y-5 text-gray-300 leading-[1.8] text-[15px]">
                <p>
                  Exceptional talent exists across Ethiopia, Africa, and global markets. What is often missing is the professional infrastructure required to develop that talent, sharpen its positioning, and prepare it for serious industry consideration.
                </p>
                <p>
                  Ascend Elite Agency is built around that gap. We combine selective talent review, structured development, portfolio preparation, media positioning, and career-readiness support within one coordinated platform.
                </p>
                <p>
                  Our focus is not visibility for its own sake. We help talent strengthen the materials, discipline, presentation, and market understanding required to pursue sustainable careers.
                </p>
                <p>
                  As the Development Division of{" "}
                  <a href={BRAND.poweredByUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-gold-light transition-colors">
                    Emerge Globally
                  </a>
                  , Ascend draws on cross-market experience spanning talent initiatives, castings, workshops, media activity, and industry collaborations in Africa, the United States, and other international markets.
                </p>
                <p>
                  Talent demonstrating advanced readiness may be considered separately by{" "}
                  <a href={BRAND.poweredByUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-gold-light transition-colors">
                    Emerge Globally
                  </a>
                  for representation opportunities. Participation in Ascend does not guarantee representation.
                </p>
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
              <span className="badge-label mb-5 block">Approach</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-[1.1] mb-8">Preparation Before Promotion</h2>
              <div className="gold-line mb-10" />
              <div className="space-y-5 text-gray-300 leading-[1.8] text-[15px]">
                <p>
                  We do not confuse attention with career progress. Strong positioning begins with honest assessment, clear direction, and work that meets professional standards.
                </p>
                <p>
                  Development pathways may include practical training, portfolio and profile refinement, brand strategy, media preparation, digital positioning, and guidance tailored to a talent's discipline and stage of growth.
                </p>
                <p>
                  The objective is simple: help promising individuals become better prepared for the rooms, platforms, partnerships, and decisions that shape long-term careers.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-card/50 border-y border-border/20">
        <div className="container-wide">
          <SectionHeading badge="Principles" title="The Standard Behind the Work" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Excellence", desc: "We expect professional discipline, strong preparation, and continuous improvement from our team and the talent we support." },
              { title: "Merit", desc: "Consideration is based on potential, readiness, conduct, and fit, not geography, social proximity, or empty visibility." },
              { title: "Integrity", desc: "Clear expectations, honest communication, responsible talent practices, and respect for applicant privacy guide every decision." },
              { title: "Progress", desc: "We prioritize measurable development and durable career foundations over short-term exposure." },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="card-premium p-8 card-hover"
              >
                <h3 className="font-display text-xl font-semibold text-primary mb-3">{v.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding-sm">
        <div className="container-narrow text-center">
          <motion.div {...fadeUp}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-200">
              Development Division of Emerge Globally
            </p>
            <p className="mt-2 text-xs text-gray-200">
              Ascend Elite Agency operates as a development division of Emerge Globally, a New York–based company.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
