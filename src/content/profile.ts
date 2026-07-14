import type { Profile } from "./types";

export const profile: Profile = {
  name: "Aaron Chai",
  role: "Frontend Developer",
  location: "Chino Hills, CA",
  email: "aarch713@gmail.com",
  linkedin: "https://linkedin.com/in/aaron-chai-867b51227",
  github: "https://github.com/aarch713",
  resumePdf: "/resume/Aaron_Chai_Resume.pdf",
  headline: "Frontend developer who makes commerce feel fast",
  summary:
    "I build the frontends of two live cosmetics storefronts — a 40-section design system, a Storybook-documented React/TypeScript component library, and a headless Next.js build that hits LCP 1.7s. I care about interfaces that are fast, accessible, and fun to use, and I put LLM and agentic tooling (Claude, MCP) into my daily workflow, not just demos. Georgia Tech MSCS candidate, expected 2027.",
  metrics: [
    { value: 40, suffix: "+", label: "design-system sections shipped" },
    { value: 1.7, suffix: "s", label: "LCP on the headless storefront" },
    { value: 96, suffix: "", label: "Lighthouse performance score" },
    { value: 65, prefix: "+", suffix: "%", label: "organic search visibility" },
  ],
};
