/**
 * @file src/core/domain/site/use-cases/seo/update-seo-settings.errors.ts
 * @intro Erreurs métier pour `UpdateSeoSettings`.
 * @description
 * Étend `DomainError` afin d’exposer un `code` stable (`ErrorCode`) pour le mappage API/UI.
 * Aucune logique métier ici : typage et transport d’informations d’erreur uniquement.
 * @remarks
 * - Les codes sont stables (contrat UI/API/analytics).
 * - Ne pas exposer `details` tel quel à l’UI (contexte technique/loggable seulement).
 * @layer domain/use-case
 */

import { DomainError, isDomainError } from "@/core/domain/errors/domain-error";
import type { ErrorCode } from "@/core/domain/errors/codes";

/** Nom stable (sérialisable). */
const UPDATE_SEO_SETTINGS_ERROR_NAME = "UpdateSeoSettingsError" as const;

/** Erreur métier levée lors d’un échec de mise à jour des réglages SEO. */
export class UpdateSeoSettingsError extends DomainError {
  constructor(
    code: ErrorCode,
    message?: string,
    details?: unknown,
    cause?: unknown
  ) {
    super({ code, message, details, cause });
    this.name = UPDATE_SEO_SETTINGS_ERROR_NAME;
  }
}

export function isUpdateSeoSettingsError(
  err: unknown
): err is UpdateSeoSettingsError {
  return isDomainError(err) && err.name === UPDATE_SEO_SETTINGS_ERROR_NAME;
}
