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
        badge="The Academy"
        title="Develop Your Craft. Elevate Your Career."
        subtitle={`${BRAND.name} Academy offers structured programs, masterclasses, and hands-on workshops for every experience level — from emerging talent to established professionals.`}
        backgroundImage={academyImage}
        cta={{ label: "Browse Programs", href: "/classes-workshops" }}
        secondaryCta={{ label: "Online Tutorials", href: "/tutorials" }}
      />

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="Why the Academy" title="More Than Education — Transformation" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: GraduationCap, title: "Structured Programs", desc: "From beginner to advanced, follow a clear learning path designed for real industry readiness." },
              { icon: Users, title: "Industry Instructors", desc: "Learn from working professionals who bring real-world insight to every session." },
              { icon: Video, title: "In-Person & Online", desc: "Attend workshops in Addis Ababa or learn online through our tutorial library." },
              { icon: Award, title: "Masterclasses", desc: "Intensive deep-dives into specific skills with industry leaders and guest experts." },
              { icon: BookOpen, title: "Workshops", desc: "Hands-on, practical sessions designed to build tangible skills you can apply immediately." },
              { icon: Clock, title: "Flexible Scheduling", desc: "Programs designed to fit real schedules with evening, weekend, and self-paced options." },
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
          <SectionHeading badge="Learning Tracks" title="Programs for Every Creative Path" subtitle="Our curriculum covers the essential skills and knowledge areas that today's talent needs to succeed." />
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
          <SectionHeading badge="Instructors" title="Learn from the Best" subtitle="Our instructors are active industry professionals who bring real-world experience to every session." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: "Instructor TBA", role: "Media & Broadcasting", desc: "Seasoned broadcaster with 10+ years in television and radio." },
              { name: "Instructor TBA", role: "Social Media Strategy", desc: "Digital strategist who has grown brands to millions of followers." },
              { name: "Instructor TBA", role: "Music & Performance", desc: "Producer and performer with international touring experience." },
              { name: "Instructor TBA", role: "Public Speaking", desc: "Communication coach specializing in on-camera confidence." },
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
          <SectionHeading badge="FAQ" title="Academy Questions" />
          <div className="space-y-3">
            {[
              { q: "Do I need experience to join?", a: "No — our programs range from beginner to advanced. Everyone is welcome regardless of experience level." },
              { q: "Are programs in-person or online?", a: "Both. Workshops and masterclasses are held in Addis Ababa, while tutorials and select courses are available online." },
              { q: "Does completing a program guarantee representation?", a: "No. Academy participation and representation are separate processes. However, strong performance may lead to consideration." },
              { q: "How much do programs cost?", a: "Pricing varies by program. Some introductory workshops are free. Detailed pricing is available on individual program pages." },
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
            <span className="badge-label mb-5 block">Get Started</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-[1.1]">Ready to Begin?</h2>
            <p className="mt-5 text-muted-foreground text-base max-w-lg mx-auto font-light">Browse our upcoming classes, explore online tutorials, or get in touch to learn more.</p>
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
