/**
 * @file src/app/api/admin/pages/route.ts
 * @intro API admin — créer et lister les pages
 * @description
 * - GET  /api/admin/pages?state=draft|published → retourne l’index
 * - POST /api/admin/pages                      → crée une page (use-case)
 *
 * Frontière : readJsonOr400 + parseDTO (Zod) + zodToHttp.
 * Logs       : homogenisés via handleRoute.
 *
 * Sources internes consultées : 02, 03, 04, 05, 06, 07, 11, 12.
 *
 * @layer api/routes
 */

import "@/lib/zod-bootstrap";

import { handleRoute } from "@/lib/api/handle-route";
import { readJsonOr400 } from "@/lib/http/read-json";
import { parseDTO, throwHttp } from "@/lib/http/validation";

import { getPagesRepository } from "@/infrastructure/pages";
import { getSiteRepository } from "@/infrastructure/site";

import { createPage } from "@/core/domain/pages/use-cases/create-page";
import { isCreatePageError } from "@/core/domain/pages/use-cases/create-page.errors";
import { updateSiteIndex } from "@/core/domain/site/use-cases/site-index/update-site-index";

import { CreatePageSchema } from "@/schemas/pages/page-intents";

// ------------------------------------ GET ------------------------------------
export async function GET(req: Request) {
  const NS = "api.admin.pages.GET" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const siteRepo = getSiteRepository();
    const index = await siteRepo.readIndex(state);
    return index;
  });
}

// ----------------------------------- POST ------------------------------------
export async function POST(req: Request) {
  const NS = "api.admin.pages.POST" as const;
  return handleRoute(NS, req, async () => {
    const raw = await readJsonOr400(req);
    const dto = parseDTO(CreatePageSchema, raw);

    const runSiteIndex = updateSiteIndex({ repo: getSiteRepository() });
    const pageRepo = getPagesRepository();
    const run = createPage({ pages: pageRepo, siteIndex: runSiteIndex });

    try {
      const { page, index } = await run(dto);
      // 201 recommandé pour création ; jsonOk(…) dans handleRoute renvoie 200 → on remonte un indicateur dans le payload
      return { created: true, page, index };
    } catch (err: unknown) {
      if (isCreatePageError(err)) {
        throwHttp(400, { code: err.code, message: err.message });
      }
      throw err;
    }
  });
}
