# Claude Code Prompt — Renzik Landing Page (pre-domain build)

Copy everything below the line into Claude Code, run from an empty folder named `renzik-site`.

---

## Role and outcome

You are building the production marketing site for **Renzik**, an AI automation agency for home service contractors (roofing, HVAC, plumbing, general contractors) in Central New York. The domain is **not registered yet**. Build the complete site now so that going live later is only: add the domain in Vercel, set production env vars, replace marked placeholders, redeploy.

Definition of done: the site builds with zero errors and zero warnings, passes every check in Phase 9, is deployed to a Vercel **preview** URL, and a `GO-LIVE.md` file lists every remaining step.

## Ground rules (follow all of them, the whole time)

1. **Verify before you code.** Before writing config, check the current official docs for Next.js (App Router), Tailwind CSS, Vercel, Resend, and Upstash. APIs and config keys change. If anything in this prompt conflicts with current docs, follow the docs and list every deviation in a `DECISIONS.md` file with one line of reasoning each.
2. **Plan first.** Before creating files, print a short plan: folder structure, dependency list with a one-line justification each, and the design token plan (Phase 2). Wait for my approval before building.
3. **No unnecessary dependencies.** Allowed without asking: `next`, `react`, `react-dom`, `typescript`, `tailwindcss` (and its official PostCSS/Vite plugin as docs require), `zod`, `resend`, `@upstash/ratelimit`, `@upstash/redis`, `vitest`, ESLint/Prettier as scaffolded by Next. Anything else: ask first and justify. No UI kits, no animation libraries, no icon packs (inline SVG only), no analytics scripts, no third-party embeds.
4. **Secrets never touch code.** All keys live in env vars. Create `.env.example` with every variable name and a comment; create `.env.local` only for local testing; confirm `.env*` (except `.env.example`) is in `.gitignore` before the first commit.
5. **Never invent facts.** No fake testimonials, fake client logos, fake reviews, fake statistics, fake "trusted by" rows, fake addresses or phone numbers. Anything unknown becomes a placeholder token (see rule 6).
6. **Placeholders are loud and centralized.** Every unknown value lives in `src/config/site.ts` and uses the literal prefix `TODO_` (e.g. `TODO_LEGAL_ENTITY_NAME`). No placeholder text anywhere else in the codebase. A script (Phase 8) fails production builds if any `TODO_` remains.
7. **Small commits.** Initialize git at the start. Commit after each phase with a clear message.
8. **Report at the end of each phase:** what you built, what you verified, anything you changed from this spec and why.

## Phase 0 — Environment check

- Confirm Node LTS version and npm. Report versions.
- Confirm the Vercel CLI is available (`npx vercel --version`). Don't log in yet.

## Phase 1 — Scaffold

- Next.js latest stable, App Router, TypeScript strict, Tailwind, ESLint, `src/` directory, import alias `@/*`.
- **Rendering model — important:** do NOT use `output: 'export'`. Static export disables Route Handlers, and we need exactly one serverless endpoint for the contact form. Instead: every page must be statically prerendered at build time (the build output must show them as static), plus one Route Handler at `src/app/api/contact/route.ts`. If any page accidentally becomes dynamic, find out why and fix it.
- Structure:

```
src/
  app/
    layout.tsx
    page.tsx                 # the landing page
    privacy/page.tsx
    terms/page.tsx
    not-found.tsx
    api/contact/route.ts
    sitemap.ts
    robots.ts
    icon.svg                 # favicon from the brand monogram
  components/                # one file per section + form + small UI pieces
  config/site.ts             # ALL business facts and placeholders
  lib/validation.ts          # zod schema shared by form and API
  lib/ratelimit.ts
  lib/email.ts
public/brand/                # logo files
scripts/check-placeholders.mjs
```

## Phase 2 — Design system

**Fixed brand inputs (do not change):**
- Primary: pine green `#0F6E56`.
- Logo: a chamfered-badge "R" monogram plus a "RENZIK / AUTOMATED SERVICES" horizontal lockup. I will drop the SVG files into `public/brand/` as `renzik-lockup.svg` and `renzik-monogram.svg`. Until they exist, render a simple clearly-temporary text wordmark and note it in `GO-LIVE.md`. Do not draw your own version of the logo.

**Audience:** contractor owners, 35–60, checking this on a phone between jobs, often after a cold call. They distrust tech jargon and agencies. The page must feel like a serious local operator, not a Silicon Valley startup.

**Your job:** propose a compact token system before building — 4–6 named hex colors built around the pine green (include a neutral background, text color, one supporting color, and an error color that passes contrast), one or two typefaces loaded with `next/font` (self-hosted, no external font requests), a type scale, spacing scale, and a one-paragraph layout concept with an ASCII wireframe of the mobile and desktop hero.

Avoid these generated-looking defaults unless you can justify them for this audience: cream background with serif display and terracotta accent; near-black background with acid-bright accent; identical rounded cards with the same soft shadow on everything; gradient washes as decoration; ALL-CAPS tracked-out eyebrow labels above every heading; `→` appended to button text; one word in a headline colored differently; numbered 01/02/03 markers on content that isn't a sequence; fade-and-slide-up on every section. Spend boldness in one place, keep the rest quiet.

Quality floor: WCAG AA contrast on every text/background pair (list the ratios), visible keyboard focus styles, `prefers-reduced-motion` respected, responsive from 320px up, tap targets at least 44×44px.

Put tokens in the Tailwind theme / CSS variables — no hardcoded hex values in components.

## Phase 3 — Page content

Write copy in plain, direct language, sentence case, active voice, no jargon ("AI orchestration," "leverage," "synergy," "revolutionize" are banned). Speak to the owner's problem, not the technology. All business facts come from `src/config/site.ts`.

**Sections, in order:**

1. **Header** — logo, a single "Book a call" button that scrolls to the form. On mobile, keep it minimal; no hamburger menu is needed for a one-page site. Optional click-to-call link using `TODO_BUSINESS_PHONE` (hidden while it's still a placeholder).

2. **Hero** — the core line, verbatim or very close: *"We build AI systems for contractors that answer calls and follow up with leads, so you stop losing jobs to voicemail."* One short supporting sentence. Primary CTA "Book a call." No stock photos, no illustrations of robots, no fake dashboard screenshots.

3. **The problem** — missed calls and unanswered quotes cost real jobs: a call at 8 p.m. goes to voicemail and the homeowner calls the next contractor. Keep it concrete and short. **No statistics unless they are in `site.ts` with a `source` URL field**, and render the source as a small link. Start with this one, which I can verify: roughly a quarter of calls to small businesses go unanswered (set `TODO_STAT_SOURCE_URL` as the placeholder; hide the stat entirely if the source is still a placeholder at build time).

4. **What we build** — three primary offers, each with a one-line outcome and a two-line explanation:
   - AI receptionist — answers every call 24/7, books inspections, transfers urgent calls to the owner.
   - Missed call text-back — texts the caller back within seconds when nobody picks up.
   - Lead reactivation — follows up with old quotes and past customers who never booked.
   Then a short secondary line: "We also build instant estimate bots, invoice follow-up, and speed-to-lead calling." **No prices on the page.**

5. **How it works** — this IS a sequence, so numbered steps are fine: (1) a 20-minute call about how your phones and leads work today, (2) we build and test it on your real call flow, (3) it goes live and you get a simple monthly report.

6. **The math** — one illustrative example, clearly labeled as an example, not a promise: "If it recovers one roofing job a month, it pays for itself many times over." No specific dollar ROI claims, no guarantees.

7. **FAQ** — accessible disclosure pattern (native `<details>/<summary>` preferred). Questions:
   - Does it sound like a robot?
   - What happens if a caller wants a real person? (It transfers them.)
   - Will callers know it's AI? (It says so honestly if asked.)
   - Does this replace my office staff? (No — it covers the calls they can't get to.)
   - How long does setup take?
   - Do I have to change my phone number? (No.)
   Keep answers to two or three sentences, factual, no overpromising.

8. **Contact form section** — heading "Book a call," short line about what happens next ("We'll reach out within one business day"). Form spec in Phase 4.

9. **Footer** — logo, legal name `TODO_LEGAL_ENTITY_NAME`, "Renzik" as trade name, mailing address `TODO_MAILING_ADDRESS`, email `TODO_CONTACT_EMAIL`, links to Privacy and Terms, © current year computed at build time. Service area line: "Serving Central New York" (from config).

## Phase 4 — Contact form and API

**Fields:** name (required), business name (required), phone (required, US format), email (optional), trade (select: Roofing, HVAC, Plumbing, General contractor, Other), message (optional, max 1,000 chars).

**Consent checkbox** — separate, unchecked by default, not required to submit the form. Text lives in `site.ts` as `TODO_TCPA_CONSENT_TEXT` with this draft beneath it as a comment for my lawyer to review:
> "By checking this box, I agree that Renzik may contact me at the number provided by call or text, including with automated technology, about its services. Consent is not a condition of purchase. Message and data rates may apply. Reply STOP to opt out."
Include a `CONSENT_TEXT_VERSION` constant (e.g. `"2026-09-draft"`) so each lead email records exactly which wording the person saw.

**Client side:**
- Native HTML validation plus the shared zod schema; errors shown inline, linked with `aria-describedby`, announced via an `aria-live` region; focus moves to the first error on failed submit.
- Submit button text "Book a call" → while sending "Sending…" (disabled) → success replaces the form with "Got it. We'll reach out within one business day." Errors say exactly what went wrong and what to do; they don't apologize.
- Works with JavaScript disabled? Not required, but the form must not silently fail — show a message in `<noscript>` with the contact email.

**Spam protection (no CAPTCHA, no third-party scripts):**
- Honeypot field visually hidden (not `display:none`), `tabindex="-1"`, `autocomplete="off"`, labeled for screen readers as "Leave this field empty."
- Timing trap: hidden timestamp; reject submissions faster than 3 seconds.
- If either trips, return the same success response as a real submission (don't teach bots) and send nothing.

**Route Handler `POST /api/contact`:**
- Accept only POST with `Content-Type: application/json`; reject bodies over 10 KB; 405 for other methods.
- Check `Origin` header matches the allowed origins list from env (`ALLOWED_ORIGINS`, comma-separated — preview URL now, domain later).
- Validate with the same zod schema; strip unknown fields; trim and length-cap every string.
- **Rate limit:** Upstash Ratelimit, sliding window, 5 requests per 10 minutes per IP (read IP from Vercel's forwarded header per current docs). If Upstash env vars are missing in local dev, fall back to an in-memory limiter and log a warning once. In production, if they're missing, fail closed with a 503 and a clear server log line.
- **Store nothing.** No database, no file writes, no logging of form contents. Server logs may contain only: timestamp, outcome (sent / rejected-validation / rate-limited / spam / email-failed), and no personal data.
- **Email via Resend** to `CONTACT_TO_EMAIL`, from `CONTACT_FROM_EMAIL`. Subject: `New lead: {business} ({trade})`. Body: all fields, consent yes/no, `CONSENT_TEXT_VERSION`, submission timestamp in America/New_York. Plain text plus simple HTML, all user input escaped. Set `reply_to` to the lead's email if provided.
- Pre-domain note: until renzik.com is verified in Resend, use Resend's test sender (`onboarding@resend.dev`), which only delivers to the Resend account owner's email. Document this in `GO-LIVE.md`.
- Return generic JSON: `{ ok: true }` or `{ ok: false, error: "<user-safe message>" }`. Never leak stack traces or provider errors.

**Env vars (`.env.example`):**
```
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=onboarding@resend.dev
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
ALLOWED_ORIGINS=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Phase 5 — Security headers

Set via `next.config` `headers()` (or `vercel.json` if docs recommend), applied to all routes:
- `Content-Security-Policy`: `default-src 'self'`; `img-src 'self' data:`; `font-src 'self'`; `style-src 'self' 'unsafe-inline'` (Tailwind/Next need it; note in DECISIONS.md); `script-src` as strict as possible **without forcing pages into dynamic rendering** — nonce-based CSP makes every page dynamic, so check current Next.js docs, and if `'unsafe-inline'` for scripts is the only static-compatible option, use it, justify it in DECISIONS.md, and never allow `'unsafe-eval'` in production; `connect-src 'self'`; `frame-ancestors 'none'`; `form-action 'self'`; `base-uri 'self'`; `object-src 'none'`; `upgrade-insecure-requests`.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (production only — note in GO-LIVE.md that `preload` should only be submitted to hstspreload.org once the domain is stable).
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- `poweredByHeader: false`.

After build, run the site locally and print the actual response headers for `/` and `/api/contact` to prove they're set. Open the browser console on every page and confirm zero CSP violations.

## Phase 6 — Legal pages

Privacy and Terms as plain, readable pages using the site typography. Every business-specific fact pulls from `site.ts`. Put a visible notice at the top of both, rendered **only while any `TODO_` remains**: "Draft — pending legal review."

**Privacy** must cover: what the form collects, that it's emailed to Renzik and not stored in a database on the site, no cookies and no tracking, how the info is used (responding to the inquiry; calls/texts only with consent), opt-out (reply STOP / email), no selling of data, security measures, contact email, effective date `TODO_EFFECTIVE_DATE`, and New York as governing state.

**Terms** must cover: the site is informational, no guarantee of results, service terms are set in each client's signed agreement, limitation of liability, governing law New York, contact.

Mark both clearly in `GO-LIVE.md` as needing review by a lawyer before launch.

## Phase 7 — SEO, accessibility, performance

- Metadata via the Metadata API: title "Renzik — AI call answering and follow-up for contractors", description under 160 chars, canonical from `NEXT_PUBLIC_SITE_URL`, Open Graph + Twitter card. Generate the OG image as a static file or build-time image in brand colors (no external services).
- `sitemap.ts` and `robots.ts` from `NEXT_PUBLIC_SITE_URL`. **While `VERCEL_ENV` is not `production`, `robots` must disallow all and pages must send `noindex`,** so preview URLs never get indexed.
- JSON-LD `LocalBusiness` (or `ProfessionalService`) using only real values from config; omit any field that is still a placeholder.
- Semantic landmarks (`header`, `main`, `footer`, `nav` only if there is a nav), one `h1`, logical heading order, skip-to-content link, alt text on all meaningful images, decorative SVGs `aria-hidden`.
- Zero layout shift from fonts (`next/font`, `display: swap`), images sized, no render-blocking third parties (there are none).
- Target Lighthouse mobile ≥ 95 performance, 100 accessibility, 100 best practices, 100 SEO. Minimum acceptable: 90 on each.

## Phase 8 — Placeholder guard

`scripts/check-placeholders.mjs`: scans `src/` for `TODO_`. Wire it as `prebuild` so that:
- When `VERCEL_ENV === 'production'`: any `TODO_` found → print every file/line and **exit 1** (build fails).
- Otherwise: print them as a warning list and continue.

The page components must also hide any section/element whose required value is still a `TODO_` (phone link, stat, address line), so previews look clean.

## Phase 9 — Tests and verification

- **Vitest** unit tests for: the zod schema (valid, missing required, oversize, bad phone), the honeypot and timing trap, the API handler (405 on GET, 415 on wrong content type, 413 on oversize, 403 on bad origin, 429 when rate limited, success path with Resend mocked, and that no form content appears in logs).
- `npm run build` — zero errors, zero warnings; confirm all pages are static in the build output.
- `npm run lint` and `tsc --noEmit` clean.
- Run the production build locally and do a manual pass: every section at 375px, 768px, 1280px; keyboard-only navigation through the entire page and form; submit with errors; submit successfully (to my Resend test inbox); honeypot filled; submit six times fast to see the rate limit.
- Run Lighthouse (mobile) against the local production server and report the four scores. Fix anything under target before moving on.
- Take screenshots of the page at mobile and desktop widths, review them against the design plan, and fix what looks off. Then remove one unnecessary element.

## Phase 10 — Deploy to a Vercel preview

- Push to a new **private** GitHub repo named `renzik-site` (ask me to create it or authenticate if needed).
- Connect it to Vercel. Set env vars for the Preview environment only. Set `ALLOWED_ORIGINS` and `NEXT_PUBLIC_SITE_URL` to the preview URL.
- Do **not** set up Production env vars or a domain.
- After deploy: confirm the preview returns the security headers (print them), confirm `robots.txt` disallows all and pages carry `noindex`, and send one real test submission.
- Report the preview URL.

## Phase 11 — Write `GO-LIVE.md`

A checklist I can follow later without you, including:
1. Register the domain; add it in Vercel → Project → Domains; set the DNS records Vercel shows; wait for SSL.
2. In Resend: add and verify the domain (SPF, DKIM, and add a DMARC record), then change `CONTACT_FROM_EMAIL` to something like `leads@<domain>`.
3. Set Production env vars (list every one, with the production values to use).
4. Replace every `TODO_` in `src/config/site.ts` (generate the current list from the placeholder script).
5. Drop the real logo SVGs into `public/brand/` and remove the temporary wordmark.
6. Have a lawyer review the TCPA consent text, Privacy, and Terms; update `CONSENT_TEXT_VERSION`.
7. Deploy to production; verify headers at securityheaders.com (target A or A+) and run Lighthouse on the live URL.
8. Submit the sitemap in Google Search Console; confirm `robots.txt` now allows indexing.
9. Only once the domain is stable: consider submitting to hstspreload.org.
10. Send one real test lead end to end.

## Business facts for `src/config/site.ts`

Known:
- Trade name: Renzik
- Tagline/lockup: Renzik Automated Services
- Industry: AI call answering and lead follow-up for home service contractors
- Service area: Central New York (Utica, Rome, Syracuse and surrounding areas)
- Brand color: #0F6E56

Placeholders (keep as `TODO_`):
- `TODO_LEGAL_ENTITY_NAME` (LLC filing pending)
- `TODO_MAILING_ADDRESS` (use a business mailing address, not a home address)
- `TODO_BUSINESS_PHONE`
- `TODO_CONTACT_EMAIL`
- `TODO_DOMAIN`
- `TODO_TCPA_CONSENT_TEXT`
- `TODO_EFFECTIVE_DATE`
- `TODO_STAT_SOURCE_URL`

Start with Phase 0 and the plan. Don't write files until I approve the plan.
