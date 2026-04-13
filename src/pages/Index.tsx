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
      <section className="relative min-h-screen flex items-start overflow-hidden">
        <motion.div
          initial={{ scale: 1.03, opacity: 0.92 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" as const }}
          className="absolute inset-0 bg-cover"
          style={{ backgroundImage: `url(${heroImage})`, backgroundPosition: "center 32%" }}
        />
        <div className="absolute inset-0 bg-background/62" />
        <div className="absolute inset-y-0 left-0 right-[30%] bg-gradient-to-r from-background via-background/90 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 sm:h-48 bg-gradient-to-b from-background via-background/62 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/58 to-transparent" />
        <div className="relative z-10 container-wide px-5 sm:px-8 lg:px-12 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" as const }}
            className="max-w-2xl"
          >
            <span className="badge-label mb-8 block">Serving talent across Africa and global markets.</span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.05] tracking-tight">
              Development-Stage Talent Representation
            </h1>
            <p className="mt-8 text-lg sm:text-xl text-secondary-foreground/80 leading-relaxed max-w-lg font-light">
              We represent and develop creators, artists, and talent building toward international positioning across media, music, fashion, and entertainment. Aligned with global casting, media, and distribution standards.
            </p>
            <p className="mt-3 text-[11px] tracking-[0.3em] uppercase text-gray-200">
              {BRAND.poweredByLine}
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="xl" asChild>
                <Link to="/submit">Submit for Review</Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/academy">Explore Development Pathways</Link>
              </Button>
            </div>
            <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-gray-200">Reviewed by our representation team.</p>
          </motion.div>
        </div>
      </section>

      {/* ─── POSITIONING STRIP ─── */}
      <section className="border-y border-border/30">
        <div className="container-wide px-5 sm:px-8 lg:px-12 py-6 sm:py-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50">
            <span>Representation</span>
            <span className="text-primary/40">✦</span>
            <span>Development</span>
            <span className="text-primary/40">✦</span>
            <span>Talent Booking</span>
            <span className="text-primary/40">✦</span>
            <span>Development Programs</span>
            <span className="text-primary/40">✦</span>
            <span>Africa to Global</span>
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
              <span className="badge-label mb-5 block">Public Ambassador</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05]">
                Mr. Zik
              </h2>
              <div className="gold-line mt-5 mb-8" />
              <p className="text-secondary-foreground/80 text-lg leading-relaxed mb-4 font-light">
                The face of {BRAND.name} — connecting Ethiopia's creative talent with the infrastructure, visibility, and access the industry demands.
              </p>
              <p className="text-gray-300 text-base leading-relaxed mb-10">
                A media personality and talent advocate whose career in entertainment and creative strategy gives the agency its edge: credibility earned, not claimed.
              </p>
              <Button variant="gold-outline" size="lg" asChild>
                <Link to="/mr-zik">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="hidden lg:flex justify-end"
            >
              <div className="w-72 xl:w-80 aspect-[3/4] rounded-sm overflow-hidden border border-primary/10">
                <img src={mrZikImage} alt={`Mr. Zik — Ambassador of ${BRAND.name}`} className="w-full h-full object-cover" loading="lazy" />
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
              { title: "Representation", desc: "We manage careers — not just bookings. Submission does not guarantee representation. Selected talent may be invited to further development and positioning opportunities.", href: "/submit", cta: "Submit for Review" },
              { title: "Development Programs", desc: "Structured development programs with professional positioning support, career-building resources and services, and advanced preparation pathways.", href: "/academy", cta: "Explore Development Pathways" },
              { title: "Talent Booking", desc: "Brands, productions, and event teams can access our curated roster for campaigns, appearances, and creative collaborations.", href: "/book-talent", cta: "Inquire About Talent" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="card-premium p-8 sm:p-10 flex flex-col card-hover"
              >
                <h3 className="font-display text-2xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-8 flex-1">{item.desc}</p>
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
          <SectionHeading badge="How We Operate" title="The Five Pillars" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: Star, title: "Curation", desc: "Selective, merit-based talent management built on standards." },
              { icon: Users, title: "Consideration", desc: "Representation review for selected talent with genuine potential." },
              { icon: BookOpen, title: "Development", desc: "Structured training tied directly to career readiness." },
              { icon: Briefcase, title: "Opportunity", desc: "Booking, casting, and campaign placement for our roster." },
              { icon: Globe, title: "Reach", desc: "Ethiopia-rooted with infrastructure for international markets." },
            ].map((pillar, i) => (
              <motion.div
                key={pillar.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="text-center py-8 px-4"
              >
                <pillar.icon className="w-6 h-6 text-primary mx-auto mb-4 opacity-80" strokeWidth={1.5} />
                <h3 className="font-display text-base font-semibold text-foreground mb-1.5">{pillar.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TALENT CATEGORIES ─── */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading
            badge="Disciplines"
            title="Ten Disciplines. One Standard of Excellence."
            subtitle="We represent talent across creators, media, music, entertainment, and fashion — building individuals with global potential."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TALENT_CATEGORIES.map((cat, i) => (
              <motion.div key={cat.id} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.04 }}>
                <Link to="/talent-categories" className="block card-premium p-6 sm:p-7 card-hover group">
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 leading-tight">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{cat.description}</p>
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

      {/* ─── DEVELOPMENT PROGRAMS ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${academyImage})` }} />
        <div className="absolute inset-0 bg-background/90" />
        <div className="relative z-10 section-padding">
          <div className="container-wide">
            <SectionHeading
              badge="Development Programs"
              title="Preparation Is the Advantage"
              subtitle="Structured development programs designed to support talent progressing toward representation readiness."
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
                <Link to="/academy">Explore Development Pathways</Link>
              </Button>
            </div>
            <p className="text-center mt-4 text-xs text-gray-200">Certain development pathways include structured program participation.</p>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading badge="The Process" title="From Application to Advancement" subtitle="Explore → Submit → Review → Develop → Advance" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            {[
              { step: "01", title: "Submit", desc: "After you explore fit, submit for representation or development consideration." },
              { step: "02", title: "Review", desc: "Applications are evaluated based on positioning and potential." },
              { step: "03", title: "Develop", desc: "Selected talent undergo structured development and positioning." },
              { step: "04", title: "Advance", desc: "Access opportunities, placements, and global exposure." },
            ].map((item, i) => (
              <motion.div key={item.step} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="text-center">
                <span className="font-display text-4xl sm:text-5xl font-light text-primary/20">{item.step}</span>
                <h3 className="font-display text-lg font-semibold text-foreground mt-3 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-300 mt-10">Selected talent progresses through structured development and positioning phases before advancing to booking and representation opportunities.</p>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="section-padding bg-card/50 border-y border-border/20">
        <div className="container-wide">
          <SectionHeading badge="Voices" title="What They Say" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { quote: "They didn't just sign me — they repositioned my entire career. The strategy behind every decision was clear and intentional.", name: "Represented Talent", role: "Media Personality" },
              { quote: "Working with their roster was seamless. The talent arrived prepared, professional, and exactly right for the campaign.", name: "Brand Partner", role: "Campaign Director" },
              { quote: "The development program gave me a framework. I walked out thinking differently about my entire craft and career direction.", name: "Program Graduate", role: "Digital Creator" },
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
                  <p className="text-[11px] text-gray-300 mt-0.5">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARTNERS ─── */}
      <section className="section-padding-sm">
        <div className="container-wide text-center">
          <span className="badge-label mb-8 block">Collaborators</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
            {["Studio Partner", "Media Network", "Brand Collaborator", "Cultural Institution"].map((name) => (
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
            <span className="badge-label mb-5 block">Next Step</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-[1.1]">
              Representation Starts with the Right Positioning
            </h2>
            <p className="mt-5 text-gray-300 text-base sm:text-lg max-w-lg mx-auto font-light">
              Whether you're applying for representation or building toward it — your next step begins here.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/submit">Submit for Review</Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/academy">Explore Development Pathways</Link>
              </Button>
            </div>
            <p className="mt-3 text-xs text-gray-200">Selection is limited.</p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
