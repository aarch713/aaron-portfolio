import Link from "next/link";
import type { ReactNode } from "react";
import { MetricCounter } from "@/components/about/MetricCounter";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/content/projects";
import type { Project } from "@/content/types";

/** Display title — sits between --text-h2 and --text-hero. */
const TITLE_SIZE = "clamp(2.75rem, 1.5rem + 5vw, 6rem)";
const METRIC_STAGGER = 0.08;
const STEP_STAGGER = 0.08;
const HEADER_TITLE_DELAY = 0.08;
const HEADER_TAGLINE_DELAY = 0.16;

const EYEBROW_CLASSES =
  "prompt font-mono text-xs lowercase tracking-[0.2em] text-muted";

const MONO_LINK_CLASSES =
  "font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors duration-(--dur) hover:text-bone focus-visible:text-bone";

/** Same mono label, but recolored by the parent `group` link's hover/focus. */
const MONO_GROUP_LABEL_CLASSES =
  "font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors duration-(--dur) group-hover:text-bone group-focus-visible:text-bone";

/**
 * Clause delimiters for result emphasis, earliest match wins. The comma
 * variant requires a trailing space so thousands separators ("10,000+")
 * never split a metric mid-number.
 */
const RESULT_DELIMITERS = [" — ", "; ", ", "] as const;

interface CaseStudyProps {
  project: Project;
}

/**
 * Splits a result line into its leading metric clause (emphasized via the
 * current gradient) and the remainder. When no delimiter exists the whole
 * line is the clause.
 */
function splitResult(result: string): { lead: string; rest: string } {
  let splitAt = -1;
  for (const delimiter of RESULT_DELIMITERS) {
    const index = result.indexOf(delimiter);
    if (index !== -1 && (splitAt === -1 || index < splitAt)) {
      splitAt = index;
    }
  }
  if (splitAt === -1) return { lead: result, rest: "" };
  return { lead: result.slice(0, splitAt), rest: result.slice(splitAt) };
}

/** Case-study section: mono eyebrow as the h2, content below. */
function CaseSection({ label, children }: { label: string; children: ReactNode }) {
  const headingId = `case-${label.toLowerCase()}-heading`;
  return (
    <section aria-labelledby={headingId} className="mt-24 sm:mt-32">
      <Reveal>
        <h2 id={headingId} className={EYEBROW_CLASSES}>
                    {label}
        </h2>
      </Reveal>
      <div className="mt-8">{children}</div>
    </section>
  );
}

/**
 * Full case-study page body. Server component — only Reveal and
 * MetricCounter opt into the client for scroll-gated motion, and both
 * render fully readable static content without JS or under reduced motion.
 */
export function CaseStudy({ project }: CaseStudyProps) {
  const { caseStudy } = project;
  const index = projects.findIndex(({ slug }) => slug === project.slug);
  const safeIndex = index === -1 ? 0 : index;
  const prev = projects[(safeIndex - 1 + projects.length) % projects.length];
  const next = projects[(safeIndex + 1) % projects.length];

  return (
    <main className="py-(--space-section)">
      <article className="mx-auto w-full max-w-5xl px-6 sm:px-10 lg:px-20">
        <Link href="/#projects" className={`inline-flex items-center gap-2 ${MONO_LINK_CLASSES}`}>
          <span aria-hidden="true">&larr;</span> All work
        </Link>

        <header className="mt-14 sm:mt-20">
          <Reveal>
            <p className={EYEBROW_CLASSES}>
                            {project.stack.join(" · ")}
            </p>
          </Reveal>
          <Reveal delay={HEADER_TITLE_DELAY}>
            <h1
              className="font-mono mt-6 font-bold leading-[1.05] tracking-tight text-bone"
              style={{ fontSize: TITLE_SIZE }}
            >
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={HEADER_TAGLINE_DELAY}>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-muted">
              {project.tagline}
            </p>
          </Reveal>
        </header>

        {/* Metric band — hairline-divided row, stacked below sm */}
        <div className="mt-16 grid grid-flow-row divide-y divide-line border-y border-line sm:mt-20 sm:grid-flow-col sm:auto-cols-fr sm:divide-x sm:divide-y-0">
          {project.metrics.map((metric, metricIndex) => (
            <div key={metric.label} className="p-6 sm:p-8 sm:first:pl-0">
              <Reveal delay={metricIndex * METRIC_STAGGER}>
                <MetricCounter metric={metric} />
              </Reveal>
            </div>
          ))}
        </div>

        <CaseSection label="Problem">
          <Reveal>
            <p className="max-w-3xl text-lg leading-relaxed text-bone">
              {caseStudy.problem}
            </p>
          </Reveal>
        </CaseSection>

        <CaseSection label="Approach">
          <ol className="divide-y divide-line border-y border-line">
            {caseStudy.approach.map((step, stepIndex) => (
              <li key={step}>
                <Reveal delay={stepIndex * STEP_STAGGER}>
                  <div className="flex gap-6 py-6 sm:gap-10">
                    <span
                      aria-hidden="true"
                      className="text-current-gradient pt-0.5 font-mono text-sm font-medium"
                    >
                      {String(stepIndex + 1).padStart(2, "0")}
                    </span>
                    <p className="max-w-3xl leading-relaxed text-bone">{step}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </CaseSection>

        <CaseSection label="Architecture">
          <Reveal>
            <div className="console-panel overflow-hidden">
              <div className="console-titlebar">
                <span className="console-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="ml-1">architecture.txt — {project.slug}</span>
              </div>
              <pre
                role="img"
                aria-label={`Architecture diagram for ${project.title}`}
                className="overflow-x-auto p-6 font-mono text-sm leading-relaxed text-muted"
              >
                {caseStudy.architecture}
              </pre>
            </div>
          </Reveal>
        </CaseSection>

        <CaseSection label="Results">
          <ul className="space-y-6">
            {caseStudy.results.map((result, resultIndex) => {
              const { lead, rest } = splitResult(result);
              return (
                <li key={result}>
                  <Reveal delay={resultIndex * STEP_STAGGER}>
                    <p className="max-w-3xl leading-relaxed text-muted">
                      <span className="text-current-gradient font-medium">{lead}</span>
                      {rest}
                    </p>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </CaseSection>

        <footer className="mt-24 border-t border-line pt-10 sm:mt-32">
          <nav aria-label="More case studies">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <Link href={`/projects/${prev.slug}`} className="group">
                <p className={MONO_GROUP_LABEL_CLASSES}>Previous &mdash;</p>
                <p className="mt-2 text-lg font-medium tracking-tight text-bone">
                  {prev.title}
                </p>
              </Link>
              <Link href={`/projects/${next.slug}`} className="group sm:text-right">
                <p className={MONO_GROUP_LABEL_CLASSES}>&mdash; Next</p>
                <p className="mt-2 text-lg font-medium tracking-tight text-bone">
                  {next.title}
                </p>
              </Link>
            </div>
            <p className="mt-12 text-center">
              <Link href="/#projects" className={MONO_LINK_CLASSES}>
                Back to all work
              </Link>
            </p>
          </nav>
        </footer>
      </article>
    </main>
  );
}
