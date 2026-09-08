"use client";

import {
  useEffect,
  useRef,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE } from "@/lib/motion";

const MAGNET_MAX_PX = 8;
const MAGNET_DURATION = 0.35;
const COARSE_POINTER_QUERY = "(pointer: coarse)";

interface MagneticButtonProps {
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  children: ReactNode;
  variant?: "solid" | "ghost";
  download?: boolean;
  external?: boolean;
  className?: string;
}

/* Min touch target 44px = min-h-11. Focus ring comes from the global
 * :focus-visible outline — never suppressed here. */
const BASE_CLASSES =
  "group relative inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 border px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] select-none transition-colors duration-(--dur)";

const VARIANT_CLASSES: Record<"solid" | "ghost", string> = {
  solid: "border-current-2 text-on-current-2 group-hover:text-on-signal",
  ghost:
    "border-line text-bone hover:border-signal hover:bg-signal hover:text-on-signal focus-visible:border-signal",
};

/**
 * CTA with a magnetic hover pull (translate toward the cursor, max 8px, GPU
 * transform only via gsap.quickTo). The effect is skipped entirely when the
 * user prefers reduced motion or the pointer is coarse (touch). Renders an
 * anchor when `href` is given, otherwise a button.
 */
export function MagneticButton({
  href,
  onClick,
  children,
  variant = "solid",
  download,
  external,
  className,
}: MagneticButtonProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = elementRef.current;
    if (!el || prefersReducedMotion) return;
    if (window.matchMedia(COARSE_POINTER_QUERY).matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      const xTo = gsap.quickTo(el, "x", { duration: MAGNET_DURATION, ease: EASE });
      const yTo = gsap.quickTo(el, "y", { duration: MAGNET_DURATION, ease: EASE });
      const clampPull = gsap.utils.clamp(-MAGNET_MAX_PX, MAGNET_MAX_PX);

      const onPointerMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = event.clientX - (rect.left + rect.width / 2);
        const relY = event.clientY - (rect.top + rect.height / 2);
        xTo(clampPull((relX / (rect.width / 2)) * MAGNET_MAX_PX));
        yTo(clampPull((relY / (rect.height / 2)) * MAGNET_MAX_PX));
      };
      const onPointerLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerleave", onPointerLeave);

      cleanup = () => {
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerleave", onPointerLeave);
        gsap.killTweensOf(el);
        gsap.set(el, { clearProps: "transform" });
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
      cleanup = undefined;
    };
  }, [prefersReducedMotion]);

  const classes = [BASE_CLASSES, VARIANT_CLASSES[variant], className]
    .filter(Boolean)
    .join(" ");

  /* Solid variant paints its own layers in DOM order: gradient glow ring
   * (overhangs by 3px, fades in on hover/focus), bone fill, then content —
   * so the ring only ever shows as a rim around the pill. */
  const content = (
    <>
      {variant === "solid" ? (
        <>
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-current-2 transition-colors duration-(--dur) group-hover:bg-signal"
          />
        </>
      ) : null}
      <span className="relative inline-flex items-center gap-2">
        {children}
      </span>
    </>
  );

  const setRef = (node: HTMLElement | null) => {
    elementRef.current = node;
  };

  if (href) {
    return (
      <a
        ref={setRef}
        href={href}
        onClick={onClick}
        download={download ? true : undefined}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <button ref={setRef} type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
