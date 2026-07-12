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
      "Architect and maintain the PRO Points loyalty program end-to-end (React/TypeScript, Node.js/Express, PostgreSQL) across two storefronts — 637 products, 2,600+ SKUs, 10,000+ customers per brand — with idempotent earn/redeem transaction handling, delivering a +50% online sales lift in the six months post-launch.",
      "Design and deploy a Node.js/TypeScript serverless API gateway (Vercel, JWT/CORS, Joi validation, rate limiting, circuit breaker, retry with backoff, Redis TTL caching, Prometheus), reducing Stamped.io API error rate 40% and cutting p95 latency from 800ms to under 200ms.",
      "Ship a Shopify OS 2.0 design system of 40+ modular Liquid/Tailwind/Web Component sections across two storefronts, migrating an 80-template codebase into the component library and cutting code duplication 60% and deploy-cycle time 45%.",
      "Apply WCAG 2.1 AA contrast and keyboard-navigation standards across all 40+ storefront sections, resolving 120+ accessibility violations with zero compliance-related escalations across both brands since launch.",
      "Engineer a Python/pandas PIM pipeline normalizing 10,000+ product attributes across two source systems with header-diff comparison and idempotent upserts, surfaced in a Next.js review dashboard — eliminating 8 hrs/week of manual data entry (a 60% reduction).",
      "Deploy and maintain six automated customer lifecycle flows (Shopify Flow plus async webhook consumers) integrating Klaviyo, Bazaarvoice, and Stamped.io via the GraphQL Admin API, processing 1,200+ monthly event triggers with dead-letter handling and sustaining a +40% email repeat-purchase rate lift.",
      "Automate the daily Bazaarvoice-to-PowerReviews product-feed pipeline via GitHub Actions CI/CD with exponential-backoff retry, Jest TDD, and Slack failure alerting — cutting catalog sync lag from 24 hrs to under 1 hr and failure-detection lag from 4 hrs to under 5 minutes.",
      "Improve Core Web Vitals (LCP) on the L.A. Girl storefront 35% by diagnosing render-blocking third-party JS race conditions and implementing script-defer strategies, validated against Lighthouse scoring.",
      "Build a reusable React component library and GraphQL data-fetching layer for the Locksmith-gated B2B distributor portal — infinite-scroll catalog browsing, metaobject-driven product display, and a quote-request wishlist across 120+ distributor accounts.",
      "Establish a branch-per-environment GitHub-to-Shopify CI/CD pipeline with PR preview environments and automated linting, cutting deploys from a multi-hour manual process to under 20 minutes and enabling same-day hotfixes across both storefronts.",
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
      "Achieved 99.5% inventory accuracy across 500+ SKUs and 5 sales channels with automated Python validation and reconciliation scripts, cutting discrepancy resolution from ~2 days to same-day and manual data entry 60%.",
      "Designed a SKU attribute normalization schema mapping 500+ product attributes across 5 retailer APIs, establishing a single-source-of-truth catalog and cutting ~5 hrs/week of per-channel manual data reformatting.",
      "Redesigned the Shopify storefront with responsive layouts, optimized imagery, and cross-device navigation, reducing page-load time 28% and enabling unified catalog display across all 5 marketplaces.",
    ],
  },
];
