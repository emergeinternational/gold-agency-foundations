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
  { q: "Can applicants under 18 apply?", a: "Under 18? Parent/Guardian Required. Applicants under 18 may not move forward without legal parent or guardian authorization. Additional guardian information and consent are required before review can continue." },
  { q: "How does talent booking work?", a: "Brands, event organizers, and production teams submit a booking inquiry through our agency. Our team matches project needs with available talent from the roster." },
  { q: "How do partnerships work?", a: "We collaborate with brands, studios, media organizations, and cultural institutions. Visit the Partnerships page to start a conversation about working together." },
  { q: `Where is ${BRAND.name} based?`, a: "Ascend Elite is an international talent and media platform based in New York City, with on-the-ground partnerships and creative activity across Africa, including Addis Ababa, Ethiopia." },
  { q: "What does 'global reach' mean in practice?", a: "It means we prepare selected talent for international opportunities — through industry-standard training, cross-border partnerships, and positioning that resonates beyond local markets." },
];

const minorFaqs = [
  {
    q: "What can a minor (under 18) expect after submitting?",
    a: "Submissions from minors are reviewed only after a legal parent or guardian has provided contact details and consent. Our team will reach out through the guardian email and phone provided. No casting, audition, training, travel, or media use can move forward until the guardian has authorized those specific next steps in writing.",
  },
  {
    q: "What does a parent or guardian need to authorize?",
    a: "At submission, guardians authorize the agency to review the application and contact them about next steps. Before any participation, additional written authorization is required for the specific activity — including auditions, training enrollment, bookings, travel, media use, or any release of likeness. Guardians may withdraw authorization at any time before participation begins.",
  },
  {
    q: "Are there extra protections for applicants under 13?",
    a: "Yes. Applicants under 13 require verified parent or guardian consent before any personal information can be reviewed or used. We collect only what is necessary for review and we do not share minor information publicly.",
  },
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

          <div className="mt-12">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-primary font-medium">
                For Minors & Guardians
              </span>
              <h2 className="font-display text-xl font-semibold text-foreground">Under-18 Applicants</h2>
            </div>
            <div className="space-y-4">
              {minorFaqs.map((faq, i) => (
                <motion.div key={`minor-${i}`} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.03 }} className="card-premium p-6 sm:p-7 border-primary/20">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
