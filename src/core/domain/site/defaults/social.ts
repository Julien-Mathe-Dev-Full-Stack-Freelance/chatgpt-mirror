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
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

/** Defaults canoniques */
const EMPTY_SOCIAL_ITEMS: SocialItem[] = [];
export const DEFAULT_SOCIAL_ITEMS: ReadonlyArray<SocialItem> =
  deepFreeze(EMPTY_SOCIAL_ITEMS);
export const DEFAULT_SOCIAL_SETTINGS: SocialSettings = deepFreeze({
  items: DEFAULT_SOCIAL_ITEMS,
} satisfies SocialSettings);
