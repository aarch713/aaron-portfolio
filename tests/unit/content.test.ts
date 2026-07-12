import { describe, expect, it } from "vitest";
import { profile } from "../../src/content/profile";
import { jobs } from "../../src/content/experience";
import { projects } from "../../src/content/projects";
import { skillGroups } from "../../src/content/skills";
import { education, certifications } from "../../src/content/education";
import { CHAT_CORPUS } from "../../src/content/chat-corpus";

const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PHONE_PATTERN = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/;

const allContent = JSON.stringify({
  profile,
  jobs,
  projects,
  skillGroups,
  education,
  certifications,
  CHAT_CORPUS,
});

describe("project slugs", () => {
  it("are unique", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("are kebab-case", () => {
    for (const project of projects) {
      expect(project.slug).toMatch(KEBAB_CASE);
    }
  });
});

describe("case studies", () => {
  it("have non-empty problem, architecture, and every approach/result entry", () => {
    for (const project of projects) {
      const { problem, approach, architecture, results } = project.caseStudy;
      expect(problem.trim().length, `${project.slug} problem`).toBeGreaterThan(0);
      expect(architecture.trim().length, `${project.slug} architecture`).toBeGreaterThan(0);
      for (const step of approach) {
        expect(step.trim().length, `${project.slug} approach step`).toBeGreaterThan(0);
      }
      for (const result of results) {
        expect(result.trim().length, `${project.slug} result`).toBeGreaterThan(0);
      }
    }
  });

  it("have at least 3 approach steps and 3 results", () => {
    for (const project of projects) {
      expect(project.caseStudy.approach.length, `${project.slug} approach`).toBeGreaterThanOrEqual(3);
      expect(project.caseStudy.results.length, `${project.slug} results`).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("phone-leak guard", () => {
  it("contains no phone-number-shaped digit sequences", () => {
    expect(allContent).not.toMatch(PHONE_PATTERN);
  });

  it("does not contain the known private number prefix", () => {
    expect(allContent).not.toContain("601-316");
  });
});

describe("profile", () => {
  it("uses the public email only", () => {
    expect(profile.email).toBe("aarch713@gmail.com");
  });
});

describe("chat corpus", () => {
  it("is a substantial digest of the content layer", () => {
    expect(CHAT_CORPUS.length).toBeGreaterThan(2000);
  });
});
