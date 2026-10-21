import { problemStat, real } from "@/config/site";
import { Container, SectionHeading } from "@/components/ui";

export function Problem() {
  const statSource = real(problemStat.source);
  return (
    <section aria-labelledby="problem-title" className="py-16 md:py-24">
      <Container className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeading id="problem-title">A missed call is a missed job</SectionHeading>
        </div>
        <div className="max-w-[60ch] space-y-5 text-lg leading-relaxed lg:col-span-7">
          <p>
            It&apos;s 8 p.m. You&apos;re finally off the roof, or still on it. A homeowner with a leak calls, gets your
            voicemail, and calls the next contractor on the list. By morning, that job is gone.
          </p>
          <p>
            Quotes go the same way. You send an estimate, the week gets busy, nobody follows up, and the customer
            books whoever called them back first.
          </p>
          {statSource && (
            <p className="border-l-4 border-pine pl-5 text-xl font-semibold">
              {problemStat.text}{" "}
              <a
                href={statSource}
                className="text-sm font-normal text-stone underline underline-offset-4 hover:text-ink"
                rel="noopener noreferrer"
                target="_blank"
              >
                {problemStat.sourceLabel}
              </a>
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
