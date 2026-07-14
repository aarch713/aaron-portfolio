"use client";

import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  id?: string;
}

/**
 * Section header, drawing-title style: the eyebrow sits in a small bordered
 * tag (like a sheet code in a title block) with a rule running off to the
 * right, then the Archivo display H2 in drawing caps at the locked --text-h2
 * scale. Self-reveals on scroll via Reveal (fully visible under reduced
 * motion / no JS).
 */
export function SectionHeading({ eyebrow, title, id }: SectionHeadingProps) {
  return (
    <div>
      <Reveal>
        <p className="flex items-center gap-4 font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted">
          <span className="border border-line px-2.5 py-1">{eyebrow}</span>
          <span aria-hidden="true" className="dim-line min-w-10 flex-1 max-w-40" />
        </p>
        {/* The aria-labelledby target id lives on the h2 itself so the
            section's accessible name is the title alone, not eyebrow+title. */}
        <h2
          id={id}
          className="mt-5 font-bold uppercase leading-[1.05] tracking-[0.01em] text-bone"
          style={{ fontSize: "var(--text-h2)" }}
        >
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
