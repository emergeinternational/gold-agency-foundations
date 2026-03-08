import Layout from "@/components/Layout";
import { BRAND } from "@/lib/brand";

export default function Terms() {
  return (
    <Layout>
      <div className="section-padding">
        <div className="container-narrow">
          <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-primary font-body font-semibold mb-4">Legal</span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-6">Terms of Use</h1>
          <div className="gold-line mb-10" />
          <div className="space-y-6 text-muted-foreground leading-relaxed text-sm">
            <p><strong className="text-foreground">Effective Date:</strong> March 1, 2026</p>
            <p>By accessing and using the {BRAND.name} website, you agree to the following terms and conditions. {BRAND.name} is powered by {BRAND.poweredBy} ({BRAND.legalRelationship}).</p>
            <h2 className="font-display text-xl text-foreground mt-8">Use of the Site</h2>
            <p>This website is for informational purposes and to facilitate talent submissions, academy enrollment, booking requests, and partnership inquiries. You agree not to misuse the site or submit false information.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Intellectual Property</h2>
            <p>All content on this site — including text, images, design, and branding — is the property of {BRAND.poweredBy} and {BRAND.legalEntity}. Unauthorized reproduction or distribution is prohibited.</p>
            <h2 className="font-display text-xl text-foreground mt-8">No Guarantees</h2>
            <p>Submission to {BRAND.name} does not guarantee representation, employment, or any specific outcome. Academy participation does not guarantee signing or career advancement. All opportunities are subject to review and selection processes.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Limitation of Liability</h2>
            <p>{BRAND.name}, {BRAND.poweredBy}, and {BRAND.legalEntity} are not liable for any damages arising from the use of this website or participation in any programs, submissions, or partnerships.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Modifications</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the site after changes constitutes acceptance of the revised terms.</p>
            <h2 className="font-display text-xl text-foreground mt-8">Contact</h2>
            <p>For questions about these terms, contact us at {BRAND.email}.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
