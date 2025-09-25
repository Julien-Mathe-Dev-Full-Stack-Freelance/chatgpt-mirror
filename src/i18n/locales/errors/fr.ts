/**
 * @file src/i18n/locales/errors/fr.ts
 * @intro i18n — erreurs FR (ErrorCode → message)
 * @layer i18n/core
 * @sot docs/bible/ui/i18n-catalogue.md
 */
import type { ErrorCode } from "@/core/domain/errors/codes";

const frErrors: Partial<Record<ErrorCode, string>> = {
  // Generic
  UNKNOWN: "Une erreur est survenue.",
  INTERNAL: "Erreur interne inattendue.",
  NOT_FOUND: "Ressource introuvable.",
  UNAUTHORIZED: "Vous n’êtes pas autorisé.",
  FORBIDDEN: "Accès interdit.",
  CONFLICT: "Conflit avec des données existantes.",

  VALIDATION_ERROR: "Erreur de validation.",

  // Site Index
  SITE_INDEX_DUPLICATE_ID: "Id en double.",
  SITE_INDEX_DUPLICATE_SLUG: "Slug en double.",
  SITE_INDEX_MISSING_PAGE_ID: "Id manquant.",
  SITE_INDEX_MISSING_PAGE_SLUG: "Slug manquant.",
  DOMAIN_RULE_VIOLATION: "Violation de règle métier.",

  // Identity
  IDENTITY_TITLE_REQUIRED_WHEN_NO_LOGO: "Le titre est requis quand aucun logo.",

  // Menu
  MENU_EMPTY_LABEL: "Le libellé est requis.",
  MENU_EMPTY_HREF: "Le lien est requis.",
  MENU_TOO_MANY_ITEMS:
    "La navigation ne peut pas contenir plus de {max} éléments.",

  // Page
  PAGE_NOT_FOUND: "Page introuvable.",
  PAGE_TITLE_REQUIRED: "Le titre est requis.",
  PAGE_SLUG_REQUIRED: "Le slug est requis.",
  PAGE_CURRENT_SLUG_REQUIRED: "Le slug actuel est requis.",
  PAGE_SLUG_INVALID_FORMAT: "Le slug est invalide.",
  PAGE_SLUG_RESERVED: "Le slug est réservé.",

  // Social
  SOCIAL_INVALID_FOR_PLATFORM: "Plateforme invalide.",
  SOCIAL_ABSOLUTE_REQUIRED: "URL absolue requise.",
  SOCIAL_INVALID_HREF: "URL invalide.",

  // Publish
  PUBLISH_IDENTICAL_STATES: "Rien à publier : les états sont identiques.",
  PUBLISH_SETTINGS_COPY_FAILED:
    "Échec de la copie des réglages vers la version publiée.",
  PUBLISH_PAGE_MISSING: "Certaines pages à publier sont manquantes.",

  // SEO
  SEO_INVALID_BASE_URL: "L’URL de base doit être une URL http(s) valide.",
  SEO_TITLE_TOO_LONG: "Le titre ne doit pas dépasser {max} caractères.",
  SEO_TITLE_TEMPLATE_TOO_LONG:
    "Le modèle de titre ne doit pas dépasser {max} caractères.",
  SEO_TITLE_TEMPLATE_MISSING_PLACEHOLDER: "Le modèle doit contenir « %s ».",
  SEO_DESCRIPTION_TOO_LONG:
    "La description ne doit pas dépasser {max} caractères.",

  // Publish
  PUBLISH_EMPTY_INDEX: "L’index est vide.",
};

export default frErrors;
