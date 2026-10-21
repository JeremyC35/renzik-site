import type { MetadataRoute } from "next";
import { isProductionDeploy, siteUrl } from "@/lib/env";

/** Previews and local builds block every crawler. Only a Vercel production deploy is indexable. */
export default function robots(): MetadataRoute.Robots {
  if (!isProductionDeploy) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
