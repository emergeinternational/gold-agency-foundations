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
      className={`relative flex items-center justify-center overflow-hidden ${tall ? "min-h-[85vh]" : "min-h-[50vh]"}`}
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      } : undefined}
    >
      {overlay && <div className="absolute inset-0 bg-background/80" />}
      <div className="relative z-10 container-wide section-padding text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {badge && (
            <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-primary font-body font-semibold mb-4">
              {badge}
            </span>
          )}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-foreground leading-[1.1] text-balance max-w-4xl mx-auto">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-muted-foreground text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
          {(cta || secondaryCta) && (
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
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
