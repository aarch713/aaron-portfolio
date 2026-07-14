import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "lac-theme-b2b-portal",
    title: "L.A. Colors Theme & B2B Portal",
    tagline: "40+-section Shopify design system plus a gated distributor portal",
    stack: ["Shopify OS 2.0", "Liquid", "Tailwind", "Web Components", "React", "GraphQL", "Metaobjects"],
    metrics: [
      { value: 40, suffix: "+", label: "modular theme sections" },
      { value: 120, suffix: "+", label: "distributor accounts served" },
      { value: 60, suffix: "%", label: "code duplication cut" },
    ],
    summary:
      "A custom Shopify OS 2.0 theme built as a design system of 40+ modular Liquid/Tailwind/Web Component sections, plus a Locksmith-gated B2B distributor portal with a React component library and GraphQL data layer. It serves 120+ distributor accounts with zero downtime since launch.",
    caseStudy: {
      problem:
        "The storefront ran on an 80-template legacy codebase full of copy-pasted variants — every change had to be made in multiple places, deploys were slow, and accessibility was inconsistent. Meanwhile B2B distributors had no self-service channel at all: wholesale browsing and quote requests ran through email.",
      approach: [
        "Designed a Shopify OS 2.0 section library — 40+ modular Liquid/Tailwind/Web Component sections — and migrated the 80-template codebase into it.",
        "Applied WCAG 2.1 AA contrast and keyboard-navigation standards across every section, resolving 120+ accessibility violations.",
        "Built the B2B portal behind a Locksmith gate with a reusable React component library, so distributor-only pricing and catalog stay invisible to retail shoppers.",
        "Implemented a GraphQL data-fetching layer over the Storefront API with metaobject-driven product display, infinite-scroll browsing, and a quote-request wishlist.",
        "Stood up a branch-per-environment GitHub-to-Shopify CI/CD pipeline with PR previews and automated linting for both storefronts.",
      ],
      architecture: `+------------------------------+
| Shopify OS 2.0 theme         |
| 40+ Liquid/Tailwind sections |
| + Web Components             |
+---------------+--------------+
                |
                v  (Locksmith gate)
+------------------------------+
| B2B distributor portal       |
| React component library      |
+---------------+--------------+
                v
+------------------------------+
| GraphQL data layer           |
| Storefront API + metaobjects |
| infinite scroll - wishlist   |
+------------------------------+`,
      results: [
        "60% cut in code duplication and 45% faster deploy cycles after migrating 80 templates into the section library.",
        "120+ distributor accounts served by the B2B portal with zero downtime since launch.",
        "120+ accessibility violations resolved to WCAG 2.1 AA, with zero compliance-related escalations since.",
        "Deploys cut from a multi-hour manual process to under 20 minutes via the GitHub-to-Shopify CI/CD pipeline.",
      ],
    },
  },
  {
    slug: "pro-points-loyalty",
    title: "PRO Points Loyalty Program",
    tagline: "End-to-end loyalty system that lifted online sales +50% in six months",
    stack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Shopify"],
    metrics: [
      { value: 50, prefix: "+", suffix: "%", label: "online sales in 6 months" },
      { value: 10000, suffix: "+", label: "customers per brand" },
      { value: 2600, suffix: "+", label: "SKUs served" },
    ],
    summary:
      "A points-based loyalty program I architect and maintain end-to-end across the L.A. Girl and L.A. Colors storefronts. Customers earn and redeem points through an idempotent transaction API backed by PostgreSQL, and the program drove a +50% online sales lift in the six months after launch.",
    caseStudy: {
      problem:
        "Two storefronts — 637 products, 2,600+ SKUs, 10,000+ customers per brand — had no retention mechanism of their own. Repeat purchases depended entirely on paid channels, and any loyalty system had to survive real-world failure modes: double-submitted redemptions, webhook retries, and concurrent earn events could not be allowed to double-credit or double-debit a customer's balance.",
      approach: [
        "Modeled the points ledger in PostgreSQL as append-only earn/redeem transactions, so every balance is derivable and auditable rather than a mutable counter.",
        "Built the earn/redeem API in Node.js/Express with idempotency keys on every transaction, making webhook retries and duplicate submissions safe by construction.",
        "Wrote the customer-facing loyalty UI as React/TypeScript widgets embedded in both Shopify storefronts, sharing one component set across the two brands.",
        "Wired storefront events (orders, signups, reviews) into the earn pipeline and launched redemption at checkout across both brands.",
        "Instrumented the flow end-to-end so balance disputes could be traced to a specific transaction rather than reconstructed by hand.",
      ],
      architecture: `+----------------+      +----------------+
| L.A. Girl      |      | L.A. Colors    |
| storefront     |      | storefront     |
+-------+--------+      +--------+-------+
        |                        |
        +-----------+------------+
                    v
        +-----------------------+
        | Loyalty UI            |
        | React / TypeScript    |
        +-----------+-----------+
                    v
        +-----------------------+
        | Node.js / Express API |
        | earn / redeem         |
        | idempotent txns       |
        +-----------+-----------+
                    v
        +-----------------------+
        | PostgreSQL            |
        | append-only ledger    |
        +-----------------------+`,
      results: [
        "+50% online sales lift in the six months post-launch across both storefronts.",
        "10,000+ customers per brand earning and redeeming against a single consistent ledger.",
        "Zero double-credit or double-debit incidents — idempotent transaction handling absorbs webhook retries and duplicate submissions.",
        "One codebase serves both brands: 637 products and 2,600+ SKUs run through the same earn/redeem API.",
      ],
    },
  },
  {
    slug: "pim-pipeline",
    title: "PIM Pipeline",
    tagline: "Python pipeline that normalizes 10,000+ product attributes across systems",
    stack: ["Python", "pandas", "openpyxl", "Next.js"],
    metrics: [
      { value: 10000, suffix: "+", label: "product attributes normalized" },
      { value: 60, suffix: "%", label: "manual data entry cut" },
      { value: 8, suffix: " hrs/wk", label: "manual work eliminated" },
    ],
    summary:
      "A Python/pandas product-information pipeline that reconciles 10,000+ product attributes across two source systems and surfaces every change in a Next.js review dashboard. It eliminated 8 hours per week of manual data entry — a 60% reduction.",
    caseStudy: {
      problem:
        "Product data lived in two source systems that disagreed constantly — different headers, formats, and update cadences across 10,000+ attributes. Keeping storefront catalog data correct meant roughly 8 hours a week of manual spreadsheet reconciliation, and errors that slipped through surfaced directly on live product pages.",
      approach: [
        "Built a pandas pipeline that ingests both sources (openpyxl for the spreadsheet side) and runs header-diff comparison to detect schema drift before processing a single row.",
        "Normalized attribute names, formats, and units into one canonical schema — a single source of truth for downstream systems.",
        "Made every write an idempotent upsert, so re-running the pipeline after a partial failure is always safe.",
        "Shipped a Next.js review dashboard that surfaces diffs for human approval, keeping a person in the loop for ambiguous changes instead of silently overwriting.",
      ],
      architecture: `+------------+     +------------+
| Source A   |     | Source B   |
| (exports)  |     | (exports)  |
+-----+------+     +-----+------+
      +--------+---------+
               v
+------------------------------+
| Python / pandas pipeline     |
| header-diff comparison       |
| normalize -> validate        |
| idempotent upserts           |
+---------------+--------------+
                v
+------------------------------+
| Next.js review dashboard     |
| approve / reject diffs       |
+---------------+--------------+
                v
+------------------------------+
| Storefront catalog data      |
+------------------------------+`,
      results: [
        "8 hrs/week of manual data-entry work eliminated — a 60% reduction.",
        "10,000+ product attributes normalized across two source systems into one canonical schema.",
        "Downstream attribute errors on live product pages reduced, with every change reviewable in the dashboard before it ships.",
        "Idempotent upserts make the pipeline safely re-runnable after any partial failure.",
      ],
    },
  },
  {
    slug: "stampedio-api-gateway",
    title: "Stamped.io API Gateway",
    tagline: "Serverless middleware that cut p95 latency 75% and error rate 40%",
    stack: ["Node.js", "TypeScript", "Vercel Serverless", "JWT", "Redis", "Prometheus", "Joi"],
    metrics: [
      { value: 75, suffix: "%", label: "p95 latency cut (800ms to <200ms)" },
      { value: 40, suffix: "%", label: "third-party error rate reduced" },
      { value: 99.9, suffix: "%", label: "uptime across ~500 daily requests" },
    ],
    summary:
      "A secure serverless gateway that sits between two live storefronts and the Stamped.io loyalty/reviews platform. It absorbs third-party flakiness with a circuit breaker, retry with backoff, and Redis TTL caching — cutting p95 latency from 800ms to under 200ms.",
    caseStudy: {
      problem:
        "Both storefronts called Stamped.io directly from the browser. That exposed API credentials to the client, gave no control over third-party latency or errors, and meant every page paid the full round-trip cost — p95 latency sat around 800ms, and upstream failures surfaced directly to shoppers.",
      approach: [
        "Designed a Node.js/TypeScript gateway on Vercel serverless functions as the single path to Stamped.io, moving credentials server-side behind JWT auth and CORS policy.",
        "Validated every inbound request with Joi schemas and applied per-client rate limiting, so malformed or abusive traffic never reaches the upstream API.",
        "Added a circuit breaker with retry/backoff around upstream calls, so Stamped.io outages degrade gracefully instead of cascading into the storefront.",
        "Layered Redis TTL caching over hot read paths, serving repeat lookups without an upstream round-trip.",
        "Exposed Prometheus health and metrics endpoints, tracking p95 latency and error rate per route.",
      ],
      architecture: `+------------------------------+
| Storefront JS (both brands)  |
+---------------+--------------+
                v
+------------------------------+
| Vercel serverless gateway    |
| JWT auth - CORS - Joi        |
| rate limit - circuit breaker |
| retry with backoff           |
+------+----------------+------+
       |                |
       v                v
+------------+   +--------------+
| Redis TTL  |   | Stamped.io   |
| cache      |   | REST API     |
+------------+   +--------------+
       |
       v
+------------------------------+
| Prometheus health + metrics  |
+------------------------------+`,
      results: [
        "p95 latency cut 75% — from 800ms to under 200ms — for loyalty and reviews calls.",
        "40% reduction in Stamped.io API error rate reaching the storefronts.",
        "99.9% uptime sustained across ~500 daily requests, with Prometheus tracking latency and error rate per route.",
        "Credentials moved fully server-side: browsers now hold zero third-party API keys.",
      ],
    },
  },
  {
    slug: "bv-powerreviews-pipeline",
    title: "Bazaarvoice to PowerReviews Feed Pipeline",
    tagline: "Daily CI/CD feed sync that cut catalog lag from 24 hours to under one",
    stack: ["Node.js", "GitHub Actions", "SFTP", "XML", "Jest"],
    metrics: [
      { value: 1, prefix: "<", suffix: " hr", label: "catalog sync lag (from 24 hrs)" },
      { value: 5, prefix: "<", suffix: " min", label: "failure detection (from 4 hrs)" },
    ],
    summary:
      "An automated daily product-feed pipeline that moves the catalog from Bazaarvoice format to PowerReviews via scheduled GitHub Actions. It replaced a manual export step entirely and cut catalog sync lag from 24 hours to under one hour.",
    caseStudy: {
      problem:
        "Migrating reviews platforms meant the product catalog had to flow from Bazaarvoice-shaped data to PowerReviews' XML feed spec every day. The manual export process introduced up to 24 hours of catalog lag, and when a sync silently failed, nobody found out for around 4 hours — meaning new products showed no reviews on live pages.",
      approach: [
        "Built the transform in Node.js with the feed contract pinned down by Jest tests first (TDD), so the PowerReviews XML spec is encoded as executable assertions.",
        "Scheduled the pipeline as a daily GitHub Actions workflow with secret-managed credentials — no server to maintain, full run history in CI.",
        "Added exponential-backoff retry around fetch and SFTP delivery, so transient network failures self-heal instead of dropping the day's feed.",
        "Validated the generated XML against the spec before upload, failing the run loudly rather than shipping a malformed feed.",
        "Wired Slack failure alerting into the workflow so a broken sync pages a human in minutes, not hours.",
      ],
      architecture: `+------------------------------+
| Bazaarvoice product feed     |
+---------------+--------------+
                v
+------------------------------+
| GitHub Actions (daily cron)  |
| fetch -> transform -> XML    |
| validate -> retry w/ backoff |
+-------+---------------+------+
        |               |
        v               v
+---------------+  +------------+
| PowerReviews  |  | Slack      |
| SFTP ingest   |  | alerting   |
+---------------+  +------------+`,
      results: [
        "Catalog sync lag cut from 24 hours to under 1 hour — same-business-day review indexing on all product pages.",
        "Failure-detection lag cut from 4 hours to under 5 minutes via Slack alerting on any failed run.",
        "Manual export step eliminated entirely; the pipeline has a full audit trail in CI run history.",
        "Feed contract locked in by Jest TDD coverage, so spec regressions fail in CI before they reach production.",
      ],
    },
  },
  {
    slug: "paperclip-b21",
    title: "Paperclip B21",
    tagline: "Internal multi-agent AI system automating e-commerce operations",
    stack: ["Claude", "MCP", "Shopify", "ClickUp", "Gmail", "Google Drive"],
    metrics: [
      { value: 11, suffix: "", label: "specialized agents" },
      { value: 4, suffix: "", label: "platforms orchestrated" },
    ],
    summary:
      "An internal multi-agent AI automation system — 11 specialized agents built on Claude and MCP — that automates e-commerce operations across Shopify, ClickUp, Gmail, and Google Drive. It routes daily store maintenance, reporting, and content tasks that previously required hands-on work.",
    caseStudy: {
      problem:
        "Running two storefronts generates a steady stream of operational work: daily store maintenance, recurring reports, content updates, and task coordination spread across Shopify, ClickUp, Gmail, and Google Drive. Each task is small, but together they consumed real engineering time every single day — and none of them needed a human for the routine path.",
      approach: [
        "Decomposed daily operations into task domains and assigned each to one of 11 specialized agents, rather than one generalist prompt trying to do everything.",
        "Connected the agents to real systems through MCP servers for Shopify, ClickUp, Gmail, and Google Drive, so every action runs through typed tool interfaces instead of screen-scraping.",
        "Built routing so incoming work — maintenance jobs, report requests, content tasks — lands with the agent specialized for it.",
        "Kept humans in the loop for destructive or ambiguous operations: agents handle the routine path and escalate the exceptions.",
      ],
      architecture: `+------------------------------+
| Claude orchestrator          |
| routes incoming work         |
+---------------+--------------+
                v
+------------------------------+
| 11 specialized agents        |
| maintenance - reporting      |
| content - operations         |
+---------------+--------------+
                v  (MCP servers)
+--------+---------+-------+-------+
| Shopify| ClickUp | Gmail | Drive |
+--------+---------+-------+-------+`,
      results: [
        "11 specialized agents run daily store maintenance, reporting, and content tasks without hands-on intervention on the routine path.",
        "4 platforms — Shopify, ClickUp, Gmail, and Google Drive — orchestrated through typed MCP tool interfaces.",
        "Daily operational work is routed automatically to the right agent, with humans handling only exceptions and approvals.",
      ],
    },
  },
];
