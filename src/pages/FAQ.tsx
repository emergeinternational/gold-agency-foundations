import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.7 as const } };

const faqs = [
  { q: "Who can submit for representation?", a: "Anyone with a genuine talent or creative practice can submit. We welcome all experience levels and categories — from emerging beginners to seasoned professionals." },
  { q: "Does submission guarantee representation?", a: "No. Submission is an application for consideration. Our team reviews every submission carefully, but representation is selective and based on multiple factors." },
  { q: "Do classes or workshops guarantee signing?", a: "No. Academy participation and representation are separate processes. Strong performance may lead to consideration, but there is no automatic pathway from classes to signing." },
  { q: "Who can join workshops and classes?", a: "Our programs are open to anyone interested in professional development — whether or not they are pursuing representation." },
  { q: "Are beginners welcome?", a: "Absolutely. Many of our programs are specifically designed for emerging talent and beginners. We believe everyone starts somewhere." },
  { q: "Can minors apply?", a: "Yes, with guardian consent. Applicants under 18 must include guardian information in their submission and have a guardian agree to participation terms." },
  { q: "How do bookings work?", a: "Brands, event organizers, and production teams can submit a booking request through our Book Talent page. Our team matches projects with available talent from our roster." },
  { q: "How do partnerships work?", a: "We collaborate with brands, studios, media houses, educators, and institutions. Visit our Partnerships page to submit an inquiry." },
  { q: `Where is ${BRAND.name} based?`, a: `Our headquarters are in ${BRAND.locationPrimary}, Ethiopia. Our strategic vision is global, with particular ambition tied to ${BRAND.locationVision} and international markets.` },
  { q: "How is international ambition framed?", a: "We prepare talent for global opportunities by combining local development with international industry standards, media training, and cross-border partnership pathways." },
];

export default function FAQ() {
  return (
    <Layout>
      <PageHero badge="FAQ" title="Frequently Asked Questions" subtitle="Clear answers to the most common questions about our agency, academy, and processes." />
      <section className="section-padding">
        <div className="container-narrow">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.03 }} className="bg-card border border-border rounded-lg p-6">
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
