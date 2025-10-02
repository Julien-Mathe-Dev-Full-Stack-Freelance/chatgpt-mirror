/**
 * @file src/app/api/admin/site/header/route.ts
 * @intro API admin — lecture & mise à jour des réglages Header
 * @description
 * - GET   /api/admin/site/header?state=draft|published → réglages header
 * - PATCH /api/admin/site/header?state=...            → patch partiel
 *
 * Frontière : readJsonOr400 + parseDTO (Zod) + zodToHttp.
 * Logs       : via handleRoute.
 *
 * Sources internes consultées : 02, 03, 04, 05, 06, 07, 11, 12.
 *
 * @layer api/routes
 */

import "@/lib/zod-bootstrap";

import { handleRoute } from "@/lib/api/handle-route";
import { readJsonOr400 } from "@/lib/http/read-json";
import { parseDTO, throwHttp } from "@/lib/http/validation";

import { updateHeaderSettings } from "@/core/domain/site/use-cases/header/update-header-settings";
import { isUpdateHeaderSettingsError } from "@/core/domain/site/use-cases/header/update-header-settings.errors";
import { getSiteRepository } from "@/infrastructure/site";

import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";
import { UpdateHeaderSettingsSchema } from "@/schemas/site/header/header-intents";

export async function GET(req: Request) {
  const NS = "api.admin.site.header.GET" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const repo = getSiteRepository();
    const siteSettings = await repo.readSettings(state);
    return { settings: siteSettings.header };
  });
}

export async function PATCH(req: Request) {
  const NS = "api.admin.site.header.PATCH" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const raw = await readJsonOr400(req);
    const dto = parseDTO(UpdateHeaderSettingsSchema, raw);
    const { state: stateFromBody, ...patch } = dto;

    const effectiveState = parseDTO(ContentStateSchema, stateFromBody ?? state);

    const repo = getSiteRepository();
    const run = updateHeaderSettings({ repo });

    try {
      const { settings } = await run({ patch, state: effectiveState });
      return { settings: settings.header };
    } catch (err: unknown) {
      if (isUpdateHeaderSettingsError(err)) {
        throwHttp(400, { code: err.code, message: err.message });
      }
      throw err;
    }
  });
}
