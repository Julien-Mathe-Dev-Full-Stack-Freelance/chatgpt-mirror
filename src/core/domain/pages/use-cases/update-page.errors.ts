/**
 * @file src/core/domain/pages/use-cases/update-page.errors.ts
 * @intro Erreurs métier du use-case UpdatePage
 * @layer domain/use-case
 * @remarks
 * - Pas d'instanceof (fragile cross-realm). Détection par `isDomainError` + `name`.
 * - Ne jamais afficher `message` côté UI : seul `code` est destiné à l’affichage i18n.
 */

import type { ErrorCode } from "@/core/domain/errors/codes";
import { DomainError, isDomainError } from "@/core/domain/errors/domain-error";

const UPDATE_PAGE_ERROR_NAME = "UpdatePageError" as const;

export class UpdatePageError extends DomainError {
  constructor(
    code: ErrorCode,
    message?: string,
    details?: unknown,
    cause?: unknown
  ) {
    super({ code, message, details, cause });
    this.name = UPDATE_PAGE_ERROR_NAME;
  }
}

/** Garde realm-safe */
export function isUpdatePageError(e: unknown): e is UpdatePageError {
  return isDomainError(e) && e.name === UPDATE_PAGE_ERROR_NAME;
}
