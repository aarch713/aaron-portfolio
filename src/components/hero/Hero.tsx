"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import { profile } from "@/content/profile";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { loadGsap, splitChars } from "@/lib/motion";

const HEADING_ID = "hero-heading";
/** The one word of the role line that receives the editorial accent block. */
const MARKER_WORD = "Frontend";

/* Springy ease for the opening type choreography. */
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

/** Renders the role line, wrapping the marker word in the accent block. */
function renderRole(role: string) {
  return role.split(" ").map((word, index) => (
    <Fragment key={`${word}-${index}`}>
      {index > 0 ? " " : null}
      {word === MARKER_WORD ? (
        <span
          className="inline-block bg-teal px-2 text-on-teal"
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
 * Full-viewport editorial intro. Server output is fully visible (no CSS
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
      className="relative flex min-h-dvh flex-col justify-center border-b border-line px-4 pb-16 pt-28 sm:px-8 lg:px-12 lg:pb-10"
    >
      <div className="mx-auto grid w-full max-w-[96rem] gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:gap-16">
        <div>
          <p
            ref={eyebrowRef}
            className="editorial-kicker text-current-2-text"
          >
            {profile.location} / Available for roles
          </p>

          <h1
            ref={nameRef}
            id={HEADING_ID}
            className="font-display mt-9 max-w-[8ch] font-extrabold leading-[0.76] tracking-[-0.065em] text-bone"
            style={{ fontSize: "var(--text-hero)" }}
          >
            {profile.name}
          </h1>

          <p
            ref={roleRef}
            className="font-display mt-10 text-2xl font-bold tracking-tight text-bone sm:text-4xl"
          >
            {renderRole(profile.role)}
          </p>

          <p
            ref={headlineRef}
            className="mt-5 max-w-2xl text-lg leading-relaxed text-muted"
          >
            {profile.headline}. Fast systems, thoughtful interactions, and
            digital commerce built to earn attention.
          </p>
        </div>

        <aside className="border border-line bg-surface" aria-label="Portfolio summary">
          <p className="border-b border-line bg-current-2 px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-on-current-2">
            Field notes / 2026
          </p>
          <dl className="grid grid-cols-2 font-mono text-xs lg:grid-cols-1">
            <div className="border-b border-r border-line p-5 lg:border-r-0">
              <dt className="uppercase tracking-[0.16em] text-muted">Focus</dt>
              <dd className="mt-2 text-bone">Commerce + AI</dd>
            </div>
            <div className="border-b border-line p-5">
              <dt className="uppercase tracking-[0.16em] text-muted">Stack</dt>
              <dd className="mt-2 text-bone">React / Next.js</dd>
            </div>
          </dl>
          <div ref={ctasRef} className="grid gap-px bg-line p-px">
            <MagneticButton href="#projects">Explore selected work</MagneticButton>
            <MagneticButton href={profile.resumePdf} download variant="ghost">
              Download resume
            </MagneticButton>
          </div>
        </aside>
      </div>

      {/* Decorative scroll cue — hidden from AT, breathes via scaleY loop. */}
      <div
        ref={cueRef}
        aria-hidden="true"
        className="absolute bottom-5 right-12 hidden items-center gap-3 lg:flex"
      >
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-muted">
          scroll
        </span>
        <span
          ref={cueLineRef}
          className="block h-px w-16 origin-left"
          style={{
            background: "linear-gradient(to right, var(--muted), transparent)",
          }}
        />
      </div>
    </section>
  );
}
