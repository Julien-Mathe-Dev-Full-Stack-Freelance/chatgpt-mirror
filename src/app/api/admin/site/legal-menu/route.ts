/**
 * @file src/app/api/admin/site/legal-menu/route.ts
 * @intro API admin — lecture & mise à jour du menu légal
 * @description
 * - GET   /api/admin/site/legal-menu?state=draft|published → réglages (draft par défaut)
 * - PATCH /api/admin/site/legal-menu?state=...            → patch partiel
 *
 * Frontière : readJsonOr400 + parseDTO (Zod) + throwHttp → handleRoute (zodToHttp + logs + no-store).
 * Erreurs métier : isUpdateLegalMenuSettingsError → throwHttp(400, { code, message }).
 *
 * Sources internes consultées : 02, 03, 04, 05, 06, 07, 11, 12.
 *
 * @layer api/routes
 */

import "@/lib/zod-bootstrap";

import { handleRoute } from "@/lib/api/handle-route";
import { parseDTO, throwHttp } from "@/lib/http/validation";
import { readJsonOr400 } from "@/lib/http/read-json";
import { ContentStateSchema } from "@/schemas/site/common";

import { getSiteRepository } from "@/infrastructure/site";
import { updateLegalMenuSettings } from "@/core/domain/site/use-cases/legal-menu/update-legal-menu-settings";
import { isUpdateLegalMenuSettingsError } from "@/core/domain/site/use-cases/legal-menu/update-legal-menu-settings.errors";
import { UpdateLegalMenuSettingsSchema } from "@/schemas/site/legal-menu/legal-menu-intents";
import { log } from "@/lib/log";

export async function GET(req: Request) {
  const NS = "api.admin.site.legal-menu.GET" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const repo = getSiteRepository();
    const siteSettings = await repo.readSettings(state);
    return { settings: siteSettings.legalMenu };
  });
}

export async function PATCH(req: Request) {
  const NS = "api.admin.site.legal-menu.PATCH" as const;
  const lg = log.child({ ns: NS });
  return handleRoute(NS, req, async ({ state }) => {
    const raw = await readJsonOr400(req);
    const dto = parseDTO(UpdateLegalMenuSettingsSchema, raw);
    const { state: stateFromBody, ...patch } = dto;

    const effectiveState = parseDTO(
      ContentStateSchema,
      stateFromBody ?? state
    );

    const repo = getSiteRepository();
    const run = updateLegalMenuSettings({ repo });

    try {
      const { settings } = await run({ patch, state: effectiveState });

      // métrique utile (optionnelle)
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

      return { settings: settings.legalMenu };
    } catch (err: unknown) {
      if (isUpdateLegalMenuSettingsError(err)) {
        throwHttp(400, { code: err.code, message: err.message });
      }
      throw err;
    }
  });
}
