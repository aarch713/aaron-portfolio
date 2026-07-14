"use client";

import { useLayoutEffect, useRef } from "react";
import type { Metric } from "@/content/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE, loadGsap } from "@/lib/motion";

const COUNT_DURATION = 1.4;
const COUNT_START = "top 85%";
/** Count-up step for non-integer targets (e.g. 99.9) so the tween lands exactly. */
const DECIMAL_SNAP = 0.1;
const FIGURE_SIZE = "clamp(2rem, 1.5rem + 1.6vw, 3.1rem)";

interface MetricCounterProps {
  metric: Metric;
  className?: string;
}

/** Minimal structural type so we don't need a static gsap import for typing. */
interface GsapContextLike {
  revert(): void;
}

/** 2600 → "2,600"; 99.9 → "99.9" (never rounded up to "100"). */
function formatMetricValue(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

/**
 * Oversized mono metric that counts from 0 to its value the first time it
 * scrolls into view.
 *
 * Server-rendered output is the final value (readable with JS disabled and
 * under reduced motion — the effect exits before loading GSAP). On the
 * client, the final value stays visible until the shared GSAP chunk has
 * loaded; only then is the figure zeroed and its ScrollTrigger-gated tween
 * created (same tick), counting up in whole-number steps — or 0.1 steps for
 * decimal targets like 99.9 so the tween lands exactly on the final value.
 * The animated figure is aria-hidden; a visually-hidden span always carries
 * the final value so assistive tech never hears intermediate numbers.
 */
export function MetricCounter({ metric, className }: MetricCounterProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const rootEl = rootRef.current;
    const valueEl = valueRef.current;
    if (!rootEl || !valueEl || prefersReducedMotion) return;

    const finalText = formatMetricValue(metric.value);

    // Safety net for the load-failure and unmount paths: guarantees the
    // metric is never left at 0.
    const restoreFinalValue = () => {
      valueEl.textContent = finalText;
    };

    let cancelled = false;
    let ctx: GsapContextLike | undefined;

    // The server-rendered final value stays visible until GSAP has actually
    // loaded; only then zero the figure + create the tween, in the same tick.
    (async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;

      ctx = gsap.context(() => {
        valueEl.textContent = formatMetricValue(0);

        const counter = { value: 0 };
        gsap.to(counter, {
          value: metric.value,
          duration: COUNT_DURATION,
          ease: EASE,
          snap: {
            value: Number.isInteger(metric.value) ? 1 : DECIMAL_SNAP,
          },
          scrollTrigger: {
            trigger: rootEl,
            start: COUNT_START,
            once: true,
          },
          onUpdate: () => {
            valueEl.textContent = formatMetricValue(counter.value);
          },
        });
      }, rootEl);
    })().catch(restoreFinalValue);

    return () => {
      cancelled = true;
      ctx?.revert();
      restoreFinalValue();
    };
  }, [prefersReducedMotion, metric.value]);

  const finalText = formatMetricValue(metric.value);
  const accessibleFigure = `${metric.prefix ?? ""}${finalText}${metric.suffix}`;

  return (
    <div ref={rootRef} className={className}>
      <p
        className="font-semibold leading-none tracking-tight"
        style={{ fontSize: FIGURE_SIZE }}
      >
        <span className="sr-only">{accessibleFigure}</span>
        <span aria-hidden="true" className="text-current-gradient whitespace-nowrap">
          {metric.prefix}
          <span ref={valueRef}>{finalText}</span>
          {metric.suffix}
        </span>
      </p>
      {/* Dimension callout: the metric read like a measured span. */}
      <span aria-hidden="true" className="dim-line mt-4 max-w-36" />
      <p className="mt-3 font-mono text-xs uppercase tracking-[0.08em] text-muted">
        {metric.label}
      </p>
    </div>
  );
}
