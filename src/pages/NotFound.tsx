import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";

export default function NotFound() {
  const location = useLocation();

  return (
    <Layout>
      <section className="section-padding min-h-[70vh] flex items-center">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-display text-8xl sm:text-9xl font-light text-primary/20 block mb-6">404</span>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Page Not Found
            </h1>
            <p className="text-gray-300 text-base max-w-md mx-auto mb-10 font-light">
              The page you're looking for doesn't exist or has been moved. Let us help you find your way.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="gold" size="lg" asChild>
                <Link to="/">Return Home</Link>
              </Button>
              <Button variant="gold-outline" size="lg" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {[
                { label: "Submissions", href: "/submit" },
                { label: "Academy", href: "/academy" },
                { label: "Book Talent", href: "/book-talent" },
                { label: "FAQ", href: "/faq" },
              ].map(link => (
                <Link key={link.href} to={link.href} className="text-xs tracking-[0.15em] uppercase text-muted-foreground/60 hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}