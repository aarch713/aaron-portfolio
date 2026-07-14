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
 * One project as a palette card: porcelain compact with a pigment swatch and
 * an editorial "N°" folio. The whole card links to the case-study page;
 * hover/focus affordance is a border shift toward lacquer plus a subtle lift
 * (transform only, gated behind motion-safe). Keyboard focus gets the global
 * :focus-visible outline.
 */
export function ProjectCard({ item, index }: ProjectCardProps) {
  const ordinal = String(index + 1).padStart(2, "0");
  const headlineMetric = item.metric;

  return (
    <Link
      href={`/projects/${item.slug}`}
      className="group flex h-full w-[min(85vw,32rem)] flex-col rounded-2xl border border-line bg-surface/70 p-8 transition-[border-color,transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:border-current-1/60 hover:shadow-[0_18px_40px_-24px_rgba(142,32,67,0.35)] motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1"
    >
      <p className="flex items-center justify-between font-mono text-xs tracking-[0.25em] text-muted">
        <span>N° {ordinal}</span>
        <span aria-hidden="true" className="swatch" />
      </p>

      <h3 className="font-display mt-6 text-3xl font-semibold leading-tight tracking-tight text-bone">
        {item.title}
      </h3>
      <p className="mt-3 text-muted">{item.tagline}</p>

      <ul aria-label="Stack" className="mt-6 flex flex-wrap gap-2">
        {item.stack.map((stackItem) => (
          <li
            key={stackItem}
            className="rounded-full border border-line bg-ink/60 px-2 py-0.5 font-mono text-xs text-muted"
          >
            {stackItem}
          </li>
        ))}
      </ul>

      <p className="mt-8">
        <span className="text-current-gradient font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {formatMetric(headlineMetric)}
        </span>
        <span className="mt-2 block font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {headlineMetric.label}
        </span>
      </p>

      <p className="mt-auto pt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors duration-300 group-hover:text-bone">
        Case study <span aria-hidden="true">&rarr;</span>
      </p>
    </Link>
  );
}
