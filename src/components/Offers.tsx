import { Container, SectionHeading } from "@/components/ui";

const primary = {
  name: "AI receptionist",
  outcome: "Every call answered, 24/7.",
  detail:
    "It picks up when you can't, answers common questions, and books inspections on your calendar. Urgent calls get transferred straight to you.",
};

const others = [
  {
    name: "Missed call text-back",
    outcome: "A text back within seconds.",
    detail: "When nobody picks up, the caller gets a text right away, so the conversation stays with you instead of moving on.",
  },
  {
    name: "Lead reactivation",
    outcome: "Old quotes, followed up.",
    detail: "It reaches back out to past estimates and past customers who never booked, and hands you the ones ready to talk.",
  },
];

/* Asymmetric on desktop: the receptionist (the main offer) gets the wide column, the other two stack beside it. */
export function Offers() {
  return (
    <section aria-labelledby="offers-title" className="border-t border-stone/25 py-16 md:py-24">
      <Container>
        <SectionHeading id="offers-title">What we build</SectionHeading>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <article className="border-t-4 border-pine pt-6 lg:col-span-7">
            <h3 className="text-2xl font-bold md:text-[2rem] md:leading-tight">{primary.name}</h3>
            <p className="mt-3 text-xl font-semibold text-pine md:text-2xl">{primary.outcome}</p>
            <p className="mt-4 max-w-[52ch] text-lg leading-relaxed">{primary.detail}</p>
          </article>
          <div className="grid gap-10 lg:col-span-5">
            {others.map((offer) => (
              <article key={offer.name} className="border-t border-stone/50 pt-6">
                <h3 className="text-xl font-bold">{offer.name}</h3>
                <p className="mt-2 text-lg font-semibold text-pine">{offer.outcome}</p>
                <p className="mt-3 leading-relaxed">{offer.detail}</p>
              </article>
            ))}
          </div>
        </div>
        <p className="mt-12 max-w-[60ch] text-stone">
          We also build instant estimate bots, invoice follow-up, and speed-to-lead calling.
        </p>
      </Container>
    </section>
  );
}
