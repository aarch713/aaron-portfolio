import Link from "next/link";
import type { Metric, Project } from "@/content/types";

interface ProjectCardProps {
  project: Project;
  /** Zero-based position — projects.ts is ordered by impact, so the printed ordinal is meaningful. */
  index: number;
}

function formatMetric(metric: Metric): string {
  return `${metric.prefix ?? ""}${metric.value.toLocaleString("en-US")}${metric.suffix}`;
}

/**
 * One project card. The whole card is the link to the case-study page;
 * hover/focus affordance is a border shift toward --current-1 plus a subtle
 * lift (transform only, gated behind motion-safe). Keyboard focus gets the
 * global :focus-visible outline.
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const ordinal = String(index + 1).padStart(2, "0");
  const headlineMetric = project.metrics[0];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full w-[min(85vw,32rem)] flex-col rounded-lg border border-line bg-surface p-8 transition-[border-color,transform] duration-300 ease-[var(--ease-out-expo)] hover:border-current-1/50 motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1"
    >
      <p className="font-mono text-xs tracking-[0.25em] text-muted">
        {ordinal}
      </p>

      <h3 className="mt-6 text-3xl font-medium leading-tight tracking-tight text-bone">
        {project.title}
      </h3>
      <p className="mt-3 text-muted">{project.tagline}</p>

      <ul aria-label="Stack" className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <li
            key={item}
            className="rounded-full border border-line px-2 py-0.5 font-mono text-xs text-muted"
          >
            {item}
          </li>
        ))}
      </ul>

      {headlineMetric && (
        <p className="mt-8">
          <span className="text-current-gradient text-4xl font-medium tracking-tight sm:text-5xl">
            {formatMetric(headlineMetric)}
          </span>
          <span className="mt-2 block font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {headlineMetric.label}
          </span>
        </p>
      )}

      <p className="mt-auto pt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors duration-300 group-hover:text-bone">
        Case study <span aria-hidden="true">&rarr;</span>
      </p>
    </Link>
  );
}
