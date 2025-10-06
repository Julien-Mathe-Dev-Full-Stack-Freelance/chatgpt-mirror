/**
 * @file src/core/domain/pages/use-cases/create-page.errors.ts
 * @intro Erreurs spécifiques au use-case CreatePage
 * @layer domain/use-case
 * @remarks
 * - Pas de `instanceof` (fragile cross-realm). Détection par `isDomainError` + `name`.
 * - Ne JAMAIS afficher `message` côté UI : l’UI n’affiche que le `code` (i18n).
 * - Voir la doc UC pour la table “Règle → ErrorCode”.
 */

import { type ErrorCode } from "@/core/domain/errors/codes";
import { DomainError, isDomainError } from "@/core/domain/errors/domain-error";

/** Nom stable (sérialisable) utilisé pour identifier l’erreur du UC. */
const CREATE_PAGE_ERROR_NAME = "CreatePageError" as const;

/** Sous-ensemble de codes typiquement levés par CreatePage. */
// const CREATE_PAGE_ERROR_CODES = [
//   ERROR_CODES.PAGE_TITLE_REQUIRED,
//   ERROR_CODES.PAGE_SLUG_REQUIRED,
//   ERROR_CODES.PAGE_SLUG_INVALID_FORMAT,
//   ERROR_CODES.PAGE_SLUG_RESERVED,
// ] as const;

// type CreatePageErrorCode = (typeof CREATE_PAGE_ERROR_CODES)[number] | ErrorCode;

/**
 * Erreur métier du UC CreatePage.
 * `toJSON()` hérite de DomainError (sanitizé: {name, code, message}).
 */
export class CreatePageError extends DomainError {
  constructor(
    code: ErrorCode,
    message?: string,
    details?: unknown,
    cause?: unknown
  ) {
    // ⬇️ AVANT: super(code, message, details, cause)
    super({ code, message, details, cause });
    this.name = "CreatePageError";
  }
}

/** Garde realm-safe (pas de `instanceof`) */
export function isCreatePageError(e: unknown): e is CreatePageError {
  return isDomainError(e) && e.name === CREATE_PAGE_ERROR_NAME;
}
