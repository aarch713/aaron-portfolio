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
      "Sustain 99.9% uptime and cut redundant upstream API calls ~35% by engineering a Node.js/TypeScript serverless gateway (Vercel) with JWT auth, Joi validation, rate limiting, a circuit breaker, retry/backoff, Redis TTL caching, and Prometheus observability — p95 latency down 75%, from 800ms to under 200ms.",
      "Architected the PRO Points loyalty program end-to-end: secure earn/redeem REST flows over an append-only, idempotent PostgreSQL transaction ledger across two storefronts, growing online sales +50% after launch with zero double-credit incidents.",
      "Integrate Klaviyo, Bazaarvoice, and Stamped.io via event-driven async webhook consumers, processing 1,200+ monthly event triggers across six lifecycle flows with dead-letter handling and idempotent delivery guarantees.",
      "Engineer a Python/pandas PIM pipeline normalizing 10,000+ product attributes across two source systems with header-diff comparison and idempotent upserts — safely re-runnable after any partial failure, eliminating 8 hrs/week of manual data entry.",
      "Automate the daily Bazaarvoice-to-PowerReviews product-feed pipeline via GitHub Actions, SFTP, and XML validation with exponential-backoff retry and Jest TDD, cutting catalog sync lag from 24 hrs to under 1 hr and failure-detection lag from ~4 hrs to under 5 minutes.",
      "Establish a branch-per-environment GitHub-to-Shopify CI/CD pipeline with PR previews and automated linting, cutting deploys from a multi-hour manual process to under 20 minutes with rollback-safe isolation across an 80+ template codebase.",
      "Build the GraphQL data-fetching layer for the Locksmith-gated B2B distributor portal — server-side catalog pagination over the Storefront API, metaobject-driven display, and a quote-request wishlist across 120+ distributor accounts.",
      "Ship a Shopify OS 2.0 design system of 40+ modular sections, migrating an 80-template codebase into the component library and cutting code duplication 60% and deploy-cycle time 45%.",
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
      "Built a Python multi-channel sync pipeline integrating five retailer APIs (Amazon SP-API, Wayfair, Home Depot, Walmart, Lowe's), normalizing product schemas and automating async submissions — driving 35% cross-platform sales growth and cutting manual data entry 60%.",
      "Achieved 99.5% inventory accuracy across 500+ SKUs and five sales channels with automated Python validation and reconciliation scripts, cutting discrepancy resolution from ~2 days to same-day.",
      "Designed a SKU attribute normalization schema mapping 500+ product attributes across five retailer APIs, establishing a single-source-of-truth catalog and cutting ~5 hrs/week of per-channel manual reformatting.",
      "Redesigned the Shopify storefront with responsive layouts and optimized imagery, reducing page-load time 28% and enabling unified catalog display across all five marketplaces.",
    ],
  },
];
