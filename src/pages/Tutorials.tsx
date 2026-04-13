import { useState } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { motion } from "framer-motion";
import { Play, Clock, Tag } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7 as const },
};

const tutorials = [
  { id: 1, title: "Building a Personal Brand from Zero", category: "Branding", duration: "18 min", type: "Free" },
  { id: 2, title: "Content Calendar Mastery for Creatives", category: "Digital", duration: "24 min", type: "Premium" },
  { id: 3, title: "Nailing Your First On-Camera Audition", category: "Performance", duration: "15 min", type: "Free" },
  { id: 4, title: "Music Licensing & Royalties Explained", category: "Music", duration: "22 min", type: "Premium" },
  { id: 5, title: "The 60-Second Pitch: How to Sell Yourself", category: "Business", duration: "12 min", type: "Free" },
  { id: 6, title: "Reels Strategy That Actually Works", category: "Digital", duration: "20 min", type: "Free" },
  { id: 7, title: "How to Work with Agents & Managers", category: "Business", duration: "28 min", type: "Premium" },
  { id: 8, title: "Vocal Warm-Ups for Presenters & Hosts", category: "Performance", duration: "10 min", type: "Free" },
  { id: 9, title: "Portfolio Photography: What Agencies Look For", category: "Modeling", duration: "16 min", type: "Premium" },
];

const categories = ["All", "Branding", "Digital", "Performance", "Music", "Business", "Modeling"];

export default function Tutorials() {
  const [catFilter, setCatFilter] = useState("All");
  const filtered = tutorials.filter(t => catFilter === "All" || t.category === catFilter);

  return (
    <Layout>
      <PageHero badge="Tutorials" title="Learn at Your Own Pace" subtitle="A growing library of professional guides and tutorials — from branding to performance — available anytime, anywhere." />

      <section className="section-padding">
        <div className="container-wide">
          {/* Filters */}
          <div className="mb-10">
            <span className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">Category</span>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${catFilter === c ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground"}`}>{c}</button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t, i) => (
              <motion.div key={t.id} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.04 }} className="card-premium overflow-hidden card-hover group">
                <div className="aspect-video bg-secondary flex items-center justify-center relative">
                  <Play className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded">Online</span>
                  <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest bg-background/80 px-2 py-0.5 rounded text-foreground">{t.type}</span>
                </div>
                <div className="p-6">
                  <span className="text-[10px] uppercase tracking-widest text-primary mb-2 block">{t.category}</span>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">{t.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t.duration}</span>
                    <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {t.type}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-300">No tutorials in this category yet. New content is added regularly.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-sm text-gray-200">New tutorials are published regularly. Full video playback will be available once the media platform is connected.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}