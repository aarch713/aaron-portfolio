"use client";

import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  id?: string;
}

/**
 * Section header: mono uppercase eyebrow prefixed with a 2rem gradient rule,
 * followed by a display H2 at the locked --text-h2 scale. Self-reveals on
 * scroll via Reveal (which stays fully visible under reduced motion / no JS).
 */
export function SectionHeading({ eyebrow, title, id }: SectionHeadingProps) {
  return (
    <div>
      <Reveal>
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
          <span
            aria-hidden="true"
            className="inline-block h-px w-8 shrink-0"
            style={{
              background:
                "linear-gradient(90deg, var(--current-1), var(--current-2))",
            }}
          />
          {eyebrow}
        </p>
        {/* The aria-labelledby target id lives on the h2 itself so the
            section's accessible name is the title alone, not eyebrow+title. */}
        <h2
          id={id}
          className="mt-4 font-medium leading-[1.08] tracking-tight text-bone"
          style={{ fontSize: "var(--text-h2)" }}
        >
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
