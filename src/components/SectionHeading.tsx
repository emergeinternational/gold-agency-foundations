import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  align?: "left" | "center";
}

export default function SectionHeading({ badge, title, subtitle, children, align = "center" }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`mb-12 sm:mb-16 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {badge && (
        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-primary font-body font-semibold mb-4">
          {badge}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed mx-auto">
          {subtitle}
        </p>
      )}
      {children}
      <div className={`gold-line mt-6 ${align === "center" ? "mx-auto" : ""}`} />
    </motion.div>
  );
}
