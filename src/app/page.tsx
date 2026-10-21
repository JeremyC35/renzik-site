import { real, site } from "@/config/site";
import { siteUrl } from "@/lib/env";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Offers } from "@/components/Offers";
import { HowItWorks } from "@/components/HowItWorks";
import { TheMath } from "@/components/TheMath";
import { Faq } from "@/components/Faq";
import { ContactSection } from "@/components/ContactSection";
import { SiteFooter } from "@/components/SiteFooter";

/** ProfessionalService structured data, built only from real values. Placeholders are left out. */
function structuredData() {
  const phone = real(site.businessPhone);
  const email = real(site.contactEmail);
  const legalName = real(site.legalEntityName);
  const address = real(site.mailingAddress);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.tradeName,
    alternateName: site.lockupName,
    description: site.industry,
    url: siteUrl,
    logo: `${siteUrl}/brand/renzik-monogram.svg`,
    areaServed: { "@type": "AdministrativeArea", name: `${site.serviceArea} (${site.serviceAreaDetail})` },
  };
  if (legalName) data.legalName = legalName;
  if (phone) data.telephone = phone;
  if (email) data.email = email;
  if (address) data.address = address;
  // Escape "<" so the JSON can't close the script tag (Next.js JSON-LD guide).
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData() }} />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Problem />
        <Offers />
        <HowItWorks />
        <TheMath />
        <Faq />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
