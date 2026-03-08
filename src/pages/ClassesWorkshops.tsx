import { useState } from "react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Tag, Users } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7 as const },
};

const classes = [
  { id: 1, title: "On-Camera Confidence Masterclass", topic: "Media", format: "Workshop", level: "Beginner", date: "March 22, 2026", price: "Free", spots: "Open", desc: "Build the foundational skills to perform with confidence in front of any camera — from auditions to live broadcast." },
  { id: 2, title: "Social Media Strategy Intensive", topic: "Digital", format: "Class", level: "Intermediate", date: "April 5, 2026", price: "$75", spots: "Open", desc: "Platform-specific strategies for growing, engaging, and monetizing your creative presence online." },
  { id: 3, title: "Music Industry Fundamentals", topic: "Music", format: "Workshop", level: "Beginner", date: "April 12, 2026", price: "$50", spots: "Open", desc: "Contracts, royalties, distribution, and the business knowledge every musician needs before signing anything." },
  { id: 4, title: "Advanced Interview Techniques", topic: "Media", format: "Masterclass", level: "Advanced", date: "April 19, 2026", price: "$120", spots: "Waitlist", desc: "Master the nuances of conducting and navigating high-stakes interviews across media formats." },
  { id: 5, title: "Personal Branding for Creatives", topic: "Branding", format: "Class", level: "Beginner", date: "May 3, 2026", price: "Free", spots: "Open", desc: "Define, articulate, and communicate a personal brand that opens doors and sustains attention." },
  { id: 6, title: "Public Speaking & Stage Command", topic: "Performance", format: "Workshop", level: "Intermediate", date: "May 10, 2026", price: "$90", spots: "Open", desc: "Own any stage or podium with professional delivery, presence, and audience engagement techniques." },
];

const topics = ["All", "Media", "Digital", "Music", "Branding", "Performance"];
const formats = ["All", "Class", "Workshop", "Masterclass"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function ClassesWorkshops() {
  const [topicFilter, setTopicFilter] = useState("All");
  const [formatFilter, setFormatFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [selectedClass, setSelectedClass] = useState<typeof classes[0] | null>(null);

  const filtered = classes.filter(c =>
    (topicFilter === "All" || c.topic === topicFilter) &&
    (formatFilter === "All" || c.format === formatFilter) &&
    (levelFilter === "All" || c.level === levelFilter)
  );

  return (
    <Layout>
      <PageHero badge="Classes & Workshops" title="Sharpen Your Edge" subtitle="Browse upcoming programs by topic, format, or experience level. Every session is designed to produce real, applicable results." />

      <section className="section-padding">
        <div className="container-wide">
          {/* Filters */}
          <div className="flex flex-wrap gap-6 mb-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">Topic</span>
              <div className="flex flex-wrap gap-2">
                {topics.map(t => (
                  <button key={t} onClick={() => setTopicFilter(t)} className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${topicFilter === t ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">Format</span>
              <div className="flex flex-wrap gap-2">
                {formats.map(f => (
                  <button key={f} onClick={() => setFormatFilter(f)} className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${formatFilter === f ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground"}`}>{f}</button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">Level</span>
              <div className="flex flex-wrap gap-2">
                {levels.map(l => (
                  <button key={l} onClick={() => setLevelFilter(l)} className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${levelFilter === l ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground"}`}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No programs match your current filters. Try adjusting your selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c, i) => (
                <motion.div key={c.id} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.05 }} className="card-premium overflow-hidden card-hover flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">{c.format}</span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-secondary px-2 py-0.5 rounded">{c.level}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">{c.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.desc}</p>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {c.date}</div>
                      <div className="flex items-center gap-2"><Tag className="w-3.5 h-3.5" /> {c.price}</div>
                      <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> {c.spots === "Waitlist" ? <span className="text-primary">Waitlist Only</span> : "Spots available"}</div>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Button variant={c.spots === "Waitlist" ? "gold-outline" : "gold"} className="w-full" onClick={() => setSelectedClass(c)}>
                      {c.spots === "Waitlist" ? "Join Waitlist" : "Enroll Now"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setSelectedClass(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-premium p-8 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <span className="text-[10px] uppercase tracking-widest text-primary">{selectedClass.format} · {selectedClass.level}</span>
            <h3 className="font-display text-2xl font-semibold text-foreground mt-2 mb-4">{selectedClass.title}</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">{selectedClass.desc}</p>
            <div className="space-y-2 text-sm text-muted-foreground mb-6">
              <p><strong className="text-foreground">Date:</strong> {selectedClass.date}</p>
              <p><strong className="text-foreground">Investment:</strong> {selectedClass.price}</p>
              <p><strong className="text-foreground">Availability:</strong> {selectedClass.spots === "Waitlist" ? "Waitlist only" : "Spots available"}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="gold" asChild className="flex-1"><Link to="/enrollment-success">{selectedClass.spots === "Waitlist" ? "Join Waitlist" : "Confirm Enrollment"}</Link></Button>
              <Button variant="gold-outline" onClick={() => setSelectedClass(null)}>Close</Button>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
}