/**
 * @file src/app/api/admin/pages/[slug]/route.ts
 * @intro API admin — lecture/suppression/mise à jour d’une page par slug
 * @description
 * - GET    /api/admin/pages/[slug]?state=draft|published → lit une page
 * - DELETE /api/admin/pages/[slug]?state=draft|published → supprime (idempotent)
 * - PATCH  /api/admin/pages/[slug] → met à jour (title/slug/layout) + sync index
 *
 * Frontière : Zod (parseDTO + zodToHttp + readJsonOr400).
 * Domaine    : use-cases `deletePage` / `updatePage` (+ is*Error).
 * Logs       : homogénéisés via handleRoute.
 *
 * Sources internes consultées : 02, 03, 04, 05, 06, 07, 11, 12.
 *
 * @layer api/routes
 */

import "@/lib/zod-bootstrap";

import { handleRoute } from "@/lib/api/handle-route";
import { readJsonOr400 } from "@/lib/http/read-json";
import { parseDTO } from "@/lib/http/validation";

import { getPagesRepository } from "@/infrastructure/pages";
import { getSiteRepository } from "@/infrastructure/site";

import { DEFAULT_CONTENT_STATE } from "@/core/domain/constants/common";
import { deletePage } from "@/core/domain/pages/use-cases/delete-page";
import { isDeletePageError } from "@/core/domain/pages/use-cases/delete-page.errors";
import { updatePage } from "@/core/domain/pages/use-cases/update-page";
import { isUpdatePageError } from "@/core/domain/pages/use-cases/update-page.errors";
import { updateSiteIndex } from "@/core/domain/site/use-cases/site-index/update-site-index";

import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import { throwHttp } from "@/lib/http/validation";
import { UpdatePageSchema } from "@/schemas/pages/page-intents";
import { SlugParamSchema } from "@/schemas/routes/params";

// ---- Validation des params de route ----

// ------------------------------------ GET ------------------------------------
export async function GET(req: Request, ctx: { params: unknown }) {
  const NS = "api.admin.pages.slug.GET" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const { slug } = parseDTO(SlugParamSchema, ctx.params);
    const pagesRepo = getPagesRepository();
    const page = await pagesRepo.read(state, slug);
    if (!page) {
      // Pas de magic string : code stable + message court (neutre)
      throwHttp(404, { code: EC.NOT_FOUND, message: "Resource not found." });
    }
    return page;
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
      const result = await run({ slug, state });
      return result; // DTO use-case
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
    const dto = parseDTO(UpdatePageSchema, body);

    const runSiteIndex = updateSiteIndex({ repo: getSiteRepository() });
    const pageRepo = getPagesRepository();
    const run = updatePage({ pages: pageRepo, siteIndex: runSiteIndex });

    const state = dto.state ?? stateFromQuery ?? DEFAULT_CONTENT_STATE;

    try {
      await pageRepo.ensureBase();
      const existing = await pageRepo.read(state, currentSlug);
      if (!existing) {
        throwHttp(404, { code: EC.NOT_FOUND, message: "Resource not found." });
      }

      const result = await run({
        id: existing.id,
        currentSlug,
        title: dto.title,
        slug: dto.slug,
        layout: dto.layout,
        state,
      });
      return result;
    } catch (err: unknown) {
      if (isUpdatePageError(err)) {
        throwHttp(400, { code: err.code, message: err.message });
      }
      throw err;
    }
  });
}
