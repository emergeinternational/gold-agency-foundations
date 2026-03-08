import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { BRAND } from "@/lib/brand";

export default function BookingSuccess() {
  return (
    <Layout>
      <section className="section-padding min-h-[60vh] flex items-center">
        <div className="container-narrow text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-4">Inquiry Received</h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-2">Thank you for your interest in booking talent through {BRAND.name}.</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">Our team will review your project details and respond within 2–3 business days with availability, recommendations, and next steps.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gold" size="lg" asChild><Link to="/">Return Home</Link></Button>
              <Button variant="gold-outline" size="lg" asChild><Link to="/talent-categories">Browse Categories</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}