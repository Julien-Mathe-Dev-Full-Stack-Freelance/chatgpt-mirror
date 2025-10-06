/**
 * @file src/lib/api/handle-route.ts
 * @intro Enveloppe standard pour handlers App Router (Next.js)
 * @description
 * - Parse le ContentState (?state) via parseContentStateFromRequest.
 * - Loggue start/end (+ms) et normalise les erreurs (Zod/Domaine/500).
 * - Répond avec Cache-Control: no-store.
 *
 * @layer lib/api
 */

import type { ContentState } from "@/constants/shared/common";
import { ERROR_CODES } from "@/core/domain/errors/codes";
import { toHttpError } from "@/infrastructure/http/shared/error-adapter";
import { jsonHttpError, jsonOk, serverError } from "@/lib/api/responses";
import { parseContentStateFromRequest } from "@/lib/api/urls";
import { zodToHttp } from "@/lib/http/validation";
import { log, logWithDuration } from "@/lib/log";
import type { NextResponse } from "next/server";

type HandlerArgs = {
  req: Request;
  /** State résolu à partir de ?state (draft/published). */
  state: ContentState;
};

type ApiHandler<T> = (args: HandlerArgs) => Promise<T>;

/**
 * Garde la route DRY : logs homogènes + mapping d'erreurs.
 * @param ns Namespace stable pour les logs (ex: "api.admin.site.identity.GET")
 * @param req Request (App Router)
 * @param handler Fonction métier asynchrone qui retourne le payload JSON
 * @returns NextResponse
 */
export async function handleRoute<T>(
  ns: string,
  req: Request,
  handler: ApiHandler<T>
): Promise<NextResponse> {
  const lg = log.child({ ns });
  const state = parseContentStateFromRequest(req);

  return logWithDuration(`${ns}`, async () => {
    try {
      const data = await handler({ req, state });
      lg.info("ok", { state });
      return jsonOk<T>(data);
    } catch (err: unknown) {
      // 1) Erreurs HTTP “maison” (throwHttp / readJsonOr400 / etc.) ou Zod
      const mapped = zodToHttp(err);
      if (mapped) {
        const logPayload: Record<string, unknown> = {
          state,
          status: mapped.status,
          code: mapped.body.code,
        };

        const issues = Array.isArray(mapped.body.issues)
          ? mapped.body.issues
          : undefined;
        if (issues) {
          logPayload["issuesCount"] = issues.length;
          const paths = issues
            .map((issue) => issue?.path)
            .filter(
              (path): path is string =>
                typeof path === "string" && path.length > 0
            );
          if (paths.length > 0) {
            logPayload["issuePaths"] = paths;
          }
        }

        const extraKeys = Object.keys(mapped.body).filter(
          (k) => k !== "code" && k !== "issues"
        );
        if (extraKeys.length > 0) {
          logPayload["extraKeys"] = extraKeys;
        }

        lg.warn("bad_request", logPayload);
        return jsonHttpError(mapped.status, mapped.body);
      }

      // 2) DomainError → HTTP (uniquement si code ≠ UNKNOWN)
      const dom = toHttpError(err);
      if (dom.body.code !== ERROR_CODES.UNKNOWN) {
        lg.warn("domain_error", {
          state,
          status: dom.status,
          code: dom.body.code,
        });
        return jsonHttpError(dom.status, dom.body);
      }

      // 3) Fallback 500
      lg.error("internal_error", {
        state,
        message: err instanceof Error ? err.message : String(err),
      });
      return serverError(err);
    }
  });
}
