/**
 * @file src/core/domain/site/use-cases/site-index/update-site-index.errors.ts
 * @intro Erreurs métier pour `UpdateSiteIndex`.
 * @description
 * Étend `DomainError` avec un `code` stable (`ErrorCode`) pour le mapping API/UI.
 * Transport d’informations (message + details) sans logique.
 *
 * @layer domain/use-case
 */

import type { ErrorCode } from "@/core/domain/errors/codes";
import { DomainError, isDomainError } from "@/core/domain/errors/domain-error";

/** Nom stable (sérialisable). */
const UPDATE_SITE_INDEX_ERROR_NAME = "UpdateSiteIndexError" as const;

/** Erreur métier levée lors d’un échec de mise à jour de l’index. */
export class UpdateSiteIndexError extends DomainError {
  constructor(
    code: ErrorCode,
    message?: string,
    details?: unknown,
    cause?: unknown
  ) {
    super({ code, message, details, cause });
    this.name = UPDATE_SITE_INDEX_ERROR_NAME;
  }
}

/** Type guard d’exécution pour reconnaître une `UpdateSiteIndexError`. */
export function isUpdateSiteIndexError(
  err: unknown
): err is UpdateSiteIndexError {
  return isDomainError(err) && err.name === UPDATE_SITE_INDEX_ERROR_NAME;
}
