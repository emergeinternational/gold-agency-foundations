import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BRAND, ACADEMY_TRACKS } from "@/lib/brand";
import { BookOpen, Users, Video, Award, Clock, GraduationCap } from "lucide-react";

const developmentBanner = "/Development.PNG";

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
        subtitle={`${BRAND.name} offers structured learning and practical career preparation for talent building toward professional and market readiness.`}
        backgroundImage={developmentBanner}
        cta={{ label: "Browse Programs", href: "/classes-workshops" }}
        secondaryCta={{ label: "Online Tutorials", href: "/tutorials" }}
        backgroundPosition="center 24%"
        overlayVariant="enhanced"
      />

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="Approach" title="Development With Clear Direction" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: GraduationCap, title: "Structured Progression", desc: "Clear learning pathways that move from core skills toward stronger professional readiness." },
              { icon: Users, title: "Industry-Relevant Guidance", desc: "Programs are designed around current professional expectations, practical standards, and real market demands." },
              { icon: Video, title: "Flexible Delivery", desc: "Selected programs may be offered in person, online, or through blended formats, as stated in each listing." },
              { icon: Award, title: "Focused Masterclasses", desc: "Targeted sessions led by announced specialists with relevant expertise in the subject being taught." },
              { icon: BookOpen, title: "Applied Workshops", desc: "Practical sessions designed to strengthen usable skills, materials, and professional decision-making." },
              { icon: Clock, title: "Accessible Scheduling", desc: "Program formats may include evening, weekend, intensive, and self-paced options where available." },
            ].map((f, i) => (
              <motion.div key={f.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.05 }} className="card-premium p-7 card-hover">
                <f.icon className="w-7 h-7 text-primary mb-5 opacity-80" strokeWidth={1.5} />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-card/50 border-y border-border/20">
        <div className="container-wide">
          <SectionHeading badge="Curriculum" title="Skills That Strengthen Readiness" subtitle="Development areas selected to support stronger craft, positioning, professionalism, and career judgment." />
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
          <SectionHeading badge="Faculty" title="Specialists Announced by Program" subtitle="Instructor credentials and session leaders will be published with each confirmed program. Ascend does not present unconfirmed faculty profiles." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: "To Be Announced", role: "Media & Broadcasting", desc: "Program-specific faculty and credentials will be published when the session is confirmed." },
              { name: "To Be Announced", role: "Digital Strategy", desc: "Program-specific faculty and credentials will be published when the session is confirmed." },
              { name: "To Be Announced", role: "Music & Performance", desc: "Program-specific faculty and credentials will be published when the session is confirmed." },
              { name: "To Be Announced", role: "Public Speaking", desc: "Program-specific faculty and credentials will be published when the session is confirmed." },
            ].map((inst, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.05 }} className="card-premium p-7 text-center card-hover">
                <div className="w-16 h-16 rounded-full bg-secondary/60 mx-auto mb-5 flex items-center justify-center">
                  <Users className="w-6 h-6 text-muted-foreground/40" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{inst.name}</h3>
                <p className="text-[10px] text-primary mt-1 mb-3 uppercase tracking-[0.2em]">{inst.role}</p>
                <p className="text-xs text-gray-300 leading-relaxed">{inst.desc}</p>
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
              { q: "Do I need prior experience?", a: "Not always. Entry requirements vary by program and will be stated clearly in each listing." },
              { q: "Are sessions in person or online?", a: "Delivery format varies. Each program listing will specify whether it is in person, online, or blended, together with any location requirements." },
              { q: "Does completing a program lead to representation?", a: "No. Development participation and representation are separate processes. Completion does not guarantee management, bookings, or representation." },
              { q: "What do programs cost?", a: "Pricing varies by program. Any fees, deposits, inclusions, and payment terms will be disclosed before enrollment." },
            ].map((faq, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.04 }} className="card-premium p-6 sm:p-7">
                <h4 className="font-display text-base font-semibold text-foreground mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow text-center">
          <motion.div {...fadeUp}>
            <span className="badge-label mb-5 block">Next Step</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-[1.1]">Build the Skills Behind the Opportunity</h2>
            <p className="mt-5 text-gray-300 text-base max-w-lg mx-auto font-light">Review confirmed programs and tutorials to identify the development path that matches your discipline and current stage.</p>
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
