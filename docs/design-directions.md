# Five design versions — program brief

One portfolio, five complete visual identities. `main` is V1; each other version
lives on its own branch, fully functional and independently deployable.
The information architecture, content layer, motion primitives, API routes, and
test suite are shared across all five — only identity (palette, type, copy
emphasis, signature element, component styling) changes per version.

**Shared IA (all versions):** Hero → About + metrics → Experience → Projects
(6 case studies) → AI & Automation → Skills → Education → Resume hub → Contact
(+ chat widget, + `/projects/[slug]` pages).

**Shared structural system:** typed content layer in `src/content/`;
GSAP/Lenis motion loaded via `lib/motion.ts` (reduced-motion safe, no-JS safe);
zod-validated `/api/contact` + streaming `/api/chat`; Playwright e2e + vitest.

**Hard rules (every version):** no phone number / personal-vault data; WCAG AA
contrast; reduced-motion = fully readable static page; e2e suite green;
no horizontal overflow at 320/768/1024/1440; content facts come from the
resume set in `/resumes` (nothing invented — anything unverifiable is
labeled `(placeholder)`).

---

## V1 — `main` — "The Current" (dark cinematic) — SHIPPED

- **Positioning:** Full-Stack Developer (resume: Full-Stack v2)
- **Palette:** ink `#0b0b10`, surface `#15151f`, line `#26263a`, bone `#f2efe9`,
  muted `#8a8aa0`, violet `#7c5cff` → cyan `#3ee6ff`
- **Type:** Space Grotesk (display + body), system mono accents
- **Signature:** "the current" — fixed left gradient line that draws with scroll
  + film grain + pinned horizontal project rail
- **Status:** keep as-is; fix any bugs found in browser QA.

## V2 — branch `design/v2-shade-card` — "Shade Card" (beauty-lab editorial, light)

Grounded in the cosmetics world Aaron ships for: pigment, shade cards, gloss.
- **Positioning:** Ecommerce / Shopify Developer (resume: Shopify v2 + Ecommerce v2).
  Leads with storefronts, loyalty +50%, B2B portal quote time 3 days → <4 hrs,
  Checkout Extensibility migration.
- **Palette:** porcelain `#FBF7F4` canvas, ink-plum `#2A1E2F` text,
  lacquer `#D93664` primary accent, deep rouge `#8E2043`, gilt `#B98A2F` hairline
  accents, blush surface `#F4E9E4`.
- **Type:** Bodoni Moda (variable, display — fashion-editorial contrast) +
  Manrope (variable, body) + system mono for SKU-style labels.
- **Signature:** every metric/stat is presented as a **shade swatch** — a
  painted pigment chip with a shade number (e.g. "SHADE 050 · +50% sales") —
  and section eyebrows read like shade-card labels. Projects rail cards become
  product-compact cards.
- **Motion:** soft editorial — clip-path swatch wipes, serif chars rising,
  no pin (vertical rhythm), gentler reveals.

## V3 — branch `design/v3-console` — "Console" (systems terminal, dark)

Grounded in the observability/gateway work: logs, p95s, status bars.
- **Positioning:** Software Engineer — distributed systems (resume: Software
  Engineer v3). Leads with API gateway p95 800→<200ms, 99.9% uptime,
  idempotent ledger, GT MSCS.
- **Palette:** deep green-black `#0A0F0C` canvas, panel `#101812`,
  phosphor `#4AF2A1` primary, amber `#FFB454` warn/accent, fog `#C9D6CD` text,
  dim `#5E6E62` muted.
- **Type:** JetBrains Mono (variable — display AND labels; mono-first identity) +
  IBM Plex Sans (body prose).
- **Signature:** a persistent **status bar** (top or bottom) with live scroll
  "uptime/section" readout, sections framed as console panels with prompt
  glyphs (`$`, `>_`), metrics as log lines that "tail" in; architecture
  diagrams become first-class hero content.
- **Motion:** typewriter/decode reveals, caret blink, scanline-free (no gimmick
  overload), scrubbed "tail -f" metric entries.

## V4 — branch `design/v4-blueprint` — "Blueprint" (architecture drawing, blue)

Grounded in "architects systems end-to-end": technical drawings, dimension
lines, redlines.
- **Positioning:** Backend Developer / systems architecture (resume: Backend
  v3). Leads with ledger design, gateway resilience patterns, pipelines.
- **Palette:** blueprint blue `#0F2E64` (deep, not navy-black) canvas,
  paper-line white `#EAF2FF` line-work/text, cyan grid `#3E6FB8` hairlines,
  redline orange `#FF5C38` accent (annotations/CTAs), drafting tan `#D9C7A0`
  sparse secondary.
- **Type:** Archivo (variable — engineering-caps display) + IBM Plex Mono
  (annotations, dimensions) + IBM Plex Sans body.
- **Signature:** sections composed as **annotated technical drawings** — grid
  paper background, dimension lines with arrowheads measuring real metrics
  ("← 800ms → becomes ← <200ms →"), title-block footer (like a drawing's
  title block) as the site footer; case-study architecture ASCII becomes a
  framed "SHEET 04 OF 06" drawing.
- **Motion:** line-draw (SVG stroke) reveals, dimension lines extending,
  measured and precise; no bounce.

## V5 — branch `design/v5-sunset` — "Golden Hour" (SoCal pop, vibrant light)

Grounded in Aaron himself: SoCal (Chino Hills), joy, frontend craft.
- **Positioning:** Frontend Developer (resume: Frontend v2). Leads with design
  system (40+ sections, Storybook, 8 Web Components), WCAG 2.2 audit,
  LCP 1.7s headless storefront, +65% organic visibility.
- **Palette:** warm white `#FFF9F0` canvas, deep indigo `#221C4E` text,
  tangerine `#FF7A29`, hot coral `#FF3D71`, golden `#FFC532`, sky `#7AC7FF`
  (used as a *system*: each section owns one accent; gradients only in the
  sun arc).
- **Type:** Bricolage Grotesque (variable — chunky, warm, characterful
  display) + Inter (variable, body).
- **Signature:** a **sun arc** — small gradient sun that travels a drawn arc
  across the page as you scroll (replaces V1's current line; golden-hour
  position = scroll progress), plus bento-grid About/metrics with chunky
  rounded tiles and sticker-style skill chips.
- **Motion:** springy pop-ins (scale + y), arc-following sun, playful hover
  tilts — all compositor-only, all reduced-motion safe.

---

## Per-version content composition (same IA, different emphasis)

| | Role line | Lead project (rail order) | About metrics |
|---|---|---|---|
| V1 | Full-Stack Developer | PRO Points loyalty | +50% sales · 2,600+ SKUs · 75% p95 cut · +40% repeat |
| V2 | Ecommerce / Shopify Developer | LAC Theme & B2B portal | +50% sales · 2,600+ SKUs · 120+ B2B accts · <4hr quotes |
| V3 | Software Engineer | Stamped.io API gateway | 75% p95 cut · 99.9% uptime · ~500 req/day · 0 dbl-credit |
| V4 | Backend Developer | Stamped.io API gateway | 75% p95 cut · 10k+ attrs · <1hr sync · 99.9% uptime |
| V5 | Frontend Developer | LAC Theme & B2B portal | 40+ sections · 120+ a11y fixes · LCP 1.7s · +65% organic |

All facts sourced from `/resumes/<role>/v*/…md`. Case-study bodies stay shared.
Copy tone shifts per version (editorial / console / drafting-notes / sunny),
but every number is real.

## Fonts (self-hosted, variable, via @fontsource → public/fonts)

- V2: `bodoni-moda` + `manrope` · V3: `jetbrains-mono` + `ibm-plex-sans`
- V4: `archivo` + `ibm-plex-mono` (+ plex sans) · V5: `bricolage-grotesque` + `inter`

## QA gate per version (before a branch counts as done)

1. `npm run build` + `npm test` + `npm run test:e2e` green.
2. Brave-rendered screenshot pass: 320 / 768 / 1024 / 1440, hero + mid-scroll
   + full-page, case study, chat open, contact errors, reduced-motion.
3. Animation continuity: scroll from top to bottom in steps — no jumps,
   no blank sections, pin/unpin seamless, no overflow.
4. Push branch to origin.
