import type { SkillGroup } from "./types";

export const skillGroups: SkillGroup[] = [
  {
    label: "Frontend",
    items: [
      "React",
      "Next.js (App Router / SSR)",
      "TypeScript",
      "TailwindCSS",
      "Web Components",
      "Liquid",
      "Redux Toolkit",
    ],
  },
  {
    label: "UI Quality",
    items: [
      "WCAG 2.2 accessibility",
      "Core Web Vitals",
      "Code-splitting & lazy loading",
      "Design systems (Storybook)",
      "Responsive & cross-browser",
    ],
  },
  {
    label: "Languages & APIs",
    items: [
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3 / SCSS",
      "REST & GraphQL",
      "OAuth 2.0 / JWT",
      "Python",
    ],
  },
  {
    label: "Testing & Tooling",
    items: [
      "Jest",
      "React Testing Library",
      "Playwright",
      "Vite / Webpack",
      "ESLint / Prettier",
      "Figma",
      "CI/CD (GitHub Actions)",
    ],
  },
  {
    label: "AI Dev",
    items: [
      "Claude Code",
      "LLM/GenAI API integration",
      "MCP tooling",
      "Prompt engineering",
      "GitHub Copilot",
    ],
  },
  {
    label: "Practices",
    items: [
      "Agile/Scrum",
      "Code review",
      "TDD",
      "SEO & structured data",
      "Git/GitHub",
    ],
  },
];
