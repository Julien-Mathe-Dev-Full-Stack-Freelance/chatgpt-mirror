/**
 * @file src/app/robots.ts
 * @intro Robots public (V0.5) — directives + lien sitemap
 * @layer app/public
 */

import { stripTrailingSlashes } from "@/core/domain/urls/tools";
import { readPublishedSettings } from "@/lib/public/content";
import type { MetadataRoute } from "next";

function hasToken(s: string | undefined, token: string): boolean {
  return !!s
    ?.toLowerCase()
    .split(",")
    .map((t) => t.trim())
    .includes(token);
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await readPublishedSettings();
  const robots = settings.seo?.robots;
  const baseUrl = stripTrailingSlashes(settings.seo?.baseUrl);

  const disallowAll = hasToken(robots, "noindex");

  return {
    rules: [
      {
        userAgent: "*",
        allow: disallowAll ? undefined : "/",
        disallow: disallowAll ? "/" : undefined,
      },
    ],
    host: baseUrl,
    sitemap: baseUrl ? `${baseUrl}/sitemap.xml` : undefined,
  };
}
