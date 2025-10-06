/**
 * @file src/lib/http/validation.ts
 * @intro Helpers de validation HTTP (Zod)
 * @description
 * Fournit des helpers pour transformer une erreur Zod en réponse HTTP 400.
 *
 * @layer lib/http
 */

import type { ErrorCode } from "@/core/domain/errors/codes";
import { ZodError, type ZodType } from "zod";

// ---- Types & guards ---------------------------------------------

export type HttpErrorBody = {
  code: ErrorCode | string;
  issues?: Array<{ path: string; message: string }>;
  message?: string;
  // champs additionnels tolérés si besoin
  [k: string]: unknown;
};

type HttpErrorPayload = {
  status: number;
  body: HttpErrorBody;
};

type WrappedHttpError = { __http__: HttpErrorPayload };

function isWrappedHttpError(err: unknown): err is WrappedHttpError {
  if (typeof err !== "object" || err === null) return false;
  return "__http__" in err;
}

// ---- Helpers publics --------------------------------------------

export function throwHttp(status: number, body: HttpErrorBody): never {
  // on “typera” l’objet lancé comme WrappedHttpError pour l’IDE,
  // mais SANS utiliser `any` dans les contrôles.
  throw { __http__: { status, body } } as WrappedHttpError;
}

export function parseDTO<TSchema extends ZodType<unknown>>(
  schema: TSchema,
  input: unknown
): TSchema["_output"] {
  const res = schema.safeParse(input);
  if (!res.success) throw res.error;
  return res.data;
}

export function zodToHttp(err: unknown) {
  // 1) Erreurs "maison" (ex. readJsonOr400)
  if (isWrappedHttpError(err)) {
    return err.__http__;
  }

  // 2) Erreurs Zod standardisées
  if (err instanceof ZodError) {
    return {
      status: 400 as const,
      body: {
        code: "VALIDATION_ERROR",
        message: err.message,
        issues: err.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
    };
  }

  return null;
}
