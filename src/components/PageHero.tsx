import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  backgroundImage?: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  overlay?: boolean;
  tall?: boolean;
}

export default function PageHero({ title, subtitle, badge, backgroundImage, cta, secondaryCta, overlay = true, tall = false }: PageHeroProps) {
  return (
    <section
      className={`relative flex items-end overflow-hidden ${tall ? "min-h-[85vh]" : "min-h-[45vh]"}`}
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      } : undefined}
    >
      {overlay && <div className="absolute inset-0 bg-background/85" />}
      {!backgroundImage && <div className="absolute inset-0 bg-card" />}
      <div className="relative z-10 container-wide px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
          className="max-w-3xl"
        >
          {badge && (
            <span className="badge-label mb-5 block">{badge}</span>
          )}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-semibold text-foreground leading-[1.1] text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-muted-foreground text-base sm:text-[17px] max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
          {(cta || secondaryCta) && (
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
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
