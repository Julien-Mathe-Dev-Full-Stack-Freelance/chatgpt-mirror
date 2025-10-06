/**
 * @file src/core/domain/site/use-cases/footer/update-footer-settings.types.ts
 * @intro Types du use-case `UpdateFooterSettings`.
 * @description
 * Contrats d’entrées/sorties et dépendances injectées (repo site + state).
 * Module **types-only** : aucune dépendance/runtime pour préserver la propreté du domaine.
 * La validation de **forme** est assurée en amont (frontière API via Zod).
 * @remarks
 * - `state` reçoit son défaut (`"draft"`) dans l’implémentation du use-case.
 * - Étendre le résultat si l’UI doit afficher des métadonnées (ex. `updatedAt`).
 * @layer domain/use-case
 */

import type { ContentState } from "@/core/domain/constants/common";
import type { FooterSettingsDTO } from "@/core/domain/site/dto";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import type { SiteRepository } from "@/core/domain/site/ports/site-repository";

/** Dépendances nécessaires au use-case. */
export interface UpdateFooterSettingsDeps {
  /** Dépôt agrégat “site” (index + settings). */
  repo: SiteRepository;
}

/** Données d’entrée : patch partiel + espace logique (draft par défaut en implémentation). */
export interface UpdateFooterSettingsInput {
  /** Modification partielle appliquée au footer. */
  patch: Partial<FooterSettingsDTO>;
  /** Espace de contenu ciblé. */
  state?: ContentState;
}

/** Données de sortie : réglages complets après mise à jour. */
export interface UpdateFooterSettingsResult {
  settings: SiteSettings;
}

// export type RunUpdateFooterSettings = (
//   input: UpdateFooterSettingsInput
// ) => Promise<UpdateFooterSettingsResult>;
