"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE } from "@/lib/motion";

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
 * readable with JS disabled. On the client, useLayoutEffect hides the element
 * before first paint (unless reduced motion is preferred), then GSAP animates
 * it in once when it scrolls to `top 85%`.
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

    // Hide synchronously before paint. GSAP is loaded async; if it fails,
    // restoreVisibility() guarantees the content is never left hidden.
    el.style.opacity = "0";
    el.style.visibility = "hidden";
    el.style.transform = `translateY(${y}px)`;

    const restoreVisibility = () => {
      el.style.opacity = "";
      el.style.visibility = "";
      el.style.transform = "";
    };

    let cancelled = false;
    let ctx: GsapContextLike | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: REVEAL_DURATION,
            ease: EASE,
            delay,
            scrollTrigger: {
              trigger: el,
              start: REVEAL_START,
              once: true,
            },
          },
        );
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
