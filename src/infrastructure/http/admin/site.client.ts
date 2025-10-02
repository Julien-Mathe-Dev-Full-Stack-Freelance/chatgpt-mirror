/**
 * @file src/infrastructure/http/admin/site.client.ts
 * @intro Client HTTP admin — Site (publication)
 * @description
 * Endpoint unique : `POST /api/admin/site/publish`.
 * Transport-only via `apiFetch` (aucune logique métier ici) ; typage depuis le barrel domaine.
 *
 * @layer infrastructure/http
 */

import type { ContentState } from "@/constants/shared/common";
import type { PublishSiteResultDTO } from "@/core/domain/site/dto";
import { ENDPOINTS } from "@/infrastructure/constants/endpoints";
import type { HttpOpts } from "@/infrastructure/http/shared/_internal";
import { apiFetch } from "@/lib/http/api-fetch";

export const siteAdminApi = {
  /** POST `/api/admin/site/publish` — Publie le site d’un espace vers un autre. */
  async publish(
    params?: { from?: ContentState; to?: ContentState; cleanOrphans?: boolean },
    opts?: HttpOpts
  ): Promise<PublishSiteResultDTO> {
    return apiFetch<PublishSiteResultDTO>(ENDPOINTS.ADMIN.SITE.publish, {
      method: "POST",
      body: JSON.stringify(params ?? {}),
      ...(opts ?? {}),
      // apiFetch ajoute Content-Type JSON si pas présent et body non-FormData
    });
  },
};
