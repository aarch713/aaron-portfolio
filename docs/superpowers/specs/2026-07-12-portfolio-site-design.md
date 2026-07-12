# Design: Aaron Chai Personal Portfolio Site (job-search)

**Date:** 2026-07-12
**Status:** Approved by Aaron (design review passed; spec pending his review)
**Repo:** `~/Developer/aaron-portfolio` → GitHub `aarch713/aaron-portfolio` → Vercel

## 1. Purpose & success criteria

A public personal website supporting Aaron Chai's job search. It presents his
professional experience, projects, education, and skills with a bold, modern,
heavily animated, elegant design — and demonstrates his claimed stack
(Next.js/TypeScript/React, serverless APIs, LLM integration) by being built
with it.

Success criteria:

- A recruiter can grasp who Aaron is within 10 seconds of landing (hero +
  headline metrics) and reach the resume PDF or contact in ≤ 2 interactions.
- Each featured project has a shareable case-study URL usable in applications.
- Lighthouse: LCP < 2.5s, CLS < 0.1 on the home page (mid-tier mobile).
- Zero personal-vault data (no phone, address details, IDs, family, medical).
- Replaces `aaronchai.framer.website` as the portfolio URL on future resumes.

## 2. Confirmed decisions (14 answers from Aaron, 2026-07-12)

| # | Topic | Decision |
|---|---|---|
| 1 | Positioning | Full-Stack Developer |
| 2 | Sections | Core four + Resume hub + Contact + AI/automation showcase |
| 3 | Projects | 4 resume projects (incl. loyalty + LAC theme/B2B) + Paperclip B21 |
| 4 | Public contact | Email + LinkedIn + GitHub only (no phone) |
| 5 | Art style | Dark cinematic |
| 6 | Animation | Full scrollytelling (GSAP + ScrollTrigger), no WebGL hero |
| 7 | Palette | Claude picks, elegant-bold, contrast-validated |
| 8 | Typography | Big grotesk sans display |
| 9 | Backend | Contact form + visitor analytics + "Ask my resume" AI chat |
| 10 | Stack | Next.js (App Router) + TypeScript + Tailwind |
| 11 | Hosting | Vercel; Aaron buys custom domain (suggested: aaronchai.dev) |
| 12 | Framer site | Replaced by this site |
| 13 | Architecture | Hybrid: one-page scrollytelling home + `/projects/[slug]` case studies |
| 14 | Resume hub | Latest Full-Stack Developer PDF only |

## 3. Content sources

- Primary: `Resumes/Full-Stack_Developer/v2/Aaron_Chai_Full-Stack_Developer.md`
  (+ PDF for the download hub), cross-checked with
  `Resumes/Software_Engineer/v3/Aaron_Chai_Software_Engineer.md`.
  Both live under the Obsidian `Project/Resumes/` tree (mirrored in the
  `important/Career_Education/Resume/` vault).
- Secondary: Compass memory (role at Beauty 21, Paperclip B21 capability
  description, GT OMSCS coursework).
- Public identity: `aarch713@gmail.com`,
  `linkedin.com/in/aaron-chai-867b51227`, `github.com/aarch713`,
  "Chino Hills, CA".
- Exclusions (hard rule): everything in `Personal_Info.md` beyond name/city/
  email; no phone; no employer internals for Paperclip B21 (capability-level
  description only: 11-agent AI automation across Shopify, ClickUp, Gmail,
  Google Drive).

## 4. Site map

```
/                      Cinematic scrollytelling one-pager
  ├─ Hero              Pinned kinetic-type intro, name + role + CTA pair
  ├─ About             Short narrative + animated metric counters
  │                    (+50% sales · 2,600+ SKUs · p95 800→<200ms · +40% repeat email rate)
  ├─ Experience        Pinned vertical timeline: Beauty 21 (Sep 2024–), Calhome (Mar–Jun 2024)
  ├─ Projects          Horizontal scroll rail of 6 cards → case-study pages
  ├─ AI & Automation   Claude Code / MCP / LLM API work, Paperclip B21, chat entry point
  ├─ Skills            Grouped: Languages / Frontend / Backend & Cloud / Data / Testing / AI
  ├─ Education         GT MSCS (exp. 2027) · SDSU BS CS (Dec 2023, Dean's List) · 3 certs
  ├─ Resume hub        Download latest Full-Stack PDF (public/resume/…)
  └─ Contact           Email/LinkedIn/GitHub links + working form

/projects/[slug]       Shared animated case-study template, 6 instances:
  pro-points-loyalty · stampedio-api-gateway · bv-powerreviews-pipeline ·
  pim-pipeline · lac-theme-b2b-portal · paperclip-b21
  Structure per page: problem → approach → architecture (diagram) → results (metrics)

/api/contact           POST — contact form
/api/chat              POST — streaming "Ask my resume" chat
sitemap.xml, robots.txt, OG images, JSON-LD Person schema
```

## 5. Design system

- **Palette** (CSS custom properties in `styles/tokens.css`): near-black canvas
  ~`oklch(14% 0.01 280)`, warm off-white text ~`oklch(96% 0.005 90)`, electric
  violet→cyan accent range (~`oklch(65% 0.24 290)` → `oklch(80% 0.15 200)`)
  used semantically (metrics, links, motion highlights). Subtle film grain
  overlay + radial glow layers for depth. All pairs WCAG AA contrast-validated.
  Dark-only theme (deliberate single-look commitment).
- **Typography:** one variable grotesk family (Space Grotesk, self-hosted,
  subset, `font-display: swap`) spanning display (clamp ~3rem→8rem) and body
  sizes; system monospace stack for metric/code accents. Stays within the
  2-family budget.
- **Motion system:** Lenis smooth scroll + GSAP ScrollTrigger (both dynamically
  imported client-side). Pinned hero scene, staggered character/word reveals,
  scroll-scrubbed timeline, horizontal project rail, animated counters,
  magnetic buttons, route transitions on case-study entry. Compositor-only
  properties (`transform`, `opacity`, `clip-path`); `will-change` narrowly.
  `prefers-reduced-motion`: all pinning/scrubbing disabled, content fully
  readable statically.

## 6. Architecture & data flow

- Next.js App Router, TypeScript strict, Tailwind + tokens.css.
- **Content layer** (single source of truth): typed modules in `src/content/`
  — `profile.ts`, `experience.ts`, `projects.ts` (incl. case-study body
  sections), `skills.ts`, `education.ts`. Components render only from these;
  updating the site after a new resume version = editing content modules.
- **Components** by feature: `components/hero/`, `components/experience/`,
  `components/projects/`, `components/chat/`, `components/contact/`,
  `components/ui/` (Button, SectionHeading, MetricCounter, GrainOverlay…).
  Files 200–400 lines typical, 800 max.
- **Server:** two route handlers only.
  - `/api/contact`: zod-validated `{name, email, message, honeypot, startedAt}`
    → Resend email to `aarch713@gmail.com`. Rejects honeypot fills and
    submissions < 3s after form open; per-IP in-memory rate limit
    (best-effort per serverless instance) + Resend free-tier cap as backstop.
  - `/api/chat`: zod-validated message list → Anthropic Messages API
    (claude-haiku, streaming SSE) with a system prompt embedding the public
    professional corpus only. Per-IP rate limit + a conservative global
    daily request cap, both enforced in-memory per instance (accepted
    trade-off on the free tier; the daily cap is set low enough that even
    multi-instance leakage cannot produce meaningful spend). When
    capped/unconfigured → friendly fallback pointing to resume PDF.
- **Analytics:** `@vercel/analytics` component.

## 7. Error handling

- API inputs validated at the boundary (zod); structured 4xx errors with
  user-friendly messages; no sensitive detail in responses.
- Contact form failure → inline error + mailto fallback link (no lost messages).
- Chat failure/cap → graceful canned response + resume link; UI never hangs
  (stream timeout ~30s).
- Missing env keys (local dev) → features render in fallback mode; site never
  crashes without secrets.

## 8. Testing & quality gates

- **E2E (Playwright):** home renders hero h1; all 6 case-study routes render;
  contact form validates + honeypot blocks; chat opens and shows fallback
  when unconfigured; keyboard navigation through nav/CTAs.
- **Visual:** Playwright screenshots at 320 / 768 / 1024 / 1440; no horizontal
  overflow at any breakpoint.
- **Accessibility:** axe automated pass per page; focus states designed;
  reduced-motion verified in E2E (emulate `prefers-reduced-motion`).
- **Performance:** Lighthouse on `/` — LCP < 2.5s, CLS < 0.1, TBT < 200ms;
  GSAP/Lenis/chat dynamically imported; hero type renders server-side (no
  layout shift from font swap beyond fallback metrics matching).
- **Unit:** content-layer type integrity + API validation logic (Vitest).

## 9. Deployment & operations

1. GitHub repo `aarch713/aaron-portfolio` (public — the repo itself is a
   portfolio artifact; no secrets committed, `.env.local` gitignored).
2. Vercel project on the free tier; env vars `RESEND_API_KEY`,
   `ANTHROPIC_API_KEY` set in Vercel dashboard by Aaron at deploy time.
3. Ships at `aaron-portfolio.vercel.app` (or similar) immediately; Aaron buys
   `aaronchai.dev` (~$12/yr) and connects it in Vercel → automatic TLS.
4. Resume PDF copied into `public/resume/` from the latest Full-Stack version;
   update path documented in README.

## 10. Out of scope

- Light theme / theme toggle (dark-only by decision #5).
- Blog, testimonials, CMS/admin panel.
- WebGL/Three.js hero (decision #6).
- Migrating content from the Framer site (replaced, not ported).
- Automated resume-PDF regeneration from the Build_System.

## 11. Open items (non-blocking)

- Aaron purchases the domain and provides Resend + Anthropic API keys at
  deploy time.
- Optional later: per-role resume variants in the hub; case-study screenshots
  of live storefronts (Aaron to approve which screenshots are OK to publish).
