/**
 * @file src/infrastructure/http/admin/pages.client.ts
 * @intro Client HTTP admin — Pages
 * @description
 * Helpers minces GET/POST/PATCH/DELETE vers `/api/admin/pages…`
 * (transport-only via `apiFetch`), avec typage depuis le barrel domaine DTO.
 *
 * Observabilité :
 * - `debug` : start/ok (avec durée)
 * - `warn`  : échec (message, durée)
 *
 * @layer infrastructure/http
 * @remarks
 * - Aucune logique métier ici : ce module propage les erreurs HTTP telles quelles.
 * - Les validations de forme sont faites à la frontière API (Zod côté routes).
 * @todo (auth) Injecter Authorization quand l’auth sera branchée.
 * @todo (env) Factoriser une base URL si backend séparé.
 * @todo (abort) Support d’un `AbortSignal` optionnel côté UI.
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";
import type {
  CreatePageDTO,
  PageDTO,
  UpdatePageDTO,
} from "@/core/domain/pages/dto";
import type { SiteIndexDTO } from "@/core/domain/site/dto";
import { ENDPOINTS } from "@/infrastructure/constants/endpoints";
import {
  encodeSlug,
  request,
  withState,
  type HttpOpts,
} from "@/infrastructure/http/shared/_internal";

/** Shapes de réponses */
export type CreatePageResponse = { page: PageDTO; index: SiteIndexDTO };
export type UpdatePageResponse = { page: PageDTO; index: SiteIndexDTO };
export type DeletePageResponse = { index: SiteIndexDTO };

export const pagesAdminApi = {
  /** GET `/api/admin/pages?state=…` */
  async getIndex(
    state: ContentState = DEFAULT_CONTENT_STATE,
    opts?: HttpOpts
  ): Promise<SiteIndexDTO> {
    return request<SiteIndexDTO>(
      "pages.getIndex",
      withState(ENDPOINTS.ADMIN.PAGES.base, state),
      { method: "GET" },
      opts
    );
  },

  /** GET `/api/admin/pages/[slug]?state=…` */
  async get(
    slug: string,
    state: ContentState = DEFAULT_CONTENT_STATE,
    opts?: HttpOpts
  ): Promise<PageDTO> {
    return request<PageDTO>(
      "pages.get",
      withState(
        ENDPOINTS.ADMIN.PAGES.byId(encodeSlug(slug)),
        state
      ),
      { method: "GET" },
      opts
    );
  },

  /** POST `/api/admin/pages` */
  async create(
    payload: CreatePageDTO,
    opts?: HttpOpts
  ): Promise<CreatePageResponse> {
    return request<CreatePageResponse>(
      "pages.create",
      ENDPOINTS.ADMIN.PAGES.base,
      { method: "POST", body: JSON.stringify(payload) },
      opts
    );
  },

  /** PATCH `/api/admin/pages/[slug]` */
  async update(
    currentSlug: string,
    payload: UpdatePageDTO,
    opts?: HttpOpts
  ): Promise<UpdatePageResponse> {
    return request<UpdatePageResponse>(
      "pages.update",
      ENDPOINTS.ADMIN.PAGES.byId(encodeSlug(currentSlug)),
      { method: "PATCH", body: JSON.stringify(payload) },
      opts
    );
  },

  /** DELETE `/api/admin/pages/[slug]` */
  async remove(slug: string, opts?: HttpOpts): Promise<DeletePageResponse> {
    return request<DeletePageResponse>(
      "pages.remove",
      ENDPOINTS.ADMIN.PAGES.byId(encodeSlug(slug)),
      { method: "DELETE" },
      opts
    );
  },
};
