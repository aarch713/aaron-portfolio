import type { SkillGroup } from "./types";

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      "TypeScript",
      "JavaScript (ES6+)",
      "Python",
      "Java",
      "SQL (PostgreSQL, MySQL)",
    ],
  },
  {
    label: "Backend & Reliability",
    items: [
      "Node.js",
      "Express",
      "REST APIs",
      "GraphQL",
      "Rate limiting",
      "Circuit breakers",
      "Retry / backoff",
      "Idempotency",
      "Async queuing (SQS)",
      "Webhooks",
    ],
  },
  {
    label: "Cloud & Infra",
    items: [
      "AWS Lambda",
      "Vercel Serverless",
      "Docker",
      "CI/CD (GitHub Actions)",
      "Prometheus",
      "Observability",
    ],
  },
  {
    label: "Data",
    items: [
      "PostgreSQL",
      "MySQL",
      "Redis",
      "pandas",
      "ETL pipelines",
      "SQL/NoSQL modeling",
    ],
  },
  {
    label: "Practices",
    items: [
      "System design",
      "Distributed systems",
      "TDD (Jest, Playwright)",
      "Code review",
      "Agile/Scrum",
    ],
  },
  {
    label: "AI & Tools",
    items: [
      "Claude Code",
      "LLM/GenAI API integration",
      "Agentic / MCP automation",
      "Prompt engineering",
      "Git/GitHub",
    ],
  },
];
