import Link from "next/link";

/**
 * Trimmed project shape the server page passes down. Client components take
 * this instead of importing @/content/projects, so the full content layer
 * (case-study copy, architecture diagrams) stays out of the client bundle.
 */
export interface ProjectCardData {
  slug: string;
  title: string;
  tagline: string;
  stack: string[];
  /** First (headline) metric only. */
  metric: { value: number; prefix?: string; suffix: string; label: string };
}

interface ProjectCardProps {
  item: ProjectCardData;
  /** Zero-based position — projects.ts is ordered by impact, so the printed ordinal is meaningful. */
  index: number;
}

/** Editorial accent cycle for project rules and ordinals. */
const ACCENTS = [
  "var(--golden)",
  "var(--sky)",
  "var(--coral-fill)",
  "var(--tangerine-fill)",
];

function formatMetric(metric: ProjectCardData["metric"]): string {
  return `${metric.prefix ?? ""}${metric.value.toLocaleString("en-US")}${metric.suffix}`;
}

/**
 * One project as a ruled editorial story. The full surface links to the case
 * study and gains a clear color inversion on hover and keyboard focus.
 */
export function ProjectCard({ item, index }: ProjectCardProps) {
  const ordinal = String(index + 1).padStart(2, "0");
  const headlineMetric = item.metric;
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <Link
      href={`/projects/${item.slug}`}
      className="group relative flex h-full min-h-[28rem] flex-col border-b border-r border-line bg-ink transition-colors duration-(--dur) hover:bg-signal hover:text-on-signal focus-visible:bg-signal focus-visible:text-on-signal"
    >
      <span
        aria-hidden="true"
        className="absolute h-1 w-20"
        style={{ backgroundColor: accent }}
      />
      <div className="flex min-w-0 flex-col p-6 sm:p-9">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted group-hover:text-on-signal/70 group-focus-visible:text-on-signal/70">
          Project / {ordinal}
        </p>

        <h3 className="font-display mt-10 max-w-xl text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] text-bone group-hover:text-on-signal group-focus-visible:text-on-signal sm:text-5xl">
          {item.title}
        </h3>
        <p className="mt-5 max-w-xl text-muted group-hover:text-on-signal/75 group-focus-visible:text-on-signal/75">
          {item.tagline}
        </p>

        <ul aria-label="Stack" className="mt-6 flex flex-wrap gap-2">
          {item.stack.map((stackItem) => (
            <li
              key={stackItem}
              className="border border-line px-2.5 py-1 font-mono text-xs text-muted group-hover:border-on-signal/25 group-hover:text-on-signal group-focus-visible:border-on-signal/25 group-focus-visible:text-on-signal"
            >
              {stackItem}
            </li>
          ))}
        </ul>

        <p className="mt-10 border-t border-line pt-6 group-hover:border-on-signal/25 group-focus-visible:border-on-signal/25">
          <span className="font-display text-5xl font-extrabold tracking-[-0.04em] text-bone group-hover:text-on-signal group-focus-visible:text-on-signal sm:text-6xl">
            {formatMetric(headlineMetric)}
          </span>
          <span className="mt-2 block font-mono text-xs uppercase tracking-[0.16em] text-muted group-hover:text-on-signal/70 group-focus-visible:text-on-signal/70">
            {headlineMetric.label}
          </span>
        </p>

        <p className="mt-auto pt-10 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-current-2-text group-hover:text-on-signal group-focus-visible:text-on-signal">
          Open case study <span aria-hidden="true">↗</span>
        </p>
      </div>
    </Link>
  );
}
