import Link from "next/link";
import { Container } from "@/components/ui";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="py-16 outline-none md:py-24">
      <Container>
        <div className="max-w-3xl">
          <Link href="/" className="inline-flex min-h-11 items-center" aria-label="Renzik home">
            <Logo height={34} className="h-8 w-auto" />
          </Link>
          <h1 className="mt-12 text-[2.25rem] leading-tight font-bold tracking-tight md:text-headline">
            This page doesn&apos;t exist
          </h1>
          <p className="mt-4 text-lg">The link may be old, or the address may have a typo.</p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-11 items-center rounded-ui bg-pine px-5 py-2.5 font-semibold text-paper hover:bg-pine-deep"
          >
            Go to the homepage
          </Link>
        </div>
      </Container>
    </main>
  );
}
