/**
 * @file src/core/domain/site/use-cases/social/update-social-settings.types.ts
 * @intro Types du use-case `UpdateSocialSettings`.
 * @description
 * Contrats d’entrées/sorties et dépendances injectées (repo site + state).
 * Module **types-only** : aucune dépendance/runtime pour préserver la propreté du domaine.
 * La validation de **forme** est assurée en amont (frontière API via Zod).
 * @remarks
 * - `state` reçoit son défaut (`"draft"`) dans l’implémentation du use-case.
 * @layer domain/use-case
 */

import type { ContentState } from "@/core/domain/constants/common";
import type { SocialSettingsDTO } from "@/core/domain/site/dto";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import type { SiteRepository } from "@/core/domain/site/ports/site-repository";

/** Dépendances nécessaires au use-case. */
export interface UpdateSocialSettingsDeps {
  /** Dépôt agrégat “site” (index + settings). */
  repo: SiteRepository;
}

/** Données d’entrée : patch partiel + espace logique (défaut appliqué dans le use-case). */
export interface UpdateSocialSettingsInput {
  /** Patch partiel appliqué aux liens sociaux (ex: `{ items: [...] }`). */
  patch: Partial<SocialSettingsDTO>;
  /** Espace de contenu ciblé. */
  state?: ContentState;
}

/** Données de sortie : réglages complets après mise à jour. */
export interface UpdateSocialSettingsResult {
  /** Réglages du site persistés après application du patch. */
  settings: SiteSettings;
}

// /** Runner type pour parité DI/tests */
// export type RunUpdateSocialSettings = (
//   input: UpdateSocialSettingsInput
// ) => Promise<UpdateSocialSettingsResult>;
