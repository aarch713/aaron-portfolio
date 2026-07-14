"use client";

import { useEffect, useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";

/**
 * The rail (pin + horizontal scrub) only runs on desktop without a reduced-
 * motion preference. The SAME condition drives the CSS layout below via
 * Tailwind's `motion-safe:lg:` variants, so GSAP always measures the layout
 * it is about to animate.
 */
const RAIL_MEDIA = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const SCRUB_SMOOTHING = 1;

/** Minimal structural type so we don't need a static gsap import for typing. */
interface GsapMatchMediaLike {
  revert(): void;
}

/**
 * Projects section. Above lg without reduced motion: the section pins and the
 * row of cards scrubs horizontally with scroll. Everywhere else (mobile,
 * reduced motion, no JS): a plain vertical stack — the horizontal layout and
 * its native-scroll fallback are pure CSS, so nothing depends on JS to be
 * readable.
 *
 * Receives trimmed card data from the server page instead of importing the
 * content layer, keeping case-study copy out of the client bundle.
 */
export function ProjectsRail({ items }: { items: ProjectCardData[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!section || !wrapper || !track) return;

    let cancelled = false;
    let mm: GsapMatchMediaLike | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      // gsap.matchMedia() IS a gsap.context — revert() tears down every tween,
      // ScrollTrigger, and the returned cleanup function.
      const matchMedia = gsap.matchMedia();
      mm = matchMedia;
      matchMedia.add(RAIL_MEDIA, () => {
        const getDistance = () =>
          Math.max(0, track.scrollWidth - wrapper.clientWidth);

        // Native horizontal scrolling on the wrapper is only the no-JS
        // fallback; the scrub owns horizontal position from here on.
        wrapper.scrollLeft = 0;
        wrapper.style.overflowX = "clip";

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: SCRUB_SMOOTHING,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Keyboard support: translated cards are outside the browser's normal
        // scroll-into-view reach, so when a card receives focus, jump the
        // window to the scroll position whose scrub progress centers it.
        const scrollFocusedCardIntoView = (event: Event) => {
          const st = tween.scrollTrigger;
          if (!st || !(event.target instanceof HTMLElement)) return;
          const card = event.target.closest("li");
          if (!card) return;
          const distance = getDistance();
          if (distance <= 0) return;
          const centered =
            card.offsetLeft - (wrapper.clientWidth - card.offsetWidth) / 2;
          const targetX = Math.min(Math.max(centered, 0), distance);
          const progress = targetX / distance;
          window.scrollTo({ top: st.start + progress * (st.end - st.start) });
        };
        track.addEventListener("focusin", scrollFocusedCardIntoView);

        return () => {
          track.removeEventListener("focusin", scrollFocusedCardIntoView);
          wrapper.style.overflowX = "";
        };
      });
    })();

    return () => {
      cancelled = true;
      mm?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-labelledby="projects-heading"
      className="relative overflow-x-clip py-[var(--space-section)] motion-safe:lg:flex motion-safe:lg:h-svh motion-safe:lg:flex-col motion-safe:lg:justify-center motion-safe:lg:py-0"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          id="projects-heading"
          eyebrow="Sheet index"
          title="The drawing set"
        />
      </div>

      <div
        ref={wrapperRef}
        className="mt-14 w-full motion-safe:lg:mt-16 motion-safe:lg:overflow-x-auto"
      >
        {/* Rail-mode px lines the first card up with the heading's content
            edge: same math as a centered max-w-6xl (72rem) container + px-6. */}
        <ul
          ref={trackRef}
          className="relative mx-auto grid w-full max-w-6xl gap-6 px-6 motion-safe:lg:mx-0 motion-safe:lg:flex motion-safe:lg:w-max motion-safe:lg:max-w-none motion-safe:lg:items-stretch motion-safe:lg:gap-8 motion-safe:lg:px-[max(1.5rem,calc((100vw_-_72rem)/2_+_1.5rem))]"
        >
          {items.map((item, index) => (
            <li key={item.slug} className="motion-safe:lg:shrink-0">
              <ProjectCard item={item} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
