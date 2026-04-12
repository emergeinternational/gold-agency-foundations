import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BRAND, ACADEMY_TRACKS } from "@/lib/brand";
import academyImage from "@/assets/academy.jpg";
import { BookOpen, Users, Video, Award, Clock, GraduationCap } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6 as const },
};

export default function Academy() {
  return (
    <Layout>
      <PageHero
        badge="Development Programs"
        title="Preparation Is the Advantage"
        subtitle={`${BRAND.name} offers structured training designed to support talent progressing toward representation readiness — led by active industry professionals.`}
        backgroundImage={academyImage}
        cta={{ label: "Browse Programs", href: "/classes-workshops" }}
        secondaryCta={{ label: "Online Tutorials", href: "/tutorials" }}
      />

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="Why This Matters" title="Development With Clear Direction" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: GraduationCap, title: "Structured Progression", desc: "Clear learning tracks from foundational skills to advanced industry readiness — nothing left to guesswork." },
              { icon: Users, title: "Active Practitioners", desc: "Every instructor works in the industry today. Real insight from people who understand current market realities." },
              { icon: Video, title: "In-Person & Online", desc: "Attend sessions in Addis Ababa or access our growing tutorial library from wherever you are." },
              { icon: Award, title: "Masterclass Format", desc: "Intensive deep-dives with guest experts who bring specialized, high-value knowledge to the table." },
              { icon: BookOpen, title: "Applied Workshops", desc: "Skill-building sessions designed to produce results you can use immediately — not theory for theory's sake." },
              { icon: Clock, title: "Designed for Real Schedules", desc: "Evening, weekend, and self-paced options for working professionals and active creatives." },
            ].map((f, i) => (
              <motion.div key={f.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.05 }} className="card-premium p-7 card-hover">
                <f.icon className="w-7 h-7 text-primary mb-5 opacity-80" strokeWidth={1.5} />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-card/50 border-y border-border/20">
        <div className="container-wide">
          <SectionHeading badge="Curriculum" title="Skill Areas That Define Readiness" subtitle="The knowledge domains today's creative professionals need to compete at the highest level." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {ACADEMY_TRACKS.map((track, i) => (
              <motion.div key={track} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.03 }} className="bg-secondary/40 border border-border/30 rounded-sm px-4 py-4 text-center">
                <span className="text-xs sm:text-sm text-foreground font-medium">{track}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="Faculty" title="Instructors Who Do the Work" subtitle="Our faculty aren't retired professionals — they're active practitioners bringing current industry reality to every session." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: "Instructor TBA", role: "Media & Broadcasting", desc: "Veteran broadcaster with over a decade in television, radio, and digital media production." },
              { name: "Instructor TBA", role: "Digital Strategy", desc: "Growth strategist who has built audiences in the millions across multiple social platforms." },
              { name: "Instructor TBA", role: "Music & Performance", desc: "Producer and performer with international touring, recording, and licensing experience." },
              { name: "Instructor TBA", role: "Public Speaking", desc: "Communication specialist focused on executive delivery and on-camera presence." },
            ].map((inst, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.05 }} className="card-premium p-7 text-center card-hover">
                <div className="w-16 h-16 rounded-full bg-secondary/60 mx-auto mb-5 flex items-center justify-center">
                  <Users className="w-6 h-6 text-muted-foreground/40" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{inst.name}</h3>
                <p className="text-[10px] text-primary mt-1 mb-3 uppercase tracking-[0.2em]">{inst.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{inst.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-card/50 border-y border-border/20">
        <div className="container-narrow">
          <SectionHeading badge="Questions" title="Development Programs FAQ" />
          <div className="space-y-3">
            {[
              { q: "Do I need prior experience?", a: "No. Programs range from foundational to advanced. We meet you where you are and build from there." },
              { q: "Are sessions in-person or online?", a: "Both. Workshops and masterclasses run in person in Addis Ababa, with select programs available online for participants anywhere in the world. Each listing clearly indicates its delivery format and location." },
              { q: "Does completing a program lead to representation?", a: "Not automatically. Development programs and representation operate as separate tracks. Strong performance may lead to consideration, but there is no guaranteed pathway." },
              { q: "What do programs cost?", a: "Pricing varies by program. Some introductory workshops are free. Full pricing details are listed on individual program pages." },
            ].map((faq, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.04 }} className="card-premium p-6 sm:p-7">
                <h4 className="font-display text-base font-semibold text-foreground mb-2">{faq.q}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow text-center">
          <motion.div {...fadeUp}>
            <span className="badge-label mb-5 block">Take the Step</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-[1.1]">Your Craft Deserves Serious Investment</h2>
            <p className="mt-5 text-muted-foreground text-base max-w-lg mx-auto font-light">Browse upcoming programs, explore online tutorials, or reach out to find the right track for your goals.</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="xl" asChild><Link to="/classes-workshops">Browse Programs</Link></Button>
              <Button variant="hero-outline" size="xl" asChild><Link to="/tutorials">Online Tutorials</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
