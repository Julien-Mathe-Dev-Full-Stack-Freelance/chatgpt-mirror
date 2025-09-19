/**
 * @file src/core/domain/site/entities/site-index.ts
 * @intro Entité domaine : index du site (ordre de navigation)
 * @description
 * Source de vérité pour l’ordre des pages affichées dans la navigation.
 * - `pages[]` contient des refs minimales { id, slug, title }.
 * - L’ordre du tableau est **significatif** (ne pas trier côté repo).
 *
 * V1 (FS) : persisté dans `content/{draft|published}/site.json`.
 *
 * @layer domain/entity
 */

import type { PageId } from "@/core/domain/ids/schema";

export interface PageRef {
  /** Identifiant unique de la page (Page.id). */
  id: PageId;
  /** Slug unique (Page.slug). */
  slug: string;
  /** Titre visible (Page.title). */
  title: string;
}

export interface SiteIndex {
  pages: ReadonlyArray<PageRef>;
  updatedAt: string;
}
