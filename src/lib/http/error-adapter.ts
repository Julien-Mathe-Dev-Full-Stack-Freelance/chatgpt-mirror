// src/infrastructure/http/error-adapter.ts
/**
 * @file src/infrastructure/http/error-adapter.ts
 * @intro Adaptation HTTP des erreurs domaine (exceptions + règles par préfixe).
 * @layer infra/http
 */

import { ERROR_CODES, type ErrorCode } from "@/core/domain/errors/codes";
import { isStrictDomainError } from "@/core/domain/errors/domain-error";
import type { HttpErrorBody } from "@/lib/http/validation"; // ✅ unifié

const EXPLICIT_STATUS: Partial<Record<ErrorCode, number>> = {
  [ERROR_CODES.UNAUTHORIZED]: 401,
  [ERROR_CODES.FORBIDDEN]: 403,
  [ERROR_CODES.NOT_FOUND]: 404,
  [ERROR_CODES.PAGE_NOT_FOUND]: 404,
  [ERROR_CODES.CONFLICT]: 409,
};

const PREFIX_RULES: Array<{
  test: (code: ErrorCode) => boolean;
  status: number;
}> = [
  // families → 400
  { test: (c) => /^SEO_/.test(c), status: 400 },
  { test: (c) => /^PAGE_/.test(c), status: 400 },
  { test: (c) => /^PUBLISH_/.test(c), status: 400 },
  { test: (c) => /^IDENTITY_/.test(c), status: 400 },
  { test: (c) => /^MENU_/.test(c), status: 400 },
  { test: (c) => /^SOCIAL_/.test(c), status: 400 },
  { test: (c) => /^SITE_INDEX_/.test(c), status: 400 },
];

export function statusFromErrorCode(code: ErrorCode): number {
  const explicit = EXPLICIT_STATUS[code];
  if (explicit !== undefined) return explicit;
  const byPrefix = PREFIX_RULES.find((r) => r.test(code));
  return byPrefix ? byPrefix.status : 500;
}

export function toHttpErrorBody(err: unknown): HttpErrorBody {
  return isStrictDomainError(err)
    ? { code: err.code }
    : { code: ERROR_CODES.UNKNOWN };
}

export function toHttpError(err: unknown) {
  const body = toHttpErrorBody(err);
  const status = statusFromErrorCode(body.code as ErrorCode);
  return { status, body };
}

if (process.env.NODE_ENV !== "production") {
  const all = Object.values(ERROR_CODES) as ErrorCode[];
  const covered = (c: ErrorCode) =>
    EXPLICIT_STATUS[c] !== undefined || PREFIX_RULES.some((r) => r.test(c));
  const misses = all.filter((c) => !covered(c));
  if (misses.length) {
    console.warn(
      `[errors] No HTTP status rule for codes: ${misses.join(", ")}`
    );
  }
}
