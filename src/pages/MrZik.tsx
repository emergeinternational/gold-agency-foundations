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
            <span className="badge-label mb-5 block">The Face of {BRAND.name}</span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[1.02] tracking-tight">
              Mr. Zik
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-secondary-foreground/80 leading-relaxed max-w-lg font-light">
              Ambassador, visionary, and the public leader of a movement redefining talent representation and development.
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
                  Leading with Vision
                </h2>
                <div className="gold-line mb-10" />
                <div className="space-y-5 text-muted-foreground leading-[1.8] text-[15px]">
                  <p>
                    Mr. Zik is a media personality, talent advocate, and creative strategist who has dedicated his career to building pathways for emerging and established talent. As the face of {BRAND.name}, he represents the agency's commitment to excellence, access, and global ambition.
                  </p>
                  <p>
                    With a background spanning media production, entertainment, and talent development, Mr. Zik brings a rare combination of industry insight and genuine passion for elevating creative professionals. His vision is simple: every talented individual deserves access to the tools, training, and opportunities that can transform their potential into a lasting career.
                  </p>
                  <p>
                    Under his leadership, {BRAND.name} has positioned itself as more than a talent agency — it's a development platform that takes talent from where they are to where they're meant to be.
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
              "I believe that talent is universal, but opportunity is not. {BRAND.name} exists to change that equation — one creative at a time."
            </blockquote>
            <p className="mt-6 text-sm text-primary font-semibold tracking-[0.2em] uppercase">— Mr. Zik</p>
          </motion.div>
        </div>
      </section>

      {/* Why Mr. Zik */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="Leadership" title="Credibility. Access. Trust." align="left" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Industry Access", desc: "Deep relationships across media, entertainment, and brand ecosystems that directly benefit represented talent." },
              { title: "Hands-On Involvement", desc: "Actively involved in talent scouting, program development, and strategic partnerships — not just a figurehead." },
              { title: "Talent-First Culture", desc: "His involvement ensures the agency's culture remains personal, ambitious, and genuinely invested in every talent's growth." },
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
          <SectionHeading badge="Media" title="Featured Appearances" subtitle="Highlights from Mr. Zik's media presence and public engagements." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: "Agency Launch Keynote", type: "Video", desc: "The founding vision behind The Gold Agency and what it means for talent in Africa." },
              { title: "Media & Entertainment Panel", type: "Interview", desc: "Discussing the future of talent representation in a digital-first world." },
              { title: "Academy Opening Address", type: "Event", desc: "Welcoming the first cohort of academy participants and setting the standard." },
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
            <span className="badge-label mb-5 block">Join the Movement</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-[1.1]">
              Your Journey Starts Here
            </h2>
            <p className="mt-5 text-muted-foreground text-base max-w-lg mx-auto font-light">
              Mr. Zik invites talent, partners, and creative leaders to be part of something built to last.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/submit">Submit Your Talent <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/academy">Explore Academy</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
