"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { loadGsap } from "@/lib/motion";

/** Scrub smoothing (seconds) for the scroll-linked sun position. */
const SCRUB_SMOOTHING = 0.7;
/** Where the sun sits before any scroll (a little past dawn). */
const START_PROGRESS = 0.06;
/** Desktop gate — matches the wrapper's `hidden lg:block`. */
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
/** Trailing debounce for body-resize → ScrollTrigger.refresh(). */
const REFRESH_DEBOUNCE_MS = 200;
/** viewBox dimensions of the arc path (height matches the h-28 wrapper). */
const VIEW_W = 1000;

/** Minimal structural type so we don't need a static gsap import for typing. */
interface GsapContextLike {
  revert(): void;
}

/**
 * "The sun" — V5's signature. A faint dashed arc spans the top of the
 * viewport, and a small golden sun rides it from dawn (left) to dusk (right)
 * in proportion to overall document scroll: the page is one golden hour.
 *
 * - Server/no-JS output is the arc with the sun parked at dawn — nothing
 *   readable depends on JS.
 * - Reduced motion: static dawn sun, no scrub — the effect exits before
 *   loading GSAP.
 * - Below lg the overlay is display:none and the effect is gated on a
 *   matchMedia check, attaching/tearing down live across the breakpoint.
 * - The arc stretches with the viewport (preserveAspectRatio="none"), so the
 *   sun is an HTML disc positioned in pixel space from getPointAtLength
 *   (x scaled by clientWidth/viewBox width; y is 1:1) — it stays perfectly
 *   round at any width. One scrubbed proxy tween drives it; a resize
 *   listener re-derives the pixel mapping.
 */
export function SunArc() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const wrap = wrapRef.current;
    const path = pathRef.current;
    const sun = sunRef.current;
    if (!wrap || !path || !sun) return;

    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    let cancelled = false;
    let ctx: GsapContextLike | undefined;
    let observer: ResizeObserver | undefined;
    let refreshTimeout: number | undefined;
    let onResize: (() => void) | undefined;

    const teardown = () => {
      if (refreshTimeout !== undefined) {
        window.clearTimeout(refreshTimeout);
        refreshTimeout = undefined;
      }
      if (onResize) {
        window.removeEventListener("resize", onResize);
        onResize = undefined;
      }
      observer?.disconnect();
      observer = undefined;
      ctx?.revert();
      ctx = undefined;
    };

    const setup = () => {
      void (async () => {
        const { gsap, ScrollTrigger } = await loadGsap();
        // `ctx` guard: a rapid off→on breakpoint flip can queue two setups;
        // only the first resolved one may build the timeline.
        if (cancelled || ctx || !desktopQuery.matches) return;

        ctx = gsap.context(() => {
          const total = path.getTotalLength();
          const proxy = { progress: START_PROGRESS };

          const place = () => {
            const point = path.getPointAtLength(proxy.progress * total);
            const x = (point.x / VIEW_W) * wrap.clientWidth;
            sun.style.transform = `translate(${x}px, ${point.y}px)`;
          };
          place();

          gsap.to(proxy, {
            progress: 1,
            ease: "none",
            onUpdate: place,
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "max",
              scrub: SCRUB_SMOOTHING,
              invalidateOnRefresh: true,
            },
          });

          onResize = place;
          window.addEventListener("resize", onResize, { passive: true });
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
    };

    const onDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setup();
      } else {
        teardown();
      }
    };
    desktopQuery.addEventListener("change", onDesktopChange);

    if (desktopQuery.matches) {
      setup();
    }

    return () => {
      cancelled = true;
      desktopQuery.removeEventListener("change", onDesktopChange);
      teardown();
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-30 hidden h-28 lg:block"
    >
      <svg
        className="h-full w-full overflow-visible"
        viewBox="0 0 1000 112"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* The day's arc: dawn at the left edge, dusk at the right. */}
        <path
          ref={pathRef}
          d="M -20 118 Q 500 -60 1020 118"
          stroke="var(--line)"
          strokeWidth="1.5"
          strokeDasharray="2 7"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* The sun: HTML disc so it never stretches with the arc's svg.
          Server-rendered at dawn (transform below mirrors START_PROGRESS's
          neighborhood on typical widths). */}
      <div
        ref={sunRef}
        className="absolute left-0 top-0 will-change-transform"
        style={{ transform: "translate(64px, 96px)" }}
      >
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "34px",
            height: "34px",
            background: "var(--golden)",
            opacity: 0.3,
          }}
        />
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "18px",
            height: "18px",
            background: "var(--golden)",
            border: "2.5px solid var(--tangerine-fill)",
          }}
        />
      </div>
    </div>
  );
}
