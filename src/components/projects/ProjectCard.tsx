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

/** Accent sunset cycle for the card top bars. */
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
 * One project as a chunky bento card: hard offset shadow, an accent color
 * bar on top (sunset cycle), Bricolage title, sticker stack chips. The whole
 * card links to the case-study page; hover/focus lifts it slightly
 * (transform only, gated behind motion-safe). Keyboard focus gets the global
 * :focus-visible outline.
 */
export function ProjectCard({ item, index }: ProjectCardProps) {
  const ordinal = String(index + 1).padStart(2, "0");
  const headlineMetric = item.metric;
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <Link
      href={`/projects/${item.slug}`}
      className="bento group flex h-full w-[min(85vw,32rem)] flex-col overflow-hidden transition-transform duration-300 ease-[var(--ease-out-expo)] motion-safe:hover:-translate-y-1.5 motion-safe:hover:rotate-[0.4deg] motion-safe:focus-visible:-translate-y-1.5"
    >
      <span
        aria-hidden="true"
        className="block h-2.5 w-full"
        style={{ background: accent }}
      />
      <div className="flex grow flex-col p-8">
        <p className="flex items-center justify-between font-mono text-xs tracking-[0.25em] text-muted">
          <span>{ordinal}</span>
          <span
            aria-hidden="true"
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: accent }}
          />
        </p>

        <h3 className="font-display mt-6 text-3xl font-extrabold leading-tight tracking-tight text-bone">
          {item.title}
        </h3>
        <p className="mt-3 text-muted">{item.tagline}</p>

        <ul aria-label="Stack" className="mt-6 flex flex-wrap gap-2">
          {item.stack.map((stackItem) => (
            <li
              key={stackItem}
              className="sticker px-2.5 py-0.5 font-mono text-xs text-bone"
            >
              {stackItem}
            </li>
          ))}
        </ul>

        <p className="mt-8">
          <span className="font-display text-4xl font-extrabold tracking-tight text-bone sm:text-5xl">
            {formatMetric(headlineMetric)}
          </span>
          <span className="mt-2 block font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {headlineMetric.label}
          </span>
        </p>

        <p className="mt-auto pt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors duration-300 group-hover:text-current-1">
          Case study <span aria-hidden="true">&rarr;</span>
        </p>
      </div>
    </Link>
  );
}
