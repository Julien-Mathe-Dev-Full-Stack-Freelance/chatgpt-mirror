/**
 * @file src/core/domain/pages/defaults/page.ts
 * @intro Defaults — Page (V0.5)
 * @layer domain/defaults
 * @description
 * Valeurs par défaut **métier** minimales pour une page (MVP “pages vides”).
 * - Pas de génération d’ID/slug/timestamps ici (use-cases only).
 * - `buildPageItem` retourne l’objet prêt pour l’UI (title/blocks/sitemap).
 */

import { genPageId } from "@/core/domain/ids/tools";
import type {
  Page,
  PageSitemap,
  SitemapChangeFreq,
} from "@/core/domain/pages/entities/page";
import { systemClock } from "@/core/domain/utils/clock";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

/** Flags par défaut du sitemap (simples, non localisés). */
const DEFAULT_SITEMAP_FLAGS = deepFreeze({
  include: true,
  changefreq: "weekly" as SitemapChangeFreq,
  priority: 0.7,
});

const DEFAULT_META_FLAGS = deepFreeze({
  createdAt: systemClock.nowIso(),
  updatedAt: systemClock.nowIso(),
});

/** Default canonique (gelé). */
export const DEFAULT_PAGE_SITEMAP: PageSitemap = deepFreeze({
  ...DEFAULT_SITEMAP_FLAGS,
});

/**
 * Helper domaine minimal : construit un “item” de page pour l’UI admin.
 * @remarks
 * - Ne crée PAS d’id/slug/meta (ils sont gérés au moment du create).
 * - Sert de base pour les seeds localisés (cf. factory i18n).
 */
export function buildPageItem(title: string): Page {
  return {
    id: genPageId(),
    slug: "",
    title,
    blocks: [],
    sitemap: { ...DEFAULT_PAGE_SITEMAP },
    meta: { ...DEFAULT_META_FLAGS },
  };
}

/** Default canonique (vide) : l’UI/route pourra injecter un seed i18n si nécessaire. */
export const DEFAULT_PAGE: Page = deepFreeze({
  id: genPageId(),
  slug: "",
  title: "",
  logoAlt: "",
  blocks: [],
  sitemap: { ...DEFAULT_SITEMAP_FLAGS },
  meta: { ...DEFAULT_META_FLAGS },
});
