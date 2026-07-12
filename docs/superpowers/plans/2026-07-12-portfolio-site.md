# Aaron Chai Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a dark-cinematic, scrollytelling personal portfolio (Next.js/TS on Vercel) that presents Aaron Chai as a Full-Stack Developer, with 6 case-study pages, a contact API, and a Claude-powered "Ask my resume" chat.

**Architecture:** Next.js App Router with a typed content layer as single source of truth; all sections render from `src/content/*`. Client motion (Lenis + GSAP ScrollTrigger) is isolated in a provider + per-section hooks and dynamically imported. Two serverless route handlers (`/api/contact`, `/api/chat`) with zod boundaries and in-memory rate limits.

**Tech Stack:** Next.js 15 · React 19 · TypeScript strict · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · zod · Resend · @anthropic-ai/sdk · @vercel/analytics · Vitest · Playwright (+ @axe-core/playwright)

## Global Constraints

- Repo root: `/Users/aaronc/Developer/aaron-portfolio` (NEVER build inside iCloud paths).
- Public contact ONLY: `aarch713@gmail.com`, `linkedin.com/in/aaron-chai-867b51227`, `github.com/aarch713`, "Chino Hills, CA". **No phone number anywhere. No data from Personal_Info.md.** Paperclip B21 described capability-level only (no Beauty 21 internals beyond what resumes state).
- Dark-only theme. Design tokens live in `src/app/globals.css`; components never hardcode palette hex values.
- Motion: compositor-friendly props only (`transform`, `opacity`, `clip-path`); every animated component checks reduced-motion via `useReducedMotion()` and renders static-visible content when true. Content must be fully readable with JS disabled (no opacity-0 orphans: initial hidden states are set by GSAP, not CSS).
- Files 200–400 lines typical, 800 hard max. Components render from `src/content/*` — no copy/data literals inside components.
- Copy register: plain verbs, sentence case, specific over clever. Buttons say what they do ("Download resume", "Send message").
- Commit after every task with conventional-commit messages.

## Locked design tokens (from frontend-design pass)

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0B0B10` | canvas (near-black, violet undertone) |
| `--surface` | `#15151F` | raised panels/cards |
| `--line` | `#26263A` | hairlines/borders |
| `--bone` | `#F2EFE9` | primary text (warm off-white) |
| `--muted` | `#8A8AA0` | secondary text |
| `--current-1` | `#7C5CFF` | accent gradient start (electric violet) |
| `--current-2` | `#3EE6FF` | accent gradient end (cyan) |

Type: **Space Grotesk** (self-hosted variable/static 300–700, `font-display: swap`) for display AND body; `ui-monospace` stack for eyebrows, metrics, labels. Display scale: `clamp(3rem, 1rem + 9vw, 8.5rem)` hero; section headings `clamp(2rem, 1rem + 4vw, 4.5rem)`.

**Signature element:** "the current" — a 2px SVG flow-line that runs the full page height in the left rail, drawn/scrubbed by scroll, with a traveling gradient pulse; section nodes light up as they enter. It is the ONE bold element; everything else stays quiet (hairlines, mono labels, generous space, film grain at 3% opacity).

---

## File structure (created across tasks)

```
src/
├── app/
│   ├── layout.tsx            fonts, metadata base, Analytics, grain overlay
│   ├── page.tsx              composes all home sections (integration task)
│   ├── globals.css           tokens + base + grain + focus styles
│   ├── projects/[slug]/page.tsx  case-study route (SSG)
│   ├── api/contact/route.ts
│   ├── api/chat/route.ts
│   ├── sitemap.ts · robots.ts · not-found.tsx
├── content/
│   ├── types.ts · profile.ts · experience.ts · projects.ts
│   ├── skills.ts · education.ts · chat-corpus.ts
├── components/
│   ├── providers/SmoothScroll.tsx
│   ├── current/CurrentLine.tsx          ← signature element
│   ├── nav/SiteNav.tsx · nav/Footer.tsx
│   ├── hero/Hero.tsx
│   ├── about/About.tsx · about/MetricCounter.tsx
│   ├── experience/ExperienceTimeline.tsx
│   ├── projects/ProjectsRail.tsx · projects/ProjectCard.tsx
│   ├── ai/AiShowcase.tsx
│   ├── skills/SkillsGrid.tsx
│   ├── education/Education.tsx
│   ├── resume/ResumeHub.tsx
│   ├── contact/ContactSection.tsx · contact/ContactForm.tsx
│   ├── chat/ChatWidget.tsx · chat/ChatPanel.tsx
│   ├── casestudy/CaseStudy.tsx
│   └── ui/SectionHeading.tsx · ui/MagneticButton.tsx · ui/Reveal.tsx
├── hooks/useReducedMotion.ts
├── lib/validation.ts · lib/rate-limit.ts · lib/motion.ts
tests/unit/*.test.ts · e2e/*.spec.ts
public/fonts/* · public/resume/Aaron_Chai_Resume.pdf
```

Ownership boundaries for parallel agents: each section task owns ONLY its component folder. `app/page.tsx` is touched ONLY by Task 12 (integration). Shared primitives (`ui/`, `lib/`, `hooks/`, `content/`) are frozen after Tasks 2–4.

---

### Task 1: Scaffold + design tokens + fonts

**Files:** Create Next.js app (TS, Tailwind, App Router, `src/`), `src/app/globals.css`, `src/app/layout.tsx`, `public/fonts/`, `.env.example`, copy resume PDF.

**Steps:**
- [ ] `cd ~/Developer/aaron-portfolio && npx create-next-app@latest . --ts --tailwind --app --src-dir --no-eslint --import-alias "@/*" --use-npm --yes` (repo already has docs/ + .git — scaffold into it)
- [ ] Install runtime deps: `npm i gsap lenis zod resend @anthropic-ai/sdk @vercel/analytics`
- [ ] Install dev deps: `npm i -D vitest @vitejs/plugin-react jsdom @playwright/test @axe-core/playwright`
- [ ] Download Space Grotesk (google-webfonts-helper or fontsource files) → `public/fonts/space-grotesk-{300..700}.woff2` or variable file; wire with `next/font/local` in `layout.tsx` (`variable: '--font-grotesk'`, `display: 'swap'`)
- [ ] Replace `globals.css` with token system:

```css
@import "tailwindcss";
:root {
  --ink: #0B0B10; --surface: #15151F; --line: #26263A;
  --bone: #F2EFE9; --muted: #8A8AA0;
  --current-1: #7C5CFF; --current-2: #3EE6FF;
  --font-mono: ui-monospace, "SF Mono", Menlo, monospace;
  --text-hero: clamp(3rem, 1rem + 9vw, 8.5rem);
  --text-h2: clamp(2rem, 1rem + 4vw, 4.5rem);
  --space-section: clamp(5rem, 3rem + 8vw, 12rem);
  --dur-fast: 150ms; --dur: 300ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
@theme inline {
  --color-ink: var(--ink); --color-surface: var(--surface);
  --color-line: var(--line); --color-bone: var(--bone);
  --color-muted: var(--muted); --color-current-1: var(--current-1);
  --color-current-2: var(--current-2);
  --font-sans: var(--font-grotesk), system-ui, sans-serif;
}
html { background: var(--ink); color: var(--bone); }
body { font-family: var(--font-grotesk), system-ui, sans-serif; }
:focus-visible { outline: 2px solid var(--current-2); outline-offset: 3px; }
.grain::after { /* fixed full-viewport SVG-noise overlay, opacity .03, pointer-events none */ }
```

- [ ] `.env.example` with `RESEND_API_KEY=`, `ANTHROPIC_API_KEY=`, `CONTACT_TO_EMAIL=aarch713@gmail.com`
- [ ] Copy resume: `cp "/Users/aaronc/Library/Mobile Documents/iCloud~md~obsidian/Documents/Personal💪/Code/Project/Resumes/Full-Stack_Developer/v2/Aaron_Chai_Full-Stack_Developer.pdf" public/resume/Aaron_Chai_Resume.pdf`
- [ ] Verify: `npm run build` passes; `npm run dev` renders a page with token background.
- [ ] Commit: `chore: scaffold next 15 app with tokens, fonts, deps`

### Task 2: Content layer (single source of truth)

**Files:** Create all of `src/content/` + `tests/unit/content.test.ts` + `vitest.config.ts`.

**Interfaces (Produces — frozen for all later tasks):**

```ts
// src/content/types.ts
export interface Profile {
  name: string; role: string; location: string; email: string;
  linkedin: string; github: string; resumePdf: string;
  headline: string; summary: string;
  metrics: Metric[];
}
export interface Metric { value: number; prefix?: string; suffix: string; label: string }
export interface Job {
  company: string; brand?: string; title: string; location: string;
  start: string; end: string | "Present"; bullets: string[];
}
export interface Project {
  slug: string; title: string; tagline: string; stack: string[];
  metrics: Metric[]; summary: string;
  caseStudy: { problem: string; approach: string[]; architecture: string; results: string[] };
}
export interface SkillGroup { label: string; items: string[] }
export interface EducationItem { school: string; degree: string; detail: string; year: string }
export interface Certification { name: string; issuer: string; year: string }
```

- [ ] Populate from `Resumes/Full-Stack_Developer/v2/*.md` (primary) + `Software_Engineer/v3` (cross-check): `profile.ts` (headline "Full-stack developer who ships commerce systems", 4 metrics: +50 % online sales · 2,600+ SKUs · p95 800→<200 ms · +40 % repeat-purchase email rate), `experience.ts` (Beauty 21 Sep 2024–Present, 8–10 bullets; Calhome Mar–Jun 2024, 4 bullets), `projects.ts` with slugs `pro-points-loyalty`, `stampedio-api-gateway`, `bv-powerreviews-pipeline`, `pim-pipeline`, `lac-theme-b2b-portal`, `paperclip-b21` — each with full caseStudy content written from resume bullets, `skills.ts` (6 groups), `education.ts` (GT MSCS exp. 2027; SDSU BS CS Dec 2023 Dean's List; 3 certs).
- [ ] `chat-corpus.ts`: exports `CHAT_CORPUS` string — markdown digest of ALL the above (and nothing else) for the chat system prompt.
- [ ] Unit test (`tests/unit/content.test.ts`): every project slug unique + kebab-case; every caseStudy field non-empty; profile contains no digit-sequence longer than 4 (phone-leak guard) except metric values; email is aarch713@gmail.com.
- [ ] Run `npx vitest run` → PASS. Commit: `feat: typed content layer from resume sources`

### Task 3: Motion foundation

**Files:** `src/hooks/useReducedMotion.ts`, `src/lib/motion.ts`, `src/components/providers/SmoothScroll.tsx`, `src/components/ui/Reveal.tsx`.

**Produces:** `useReducedMotion(): boolean` · `SmoothScroll({children})` client provider (Lenis + gsap.registerPlugin(ScrollTrigger), lenis→ScrollTrigger.update wiring, disabled when reduced-motion) · `Reveal({children, delay?, y?})` staggered enter-on-scroll wrapper · `lib/motion.ts` exports `EASE = "expo.out"` and `staggerChars(el)` splitting helper.

- [ ] Implement; GSAP imported only inside `useEffect`/dynamic paths (client components).
- [ ] Verify build + a manual dev-server smoke: scrolling is smooth, `prefers-reduced-motion` (emulate in devtools) disables Lenis.
- [ ] Commit: `feat: motion foundation (lenis, gsap, reveal, reduced-motion)`

### Task 4: UI primitives + CurrentLine signature

**Files:** `src/components/ui/SectionHeading.tsx`, `ui/MagneticButton.tsx`, `src/components/current/CurrentLine.tsx`.

**Produces:** `SectionHeading({eyebrow, title, id})` — mono eyebrow + display H2, self-reveals. `MagneticButton({href?, onClick?, children, variant: "solid"|"ghost"})` — magnetic hover (translate ≤ 8px), gradient border on solid. `CurrentLine()` — fixed left-rail SVG line (hidden < 1024px), path drawn via `stroke-dashoffset` scrubbed by ScrollTrigger across full doc height, traveling pulse via gradient offset; static full line when reduced-motion.

- [ ] Implement + verify in dev page harness; keyboard focus visible on MagneticButton.
- [ ] Commit: `feat: ui primitives and current-line signature element`

### Tasks 5–11: Home sections (parallel-safe, one folder each)

Each task: owns exactly its folder; imports content + primitives; exports one server-or-client component consumed by Task 12; must look intentional per the locked tokens; every animation reduced-motion-safe. Acceptance = renders standalone in dev harness, no horizontal overflow 320–1440px, axe-clean.

- [ ] **Task 5 — `hero/Hero.tsx`:** full-viewport pinned intro. Name "AARON CHAI" split-char staggered reveal at `--text-hero`, role line "Full-Stack Developer" + one-line headline, mono eyebrow "Chino Hills, CA · Open to full-time roles". Two CTAs: "Download resume" (solid, `/resume/Aaron_Chai_Resume.pdf`), "See the work" (ghost, `#projects`). The current-line visibly *starts* beneath the hero text. Scroll cue animates.
- [ ] **Task 6 — `about/About.tsx` + `about/MetricCounter.tsx`:** two-col: narrative summary (from profile.summary) + 4 oversized mono metrics counting up on enter (`MetricCounter({metric})`, counts via gsap `snap`, instant when reduced-motion).
- [ ] **Task 7 — `experience/ExperienceTimeline.tsx`:** vertical timeline of `experience.ts` jobs; node per job lights via the current gradient as it enters; bullets stagger-reveal in groups of 3 with "show all" disclosure for the rest (keyboard accessible).
- [ ] **Task 8 — `projects/ProjectsRail.tsx` + `ProjectCard.tsx`:** horizontally-scrubbed pinned rail (≥1024px) of 6 cards → falls back to vertical stack on mobile/reduced-motion. Card: title, tagline, stack chips (mono), 1 headline metric, links to `/projects/[slug]`.
- [ ] **Task 9 — `ai/AiShowcase.tsx`:** section "AI-assisted engineering, in production" — 3 tiles (LLM/GenAI API integration · agentic tooling/MCP · Paperclip B21 capability description) + inline "Ask my resume" teaser button that dispatches `window.dispatchEvent(new CustomEvent("open-chat"))`.
- [ ] **Task 10 — `skills/SkillsGrid.tsx` + `education/Education.tsx` + `resume/ResumeHub.tsx`:** skills as grouped mono chips; education/certs compact rows; ResumeHub = full-width band, "Download resume" MagneticButton + "Updated Jul 2026" mono note.
- [ ] **Task 11 — `contact/ContactSection.tsx` + `ContactForm.tsx`:** email/LinkedIn/GitHub links + form (name, email, message + hidden `company` honeypot + `startedAt` timestamp) → POST `/api/contact`; optimistic pending state; success = "Message sent — I'll reply from aarch713@gmail.com"; failure = inline error + mailto fallback link. Client zod validation shares schemas from `lib/validation.ts` (Task 13).
- [ ] Commit each: `feat(section): <name>`

### Task 12: Integration — nav, footer, page composition

**Files:** `nav/SiteNav.tsx`, `nav/Footer.tsx`, modify `app/page.tsx`, `app/layout.tsx`.

- [ ] Compose sections in order (spec §4) inside `<SmoothScroll>`; `CurrentLine` + grain overlay mounted in layout; SiteNav = fixed minimal bar (name mono + section anchors + resume CTA) appearing after hero via ScrollTrigger; Footer = repeat of contact links + "Built with Next.js, GSAP — view source on GitHub".
- [ ] Verify full-page scroll: sections flow, current-line scrubs hero→footer, `npm run build` passes.
- [ ] Commit: `feat: compose home page with nav, footer, current line`

### Task 13: Contact API

**Files:** `src/lib/validation.ts`, `src/lib/rate-limit.ts`, `src/app/api/contact/route.ts`, `tests/unit/contact.test.ts`.

**Contract:**

```ts
// lib/validation.ts
export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  message: z.string().min(10).max(4000),
  company: z.literal(""),                    // honeypot — bots fill it
  startedAt: z.number(),                     // form-open epoch ms
});
// lib/rate-limit.ts
export function rateLimit(key: string, max: number, windowMs: number): boolean; // true = allowed, in-memory Map
```

- [ ] TDD: unit tests first (schema rejects honeypot fill / short message / bad email; rateLimit allows max then blocks, resets after window) → implement → PASS.
- [ ] Route: reject if `Date.now() - startedAt < 3000`; rateLimit(`contact:${ip}`, 5, 15 min); send via Resend (`onboarding@resend.dev` sender until domain verified) to `process.env.CONTACT_TO_EMAIL`; missing key → 503 `{error:"Form is offline — email aarch713@gmail.com directly."}`; never echo internals.
- [ ] Commit: `feat: contact api with honeypot, rate limit, resend`

### Task 14: Chat API + widget

**Files:** `src/app/api/chat/route.ts`, `src/components/chat/ChatWidget.tsx`, `chat/ChatPanel.tsx`, `tests/unit/chat.test.ts`.

**Contract:** POST `{messages: {role:"user"|"assistant", content:string}[]}` (zod: ≤ 20 msgs, each ≤ 1000 chars) → SSE text stream. Model `claude-haiku-4-5-20251001`, `max_tokens: 512`, system prompt = guardrails + `CHAT_CORPUS` ("answer only from this corpus; if unknown say so and point to the resume PDF; never invent employers, dates, or numbers"). Limits: rateLimit(`chat:${ip}`, 10, 10 min) + module-level daily counter (200/day) → over-cap/missing-key returns friendly JSON fallback `{fallback:"Chat is resting — grab the resume PDF instead."}`.
**Widget:** floating mono button "Ask my resume" (bottom-right, listens for `open-chat`) → slide-up panel: message list, streaming render, suggested first questions ("What did Aaron build at Beauty 21?", "What's his backend experience?"), ESC/`×` closes, focus-trapped, `aria-live=polite`.

- [ ] TDD schema + caps; implement route + widget; manual smoke with key if present, fallback without.
- [ ] Commit: `feat: ask-my-resume chat (claude streaming + capped) and widget`

### Task 15: Case-study template + routes

**Files:** `src/components/casestudy/CaseStudy.tsx`, `src/app/projects/[slug]/page.tsx`, `src/app/not-found.tsx`.

- [ ] `generateStaticParams` from `projects.ts`; unknown slug → `notFound()`. Page: eyebrow (stack · role) → display title → metric band (MetricCounter reuse) → Problem / Approach (numbered — it IS a sequence) / Architecture (styled `<pre>` ASCII diagram from content) / Results (each with metric emphasis) → prev/next project footer + "Back to all work". `generateMetadata` per project (title, description, OG).
- [ ] Verify all 6 routes render (`npm run build` shows 6 static pages). Commit: `feat: case-study template and six project pages`

### Task 16: SEO layer

**Files:** modify `app/layout.tsx` (metadataBase, template title "Aaron Chai — Full-Stack Developer", description, OG defaults), create `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` (dark card: name + role + current gradient), JSON-LD `Person` (name, url, sameAs LinkedIn/GitHub, jobTitle) inline in layout.

- [ ] Verify: `curl localhost:3000/sitemap.xml` lists `/` + 6 project URLs; view-source shows JSON-LD. Commit: `feat: seo — metadata, og image, sitemap, robots, json-ld`

### Task 17: E2E + accessibility + visual QA

**Files:** `playwright.config.ts`, `e2e/home.spec.ts`, `e2e/projects.spec.ts`, `e2e/contact.spec.ts`, `e2e/chat.spec.ts`, `e2e/a11y.spec.ts`, `e2e/visual.spec.ts`.

- [ ] Specs: h1 "Aaron Chai" visible; nav anchors scroll; all 6 case-study pages render h1 + results; contact form client-validates, honeypot POST → 4xx, success path mocked; chat opens via widget AND via AiShowcase event, shows fallback without key; axe scan on `/` + one case study = no serious/critical violations; keyboard-only pass reaches all CTAs; reduced-motion emulation → content visible without scrolling tricks; screenshots at 320/768/1024/1440 with `maxDiffPixelRatio` guard + horizontal-overflow assertion (`document.documentElement.scrollWidth <= innerWidth`).
- [ ] All green: `npx playwright test`. Commit: `test: e2e, a11y, visual coverage`

### Task 18: Performance pass + README + deploy prep

- [ ] `npm run build` → confirm route JS: `/` first-load ≤ 180 kB gz (GSAP/Lenis/chat dynamically imported); Lighthouse (`npx lighthouse http://localhost:3000 --preset=desktop` + mobile) → LCP < 2.5 s, CLS < 0.1; fix regressions.
- [ ] README: local dev, env vars, content-update guide (edit `src/content/*`, replace `public/resume/*.pdf`), deploy steps (GitHub repo `aarch713/aaron-portfolio` → Vercel import → env vars → domain connect walkthrough for aaronchai.dev).
- [ ] Commit: `docs: readme + perf validation`

---

## Self-review notes

- Spec coverage: §4 site map → Tasks 5–12, 15; §5 design system → Tasks 1, 3, 4; §6 APIs → 13, 14; §7 errors → 11, 13, 14; §8 testing → 2, 13, 14, 17, 18; §9 deploy → 18 (repo push + Vercel done with Aaron at the end). Domain purchase + API keys = Aaron's open items (spec §11), not plan tasks.
- Naming consistency: content types in Task 2 are the only shared vocabulary; sections consume `profile/experience/projects/skills/education` exports; `open-chat` CustomEvent name used in Tasks 9 and 14. `rateLimit(key, max, windowMs)` used in 13 and 14.
- Parallelization: Tasks 5–11 are folder-disjoint and depend only on 1–4; Tasks 13–16 depend on 2 (+12 for widget mount point in layout — widget mounts in layout during Task 14 via its own file import line, acceptable single-line touch).
