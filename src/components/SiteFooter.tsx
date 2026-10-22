import Link from "next/link";
import { real, site } from "@/config/site";
import { buildYear } from "@/lib/env";
import { Container } from "@/components/ui";
import { Logo } from "@/components/Logo";

export function SiteFooter() {
  const legalName = real(site.legalEntityName);
  const address = real(site.mailingAddress);
  const email = real(site.contactEmail);
  return (
    <footer className="border-t border-stone/25 py-12">
      <Container className="grid gap-8 text-sm text-stone md:grid-cols-2 md:items-end">
        <div className="space-y-3">
          <Logo height={32} className="h-8 w-auto" />
          {address && <p>{address}</p>}
          {email && (
            <p>
              <a href={`mailto:${email}`} className="text-ink underline underline-offset-4">
                {email}
              </a>
            </p>
          )}
        </div>
        <div className="space-y-3 md:text-right">
          <nav aria-label="Legal" className="flex gap-6 md:justify-end">
            <Link href="/privacy" className="inline-flex min-h-11 items-center text-ink underline underline-offset-4">
              Privacy
            </Link>
            <Link href="/terms" className="inline-flex min-h-11 items-center text-ink underline underline-offset-4">
              Terms
            </Link>
          </nav>
          <p>
            © {buildYear} {legalName ? `${legalName}, doing business as ${site.tradeName}` : site.tradeName}
          </p>
        </div>
      </Container>
    </footer>
  );
}
