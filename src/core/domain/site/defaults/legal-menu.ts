/**
 * @file src/core/domain/site/defaults/legal-menu.ts
 * @intro Defaults — menu légal (domaine)
 * @layer domain/defaults
 * @remarks
 * - Type métier local (pas de DTO ici).
 * - Les éléments localisés par défaut (Mentions/Cookies) sont fournis
 *   par l’adapter i18n : voir `src/i18n/builders.ts#makeLocalizedLegalMenuDefaults`.
 * - Immutabilité runtime : `deepFreeze`.
 * - Helper standard : `withDefaults*`.
 */

import { deepFreeze } from "@/core/domain/utils/deep-freeze";
import type { LegalMenuSettings } from "@/core/domain/site/entities/legal-menu";

/** Default canonique (vide) : l’UI peut injecter des items localisés. */
export const DEFAULT_LEGAL_MENU_SETTINGS: LegalMenuSettings = deepFreeze({
  items: [],
} satisfies LegalMenuSettings);

// (Pas de dev-check spécifique ici : la liste vide est volontaire.)
