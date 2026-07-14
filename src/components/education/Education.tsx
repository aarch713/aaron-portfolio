import { certifications, education } from "@/content/education";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ROW_STAGGER_S = 0.06;

/**
 * Education as hairline-separated rows (school + degree left, year in mono
 * right), followed by a compact mono list of certifications. Everything is
 * Reveal-wrapped, so it stays fully visible under reduced motion / no JS.
 */
export function Education() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="py-(--space-section)"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-24">
        <SectionHeading
          id="education-heading"
          eyebrow="cat credentials.log"
          title="training data"
        />

        <div className="mt-14 border-t border-line">
          {education.map((item, index) => (
            <Reveal key={item.school} delay={index * ROW_STAGGER_S}>
              <div className="flex flex-col gap-2 border-b border-line py-7 md:flex-row md:items-baseline md:justify-between md:gap-8">
                <div>
                  <h3 className="text-lg font-medium tracking-tight text-bone">
                    {item.school}
                  </h3>
                  <p className="mt-1 text-muted">
                    {item.degree} · {item.detail}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-sm text-muted">
                  {item.year}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={education.length * ROW_STAGGER_S}>
          <div className="mt-12">
            <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
              Certifications
            </h3>
            <ul className="mt-5 space-y-3 font-mono text-sm">
              {certifications.map((cert) => (
                <li
                  key={cert.name}
                  className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1"
                >
                  <span className="text-bone">
                    {cert.name} <span className="text-muted">· {cert.issuer}</span>
                  </span>
                  <span className="text-muted">{cert.year}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
