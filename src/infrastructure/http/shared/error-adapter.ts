// src/infrastructure/http/shared/error-adapter.ts
import { ERROR_CODES, type ErrorCode } from "@/core/domain/errors/codes";
import { isStrictDomainError } from "@/core/domain/errors/domain-error";
import type { HttpErrorBody } from "@/lib/http/validation";

export type { HttpErrorBody }; // optionnel, pour réexport

const EXPLICIT_STATUS: Partial<Record<ErrorCode, number>> = {
  [ERROR_CODES.UNAUTHORIZED]: 401,
  [ERROR_CODES.FORBIDDEN]: 403,
  [ERROR_CODES.NOT_FOUND]: 404,
  [ERROR_CODES.PAGE_NOT_FOUND]: 404,
  [ERROR_CODES.CONFLICT]: 409,
  [ERROR_CODES.VALIDATION_ERROR]: 400,
  [ERROR_CODES.INVALID_ARGUMENT]: 400,
};

// familles → 400 par défaut
const PREFIX_RULES = [
  { test: (c: ErrorCode) => /^SEO_/.test(c), status: 400 },
  { test: (c: ErrorCode) => /^PAGE_/.test(c), status: 400 },
  { test: (c: ErrorCode) => /^PUBLISH_/.test(c), status: 400 },
  { test: (c: ErrorCode) => /^IDENTITY_/.test(c), status: 400 },
  { test: (c: ErrorCode) => /^MENU_/.test(c), status: 400 },
  { test: (c: ErrorCode) => /^SOCIAL_/.test(c), status: 400 },
  { test: (c: ErrorCode) => /^SITE_INDEX_/.test(c), status: 400 },
] as const satisfies ReadonlyArray<{
  test: (c: ErrorCode) => boolean;
  status: number;
}>;

// 👉 contrôle fin : quels messages on expose à l’UI (en prod aussi)
const EXPOSE_MESSAGE_WHEN_PROD = [
  (c: ErrorCode) => /^SEO_/.test(c),
  (c: ErrorCode) => /^IDENTITY_/.test(c),
  (c: ErrorCode) => /^MENU_/.test(c),
  (c: ErrorCode) => /^SOCIAL_/.test(c),
  (c: ErrorCode) => c === ERROR_CODES.VALIDATION_ERROR,
] as const;

function shouldExposeMessage(code: ErrorCode): boolean {
  if (process.env.NODE_ENV !== "production") return true; // toujours en dev
  return EXPOSE_MESSAGE_WHEN_PROD.some((fn) => fn(code));
}

function statusFromErrorCode(code: ErrorCode): number {
  const explicit = EXPLICIT_STATUS[code];
  if (explicit !== undefined) return explicit;
  const byPrefix = PREFIX_RULES.find((r) => r.test(code));
  return byPrefix ? byPrefix.status : 500;
}

function toHttpErrorBody(err: unknown): HttpErrorBody {
  if (!isStrictDomainError(err)) {
    return { code: ERROR_CODES.UNKNOWN };
  }
  const base: HttpErrorBody = { code: err.code };
  if (shouldExposeMessage(err.code) && err.message) {
    base.message = err.message; // message “safe” venant du use-case
  }
  return base;
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
