/**
 * @file src/core/domain/pages/use-cases/create-page.types.ts
 * @intro Types du use-case `CreatePage`.
 * @description
 * Déclare les **dépendances injectées** (ports + utilitaires), l’**entrée**
 * (DTO d’intention + `state`) et le **résultat** du use-case.
 * La validation de **forme** provient des DTO issus des schémas Zod (frontière API).
 * @remarks
 * - L’horloge (`now`) et le générateur d’ID (`genId`) sont injectables pour
 *   favoriser la testabilité et le déterminisme.
 * - L’observabilité (logger) est gérée dans l’implémentation du use-case, pas ici.
 * @layer domain/use-case
 */

import type { ContentState } from "@/core/domain/constants/common";
import type { PageId } from "@/core/domain/ids/schema";
import type { CreatePageDTO } from "@/core/domain/pages/dto";
import type { Page } from "@/core/domain/pages/entities/page";
import type { PagesRepository } from "@/core/domain/pages/ports/pages-repository";
import type { SiteIndex } from "@/core/domain/site/entities/site-index";
import type { RunUpdateSiteIndex } from "@/core/domain/site/use-cases/site-index/update-site-index.types";

/** Dépendances (ports + utilitaires injectables). */
export interface CreatePageDeps {
  /** Dépôt “par page” (CRUD fichier-par-page). */
  pages: PagesRepository;
  /** Runner du use-case `updateSiteIndex` (writer unique de l’index). */
  siteIndex: RunUpdateSiteIndex;
  /** Horloge ISO injectable (tests/déterminisme). */
  nowIso?: () => string;
  /** Générateur d’ID page (injectable pour tests). */
  genId?: () => PageId;
}

/**
 * Entrée du use-case : DTO d’intention enrichi de l’état logique.
 * `state` est optionnel ici ; le défaut est appliqué dans l’implémentation (`"draft"`).
 */
export type CreatePageInput = CreatePageDTO & {
  state?: ContentState;
};

/** Résultat : page persistée + index site mis à jour. */
export interface CreatePageResult {
  /** Page créée/persistée. */
  page: Page;
  /** Index du site après mise à jour (même `state`). */
  index: SiteIndex;
}

export type RunCreatePage = (
  input: CreatePageInput
) => Promise<CreatePageResult>;
