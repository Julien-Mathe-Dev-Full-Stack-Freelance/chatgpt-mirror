/**
 * @file src/infrastructure/http/admin/pages.client.ts
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import type { SiteIndexDTO } from "@/core/domain/site/dto";
import { ENDPOINTS } from "@/infrastructure/constants/endpoints";
import {
  encodeSlug,
  withState,
  type HttpOpts,
} from "@/infrastructure/http/shared/_internal";
import { apiFetch } from "@/lib/http/api-fetch";
import type {
  CreatePageIntentDTO,
  UpdatePageIntentDTO,
} from "@/schemas/pages/page-intents";

// ⬅︎ on importe les types de réponse des routes :
import type {
  DeletePageResponse,
  GetPageResponse,
  UpdatePageResponse,
} from "@/app/api/admin/pages/[slug]/route";
import type { CreatePageResponse } from "@/app/api/admin/pages/route";

export const pagesAdminApi = {
  /** GET `/api/admin/pages?state=…` */
  async getIndex(
    state: ContentState = DEFAULT_CONTENT_STATE,
    opts?: HttpOpts
  ): Promise<SiteIndexDTO> {
    return apiFetch<SiteIndexDTO>(
      withState(ENDPOINTS.ADMIN.PAGES.base, state),
      { method: "GET", ...(opts ?? {}) }
    );
  },

  /** GET `/api/admin/pages/[slug]?state=…` */
  async get(
    slug: string,
    state: ContentState = DEFAULT_CONTENT_STATE,
    opts?: HttpOpts
  ): Promise<GetPageResponse> {
    return apiFetch<GetPageResponse>(
      withState(ENDPOINTS.ADMIN.PAGES.byId(encodeSlug(slug)), state),
      { method: "GET", ...(opts ?? {}) }
    );
  },

  /** POST `/api/admin/pages` */
  async create(
    payload: CreatePageIntentDTO,
    opts?: HttpOpts
  ): Promise<CreatePageResponse> {
    return apiFetch<CreatePageResponse>(ENDPOINTS.ADMIN.PAGES.base, {
      method: "POST",
      body: JSON.stringify(payload),
      ...(opts ?? {}),
    });
  },

  /** PATCH `/api/admin/pages/[slug]` */
  async update(
    currentSlug: string,
    payload: UpdatePageIntentDTO,
    opts?: HttpOpts
  ): Promise<UpdatePageResponse> {
    return apiFetch<UpdatePageResponse>(
      ENDPOINTS.ADMIN.PAGES.byId(encodeSlug(currentSlug)),
      {
        method: "PATCH",
        body: JSON.stringify(payload),
        ...(opts ?? {}),
      }
    );
  },

  /** DELETE `/api/admin/pages/[slug]` */
  async remove(slug: string, opts?: HttpOpts): Promise<DeletePageResponse> {
    return apiFetch<DeletePageResponse>(
      ENDPOINTS.ADMIN.PAGES.byId(encodeSlug(slug)),
      { method: "DELETE", ...(opts ?? {}) }
    );
  },
};
