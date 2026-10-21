# website (renzik-site)

The Renzik landing page: one static page for contractors, Privacy and Terms, and a single serverless endpoint (`POST /api/contact`) that emails leads through Resend. Built from `docs/renzik-landing-page-claude-code-prompt.md`.

**Status:** preview deployed at https://renzik-site-git-preview-renzik.vercel.app (private, behind Vercel login). The form needs the Resend and Upstash keys before it can send. Production is blocked until every `TODO_` is filled. See `GO-LIVE.md`.

## Stack
Next.js 16 (App Router, static prerender) · Tailwind 4 · zod · Resend · Upstash Ratelimit · Vitest. Why each one is here: `DECISIONS.md`.

## Run it
```bash
npm install
cp .env.example .env.local   # fill in what you need; the form works locally without Upstash
npm run dev                  # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run build` | Placeholder check (blocks production builds while any `TODO_` remains), then `next build` |
| `npm start` | Serve the production build |
| `npm test` | Vitest: schema, spam traps, every API status code, no form content in logs |
| `npm run lint` / `npm run typecheck` | ESLint / `tsc --noEmit` |
| `npm run check:placeholders` | List every `TODO_` left in `src/` |

## Where things live
```
src/config/site.ts          every business fact and TODO_ placeholder (the only file with placeholders)
src/app/                    page, privacy, terms, 404, robots, sitemap, OG image, icon, /api/contact
src/components/             one file per section, plus the form
src/lib/validation.ts       zod schema shared by the form and the API, plus spam traps
src/lib/contact-handler.ts  the API logic (testable, dependencies injected)
src/lib/ratelimit.ts        Upstash in deploys, in-memory locally
src/lib/email.ts            lead email (escaped HTML and plain text) and Resend sender
public/brand/               logo files copied from internal/brand/
scripts/check-placeholders.mjs
```

## Verified (2026-10-21)
- Build: 0 errors, 0 warnings. All pages static, only `/api/contact` dynamic. Lint and `tsc` clean. 33/33 tests pass.
- Security headers present on `/` and `/api/contact`, with zero CSP violations in the browser and in Lighthouse.
- Lighthouse mobile (local production server): Performance 96 · Accessibility 100 · Best Practices 100 · SEO 100 in production mode. Previews score 69 on SEO because they are noindex by design.
- Manual pass: 320 / 375 / 768 / 1280 px with no horizontal scroll, keyboard-only tab order, inline errors with focus on the first one, honeypot and timing trap, 6th request → 429, logs contain no form content.
- Not yet tested: a real successful email send. That needs Resend keys (see `GO-LIVE.md`).
