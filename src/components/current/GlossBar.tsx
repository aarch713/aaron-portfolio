"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { loadGsap } from "@/lib/motion";

/** Scrub smoothing (seconds) for the scroll-linked sweep. */
const SCRUB_SMOOTHING = 0.6;
/** Trailing debounce for body-resize → ScrollTrigger.refresh(). */
const REFRESH_DEBOUNCE_MS = 200;

/** Minimal structural type so we don't need a static gsap import for typing. */
interface GsapContextLike {
  revert(): void;
}

/**
 * "The gloss" — V2's signature. A 4px lacquer→rouge swipe fixed to the top
 * edge that sweeps across in proportion to overall document scroll, like a
 * lipstick pull across paper.
 *
 * - Server/no-JS output is the full static swipe (the scale transform is only
 *   ever applied at runtime by GSAP), so the page never depends on JS.
 * - Reduced motion: full static swipe, no scrub — the effect exits before
 *   loading GSAP.
 * - A ResizeObserver on document.body triggers a debounced
 *   ScrollTrigger.refresh() (skipped when the body height hasn't changed) so
 *   the scroll range re-measures when page height changes.
 */
export function GlossBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const bar = barRef.current;
    if (!bar) return;

    let cancelled = false;
    let ctx: GsapContextLike | undefined;
    let observer: ResizeObserver | undefined;
    let refreshTimeout: number | undefined;

    (async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "max",
              scrub: SCRUB_SMOOTHING,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      let lastBodyHeight = document.body.offsetHeight;
      observer = new ResizeObserver(() => {
        if (refreshTimeout !== undefined) {
          window.clearTimeout(refreshTimeout);
        }
        refreshTimeout = window.setTimeout(() => {
          refreshTimeout = undefined;
          const bodyHeight = document.body.offsetHeight;
          if (bodyHeight === lastBodyHeight) return;
          lastBodyHeight = bodyHeight;
          ScrollTrigger.refresh();
        }, REFRESH_DEBOUNCE_MS);
      });
      observer.observe(document.body);
    })();

    return () => {
      cancelled = true;
      if (refreshTimeout !== undefined) {
        window.clearTimeout(refreshTimeout);
      }
      observer?.disconnect();
      ctx?.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 origin-left"
      style={{
        background:
          "linear-gradient(90deg, var(--current-2), var(--current-1) 60%, #f0688f)",
        boxShadow: "0 1px 4px rgba(217, 54, 100, 0.35)",
      }}
    />
  );
}
