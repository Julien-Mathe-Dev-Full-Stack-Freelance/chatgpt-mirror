/**
 * @file src/app/api/admin/site/admin/route.ts
 * @intro API admin — lecture & mise à jour des réglages Admin
 * @description
 * - GET   /api/admin/site/admin?state=draft|published → réglages admin
 * - PATCH /api/admin/site/admin?state=...            → patch partiel
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

import { updateAdminSettings } from "@/core/domain/site/use-cases/admin/update-admin-settings";
import { isUpdateAdminSettingsError } from "@/core/domain/site/use-cases/admin/update-admin-settings.errors";
import { getSiteRepository } from "@/infrastructure/site";

import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";
import { UpdateAdminSettingsSchema } from "@/schemas/site/admin/admin-intents";

export async function GET(req: Request) {
  const NS = "api.admin.site.admin.GET" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const repo = getSiteRepository();
    const siteSettings = await repo.readSettings(state);
    return { settings: siteSettings.admin };
  });
}

export async function PATCH(req: Request) {
  const NS = "api.admin.site.admin.PATCH" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const raw = await readJsonOr400(req);
    const dto = parseDTO(UpdateAdminSettingsSchema, raw);
    const { state: stateFromBody, ...patch } = dto;

    const effectiveState = parseDTO(ContentStateSchema, stateFromBody ?? state);

    const repo = getSiteRepository();
    const run = updateAdminSettings({ repo });

    try {
      const { settings } = await run({ patch, state: effectiveState });
      return { settings: settings.admin };
    } catch (err: unknown) {
      if (isUpdateAdminSettingsError(err)) {
        throwHttp(400, { code: err.code, message: err.message });
      }
      throw err;
    }
  });
}
