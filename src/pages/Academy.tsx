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
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7 as const },
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

      {/* Features */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="Why the Academy" title="More Than Education — Transformation" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: GraduationCap, title: "Structured Programs", desc: "From beginner to advanced, follow a clear learning path designed for real industry readiness." },
              { icon: Users, title: "Industry Instructors", desc: "Learn from working professionals who bring real-world insight to every session." },
              { icon: Video, title: "In-Person & Online", desc: "Attend workshops in Addis Ababa or learn online through our tutorial library." },
              { icon: Award, title: "Masterclasses", desc: "Intensive deep-dives into specific skills with industry leaders and guest experts." },
              { icon: BookOpen, title: "Workshops", desc: "Hands-on, practical sessions designed to build tangible skills you can apply immediately." },
              { icon: Clock, title: "Flexible Scheduling", desc: "Programs designed to fit real schedules with evening, weekend, and self-paced options." },
            ].map((f, i) => (
              <motion.div key={f.title} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.05 }} className="bg-card border border-border rounded-lg p-6 card-hover">
                <f.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Tracks */}
      <section className="section-padding bg-card">
        <div className="container-wide">
          <SectionHeading badge="Learning Tracks" title="Programs for Every Creative Path" subtitle="Our curriculum covers the essential skills and knowledge areas that today's talent needs to succeed." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {ACADEMY_TRACKS.map((track, i) => (
              <motion.div key={track} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.03 }} className="bg-secondary/50 border border-border rounded-lg px-4 py-4 text-center card-hover">
                <span className="text-sm text-foreground font-medium">{track}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="Instructors" title="Learn from the Best" subtitle="Our instructors are active industry professionals who bring real-world experience to every session." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Instructor TBA", role: "Media & Broadcasting", desc: "Seasoned broadcaster with 10+ years in television and radio." },
              { name: "Instructor TBA", role: "Social Media Strategy", desc: "Digital strategist who has grown brands to millions of followers." },
              { name: "Instructor TBA", role: "Music & Performance", desc: "Producer and performer with international touring experience." },
              { name: "Instructor TBA", role: "Public Speaking", desc: "Communication coach specializing in on-camera confidence." },
            ].map((inst, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.05 }} className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{inst.name}</h3>
                <p className="text-xs text-primary mt-1 mb-3 uppercase tracking-wider">{inst.role}</p>
                <p className="text-sm text-muted-foreground">{inst.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-card">
        <div className="container-narrow">
          <SectionHeading badge="FAQ" title="Academy Questions" />
          <div className="space-y-4">
            {[
              { q: "Do I need experience to join?", a: "No — our programs range from beginner to advanced. Everyone is welcome regardless of experience level." },
              { q: "Are programs in-person or online?", a: "Both. Workshops and masterclasses are held in Addis Ababa, while tutorials and select courses are available online." },
              { q: "Does completing a program guarantee representation?", a: "No. Academy participation and representation are separate processes. However, strong performance may lead to consideration." },
              { q: "How much do programs cost?", a: "Pricing varies by program. Some introductory workshops are free. Detailed pricing is available on individual program pages." },
            ].map((faq, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.05 }} className="bg-secondary/30 border border-border rounded-lg p-6">
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">{faq.q}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-narrow text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">Ready to Begin?</h2>
            <p className="mt-4 text-muted-foreground text-lg">Browse our upcoming classes, explore online tutorials, or get in touch to learn more about our programs.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild><Link to="/classes-workshops">Browse Programs</Link></Button>
              <Button variant="hero-outline" size="xl" asChild><Link to="/tutorials">Online Tutorials</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
