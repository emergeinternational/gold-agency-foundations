import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { BRAND } from "@/lib/brand";

export default function EnrollmentSuccess() {
  return (
    <Layout>
      <section className="section-padding min-h-[60vh] flex items-center">
        <div className="container-narrow text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-4">Enrollment Confirmed</h1>
            <p className="text-gray-300 text-lg max-w-lg mx-auto mb-2">You've been enrolled in an {BRAND.name} development program.</p>
            <p className="text-sm text-gray-300 max-w-md mx-auto mb-8">Full confirmation details will be sent once the enrollment system is connected. Thank you for investing in your development.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gold" size="lg" asChild><Link to="/">Return Home</Link></Button>
              <Button variant="gold-outline" size="lg" asChild><Link to="/classes-workshops">Browse More Programs</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
