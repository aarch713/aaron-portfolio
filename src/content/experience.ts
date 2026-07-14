import type { Job } from "./types";

export const jobs: Job[] = [
  {
    company: "Beauty 21 Cosmetics Inc.",
    brand: "L.A. Girl / L.A. Colors",
    title: "Full Stack Developer",
    location: "Ontario, CA",
    start: "Sep 2024",
    end: "Present",
    bullets: [
      "Engineer a Node.js/TypeScript serverless API gateway for the Stamped.io loyalty platform, cutting p95 latency 75% (800ms to under 200ms) and third-party error rate 40% via JWT auth, rate limiting, a circuit breaker with retry/backoff, Redis TTL caching, and Prometheus observability across ~500 daily requests.",
      "Launched the PRO Points loyalty program end-to-end (React/TypeScript, Node.js/Express, PostgreSQL) with an append-only, idempotent earn/redeem transaction ledger — zero double-credit incidents across 10,000+ customers per brand, and a +50% online sales lift in six months.",
      "Deploy six automated customer lifecycle flows (Shopify Flow plus async webhook consumers integrating Klaviyo, Bazaarvoice, and Stamped.io via the GraphQL Admin API), processing 1,200+ monthly event triggers with dead-letter handling and sustaining a +40% email repeat-purchase lift.",
      "Automate the daily Bazaarvoice-to-PowerReviews product-feed pipeline via GitHub Actions CI/CD with exponential-backoff retry, Jest TDD, and Slack failure alerting — cutting catalog sync lag from 24 hrs to under 1 hr and failure-detection lag from 4 hrs to under 5 minutes.",
      "Engineer a Python/pandas PIM pipeline normalizing 10,000+ product attributes across two source systems with header-diff comparison and idempotent upserts, surfaced in a Next.js review dashboard — eliminating 8 hrs/week of manual data entry.",
      "Ship a Shopify OS 2.0 design system of 40+ modular Liquid/Tailwind/Web Component sections, migrating an 80-template codebase into the component library and cutting code duplication 60% and deploy-cycle time 45%.",
      "Establish a branch-per-environment GitHub-to-Shopify CI/CD pipeline with PR preview environments and automated linting, cutting deploys from a multi-hour manual process to under 20 minutes and enabling same-day hotfixes.",
      "Build a reusable React component library and GraphQL data-fetching layer for the Locksmith-gated B2B distributor portal — server-side catalog pagination, metaobject-driven display, and a quote-request wishlist across 120+ distributor accounts.",
      "Improve Core Web Vitals (LCP) 35% by diagnosing render-blocking third-party JS race conditions and implementing script-defer strategies, validated against Lighthouse scoring.",
      "Apply WCAG 2.1 AA standards across all 40+ storefront sections, resolving 120+ accessibility violations with zero compliance-related escalations since launch.",
    ],
  },
  {
    company: "Calhome (T-Motor Sports Inc)",
    title: "Web Developer (Project-Based)",
    location: "Pomona, CA",
    start: "Mar 2024",
    end: "Jun 2024",
    bullets: [
      "Built a Python multi-channel catalog sync pipeline integrating 5 retailer APIs (Amazon SP-API, Wayfair, Home Depot, Walmart, Lowe's), normalizing product schemas and automating async submissions — driving 35% cross-platform sales growth within the 3-month engagement.",
      "Improved inventory accuracy from 97% to 99.5% across 500+ SKUs and 5 sales channels with automated Python validation and reconciliation, cutting weekly reconciliation from ~4 hours to under 2 and eliminating oversell chargebacks.",
      "Designed a product-data normalization layer (Python/pandas) unifying SKU records across 5 marketplace schemas, producing the company's first reliable cross-channel inventory report.",
      "Redesigned the Shopify storefront with responsive layouts and optimized imagery, reducing page-load time 28% and enabling unified catalog display across all 5 marketplaces.",
    ],
  },
];
