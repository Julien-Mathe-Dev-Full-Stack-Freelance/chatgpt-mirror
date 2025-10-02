/**
 * @file src/app/api/admin/site/footer/route.ts
 * @intro API admin — lecture & mise à jour des réglages Footer
 * @description
 * - GET   /api/admin/site/footer?state=draft|published → réglages footer
 * - PATCH /api/admin/site/footer?state=...            → patch partiel
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

import { updateFooterSettings } from "@/core/domain/site/use-cases/footer/update-footer-settings";
import { isUpdateFooterSettingsError } from "@/core/domain/site/use-cases/footer/update-footer-settings.errors";
import { getSiteRepository } from "@/infrastructure/site";

import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";
import { UpdateFooterSettingsSchema } from "@/schemas/site/footer/footer-intents";

export async function GET(req: Request) {
  const NS = "api.admin.site.footer.GET" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const repo = getSiteRepository();
    const siteSettings = await repo.readSettings(state);
    return { settings: siteSettings.footer };
  });
}

export async function PATCH(req: Request) {
  const NS = "api.admin.site.footer.PATCH" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const raw = await readJsonOr400(req);
    const dto = parseDTO(UpdateFooterSettingsSchema, raw);
    const { state: stateFromBody, ...patch } = dto;

    const effectiveState = parseDTO(ContentStateSchema, stateFromBody ?? state);

    const repo = getSiteRepository();
    const run = updateFooterSettings({ repo });

    try {
      const { settings } = await run({ patch, state: effectiveState });
      return { settings: settings.footer };
    } catch (err: unknown) {
      if (isUpdateFooterSettingsError(err)) {
        throwHttp(400, { code: err.code, message: err.message });
      }
      throw err;
    }
  });
}
