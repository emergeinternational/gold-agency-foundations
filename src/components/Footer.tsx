import { Link } from "react-router-dom";
import { BRAND } from "@/lib/brand";

const footerLinks = {
  Agency: [
    { label: "About", href: "/about" },
    { label: "Mr. Zik", href: "/mr-zik" },
    { label: "Representation", href: "/representation" },
    { label: "Talent Categories", href: "/talent-categories" },
    { label: "Partnerships", href: "/partnerships" },
  ],
  Programs: [
    { label: "Submit for Review", href: "/submit" },
    { label: "Development Programs", href: "/academy" },
    { label: "Classes & Workshops", href: "/classes-workshops" },
    { label: "Online Tutorials", href: "/tutorials" },
    { label: "Opportunities", href: "/opportunities" },
  ],
  Connect: [
    { label: "Book Talent", href: "/book-talent" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Submission Terms", href: "/submission-terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-card/80 border-t border-border/20">
      <div className="container-wide px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link to="/" className="inline-block group">
              <h3 className="font-display text-lg font-bold tracking-[0.25em] text-primary uppercase group-hover:text-gold-light transition-colors">
                {BRAND.name}
              </h3>
              <p className="text-[8px] tracking-[0.25em] text-muted-foreground/50 uppercase mt-1">
                {BRAND.poweredByLine}
              </p>
            </Link>
            <p className="text-xs text-muted-foreground/50 mt-5 max-w-xs leading-relaxed">
              Serving talent across Africa and global markets.
            </p>
            <div className="flex gap-4 mt-5">
              {Object.entries(BRAND.socialLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/35 hover:text-primary transition-colors text-[10px] uppercase tracking-[0.2em]"
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1, 3)}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[10px] font-body font-semibold tracking-[0.3em] uppercase text-foreground/50 mb-5">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-xs text-muted-foreground/45 hover:text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-7 border-t border-border/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[10px] text-muted-foreground/35 tracking-wider">
              © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
            </p>
            <p className="text-[10px] text-muted-foreground/25 text-center sm:text-right tracking-wider">
              {BRAND.legalRelationship}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
