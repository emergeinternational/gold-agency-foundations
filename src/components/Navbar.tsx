import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/95 backdrop-blur-xl border-b border-border/20" : "bg-transparent border-b border-transparent"}`}>
      <nav className="container-wide flex items-center justify-between h-14 sm:h-16 px-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex flex-col leading-none gap-0.5 group">
          <span className="font-display text-[15px] sm:text-lg font-bold tracking-[0.2em] text-primary uppercase group-hover:text-gold-light transition-colors">
            {BRAND.name}
          </span>
          <span className="text-[7px] sm:text-[8px] tracking-[0.2em] text-muted-foreground/50 uppercase">
            Powered by {BRAND.poweredBy}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 xl:px-3.5 py-2 text-[10px] tracking-[0.18em] uppercase transition-colors duration-300 ${
                location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground/70 hover:text-foreground"
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
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-background/98 backdrop-blur-xl border-b border-border/20 overflow-hidden"
          >
            <div className="px-5 py-5 flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 text-[13px] tracking-[0.12em] uppercase transition-colors ${
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground/70 hover:text-foreground"
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