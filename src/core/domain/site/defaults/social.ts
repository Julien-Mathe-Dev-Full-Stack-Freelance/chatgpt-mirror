/**
 * @file src/core/domain/site/defaults/social.ts
 * @intro Defaults — liens sociaux (domaine)
 * @layer domain/defaults
 * @remarks
 * - Types métier locaux (pas de DTO ici).
 * - Immutabilité runtime : `deepFreeze`.
 * - Helper standard : `withDefaults*`.
 * - La validation (schemas/URL par plateforme) vit ailleurs ; ici on ne fait que fournir des valeurs initiales.
 */

import type {
  SocialItem,
  SocialSettings,
} from "@/core/domain/site/entities/social";
import type { SocialKind } from "@/core/domain/site/social/constants";
import { asBrandedHref } from "@/core/domain/urls/tools";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

/** Helper domaine : construit un item social *valide côté SoT* (href brandé). */
export function buildSocialItem(kind: SocialKind, rawHref: string): SocialItem {
  return {
    kind,
    href: asBrandedHref(rawHref),
  };
}

/** Default canonique (vide) : la route GET pourra injecter un seed i18n “seed-once”. */
export const DEFAULT_SOCIAL_SETTINGS: SocialSettings = deepFreeze({
  items: [],
});
