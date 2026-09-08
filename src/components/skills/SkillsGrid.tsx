import { skillGroups } from "@/content/skills";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ROW_STAGGER_S = 0.06;

/**
 * Skills as grouped rows: mono group label on the left, items as quiet
 * hairline chips on the right. Rows sit between hairline rules; each row
 * reveals on scroll (fully visible under reduced motion / no JS via Reveal).
 */
export function SkillsGrid() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="py-(--space-section)"
    >
      <div className="mx-auto max-w-[88rem] px-4 sm:px-8 lg:px-12">
        <SectionHeading
          id="skills-heading"
          eyebrow="05 / Capabilities"
          title="Tools with a point of view"
        />

        <div className="mt-14 border-t border-line">
          {skillGroups.map((group, index) => (
            <Reveal key={group.label} delay={index * ROW_STAGGER_S}>
              <div className="flex flex-col gap-4 border-b border-line py-7 md:flex-row md:items-baseline md:gap-8">
                <h3 className="w-48 shrink-0 font-mono text-xs uppercase tracking-[0.25em] text-muted">
                  {group.label}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="sticker px-3 py-1 font-mono text-sm text-bone transition-colors duration-(--dur) hover:border-signal hover:text-signal"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
