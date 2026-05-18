import type { MetadataRoute } from "next";
import { getSiteRuntimeConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const { publicBaseUrl } = getSiteRuntimeConfig();

  return [
    {
      url: `${publicBaseUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: `${publicBaseUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.4,
      lastModified: new Date(),
    },
  ];
}
