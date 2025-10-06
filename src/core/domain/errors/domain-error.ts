// src/core/domain/errors/domain-error.ts
import { isErrorCode, type ErrorCode } from "@/core/domain/errors/codes";

const DOMAIN_ERROR_NAME = "DomainError" as const;

type DomainErrorInit = {
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
    if (cause !== undefined) this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, DomainError);
  }

  toJSON(): { name: string; code: ErrorCode; message: string } {
    return { name: this.name, code: this.code, message: this.message };
  }

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
    return { name: cause.name, message: cause.message, stack: cause.stack };
  }
  if (typeof cause === "object") return cause;
  return String(cause);
}

/** Garde utilitaire : prouve qu’on a un objet { code: string } */
function hasStringCode(value: unknown): value is { code: string } {
  if (value === null || typeof value !== "object") return false;
  // Pas de 'any' ici : on lit en deux temps
  const v = (value as { code?: unknown }).code;
  return typeof v === "string";
}

/** Garde souple : cross-realm/sérialisé → présence d’un `code` string */
export function isDomainError(e: unknown): e is DomainError {
  // On **ne** contraint **pas** le name, pour accepter les sous-classes
  return hasStringCode(e);
}

/** Garde stricte : `code` ∈ `ErrorCode` (sans imposer `name`) */
export function isStrictDomainError(e: unknown): e is DomainError {
  return hasStringCode(e) && isErrorCode(e.code);
}
