"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Scrub smoothing (seconds) for the scroll-linked draw. */
const SCRUB_SMOOTHING = 0.6;
/** Fraction of total scroll over which the pulse fades in at the top. */
const PULSE_FADE_PORTION = 0.03;
const PULSE_RADIUS = 3;
const LINE_WIDTH = 2;
/** Static id is safe: CurrentLine is mounted exactly once (in the layout). */
const GRADIENT_ID = "current-line-gradient";

/** Minimal structural type so we don't need a static gsap import for typing. */
interface GsapContextLike {
  revert(): void;
}

/**
 * "The current" — signature left-rail element. A fixed, viewport-height 2px
 * SVG line (hidden below lg) with a violet→cyan gradient stroke that draws
 * downward in proportion to overall document scroll, plus a small glowing
 * pulse that rides the tip of the drawn portion.
 *
 * - Server/no-JS output is the full static line (dash offset is only ever
 *   applied at runtime by GSAP), so nothing readable is ever hidden.
 * - Reduced motion: full static line, no pulse, no scrub — the effect exits
 *   before loading GSAP.
 * - `pathLength={1}` normalizes dash space so the draw math is independent of
 *   pixel height; a ResizeObserver on document.body triggers
 *   ScrollTrigger.refresh() (with invalidateOnRefresh) so both the scroll
 *   range and the pulse's pixel track re-measure when the page height changes.
 */
export function CurrentLine() {
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const svg = svgRef.current;
    const line = lineRef.current;
    const pulse = pulseRef.current;
    if (!svg || !line || !pulse) return;

    let cancelled = false;
    let ctx: GsapContextLike | undefined;
    let observer: ResizeObserver | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "max",
            scrub: SCRUB_SMOOTHING,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .fromTo(
            line,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1 },
            0,
          )
          .fromTo(
            pulse,
            { opacity: 0 },
            { opacity: 1, duration: PULSE_FADE_PORTION },
            0,
          )
          .fromTo(
            pulse,
            { attr: { cy: 0 } },
            { attr: { cy: () => svg.clientHeight }, duration: 1 },
            0,
          );
      });

      // Page height changes (content growth, viewport resize) → re-map the
      // scroll range and re-read svg.clientHeight via invalidateOnRefresh.
      observer = new ResizeObserver(() => ScrollTrigger.refresh());
      observer.observe(document.body);
    })();

    return () => {
      cancelled = true;
      observer?.disconnect();
      ctx?.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-10 z-30 hidden w-6 opacity-70 lg:block"
    >
      <svg ref={svgRef} className="h-full w-full overflow-visible">
        <defs>
          {/* userSpaceOnUse: a perfectly vertical line has a zero-width
              bounding box, which makes objectBoundingBox gradients vanish. */}
          <linearGradient
            id={GRADIENT_ID}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2="100%"
          >
            <stop offset="0" style={{ stopColor: "var(--current-1)" }} />
            <stop offset="1" style={{ stopColor: "var(--current-2)" }} />
          </linearGradient>
        </defs>
        <line
          ref={lineRef}
          x1="50%"
          x2="50%"
          y1="0"
          y2="100%"
          pathLength={1}
          stroke={`url(#${GRADIENT_ID})`}
          strokeWidth={LINE_WIDTH}
          strokeLinecap="round"
        />
        {/* Decorative pulse: hidden until GSAP drives it, which also means it
            stays hidden (as intended) under reduced motion and without JS. */}
        <circle
          ref={pulseRef}
          cx="50%"
          cy="0"
          r={PULSE_RADIUS}
          style={{
            fill: "var(--current-2)",
            filter: "drop-shadow(0 0 6px var(--current-1))",
            opacity: 0,
          }}
        />
      </svg>
    </div>
  );
}
