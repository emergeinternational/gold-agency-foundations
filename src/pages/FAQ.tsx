import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.7 as const } };

const faqs = [
  { q: "Who can apply for representation?", a: "Anyone with a genuine creative practice is welcome to submit. We review talent across all categories and experience levels — from emerging artists to established professionals." },
  { q: "Does submitting guarantee I'll be represented?", a: "No. Submission is an application for representation review. Our team evaluates every application, but representation is selective and based on readiness, fit, and potential." },
  { q: "Are development programs connected to representation?", a: "They operate as separate tracks. Program participation does not guarantee representation consideration, though exceptional performance may be noted." },
  { q: "Who can join workshops and programs?", a: "Anyone committed to professional growth — whether or not you're pursuing representation. Programs are open to all serious creatives." },
  { q: "Are beginners welcome?", a: "Absolutely. Many programs are designed specifically for emerging talent. What matters is your commitment to improving." },
  { q: "Can applicants under 18 apply?", a: "Yes, with guardian consent. Applicants under 18 must include guardian information and have a guardian agree to all participation terms." },
  { q: "How does talent booking work?", a: "Brands, event organizers, and production teams submit a booking inquiry through our agency. Our team matches project needs with available talent from the roster." },
  { q: "How do partnerships work?", a: "We collaborate with brands, studios, media organizations, and cultural institutions. Visit the Partnerships page to start a conversation about working together." },
  { q: `Where is ${BRAND.name} based?`, a: `Our headquarters are in ${BRAND.locationPrimary}, Ethiopia. Our strategic direction is global, with particular focus on building pathways into international markets.` },
  { q: "What does 'global reach' mean in practice?", a: "It means we prepare selected talent for international opportunities — through industry-standard training, cross-border partnerships, and positioning that resonates beyond local markets." },
];

export default function FAQ() {
  return (
    <Layout>
      <PageHero badge="FAQ" title="Straight Answers" subtitle="What you need to know about the agency, our processes, and how we operate — clearly and directly." />
      <section className="section-padding">
        <div className="container-narrow">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.03 }} className="card-premium p-6 sm:p-7">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
