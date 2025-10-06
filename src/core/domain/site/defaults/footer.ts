/**
 * @file src/core/domain/site/defaults/footer.ts
 * @intro Defaults — FooterSettings (V0.5)
 * @layer domain/defaults
 * @description
 * Valeurs par défaut **métier** pour la configuration du footer (V0.5).
 * Portée validée :
 * - copyright: string
 * - showYear: boolean
 *
 * Règles :
 * - Domaine pur (aucune dépendance aux DTO).
 * - Immutabilité runtime : `deepFreeze` pour le default canonique.
 * - Helper domaine `buildFooterSettings` pour composer un objet avec overrides sûrs.
 * - Pas d’options de design (height, container) en V0.5.
 */

import type { FooterSettings } from "@/core/domain/site/entities/footer";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

/** Flags/valeurs par défaut (réutilisables pour composer un objet FooterSettings). */
const DEFAULT_FOOTER_FLAGS = deepFreeze({
  /** Afficher l’année courante avec le copyright. */
  showYear: true,
});

/**
 * Helper domaine : construit un FooterSettings avec des overrides optionnels.
 * @remarks
 * - Ne fige pas le résultat (appelant libre de modifier son instance locale).
 * - Les valeurs *canoniques* gelées restent `DEFAULT_FOOTER_SETTINGS`.
 */
export function buildFooterSettings(copyright: string): FooterSettings {
  return {
    copyright,
    ...DEFAULT_FOOTER_FLAGS,
  };
}

/** Default canonique (gelé au runtime). */
export const DEFAULT_FOOTER_SETTINGS: FooterSettings = deepFreeze({
  copyright: "",
  ...DEFAULT_FOOTER_FLAGS,
});
