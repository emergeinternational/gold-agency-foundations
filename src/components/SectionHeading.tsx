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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className={`mb-12 sm:mb-16 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {badge && (
        <span className="badge-label mb-4 block">{badge}</span>
      )}
      <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground leading-[1.1] text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-muted-foreground text-[15px] leading-relaxed font-light" style={align === "center" ? { marginLeft: "auto", marginRight: "auto", maxWidth: "40rem" } : { maxWidth: "40rem" }}>
          {subtitle}
        </p>
      )}
      {children}
      <div className={`gold-line mt-6 ${align === "center" ? "mx-auto" : ""}`} />
    </motion.div>
  );
}