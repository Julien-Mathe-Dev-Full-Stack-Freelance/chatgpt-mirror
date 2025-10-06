/**
 * @file src/core/domain/errors/codes.ts
 * @intro Codes d'erreur métier (union fermée), post-validation & cross-field.
 * @layer domain/errors
 * @sot docs/bible/domain/errors/README.md#codes
 * @description
 * - SoT des `ErrorCode` consommés par use-cases, API et UI.
 * - Complète les erreurs de **forme** (schémas → i18n `validation.*`).
 * - Toute nouvelle entrée doit être ajoutée au catalogue i18n (FR/EN).
 */

export const ERROR_CODES = {
  // ——— Generic ———
  UNKNOWN: "UNKNOWN",
  INTERNAL: "INTERNAL",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",

  /** Erreur métier de validation (post-parse / cross-field). */
  VALIDATION_ERROR: "VALIDATION_ERROR",

  /** Garde-fou générique côté domaine. */
  INVALID_ARGUMENT: "INVALID_ARGUMENT",

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
  /** Publication : title requis (bloquant). */
  IDENTITY_TITLE_REQUIRED: "IDENTITY_TITLE_REQUIRED",
  /** Publication : logoAlt requis (bloquant). */
  IDENTITY_LOGO_ALT_REQUIRED: "IDENTITY_LOGO_ALT_REQUIRED",
  /** Warning : aucun logo configuré (observabilité). */
  IDENTITY_LOGO_MISSING: "IDENTITY_LOGO_MISSING",
  /** (legacy conservé si déjà utilisé) */
  IDENTITY_TITLE_REQUIRED_WHEN_NO_LOGO: "IDENTITY_TITLE_REQUIRED_WHEN_NO_LOGO",

  // ——— Menu ———
  MENU_EMPTY_LABEL: "MENU_EMPTY_LABEL",
  MENU_EMPTY_HREF: "MENU_EMPTY_HREF",
  MENU_TOO_MANY_ITEMS: "MENU_TOO_MANY_ITEMS",

  // ——— Social ———
  SOCIAL_DUPLICATE_KIND: "SOCIAL_DUPLICATE_KIND",
  SOCIAL_INVALID_FOR_PLATFORM: "SOCIAL_INVALID_FOR_PLATFORM",
  SOCIAL_ABSOLUTE_REQUIRED: "SOCIAL_ABSOLUTE_REQUIRED",
  SOCIAL_INVALID_HREF: "SOCIAL_INVALID_HREF",

  // ——— Publish ———
  PUBLISH_IDENTICAL_STATES: "PUBLISH_IDENTICAL_STATES",
  PUBLISH_SETTINGS_COPY_FAILED: "PUBLISH_SETTINGS_COPY_FAILED",
  PUBLISH_PAGE_MISSING: "PUBLISH_PAGE_MISSING",
  PUBLISH_EMPTY_INDEX: "PUBLISH_EMPTY_INDEX",

  // ——— SEO ———
  /** Publication : defaultTitle requis (bloquant). */
  SEO_TITLE_REQUIRED: "SEO_TITLE_REQUIRED",
  /** Publication : titleTemplate doit contenir %s (si défini). */
  SEO_TITLE_TEMPLATE_MISSING_PLACEHOLDER:
    "SEO_TITLE_TEMPLATE_MISSING_PLACEHOLDER",
  /** Publication : baseUrl invalide (parse). */
  SEO_BASEURL_INVALID: "SEO_BASEURL_INVALID",
  /** Publication : baseUrl doit être https en prod. */
  SEO_BASEURL_HTTPS_REQUIRED: "SEO_BASEURL_HTTPS_REQUIRED",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/** Garde de type : sécurise adapters/API lorsqu’un code provient d’une source externe. */
export function isErrorCode(v: unknown): v is ErrorCode {
  return (
    typeof v === "string" &&
    (Object.values(ERROR_CODES) as readonly string[]).includes(v)
  );
}
