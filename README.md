# aaronchai.dev — personal portfolio · V5 "Golden Hour"

SoCal-pop portfolio for Aaron Chai (Frontend Developer) — warm white + sunset
accents, Bricolage Grotesque display, bento metric tiles, sticker chips, and a
sun that rides an arc across the page as you scroll. One of five design
versions (see `docs/design-directions.md`; `main` is V1 "The Current").
Next.js 16 (App Router) · TypeScript · Tailwind v4 · GSAP ScrollTrigger + Lenis ·
Claude-powered "Ask my resume" chat · Resend-backed contact form.

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # vitest unit tests (content integrity, api validation, rate limits)
npm run test:e2e     # playwright e2e + a11y + visual (builds and serves automatically)
npm run build        # production build
```

The site runs fully without secrets — the contact form and chat degrade to
friendly fallbacks when keys are missing.

## Environment variables

Copy `.env.example` to `.env.local` for local testing; set the same vars in
Vercel → Project → Settings → Environment Variables for production.

| Var | Purpose | Where to get it |
|---|---|---|
| `RESEND_API_KEY` | Contact-form email delivery | resend.com → API Keys (free tier) |
| `CONTACT_TO_EMAIL` | Recipient inbox | defaults to aarch713@gmail.com |
| `ANTHROPIC_API_KEY` | "Ask my resume" chat | console.anthropic.com (chat is capped at 200 req/day + 10/IP/10min) |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO | set to the production domain, e.g. https://aaronchai.dev |

## Deploy (Vercel)

1. Push this repo to GitHub (`aarch713/aaron-portfolio`).
2. vercel.com → Add New → Project → import the repo. Framework auto-detects
   as Next.js; no build settings needed.
3. Add the four environment variables above (Production scope).
4. Deploy — the site ships at `<project>.vercel.app`.
5. Custom domain: buy `aaronchai.dev` (Vercel → Domains, or any registrar),
   then Project → Settings → Domains → add it. TLS is automatic. Finally set
   `NEXT_PUBLIC_SITE_URL=https://aaronchai.dev` and redeploy.

## Updating content

Everything the site displays lives in `src/content/`:

- `profile.ts` — name, headline, summary, hero metrics, links
- `experience.ts` — jobs and bullets
- `projects.ts` — the 6 case studies (each page under `/projects/[slug]`)
- `skills.ts`, `education.ts` — chips and credential rows
- `chat-corpus.ts` — auto-generated from the modules above; no edits needed

New resume version: replace `public/resume/Aaron_Chai_Resume.pdf` and update
the "Updated" note in `src/components/resume/ResumeHub.tsx`.

`npm test` guards against accidental private-data leaks (phone-number pattern
scan) and broken case-study content.

## Architecture notes

- All copy/data renders from the typed content layer — components contain no
  data literals.
- GSAP/Lenis load dynamically on the client; reduced-motion preference
  disables smooth scroll, pinning, and reveals entirely.
- `/api/contact`: zod validation, honeypot + minimum-fill-time, 5 req/15min/IP,
  delivery via Resend.
- `/api/chat`: streaming Claude (Haiku), system prompt grounded in
  `chat-corpus.ts` only, 10 req/10min/IP + 200 req/day global cap.
