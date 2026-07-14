import type { Job } from "./types";

export const jobs: Job[] = [
  {
    company: "Beauty 21 Cosmetics Inc.",
    brand: "L.A. Girl / L.A. Colors",
    title: "Web Developer",
    location: "Ontario, CA",
    start: "Sep 2024",
    end: "Present",
    bullets: [
      "Architect and ship the custom Shopify OS 2.0 theme behind both storefronts — 40+ modular Liquid/Tailwind/Web Component sections, blocks, and JSON templates — cutting theme-publish cycle 45% and enabling non-developer content updates across L.A. Girl and L.A. Colors.",
      "Deliver the PRO Points loyalty program end-to-end: secure earn/redeem flows over REST and Admin GraphQL APIs with Stamped.io, growing online sales +50% and repeat-purchase rate +40% across two Shopify Plus storefronts spanning 2,600+ SKUs and 10,000+ customers per brand.",
      "Migrated both Plus storefronts from deprecated Shopify Scripts to 3 Checkout Extensibility UI extensions (discount logic, upsell widget, order-note capture) ahead of the deprecation deadline, preserving full checkout feature parity.",
      "Launched a Locksmith-gated B2B distributor portal for 120+ wholesale accounts, replacing a manual email-quote process and cutting quote-response time from 3+ business days to under 4 hours via a metaobject-driven catalog, infinite scroll, and a quote-request wishlist.",
      "Engineer a production Node.js serverless API gateway on Vercel sustaining 99.9% uptime at ~500 daily loyalty requests, cutting redundant upstream calls 35% via JWT auth, rate limiting, a circuit breaker, and Prometheus observability.",
      "Deploy six automated customer lifecycle flows (Shopify Flow plus Klaviyo, Bazaarvoice, and Stamped.io webhooks via the GraphQL Admin API), processing 1,200+ monthly event triggers and sustaining the +40% email repeat-purchase lift.",
      "Applied WCAG 2.1 AA contrast and keyboard-navigation standards across all 40+ storefront sections, resolving 120+ accessibility violations with zero compliance escalations since launch.",
      "Improved Core Web Vitals (LCP) 35% on the L.A. Girl storefront by diagnosing render-blocking third-party JS race conditions and shipping script-defer strategies, validated against Lighthouse.",
      "Engineer a Python/pandas PIM pipeline normalizing 10,000+ product attributes across two source systems with header-diff comparison and idempotent upserts, eliminating 8 hrs/week of manual data entry.",
      "Established a branch-per-environment GitHub-to-Shopify CI/CD pipeline with PR previews and automated linting, cutting deploys from a multi-hour manual process to under 20 minutes across both storefronts.",
    ],
  },
  {
    company: "Calhome (T-Motor Sports Inc)",
    title: "Web Developer (Project-Based)",
    location: "Pomona, CA",
    start: "Mar 2024",
    end: "Jun 2024",
    bullets: [
      "Redesigned and relaunched the Shopify storefront with responsive layouts, optimized imagery, and cross-device navigation, reducing page-load time 28% and driving 35% cross-platform sales growth within the 3-month engagement.",
      "Built a Python multi-channel catalog sync pipeline integrating 5 retailer APIs (Amazon SP-API, Wayfair, Home Depot, Walmart, Lowe's), normalizing product schemas and automating async submissions.",
      "Achieved 99.5% inventory accuracy across 500+ SKUs and 5 sales channels with automated Python validation and reconciliation scripts, cutting discrepancy resolution from ~2 days to same-day.",
      "Designed a SKU attribute normalization schema mapping 500+ product attributes across 5 retailer APIs, establishing a single-source-of-truth catalog and cutting ~5 hrs/week of per-channel manual reformatting.",
    ],
  },
];
