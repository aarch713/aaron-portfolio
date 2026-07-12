import type { Profile } from "./types";

export const profile: Profile = {
  name: "Aaron Chai",
  role: "Full-Stack Developer",
  location: "Chino Hills, CA",
  email: "aarch713@gmail.com",
  linkedin: "https://linkedin.com/in/aaron-chai-867b51227",
  github: "https://github.com/aarch713",
  resumePdf: "/resume/Aaron_Chai_Resume.pdf",
  headline: "Full-stack developer who ships commerce systems",
  summary:
    "I build and run the commerce systems behind two live cosmetics storefronts — a loyalty program, a serverless API gateway, data pipelines, and a 40-section Shopify design system spanning 2,600+ SKUs. I work across the stack in React, TypeScript, Node.js, and Python, and I put LLM and agentic tooling (Claude, MCP) into production, not just demos. Currently pursuing an MSCS at Georgia Tech, expected 2027.",
  metrics: [
    { value: 50, prefix: "+", suffix: "%", label: "online sales lift in 6 months" },
    { value: 2600, suffix: "+", label: "SKUs across two storefronts" },
    { value: 75, suffix: "%", label: "p95 latency cut (800ms to <200ms)" },
    { value: 40, prefix: "+", suffix: "%", label: "email repeat-purchase rate" },
  ],
};
