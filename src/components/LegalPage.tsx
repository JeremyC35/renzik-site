import type { ReactNode } from "react";
import Link from "next/link";
import { hasPlaceholders, real, site } from "@/config/site";
import { Container } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { SiteFooter } from "@/components/SiteFooter";

/** Shared shell for Privacy and Terms. The draft notice shows while any business fact is still a placeholder. */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  const effective = real(site.legalEffectiveDate);
  return (
    <>
      <header className="border-b border-stone/25">
        <Container className="flex h-16 items-center md:h-[4.5rem]">
          <Link href="/" aria-label={`${site.tradeName} home`}>
            <Logo height={34} className="h-8 w-auto md:h-[2.375rem]" />
          </Link>
        </Container>
      </header>
      <main id="main" tabIndex={-1} className="py-12 outline-none md:py-16">
        <Container className="max-w-3xl lg:max-w-3xl">
          {hasPlaceholders() && (
            <p role="note" className="mb-8 border-l-4 border-error py-1 pl-4 font-semibold">
              Draft, pending legal review.
            </p>
          )}
          <h1 className="text-[2.25rem] leading-tight font-bold tracking-tight md:text-headline">{title}</h1>
          {effective && <p className="mt-3 text-stone">Effective {effective}</p>}
          <div className="mt-8 space-y-5 leading-relaxed [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
            {children}
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}

/** Contact line for the legal pages: the email once it's real, otherwise the contact form. */
export function LegalContact() {
  const email = real(site.contactEmail);
  return email ? (
    <a href={`mailto:${email}`} className="font-semibold underline underline-offset-4">
      {email}
    </a>
  ) : (
    <Link href="/#book-a-call" className="font-semibold underline underline-offset-4">
      the contact form on our homepage
    </Link>
  );
}
