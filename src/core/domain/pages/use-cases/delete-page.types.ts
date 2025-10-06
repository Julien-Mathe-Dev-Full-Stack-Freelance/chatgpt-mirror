// src/core/domain/pages/use-cases/delete-page.types.ts
/**
 * @file src/core/domain/pages/use-cases/delete-page.types.ts
 * @intro Types du use-case `DeletePage`.
 * @description
 * Contrats d’E/S et dépendances pour supprimer une page et resynchroniser l’index.
 * Architecture alignée sur la séparation des dépôts : `PagesRepository` / runner `updateSiteIndex`.
 * La validation de **forme** se fait en amont (frontière API via Zod) ; ici, types purs.
 * @remarks
 * - `state` a un défaut appliqué dans l’implémentation (`"draft"`).
 * - Aucun runtime ici (types-only) pour préserver la propreté du domaine.
 * @layer domain/use-case
 */

import type { ContentState } from "@/core/domain/constants/common";
import type { PagesRepository } from "@/core/domain/pages/ports/pages-repository";
import type { SiteIndex } from "@/core/domain/site/entities/site-index";
import type { RunUpdateSiteIndex } from "@/core/domain/site/use-cases/site-index/update-site-index.types";
/** Entrée métier minimale. */
export interface DeletePageInput {
  /** Slug (kebab-case) de la page à supprimer. */
  slug: string;
  /** Espace logique — défaut appliqué dans le use-case à `"draft"`. */
  state?: ContentState;
}

/** Résultat après suppression (idempotent si la page n’existe pas). */
export interface DeletePageResult {
  /** Index recalculé pour l’état ciblé (même `state`). */
  index: SiteIndex;
}

/** Dépendances injectées (IoC). */
export interface DeletePageDeps {
  /** Dépôt “par page” (CRUD fichier-par-page). */
  pages: PagesRepository;
  /** Runner du use-case `updateSiteIndex` (writer unique de l’index). */
  siteIndex: RunUpdateSiteIndex;
}

/** Runner type pour parité DI/tests */
// export type RunDeletePage = (
//   input: DeletePageInput
// ) => Promise<DeletePageResult>;
