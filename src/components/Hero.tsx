import { BookCallLink, Container } from "@/components/ui";

/*
 * The one bold moment on the page: a full-width pine band. The bottom-right corner is cut at
 * the same 45° angle as the chamfered badge in the Renzik logo. Everything below stays quiet.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="on-pine bg-pine text-paper [clip-path:polygon(0_0,100%_0,100%_calc(100%-2.5rem),calc(100%-2.5rem)_100%,0_100%)] md:[clip-path:polygon(0_0,100%_0,100%_calc(100%-4.5rem),calc(100%-4.5rem)_100%,0_100%)]"
    >
      <Container className="pt-14 pb-20 md:pt-20 md:pb-28">
        <h1
          id="hero-title"
          className="max-w-[28ch] text-[2.25rem] leading-[1.08] font-bold tracking-tight text-balance md:text-display"
        >
          We build AI systems for contractors that answer calls and follow up with leads, so you stop losing jobs to
          voicemail.
        </h1>
        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed md:text-xl">
          Built for roofing, HVAC, plumbing and general contractors across Central New York.
        </p>
        <BookCallLink tone="paper" className="mt-9" />
      </Container>
    </section>
  );
}
