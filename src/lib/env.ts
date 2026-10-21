/** Public site URL, used for canonical links, the sitemap, robots and OG tags. Read at build time. */
// Falls back to the deployment's own Vercel URL, then localhost.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
).replace(/\/+$/, "");

/** Only a Vercel production deploy may be indexed. Previews and local builds are noindex. */
export const isProductionDeploy = process.env.VERCEL_ENV === "production";

/** Set in next.config at build time, because Cache Components forbids `new Date()` while prerendering. */
export const buildYear = process.env.BUILD_YEAR ?? "";
