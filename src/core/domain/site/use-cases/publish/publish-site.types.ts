/**
 * @file src/core/domain/site/use-cases/publish/publish-site.types.ts
 * @intro Types du use-case `publishSite`.
 * @description
 * Contrats d’entrées/sorties et dépendances injectées.
 * Module **types-only** (aucun runtime) pour préserver la propreté du domaine.
 * La validation de **forme** est assurée en amont (frontière API via Zod).
 * @remarks
 * - Les défauts (`from="draft"`, `to="published"`) sont appliqués dans l’implémentation.
 * - `cleanOrphans` est ignoré en V1 (MVP).
 * @layer domain/use-case
 */

import type { ContentState } from "@/core/domain/constants/common";
import type { PagesRepository } from "@/core/domain/pages/ports/pages-repository";
import type { SiteRepository } from "@/core/domain/site/ports/site-repository";
import type { PublishWarning } from "@/core/domain/site/validators/publish";

/** Dépendances injectées pour la publication. */
export interface PublishSiteDeps {
  /** Dépôt “site” (index + settings). */
  site: SiteRepository;
  /** Dépôt “pages” (CRUD pages). */
  pages: PagesRepository;
}

/** Données d’entrée (toutes optionnelles, défauts appliqués dans le use-case). */
export interface PublishSiteInput {
  /** Espace source. Défaut: `"draft"`. */
  from?: ContentState;
  /** Espace cible. Défaut: `"published"`. */
  to?: ContentState;
  /**
   * (option) Nettoyage des pages cibles orphelines (non listées).
   * Non implémenté en V0 (MVP) : ignoré pour l’instant.
   */
  cleanOrphans?: boolean;
}

/** Résultat de la publication. */
export interface PublishSiteResult {
  /** Nombre de pages effectivement copiées. */
  pagesCopied: number;
  /** Les settings (site.json) ont-ils été copiés ? */
  settingsCopied: boolean;
  /** Avertissements non bloquants (ex: page introuvable côté draft). */
  warnings: PublishWarning[];
  /** Rappel des espaces utilisés. */
  from: ContentState;
  to: ContentState;
}

// /** Runner type pour parité DI/tests */
// export type RunPublishSite = (
//   input: PublishSiteInput
// ) => Promise<PublishSiteResult>;
