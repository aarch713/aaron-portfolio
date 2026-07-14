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

function formatMetric(metric: ProjectCardData["metric"]): string {
  return `${metric.prefix ?? ""}${metric.value.toLocaleString("en-US")}${metric.suffix}`;
}

/**
 * One project as a numbered drawing sheet: framed border with an inner rule,
 * a sheet-code header, drawing-caps title, and the headline number called
 * out like a dimension. The whole sheet links to the case-study page;
 * hover/focus affordance is a border shift toward redline plus a subtle lift
 * (transform only, gated behind motion-safe). Keyboard focus gets the global
 * :focus-visible outline.
 */
export function ProjectCard({ item, index }: ProjectCardProps) {
  const sheetCode = `A-${String(index + 1).padStart(2, "0")}`;
  const headlineMetric = item.metric;

  return (
    <Link
      href={`/projects/${item.slug}`}
      className="sheet-frame group flex h-full w-[min(85vw,32rem)] flex-col p-8 transition-[border-color,transform] duration-300 ease-[var(--ease-out-expo)] hover:border-current-1/70 motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1"
    >
      <p className="flex items-baseline justify-between font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted">
        <span>Sheet {sheetCode}</span>
        <span>of 06</span>
      </p>

      <h3 className="mt-6 text-2xl font-bold uppercase leading-tight tracking-[0.01em] text-bone sm:text-3xl">
        {item.title}
      </h3>
      <p className="mt-3 text-muted">{item.tagline}</p>

      <ul aria-label="Stack" className="mt-6 flex flex-wrap gap-2">
        {item.stack.map((stackItem) => (
          <li
            key={stackItem}
            className="border border-line px-2 py-0.5 font-mono text-xs text-muted"
          >
            {stackItem}
          </li>
        ))}
      </ul>

      <p className="mt-8">
        <span className="text-current-gradient text-4xl font-bold tracking-tight sm:text-5xl">
          {formatMetric(headlineMetric)}
        </span>
        <span aria-hidden="true" className="dim-line mt-3 block max-w-32" />
        <span className="mt-2 block font-mono text-xs uppercase tracking-[0.1em] text-muted">
          {headlineMetric.label}
        </span>
      </p>

      <p className="mt-auto pt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors duration-300 group-hover:text-current-1">
        Open sheet <span aria-hidden="true">&rarr;</span>
      </p>
    </Link>
  );
}
