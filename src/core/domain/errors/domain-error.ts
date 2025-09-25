/**
 * @file src/core/domain/errors/domain-error.ts
 * @intro Erreur métier typée (code + détails optionnels).
 * @layer domain/errors
 * @sot docs/bible/domain/errors/README.md#domain-error
 * @description
 * - Classe `DomainError` : encapsule un `ErrorCode`, un message, des `details` et une `cause` optionnelle.
 * - Sérialisations contrôlées :
 *   - `toJSON()` → **safe** pour exposition (UI/API) : { name, code, message }.
 *   - `toLogJSON()` → **logs uniquement** : ajoute { details, cause normalisée, stack }.
 * - Garde souple `isDomainError` (interop sérialisée/cross-realm) & garde stricte `isStrictDomainError`.
 * @remarks
 * - Étendre d’abord `ERROR_CODES` si un nouveau code apparaît, puis mappages API/UI + i18n.
 */

import type { ErrorCode } from "@/core/domain/errors/codes";
import { isErrorCode } from "@/core/domain/errors/codes";

export const DOMAIN_ERROR_NAME = "DomainError" as const;

export type DomainErrorInit = {
  code: ErrorCode;
  message?: string;
  details?: unknown;
  cause?: unknown;
};

export class DomainError extends Error {
  readonly code: ErrorCode;
  readonly details?: unknown;

  constructor({ code, message, details, cause }: DomainErrorInit) {
    super(message ?? code);
    this.name = DOMAIN_ERROR_NAME;
    this.code = code;
    this.details = details;
    if (cause !== undefined) {
      this.cause = cause;
    }
    // Robustesse cross-targets
    Object.setPrototypeOf(this, new.target.prototype);
    // Stack propre
    Error.captureStackTrace?.(this, DomainError);
  }

  /**
   * Sanitize par défaut — safe pour exposition (UI / API).
   * N'INCLUT PAS details ni cause.
   */
  toJSON(): { name: string; code: ErrorCode; message: string } {
    return { name: this.name, code: this.code, message: this.message };
  }

  /**
   * Pour les LOGS uniquement (ne jamais renvoyer côté client).
   * Inclut details + cause normalisée + stack.
   */
  toLogJSON(): {
    name: string;
    code: ErrorCode;
    message: string;
    details: unknown;
    cause: unknown;
    stack?: string;
  } {
    return {
      ...this.toJSON(),
      details: this.details,
      cause: normalizeCause(this.cause),
      stack: this.stack,
    };
  }
}

function normalizeCause(cause: unknown): unknown {
  if (!cause) return undefined;
  if (cause instanceof Error) {
    return {
      name: cause.name,
      message: cause.message,
      stack: cause.stack,
    };
  }
  if (typeof cause === "object") return cause;
  return String(cause);
}

function hasStringCode(value: unknown): value is { code: string } {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate["code"] === "string";
}

/** Garde souple : interop cross-realm / sérialisé (présence d'un `code` string). */
export function isDomainError(e: unknown): e is DomainError {
  return hasStringCode(e);
}

/** Garde stricte : vérifie le `name` et que `code` ∈ `ErrorCode`. */
export function isStrictDomainError(e: unknown): e is DomainError {
  return (
    isDomainError(e) && e.name === DOMAIN_ERROR_NAME && isErrorCode(e.code)
  );
}
