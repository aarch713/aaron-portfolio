"use client";

import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  id?: string;
}

/**
 * Section header, golden-hour style: the eyebrow rides in a little die-cut
 * sticker chip, then the Bricolage display H2 at the locked --text-h2 scale.
 * Self-reveals on scroll via Reveal (fully visible under reduced motion /
 * no JS).
 */
export function SectionHeading({ eyebrow, title, id }: SectionHeadingProps) {
  return (
    <div>
      <Reveal>
        <p className="sticker px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-bone w-fit">
          {eyebrow}
        </p>
        {/* The aria-labelledby target id lives on the h2 itself so the
            section's accessible name is the title alone, not eyebrow+title. */}
        <h2
          id={id}
          className="font-display mt-5 font-extrabold leading-[1.04] tracking-tight text-bone"
          style={{ fontSize: "var(--text-h2)" }}
        >
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
