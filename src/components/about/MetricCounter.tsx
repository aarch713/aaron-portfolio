"use client";

import { useLayoutEffect, useRef } from "react";
import type { Metric } from "@/content/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE } from "@/lib/motion";

const COUNT_DURATION = 1.4;
const COUNT_START = "top 85%";
const COMMA_THRESHOLD = 1000;
const FIGURE_SIZE = "clamp(2.5rem, 2rem + 2vw, 4rem)";

interface MetricCounterProps {
  metric: Metric;
  className?: string;
}

/** Minimal structural type so we don't need a static gsap import for typing. */
interface GsapContextLike {
  revert(): void;
}

/** 2600 → "2,600"; values below 1000 render as plain digits. */
function formatMetricValue(value: number): string {
  const rounded = Math.round(value);
  return rounded >= COMMA_THRESHOLD
    ? rounded.toLocaleString("en-US")
    : String(rounded);
}

/**
 * Oversized mono metric that counts from 0 to its value the first time it
 * scrolls into view.
 *
 * Server-rendered output is the final value (readable with JS disabled and
 * under reduced motion — the effect exits before loading GSAP). On the
 * client, useLayoutEffect zeroes the number before first paint, then a
 * ScrollTrigger-gated tween counts up in whole-number steps. The animated
 * figure is aria-hidden; a visually-hidden span always carries the final
 * value so assistive tech never hears intermediate numbers.
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

    // Zero synchronously before paint. GSAP loads async; if it fails,
    // restoreFinalValue() guarantees the metric is never left at 0.
    valueEl.textContent = formatMetricValue(0);

    const restoreFinalValue = () => {
      valueEl.textContent = finalText;
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
        const counter = { value: 0 };
        gsap.to(counter, {
          value: metric.value,
          duration: COUNT_DURATION,
          ease: EASE,
          snap: { value: 1 },
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
        className="font-mono font-medium leading-none tracking-tight"
        style={{ fontSize: FIGURE_SIZE }}
      >
        <span className="sr-only">{accessibleFigure}</span>
        <span aria-hidden="true" className="text-current-gradient">
          {metric.prefix}
          <span ref={valueRef}>{finalText}</span>
          {metric.suffix}
        </span>
      </p>
      <p className="mt-3 text-sm text-muted">{metric.label}</p>
    </div>
  );
}
