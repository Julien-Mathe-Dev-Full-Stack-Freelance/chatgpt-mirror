/**
 * @file src/core/domain/site/use-cases/identity/update-identity-settings.errors.ts
 * @intro Erreurs métier pour `UpdateIdentitySettings`.
 * @description
 * Étend `DomainError` afin d’exposer un `code` stable (`ErrorCode`) pour le mappage API/UI.
 * Aucune logique métier ici : typage et transport d’informations d’erreur uniquement.
 * @remarks
 * - Les codes sont stables (contrat UI/API/analytics).
 * - Ne pas exposer `details` tel quel à l’UI (contexte technique/loggable seulement).
 * @layer domain/use-case
 */

import type { ErrorCode } from "@/core/domain/errors/codes";
import { DomainError, isDomainError } from "@/core/domain/errors/domain-error";

/** Nom stable (sérialisable). */
const UPDATE_IDENTITY_SETTINGS_ERROR_NAME =
  "UpdateIdentitySettingsError" as const;

/** Erreur métier levée lors d’un échec de mise à jour de l’identité. */
export class UpdateIdentitySettingsError extends DomainError {
  constructor(
    code: ErrorCode,
    message?: string,
    details?: unknown,
    cause?: unknown
  ) {
    super({ code, message, details, cause });
    this.name = UPDATE_IDENTITY_SETTINGS_ERROR_NAME;
  }
}

export function isUpdateIdentitySettingsError(
  err: unknown
): err is UpdateIdentitySettingsError {
  return isDomainError(err) && err.name === UPDATE_IDENTITY_SETTINGS_ERROR_NAME;
}
