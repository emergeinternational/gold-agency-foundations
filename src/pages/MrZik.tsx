import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";
import mrZikImage from "@/assets/mr-zik.jpg";
import heroImage from "@/assets/hero-main.jpg";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7 as const },
};

export default function MrZik() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        <div className="relative z-10 container-wide px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-primary font-body font-semibold mb-4">
                The Face of {BRAND.name}
              </span>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05]">
                Mr. Zik
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
                Ambassador, visionary, and the public leader of a movement redefining talent representation and development across Africa and beyond.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="w-80 aspect-[3/4] rounded-lg overflow-hidden border border-border/50 shadow-2xl">
                <img src={mrZikImage} alt="Mr. Zik" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div {...fadeUp}>
              <SectionHeading badge="Biography" title="Leading with Vision" align="left" />
              <div className="space-y-4 text-muted-foreground leading-relaxed">
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
            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.2 }}>
              <SectionHeading badge="Why Mr. Zik" title="Credibility. Access. Trust." align="left" />
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Mr. Zik isn't just a figurehead — he's actively involved in talent scouting, program development, and strategic partnerships. His public presence communicates the agency's core values: media power, professional trust, and genuine commitment to talent growth.
                </p>
                <p>
                  He personally welcomes every talent who enters the platform, and his involvement ensures that the agency's culture remains personal, ambitious, and accessible.
                </p>
              </div>
              <div className="mt-8 p-6 bg-card border border-border rounded-lg">
                <p className="font-display text-lg italic text-foreground leading-relaxed">
                  "I believe that talent is universal, but opportunity is not. {BRAND.name} exists to change that equation — one creative at a time."
                </p>
                <p className="mt-3 text-sm text-primary font-semibold">— Mr. Zik</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Media Section */}
      <section className="section-padding bg-card">
        <div className="container-wide">
          <SectionHeading badge="Media" title="Featured Appearances" subtitle="Highlights from Mr. Zik's media presence and public engagements." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Agency Launch Keynote", type: "Video", desc: "The founding vision behind The Gold Agency and what it means for talent in Africa." },
              { title: "Media & Entertainment Panel", type: "Interview", desc: "Discussing the future of talent representation in a digital-first world." },
              { title: "Academy Opening Address", type: "Event", desc: "Welcoming the first cohort of academy participants and setting the standard for excellence." },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-secondary/30 border border-border rounded-lg overflow-hidden"
              >
                <div className="aspect-video bg-secondary flex items-center justify-center">
                  <span className="text-xs tracking-widest uppercase text-muted-foreground">{item.type} — Coming Soon</span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
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
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">
              Join the Movement
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              Mr. Zik invites talent, partners, and creative leaders to be part of something built to last. Start your journey today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/submit">Submit Your Talent <ArrowRight className="w-4 h-4 ml-1" /></Link>
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
