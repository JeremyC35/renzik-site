import { Container, SectionHeading } from "@/components/ui";

const steps = [
  {
    title: "A 20-minute call",
    body: "We talk through how your phones and leads work today: who answers, what happens after hours, and where quotes end up.",
  },
  {
    title: "We build and test it",
    body: "We set it up on your real call flow and test it until it handles your calls the way you would.",
  },
  {
    title: "It goes live",
    body: "It starts answering and following up, and you get a simple report every month.",
  },
];

/* A real sequence, so the steps are numbered. */
export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="border-t border-stone/25 py-16 md:py-24">
      <Container>
        <SectionHeading id="how-title">How it works</SectionHeading>
        <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-5 md:block">
              <span aria-hidden="true" className="text-5xl leading-none font-bold text-pine tabular-nums md:text-6xl">
                {i + 1}
              </span>
              <div className="md:mt-5">
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="mt-2 leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
