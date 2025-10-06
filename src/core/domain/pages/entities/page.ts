/**
 * @file src/core/domain/pages/entities/page.ts
 * @intro Entité métier Page (V0.5 — pages « vides » + flags sitemap)
 * @description
 * Représentation minimale pour gérer le cycle CRUD des pages avant les blocs,
 * avec contrôle basique du sitemap par page.
 *
 * Décisions V0.5 :
 * - ✅ SUPPRIME `layout` (design lors de l’intégration Lola).
 * - ✅ Conserve `blocks` (vide par défaut) pour compat future.
 * - ✅ Ajoute un bloc `sitemap` (include/changefreq/priority) pour la génération.
 *
 * Remarques :
 * - Les defaults sont appliqués côté use-cases/adapters (ex. include=true).
 * - `meta.updatedAt` sert de `lastModified` dans le sitemap public.
 *
 * @layer domain/entity
 */

import type { Block } from "@/core/domain/blocks/model";
import type { PageId } from "@/core/domain/ids/schema";

/**
 * Fréquences valides côté domaine (SoT — aligné avec les valeurs usuelles des sitemaps).
 * NOTE : si tu as/ajoutes une SoT dédiée (ex. core/domain/seo/sitemap/constants),
 * importe-la ici et supprime ce type local.
 */
export type SitemapChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

/** Métadonnées (timestamps ISO 8601, générées côté use-cases). */
interface PageMeta {
  createdAt: string; // ex. 2025-01-01T12:34:56.789Z
  updatedAt: string;
}

/** Options de présence dans le sitemap. */
export interface PageSitemap {
  /**
   * Inclure la page dans le sitemap (défaut recommandé : true).
   * Utilise `meta.updatedAt` comme `lastModified` lors de la génération.
   */
  include: boolean;
  /** Fréquence indicative de changement (optionnelle). */
  changefreq?: SitemapChangeFreq;
  /**
   * Priorité ∈ [0, 1] (optionnelle).
   * Les limites et le défaut sont appliqués côté use-case/adapters.
   */
  priority?: number;
}

/** Entité principale (MVP). */
export interface Page {
  /** Identifiant opaque — cf. ID_SCHEMAS.page: prefix "pg_", size 24. */
  id: PageId;
  /** Slug (kebab-case), conforme à SLUG_FINAL_RE (SoT). */
  slug: string;
  /** Titre de la page (limites côté schema/constantes). */
  title: string;
  /**
   * Blocs (future feature) — on garde le champ pour éviter une migration.
   * V0.5 : tableau vide.
   */
  blocks: ReadonlyArray<Block>;
  /** Timestamps ISO. */
  meta: PageMeta;
  /**
   * Contrôle de présence dans le sitemap (facultatif).
   * Si omis, les defaults domaine/UC s’appliquent (include=true, changefreq=weekly, priority=0.7 par ex.).
   */
  sitemap?: PageSitemap;
}

/** Résumé de page pour les listes/admin. */
export type PageSummary = Pick<Page, "id" | "slug" | "title">;
