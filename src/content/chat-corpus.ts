import type { Job, Metric, Project } from "./types";
import { profile } from "./profile";
import { jobs } from "./experience";
import { projects } from "./projects";
import { skillGroups } from "./skills";
import { education, certifications } from "./education";

/**
 * CHAT_CORPUS is generated from the content modules above — the chat
 * system prompt can never drift from what the site itself renders.
 * Nothing outside the content layer appears here.
 */

const formatMetric = (m: Metric): string =>
  `${m.prefix ?? ""}${m.value}${m.suffix} ${m.label}`;

const formatJob = (job: Job): string =>
  [
    `### ${job.company}${job.brand ? ` (${job.brand})` : ""} — ${job.title}`,
    `${job.location} · ${job.start} – ${job.end}`,
    "",
    ...job.bullets.map((b) => `- ${b}`),
  ].join("\n");

const formatProject = (p: Project): string =>
  [
    `### ${p.title}`,
    `Tagline: ${p.tagline}`,
    `Stack: ${p.stack.join(", ")}`,
    `Key numbers: ${p.metrics.map(formatMetric).join(" · ")}`,
    "",
    p.summary,
    "",
    `Problem: ${p.caseStudy.problem}`,
    "",
    "Results:",
    ...p.caseStudy.results.map((r) => `- ${r}`),
  ].join("\n");

const sections: string[] = [
  `# ${profile.name} — ${profile.role}`,
  "",
  `Location: ${profile.location}`,
  `Email: ${profile.email}`,
  `LinkedIn: ${profile.linkedin}`,
  `GitHub: ${profile.github}`,
  `Resume PDF: ${profile.resumePdf}`,
  "",
  `Headline: ${profile.headline}`,
  "",
  "## Summary",
  "",
  profile.summary,
  "",
  "## Headline metrics",
  "",
  ...profile.metrics.map((m) => `- ${formatMetric(m)}`),
  "",
  "## Experience",
  "",
  jobs.map(formatJob).join("\n\n"),
  "",
  "## Projects",
  "",
  projects.map(formatProject).join("\n\n"),
  "",
  "## Skills",
  "",
  ...skillGroups.map((g) => `- ${g.label}: ${g.items.join(", ")}`),
  "",
  "## Education",
  "",
  ...education.map((e) => `- ${e.degree} — ${e.school} · ${e.detail} · ${e.year}`),
  "",
  "## Certifications",
  "",
  ...certifications.map((c) => `- ${c.name} — ${c.issuer} (${c.year})`),
];

export const CHAT_CORPUS: string = sections.join("\n");
