import { MetricCounter } from "@/components/about/MetricCounter";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/content/profile";

const HEADING_ID = "about-heading";
const METRIC_STAGGER = 0.08;
const SECOND_PARAGRAPH_DELAY = 0.12;

/** Sentence boundary: a period followed by whitespace and a capital letter. */
const SENTENCE_BREAK = /(?<=\.)\s+(?=[A-Z])/;

/**
 * Splits the profile summary into a lead sentence and the remainder so the
 * narrative reads as two short paragraphs. Falls back to a single paragraph
 * when the summary has only one sentence.
 */
function splitSummary(summary: string): {
  lead: string;
  rest: string | null;
} {
  const [lead = summary, ...remaining] = summary.split(SENTENCE_BREAK);
  return { lead, rest: remaining.length > 0 ? remaining.join(" ") : null };
}

/**
 * About section: an editorial profile column followed by a ruled metric row.
 * All data comes from `profile`.
 */
export function About() {
  const { lead, rest } = splitSummary(profile.summary);

  return (
    <section
      id="about"
      aria-labelledby={HEADING_ID}
      className="py-(--space-section)"
    >
      <div className="mx-auto w-full max-w-[88rem] px-4 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="01 / Profile"
          title="Built for real-world momentum"
          id={HEADING_ID}
        />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          <p className="font-mono text-xs uppercase leading-relaxed tracking-[0.16em] text-current-1">
            Frontend systems<br />
            Ecommerce<br />
            Applied AI
          </p>
          <div className="max-w-4xl">
            <Reveal>
              <p className="font-display text-2xl font-medium leading-snug tracking-tight text-bone sm:text-4xl">
                {lead}
              </p>
            </Reveal>
            {rest ? (
              <Reveal delay={SECOND_PARAGRAPH_DELAY}>
                <p className="mt-8 max-w-3xl leading-relaxed text-muted">{rest}</p>
              </Reveal>
            ) : null}
          </div>
        </div>

        <div className="mt-16 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {profile.metrics.map((metric, index) => (
            <Reveal key={metric.label} delay={index * METRIC_STAGGER}>
              <div className="min-h-44 border-b border-r border-line bg-ink p-6 transition-colors duration-(--dur) hover:border-signal">
                <MetricCounter metric={metric} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
