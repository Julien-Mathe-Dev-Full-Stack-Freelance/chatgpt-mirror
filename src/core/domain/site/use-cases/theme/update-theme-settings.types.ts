/**
 * @file src/core/domain/site/use-cases/theme/update-theme-settings.types.ts
 * @intro Types du use-case `UpdateThemeSettings`.
 * @description
 * Contrats d’entrées/sorties et dépendances injectées (repo site + state).
 * Module **types-only** : aucune valeur runtime afin de préserver la propreté du domaine.
 * La validation de **forme** (min/max, enum…) est assurée à la frontière API via Zod.
 * @remarks
 * - Le défaut de `state` (`"draft"`) est appliqué dans l’implémentation du use-case.
 * @layer domain/use-case
 */

import type { ContentState } from "@/core/domain/constants/common";
import type { ThemeSettingsDTO } from "@/core/domain/site/dto";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import type { SiteRepository } from "@/core/domain/site/ports/site-repository";

/** Dépendances nécessaires au use-case. */
export interface UpdateThemeSettingsDeps {
  /** Dépôt agrégat “site” (index + settings). */
  repo: SiteRepository;
}

/** Données d’entrée : patch partiel + espace logique (défaut appliqué dans le use-case). */
export interface UpdateThemeSettingsInput {
  /** Patch partiel appliqué au thème (ex. `{ themeMode, themePalette }`). */
  patch: Partial<ThemeSettingsDTO>;
  /** Espace de contenu ciblé. */
  state?: ContentState;
}

/** Données de sortie : réglages complets après mise à jour. */
export interface UpdateThemeSettingsResult {
  /** Réglages du site persistés après application du patch. */
  settings: SiteSettings;
}

// /** Runner type pour parité DI/tests */
// export type RunUpdateThemeSettings = (
//   input: UpdateThemeSettingsInput
// ) => Promise<UpdateThemeSettingsResult>;
