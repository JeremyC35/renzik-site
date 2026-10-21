import { Container, SectionHeading } from "@/components/ui";

const faqs = [
  {
    q: "Does it sound like a robot?",
    a: "It uses a natural, conversational voice, and we set it up with your business details, services and hours. You'll hear it on test calls before it ever answers a customer.",
  },
  {
    q: "What happens if a caller wants a real person?",
    a: "It transfers them. You decide where transfers go, like your cell or the office line, and urgent calls can go straight to you.",
  },
  {
    q: "Will callers know it's AI?",
    a: "If a caller asks, it tells them honestly that it's an AI assistant and offers to connect them with a person.",
  },
  {
    q: "Does this replace my office staff?",
    a: "No. It covers the calls they can't get to: after hours, weekends, lunch breaks, and when two lines ring at once.",
  },
  {
    q: "How long does setup take?",
    a: "It depends on your phone setup and what you want it to handle. We'll give you a timeline on the first call, before you commit to anything.",
  },
  {
    q: "Do I have to change my phone number?",
    a: "No. You keep the number your customers already have.",
  },
];

/* Native <details>/<summary>: keyboard and screen-reader support built in, works without JavaScript. */
export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="border-t border-stone/25 py-16 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading id="faq-title">Questions contractors ask</SectionHeading>
          <div className="mt-8 border-b border-stone/40">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group border-t border-stone/40">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                  {q}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className="size-5 shrink-0 text-pine transition-transform group-open:rotate-45"
                  >
                    <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="2.25" strokeLinecap="square" />
                  </svg>
                </summary>
                <p className="max-w-[62ch] pb-5 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
