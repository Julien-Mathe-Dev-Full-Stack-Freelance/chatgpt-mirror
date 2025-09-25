/**
 * @file src/core/domain/pages/use-cases/delete-page.errors.ts
 * @intro Erreurs métier du use-case DeletePage
 * @layer domain/use-case
 * @remarks
 * - Détection cross-realm: pas d'instanceof, on s'appuie sur `isDomainError` + `name`.
 * - Côté UI/API on n’expose que le `code` (message via i18n ErrorCode → message).
 */

import { ERROR_CODES, type ErrorCode } from "@/core/domain/errors/codes";
import { DomainError, isDomainError } from "@/core/domain/errors/domain-error";

export const DELETE_PAGE_ERROR_NAME = "DeletePageError" as const;

/** (Optionnel) set de codes typiques pour DeletePage */
export const DELETE_PAGE_ERROR_CODES = [
  ERROR_CODES.PAGE_NOT_FOUND, // suppression d'une page inexistante
] as const;

export type DeletePageErrorCode =
  | (typeof DELETE_PAGE_ERROR_CODES)[number]
  | ErrorCode;

export class DeletePageError extends DomainError {
  constructor(
    code: ErrorCode,
    message?: string,
    details?: unknown,
    cause?: unknown
  ) {
    super({ code, message, details, cause });
    this.name = "DeletePageError";
  }
}

/** Garde realm-safe */
export function isDeletePageError(e: unknown): e is DeletePageError {
  return isDomainError(e) && e.name === DELETE_PAGE_ERROR_NAME;
}
