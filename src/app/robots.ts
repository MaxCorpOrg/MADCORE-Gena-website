import type { MetadataRoute } from "next";
import { getSiteRuntimeConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const { publicBaseUrl } = getSiteRuntimeConfig();

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/privacy"],
      disallow: ["/thanks", "/safe", "/api/", "/go"],
    },
    sitemap: `${publicBaseUrl}/sitemap.xml`,
    host: publicBaseUrl,
  };
}
