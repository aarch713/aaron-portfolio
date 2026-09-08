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
      className="border-y border-line bg-current-1 text-ink"
    >
      <div className="mx-auto flex max-w-[88rem] flex-col items-start gap-10 px-4 py-20 sm:px-8 md:flex-row md:items-center md:justify-between md:py-24 lg:px-12">
        <Reveal>
          <h2
            id="resume-heading"
            className="font-display font-extrabold leading-[0.95] tracking-[-0.04em] text-ink"
            style={{ fontSize: "var(--text-h2)" }}
          >
            Need the one-pager?
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="shrink-0">
          <div className="flex flex-col items-start gap-4 md:items-end">
            <MagneticButton
              variant="ghost"
              href={profile.resumePdf}
              download
              className="border-ink text-ink hover:border-signal hover:bg-signal hover:text-on-signal"
            >
              Download resume
            </MagneticButton>
            <p className="font-mono text-xs tracking-[0.15em] text-ink">
              PDF — updated Jul 2026
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
