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
    label: "Systems & Backend",
    items: [
      "Node.js",
      "Express",
      "REST APIs",
      "GraphQL",
      "Microservices",
      "Distributed systems",
      "Rate limiting",
      "Circuit breakers",
      "Redis caching",
      "Webhooks",
    ],
  },
  {
    label: "Cloud & Delivery",
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
      "pandas",
      "SQL/NoSQL modeling",
      "Idempotent pipelines",
    ],
  },
  {
    label: "Practices",
    items: [
      "System design",
      "TDD (Jest, Playwright)",
      "Design patterns",
      "Performance optimization",
      "Code review",
      "Agile/Scrum",
    ],
  },
  {
    label: "AI-Assisted Dev",
    items: [
      "Claude Code",
      "LLM/GenAI API integration",
      "Agentic / MCP automation",
      "Prompt engineering",
      "GitHub Copilot",
    ],
  },
];
