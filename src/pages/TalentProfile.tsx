import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Play, Headphones, Image as ImageIcon } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7 as const },
};

// Placeholder — will be replaced by backend data lookup
const lookupTalent = (_slug: string) => null as null | {
  name: string;
  categoryLabel: string;
  specialties: string[];
  location: string;
  shortBio: string;
  narrativeBio?: string;
  image?: string;
  profileEmphasis: "video" | "audio" | "gallery" | "narrative";
  reelUrl?: string;
  audioDemo?: string;
  galleryImages?: string[];
};

export default function TalentProfile() {
  const { slug } = useParams<{ slug: string }>();
  const talent = lookupTalent(slug || "");

  if (!talent) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container-narrow text-center py-20">
            <span className="badge-label mb-5 block">Profile Not Available</span>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              This Profile Is Not Yet Public
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Our roster is being curated. Talent profiles become available once fully reviewed and approved for public representation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="gold" size="lg" asChild>
                <Link to="/roster">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Roster
                </Link>
              </Button>
              <Button variant="gold-outline" size="lg" asChild>
                <Link to="/book-talent">Inquire About Talent</Link>
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Profile Header */}
      <section className="section-padding pt-32 sm:pt-36">
        <div className="container-wide">
          <Link to="/roster" className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors mb-10">
            <ArrowLeft className="w-3 h-3" /> Back to Roster
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            {/* Left: Image */}
            <motion.div {...fadeUp} className="lg:col-span-1">
              <div className="aspect-[3/4] bg-secondary/40 rounded-sm overflow-hidden border border-border/20">
                {talent.image ? (
                  <img src={talent.image} alt={talent.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right: Info */}
            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.1 }} className="lg:col-span-2">
              <span className="text-[10px] tracking-[0.25em] uppercase text-primary/80 mb-3 block">
                {talent.categoryLabel}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05]">
                {talent.name}
              </h1>
              <div className="gold-line mt-5 mb-6" />

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <MapPin className="w-3.5 h-3.5" /> {talent.location}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {talent.specialties.map(s => (
                  <span key={s} className="text-[10px] tracking-[0.15em] uppercase border border-border/40 rounded-sm px-3 py-1 text-muted-foreground/70">
                    {s}
                  </span>
                ))}
              </div>

              <p className="text-foreground/80 text-base leading-relaxed mb-4">{talent.shortBio}</p>
              {talent.narrativeBio && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">{talent.narrativeBio}</p>
              )}

              <Button variant="hero" size="xl" asChild>
                <Link to="/book-talent">Book This Talent</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modular Content Section — adapts to talent type */}
      <section className="section-padding border-t border-border/20">
        <div className="container-wide">
          {talent.profileEmphasis === "video" && talent.reelUrl && (
            <motion.div {...fadeUp}>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Showreel</h2>
              <div className="aspect-video bg-secondary/40 rounded-sm overflow-hidden border border-border/20 flex items-center justify-center">
                <Play className="w-16 h-16 text-primary/30" />
              </div>
            </motion.div>
          )}

          {talent.profileEmphasis === "audio" && talent.audioDemo && (
            <motion.div {...fadeUp}>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Audio Demo</h2>
              <div className="bg-secondary/40 rounded-sm border border-border/20 p-8 flex items-center justify-center gap-4">
                <Headphones className="w-8 h-8 text-primary/40" />
                <span className="text-sm text-muted-foreground">Audio player — available when profile is live</span>
              </div>
            </motion.div>
          )}

          {talent.profileEmphasis === "gallery" && talent.galleryImages && talent.galleryImages.length > 0 && (
            <motion.div {...fadeUp}>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Portfolio</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {talent.galleryImages.map((img, i) => (
                  <div key={i} className="aspect-[3/4] bg-secondary/40 rounded-sm overflow-hidden border border-border/20">
                    <img src={img} alt={`${talent.name} portfolio ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {talent.profileEmphasis === "narrative" && (
            <motion.div {...fadeUp} className="max-w-2xl">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {talent.narrativeBio || talent.shortBio}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Booking CTA */}
      <section className="section-padding bg-card border-t border-border/20">
        <div className="container-narrow text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
              Interested in Working With {talent.name}?
            </h2>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
              All bookings are managed through our team. Send an inquiry and we will coordinate availability, terms, and logistics.
            </p>
            <div className="mt-8">
              <Button variant="hero" size="xl" asChild>
                <Link to="/book-talent">Send Booking Inquiry</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
