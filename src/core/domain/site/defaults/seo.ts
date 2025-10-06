/**
 * @file src/core/domain/site/defaults/seo.ts
 * @intro Defaults — SeoSettings (V0.5)
 * @layer domain/defaults
 * @description
 * Valeurs par défaut **métier** pour la configuration SEO.
 *
 * Règles :
 * - Domaine pur (aucune dépendance aux DTO).
 * - Pas de couplage à l’identité → `defaultTitle`/`defaultDescription` restent vides.
 * - Template par défaut minimal = placeholder seul ("%s").
 * - Immutabilité runtime : `deepFreeze` pour le default canonique.
 * - Helper domaine `buildSeoSettings` pour composer un objet avec overrides sûrs.
 */

import type { SeoSettings } from "@/core/domain/site/entities/seo";
import {
  TITLE_PLACEHOLDER,
  TWITTER_CARD_TYPES,
  type TwitterCardType,
} from "@/core/domain/site/seo/constants";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

/** Flags/valeurs par défaut (réutilisables pour composer un SeoSettings). */
const DEFAULT_SEO_FLAGS = deepFreeze({
  titleTemplate: TITLE_PLACEHOLDER,
  robots: "index,follow",
  structuredDataEnabled: true,
  twitter: { card: TWITTER_CARD_TYPES[1] as TwitterCardType }, // "summary_large_image"
});

/**
 * Helper domaine : construit un SeoSettings avec des overrides optionnels.
 * @remarks
 * - Ne fige pas le résultat (appelant libre de modifier son instance locale).
 * - Les valeurs *canoniques* gelées restent `DEFAULT_SEO_SETTINGS`.
 */
export function buildSeoSettings(
  defaultTitle: string,
  defaultDescription: string
): SeoSettings {
  return {
    defaultTitle,
    defaultDescription,
    ...DEFAULT_SEO_FLAGS,
  };
}

/** Default canonique (gelé au runtime). */
export const DEFAULT_SEO_SETTINGS: SeoSettings = deepFreeze({
  defaultTitle: "",
  defaultDescription: "",
  ...DEFAULT_SEO_FLAGS,
});
