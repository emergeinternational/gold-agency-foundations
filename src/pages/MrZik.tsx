import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";
import mrZikImage from "@/assets/mr-zik.png";
import mrZikHero from "@/assets/mr-zik-hero.jpg";
import { ArrowRight, Quote } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6 as const },
};

export default function MrZik() {
  return (
    <Layout>
      {/* Hero — full-bleed cinematic */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${mrZikHero})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="relative z-10 container-wide px-5 sm:px-8 lg:px-12 pb-16 sm:pb-20 lg:pb-24 pt-40">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" as const }}>
            <span className="badge-label mb-5 block">National Creative Ambassador</span>
            <h1 className="font-display text-lg sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.02] tracking-tight whitespace-nowrap">
              Zewotir Desalegn Alemu (Mr. Zik)
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-secondary-foreground/80 leading-relaxed max-w-lg font-light">
              Media personality, talent advocate, and the public face of an agency built to change how Ethiopia's creative industry operates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bio */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-3">
              <motion.div {...fadeUp}>
                <span className="badge-label mb-5 block">Biography</span>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-[1.1] mb-8">
                  Credibility Built in the Field
                </h2>
                <div className="gold-line mb-10" />
                <div className="space-y-5 text-gray-300 leading-[1.8] text-[15px]">
                  <p>
                    The career of Zewotir Desalegn Alemu (Mr. Zik) spans media production, entertainment, and talent advocacy — a rare combination that makes him uniquely qualified to lead the public identity of {BRAND.name}. He understands both sides of the industry because he's worked both sides.
                  </p>
                  <p>
                    His role isn't ceremonial. As the agency's ambassador, he's personally involved in talent scouting, program direction, and building the partnerships that connect {BRAND.locationPrimary}'s creative community with opportunities that would otherwise remain out of reach.
                  </p>
                  <p>
                    Under his leadership, the agency has become more than a talent roster — it's a development-stage representation agency where emerging and established creatives gain the training, positioning, and access that define sustainable careers.
                  </p>
                </div>
              </motion.div>
            </div>
            <div className="lg:col-span-2">
              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="sticky top-28">
                <div className="aspect-[3/4] rounded-sm overflow-hidden border border-border/40">
                  <img src={mrZikImage} alt="Zewotir Desalegn Alemu (Mr. Zik)" className="w-full h-full object-cover" loading="lazy" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="section-padding-sm bg-card border-y border-border/20">
        <div className="container-narrow">
          <motion.div {...fadeUp} className="text-center">
            <Quote className="w-8 h-8 text-primary/30 mx-auto mb-6" strokeWidth={1} />
            <blockquote className="font-display text-xl sm:text-2xl lg:text-3xl font-light text-foreground/90 leading-relaxed italic">
              "Talent is everywhere. Infrastructure is not. That's the gap we exist to close — with intention, not promises."
            </blockquote>
            <p className="mt-6 text-sm text-primary font-semibold tracking-[0.2em] uppercase">— Zewotir Desalegn Alemu (Mr. Zik)</p>
          </motion.div>
        </div>
      </section>

      {/* Why Zewotir Desalegn Alemu (Mr. Zik) */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="Role" title="What His Leadership Means" align="left" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Industry Access", desc: "Deep relationships across media, entertainment, and brand ecosystems — translating into real doors opened for the agency's talent." },
              { title: "Hands-On Direction", desc: "Personally involved in scouting, program development, and strategic partnerships. A working leader, not a figurehead." },
              { title: "Cultural Authority", desc: `His presence ensures the agency remains grounded in ${BRAND.locationPrimary}'s creative culture while building credibility that travels internationally.` },
            ].map((item, i) => (
              <motion.div key={item.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }} className="card-premium p-8 card-hover">
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="section-padding bg-card/50 border-y border-border/20">
        <div className="container-wide">
          <SectionHeading badge="Appearances" title="Selected Media & Speaking" subtitle="Highlights from the public engagements and industry presence of Zewotir Desalegn Alemu (Mr. Zik)." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: "Agency Launch Address", type: "Keynote", desc: "The founding vision behind the agency and its commitment to building real infrastructure for African creative talent." },
              { title: "The New Standard of Representation", type: "Panel", desc: "A candid discussion on what talent representation must look like in a digital-first, globally connected industry." },
              { title: "Development Programs Inaugural Address", type: "Event", desc: "Setting expectations for the first cohort of development program participants and outlining the long-term direction." },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="card-premium overflow-hidden card-hover">
                <div className="aspect-video bg-secondary/50 flex items-center justify-center">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/50">{item.type} · Coming Soon</span>
                </div>
                <div className="p-6 sm:p-7">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-narrow text-center">
          <motion.div {...fadeUp}>
            <span className="badge-label mb-5 block">Take the Next Step</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-[1.1]">
              Built on Substance. Selective by Design.
            </h2>
            <p className="mt-5 text-gray-300 text-base max-w-lg mx-auto font-light">
              Zewotir Desalegn Alemu (Mr. Zik) invites serious creatives, collaborators, and industry partners to be part of an agency that earns its credibility every day.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/submit">Submit for Review <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/academy">Explore Development Pathways</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
