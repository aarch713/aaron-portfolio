export interface Profile {
  name: string;
  role: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  resumePdf: string;
  headline: string;
  summary: string;
  metrics: Metric[];
}

export interface Metric {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
}

export interface Job {
  company: string;
  brand?: string;
  title: string;
  location: string;
  start: string;
  end: string | "Present";
  bullets: string[];
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  stack: string[];
  metrics: Metric[];
  summary: string;
  caseStudy: {
    problem: string;
    approach: string[];
    architecture: string;
    results: string[];
  };
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  detail: string;
  year: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}
