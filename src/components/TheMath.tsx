import { Container } from "@/components/ui";

/* One illustrative example, labeled as an example. No dollar figures, no guarantees. */
export function TheMath() {
  return (
    <section aria-labelledby="math-title" className="border-t border-stone/25 py-16 md:py-24">
      <Container>
        <div className="max-w-4xl border-l-4 border-pine pl-6 md:pl-10">
          <h2 id="math-title" className="text-lg font-semibold text-stone">
            The math
          </h2>
          <p className="mt-4 text-[1.75rem] leading-[1.15] font-bold tracking-tight text-balance md:text-headline">
            If it recovers one roofing job a month, it pays for itself many times over.
          </p>
          <p className="mt-5 max-w-[60ch] text-stone">
            That&apos;s an example, not a promise. What it recovers depends on how many calls you miss today and how
            you follow up on quotes.
          </p>
        </div>
      </Container>
    </section>
  );
}
