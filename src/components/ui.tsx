import type { ComponentProps, ReactNode } from "react";

/** Page-width wrapper: 16px side gutter on phones, wider from small tablets up. */
export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

const ctaBase =
  "inline-flex min-h-11 items-center justify-center rounded-ui px-5 py-2.5 text-base font-semibold whitespace-nowrap transition-colors";

/** The one call to action on the page. "Book a call" everywhere, pointing at the form. */
export function BookCallLink({
  tone = "pine",
  className = "",
  ...rest
}: { tone?: "pine" | "paper" } & ComponentProps<"a">) {
  const colors =
    tone === "pine"
      ? "bg-pine text-paper hover:bg-pine-deep active:bg-pine-deep"
      : "bg-paper text-pine hover:bg-ink hover:text-paper active:bg-ink active:text-paper";
  return (
    <a href="#book-a-call" className={`${ctaBase} ${colors} ${className}`} {...rest}>
      Book a call
    </a>
  );
}

export function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="text-[2rem] leading-[1.1] font-bold tracking-tight text-balance md:text-headline">
      {children}
    </h2>
  );
}
