/**
 * @file src/core/domain/pages/use-cases/update-page.errors.ts
 * @intro Erreurs métier du use-case UpdatePage
 * @layer domain/use-case
 * @remarks
 * - Pas d'instanceof (fragile cross-realm). Détection par `isDomainError` + `name`.
 * - Ne jamais afficher `message` côté UI : seul `code` est destiné à l’affichage i18n.
 */

import { DomainError, isDomainError } from "@/core/domain/errors/domain-error";
import { ERROR_CODES, type ErrorCode } from "@/core/domain/errors/codes";
export const UPDATE_PAGE_ERROR_NAME = "UpdatePageError" as const;

/** (Optionnel) set de codes typiques pour UpdatePage */
export const UPDATE_PAGE_ERROR_CODES = [
  ERROR_CODES.PAGE_NOT_FOUND, // page à mettre à jour introuvable
  ERROR_CODES.CONFLICT, // collision de slug cible
  ERROR_CODES.PAGE_SLUG_REQUIRED, // garde défensive si front n'a pas validé
] as const;

export type UpdatePageErrorCode =
  | (typeof UPDATE_PAGE_ERROR_CODES)[number]
  | ErrorCode;

export class UpdatePageError extends DomainError {
  constructor(
    code: ErrorCode,
    message?: string,
    details?: unknown,
    cause?: unknown
  ) {
    super({ code, message, details, cause });
    this.name = "UpdatePageError";
  }
}

/** Garde realm-safe */
export function isUpdatePageError(e: unknown): e is UpdatePageError {
  return isDomainError(e) && e.name === UPDATE_PAGE_ERROR_NAME;
}
