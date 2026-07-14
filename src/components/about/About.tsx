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

/** Pastel tile tints, one per metric — golden, sky, coral, tangerine. */
const TILE_TINTS = ["#ffeeba", "#dbeeff", "#ffdde6", "#ffe4cd"];
/** Playful bento offsets: alternate tiles nudge a little (motion-safe only
 * matters for animation; static rotation is fine for reduced motion). */
const TILE_TILTS = ["-rotate-1", "rotate-1", "rotate-1", "-rotate-1"];

/**
 * About section: narrative summary (7/12) beside a 2×2 bento of counting
 * metric tiles (5/12), stacked on mobile. All data comes from `profile`.
 */
export function About() {
  const { lead, rest } = splitSummary(profile.summary);

  return (
    <section
      id="about"
      aria-labelledby={HEADING_ID}
      className="py-(--space-section)"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-20">
        <SectionHeading
          eyebrow="Hey"
          title="Making the web feel good"
          id={HEADING_ID}
        />

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-xl leading-relaxed text-bone">{lead}</p>
            </Reveal>
            {rest ? (
              <Reveal delay={SECOND_PARAGRAPH_DELAY}>
                <p className="mt-6 leading-relaxed text-muted">{rest}</p>
              </Reveal>
            ) : null}
          </div>

          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {profile.metrics.map((metric, index) => (
                <Reveal key={metric.label} delay={index * METRIC_STAGGER}>
                  <div
                    className={`bento p-6 ${TILE_TILTS[index % TILE_TILTS.length]}`}
                    style={{
                      ["--tile" as string]:
                        TILE_TINTS[index % TILE_TINTS.length],
                    }}
                  >
                    <MetricCounter metric={metric} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
