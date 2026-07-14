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
 * One project as a console panel: a title bar with traffic-light dots and the
 * slug as a process name, then the service's headline numbers. The whole
 * panel links to the case-study page; hover/focus affordance is a border
 * shift toward phosphor plus a subtle lift (transform only, gated behind
 * motion-safe). Keyboard focus gets the global :focus-visible outline.
 */
export function ProjectCard({ item, index }: ProjectCardProps) {
  const ordinal = String(index + 1).padStart(2, "0");
  const headlineMetric = item.metric;

  return (
    <Link
      href={`/projects/${item.slug}`}
      className="console-panel group flex h-full w-[min(85vw,32rem)] flex-col transition-[border-color,transform] duration-300 ease-[var(--ease-out-expo)] hover:border-current-1/60 motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1"
    >
      <div className="console-titlebar">
        <span className="console-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="ml-1 truncate">{item.slug}.service</span>
        <span className="ml-auto">{ordinal}</span>
      </div>

      <div className="flex grow flex-col p-7">
        <h3 className="font-mono text-2xl font-bold leading-tight tracking-tight text-bone sm:text-3xl">
          {item.title}
        </h3>
        <p className="mt-3 text-muted">{item.tagline}</p>

        <ul aria-label="Stack" className="mt-6 flex flex-wrap gap-2">
          {item.stack.map((stackItem) => (
            <li
              key={stackItem}
              className="rounded border border-line bg-ink/60 px-2 py-0.5 font-mono text-xs text-muted"
            >
              {stackItem}
            </li>
          ))}
        </ul>

        <p className="mt-8">
          <span className="text-current-gradient font-mono text-4xl font-bold tracking-tight sm:text-5xl">
            {formatMetric(headlineMetric)}
          </span>
          <span className="mt-2 block font-mono text-xs lowercase tracking-[0.2em] text-muted">
            {headlineMetric.label}
          </span>
        </p>

        <p className="mt-auto pt-8 font-mono text-xs lowercase tracking-[0.2em] text-muted transition-colors duration-300 group-hover:text-current-1">
          <span aria-hidden="true">$</span> open case-study{" "}
          <span aria-hidden="true">&rarr;</span>
        </p>
      </div>
    </Link>
  );
}
