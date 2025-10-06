/**
 * @file src/core/domain/site/use-cases/publish/publish-site.errors.ts
 * @intro Erreurs métier pour `publishSite`.
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

const PUBLISH_SITE_ERROR_NAME = "PublishSiteError" as const;

export class PublishSiteError extends DomainError {
  constructor(
    code: ErrorCode,
    message?: string,
    details?: unknown,
    cause?: unknown
  ) {
    super({ code, message, details, cause });
    this.name = PUBLISH_SITE_ERROR_NAME;
  }
}

export function isPublishSiteError(err: unknown): err is PublishSiteError {
  return isDomainError(err) && err.name === PUBLISH_SITE_ERROR_NAME;
}
