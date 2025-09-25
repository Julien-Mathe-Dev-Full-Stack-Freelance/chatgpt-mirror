/**
 * @file src/core/domain/site/defaults/seo.ts
 * @intro Defaults — réglages SEO (domaine)
 * @layer domain/defaults
 * @remarks
 * - Type métier local (pas de DTO ici).
 * - Pas de couplage à l’identité : on laisse `defaultTitle` vide par défaut.
 * - Template par défaut minimal = placeholder seul (`%s`).
 * - Immutabilité runtime : `deepFreeze`.
 * - Helper standard : `withDefaults*`.
 */

import type { SeoSettings } from "@/core/domain/site/entities/seo";
import {
  TWITTER_CARD_TYPES,
  type TwitterCardType,
} from "@/core/domain/site/seo/constants";
import { ERROR_CODES } from "@/core/domain/errors/codes";
import { DomainError } from "@/core/domain/errors/domain-error";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

/** Constantes canoniques réutilisables */
export const DEFAULT_TWITTER_CARD: TwitterCardType = TWITTER_CARD_TYPES[0];

/** Defaults gelés */
export const DEFAULT_SEO_SETTINGS: SeoSettings = deepFreeze({
  twitter: { card: DEFAULT_TWITTER_CARD },
} satisfies SeoSettings);

/* Dev-only : garde de parité si le tuple évolue */
if (process.env.NODE_ENV !== "production") {
  const inSet = (value: string, set: readonly string[]) => set.includes(value);
  if (!inSet(DEFAULT_TWITTER_CARD, TWITTER_CARD_TYPES as readonly string[])) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message: `[defaults/seo] twitter.card inconnu: ${DEFAULT_TWITTER_CARD}`,
    });
  }
}
