"use client";

import { useEffect, useRef, useState } from "react";

/** Sections the bar reports, in document order. */
const SECTIONS: { id: string; label: string }[] = [
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "ai", label: "ai" },
  { id: "skills", label: "skills" },
  { id: "education", label: "education" },
  { id: "resume", label: "resume" },
  { id: "contact", label: "contact" },
];

const HOME_LABEL = "~";

/**
 * "The status bar" — V3's signature. A fixed bottom console strip: session
 * prompt on the left, the section currently in view in the middle, and a
 * scroll percentage with a phosphor meter on the right.
 *
 * Decorative (aria-hidden): every value it shows is available in the page
 * itself. Scroll math runs through one passive rAF-throttled listener; the
 * active section comes from an IntersectionObserver — no per-frame layout
 * reads. Works identically under reduced motion (text updates, no tweens);
 * without JS it renders the static prompt row.
 */
export function StatusBar() {
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState(HOME_LABEL);
  const meterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(Math.round(value * 100));
      // Width via transform: compositor-only, no layout.
      meterRef.current?.style.setProperty("transform", `scaleX(${value})`);
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    const targets = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const visible = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target, entry.intersectionRatio);
          } else {
            visible.delete(entry.target);
          }
        }
        let best: Element | undefined;
        let bestRatio = 0;
        for (const [el, ratio] of visible) {
          if (ratio >= bestRatio) {
            best = el;
            bestRatio = ratio;
          }
        }
        const id = best?.id;
        setSection(
          id ? (SECTIONS.find((s) => s.id === id)?.label ?? HOME_LABEL) : HOME_LABEL,
        );
      },
      { threshold: [0.05, 0.25, 0.5] },
    );
    targets.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex h-8 items-center justify-between gap-4 border-t border-line bg-surface/90 px-4 font-mono text-[0.6875rem] tracking-[0.08em] text-muted backdrop-blur sm:px-6"
    >
      <span className="truncate">
        <span className="text-current-1">aaron@chai</span>:~/portfolio
      </span>
      <span className="hidden truncate sm:block">
        <span className="text-current-2">·</span> {section}
      </span>
      <span className="flex items-center gap-2">
        <span className="relative hidden h-1 w-24 overflow-hidden rounded-full bg-line sm:block">
          <span
            ref={meterRef}
            className="absolute inset-0 origin-left rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--current-1), var(--current-2))",
              transform: "scaleX(0)",
            }}
          />
        </span>
        scroll {String(progress).padStart(3, "0")}%
      </span>
    </div>
  );
}
