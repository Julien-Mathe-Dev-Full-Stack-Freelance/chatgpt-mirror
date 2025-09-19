/**
 * @file src/app/api/admin/site/seo/route.ts
 * @intro API admin — lecture & mise à jour des réglages SEO
 * @description
 * - GET   /api/admin/site/seo?state=draft|published → réglages SEO (draft par défaut)
 * - PATCH /api/admin/site/seo?state=...            → patch partiel
 *
 * Frontière : readJsonOr400 + parseDTO (Zod) + throwHttp → handleRoute (zodToHttp + logs + no-store).
 * Erreurs métier : isUpdateSeoSettingsError → throwHttp(400, { code, message }).
 *
 * Sources internes consultées : 02, 03, 04, 05, 06, 07, 11, 12.
 *
 * @layer api/routes
 */

import "@/lib/zod-bootstrap";

import { handleRoute } from "@/lib/api/handle-route";
import { readJsonOr400 } from "@/lib/http/read-json";
import { parseDTO, throwHttp } from "@/lib/http/validation";
import { ContentStateSchema } from "@/schemas/site/common";
import { UpdateSeoSettingsSchema } from "@/schemas/site/seo/seo-intents";

import { getSiteRepository } from "@/infrastructure/site";
import { updateSeoSettings } from "@/core/domain/site/use-cases/seo/update-seo-settings";
import { isUpdateSeoSettingsError } from "@/core/domain/site/use-cases/seo/update-seo-settings.errors";
import { log } from "@/lib/log";

export async function GET(req: Request) {
  const NS = "api.admin.site.seo.GET" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const repo = getSiteRepository();
    const siteSettings = await repo.readSettings(state);
    return { settings: siteSettings.seo };
  });
}

export async function PATCH(req: Request) {
  const NS = "api.admin.site.seo.PATCH" as const;
  const lg = log.child({ ns: NS });
  return handleRoute(NS, req, async ({ state }) => {
    const raw = await readJsonOr400(req);
    const dto = parseDTO(UpdateSeoSettingsSchema, raw);
    const { state: stateFromBody, ...patch } = dto;

    const effectiveState = parseDTO(
      ContentStateSchema,
      stateFromBody ?? state
    );

    const repo = getSiteRepository();
    const run = updateSeoSettings({ repo });

    try {
      const { settings } = await run({ patch, state: effectiveState });

      const hasTwitter = Object.prototype.hasOwnProperty.call(patch, "twitter");
      const hasOpenGraph = Object.prototype.hasOwnProperty.call(
        patch,
        "openGraph"
      );
      lg.info("patch.metrics", {
        state: effectiveState,
        patchKeys: Object.keys(patch),
        hasTwitter,
        hasOpenGraph,
      });

      return { settings: settings.seo };
    } catch (err: unknown) {
      if (isUpdateSeoSettingsError(err)) {
        throwHttp(400, { code: err.code, message: err.message });
      }
      throw err;
    }
  });
}
