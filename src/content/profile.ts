import type { Profile } from "./types";

export const profile: Profile = {
  name: "Aaron Chai",
  role: "Software Engineer",
  location: "Chino Hills, CA",
  email: "aarch713@gmail.com",
  linkedin: "https://linkedin.com/in/aaron-chai-867b51227",
  github: "https://github.com/aarch713",
  resumePdf: "/resume/Aaron_Chai_Resume.pdf",
  headline: "Software engineer for distributed commerce systems",
  summary:
    "I design and run the distributed systems behind two live storefronts — a serverless API gateway with a circuit breaker and Redis caching, an idempotent points ledger on PostgreSQL, and CI/CD data pipelines that self-heal on failure. I work in TypeScript, Node.js, and Python, and I put LLM and agentic tooling (Claude, MCP) into production, not just demos. Georgia Tech MSCS candidate, expected 2027.",
  metrics: [
    { value: 75, suffix: "%", label: "p95 latency cut (800ms to <200ms)" },
    { value: 99.9, suffix: "%", label: "gateway uptime, ~500 req/day" },
    { value: 1200, suffix: "+", label: "webhook events processed monthly" },
    { value: 0, suffix: "", label: "double-credit incidents since launch" },
  ],
};
