/**
 * @file src/core/domain/site/defaults/site-index.ts
 * @intro Defaults pour l’index du site (source unique de vérité côté frontière)
 */

import type { SiteIndex } from "@/core/domain/site/entities/site-index";

export const makeEmptySiteIndex = (nowIso: string): SiteIndex => ({
  pages: [],
  updatedAt: nowIso,
});
