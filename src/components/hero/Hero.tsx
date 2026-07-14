"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import { profile } from "@/content/profile";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE, loadGsap, splitChars } from "@/lib/motion";

const HEADING_ID = "hero-heading";
/** The one word of the role line that carries the redline gradient. */
const GRADIENT_WORD = "Backend";

/* Load choreography (seconds). Everything lands inside 1.7s total. */
const CHAR_STAGGER = 0.02;
const FRAME_AT = 0;
const NAME_AT = 0.15;
const DIM_AT = 0.7;
const ROLE_AT = 0.8;
const HEADLINE_AT = 0.95;
const CTAS_AT = 1.1;
const CUE_AT = 1.3;
const LINE_DURATION = 0.55;
const CHAR_DURATION = 0.7;
const CUE_FADE_DURATION = 0.5;

/* Scroll-cue breathing loop (starts after the intro settles). */
const BREATHE_MIN_SCALE = 0.35;
const BREATHE_DURATION = 1.2;

/** Minimal structural type so we don't need a static gsap import for typing. */
interface GsapContextLike {
  revert(): void;
}

/** Renders the role line, wrapping the gradient word in the token helper. */
function renderRole(role: string) {
  return role.split(" ").map((word, index) => (
    <Fragment key={`${word}-${index}`}>
      {index > 0 ? " " : null}
      {word === GRADIENT_WORD ? (
        <span className="text-current-gradient">{word}</span>
      ) : (
        word
      )}
    </Fragment>
  ));
}

/**
 * Full-viewport cover sheet — the hero composed as the title page of a set
 * of technical drawings: sheet frame, project annotations, the name as the
 * drawing title, and a dimension line measuring it. Server output is fully
 * visible (no CSS hidden states), so content reads with JS disabled. On the
 * client, useLayoutEffect kicks off the shared GSAP loader; nothing is
 * hidden until it resolves, so the painted hero never blanks out during the
 * chunk fetch. Once ready, the lines are hidden (gsap.set) and one timeline
 * plays: frame annotations → split name chars rise → dimension line draws
 * (scaleX) → role → headline → CTAs → scroll cue. splitChars keeps
 * accessibility (aria-label + aria-hidden char spans). Reduced motion: no
 * effect runs and everything is visible immediately.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
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
    const dim = dimRef.current;
    const role = roleRef.current;
    const headline = headlineRef.current;
    const ctas = ctasRef.current;
    const cue = cueRef.current;
    const cueLine = cueLineRef.current;
    if (
      !section ||
      !eyebrow ||
      !name ||
      !dim ||
      !role ||
      !headline ||
      !ctas ||
      !cue
    ) {
      return;
    }

    const lines = [eyebrow, name, dim, role, headline, ctas, cue];
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
        // The dimension line draws in from the left like a plotted stroke.
        gsap.set(dim, { autoAlpha: 0, scaleX: 0, transformOrigin: "left center" });
        // Park the chars below their baseline; the heading wrapper itself
        // stays visible so only the chars rise in.
        gsap.set(chars, { yPercent: 110, autoAlpha: 0 });

        const settle = { autoAlpha: 1, y: 0, duration: LINE_DURATION };

        gsap
          .timeline({ defaults: { ease: EASE } })
          .to(eyebrow, settle, FRAME_AT)
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
          .to(dim, { autoAlpha: 1, scaleX: 1, duration: 0.7 }, DIM_AT)
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
      className="relative flex min-h-svh flex-col justify-center px-4 py-24 sm:px-8 lg:px-16"
    >
      <div className="sheet-frame mx-auto w-full max-w-6xl px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
        <p
          ref={eyebrowRef}
          className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted"
        >
          <span>Project — personal portfolio · cover sheet</span>
          <span>
            {profile.location} — open to full-time roles
          </span>
        </p>

        <h1
          ref={nameRef}
          id={HEADING_ID}
          className="mt-10 font-extrabold uppercase leading-[0.98] tracking-[0.005em] text-bone"
          style={{ fontSize: "var(--text-hero)" }}
        >
          {profile.name}
        </h1>

        <div ref={dimRef} aria-hidden="true" className="mt-6 max-w-xl">
          <span className="dim-line" />
          <span className="mt-2 block font-mono text-[0.625rem] uppercase tracking-[0.25em] text-muted">
            fig. 01 — the developer, measured
          </span>
        </div>

        <p
          ref={roleRef}
          className="mt-8 text-2xl font-semibold uppercase tracking-tight text-bone sm:text-3xl"
        >
          {renderRole(profile.role)}
        </p>

        <p ref={headlineRef} className="mt-4 max-w-xl text-muted">
          {profile.headline}
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
