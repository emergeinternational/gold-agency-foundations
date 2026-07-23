import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TALENT_CATEGORIES } from "@/lib/brand";
import { ArrowRight } from "lucide-react";

const representationBanner = "/AreasOfrepresentation.PNG";

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
        title="Areas of Talent Development"
        subtitle="We review and develop talent across media, entertainment, fashion, performance, and the creator economy, with selective pathways based on readiness and fit."
        backgroundImage={representationBanner}
        backgroundPosition="center 22%"
        overlayVariant="enhanced"
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
                  <p className="text-gray-300 leading-relaxed mb-6">{cat.description}</p>
                  <Button variant="gold-outline" size="sm" asChild>
                    <Link to={`/submit?category=${cat.id}`}>
                      Submit for Talent Review <ArrowRight className="w-3 h-3 ml-1" />
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
            <p className="mt-4 text-gray-300 text-lg font-light">
              Multidisciplinary applicants are welcome. Select the category that best reflects your primary professional direction and provide relevant supporting material.
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
