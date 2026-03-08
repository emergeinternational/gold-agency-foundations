import { useState } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TALENT_CATEGORIES } from "@/lib/brand";
import { ArrowRight, Filter } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7 as const },
};

// Placeholder roster — will be replaced by backend data
const SAMPLE_ROSTER: {
  slug: string;
  name: string;
  categoryId: string;
  specialties: string[];
  location: string;
  shortBio: string;
}[] = [];

export default function Roster() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = activeCategory === "all"
    ? SAMPLE_ROSTER
    : SAMPLE_ROSTER.filter(t => t.categoryId === activeCategory);

  return (
    <Layout>
      <PageHero
        badge="Our Roster"
        title="Curated Talent. Verified Standards."
        subtitle="Every name on our roster has been reviewed, developed, and approved for professional representation. This is not a directory — it is a curated selection of talent we stand behind."
      />

      {/* Category Filter */}
      <section className="border-b border-border/20">
        <div className="container-wide px-5 sm:px-8 lg:px-12 py-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 text-[11px] tracking-[0.15em] uppercase whitespace-nowrap rounded-sm transition-all duration-300 ${
                activeCategory === "all"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground/60 hover:text-foreground border border-transparent"
              }`}
            >
              All Disciplines
            </button>
            {TALENT_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-[11px] tracking-[0.15em] uppercase whitespace-nowrap rounded-sm transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-muted-foreground/60 hover:text-foreground border border-transparent"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Roster Grid */}
      <section className="section-padding">
        <div className="container-wide">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((talent, i) => {
                const category = TALENT_CATEGORIES.find(c => c.id === talent.categoryId);
                return (
                  <motion.div
                    key={talent.slug}
                    {...fadeUp}
                    transition={{ duration: 0.6, delay: i * 0.04 }}
                  >
                    <Link
                      to={`/roster/${talent.slug}`}
                      className="block card-premium overflow-hidden card-hover group"
                    >
                      {/* Image placeholder */}
                      <div className="aspect-[3/4] bg-secondary/40 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {talent.name}
                          </h3>
                          {category && (
                            <p className="text-[10px] tracking-[0.2em] uppercase text-primary/80 mt-1">
                              {category.label}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {talent.specialties.slice(0, 3).map(s => (
                            <span key={s} className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/60 border border-border/30 rounded-sm px-2 py-0.5">
                              {s}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50">
                          {talent.location}
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-xs text-primary group-hover:gap-2 transition-all">
                          View Profile <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Empty state — roster not yet populated */
            <motion.div {...fadeUp} className="text-center py-20 sm:py-32">
              <div className="max-w-md mx-auto">
                <span className="badge-label mb-5 block">Coming Soon</span>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-4">
                  Our Roster Is Being Curated
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  We are currently reviewing submissions and onboarding represented talent. Public profiles will appear here as our roster grows — every name carefully selected and verified.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="hero" size="xl" asChild>
                    <Link to="/submit">Submit for Review</Link>
                  </Button>
                  <Button variant="hero-outline" size="xl" asChild>
                    <Link to="/book-talent">Inquire About Talent</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding bg-card border-t border-border/20">
        <div className="container-narrow text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
              Looking for Specific Talent?
            </h2>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
              If you have a booking inquiry or need talent for a specific project, our team can recommend the right match from our roster — even before all profiles are publicly listed.
            </p>
            <div className="mt-8">
              <Button variant="gold" size="lg" asChild>
                <Link to="/book-talent">Send a Booking Inquiry</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
