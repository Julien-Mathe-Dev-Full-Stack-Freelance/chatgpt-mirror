/**
 * @file src/app/sitemap.ts
 * @intro Génère le sitemap.
 */

import { getSiteRepository } from "@/infrastructure/site";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteRepo = getSiteRepository();
  await siteRepo.ensureBase();

  // lis l’index publié (ou "draft" si tu préfères)
  const { pages, updatedAt } = await siteRepo.readIndex("published");

  const base = process.env["NEXT_PUBLIC_SITE_URL"]?.replace(/\/$/, "") ?? "";

  return pages.map((ref) => ({
    url: `${base}/${ref.slug}`,
    lastModified: new Date(updatedAt), // ← ICI : timestamp global
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}
