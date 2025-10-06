/**
 * @file src/core/domain/pages/use-cases/delete-page.errors.ts
 * @intro Erreurs métier du use-case DeletePage
 * @layer domain/use-case
 */

import type { ErrorCode } from "@/core/domain/errors/codes";
import { DomainError, isDomainError } from "@/core/domain/errors/domain-error";

const DELETE_PAGE_ERROR_NAME = "DeletePageError" as const;

export class DeletePageError extends DomainError {
  constructor(
    code: ErrorCode,
    message?: string,
    details?: unknown,
    cause?: unknown
  ) {
    super({ code, message, details, cause });
    this.name = DELETE_PAGE_ERROR_NAME;
  }
}

/** Garde realm-safe */
export function isDeletePageError(e: unknown): e is DeletePageError {
  return isDomainError(e) && e.name === DELETE_PAGE_ERROR_NAME;
}
