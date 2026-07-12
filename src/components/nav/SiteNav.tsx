"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Fraction of viewport height scrolled before the bar reveals. */
const REVEAL_VIEWPORT_FRACTION = 0.8;
/** Reduced motion: reveal after any real scroll instead of a viewport ratio. */
const REDUCED_MOTION_THRESHOLD_PX = 200;

const ANCHOR_LINKS = [
  { label: "Work", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("");
}

/**
 * Fixed top bar. Server output is fully visible (no-JS fallback); on the
 * client a passive scroll listener hides it until the page is scrolled past
 * ~80vh (200px under reduced motion), toggling only transform + opacity.
 * `focus-within` overrides keep it usable the moment anything inside it —
 * including the skip link — receives keyboard focus.
 */
export function SiteNav() {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const threshold = prefersReducedMotion
        ? REDUCED_MOTION_THRESHOLD_PX
        : window.innerHeight * REVEAL_VIEWPORT_FRACTION;
      setIsVisible(window.scrollY > threshold);
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  const stateClasses = isVisible
    ? "translate-y-0 opacity-100"
    : "pointer-events-none -translate-y-4 opacity-0";

  return (
    <nav
      aria-label="Primary"
      className={`fixed inset-x-0 top-0 z-40 border-b border-line bg-ink/80 backdrop-blur transition-[transform,opacity] duration-(--dur) ease-(--ease-out-expo) motion-reduce:transition-none focus-within:pointer-events-auto focus-within:translate-y-0 focus-within:opacity-100 ${stateClasses}`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-ink"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-20">
        <a
          href="#"
          className="font-mono text-sm tracking-tight text-bone transition-colors duration-(--dur) hover:text-muted"
        >
          {initialsOf(profile.name)}
          <span className="hidden sm:inline"> — {profile.name}</span>
        </a>

        <div className="flex items-center gap-8">
          <ul className="hidden items-center gap-8 md:flex">
            {ANCHOR_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-mono text-sm text-muted transition-colors duration-(--dur) hover:text-bone"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={profile.resumePdf}
            download
            className="inline-flex min-h-9 items-center rounded-full bg-bone px-4 font-mono text-xs font-medium tracking-tight text-ink transition-opacity duration-(--dur) hover:opacity-85"
          >
            Resume
          </a>
        </div>
      </div>
    </nav>
  );
}
