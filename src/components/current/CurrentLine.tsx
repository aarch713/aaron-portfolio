"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { loadGsap } from "@/lib/motion";

/** Scrub smoothing (seconds) for the scroll-linked draw. */
const SCRUB_SMOOTHING = 0.6;
/** Fraction of total scroll over which the pulse fades in at the top. */
const PULSE_FADE_PORTION = 0.03;
const PULSE_RADIUS = 3;
const LINE_WIDTH = 2;
/** Static id is safe: CurrentLine is mounted exactly once (in the layout). */
const GRADIENT_ID = "current-line-gradient";
/** Must match the wrapper's `hidden lg:block` (Tailwind lg = 1024px). */
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
/** Trailing debounce for body-resize → ScrollTrigger.refresh(). */
const REFRESH_DEBOUNCE_MS = 200;

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
 * - Below lg (1024px) the rail is display:none, so the effect is gated on a
 *   matchMedia check: no timeline or observer runs on mobile, and the setup
 *   attaches/tears down live as the viewport crosses the breakpoint.
 * - `pathLength={1}` normalizes dash space so the draw math is independent of
 *   pixel height; a ResizeObserver on document.body triggers a debounced
 *   ScrollTrigger.refresh() (with invalidateOnRefresh) — skipped when the
 *   body height hasn't actually changed — so both the scroll range and the
 *   pulse's pixel track re-measure when the page height changes.
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

    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    let cancelled = false;
    let ctx: GsapContextLike | undefined;
    let observer: ResizeObserver | undefined;
    let refreshTimeout: number | undefined;

    const teardown = () => {
      if (refreshTimeout !== undefined) {
        window.clearTimeout(refreshTimeout);
        refreshTimeout = undefined;
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
        // Debounced: a full ScrollTrigger.refresh() is expensive (it also
        // re-measures the pinned projects rail), so never run it per layout
        // frame — and skip entirely when the body height hasn't changed.
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

    // The rail is display:none below lg — don't run the timeline or observer
    // there. Attach/detach live as the viewport crosses the breakpoint.
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
