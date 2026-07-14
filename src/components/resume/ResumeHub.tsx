import { profile } from "@/content/profile";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Full-width resume band on the ink canvas, framed by top and bottom
 * hairlines: a display-size line on the left, the download CTA plus a mono
 * note on the right. Reveal keeps it visible under reduced motion / no JS.
 */
export function ResumeHub() {
  return (
    <section
      id="resume"
      aria-labelledby="resume-heading"
      className="border-y border-line bg-ink"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-10 px-6 py-20 md:flex-row md:items-center md:justify-between md:px-10 md:py-28 lg:px-24">
        <Reveal>
          <h2
            id="resume-heading"
            className="font-display font-semibold leading-[1.08] tracking-tight text-bone"
            style={{ fontSize: "var(--text-h2)" }}
          >
            Need the one-pager?
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="shrink-0">
          <div className="flex flex-col items-start gap-4 md:items-end">
            <MagneticButton variant="solid" href={profile.resumePdf} download>
              Download resume
            </MagneticButton>
            <p className="font-mono text-xs tracking-[0.15em] text-muted">
              PDF — updated Jul 2026
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
