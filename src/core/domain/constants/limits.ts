/**
 * @file src/core/domain/constants/limits.ts
 * @intro Limites métier normalisées (longueurs, tailles, quotas).
 * @layer domain/constants
 * @sot docs/bible/domain/constants/README.md#limits
 * @description
 * - Source de vérité centralisée pour les bornes (titres, SEO, menus, contenus, URLs).
 * - Évite les « magic numbers » et synchronise UI / schémas / use-cases.
 * - Domaine pur : aucune dépendance UI/infra, aucun side-effect.
 * @remarks
 * - Garder ces valeurs cohérentes avec les validations Zod et les composants d’édition.
 * - En cas d’évolution, mettre à jour la doc SoT et les tests associés.
 */

// ───────────────────────────────────────────────────────────────────────────────
// Titres (site/page) et identité
// - Bornes génériques pour des textes courts visibles en header/SEO.
// - L’UI peut afficher un compteur/feedback basé sur ces bornes.
// ───────────────────────────────────────────────────────────────────────────────
// export const SITE_TITLE_MIN = 2 as const;
// export const SITE_TITLE_MAX = 80 as const;

export const PAGE_TITLE_MIN = 2 as const;
export const PAGE_TITLE_MAX = 80 as const;

// ───────────────────────────────────────────────────────────────────────────────
// SEO (title, template, description)
// - Rappels usuels : ~60/160 chars pour l’affichage SERP.
// - Les limites exactes peuvent évoluer selon les recommandations SEO internes.
// ───────────────────────────────────────────────────────────────────────────────
export const SEO_TITLE_MIN = 1 as const;
export const SEO_TITLE_MAX = 60 as const;

export const SEO_TITLE_TEMPLATE_MIN = 2 as const;
export const SEO_TITLE_TEMPLATE_MAX = 120 as const;

export const SEO_DESCRIPTION_MIN = 1 as const;
export const SEO_DESCRIPTION_MAX = 160 as const;

export const SEO_OG_DESCRIPTION_MAX = 160 as const;

// ───────────────────────────────────────────────────────────────────────────────
// Menus & Socials
// - Label = texte d’ancre ; limiter la longueur pour éviter les débordements.
// - Quotas d’items pour conserver une navigation maniable.
// ───────────────────────────────────────────────────────────────────────────────
export const MENU_LABEL_MIN = 2 as const;
export const MENU_LABEL_MAX = 40 as const;

export const MENU_ITEM_MAX = 20 as const;
export const SOCIAL_ITEM_MAX = 20 as const;

// ───────────────────────────────────────────────────────────────────────────────
// Blocs — contenu textuel & images
// - Les limites évitent des blocs trop lourds en édition/rendu.
// - `alt`/caption bornés pour guider l’accessibilité et l’UI.
// ───────────────────────────────────────────────────────────────────────────────
// export const TEXT_BLOCK_CONTENT_MIN = 1 as const;
// export const TEXT_BLOCK_CONTENT_MAX = 5000 as const;

// export const IMAGE_ALT_MIN = 1 as const;
// export const IMAGE_ALT_MAX = 160 as const;

// export const IMAGE_CAPTION_MIN = 1 as const;
// export const IMAGE_CAPTION_MAX = 240 as const;

// ───────────────────────────────────────────────────────────────────────────────
// Footer
// - Texte court de copyright ou mention légale.
// ───────────────────────────────────────────────────────────────────────────────
// export const FOOTER_COPYRIGHT_MIN = 1 as const;
export const FOOTER_COPYRIGHT_MAX = 160 as const;

// ───────────────────────────────────────────────────────────────────────────────
/** Slugs & opérations
 * - `SLUG_MIN = 1` cohérent avec `SLUG_FINAL_RE` (a–z, 0–9, tirets).
 * - `MIN_PAGES_COPIED` = garde-fou logique (orchestration use-cases).
 */
// ───────────────────────────────────────────────────────────────────────────────
export const SLUG_MIN = 1 as const;

export const MIN_PAGES_COPIED = 0 as const;

// ───────────────────────────────────────────────────────────────────────────────
// Warnings de publication
// - Messages concis à l’admin avant publication (bornes UI).
// ───────────────────────────────────────────────────────────────────────────────
export const PUBLISH_WARNING_MIN = 1 as const;
export const PUBLISH_WARNING_MAX = 240 as const;

// ───────────────────────────────────────────────────────────────────────────────
// Identité
// - Titre du site
// ───────────────────────────────────────────────────────────────────────────────
export const IDENTITY_TITLE_MIN = 1 as const;
export const IDENTITY_TITLE_MAX = 80 as const;

export const TAGLINE_MAX = 160 as const;
export const LOGO_ALT_MAX = 120;
