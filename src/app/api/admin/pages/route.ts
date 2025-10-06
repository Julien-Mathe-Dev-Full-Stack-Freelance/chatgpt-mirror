/**
 * @file src/app/api/admin/pages/route.ts
 * @intro API admin — créer et lister les pages
 */

import { handleRoute } from "@/lib/api/handle-route";
import { readJsonOr400 } from "@/lib/http/read-json";
import { parseDTO, throwHttp } from "@/lib/http/validation";
import "@/lib/zod-bootstrap";

import { getPagesRepository } from "@/infrastructure/pages";
import { getSiteRepository } from "@/infrastructure/site";

import { createPage } from "@/core/domain/pages/use-cases/create-page";
import { isCreatePageError } from "@/core/domain/pages/use-cases/create-page.errors";
import { updateSiteIndex } from "@/core/domain/site/use-cases/site-index/update-site-index";

import { adaptCreatePagePayload } from "@/app/api/admin/_adapters/pages";
import type { PageDTO } from "@/core/domain/pages/dto";
import type { SiteIndexDTO } from "@/core/domain/site/dto";
import {
  CreatePageIntentSchema,
  type CreatePageIntentDTO,
} from "@/schemas/pages/page-intents";
import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";

// ——— Response types exportés ———
export type GetPagesIndexResponse = SiteIndexDTO;
export type CreatePageResponse = { page: PageDTO; index: SiteIndexDTO };

// ------------------------------------ GET ------------------------------------
export async function GET(req: Request) {
  const NS = "api.admin.pages.GET" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const siteRepo = getSiteRepository();
    const index = await siteRepo.readIndex(state);
    return index satisfies GetPagesIndexResponse;
  });
}

// ----------------------------------- POST ------------------------------------
export async function POST(req: Request) {
  const NS = "api.admin.pages.POST" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const raw = await readJsonOr400(req);
    const dto: CreatePageIntentDTO = parseDTO(CreatePageIntentSchema, raw);

    // State effectif (body > query)
    const effectiveState = parseDTO(ContentStateSchema, dto.state ?? state);

    const runSiteIndex = updateSiteIndex({ repo: getSiteRepository() });
    const pageRepo = getPagesRepository();
    const run = createPage({ pages: pageRepo, siteIndex: runSiteIndex });

    try {
      const payload = adaptCreatePagePayload(dto); // sans state
      const { page, index } = await run({ ...payload, state: effectiveState });
      const res: CreatePageResponse = { page, index };
      return res;
    } catch (err: unknown) {
      if (isCreatePageError(err)) {
        throwHttp(400, { code: err.code, message: err.message });
      }
      throw err;
    }
  });
}
