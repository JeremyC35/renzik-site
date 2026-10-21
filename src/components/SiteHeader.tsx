import Link from "next/link";
import { real, site } from "@/config/site";
import { BookCallLink, Container } from "@/components/ui";
import { Logo } from "@/components/Logo";

export function SiteHeader() {
  const phone = real(site.businessPhone);
  return (
    <header className="border-b border-stone/25">
      <Container className="flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link href="/" className="shrink-0" aria-label={`${site.tradeName} home`}>
          <Logo height={34} className="h-8 w-auto md:h-[2.375rem]" />
        </Link>
        <div className="flex items-center gap-5">
          {phone && (
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className="hidden min-h-11 items-center font-semibold text-ink underline-offset-4 hover:underline sm:inline-flex"
            >
              {phone}
            </a>
          )}
          <BookCallLink />
        </div>
      </Container>
    </header>
  );
}
