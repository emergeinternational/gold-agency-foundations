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
  "Get Involved": [
    { label: "Open Submissions", href: "/submit" },
    { label: "Academy", href: "/academy" },
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
    <footer className="bg-card border-t border-border">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link to="/" className="inline-block">
              <h3 className="font-display text-xl font-bold tracking-widest text-primary uppercase">
                {BRAND.name}
              </h3>
              <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase mt-1">
                Powered by {BRAND.poweredBy}
              </p>
            </Link>
            <p className="text-sm text-muted-foreground mt-4 max-w-xs">
              Premier talent representation and development platform. Based in {BRAND.locationPrimary}, with global vision.
            </p>
            <div className="flex gap-4 mt-6">
              {Object.entries(BRAND.socialLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors text-xs uppercase tracking-widest"
                >
                  {platform.slice(0, 2).toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-sm font-semibold tracking-widest uppercase text-foreground mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
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
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground text-center sm:text-right">
              {BRAND.poweredBy} — A subsidiary of {BRAND.legalEntity}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
