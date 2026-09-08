import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";

/**
 * Selected work in a stable editorial grid. Every project is visible at once,
 * so scanning, keyboard navigation, and reduced-motion behavior are identical.
 */
export function ProjectsRail({ items }: { items: ProjectCardData[] }) {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-y border-line bg-surface py-[var(--space-section)]"
    >
      <div className="mx-auto w-full max-w-[88rem] px-4 sm:px-8 lg:px-12">
        <SectionHeading
          id="projects-heading"
          eyebrow="02 / Selected work"
          title="Proof, not promises"
        />

        <ol className="mt-14 grid border-l border-t border-line lg:mt-20 lg:grid-cols-2">
          {items.map((item, index) => (
            <li
              key={item.slug}
              className={index === 0 ? "lg:col-span-2" : undefined}
            >
              <ProjectCard item={item} index={index} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
