/**
 * @file src/app/api/admin/site/identity/route.ts
 * @intro API admin — lecture & mise à jour des réglages Identity
 * @description
 * - GET   /api/admin/site/identity?state=draft|published → réglages identity
 * - PATCH /api/admin/site/identity?state=...            → patch partiel
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
import { parseDTO, throwHttp } from "@/lib/http/validation";
import { readJsonOr400 } from "@/lib/http/read-json";

import { getSiteRepository } from "@/infrastructure/site";
import { updateIdentitySettings } from "@/core/domain/site/use-cases/identity/update-identity-settings";
import { isUpdateIdentitySettingsError } from "@/core/domain/site/use-cases/identity/update-identity-settings.errors";

import { UpdateIdentitySettingsSchema } from "@/schemas/site/identity/identity-intents";
import { ContentStateSchema } from "@/schemas/site/common";

export async function GET(req: Request) {
  const NS = "api.admin.site.identity.GET" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const repo = getSiteRepository();
    const siteSettings = await repo.readSettings(state);
    return { settings: siteSettings.identity };
  });
}

export async function PATCH(req: Request) {
  const NS = "api.admin.site.identity.PATCH" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const raw = await readJsonOr400(req);
    const dto = parseDTO(UpdateIdentitySettingsSchema, raw);
    const { state: stateFromBody, ...patch } = dto;

    const effectiveState = parseDTO(
      ContentStateSchema,
      stateFromBody ?? state
    );

    const repo = getSiteRepository();
    const run = updateIdentitySettings({ repo });

    try {
      const { settings } = await run({ patch, state: effectiveState });
      return { settings: settings.identity };
    } catch (err: unknown) {
      if (isUpdateIdentitySettingsError(err)) {
        throwHttp(400, { code: err.code, message: err.message });
      }
      throw err;
    }
  });
}
