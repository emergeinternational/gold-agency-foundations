import Layout from "@/components/Layout";
import { BRAND } from "@/lib/brand";

export default function SubmissionTerms() {
  return (
    <Layout>
      <div className="section-padding">
        <div className="container-narrow">
          <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-primary font-body font-semibold mb-4">Legal</span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-6">Submission Terms</h1>
          <div className="gold-line mb-10" />
          <div className="space-y-6 text-muted-foreground leading-relaxed text-sm">
            <p><strong className="text-foreground">Effective Date:</strong> March 1, 2026</p>
            <p>By submitting materials to {BRAND.name}, you agree to the following terms.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Submission is Not a Guarantee</h2>
            <p>Submitting your application, portfolio, media, or other materials does not guarantee representation, signing, employment, or any specific outcome. All submissions are reviewed at the discretion of {BRAND.name}.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Consent to Review</h2>
            <p>By submitting, you consent to {BRAND.name} reviewing, storing, and evaluating your materials for the purpose of talent assessment. Your materials may be shared internally with our team.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Accuracy of Information</h2>
            <p>You confirm that all information provided is accurate and truthful. Submission of false or misleading information may result in disqualification.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Minor Participation</h2>
            <p>If you are under 18, a parent or legal guardian must consent to your submission and participation. Guardian information is required as part of the submission process.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Development Programs</h2>
            <p>Enrollment in development programs, workshops, or tutorials is separate from representation. Participation in development programs does not guarantee signing or representation by {BRAND.name}.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Review Timeline</h2>
            <p>Review timelines vary based on submission volume. We aim to review all submissions in a timely manner but cannot guarantee specific response times.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Data Use</h2>
            <p>Your submission data is handled in accordance with our <a href="/privacy" className="text-primary underline">Privacy Policy</a>.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Contact</h2>
            <p>For questions about these terms, contact us at {BRAND.email}.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
