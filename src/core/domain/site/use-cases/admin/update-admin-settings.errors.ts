/**
 * @file src/core/domain/site/use-cases/admin/update-admin-settings.errors.ts
 * @intro Erreurs métier pour `UpdateAdminSettings`.
 * @description
 * Étend `DomainError` afin d’exposer un `code` stable (`ErrorCode`) pour le mappage API/UI.
 * Aucune logique métier ici : typage et transport d’informations d’erreur uniquement.
 * @remarks
 * - Les codes sont stables (contrat UI/API/analytics).
 * - Ne pas exposer `details` tel quel à l’UI (contexte technique/loggable seulement).
 * @layer domain/use-case
 */

import { DomainError } from "@/core/domain/errors/domain-error";
import type { ErrorCode } from "@/core/domain/errors/codes";
import { isDomainError } from "@/core/domain/errors/domain-error";

/** Nom stable (sérialisable) */
const UPDATE_ADMIN_SETTINGS_ERROR_NAME = "UpdateAdminSettingsError" as const;

export class UpdateAdminSettingsError extends DomainError {
  constructor(
    code: ErrorCode,
    message?: string,
    details?: unknown,
    cause?: unknown
  ) {
    super({ code, message, details, cause });
    this.name = UPDATE_ADMIN_SETTINGS_ERROR_NAME;
  }
}

/** Guard realm-safe (pas d’instanceof) */
export function isUpdateAdminSettingsError(
  err: unknown
): err is UpdateAdminSettingsError {
  return isDomainError(err) && err.name === UPDATE_ADMIN_SETTINGS_ERROR_NAME;
}
