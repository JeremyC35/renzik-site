# Renzik website: project rules

@AGENTS.md

- Next.js 16 with Cache Components. Before changing config or APIs, read the relevant guide in `node_modules/next/dist/docs/`.
- Every business fact lives in `src/config/site.ts`. Unknowns are `TODO_` tokens there and nowhere else. Components render nothing for a placeholder (`real()` returns null).
- No prices, no invented stats, testimonials, logos or ROI numbers. A stat needs a real `source` URL to render.
- Colors come only from the tokens in `globals.css` (the default Tailwind palette is cleared). No hex values in components; `palette` in `site.ts` is for the OG image and theme color only.
- Every page must stay static. If the build shows ƒ for a page, find out why before shipping.
- The API logs only `{ ts, outcome }`. Never log form content.
- No new dependencies without a reason in `DECISIONS.md`. No UI kits, animation libraries, icon packs, analytics or embeds.
- Visible copy: plain language, sentence case, no em dashes, no jargon.
- Before shipping: `npm run lint && npm run typecheck && npm test && npm run build`, then check `GO-LIVE.md`.
