import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { useEffect, useState } from "react";

export default function SubmissionSuccess() {
  const location = useLocation();
  const state = location.state as { submissionId?: string; justSaved?: boolean } | null;
  const submissionIdFromState = state?.submissionId?.trim();
  const submissionIdFromQuery = new URLSearchParams(location.search).get("submission_id")?.trim();
  const submissionId = submissionIdFromState || submissionIdFromQuery;
  const [attemptedOpen, setAttemptedOpen] = useState(false);
  const telegramHref = submissionId
    ? `https://t.me/AscendAgencybot?start=${encodeURIComponent(submissionId)}`
    : "https://t.me/AscendAgencybot";
  const shouldAutostart = Boolean(state?.justSaved && submissionId);

  useEffect(() => {
    if (!shouldAutostart || attemptedOpen) return;
    setAttemptedOpen(true);
    const timer = window.setTimeout(() => {
      window.open(telegramHref, "_blank", "noopener,noreferrer");
    }, 900);
    return () => window.clearTimeout(timer);
  }, [attemptedOpen, shouldAutostart, telegramHref]);

  return (
    <Layout>
      <section className="section-padding min-h-[60vh] flex items-center">
        <div className="container-narrow text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-3">Application Received</h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto mb-8">
              Thank you for applying to {BRAND.name}. Your submission has been successfully received.
            </p>
            {shouldAutostart && (
              <div className="mb-6 rounded-sm border border-primary/40 bg-primary/10 px-4 py-3 text-left sm:text-center">
                <p className="text-sm text-foreground font-medium">Application saved.</p>
                <p className="text-xs text-muted-foreground">Now press START in Telegram to receive updates.</p>
                <p className="text-xs text-muted-foreground">Opening Telegram now…</p>
              </div>
            )}

            <div className="card-premium p-6 sm:p-8 mb-8 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center gap-2 text-primary mb-3">
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs tracking-[0.2em] uppercase text-gray-400">Priority Action</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-5">⚡ GET REAL-TIME APPLICATION UPDATES</h2>
              <Button variant="gold" size="lg" className="w-full sm:w-auto min-h-12 px-8 shadow-lg shadow-primary/20" asChild>
                <a href={telegramHref} target="_blank" rel="noopener noreferrer">👉 START TELEGRAM UPDATES</a>
              </Button>
              <p className="text-sm text-gray-300 max-w-xl mx-auto mt-4">Use the same Telegram account linked to the phone number used in your application.</p>
              <p className="text-xs text-gray-400 max-w-xl mx-auto mt-2">Tap Start when Telegram opens. Updates are sent automatically.</p>
              <div className="mt-4 rounded-sm border border-border/70 bg-secondary/20 p-3 text-left">
                <p className="text-xs font-medium text-foreground">Almost finished</p>
                <p className="text-xs text-muted-foreground">Open Telegram and press START to receive updates.</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <a href={telegramHref} target="_blank" rel="noopener noreferrer">Open Telegram & Press START</a>
                </Button>
              </div>
            </div>

            <div className="card-premium p-5 sm:p-6 max-w-2xl mx-auto mb-8 text-left sm:text-center">
              <h3 className="font-display text-xl sm:text-2xl text-foreground mb-3">What happens next</h3>
              <p className="text-sm sm:text-base text-gray-300">
                Our team will review your application and send updates through Telegram once your status changes.
              </p>
            </div>

            <div className="max-w-2xl mx-auto pt-2">
              <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-3">Follow for updates</p>
              <div className="flex flex-col gap-1 text-sm text-gray-400">
                <a
                  href="https://instagram.com/AscendEliteHQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200 transition-colors"
                >
                  @AscendEliteHQ
                </a>
                <a
                  href="https://www.ascendeliteagency.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200 transition-colors"
                >
                  www.ascendeliteagency.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
