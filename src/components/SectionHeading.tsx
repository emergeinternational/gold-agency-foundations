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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
      className={`mb-14 sm:mb-20 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {badge && (
        <span className="badge-label mb-5 block">{badge}</span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.25rem] font-semibold text-foreground leading-[1.1] text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-muted-foreground text-base sm:text-[17px] max-w-2xl leading-relaxed" style={align === "center" ? { marginLeft: "auto", marginRight: "auto" } : undefined}>
          {subtitle}
        </p>
      )}
      {children}
      <div className={`gold-line mt-8 ${align === "center" ? "mx-auto" : ""}`} />
    </motion.div>
  );
}
