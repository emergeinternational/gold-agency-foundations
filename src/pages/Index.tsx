import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { BRAND, TALENT_CATEGORIES, ACADEMY_TRACKS } from "@/lib/brand";
import heroImage from "@/assets/hero-main.jpg";
import mrZikHero from "@/assets/mr-zik-hero.jpg";
import mrZikImage from "@/assets/mr-zik.jpg";
import academyImage from "@/assets/academy.jpg";
import { ArrowRight, Star, Users, BookOpen, Briefcase, Globe } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

export default function Index() {
  return (
    <Layout>
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/50" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        <div className="relative z-10 container-wide px-5 sm:px-8 lg:px-12 py-32 sm:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" as const }}
            className="max-w-2xl"
          >
            <span className="badge-label mb-8 block">
              {BRAND.locationPrimary} · Global Vision
            </span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold text-foreground leading-[1.02] tracking-tight">
              <span className="gold-gradient-text">{BRAND.name}</span>
            </h1>
            <p className="mt-3 text-[11px] tracking-[0.3em] uppercase text-muted-foreground/60">
              Powered by {BRAND.poweredBy}
            </p>
            <p className="mt-10 text-lg sm:text-xl text-secondary-foreground/80 leading-relaxed max-w-lg font-light">
              A premier talent representation and development platform.
              Discover, train, position, and elevate exceptional creative talent for the global stage.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="xl" asChild>
                <Link to="/submit">Submit Your Talent</Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/academy">Join the Academy</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── POSITIONING STRIP ─── */}
      <section className="border-y border-border/30">
        <div className="container-wide px-5 sm:px-8 lg:px-12 py-6 sm:py-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50">
            <span>Representation</span>
            <span className="text-primary/40">✦</span>
            <span>Academy</span>
            <span className="text-primary/40">✦</span>
            <span>Booking</span>
            <span className="text-primary/40">✦</span>
            <span>Development</span>
            <span className="text-primary/40">✦</span>
            <span>Global Vision</span>
          </div>
        </div>
      </section>

      {/* ─── MR. ZIK HERO SECTION ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${mrZikHero})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
        <div className="relative z-10 container-wide px-5 sm:px-8 lg:px-12 py-24 sm:py-32 lg:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="badge-label mb-5 block">The Face of The Agency</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05]">
                Mr. Zik
              </h2>
              <div className="gold-line mt-5 mb-8" />
              <p className="text-secondary-foreground/80 text-lg leading-relaxed mb-4 font-light">
                Ambassador, visionary, and the public leader of a movement redefining talent representation across Africa and beyond.
              </p>
              <p className="text-muted-foreground text-base leading-relaxed mb-10">
                Mr. Zik embodies the vision of {BRAND.name} — credible, connected, and committed to elevating creative excellence on a global stage. His leadership defines the agency's culture of access, professionalism, and bold ambition.
              </p>
              <Button variant="gold-outline" size="lg" asChild>
                <Link to="/mr-zik">
                  Meet Mr. Zik <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="hidden lg:flex justify-end"
            >
              <div className="w-72 xl:w-80 aspect-[3/4] rounded-sm overflow-hidden border border-primary/10">
                <img src={mrZikImage} alt="Mr. Zik — The Face of The Gold Agency" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SPLIT CTA ─── */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: "Submit Your Talent", desc: "Open submissions are now live. All talent categories are welcome to apply for representation.", href: "/submit", cta: "Start Submission" },
              { title: "Join the Academy", desc: "Develop your craft with industry-led classes, workshops, and professional tutorials.", href: "/academy", cta: "Explore Academy" },
              { title: "Book Talent", desc: "Access our roster for your next campaign, event, production, or brand collaboration.", href: "/book-talent", cta: "Request Booking" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="card-premium p-8 sm:p-10 flex flex-col card-hover"
              >
                <h3 className="font-display text-2xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">{item.desc}</p>
                <Button variant="gold" asChild>
                  <Link to={item.href}>{item.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PILLARS ─── */}
      <section className="section-padding-sm bg-card/50 border-y border-border/20">
        <div className="container-wide">
          <SectionHeading badge="What We Do" title="Five Pillars of Excellence" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: Star, title: "Representation", desc: "Selective, high-trust talent representation." },
              { icon: Users, title: "Open Submissions", desc: "Accessible pathways for emerging talent." },
              { icon: BookOpen, title: "Academy", desc: "Classes, workshops, and tutorials." },
              { icon: Briefcase, title: "Booking", desc: "Professional talent booking services." },
              { icon: Globe, title: "Expansion", desc: "Global talent operations readiness." },
            ].map((pillar, i) => (
              <motion.div
                key={pillar.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="text-center py-8 px-4"
              >
                <pillar.icon className="w-6 h-6 text-primary mx-auto mb-4 opacity-80" strokeWidth={1.5} />
                <h3 className="font-display text-base font-semibold text-foreground mb-1.5">{pillar.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TALENT CATEGORIES ─── */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading
            badge="Talent Categories"
            title="Representing Diverse Excellence"
            subtitle="From media personalities to cultural voices — we champion talent across every creative discipline."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TALENT_CATEGORIES.map((cat, i) => (
              <motion.div key={cat.id} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.04 }}>
                <Link to="/talent-categories" className="block card-premium p-6 sm:p-7 card-hover group">
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 leading-tight">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{cat.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="gold-outline" size="lg" asChild>
              <Link to="/talent-categories">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── ACADEMY ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${academyImage})` }} />
        <div className="absolute inset-0 bg-background/90" />
        <div className="relative z-10 section-padding">
          <div className="container-wide">
            <SectionHeading
              badge="The Academy"
              title="Train with Industry Leaders"
              subtitle="Structured programs, masterclasses, and hands-on workshops for every experience level."
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              {ACADEMY_TRACKS.map((track, i) => (
                <motion.div
                  key={track}
                  {...fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className="bg-card/60 border border-border/40 rounded-sm px-4 py-3.5 text-center backdrop-blur-sm"
                >
                  <span className="text-xs sm:text-sm text-foreground">{track}</span>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="hero" size="xl" asChild>
                <Link to="/academy">Explore the Academy</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="Process" title="Your Path Forward" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            {[
              { step: "01", title: "Explore", desc: "Browse talent categories, academy programs, and opportunities." },
              { step: "02", title: "Submit", desc: "Apply for representation or enroll in development programs." },
              { step: "03", title: "Develop", desc: "Work with industry professionals to refine your craft." },
              { step: "04", title: "Elevate", desc: "Access bookings, partnerships, and career opportunities." },
            ].map((item, i) => (
              <motion.div key={item.step} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="text-center">
                <span className="font-display text-4xl sm:text-5xl font-light text-primary/20">{item.step}</span>
                <h3 className="font-display text-lg font-semibold text-foreground mt-3 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="section-padding bg-card/50 border-y border-border/20">
        <div className="container-wide">
          <SectionHeading badge="Voices" title="What Talent & Partners Say" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { quote: "The Gold Agency gave me the structure and confidence I needed to take my career to the next level. Their approach is genuinely different.", name: "Talent Representative", role: "Media Personality" },
              { quote: "Working with their team was seamless — professional, organized, and committed to quality at every step of the production.", name: "Brand Partner", role: "Campaign Director" },
              { quote: "The academy workshops transformed how I approach my craft. The instructors are world-class and the environment pushes you to grow.", name: "Academy Graduate", role: "Digital Creator" },
            ].map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="card-premium p-8 sm:p-10">
                <div className="flex gap-0.5 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-foreground/90 text-sm leading-relaxed mb-8 font-light italic">"{t.quote}"</p>
                <div className="border-t border-border/30 pt-5">
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARTNERS ─── */}
      <section className="section-padding-sm">
        <div className="container-wide text-center">
          <span className="badge-label mb-8 block">Strategic Partnerships</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
            {["Studio Partner", "Media House", "Brand Collaborator", "Cultural Institution"].map((name) => (
              <div key={name} className="py-8 px-4 border border-border/20 rounded-sm">
                <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/40">{name}</span>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Button variant="gold-outline" size="sm" asChild>
              <Link to="/partnerships">Partner With Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="section-padding bg-card border-t border-border/20">
        <div className="container-narrow text-center">
          <motion.div {...fadeUp}>
            <span className="badge-label mb-5 block">Start Here</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-[1.1]">
              Ready to Be Seen?
            </h2>
            <p className="mt-5 text-muted-foreground text-base sm:text-lg max-w-lg mx-auto font-light">
              Whether you're emerging talent, an established creative, or a brand seeking exceptional representation — your next chapter begins here.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/submit">Submit Your Talent</Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/book-talent">Book Talent</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
