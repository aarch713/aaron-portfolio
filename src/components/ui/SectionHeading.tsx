"use client";

import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  id?: string;
}

/**
 * Section header, console style: the eyebrow reads as a shell command
 * (phosphor `$` prompt glyph via CSS, so it stays out of the accessible
 * name), followed by the JetBrains Mono display H2 at the locked --text-h2
 * scale. Self-reveals on scroll via Reveal (fully visible under reduced
 * motion / no JS).
 */
export function SectionHeading({ eyebrow, title, id }: SectionHeadingProps) {
  return (
    <div>
      <Reveal>
        <p className="prompt font-mono text-xs lowercase tracking-[0.2em] text-muted">
          {eyebrow}
        </p>
        {/* The aria-labelledby target id lives on the h2 itself so the
            section's accessible name is the title alone, not eyebrow+title. */}
        <h2
          id={id}
          className="font-mono mt-4 font-bold lowercase leading-[1.08] tracking-tight text-bone"
          style={{ fontSize: "var(--text-h2)" }}
        >
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
