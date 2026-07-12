/**
 * Motion constants and pure DOM utilities. No React in this file.
 */

export const EASE = "expo.out";

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
