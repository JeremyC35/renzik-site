import type { Metadata } from "next";
import { real, site } from "@/config/site";
import { LegalContact, LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of use | Renzik",
  description: "The terms for using the Renzik website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const legalName = real(site.legalEntityName);
  const who = legalName ? `${legalName} (doing business as ${site.tradeName})` : site.tradeName;
  return (
    <LegalPage title="Terms of use">
      <p>
        These terms cover your use of this website, which is run by {who} (&ldquo;Renzik,&rdquo; &ldquo;we&rdquo;).
        By using the site, you agree to them.
      </p>

      <h2>This site is for information</h2>
      <p>
        The site describes the services we offer. Nothing on it is an offer, a quote, or a contract. Examples on the
        site are illustrations, not predictions.
      </p>

      <h2>No guarantee of results</h2>
      <p>
        Results depend on your business, your call volume, and how you work. We don&apos;t guarantee any specific
        outcome, number of calls answered, jobs booked, or revenue.
      </p>

      <h2>Service terms</h2>
      <p>
        If you become a client, the terms of our work together are set out in the written agreement we both sign. If
        that agreement and these terms ever conflict, the signed agreement wins.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        The site is provided &ldquo;as is.&rdquo; To the fullest extent the law allows, Renzik isn&apos;t liable for
        any indirect, incidental or consequential damages arising from your use of the site, or for relying on
        anything published on it.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the State of New York.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <LegalContact />.
      </p>
    </LegalPage>
  );
}
