// src/core/domain/pages/use-cases/update-page.types.ts
/**
 * @file src/core/domain/pages/use-cases/update-page.types.ts
 * @intro Types du use-case `UpdatePage`.
 * @description
 * Réutilise le DTO validé côté `schemas/` via le barrel du domaine et
 * **ajoute** `currentSlug` (identifiant de la page cible).
 * La validation de **forme** est assurée en amont (frontière API via Zod) ; ici, types purs.
 * @remarks
 * - `state` a un défaut appliqué dans l’implémentation (`"draft"`).
 * - Aucune dépendance runtime : module **types-only** pour garder le domaine propre.
 * @layer domain/use-case
 */

import type { PagesRepository } from "@/core/domain/pages/ports/pages-repository";
import type { ContentState } from "@/core/domain/constants/common";
import type { SiteIndex } from "@/core/domain/site/entities/site-index";
import type { RunUpdateSiteIndex } from "@/core/domain/site/use-cases/site-index/update-site-index.types";
import type { UpdatePageDTO } from "@/core/domain/pages/dto";
import type { Page } from "@/core/domain/pages/entities/page";
/**
 * Intention d’entrée du use-case.
 * Alias du DTO d’API **augmenté** de `currentSlug` (clé d’identification courante).
 */
export type UpdatePageInput = UpdatePageDTO & {
  /** Slug courant identifiant la page à modifier. */
  currentSlug: string;

  /** Espace logique : "draft" (par défaut appliqué dans le use-case) ou "published". */
  state?: ContentState;
};

/** Résultat : page mise à jour + index synchronisé. */
export interface UpdatePageResult {
  /** Page persistée après mise à jour. */
  page: Page;
  /** Index du site après synchronisation (même `state`). */
  index: SiteIndex;
}

/**
 * Dépendances techniques injectées (IoC).
 * - `pages` : repo “par page” (CRUD fichier-par-page).
 * - `siteIndex` : **runner** du use-case `updateSiteIndex` (writer unique de l’index).
 * - `now`   : horloge ISO injectable pour tests/déterminisme.
 */
export interface UpdatePageDeps {
  pages: PagesRepository;
  siteIndex: RunUpdateSiteIndex;
  nowIso?: () => string;
}

// src/core/domain/pages/use-cases/update-page.types.ts
export type RunUpdatePage = (
  input: UpdatePageInput
) => Promise<UpdatePageResult>;
