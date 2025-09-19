/**
 * @file src/core/domain/errors/domain-error.ts
 * @intro Erreur métier typée (code + détails optionnels)
 * @layer domain/errors
 * @remarks
 * - `toJSON()` est *sanitizé* (safe pour exposition) : { name, code, message }.
 * - `toLogJSON()` est réservé aux logs (inclut details & cause normalisée).
 */

import type { ErrorCode } from "@/core/domain/errors/codes";

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
  toJSON() {
    return { name: this.name, code: this.code, message: this.message };
  }

  /**
   * Pour les LOGS uniquement (ne jamais renvoyer côté client).
   * Inclut details + cause normalisée.
   */
  toLogJSON() {
    return {
      ...this.toJSON(),
      details: this.details,
      cause: normalizeCause(this.cause),
      stack: this.stack,
    };
  }
}

function normalizeCause(cause: unknown) {
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

/** Garde souple : interop cross-realm / sérialisé */
export function isDomainError(e: unknown): e is DomainError {
  return hasStringCode(e);
}

/** Garde strict : vérifie le `name` */
export function isStrictDomainError(e: unknown): e is DomainError {
  return isDomainError(e) && e.name === DOMAIN_ERROR_NAME;
}
