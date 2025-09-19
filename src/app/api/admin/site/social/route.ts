/**
 * @file src/app/api/admin/site/social/route.ts
 * @intro API admin — lecture & mise à jour des réglages SocialLinks
 * @description
 * - GET   /api/admin/site/social?state=draft|published → réglages Social (draft par défaut)
 * - PATCH /api/admin/site/social?state=...            → patch partiel
 *
 * Frontière : readJsonOr400 + parseDTO (Zod) + throwHttp → handleRoute (zodToHttp + logs + no-store).
 * Erreurs métier : isUpdateSocialSettingsError → throwHttp(400, { code, message }).
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
import { UpdateSocialSettingsSchema } from "@/schemas/site/social/social-intents";

import { getSiteRepository } from "@/infrastructure/site";
import { updateSocialSettings } from "@/core/domain/site/use-cases/social/update-social-settings";
import { isUpdateSocialSettingsError } from "@/core/domain/site/use-cases/social/update-social-settings.errors";
import { log } from "@/lib/log";

export async function GET(req: Request) {
  const NS = "api.admin.site.social.GET" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const repo = getSiteRepository();
    const siteSettings = await repo.readSettings(state);
    return { settings: siteSettings.social };
  });
}

export async function PATCH(req: Request) {
  const NS = "api.admin.site.social.PATCH" as const;
  const lg = log.child({ ns: NS });
  return handleRoute(NS, req, async ({ state }) => {
    const raw = await readJsonOr400(req);
    const dto = parseDTO(UpdateSocialSettingsSchema, raw);
    const { state: stateFromBody, ...patch } = dto;

    const effectiveState = parseDTO(
      ContentStateSchema,
      stateFromBody ?? state
    );

    const repo = getSiteRepository();
    const run = updateSocialSettings({ repo });

    try {
      const { settings } = await run({ patch, state: effectiveState });

      // métrique items
      const hasItems = (x: unknown): x is { items: unknown[] } =>
        typeof x === "object" &&
        x !== null &&
        Array.isArray((x as Record<string, unknown>)["items"]);
      const itemsLen = hasItems(patch) ? patch.items.length : undefined;

      lg.info("patch.metrics", {
        state: effectiveState,
        patchKeys: Object.keys(patch),
        itemsLen,
      });

      return { settings: settings.social };
    } catch (err: unknown) {
      if (isUpdateSocialSettingsError(err)) {
        throwHttp(400, { code: err.code, message: err.message });
      }
      throw err;
    }
  });
}
