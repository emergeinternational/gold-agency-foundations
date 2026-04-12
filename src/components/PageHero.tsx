import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  backgroundImage?: string;
  backgroundPosition?: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  overlay?: boolean;
  tall?: boolean;
}

export default function PageHero({
  title,
  subtitle,
  badge,
  backgroundImage,
  backgroundPosition = "center 30%",
  cta,
  secondaryCta,
  overlay = true,
  tall = false,
}: PageHeroProps) {
  return (
    <section className={`relative flex items-start overflow-hidden ${tall ? "min-h-[82vh]" : "min-h-[42vh]"}`}>
      {backgroundImage && (
        <motion.div
          initial={{ scale: 1.04, opacity: 0.94 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" as const }}
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition,
          }}
        />
      )}
      {overlay && <div className="absolute inset-0 bg-gradient-to-br from-background/88 via-background/80 to-background/72" />}
      {!backgroundImage && <div className="absolute inset-0 bg-card" />}
      <div className="relative z-10 container-wide px-5 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-32 pb-10 sm:pb-14 lg:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="max-w-3xl"
        >
          {badge && (
            <span className="badge-label mb-4 block">{badge}</span>
          )}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-semibold text-foreground leading-[1.08] text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-muted-foreground text-[15px] sm:text-base max-w-2xl leading-relaxed font-light">
              {subtitle}
            </p>
          )}
          {(cta || secondaryCta) && (
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              {cta && (
                <Button variant="hero" size="xl" asChild>
                  <Link to={cta.href}>{cta.label}</Link>
                </Button>
              )}
              {secondaryCta && (
                <Button variant="hero-outline" size="xl" asChild>
                  <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
