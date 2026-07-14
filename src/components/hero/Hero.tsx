"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import { profile } from "@/content/profile";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE, loadGsap, splitChars } from "@/lib/motion";

const HEADING_ID = "hero-heading";
/** The one word of the role line that carries the phosphor gradient. */
const GRADIENT_WORD = "Software";

/* Load choreography (seconds). Everything lands inside ~1.7s total. */
const TYPE_STAGGER = 0.045;
const EYEBROW_AT = 0;
const NAME_AT = 0.35;
const ROLE_AT = 1.0;
const HEADLINE_AT = 1.15;
const CTAS_AT = 1.3;
const CUE_AT = 1.5;
const LINE_DURATION = 0.55;
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
 * Full-viewport terminal intro. Server output is fully visible (no CSS hidden
 * states), so content reads with JS disabled. On the client, useLayoutEffect
 * kicks off the shared GSAP loader; nothing is hidden until it resolves, so
 * the painted hero never blanks out during the chunk fetch. Once ready, the
 * lines are hidden (gsap.set) and a single timeline plays: the prompt line
 * lands, then the name TYPES in — characters appear stepped, no easing, like
 * terminal output (the blinking caret is an h1 ::after, out of splitChars'
 * reach) — then role → headline → CTAs → scroll cue. splitChars keeps
 * accessibility (aria-label + aria-hidden char spans). Reduced motion: no
 * effect runs, everything is visible, the caret holds steady via CSS.
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

        gsap.set([eyebrow, role, headline], { autoAlpha: 0, y: 12 });
        // CTAs animate with opacity only (no visibility toggle) so the links
        // stay keyboard-focusable during the intro.
        gsap.set(ctas, { opacity: 0, y: 12 });
        gsap.set(cue, { autoAlpha: 0 });
        // Terminal output: characters simply appear in sequence — no rise,
        // no fade curve. Stepped visibility only.
        gsap.set(chars, { autoAlpha: 0 });

        const settle = { autoAlpha: 1, y: 0, duration: LINE_DURATION };

        gsap
          .timeline({ defaults: { ease: EASE } })
          .to(eyebrow, settle, EYEBROW_AT)
          .to(
            chars,
            {
              autoAlpha: 1,
              duration: 0.01,
              ease: "none",
              stagger: TYPE_STAGGER,
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
      <div className="mx-auto w-full max-w-5xl">
        <p ref={eyebrowRef} className="font-mono text-sm text-muted">
          <span className="prompt" aria-hidden="true" />
          <span className="text-bone">whoami</span>
          <span className="ml-4 hidden sm:inline">
            # {profile.location} — open to full-time roles
          </span>
        </p>

        <h1
          ref={nameRef}
          id={HEADING_ID}
          className="caret-after font-mono mt-8 font-bold uppercase leading-[1.02] tracking-tight text-bone"
          style={{ fontSize: "var(--text-hero)" }}
        >
          {profile.name}
        </h1>

        <p
          ref={roleRef}
          className="font-mono mt-6 text-xl font-medium tracking-tight text-bone sm:text-2xl"
        >
          <span aria-hidden="true" className="text-current-1">
            &gt;{" "}
          </span>
          {renderRole(profile.role)}
        </p>

        <p ref={headlineRef} className="mt-4 max-w-xl text-muted">
          {profile.headline} — gateways, ledgers, and pipelines that stay up.
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
        className="absolute bottom-14 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
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
