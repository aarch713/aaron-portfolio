import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SiteNav } from "@/components/nav/SiteNav";
import { Footer } from "@/components/nav/Footer";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { ProjectsRail } from "@/components/projects/ProjectsRail";
import { AiShowcase } from "@/components/ai/AiShowcase";
import { SkillsGrid } from "@/components/skills/SkillsGrid";
import { Education } from "@/components/education/Education";
import { ResumeHub } from "@/components/resume/ResumeHub";
import { ContactSection } from "@/components/contact/ContactSection";

export default function Home() {
  return (
    <SmoothScroll>
      <SiteNav />
      <main id="main">
        <Hero />
        <About />
        <ExperienceTimeline />
        <ProjectsRail />
        <AiShowcase />
        <SkillsGrid />
        <Education />
        <ResumeHub />
        <ContactSection />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
