import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { BRAND } from "@/lib/brand";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Mr. Zik", href: "/mr-zik" },
  { label: "Representation", href: "/representation" },
  { label: "Talent", href: "/talent-categories" },
  { label: "Academy", href: "/academy" },
  { label: "Submissions", href: "/submit" },
  { label: "Book Talent", href: "/book-talent" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <nav className="container-wide flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="font-display text-lg sm:text-xl font-bold tracking-widest text-primary uppercase">
            {BRAND.name}
          </span>
          <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            Powered by {BRAND.poweredBy}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-2 text-xs tracking-widest uppercase transition-colors duration-300 ${
                location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 text-sm tracking-widest uppercase transition-colors rounded-md ${
                    location.pathname === link.href
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
