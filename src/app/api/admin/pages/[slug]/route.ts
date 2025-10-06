/**
 * @file src/app/api/admin/pages/[slug]/route.ts
 * @intro API admin — lecture/suppression/mise à jour d’une page par slug
 */

import "@/lib/zod-bootstrap";

import { handleRoute } from "@/lib/api/handle-route";
import { readJsonOr400 } from "@/lib/http/read-json";
import { parseDTO, throwHttp } from "@/lib/http/validation";

import { getPagesRepository } from "@/infrastructure/pages";
import { getSiteRepository } from "@/infrastructure/site";

import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import { deletePage } from "@/core/domain/pages/use-cases/delete-page";
import { isDeletePageError } from "@/core/domain/pages/use-cases/delete-page.errors";
import { updatePage } from "@/core/domain/pages/use-cases/update-page";
import { isUpdatePageError } from "@/core/domain/pages/use-cases/update-page.errors";
import { updateSiteIndex } from "@/core/domain/site/use-cases/site-index/update-site-index";

import { adaptUpdatePagePayload } from "@/app/api/admin/_adapters/pages";
import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import type { PageDTO } from "@/core/domain/pages/dto";
import type { SiteIndexDTO } from "@/core/domain/site/dto";
import {
  UpdatePageIntentSchema,
  type UpdatePageIntentDTO,
} from "@/schemas/pages/page-intents";
import { SlugParamSchema } from "@/schemas/routes/params";
import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";

// ——— Response types exportés ———
export type GetPageResponse = PageDTO;
export type DeletePageResponse = { index: SiteIndexDTO };
export type UpdatePageResponse = { page: PageDTO; index: SiteIndexDTO };

// ------------------------------------ GET ------------------------------------
export async function GET(req: Request, ctx: { params: unknown }) {
  const NS = "api.admin.pages.slug.GET" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const { slug } = parseDTO(SlugParamSchema, ctx.params);
    const pagesRepo = getPagesRepository();
    const page = await pagesRepo.read(state, slug);
    if (!page) {
      throwHttp(404, { code: EC.NOT_FOUND, message: "Resource not found." });
    }
    return page satisfies GetPageResponse;
  });
}

// ---------------------------------- DELETE -----------------------------------
export async function DELETE(req: Request, ctx: { params: unknown }) {
  const NS = "api.admin.pages.slug.DELETE" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const { slug } = parseDTO(SlugParamSchema, ctx.params);

    const runSiteIndex = updateSiteIndex({ repo: getSiteRepository() });
    const pageRepo = getPagesRepository();
    const run = deletePage({ pages: pageRepo, siteIndex: runSiteIndex });

    try {
      const { index } = await run({ slug, state });
      const res: DeletePageResponse = { index };
      return res;
    } catch (err: unknown) {
      if (isDeletePageError(err)) {
        throwHttp(400, { code: err.code, message: err.message });
      }
      throw err;
    }
  });
}

// ------------------------------------ PATCH ----------------------------------
export async function PATCH(req: Request, ctx: { params: unknown }) {
  const NS = "api.admin.pages.slug.PATCH" as const;
  return handleRoute(NS, req, async ({ state: stateFromQuery }) => {
    const { slug: currentSlug } = parseDTO(SlugParamSchema, ctx.params);

    const body = await readJsonOr400(req);
    const dto: UpdatePageIntentDTO = parseDTO(UpdatePageIntentSchema, body);

    const runSiteIndex = updateSiteIndex({ repo: getSiteRepository() });
    const pageRepo = getPagesRepository();
    const run = updatePage({ pages: pageRepo, siteIndex: runSiteIndex });

    const effectiveState = parseDTO(
      ContentStateSchema,
      dto.state ?? stateFromQuery ?? DEFAULT_CONTENT_STATE
    );

    try {
      await pageRepo.ensureBase();
      const existing = await pageRepo.read(effectiveState, currentSlug);
      if (!existing) {
        throwHttp(404, { code: EC.NOT_FOUND, message: "Resource not found." });
      }

      const payload = adaptUpdatePagePayload(dto); // sans state/id/currentSlug
      const { page, index } = await run({
        currentSlug,
        ...payload,
        state: effectiveState,
      });

      const res: UpdatePageResponse = { page, index };
      return res;
    } catch (err: unknown) {
      if (isUpdatePageError(err)) {
        throwHttp(400, { code: err.code, message: err.message });
      }
      throw err;
    }
  });
}
