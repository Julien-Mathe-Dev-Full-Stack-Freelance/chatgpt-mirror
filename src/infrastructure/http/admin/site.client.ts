/**
 * @file src/infrastructure/http/admin/site.client.ts
 * @intro Client HTTP admin — Site (publication)
 * @description
 * Endpoint unique : `POST /api/admin/site/publish`.
 * Transport-only via `apiFetch` (aucune logique métier ici) ; typage depuis le barrel domaine.
 *
 * Observabilité :
 * - `debug` : start/ok (avec durée)
 * - `warn`  : échec (message, durée)
 *
 * @layer infrastructure/http
 * @remarks
 * - Les défauts (`from="draft"`, `to="published"`) sont appliqués côté route/use-case.
 * - `cleanOrphans` est ignoré en V1 (MVP) par le domaine.
 * @todo (auth) Ajouter l’Authorization header quand l’auth sera branchée.
 * @todo (env) Factoriser une base URL si backend séparé.
 * @todo (abort) Supporter un `AbortSignal` optionnel (annulation côté UI).
 */

import type { ContentState } from "@/core/domain/constants/common";
import type { PublishSiteResultDTO } from "@/core/domain/site/dto";
import { ENDPOINTS } from "@/infrastructure/constants/endpoints";
import { request, type HttpOpts } from "@/infrastructure/http/shared/_internal";

export const siteAdminApi = {
  /** POST `/api/admin/site/publish` — Publie le site d’un espace vers un autre. */
  async publish(
    params?: { from?: ContentState; to?: ContentState; cleanOrphans?: boolean },
    opts?: HttpOpts
  ): Promise<PublishSiteResultDTO> {
    return request<PublishSiteResultDTO>(
      "site.publish",
      ENDPOINTS.ADMIN.SITE.publish,
      { method: "POST", body: JSON.stringify(params ?? {}) },
      opts
    );
  },
};
