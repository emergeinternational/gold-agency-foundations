import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

type BannerMessage = {
  text: string;
  featured?: boolean;
};

const MESSAGES: BannerMessage[] = [
  { text: "Featured Casting Call Coming Soon — Submit for review and stay connected for details.", featured: true },
  { text: "Now reviewing talent across media, music, fashion, and creative industries." },
  { text: "Ascend Elite is powered by Emerge Globally, New York City." },
  { text: "Creative opportunities, casting updates, and brand campaigns available through Ascend Elite." },
];

const FEATURED_MS = 9000;
const SECONDARY_MS = 4500;

export default function AnnouncementBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const current = MESSAGES[index];
    const delay = current.featured ? FEATURED_MS : SECONDARY_MS;
    const t = window.setTimeout(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, delay);
    return () => window.clearTimeout(t);
  }, [index]);

  const current = MESSAGES[index];

  return (
    <div className="w-full border-b border-primary/15 bg-gradient-to-r from-background via-primary/5 to-background">
      <div className="container-wide px-5 sm:px-8 lg:px-12 py-2 flex items-center justify-between gap-4 min-h-[36px]">
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`text-[11px] sm:text-xs tracking-wide truncate ${
                current.featured ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {current.text}
            </motion.p>
          </AnimatePresence>
        </div>
        <Link
          to="/opportunities"
          className="flex items-center gap-1 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-primary hover:text-gold-light transition-colors whitespace-nowrap flex-shrink-0"
        >
          <span className="hidden sm:inline">View Opportunities</span>
          <span className="sm:hidden">Opportunities</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
