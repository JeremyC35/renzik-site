import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const vercelEnv = process.env.VERCEL_ENV; // "production" | "preview" | "development" | undefined (local)
const isDeployed = Boolean(vercelEnv);

/*
 * CSP without nonces: nonces force every page into dynamic rendering, and this site must stay static.
 * Next.js's documented static-compatible policy needs 'unsafe-inline' for scripts (it inlines its RSC
 * payload). 'unsafe-eval' only in `next dev` (React needs it there). See DECISIONS.md.
 * upgrade-insecure-requests only when deployed, so a local `next start` over http keeps working.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(isDeployed ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Production deploys only. Submit to hstspreload.org only once the domain is stable (GO-LIVE.md).
  ...(vercelEnv === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  env: {
    // Copyright year, computed once at build time.
    BUILD_YEAR: String(new Date().getFullYear()),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
