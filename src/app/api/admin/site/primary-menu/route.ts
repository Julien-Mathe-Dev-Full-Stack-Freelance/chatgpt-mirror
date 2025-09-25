/**
 * @file src/app/api/admin/site/primary-menu/route.ts
 * @intro API admin — lecture & mise à jour du menu principal
 * @description
 * - GET   /api/admin/site/primary-menu?state=draft|published → réglages (draft par défaut)
 * - PATCH /api/admin/site/primary-menu?state=...            → patch partiel
 *
 * Frontière : readJsonOr400 + parseDTO (Zod) + throwHttp → handleRoute (zodToHttp + logs + no-store).
 * Erreurs métier : isUpdatePrimaryMenuSettingsError → throwHttp(400, { code, message }).
 *
 * Sources internes consultées : 02, 03, 04, 05, 06, 07, 11, 12.
 *
 * @layer api/routes
 */

import "@/lib/zod-bootstrap";

import { handleRoute } from "@/lib/api/handle-route";
import { readJsonOr400 } from "@/lib/http/read-json";
import { parseDTO, throwHttp } from "@/lib/http/validation";
import { log } from "@/lib/log";
import { ContentStateSchema } from "@/schemas/site/common";

import { updatePrimaryMenuSettings } from "@/core/domain/site/use-cases/primary-menu/update-primary-menu-settings";
import { isUpdatePrimaryMenuSettingsError } from "@/core/domain/site/use-cases/primary-menu/update-primary-menu-settings.errors";
import { getSiteRepository } from "@/infrastructure/site";
import { UpdatePrimaryMenuSettingsSchema } from "@/schemas/site/primary-menu/primary-menu-intents";

export async function GET(req: Request) {
  const NS = "api.admin.site.primary-menu.GET" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const repo = getSiteRepository();
    const siteSettings = await repo.readSettings(state);
    return { settings: siteSettings.primaryMenu };
  });
}

export async function PATCH(req: Request) {
  const NS = "api.admin.site.primary-menu.PATCH" as const;
  const lg = log.child({ ns: NS });
  return handleRoute(NS, req, async ({ state }) => {
    const raw = await readJsonOr400(req);
    const dto = parseDTO(UpdatePrimaryMenuSettingsSchema, raw);
    const { state: stateFromBody, ...patch } = dto;

    const effectiveState = parseDTO(
      ContentStateSchema,
      stateFromBody ?? state
    );

    const repo = getSiteRepository();
    const run = updatePrimaryMenuSettings({ repo });

    try {
      const { settings } = await run({ patch, state: effectiveState });

      const itemsLen = Array.isArray(
        (patch as Record<string, unknown>)["items"]
      )
        ? (patch as { items: unknown[] }).items.length
        : undefined;
      lg.info("patch.metrics", {
        state: effectiveState,
        patchKeys: Object.keys(patch),
        itemsLen,
      });

      return { settings: settings.primaryMenu };
    } catch (err: unknown) {
      if (isUpdatePrimaryMenuSettingsError(err)) {
        throwHttp(400, { code: err.code, message: err.message });
      }
      throw err;
    }
  });
}
