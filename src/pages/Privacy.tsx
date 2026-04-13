import Layout from "@/components/Layout";
import { BRAND } from "@/lib/brand";

export default function Privacy() {
  return (
    <Layout>
      <div className="section-padding">
        <div className="container-narrow">
          <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-primary font-body font-semibold mb-4">Legal</span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-6">Privacy Policy</h1>
          <div className="gold-line mb-10" />
          <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300 leading-relaxed">
            <p><strong className="text-foreground">Effective Date:</strong> March 1, 2026</p>
            <p>{BRAND.name}, {BRAND.poweredByLine.toLowerCase()} ({BRAND.legalRelationship}), is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Information We Collect</h2>
            <p>We may collect personal information you voluntarily provide, including your name, email address, phone number, social media profiles, biographical information, media files, and other materials submitted through our forms.</p>
            <h2 className="font-display text-xl text-foreground mt-8">How We Use Your Information</h2>
            <p>Your information is used to evaluate talent submissions, process booking requests, manage development program enrollment, respond to inquiries, improve our services, and communicate relevant opportunities.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Data Sharing</h2>
            <p>We do not sell your personal data. We may share information with trusted partners and service providers who assist in operating our agency, subject to confidentiality obligations.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Data Retention</h2>
            <p>We retain personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal data by contacting us at {BRAND.email}.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Minors</h2>
            <p>If you are under 18, a parent or legal guardian must consent to any submission or enrollment. We take the protection of minors' data seriously and comply with applicable regulations.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Contact</h2>
            <p>For privacy-related questions, contact us at {BRAND.email}.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
