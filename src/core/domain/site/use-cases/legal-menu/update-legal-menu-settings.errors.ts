/**
 * @file src/core/domain/site/use-cases/legal-menu/update-legal-menu-settings.errors.ts
 * @intro Erreurs métier pour `UpdateLegalMenuSettings`.
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
export const UPDATE_LEGAL_MENU_SETTINGS_ERROR_NAME =
  "UpdateLegalMenuSettingsError" as const;

/** Erreur métier levée lors d’un échec de mise à jour du menu légal. */
export class UpdateLegalMenuSettingsError extends DomainError {
  constructor(
    code: ErrorCode,
    message?: string,
    details?: unknown,
    cause?: unknown
  ) {
    super({ code, message, details, cause });
    this.name = UPDATE_LEGAL_MENU_SETTINGS_ERROR_NAME;
  }
}

/** Guard realm-safe (pas d’instanceof croisé). */
export function isUpdateLegalMenuSettingsError(
  err: unknown
): err is UpdateLegalMenuSettingsError {
  return (
    isDomainError(err) && err.name === UPDATE_LEGAL_MENU_SETTINGS_ERROR_NAME
  );
}
