/**
 * @file src/app/api/admin/site/theme/route.ts
 * @intro API admin — lecture & mise à jour des réglages Theme
 * @description
 * - GET   /api/admin/site/theme?state=draft|published → réglages Theme (draft par défaut)
 * - PATCH /api/admin/site/theme?state=...            → patch partiel
 *
 * Frontière : readJsonOr400 + parseDTO (Zod) + throwHttp → handleRoute (zodToHttp + logs + no-store).
 * Erreurs métier : isUpdateThemeSettingsError → throwHttp(400, { code, message }).
 *
 * Sources internes consultées : 02, 03, 04, 05, 06, 07, 11, 12.
 *
 * @layer api/routes
 */

import "@/lib/zod-bootstrap";

import { handleRoute } from "@/lib/api/handle-route";
import { readJsonOr400 } from "@/lib/http/read-json";
import { parseDTO, throwHttp } from "@/lib/http/validation";
import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";
import { UpdateThemeSettingsSchema } from "@/schemas/site/theme/theme-intents";

import { updateThemeSettings } from "@/core/domain/site/use-cases/theme/update-theme-settings";
import { isUpdateThemeSettingsError } from "@/core/domain/site/use-cases/theme/update-theme-settings.errors";
import { getSiteRepository } from "@/infrastructure/site";
import { log } from "@/lib/log";

export async function GET(req: Request) {
  const NS = "api.admin.site.theme.GET" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const repo = getSiteRepository();
    const siteSettings = await repo.readSettings(state);
    return { settings: siteSettings.theme };
  });
}

export async function PATCH(req: Request) {
  const NS = "api.admin.site.theme.PATCH" as const;
  const lg = log.child({ ns: NS });
  return handleRoute(NS, req, async ({ state }) => {
    const raw = await readJsonOr400(req);
    const dto = parseDTO(UpdateThemeSettingsSchema, raw);
    const { state: stateFromBody, ...patch } = dto;

    const effectiveState = parseDTO(ContentStateSchema, stateFromBody ?? state);

    const repo = getSiteRepository();
    const run = updateThemeSettings({ repo });

    try {
      const { settings } = await run({ patch, state: effectiveState });

      lg.info("patch.metrics", {
        state: effectiveState,
        patchKeys: Object.keys(patch),
      });

      return { settings: settings.theme };
    } catch (err: unknown) {
      if (isUpdateThemeSettingsError(err)) {
        throwHttp(400, { code: err.code, message: err.message });
      }
      throw err;
    }
  });
}
