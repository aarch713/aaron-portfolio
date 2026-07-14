"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import { profile } from "@/content/profile";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { loadGsap, splitChars } from "@/lib/motion";

const HEADING_ID = "hero-heading";
/** The one word of the role line that gets the golden marker highlight. */
const MARKER_WORD = "Frontend";

/* Springy ease for the pop-in choreography (V5 only — the shared EASE
 * constant stays expo for scroll reveals). */
const POP_EASE = "back.out(1.5)";

/* Load choreography (seconds). Everything lands inside 1.6s total. */
const CHAR_STAGGER = 0.022;
const EYEBROW_AT = 0;
const NAME_AT = 0.1;
const ROLE_AT = 0.6;
const HEADLINE_AT = 0.75;
const CTAS_AT = 0.9;
const CUE_AT = 1.1;
const LINE_DURATION = 0.55;
const CHAR_DURATION = 0.6;
const CUE_FADE_DURATION = 0.5;

/* Scroll-cue breathing loop (starts after the intro settles). */
const BREATHE_MIN_SCALE = 0.35;
const BREATHE_DURATION = 1.2;

/** Minimal structural type so we don't need a static gsap import for typing. */
interface GsapContextLike {
  revert(): void;
}

/** Renders the role line, wrapping the marker word in a golden highlight. */
function renderRole(role: string) {
  return role.split(" ").map((word, index) => (
    <Fragment key={`${word}-${index}`}>
      {index > 0 ? " " : null}
      {word === MARKER_WORD ? (
        <span
          className="inline-block -rotate-1 rounded-lg px-2"
          style={{ background: "var(--golden)" }}
        >
          {word}
        </span>
      ) : (
        word
      )}
    </Fragment>
  ));
}

/**
 * Full-viewport golden-hour intro. Server output is fully visible (no CSS
 * hidden states), so content reads with JS disabled. On the client,
 * useLayoutEffect kicks off the shared GSAP loader; nothing is hidden until
 * it resolves, so the painted hero never blanks out during the chunk fetch.
 * Once ready, the lines are hidden (gsap.set) and a single timeline plays
 * eyebrow → name chars springing up (back.out) → role → headline → CTAs →
 * scroll cue, all in the same tick. splitChars keeps accessibility
 * (aria-label + aria-hidden char spans). Reduced motion: no effect runs and
 * everything is visible immediately.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const cueLineRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const name = nameRef.current;
    const role = roleRef.current;
    const headline = headlineRef.current;
    const ctas = ctasRef.current;
    const cue = cueRef.current;
    const cueLine = cueLineRef.current;
    if (!section || !eyebrow || !name || !role || !headline || !ctas || !cue) {
      return;
    }

    const lines = [eyebrow, name, role, headline, ctas, cue];
    const originalName = name.textContent ?? "";
    let isSplit = false;

    // Safety net for the load-failure and unmount paths: clear any inline
    // styles and un-split the name so content is never left hidden.
    const restore = () => {
      lines.forEach((el) => {
        el.style.opacity = "";
        el.style.visibility = "";
        el.style.transform = "";
      });
      if (isSplit) {
        name.textContent = originalName;
        name.removeAttribute("aria-label");
        isSplit = false;
      }
    };

    let cancelled = false;
    let ctx: GsapContextLike | undefined;

    // Nothing is hidden until GSAP has actually loaded — the server-rendered
    // hero stays visible for the whole async chunk fetch. Once loaded, hide
    // and animate in the same tick.
    (async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;

      ctx = gsap.context(() => {
        const chars = splitChars(name);
        isSplit = true;

        gsap.set([eyebrow, role, headline], { autoAlpha: 0, y: 18 });
        // CTAs animate with opacity only (no visibility toggle) so the links
        // stay keyboard-focusable during the intro.
        gsap.set(ctas, { opacity: 0, y: 18 });
        gsap.set(cue, { autoAlpha: 0 });
        // Park the chars below their baseline; the heading wrapper itself
        // stays visible so only the chars spring in.
        gsap.set(chars, { yPercent: 110, autoAlpha: 0 });

        const settle = { autoAlpha: 1, y: 0, duration: LINE_DURATION };

        gsap
          .timeline({ defaults: { ease: POP_EASE } })
          .to(eyebrow, settle, EYEBROW_AT)
          .to(
            chars,
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: CHAR_DURATION,
              stagger: CHAR_STAGGER,
            },
            NAME_AT,
          )
          .to(role, settle, ROLE_AT)
          .to(headline, settle, HEADLINE_AT)
          .to(ctas, { opacity: 1, y: 0, duration: LINE_DURATION }, CTAS_AT)
          .to(cue, { autoAlpha: 1, duration: CUE_FADE_DURATION }, CUE_AT);

        if (cueLine) {
          gsap.to(cueLine, {
            scaleY: BREATHE_MIN_SCALE,
            transformOrigin: "top center",
            duration: BREATHE_DURATION,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        }
      }, section);
    })().catch(restore);

    return () => {
      cancelled = true;
      ctx?.revert();
      restore();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby={HEADING_ID}
      className="relative flex min-h-svh flex-col justify-center px-6 py-24 sm:px-10 lg:px-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p
          ref={eyebrowRef}
          className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.25em] text-muted"
        >
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{
              background: "var(--golden)",
              boxShadow: "0 0 0 3px rgba(255, 197, 50, 0.35)",
            }}
          />
          {profile.location} — Open to full-time roles
        </p>

        <h1
          ref={nameRef}
          id={HEADING_ID}
          className="font-display mt-7 font-extrabold leading-[0.98] tracking-tight text-bone"
          style={{ fontSize: "var(--text-hero)" }}
        >
          {profile.name}
        </h1>

        <p
          ref={roleRef}
          className="font-display mt-7 text-2xl font-bold tracking-tight text-bone sm:text-3xl"
        >
          {renderRole(profile.role)}
        </p>

        <p ref={headlineRef} className="mt-4 max-w-xl text-muted">
          {profile.headline} — and feel a little joyful while it converts.
        </p>

        <div ref={ctasRef} className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton href={profile.resumePdf} download>
            Download resume
          </MagneticButton>
          <MagneticButton href="#projects" variant="ghost">
            See the work
          </MagneticButton>
        </div>
      </div>

      {/* Decorative scroll cue — hidden from AT, breathes via scaleY loop. */}
      <div
        ref={cueRef}
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-muted">
          scroll
        </span>
        <span
          ref={cueLineRef}
          className="block h-12 w-px origin-top"
          style={{
            background: "linear-gradient(to bottom, var(--muted), transparent)",
          }}
        />
      </div>
    </section>
  );
}
