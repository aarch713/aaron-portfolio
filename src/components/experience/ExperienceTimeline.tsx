"use client";

import { useLayoutEffect, useRef } from "react";
import { jobs } from "@/content/experience";
import type { Job } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE } from "@/lib/motion";

const HEADING_ID = "experience-heading";
/** Bullets shown before the "+ N more" disclosure. */
const VISIBLE_BULLET_COUNT = 3;
const BULLET_STAGGER_S = 0.12;
const BULLET_DELAY_CAP_S = 0.3;
const BULLET_REVEAL_Y = 20;
const NODE_FILL_DURATION_S = 0.6;
const NODE_FILL_START = "top 80%";

/** Minimal structural type so we don't need a static gsap import for typing. */
interface GsapContextLike {
  revert(): void;
}

function bulletDelay(index: number): number {
  return Math.min(index * BULLET_STAGGER_S, BULLET_DELAY_CAP_S);
}

/**
 * Spine node for one job. The gradient fill is rendered fully visible in the
 * server output (no-JS / reduced-motion fallback = every node lit); the
 * timeline effect hides it before first paint and lights it back up with a
 * once-only ScrollTrigger tween as the job enters the viewport.
 */
function TimelineNode() {
  return (
    <span
      aria-hidden="true"
      className="absolute left-0 top-2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-line bg-ink"
    >
      <span
        data-node-fill
        className="absolute inset-[3px] rounded-full"
        style={{
          background:
            "linear-gradient(135deg, var(--current-1), var(--current-2))",
          boxShadow: "0 0 12px var(--current-1)",
        }}
      />
    </span>
  );
}

/** Shared bullet body: hairline tick marker + achievement text. */
function BulletBody({ text }: { text: string }) {
  return (
    <span className="relative block pl-5 text-sm leading-relaxed text-muted">
      <span
        aria-hidden="true"
        className="absolute left-0 top-[0.72em] h-px w-2.5 bg-line"
      />
      {text}
    </span>
  );
}

function JobEntry({ job }: { job: Job }) {
  const visibleBullets = job.bullets.slice(0, VISIBLE_BULLET_COUNT);
  const hiddenBullets = job.bullets.slice(VISIBLE_BULLET_COUNT);

  return (
    <li
      data-timeline-item
      className="relative pb-20 pl-8 last:pb-0 sm:pl-12"
    >
      <TimelineNode />

      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {job.start} – {job.end} · {job.location}
        </p>
        <h3 className="mt-3 text-2xl font-medium leading-snug text-bone">
          {job.company}
          {job.brand ? <span className="text-muted"> · {job.brand}</span> : null}
        </h3>
        <p className="text-current-gradient mt-1 w-fit font-mono text-sm">
          {job.title}
        </p>
      </Reveal>

      <ul className="mt-6 max-w-2xl space-y-3">
        {visibleBullets.map((bullet, index) => (
          <li key={bullet}>
            <Reveal delay={bulletDelay(index)} y={BULLET_REVEAL_Y}>
              <BulletBody text={bullet} />
            </Reveal>
          </li>
        ))}
      </ul>

      {hiddenBullets.length > 0 && (
        <details className="group mt-4 max-w-2xl">
          <summary className="w-fit cursor-pointer list-none font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-bone [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">
              + {hiddenBullets.length} more
            </span>
            <span className="hidden group-open:inline">– show less</span>
          </summary>
          <ul className="mt-4 space-y-3">
            {hiddenBullets.map((bullet) => (
              <li key={bullet}>
                <BulletBody text={bullet} />
              </li>
            ))}
          </ul>
        </details>
      )}
    </li>
  );
}

/**
 * Vertical experience timeline rendered from `content/experience.ts`.
 *
 * Left spine is a 1px `--line` rule; each job's node fills with the current
 * gradient (transform/opacity only, once) as it scrolls into view. Server
 * output ships every node lit and all content visible — the effect hides the
 * fills pre-paint on the client only when motion is allowed, mirroring the
 * Reveal primitive's no-JS / reduced-motion guarantees.
 */
export function ExperienceTimeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion) return;

    const fills = Array.from(
      list.querySelectorAll<HTMLElement>("[data-node-fill]"),
    );
    if (fills.length === 0) return;

    // Hide synchronously before paint. GSAP is loaded async; if it fails,
    // restoreVisibility() guarantees no node is left unlit.
    for (const fill of fills) {
      fill.style.opacity = "0";
      fill.style.visibility = "hidden";
      fill.style.transform = "scale(0.4)";
    }

    const restoreVisibility = () => {
      for (const fill of fills) {
        fill.style.opacity = "";
        fill.style.visibility = "";
        fill.style.transform = "";
      }
    };

    let cancelled = false;
    let ctx: GsapContextLike | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        for (const fill of fills) {
          gsap.fromTo(
            fill,
            { autoAlpha: 0, scale: 0.4 },
            {
              autoAlpha: 1,
              scale: 1,
              duration: NODE_FILL_DURATION_S,
              ease: EASE,
              scrollTrigger: {
                trigger: fill.closest("[data-timeline-item]") ?? fill,
                start: NODE_FILL_START,
                once: true,
              },
            },
          );
        }
      }, list);
    })().catch(restoreVisibility);

    return () => {
      cancelled = true;
      ctx?.revert();
      restoreVisibility();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="experience"
      aria-labelledby={HEADING_ID}
      style={{ paddingBlock: "var(--space-section)" }}
    >
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-10 lg:px-16">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've shipped"
          id={HEADING_ID}
        />
        <ol ref={listRef} className="relative mt-16 border-l border-line">
          {jobs.map((job) => (
            <JobEntry key={`${job.company}-${job.start}`} job={job} />
          ))}
        </ol>
      </div>
    </section>
  );
}
