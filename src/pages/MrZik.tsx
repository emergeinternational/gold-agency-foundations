import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";
import mrZikImage from "@/assets/mr-zik.jpg";
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
            <span className="badge-label mb-5 block">Ambassador · {BRAND.name}</span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[1.02] tracking-tight">
              Mr. Zik
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-secondary-foreground/80 leading-relaxed max-w-lg font-light">
              The public face of {BRAND.name} — leading a movement that connects African creative talent with global opportunity.
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
                  A Career Built on Access and Integrity
                </h2>
                <div className="gold-line mb-10" />
                <div className="space-y-5 text-muted-foreground leading-[1.8] text-[15px]">
                  <p>
                    Mr. Zik is a media personality, talent advocate, and creative strategist whose career has been defined by one purpose: building real pathways for exceptional talent. As the ambassador of {BRAND.name}, he represents the agency's unwavering standard of professionalism, credibility, and creative ambition.
                  </p>
                  <p>
                    His background spans media production, entertainment, and talent development — a combination that gives him rare insight into what it takes to succeed on both sides of the industry. He understands the business because he's lived it, and he understands talent because he's championed it from the beginning.
                  </p>
                  <p>
                    Under his public leadership, {BRAND.name} has grown into more than a talent agency — it's a development platform where emerging and established creatives gain access to the training, positioning, and opportunities that define lasting careers.
                  </p>
                </div>
              </motion.div>
            </div>
            <div className="lg:col-span-2">
              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="sticky top-28">
                <div className="aspect-[3/4] rounded-sm overflow-hidden border border-border/40">
                  <img src={mrZikImage} alt="Mr. Zik" className="w-full h-full object-cover" loading="lazy" />
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
              "Talent is everywhere. What's rare is the infrastructure to support it. That's what we're building — not promises, but pathways."
            </blockquote>
            <p className="mt-6 text-sm text-primary font-semibold tracking-[0.2em] uppercase">— Mr. Zik</p>
          </motion.div>
        </div>
      </section>

      {/* Why Mr. Zik */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="Leadership" title="Why His Presence Matters" align="left" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Industry Relationships", desc: "Established connections across media, entertainment, and brand ecosystems that open real doors for represented talent." },
              { title: "Active Involvement", desc: "Personally invested in talent scouting, program development, and strategic partnerships — not a figurehead, but a working leader." },
              { title: "Culture of Trust", desc: "His presence ensures the agency stays personal, ambitious, and genuinely invested in every creative's trajectory." },
            ].map((item, i) => (
              <motion.div key={item.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }} className="card-premium p-8 card-hover">
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="section-padding bg-card/50 border-y border-border/20">
        <div className="container-wide">
          <SectionHeading badge="Media" title="Public Engagements" subtitle="Selected highlights from Mr. Zik's media presence and speaking appearances." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: "Agency Launch Address", type: "Keynote", desc: "The founding vision behind {BRAND.name} and what it means for the future of talent in Africa." },
              { title: "The Future of Representation", type: "Panel", desc: "A candid conversation on what modern talent representation should look like in a digital-first world." },
              { title: "Academy Inaugural Address", type: "Event", desc: "Setting the standard for the first cohort of academy participants and the program's long-term vision." },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="card-premium overflow-hidden card-hover">
                <div className="aspect-video bg-secondary/50 flex items-center justify-center">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/50">{item.type} · Coming Soon</span>
                </div>
                <div className="p-6 sm:p-7">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
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
            <span className="badge-label mb-5 block">Be Part of It</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-[1.1]">
              The Door Is Open
            </h2>
            <p className="mt-5 text-muted-foreground text-base max-w-lg mx-auto font-light">
              Mr. Zik invites talent, collaborators, and creative leaders to join a platform built on substance, not spectacle.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/submit">Apply for Representation <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/academy">Explore the Academy</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}