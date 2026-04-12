import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TALENT_CATEGORIES } from "@/lib/brand";
import { ArrowRight } from "lucide-react";

const representationBanner =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=2200&q=80";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7 as const },
};

export default function TalentCategories() {
  return (
    <Layout>
      <PageHero
        badge="Disciplines"
        title="Areas of Representation"
        subtitle="We represent and develop talent across the full spectrum of creative industries — from broadcast media to digital storytelling."
        backgroundImage={representationBanner}
        backgroundPosition="center 35%"
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TALENT_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                {...fadeUp}
                transition={{ duration: 0.7, delay: i * 0.05 }}
                className="card-premium p-8 card-hover group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-8 translate-x-8 group-hover:bg-primary/10 transition-colors" />
                <div className="relative">
                  <h3 className="font-display text-2xl font-semibold text-foreground group-hover:text-primary transition-colors mb-3">
                    {cat.label}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{cat.description}</p>
                  <Button variant="gold-outline" size="sm" asChild>
                    <Link to="/submit">
                      Submit for Representation Consideration <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-card">
        <div className="container-narrow text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">
              Work Across Multiple Disciplines?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg font-light">
              We welcome multidisciplinary talent. If your craft crosses categories, we still want to hear from you.
            </p>
            <div className="mt-8">
              <Button variant="hero" size="xl" asChild>
                <Link to="/submit">Submit for Review</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
