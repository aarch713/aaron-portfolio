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
  "group relative inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium tracking-tight select-none transition-colors duration-(--dur)";

const VARIANT_CLASSES: Record<"solid" | "ghost", string> = {
  solid: "text-ink",
  ghost:
    "border border-line text-bone hover:border-(--current-1) focus-visible:border-(--current-1)",
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
            className="absolute -inset-[3px] rounded-full opacity-0 blur-[3px] transition-opacity duration-(--dur) group-hover:opacity-70 group-focus-visible:opacity-70"
            style={{
              background:
                "linear-gradient(100deg, var(--current-1), var(--current-2))",
            }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-bone"
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
