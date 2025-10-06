/**
 * @file i18n — Messages d’erreur mappés par ErrorCode (FR)
 * @remarks
 * - Mapping partiel (Partial<Record<ErrorCode, string>>)
 * - Ajoute/complète au fil des besoins; les codes non mappés tomberont sur un fallback générique côté UI.
 */

const frErrors = {
  // ---- Validation/forme (Zod, payloads invalides) ----
  VALIDATION_ERROR: "Certains champs sont invalides.",
  BAD_REQUEST: "Requête invalide.",

  // ---- Auth / permissions ----
  UNAUTHORIZED: "Vous devez être connecté(e) pour effectuer cette action.",
  FORBIDDEN: "Vous n’avez pas les droits pour effectuer cette action.",

  // ---- Ressources / I/O ----
  NOT_FOUND: "Ressource introuvable.",
  INTERNAL: "Erreur interne inattendue. Réessayez plus tard.",

  // ---- Upload média (/api/admin/media/upload) ----
  UNSUPPORTED_MEDIA_TYPE: "Le fichier doit être une image (image/*).",
  EMPTY_FILE: "Le fichier est vide.",
  PAYLOAD_TOO_LARGE: "Fichier trop volumineux.",

  // (Ajoutez ici d’autres codes spécifiques domaine au besoin)
} as const;

export default frErrors;
