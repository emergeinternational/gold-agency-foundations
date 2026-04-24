import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type BannerMessage = {
  id: string;
  text: string;
  featured: boolean;
  display_ms: number;
  link_url: string | null;
};

// Fallbacks used if the DB is unreachable, so the banner never disappears.
const FALLBACK: BannerMessage[] = [
  { id: "f1", text: "Featured Casting Call Coming Soon — Submit for review and stay connected for details.", featured: true, display_ms: 9000, link_url: null },
  { id: "f2", text: "Now reviewing talent across media, music, fashion, and creative industries.", featured: false, display_ms: 4500, link_url: null },
  { id: "f3", text: "Ascend Elite is powered by Emerge Globally, New York City.", featured: false, display_ms: 4500, link_url: null },
  { id: "f4", text: "Creative opportunities, casting updates, and brand campaigns available through Ascend Elite.", featured: false, display_ms: 4500, link_url: null },
];

export default function AnnouncementBanner() {
  const [messages, setMessages] = useState<BannerMessage[]>(FALLBACK);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from("banner_messages")
        .select("id, text, featured, display_ms, link_url, sort_order, is_active, starts_at, ends_at")
        .eq("is_active", true)
        .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
        .or(`ends_at.is.null,ends_at.gt.${nowIso}`)
        .order("sort_order", { ascending: true });
      if (!cancelled && !error && data && data.length > 0) {
        setMessages(
          data.map((d) => ({
            id: d.id,
            text: d.text,
            featured: !!d.featured,
            display_ms: d.display_ms ?? 4500,
            link_url: d.link_url,
          })),
        );
        setIndex(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const current = messages[index % messages.length];
    const delay = current.display_ms || (current.featured ? 9000 : 4500);
    const t = window.setTimeout(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, delay);
    return () => window.clearTimeout(t);
  }, [index, messages]);

  if (messages.length === 0) return null;
  const current = messages[index % messages.length];

  return (
    <div className="w-full border-b border-primary/15 bg-gradient-to-r from-background via-primary/5 to-background">
      <div className="container-wide px-5 sm:px-8 lg:px-12 py-2 flex items-center justify-between gap-4 min-h-[36px]">
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={current.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`text-[11px] sm:text-xs tracking-wide truncate ${
                current.featured ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {current.link_url ? (
                <Link to={current.link_url} className="hover:underline">
                  {current.text}
                </Link>
              ) : (
                current.text
              )}
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
