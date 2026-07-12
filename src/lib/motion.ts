/**
 * Motion constants, the shared GSAP loader, and pure DOM utilities.
 * No React in this file.
 */

export const EASE = "expo.out";

export interface GsapBundle {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
}

let gsapBundlePromise: Promise<GsapBundle> | undefined;

/**
 * Loads gsap + ScrollTrigger exactly once per page. The Promise.all of the
 * two dynamic imports starts on the first call and is cached at module scope,
 * so every consumer (Hero, Reveal, MetricCounter, ExperienceTimeline,
 * CurrentLine, SmoothScroll) shares a single chunk request. ScrollTrigger is
 * registered here, once — callers must not register it again.
 *
 * IMPORTANT for consumers: never hide server-rendered content before this
 * promise resolves. Apply hidden states (gsap.set) and build the animation in
 * the same tick after awaiting, so the painted page stays visible for the
 * whole chunk fetch on slow networks.
 */
export function loadGsap(): Promise<GsapBundle> {
  if (!gsapBundlePromise) {
    gsapBundlePromise = Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    });
    // A failed load (offline, blocked chunk) must not poison every later
    // call with a permanently rejected promise — drop the cache so the next
    // consumer can retry. Callers still see the rejection via their .catch.
    gsapBundlePromise.catch(() => {
      gsapBundlePromise = undefined;
    });
  }
  return gsapBundlePromise;
}

const NBSP = "\u00A0";

/**
 * Wraps each character of `el`'s text content in an inline-block span so the
 * characters can be animated individually (e.g. staggered reveals).
 *
 * Accessibility: the original text stays available to assistive tech — the
 * element receives an `aria-label` with the full original text, and the span
 * layer holding the per-character spans is marked `aria-hidden="true"`.
 * Spaces are preserved as non-breaking spaces so they keep their width as
 * inline-block spans.
 *
 * Returns the per-character spans, in document order, for animation.
 */
export function splitChars(el: HTMLElement): HTMLSpanElement[] {
  const originalText = el.textContent ?? "";

  el.setAttribute("aria-label", originalText);
  el.textContent = "";

  const layer = document.createElement("span");
  layer.setAttribute("aria-hidden", "true");

  const chars = Array.from(originalText).map((char) => {
    const span = document.createElement("span");
    span.style.display = "inline-block";
    span.textContent = char === " " ? NBSP : char;
    layer.appendChild(span);
    return span;
  });

  el.appendChild(layer);
  return chars;
}

/** Alias kept in sync with the plan's original name for this helper. */
export const staggerChars = splitChars;
