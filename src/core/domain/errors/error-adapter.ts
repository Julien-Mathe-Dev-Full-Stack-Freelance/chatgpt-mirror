/**
 * @file src/infrastructure/http/error-adapter.ts
 * @intro Adaptation HTTP des erreurs domaine (exceptions + règles par préfixe).
 * @layer infra/http
 * @sot docs/bible/infra/http/error-adapter.md#http-error-adapter
 * @description
 * - Convertit un `DomainError` en réponse HTTP minimaliste : `{ status, body: { code } }`.
 * - Règles : exceptions explicites (`EXPLICIT_STATUS`) > familles par préfixe (`PREFIX_RULES`) > défaut 500.
 * - N’expose jamais `details` ni `cause` (réservés aux logs via `DomainError#toLogJSON()`).
 * @remarks
 * - Compléter `EXPLICIT_STATUS` / `PREFIX_RULES` à chaque ajout de `ErrorCode` (voir SoT).
 */

import { ERROR_CODES, type ErrorCode } from "@/core/domain/errors/codes";
import { isStrictDomainError } from "@/core/domain/errors/domain-error";

// Corps d'erreur minimal pour le client
export type HttpErrorBody = Readonly<{ code: ErrorCode }>;

/** Exceptions explicites code → status (précèdent les règles de préfixe) */
const EXPLICIT_STATUS: Partial<Record<ErrorCode, number>> = {
  [ERROR_CODES.UNAUTHORIZED]: 401,
  [ERROR_CODES.FORBIDDEN]: 403,
  [ERROR_CODES.NOT_FOUND]: 404,
  [ERROR_CODES.PAGE_NOT_FOUND]: 404,
  [ERROR_CODES.CONFLICT]: 409,
};

/** Règles génériques par préfixe (familles d’erreurs métier) */
const PREFIX_RULES: Array<{
  test: (code: ErrorCode) => boolean;
  status: number;
}> = [
  { test: (c) => /^SEO_/.test(c), status: 400 },
  { test: (c) => /^PAGE_/.test(c), status: 400 },
  { test: (c) => /^PUBLISH_/.test(c), status: 400 },
  // Ajouter ici d’autres familles (ex: IMPORT_, SLUG_, THEME_, MENU_, etc.)
];

/** Map code → status HTTP (exceptions > règle de préfixe > 500) */
export function statusFromErrorCode(code: ErrorCode): number {
  const explicit = EXPLICIT_STATUS[code];
  if (explicit !== undefined) return explicit;
  const byPrefix = PREFIX_RULES.find((r) => r.test(code));
  return byPrefix ? byPrefix.status : 500;
}

/** Transforme une erreur inconnue en corps HTTP minimal. */
export function toHttpErrorBody(err: unknown): HttpErrorBody {
  return isStrictDomainError(err)
    ? { code: err.code }
    : { code: ERROR_CODES.UNKNOWN };
}

/** Helper “tout-en-un” : { status, body } */
export function toHttpError(err: unknown) {
  const body = toHttpErrorBody(err);
  const status = statusFromErrorCode(body.code);
  return { status, body };
}

/* ---- Dev guard : couverture des codes ----
   Alerte si un nouveau code n'est couvert ni par EXPLICIT_STATUS ni par PREFIX_RULES.
   Passe en throw si tu veux du *fail-fast* pendant le dev.
*/
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
