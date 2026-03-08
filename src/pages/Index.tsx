import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { BRAND, TALENT_CATEGORIES, ACADEMY_TRACKS } from "@/lib/brand";
import heroImage from "@/assets/hero-main.jpg";
import mrZikImage from "@/assets/mr-zik.jpg";
import academyImage from "@/assets/academy.jpg";
import { ArrowRight, Star, Users, BookOpen, Briefcase, Globe } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
        <div className="relative z-10 container-wide px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-primary font-body font-semibold mb-6">
              Premier Talent Platform
            </span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[1.05]">
              {BRAND.name}
            </h1>
            <p className="mt-2 text-sm tracking-[0.2em] uppercase text-muted-foreground">
              Powered by {BRAND.poweredBy}
            </p>
            <p className="mt-8 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
              A premier talent representation and development platform. Discover, train, position, and elevate exceptional talent for the global stage.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
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

      {/* Pillars */}
      <section className="section-padding bg-card">
        <div className="container-wide">
          <SectionHeading
            badge="What We Do"
            title="Five Pillars of Excellence"
            subtitle="Built on the belief that talent deserves more than exposure — it deserves strategic development, professional guidance, and genuine opportunity."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Star, title: "Representation", desc: "Selective, high-trust talent representation with global vision." },
              { icon: Users, title: "Open Submissions", desc: "Accessible pathways for emerging talent across all categories." },
              { icon: BookOpen, title: "Academy", desc: "Classes, workshops, and tutorials for professional readiness." },
              { icon: Briefcase, title: "Booking", desc: "Professional talent booking for brands, events, and campaigns." },
              { icon: Globe, title: "Expansion", desc: "Future-ready infrastructure for global talent operations." },
            ].map((pillar, i) => (
              <motion.div
                key={pillar.title}
                {...fadeUp}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-secondary/50 border border-border rounded-lg p-6 text-center card-hover"
              >
                <pillar.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mr. Zik Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-primary font-body font-semibold mb-4">
                The Face of the Agency
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
                Meet Mr. Zik
              </h2>
              <div className="gold-line mt-4 mb-6" />
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-4">
                As the public face and ambassador of {BRAND.name}, Mr. Zik embodies the vision of what modern talent leadership looks like — credible, connected, and committed to elevating African creative excellence on a global stage.
              </p>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                With deep roots in media, entertainment, and talent development, Mr. Zik bridges the gap between raw potential and global readiness. His leadership defines the agency's culture of access, professionalism, and bold ambition.
              </p>
              <Button variant="gold-outline" size="lg" asChild>
                <Link to="/mr-zik">
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[3/4] rounded-lg overflow-hidden border border-border/50">
                <img src={mrZikImage} alt="Mr. Zik — The Face of The Gold Agency" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-primary/20 rounded-lg" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Split CTA */}
      <section className="section-padding bg-card">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Submit Your Talent", desc: "Open submissions are now live. All talent categories welcome.", href: "/submit", cta: "Start Submission" },
              { title: "Join the Academy", desc: "Develop your craft with industry-led classes, workshops, and tutorials.", href: "/academy", cta: "Explore Academy" },
              { title: "Book Talent", desc: "Access our roster for your next campaign, event, or production.", href: "/book-talent", cta: "Request Booking" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-secondary/30 border border-border rounded-lg p-8 flex flex-col card-hover"
              >
                <h3 className="font-display text-2xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">{item.desc}</p>
                <Button variant="gold" asChild>
                  <Link to={item.href}>{item.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Talent Categories */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading
            badge="Talent Categories"
            title="Representing Diverse Excellence"
            subtitle="From media personalities to cultural voices, we champion talent across every creative discipline."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TALENT_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              >
                <Link
                  to="/talent-categories"
                  className="block bg-card border border-border rounded-lg p-6 card-hover group"
                >
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {cat.label}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="gold-outline" size="lg" asChild>
              <Link to="/talent-categories">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Academy Preview */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${academyImage})` }}
        />
        <div className="absolute inset-0 bg-background/85" />
        <div className="relative z-10 section-padding">
          <div className="container-wide">
            <SectionHeading
              badge="The Academy"
              title="Train with Industry Leaders"
              subtitle="Our academy develops talent through structured programs, masterclasses, and hands-on workshops designed for every experience level."
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {ACADEMY_TRACKS.map((track, i) => (
                <motion.div
                  key={track}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="bg-secondary/50 border border-border rounded-md px-4 py-3 text-center"
                >
                  <span className="text-sm text-foreground">{track}</span>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button variant="hero" size="xl" asChild>
                <Link to="/academy">Explore the Academy</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-card">
        <div className="container-wide">
          <SectionHeading
            badge="How It Works"
            title="Your Path Forward"
            subtitle="Whether you're submitting for representation, enrolling in a program, or booking talent — the process is clear and professional."
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Explore", desc: "Browse our talent categories, academy programs, and opportunities." },
              { step: "02", title: "Submit or Enroll", desc: "Apply for representation or enroll in programs that match your goals." },
              { step: "03", title: "Develop", desc: "Work with industry professionals to sharpen your craft and presence." },
              { step: "04", title: "Elevate", desc: "Access opportunities, bookings, and partnerships that advance your career." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                {...fadeUp}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="text-center"
              >
                <span className="font-display text-5xl font-bold text-primary/30">{item.step}</span>
                <h3 className="font-display text-xl font-semibold text-foreground mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Placeholder */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading
            badge="Voices"
            title="What Talent & Partners Say"
            subtitle="Stories from those who have experienced the platform's commitment to excellence."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "The Gold Agency gave me the structure and confidence I needed to take my career to the next level. Their approach is genuinely different.", name: "Talent Representative", role: "Media Personality" },
              { quote: "Working with their team was seamless — professional, organized, and committed to quality at every step of the production.", name: "Brand Partner", role: "Campaign Director" },
              { quote: "The academy workshops transformed how I approach my craft. The instructors are world-class and the environment pushes you to grow.", name: "Academy Graduate", role: "Digital Creator" },
            ].map((t, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-card border border-border rounded-lg p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed italic mb-6">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section-padding bg-card">
        <div className="container-wide text-center">
          <SectionHeading
            badge="Partnerships"
            title="Trusted by Brands & Institutions"
            subtitle="We work with forward-thinking partners who share our commitment to elevating talent and creative culture."
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center opacity-50">
            {["Studio Partner", "Media House", "Brand Collaborator", "Cultural Institution"].map((name) => (
              <div key={name} className="py-6 px-4 border border-border/50 rounded-lg">
                <span className="text-sm tracking-widest uppercase text-muted-foreground">{name}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button variant="gold-outline" asChild>
              <Link to="/partnerships">Partner With Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="container-narrow text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
              Ready to Be Seen?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              Whether you're an emerging talent, an established creative, or a brand looking for exceptional representation — your next chapter starts here.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
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
