/**
 * @file src/core/domain/site/social/constants.ts
 * @intro Constantes des réseaux sociaux supportés (IDs stables)
 * @description
 * Source of truth **domaine** : liste des plateformes, IDs stables et règles de schéma.
 * Aucune i18n ici — les libellés/options viennent des factories i18n (voir `src/i18n/factories/admin/social.ts`).
 *
 * @layer domain/constants
 * @remarks
 * - **Stabilité des IDs** : ne pas renommer (ex: "x" pour Twitter) sans migration.
 * - **Ordre** : liste alphabétique pour faciliter la relecture.
 */

export const SOCIAL_KINDS = [
  "behance",
  "dribbble",
  "email",
  "facebook",
  "github",
  "instagram",
  "linkedin",
  "pinterest",
  "soundcloud",
  "spotify",
  "tiktok",
  "website",
  "x", // ex-Twitter
  "youtube",
] as const;

/** Union littérale des plateformes supportées (dérivée de `SOCIAL_KINDS`). */
export type SocialKind = (typeof SOCIAL_KINDS)[number];

export const SOCIAL_KIND_EMAIL = "email" as const;
export const SOCIAL_KIND_WEBSITE = "website" as const;

/** Mapping extensible des schémas d’URL par plateforme (email → mailto:). */
// export const SCHEME_BY_KIND = {
//   [SOCIAL_KIND_EMAIL]: "mailto:",
// } as const;

export const DEFAULT_SOCIAL_KIND = "website" as const;
export const DEFAULT_SOCIAL_HREF = "https://" as const;

// export const isSocialKind = (v: string): v is SocialKind =>
//   (SOCIAL_KINDS as readonly string[]).includes(v);
