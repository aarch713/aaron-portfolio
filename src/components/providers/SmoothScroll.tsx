"use client";

import { useEffect, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LENIS_LERP = 0.1;

interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * Client provider that enables Lenis smooth scrolling wired into GSAP's
 * ScrollTrigger. When the user prefers reduced motion, it does nothing and
 * native scrolling is left untouched. Lenis and GSAP are dynamically imported
 * so they never enter the server bundle or the initial client chunk.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      // CSS `scroll-behavior: smooth` fights Lenis on programmatic scrolls;
      // neutralize it only while Lenis is active, restore on teardown.
      const rootStyle = document.documentElement.style;
      const previousScrollBehavior = rootStyle.scrollBehavior;
      rootStyle.scrollBehavior = "auto";

      const lenis = new Lenis({ lerp: LENIS_LERP });
      lenis.on("scroll", () => ScrollTrigger.update());

      const onTick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);

      teardown = () => {
        gsap.ticker.remove(onTick);
        lenis.destroy();
        rootStyle.scrollBehavior = previousScrollBehavior;
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
      teardown = undefined;
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
