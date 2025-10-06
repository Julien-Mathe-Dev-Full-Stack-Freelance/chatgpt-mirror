/**
 * @file src/core/domain/site/defaults/header.ts
 * @intro Defaults — HeaderSettings (V0.5)
 * @layer domain/defaults
 * @description
 * Valeurs par défaut **métier** pour la configuration du header (V0.5).
 * Portée validée :
 * - showLogo, showTitle, sticky, blur, swapPrimaryAndSocial
 *
 * Règles :
 * - Domaine pur (aucune dépendance aux DTO).
 * - Immutabilité runtime : `deepFreeze` pour le default canonique.
 * - Helper domaine `buildHeaderSettings` pour composer un objet avec overrides sûrs.
 * - Pas d’options de design (height, container) en V0.5.
 */

import type { HeaderSettings } from "@/core/domain/site/entities/header";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

/** Flags par défaut (réutilisables pour composer un objet HeaderSettings). */
const DEFAULT_HEADER_FLAGS = deepFreeze({
  showLogo: true,
  showTitle: true,
  sticky: true,
  blur: true,
  swapPrimaryAndSocial: false,
});

/**
 * Helper domaine : construit un HeaderSettings avec des overrides optionnels.
 * @remarks
 * - Ne fige pas le résultat (appelant libre de modifier son instance locale).
 * - Les valeurs *canoniques* gelées restent `DEFAULT_HEADER_SETTINGS`.
 */
export function buildHeaderSettings(): HeaderSettings {
  return {
    ...DEFAULT_HEADER_FLAGS,
  };
}

/** Default canonique (gelé au runtime). */
export const DEFAULT_HEADER_SETTINGS: HeaderSettings = deepFreeze({
  ...DEFAULT_HEADER_FLAGS,
});
