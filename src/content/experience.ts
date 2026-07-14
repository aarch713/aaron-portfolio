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
      "Architected and shipped a Shopify OS 2.0 custom theme from scratch — 40+ Liquid/Tailwind/Web Component sections across two storefronts spanning 2,600+ SKUs — the platform foundation for +50% online sales growth and a 96 Lighthouse performance score post-launch.",
      "Engineered 8 reusable React/TypeScript Web Components (carousel, swatch picker, Quick View, mega menu, product cards), unit-tested with Jest/React Testing Library and documented in Storybook — cutting per-feature UI build time 40%.",
      "Launched the PRO Points loyalty program frontend end-to-end (React/TypeScript, REST API integration) across 637 products and 10,000+ customers per brand, driving online sales +50% in the six months post-launch.",
      "Shipped a Next.js/Vercel headless storefront for a national retail release, achieving LCP 1.7s and a 96 Lighthouse performance score with zero Shopify theme coupling.",
      "Led a WCAG 2.2 AA audit and full remediation: resolved 80+ violations (contrast, focus, keyboard nav) across both storefronts, raising Lighthouse accessibility to 94+ and enabling keyboard-only checkout.",
      "Improved LCP 35% by diagnosing render-blocking third-party JS race conditions and implementing script-defer, code-splitting, and lazy-loading strategies across both storefronts.",
      "Resolved 1,000+ indexing errors and lifted organic search visibility 65% in six months by rebuilding SEO and structured-data infrastructure (schema markup, Google Search Console) across two storefronts.",
      "Refactored 80+ Liquid/JS templates into a modular component architecture, cutting code duplication 60% and deploy-cycle time 45% — enabling same-day feature rollouts under production retail traffic.",
      "Deployed 6 automated customer lifecycle flows (Shopify Flow + Klaviyo/Bazaarvoice/Stamped.io webhooks via the GraphQL Admin API), lifting email repeat-purchase rate +40%.",
      "Delivered 100+ product launches across both storefronts with zero incidents across 12 consecutive Agile milestones.",
    ],
  },
  {
    company: "Calhome (T-Motor Sports Inc)",
    title: "Web Developer (Project-Based)",
    location: "Pomona, CA",
    start: "Mar 2024",
    end: "Jun 2024",
    bullets: [
      "Redesigned and relaunched the Shopify storefront with a fully responsive, cross-browser UI and optimized product pages, driving 35% cross-platform sales growth within the 3-month engagement.",
      "Built a unified inventory and performance dashboard consolidating real-time analytics from 5 marketplace feeds and the Shopify storefront, cutting reporting prep time 3+ hours per week.",
      "Synchronized the product catalog across 5 marketplaces (Amazon, Wayfair, Home Depot, Walmart, Lowe's) with a Python automation pipeline, achieving 99.5% inventory accuracy.",
      "Reduced page-load time 28% with responsive layouts, optimized imagery, and cross-device navigation across all 5 marketplace-synced product pages.",
    ],
  },
];
