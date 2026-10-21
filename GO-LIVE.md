# Go-live checklist

Follow in order. Nothing here needs code changes beyond `src/config/site.ts` and the env vars.

## 1. Domain
- [ ] Register the domain (replace `TODO_DOMAIN` in `src/config/site.ts`).
- [ ] Vercel → Project → **Settings → Domains** → add it. Set the DNS records Vercel shows at your registrar. Wait until Vercel says the certificate is issued.

## 2. Email (Resend)
- [ ] Resend → **Domains** → add the domain. Add the SPF and DKIM records it shows, plus a DMARC record (start with `v=DMARC1; p=none; rua=mailto:<you>`, then tighten to `quarantine` once reports look clean).
- [ ] When the domain shows **Verified**, set `CONTACT_FROM_EMAIL` to something like `leads@<domain>`.
- Until then the site must use `onboarding@resend.dev`, which **only delivers to the email that owns the Resend account**. `CONTACT_TO_EMAIL` must be that address on previews.

## 3. Production environment variables
Vercel → Project → **Settings → Environment Variables → Production**:

| Variable | Production value |
|---|---|
| `RESEND_API_KEY` | A Resend API key with sending access only |
| `CONTACT_TO_EMAIL` | The inbox that should receive leads |
| `CONTACT_FROM_EMAIL` | `leads@<domain>` (after step 2) |
| `UPSTASH_REDIS_REST_URL` | From the Upstash database's REST API panel |
| `UPSTASH_REDIS_REST_TOKEN` | Same panel |
| `ALLOWED_ORIGINS` | `https://<domain>,https://www.<domain>` (no trailing slash) |
| `NEXT_PUBLIC_SITE_URL` | `https://<domain>` |

Without the Upstash vars, the deployed form returns 503 on purpose (fail closed).

## 4. Replace every placeholder
Run `npm run check:placeholders` for the live list. Today it's:

- `TODO_LEGAL_ENTITY_NAME`: the LLC name, once filed
- `TODO_MAILING_ADDRESS`: a business mailing address, not a home address
- `TODO_BUSINESS_PHONE`: once set, the header shows a click-to-call link
- `TODO_CONTACT_EMAIL`
- `TODO_DOMAIN`
- `TODO_EFFECTIVE_DATE`: for Privacy and Terms
- `TODO_TCPA_CONSENT_TEXT`: once set, the consent checkbox appears (see step 6)
- `TODO_STAT_SOURCE_URL`: a real source for "roughly a quarter of calls to small businesses go unanswered". The stat stays hidden until this is set.

A production build fails while any `TODO_` remains. That's the guard working.

## 5. Logo
- [x] Done already: the real `renzik-lockup.svg` and monogram from `internal/brand/` are in `public/brand/`. If the brand files change, copy them in again (brand README: "never edit a copy").

## 6. Lawyer review (before launch)
- [ ] TCPA consent wording (the draft is next to `tcpaConsentText` in `site.ts`). After approval, paste it in and bump `CONSENT_TEXT_VERSION` (e.g. `"2026-11-approved"`). Every lead email records this version.
- [ ] Privacy policy (`src/app/privacy/page.tsx`).
- [ ] Terms of use (`src/app/terms/page.tsx`).
- The "Draft, pending legal review." notice disappears on its own once no placeholders remain.

## 7. Deploy to production and verify
- [ ] Promote or deploy to production.
- [ ] Check headers at **securityheaders.com** (target A or A+). HSTS appears only on production.
- [ ] Run Lighthouse (mobile) on the live URL. Targets: Performance 95, Accessibility 100, Best Practices 100, SEO 100.

## 8. Search
- [ ] Open `https://<domain>/robots.txt`. It should now say `Allow: /` and list the sitemap.
- [ ] Google Search Console → add the domain → submit `https://<domain>/sitemap.xml`.

## 9. HSTS preload (later)
- [ ] Only once the domain is stable and every subdomain serves https: submit at **hstspreload.org**. It's hard to undo.

## 10. One real test lead
- [ ] Submit the live form with your own details and confirm the email arrives with the right consent version and New York timestamp.
