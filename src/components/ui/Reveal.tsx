"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE, loadGsap } from "@/lib/motion";

const REVEAL_Y_DEFAULT = 32;
const REVEAL_DURATION = 0.9;
const REVEAL_START = "top 85%";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/** Minimal structural type so we don't need a static gsap import for typing. */
interface GsapContextLike {
  revert(): void;
}

/**
 * Enter-on-scroll reveal wrapper.
 *
 * Server-rendered output is fully visible (no CSS opacity-0), so content is
 * readable with JS disabled. On the client, nothing is hidden until the
 * shared GSAP chunk has actually loaded — the painted page never blanks out
 * during the fetch. Once loaded, opacity and transform animate in at
 * `top 85%`. Visibility is deliberately left intact so section headings and
 * links remain in the accessibility tree while waiting to enter the viewport.
 */
export function Reveal({
  children,
  delay = 0,
  y = REVEAL_Y_DEFAULT,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    // Safety net for the load-failure and unmount paths: guarantees the
    // content is never left hidden.
    const restoreVisibility = () => {
      el.style.opacity = "";
      el.style.visibility = "";
      el.style.transform = "";
    };

    let cancelled = false;
    let ctx: GsapContextLike | undefined;

    // Nothing is hidden until GSAP has actually loaded — server HTML stays
    // visible for the whole chunk fetch. Hide + animate in the same tick.
    (async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap.set(el, { opacity: 0, y });
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: REVEAL_DURATION,
          ease: EASE,
          delay,
          scrollTrigger: {
            trigger: el,
            start: REVEAL_START,
            once: true,
          },
        });
      }, el);
    })().catch(restoreVisibility);

    return () => {
      cancelled = true;
      ctx?.revert();
      restoreVisibility();
    };
  }, [prefersReducedMotion, delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
