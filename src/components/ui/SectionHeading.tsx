"use client";

import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  id?: string;
}

/**
 * Section header, shade-card style: a painted pigment swatch beside the mono
 * uppercase eyebrow (like a shade name on a palette card), then the Bodoni
 * display H2 at the locked --text-h2 scale. Self-reveals on scroll via Reveal
 * (fully visible under reduced motion / no JS).
 */
export function SectionHeading({ eyebrow, title, id }: SectionHeadingProps) {
  return (
    <div>
      <Reveal>
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
          <span aria-hidden="true" className="swatch" />
          {eyebrow}
        </p>
        {/* The aria-labelledby target id lives on the h2 itself so the
            section's accessible name is the title alone, not eyebrow+title. */}
        <h2
          id={id}
          className="font-display mt-4 font-semibold leading-[1.06] tracking-tight text-bone"
          style={{ fontSize: "var(--text-h2)" }}
        >
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
