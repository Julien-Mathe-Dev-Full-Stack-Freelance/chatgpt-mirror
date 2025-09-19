/**
 * @file src/i18n/locales/errors/en.ts
 * @intro i18n — errors EN (ErrorCode → message)
 * @layer i18n/core
 * @sot docs/bible/ui/i18n-catalogue.md
 */
import type { ErrorCode } from "@/core/domain/errors/codes";

const enErrors: Partial<Record<ErrorCode, string>> = {
  // Generic
  UNKNOWN: "An error occurred.",
  INTERNAL: "Unexpected internal error.",
  NOT_FOUND: "Resource not found.",
  UNAUTHORIZED: "You are not authorized.",
  FORBIDDEN: "Access is forbidden.",
  CONFLICT: "Conflict with existing data.",

  VALIDATION_ERROR: "Validation error.",

  // Site Index
  SITE_INDEX_DUPLICATE_ID: "Duplicate id.",
  SITE_INDEX_DUPLICATE_SLUG: "Duplicate slug.",
  SITE_INDEX_MISSING_PAGE_ID: "Missing id.",
  SITE_INDEX_MISSING_PAGE_SLUG: "Missing slug.",
  DOMAIN_RULE_VIOLATION: "Domain rule violation.",

  // Identity
  IDENTITY_TITLE_REQUIRED_WHEN_NO_LOGO: "Title is required when no logo.",

  // Menu
  MENU_EMPTY_LABEL: "Label is required.",
  MENU_EMPTY_HREF: "Link is required.",
  MENU_TOO_MANY_ITEMS: "Navigation cannot contain more than {max} items.",

  // Page
  PAGE_NOT_FOUND: "Page not found.",
  PAGE_TITLE_REQUIRED: "Title is required.",
  PAGE_SLUG_REQUIRED: "Slug is required.",
  PAGE_CURRENT_SLUG_REQUIRED: "Current slug is required.",
  PAGE_SLUG_INVALID_FORMAT: "Slug is invalid.",
  PAGE_SLUG_RESERVED: "Slug is reserved.",

  // Social
  SOCIAL_INVALID_FOR_PLATFORM: "Invalid for platform.",
  SOCIAL_ABSOLUTE_REQUIRED: "Absolute URL required.",
  SOCIAL_INVALID_HREF: "Invalid URL.",

  // Publish
  PUBLISH_IDENTICAL_STATES: "Nothing to publish: states are identical.",
  PUBLISH_SETTINGS_COPY_FAILED:
    "Failed to copy settings to the published site.",
  PUBLISH_PAGE_MISSING: "Some pages to publish are missing.",
  PUBLISH_EMPTY_INDEX: "Empty index.",

  // SEO
  SEO_INVALID_BASE_URL: "Base URL must be a valid http(s) URL.",
  SEO_TITLE_TOO_LONG: "Title must not exceed {max} characters.",
  SEO_TITLE_TEMPLATE_TOO_LONG:
    "Title template must not exceed {max} characters.",
  SEO_TITLE_TEMPLATE_MISSING_PLACEHOLDER: 'Template must contain "%s".',
  SEO_DESCRIPTION_TOO_LONG: "Description must not exceed {max} characters.",
};

export default enErrors;
