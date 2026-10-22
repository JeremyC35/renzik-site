# Decisions

Every deviation from `docs/renzik-landing-page-claude-code-prompt.md`, and every judgment call, with one line of reasoning. Docs checked on 2026-10-21 against Next.js 16.4.2's bundled docs (`node_modules/next/dist/docs/`), Resend 6.34 and Upstash Ratelimit 2.2 type definitions, and Vercel's request-header docs.

## Process
- **D1 · Built without a separate plan-approval stop.** Jeremy asked for the site to be built with all the prompt's requirements. Per the workspace's decide-vs-ask rule, the plan lives here and in the README instead, and everything that needs keys, GitHub, deploys or real emails is batched for him at the end.
- **D2 · Built in `internal/website/`, not a new `renzik-site` folder.** The workspace map puts the landing page here. The package name is still `renzik-site`, and the folder is its own git repo (the root `.gitignore` excludes `internal/*`).

## Framework (Next.js 16)
- **D3 · Next.js 16.4.2 with its scaffold defaults: `cacheComponents` and `partialPrefetching` on, Tailwind 4 via the `@tailwindcss/turbopack` loader.** That's the current create-next-app output. The build confirms every page is static (○), and only `/api/contact` is on demand (ƒ).
- **D4 · Copyright year comes from `next.config` `env.BUILD_YEAR`.** Cache Components treats `new Date()` during prerender as a build error, so the year is computed once when the config loads at build time. The prompt's intent ("computed at build time") still holds.
- **D5 · OG image reads the brand mark at module scope.** A read inside the handler made `/opengraph-image` dynamic. Module scope is the docs' pattern and keeps it static.
- **D6 · `experimental.inlineCss: true`.** The docs recommend it for Tailwind and first-time visitors (our audience). It removed the render-blocking stylesheet. It's flagged experimental, so if a Next upgrade breaks it, delete the flag and nothing else changes.
- **D7 · `@types/node` raised from ^20 to ^24.** Vitest 5 requires Node types ≥22, and the machine runs Node 24.

## Security
- **D8 · CSP uses `script-src 'self' 'unsafe-inline'` (no nonce).** The Next 16 CSP guide states that nonces require dynamic rendering for every page, which this site must not do. The guide's "Without Nonces" policy is the static-compatible option. Experimental SRI was rejected because it can't cover the inline RSC payload scripts Next.js emits. `'unsafe-eval'` appears only in `next dev`.
- **D9 · `style-src 'unsafe-inline'`.** Next.js and the inlined Tailwind CSS (D6) inject `<style>` tags.
- **D10 · `upgrade-insecure-requests` only when deployed (`VERCEL_ENV` set).** Locally it would upgrade same-origin requests from `http://localhost` to https and break `next start` testing. Vercel always serves https.
- **D11 · HSTS only when `VERCEL_ENV === "production"`**, as the prompt specifies. Preview deploys don't send it.
- **D12 · Zod runs with `z.config({ jitless: true })`.** Zod 4 probes `new Function("")` at load, which Chrome reported as a CSP eval violation (found by Lighthouse). Jitless skips the probe, and validation results are identical.
- **D13 · Client IP: `x-vercel-forwarded-for`, then `x-real-ip`, then `x-forwarded-for`.** Vercel overwrites these to prevent spoofing (per its request-headers doc). `@vercel/functions` `ipAddress()` reads the same values but isn't on the allowed-dependency list.
- **D14 · "Production" for the rate limiter means deployed (`VERCEL_ENV` set), not `NODE_ENV`.** Preview and production deploys fail closed with a 503 when Upstash is missing. A local `next start` (also NODE_ENV=production) uses the in-memory limiter so the site can be tested.
- **D15 · Request checks run in this order: origin (403), content type (415), size (413), rate limit (429), JSON (400), spam traps (fake 200), validation (400), email.** Cheap checks come first, rate limiting counts every well-formed request including bots, and spam traps run before validation so a bot never learns which fields were wrong. 405 comes from explicit GET/PUT/PATCH/DELETE exports with `Allow: POST`.
- **D16 · Extra log outcomes beyond the prompt's list:** `rejected-origin`, `rejected-content-type`, `rejected-size`, `unavailable`. They still carry no personal data, only `{ ts, outcome }`.
- **D17 · Timing trap also rejects a `startedAt` older than 24 hours.** It stops a bot replaying one valid token forever, and real visitors never hit it.

## Email (Resend)
- **D18 · `replyTo`, not `reply_to`.** The current Resend SDK field name is camelCase.
- **D19 · Missing Resend env vars → 503 (`email-failed` logged).** Fail clearly rather than pretend it sent.

## Form
- **D20 · The form is `noValidate`, and its fieldset is disabled until JavaScript hydrates.** Inline zod errors replace the browser's validation bubbles so errors look and announce the same way everywhere. The native attributes (`required`, `type`, `maxLength`, `autocomplete`) stay for semantics and mobile keyboards. A disabled form plus the `<noscript>` message means it can never "silently fail" without JS, and it never falls back to a GET that would put contact details in a URL.
- **D21 · The validation module is loaded on the first submit (`import()`), and field limits live in `lib/limits.ts`.** This takes zod out of the first page load (Lighthouse "unused JavaScript").
- **D22 · The consent checkbox is hidden while `TODO_TCPA_CONSENT_TEXT` is a placeholder**, following the prompt's rule to hide any element whose required value is a placeholder. The lawyer-review draft sits beside the constant in `site.ts`.
- **D23 · Phone accepts any 10-digit NANP number (optionally +1) and is normalized to `(315) 555-0188`.** That's the "US format" rule from the prompt.

## Design
- **D24 · Palette from the real logo files.** Paper `#F1EFE8` and ink `#1C1B17` are the colors inside `renzik-lockup.svg`, so the page matches the brand exactly. Six tokens: pine, pine-deep, paper, ink, stone, error. Tailwind's default palette is cleared (`--color-*: initial`) so no other colors can creep in.
- **D25 · Real logos used, no temporary wordmark.** `internal/brand/` already had `renzik-lockup.svg` and `renzik-mark.svg`. The mark was copied in as `public/brand/renzik-monogram.svg` and `src/app/icon.svg`.
- **D26 · Archivo (one family, via next/font, self-hosted at build).** It's a sturdy grotesque that reads "trade business", not "startup", and it avoids the overused defaults (Inter, Geist, serif display).
- **D27 · The bold moment is the full-width pine hero band, with its bottom-right corner cut at the logo badge's 45° chamfer.** Everything below is quiet: paper background, hairline rules, no cards or shadows.
- **D28 · Light theme only.** The prompt defines one palette, and the lockup's ink text can't sit on a dark background.
- **D29 · Hero headline kept verbatim (four lines on desktop).** The prompt asked for the core line "verbatim or very close", which wins over a shorter-headline style rule.
- **D30 · The page `<title>` keeps the prompt's em dash.** It was specified word for word. All visible page copy avoids em dashes.
- **D31 · The legal draft notice reads "Draft, pending legal review."** That's the prompt's wording with a comma for the dash (house style for visible copy).
- **D32 · The unnecessary element removed in review: the "Up to 1,000 characters" hint under the message box.** The field already caps input and errors past the limit.
- **D33 · FAQ "Do I have to change my phone number?" says only that you keep your number.** How calls get routed depends on each client's carrier, and we don't promise a mechanism we haven't confirmed.

## Content
- **D34 · No setup-time figure in the FAQ.** None was provided, and inventing one breaks the no-invented-facts rule, so the answer says the timeline comes on the first call.
- **D35 · Privacy policy discloses the brief IP retention by the rate limiter and the host's technical logs.** Saying "we store nothing" without that would be inaccurate.

## Dependencies
| Package | Why |
|---|---|
| next, react, react-dom | Framework (allowed list) |
| zod | One schema shared by the form and the API (allowed) |
| resend | Lead email delivery (allowed) |
| @upstash/ratelimit, @upstash/redis | Serverless-safe rate limiting (allowed) |
| tailwindcss, @tailwindcss/turbopack | Styling. The Turbopack loader is what create-next-app 16 installs, in place of the PostCSS plugin |
| vitest | Unit tests (allowed) |
| eslint, eslint-config-next, typescript, @types/* | Scaffolded by Next |

No UI kits, animation libraries, icon packs, analytics or third-party embeds. Icons are two inline SVGs (the FAQ plus/close sign). Prettier was run through `npx` with `.prettierrc.json` (width 120) and isn't installed as a dependency.

`npm audit --omit=dev` reports 0 vulnerabilities. The 5 "high" findings are in ESLint's dev-only dependency chain (`braces` via `eslint-config-next`) and never ship.

## Brand reach
- **D36 · No city or region anywhere on the site** (2026-10-21, Jeremy). The prompt's "Central New York" service-area line, hero mention, meta description and JSON-LD `areaServed` were removed: stamping a market everywhere limits the brand. Overrides the prompt's business facts.
