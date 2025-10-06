/**
 * @file src/core/domain/site/defaults/site-index.ts
 * @intro Defaults — SiteIndex (neutres, non localisés)
 * @layer domain/defaults
 * @description
 * Valeurs par défaut **métier** pour l’index du site + helpers de construction.
 * - `DEFAULT_SITE_INDEX` : pages vides, horodatage sentinelle (époque).
 * - Helpers `buildPageRef`, `buildSiteIndex`, `buildEmptySiteIndex`.
 *
 * Décisions :
 * - AUCUN horodatage “now” ici : les timestamps dynamiques restent aux use-cases.
 * - Le default canonique est **gelé** (deepFreeze) pour éviter les mutations.
 */

import type { PageId } from "@/core/domain/ids/schema";
import type {
  PageRef,
  SiteIndex,
} from "@/core/domain/site/entities/site-index";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

/** ISO 8601 époque : sentinelle neutre pour un index “vierge”. */
export const EPOCH_ISO = "1970-01-01T00:00:00.000Z" as const;

/** Construit une ref de page (helper minimal, symétrique de tes autres build*). */
export function buildPageRef(id: PageId, slug: string, title: string): PageRef {
  return { id, slug, title };
}

/**
 * Construit un SiteIndex à partir d'une liste **ordonnée** de PageRef.
 * L'ordre reçu est **conservé** (aucun tri côté domaine).
 */
export function buildSiteIndex(
  pages: ReadonlyArray<PageRef>,
  updatedAt: string
): SiteIndex {
  return {
    pages: [...pages],
    updatedAt,
  };
}

/** Variante vide utilitaire. */
export function buildEmptySiteIndex(updatedAt: string): SiteIndex {
  return {
    pages: [],
    updatedAt,
  };
}

/** Default canonique (gelé). */
export const DEFAULT_SITE_INDEX: SiteIndex = deepFreeze(
  buildEmptySiteIndex(EPOCH_ISO)
);
