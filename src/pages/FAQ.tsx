import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.7 as const } };

const faqs = [
  { q: "Who can submit for representation?", a: "Anyone with a genuine creative practice is welcome to apply. We review talent across all categories and experience levels — from emerging artists to established professionals." },
  { q: "Does submitting guarantee representation?", a: "No. A submission is an application for consideration. Our team reviews every application, but representation is selective and based on readiness, fit, and potential." },
  { q: "Do academy programs guarantee signing?", a: "No. Academy participation and representation are separate processes. Exceptional performance may lead to further consideration, but there is no automatic connection between the two." },
  { q: "Who can join workshops and classes?", a: "Anyone interested in professional development — whether or not they're seeking representation. Our programs are open to all creatives who want to grow." },
  { q: "Are beginners welcome?", a: "Yes. Many of our programs are designed specifically for emerging talent. Everyone starts somewhere — what matters is your commitment to the work." },
  { q: "Can applicants under 18 apply?", a: "Yes, with guardian consent. Applicants under 18 must include guardian information and have a guardian agree to all participation terms." },
  { q: "How does talent booking work?", a: "Brands, event organizers, and production teams can submit a booking inquiry through our Book Talent page. Our team matches project needs with available talent from our roster." },
  { q: "How do partnerships work?", a: "We collaborate with brands, studios, media organizations, educators, and cultural institutions. Visit the Partnerships page to submit an inquiry about working together." },
  { q: `Where is ${BRAND.name} based?`, a: `Our headquarters are in ${BRAND.locationPrimary}, Ethiopia. Our strategic ambition is global, with particular focus on ${BRAND.locationVision} and international markets.` },
  { q: "What does 'global vision' mean in practice?", a: "It means we prepare talent for international opportunities — through industry-standard training, cross-border partnership pathways, and media positioning that resonates beyond local markets." },
];

export default function FAQ() {
  return (
    <Layout>
      <PageHero badge="FAQ" title="Common Questions, Straight Answers" subtitle="What you need to know about our agency, academy, and processes — without the fine print." />
      <section className="section-padding">
        <div className="container-narrow">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.03 }} className="card-premium p-6 sm:p-7">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}