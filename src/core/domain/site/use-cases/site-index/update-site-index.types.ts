/**
 * @file src/core/domain/site/use-cases/site-index/update-site-index.types.ts
 * @intro Types du use-case `updateSiteIndex`.
 * @layer domain/use-case
 */

import type { ContentState } from "@/core/domain/constants/common";
import type {
  PageRef,
  SiteIndex,
} from "@/core/domain/site/entities/site-index";
import type { PositionSpecifier } from "@/core/domain/site/index/helpers";
import type { SiteRepository } from "@/core/domain/site/ports/site-repository";

/** Dépendances nécessaires au use-case. */
export interface UpdateSiteIndexDeps {
  /** Dépôt agrégat “site” (index + settings). */
  repo: SiteRepository;
}

/** Opération : s’assurer qu’une page est listée (upsert par id). */
export interface EnsurePageListedAction {
  type: "ensurePageListed";
  ref: PageRef;
  position?: PositionSpecifier;
}

/** Opération : retirer une page via son slug. */
export interface RemovePageBySlugAction {
  type: "removeBySlug";
  slug: string;
}

/** Opération : retirer une page via son id. */
export interface RemovePageByIdAction {
  type: "removeById";
  id: string;
}

/** Union des opérations supportées. */
export type UpdateSiteIndexAction =
  | EnsurePageListedAction
  | RemovePageBySlugAction
  | RemovePageByIdAction;

/** Entrée du use-case. */
export interface UpdateSiteIndexInput {
  state?: ContentState; // défaut dans l’implémentation → "draft"
  action: UpdateSiteIndexAction;
}

/** Sortie du use-case. */
export interface UpdateSiteIndexResult {
  index: SiteIndex;
}

/** type pour obliger l'utilisation de la fonction run */
export type RunUpdateSiteIndex = (
  input: UpdateSiteIndexInput
) => Promise<UpdateSiteIndexResult>;
