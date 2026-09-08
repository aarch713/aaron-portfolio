"use client";

import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  id?: string;
}

/** Editorial chapter heading: ruled label, then an oversized display title. */
export function SectionHeading({ eyebrow, title, id }: SectionHeadingProps) {
  return (
    <div className="border-t border-line pt-5">
      <Reveal>
        <p className="editorial-kicker text-current-2-text">
          {eyebrow}
        </p>
        {/* The aria-labelledby target id lives on the h2 itself so the
            section's accessible name is the title alone, not eyebrow+title. */}
        <h2
          id={id}
          className="font-display mt-8 max-w-5xl font-extrabold leading-[0.92] tracking-[-0.045em] text-bone"
          style={{ fontSize: "var(--text-h2)" }}
        >
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
