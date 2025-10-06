/**
 * @file src/lib/api/responses.ts
 * @intro Helpers de réponses JSON pour l’App Router
 * @description
 * Centralise les réponses JSON et force le `no-store` pour éviter tout cache côté admin.
 * Normalise la forme d’erreur sur `{ error: { code, message } }`.
 *
 * Observabilité :
 * - Aucune (helpers purs, sans effet de bord).
 *
 * @layer lib/api
 * @remarks
 * - À utiliser dans les handlers route.ts.
 * - La charge utile d’erreur est volontairement simple pour rester stable côté client.
 */

import type { ErrorCode } from "@/core/domain/errors/codes";
import type { HttpErrorBody } from "@/lib/http/validation";
import { NextResponse } from "next/server";

/** En-têtes `no-store` pour désactiver le cache des réponses côté client/proxy. */
const NO_STORE_HEADERS: HeadersInit = { "Cache-Control": "no-store" };

/** Forme standard d’une erreur API. */
type ApiErrorBody = {
  error: {
    /** Code d’erreur stable (enum domaine ou string libre). */
    code: ErrorCode | string;
    /** Message court destiné à l’utilisateur final ou aux logs. */
    message: string;
    /** Informations additionnelles facultatives (issues, détails…). */
    [k: string]: unknown;
  };
};

/**
 * Réponse JSON de succès (200 par défaut) avec en-têtes `no-store`.
 * @param data Charge utile (sera sérialisée en JSON).
 * @param status Code HTTP (par défaut 200).
 * @returns `NextResponse` JSON avec `Cache-Control: no-store`.
 */
export function jsonOk<T>(data: T, status = 200): NextResponse {
  return NextResponse.json<T>(data, { status, headers: NO_STORE_HEADERS });
}

/**
 * Réponse JSON d’erreur générique (forme `{ error: { code, message } }`).
 * @param code Code d’erreur métier (ex: `"NOT_FOUND"`, `"VALIDATION_ERROR"`).
 * @param message Message d’erreur lisible.
 * @param status Code HTTP (par défaut 400).
 * @returns `NextResponse` JSON avec `Cache-Control: "no-store"`.
 */
function jsonError(
  code: ErrorCode | string,
  message: string,
  status = 400,
  extras?: Record<string, unknown>
): NextResponse<ApiErrorBody> {
  return NextResponse.json<ApiErrorBody>(
    { error: { code, message, ...(extras ?? {}) } },
    { status, headers: NO_STORE_HEADERS }
  );
}

/**
 * 500 — Internal Server Error.
 * @param err Erreur brute (Error, string, inconnu).
 * @returns `NextResponse` JSON d’erreur 500, masquant les détails internes.
 */
export function serverError(err: unknown): NextResponse<ApiErrorBody> {
  const detailed =
    err instanceof Error ? err.message : "Unknown technical error";
  const message =
    process.env.NODE_ENV === "production" ? "Internal server error." : detailed;

  // Aligné sur ERROR_CODES.INTERNAL
  return jsonError("INTERNAL", message, 500);
}

/**
 * Conversion générique “status + HttpErrorBody” → réponse JSON normalisée.
 */
export function jsonHttpError(
  status: number,
  body: HttpErrorBody
): NextResponse {
  const {
    code = "UNKNOWN",
    message = "",
    ...rest
  } = body as HttpErrorBody & Record<string, unknown>;

  const finalMessage = message || `HTTP ${status}`;
  return jsonError(code, finalMessage, status, rest);
}
