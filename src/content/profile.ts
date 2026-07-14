import type { Profile } from "./types";

export const profile: Profile = {
  name: "Aaron Chai",
  role: "Ecommerce Developer",
  location: "Chino Hills, CA",
  email: "aarch713@gmail.com",
  linkedin: "https://linkedin.com/in/aaron-chai-867b51227",
  github: "https://github.com/aarch713",
  resumePdf: "/resume/Aaron_Chai_Resume.pdf",
  headline: "Ecommerce developer who runs Shopify Plus storefronts end-to-end",
  summary:
    "I build and run two live Shopify Plus beauty storefronts end-to-end — custom OS 2.0 themes, a loyalty program, checkout extensions, a gated B2B portal, and the data pipelines behind 2,600+ SKUs. I work in Liquid, React, TypeScript, Node.js, and GraphQL, and I put LLM and agentic tooling (Claude, MCP) into production on the operations side. Currently pursuing an MSCS at Georgia Tech, expected 2027.",
  metrics: [
    { value: 50, prefix: "+", suffix: "%", label: "online sales lift in 6 months" },
    { value: 2600, suffix: "+", label: "SKUs across two storefronts" },
    { value: 120, suffix: "+", label: "wholesale accounts on the B2B portal" },
    { value: 4, prefix: "<", suffix: " hr", label: "quote turnaround (from 3+ days)" },
  ],
};
