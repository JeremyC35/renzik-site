import { real, site, tcpaConsentText } from "@/config/site";
import { Container } from "@/components/ui";
import { ContactForm } from "@/components/ContactForm";

export function ContactSection() {
  const email = real(site.contactEmail);
  const phone = real(site.businessPhone);
  return (
    <section id="book-a-call" aria-labelledby="book-title" className="border-t border-stone/25 py-16 md:py-24">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 id="book-title" className="text-[2rem] leading-[1.1] font-bold tracking-tight md:text-headline">
            Book a call
          </h2>
          <p className="mt-4 max-w-[40ch] text-lg leading-relaxed">
            Tell us a little about your business. We&apos;ll reach out within one business day to set up a 20-minute
            call.
          </p>
          {(phone || email) && (
            <p className="mt-6 text-stone">
              Prefer to reach us directly?{" "}
              {phone && (
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="font-semibold text-ink underline underline-offset-4">
                  {phone}
                </a>
              )}
              {phone && email && " or "}
              {email && (
                <a href={`mailto:${email}`} className="font-semibold text-ink underline underline-offset-4">
                  {email}
                </a>
              )}
            </p>
          )}
        </div>
        <div className="lg:col-span-7">
          <ContactForm consentText={real(tcpaConsentText)} contactEmail={email} />
        </div>
      </Container>
    </section>
  );
}
