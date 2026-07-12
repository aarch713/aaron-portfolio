import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/casestudy/CaseStudy";
import { projects } from "@/content/projects";

interface CaseStudyPageProps {
  /** Next 16: route params resolve asynchronously. */
  params: Promise<{ slug: string }>;
}

/** All six case-study routes are statically generated at build time. */
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

/** Only the slugs above exist — anything else 404s instead of rendering on demand. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) return {};

  const title = `${project.title} — Aaron Chai`;
  return {
    title,
    description: project.tagline,
    openGraph: {
      title,
      description: project.tagline,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) notFound();

  return <CaseStudy project={project} />;
}
