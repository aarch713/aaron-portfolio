import type { Metadata } from "next";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SiteNav } from "@/components/nav/SiteNav";
import { Footer } from "@/components/nav/Footer";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { ProjectsRail } from "@/components/projects/ProjectsRail";
import type { ProjectCardData } from "@/components/projects/ProjectCard";
import { AiShowcase, type PaperclipTileData } from "@/components/ai/AiShowcase";
import { SkillsGrid } from "@/components/skills/SkillsGrid";
import { Education } from "@/components/education/Education";
import { ResumeHub } from "@/components/resume/ResumeHub";
import { ContactSection } from "@/components/contact/ContactSection";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const PAPERCLIP_SLUG = "paperclip-b21";

/**
 * The content layer is imported HERE (server component only) and mapped to
 * trimmed shapes, so the full case-study copy never ships in the client
 * bundle — client components receive just what they render.
 */
const projectCards: ProjectCardData[] = projects.map((project) => ({
  slug: project.slug,
  title: project.title,
  tagline: project.tagline,
  stack: project.stack,
  metric: project.metrics[0],
}));

const paperclipProject = projects.find(
  (project) => project.slug === PAPERCLIP_SLUG,
);
if (!paperclipProject) {
  // Static content — fail the build loudly rather than render a wrong tile.
  throw new Error(
    `Home page expects a "${PAPERCLIP_SLUG}" entry in @/content/projects.`,
  );
}

const paperclipTile: PaperclipTileData = {
  title: paperclipProject.title,
  tagline: paperclipProject.tagline,
  summary: paperclipProject.summary,
  slug: paperclipProject.slug,
  stack: paperclipProject.stack,
};

export default function Home() {
  return (
    <SmoothScroll>
      <SiteNav />
      <main id="main">
        <Hero />
        <About />
        <ExperienceTimeline />
        <ProjectsRail items={projectCards} />
        <AiShowcase paperclip={paperclipTile} />
        <SkillsGrid />
        <Education />
        <ResumeHub />
        <ContactSection />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
