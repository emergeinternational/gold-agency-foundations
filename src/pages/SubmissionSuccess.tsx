import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { BRAND } from "@/lib/brand";

export default function SubmissionSuccess() {
  const location = useLocation();
  const state = location.state as { submissionId?: string } | null;
  const submissionIdFromState = state?.submissionId?.trim();
  const submissionIdFromQuery = new URLSearchParams(location.search).get("submission_id")?.trim();
  const submissionId = submissionIdFromState || submissionIdFromQuery;
  const telegramHref = submissionId
    ? `https://t.me/AscendAgencybot?start=${encodeURIComponent(submissionId)}`
    : "https://t.me/AscendAgencybot";

  return (
    <Layout>
      <section className="section-padding min-h-[60vh] flex items-center">
        <div className="container-narrow text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="card-premium p-6 sm:p-8 mb-8 text-center">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-4">⚡ GET REAL-TIME APPLICATION UPDATES</h2>
              <Button variant="gold" size="lg" className="w-full sm:w-auto min-h-12 px-8" asChild>
                <a href={telegramHref} target="_blank" rel="noopener noreferrer">👉 START TELEGRAM UPDATES</a>
              </Button>
              <p className="text-sm text-gray-300 max-w-xl mx-auto mt-4">Use the same Telegram account linked to your phone number used in your application.</p>
              <p className="text-xs text-gray-400 max-w-xl mx-auto mt-2">Tap Start when Telegram opens. Updates are sent automatically.</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-4">Application Received</h1>
            <p className="text-gray-300 text-lg max-w-lg mx-auto mb-2">Thank you for applying to {BRAND.name}. Your submission is now under review.</p>
            <p className="text-sm text-gray-300 max-w-md mx-auto mb-8">Review timelines vary by category and volume. We will reach out directly if your profile is selected for further consideration. Submission does not guarantee representation.</p>
            <p className="text-sm text-gray-300 max-w-md mx-auto mb-8">
              Select candidates may be advanced for{" "}
              <a href={BRAND.poweredByUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-gold-light transition-colors">
                Emerge Globally
              </a>{" "}
              review.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gold" size="lg" asChild><Link to="/">Return Home</Link></Button>
              <Button variant="gold-outline" size="lg" asChild><Link to="/academy">Explore Development Pathways</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
