import type { Profile } from "./types";

export const profile: Profile = {
  name: "Aaron Chai",
  role: "Backend Developer",
  location: "Chino Hills, CA",
  email: "aarch713@gmail.com",
  linkedin: "https://linkedin.com/in/aaron-chai-867b51227",
  github: "https://github.com/aarch713",
  resumePdf: "/resume/Aaron_Chai_Resume.pdf",
  headline: "Backend developer who drafts systems built to hold",
  summary:
    "I draft and run the backend systems behind two live storefronts — a serverless API gateway hardened with rate limiting, a circuit breaker, and retry/backoff; an idempotent points ledger on PostgreSQL; and async webhook pipelines with dead-letter handling. I work in Node.js, TypeScript, and Python, and I put LLM and agentic tooling (Claude, MCP) into production, not just demos. Georgia Tech MSCS candidate, expected 2027.",
  metrics: [
    { value: 75, suffix: "%", label: "p95 latency cut (800ms to <200ms)" },
    { value: 99.9, suffix: "%", label: "gateway uptime, ~500 req/day" },
    { value: 10000, suffix: "+", label: "product attributes normalized" },
    { value: 1, prefix: "<", suffix: " hr", label: "catalog sync lag (from 24 hrs)" },
  ],
};
