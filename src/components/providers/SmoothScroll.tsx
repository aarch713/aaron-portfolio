"use client";

import { useEffect, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { loadGsap } from "@/lib/motion";

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
      // loadGsap() shares one gsap+ScrollTrigger chunk request with every
      // animation component, kicked off as early as this effect runs.
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"),
        loadGsap(),
      ]);
      if (cancelled) return;

      // CSS `scroll-behavior: smooth` fights Lenis on programmatic scrolls;
      // neutralize it only while Lenis is active, restore on teardown.
      const rootStyle = document.documentElement.style;
      const previousScrollBehavior = rootStyle.scrollBehavior;
      rootStyle.scrollBehavior = "auto";

      // `anchors: true` lets Lenis own in-page anchor navigation — without
      // it, a native anchor jump gets reverted by the next ticker frame
      // while a smooth scroll is still settling.
      const lenis = new Lenis({ lerp: LENIS_LERP, anchors: true });
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
