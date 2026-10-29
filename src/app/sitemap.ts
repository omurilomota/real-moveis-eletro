import type { MetadataRoute } from "next";
import { getTopOffersForSitemap, getUnitSlugsForSitemap } from "@/lib/data";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/ofertas`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/unidades`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/institucional`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const [offerRows, unitRows] = await Promise.all([
    getTopOffersForSitemap(),
    getUnitSlugsForSitemap(),
  ]);

  return [
    ...staticRoutes,
    ...offerRows.map((o) => ({
      url: `${site.url}/ofertas/${o.slug}`,
      lastModified: o.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...unitRows.map((u) => ({
      url: `${site.url}/unidades/${u.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
