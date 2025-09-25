/**
 * @file src/core/domain/errors/codes.ts
 * @intro Codes d'erreur métier (union fermée), post-validation & cross-field.
 * @layer domain/errors
 * @sot docs/bible/domain/errors/README.md#codes
 * @description
 * - Source de vérité des `ErrorCode` consommés par use-cases, API et UI.
 * - Complète les erreurs de **forme** (schémas) qui doivent utiliser l’i18n `validation.*`.
 * - Toute nouvelle entrée doit être ajoutée au catalogue i18n (FR/EN).
 * @remarks
 * - Étendre ici d’abord, puis synchroniser : i18n, mappings API/UI, tests.
 */

export const ERROR_CODES = {
  // ——— Generic ———
  UNKNOWN: "UNKNOWN",
  INTERNAL: "INTERNAL",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",

  /** Erreur de validation au sens métier (post-parse / cross-field). */
  VALIDATION_ERROR: "VALIDATION_ERROR",

  // ——— Site Index ———
  SITE_INDEX_DUPLICATE_ID: "SITE_INDEX_DUPLICATE_ID",
  SITE_INDEX_DUPLICATE_SLUG: "SITE_INDEX_DUPLICATE_SLUG",
  SITE_INDEX_MISSING_PAGE_ID: "SITE_INDEX_MISSING_PAGE_ID",
  SITE_INDEX_MISSING_PAGE_SLUG: "SITE_INDEX_MISSING_PAGE_SLUG",
  DOMAIN_RULE_VIOLATION: "DOMAIN_RULE_VIOLATION",

  // ——— Page ———
  PAGE_NOT_FOUND: "PAGE_NOT_FOUND",
  PAGE_TITLE_REQUIRED: "PAGE_TITLE_REQUIRED",
  PAGE_SLUG_REQUIRED: "PAGE_SLUG_REQUIRED",
  PAGE_CURRENT_SLUG_REQUIRED: "PAGE_CURRENT_SLUG_REQUIRED",
  PAGE_SLUG_INVALID_FORMAT: "PAGE_SLUG_INVALID_FORMAT",
  PAGE_SLUG_RESERVED: "PAGE_SLUG_RESERVED",

  // ——— Identity ———
  IDENTITY_TITLE_REQUIRED_WHEN_NO_LOGO: "IDENTITY_TITLE_REQUIRED_WHEN_NO_LOGO",

  // ——— Menu ———
  MENU_EMPTY_LABEL: "MENU_EMPTY_LABEL",
  MENU_EMPTY_HREF: "MENU_EMPTY_HREF",
  MENU_TOO_MANY_ITEMS: "MENU_TOO_MANY_ITEMS",

  // ——— Social ———
  SOCIAL_INVALID_FOR_PLATFORM: "SOCIAL_INVALID_FOR_PLATFORM",
  SOCIAL_ABSOLUTE_REQUIRED: "SOCIAL_ABSOLUTE_REQUIRED",
  SOCIAL_INVALID_HREF: "SOCIAL_INVALID_HREF",

  // ——— Publish ———
  PUBLISH_IDENTICAL_STATES: "PUBLISH_IDENTICAL_STATES",
  PUBLISH_SETTINGS_COPY_FAILED: "PUBLISH_SETTINGS_COPY_FAILED",
  PUBLISH_PAGE_MISSING: "PUBLISH_PAGE_MISSING",
  PUBLISH_EMPTY_INDEX: "PUBLISH_EMPTY_INDEX",

  // ——— SEO ———
  SEO_INVALID_BASE_URL: "SEO_INVALID_BASE_URL",
  SEO_TITLE_TOO_LONG: "SEO_TITLE_TOO_LONG",
  SEO_TITLE_TEMPLATE_TOO_LONG: "SEO_TITLE_TEMPLATE_TOO_LONG",
  SEO_TITLE_TEMPLATE_MISSING_PLACEHOLDER:
    "SEO_TITLE_TEMPLATE_MISSING_PLACEHOLDER",
  SEO_DESCRIPTION_TOO_LONG: "SEO_DESCRIPTION_TOO_LONG",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/** Garde de type : sécurise adapters/API lorsqu’un code provient d’une source externe. */
export function isErrorCode(v: unknown): v is ErrorCode {
  return (
    typeof v === "string" &&
    (Object.values(ERROR_CODES) as readonly string[]).includes(v)
  );
}
