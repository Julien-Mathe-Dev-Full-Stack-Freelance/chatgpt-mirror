/**
 * @file src/core/domain/seo/constants.ts
 * @intro Constantes SEO (types, constantes)
 * @description
 * Déclare les valeurs supportées pour les **paramètres SEO**.
 * Sert de source unique de vérité côté admin et site public.
 *
 * @layer domain/constants
 */

export const TWITTER_CARD_TYPES = ["summary", "summary_large_image"] as const;
export type TwitterCardType = (typeof TWITTER_CARD_TYPES)[number];

export const TITLE_PLACEHOLDER = "%s" as const;

/** Détection simple du placeholder requis. */
export const TITLE_PLACEHOLDER_RE = /%s/;
