/**
 * @file src/app/api/admin/site/primary-menu/route.ts
 * @intro API admin — Primary menu (seed-once en GET, PATCH update)
 */

import "@/lib/zod-bootstrap";

import { handleRoute } from "@/lib/api/handle-route";
import { readJsonOr400 } from "@/lib/http/read-json";
import { parseDTO } from "@/lib/http/validation";
import { log } from "@/lib/log";
import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";

import { adaptUpdatePrimaryMenuPatch } from "@/app/api/admin/_adapters/menus";
import { updatePrimaryMenuSettings } from "@/core/domain/site/use-cases/primary-menu/update-primary-menu-settings";
import { getSiteRepository } from "@/infrastructure/site";
import {
  UpdatePrimaryMenuSettingsIntentSchema,
  type UpdatePrimaryMenuSettingsIntentDTO,
} from "@/schemas/site/primary-menu/primary-menu-intents";

import { makeLocalizedPrimaryMenuDefaults } from "@/i18n/factories/admin/primary-menu-defaults";
import { getRequestT } from "@/i18n/server";

import type { PrimaryMenuSettingsDTO } from "@/core/domain/site/dto";
import type { PrimaryMenuSettings } from "@/core/domain/site/entities";
import {
  ensurePrimaryMenuSettings,
  type PrimaryMenuSettingsRepo,
} from "@/core/domain/site/use-cases/ensure-site-settings";

/** Shapes de réponse (source de vérité pour le client) */
export type GetPrimaryMenuResponse = { settings: PrimaryMenuSettingsDTO };
export type PatchPrimaryMenuResponse = { settings: PrimaryMenuSettingsDTO };

/** Adapte le repo global site -> mini repo “primary menu” pour ensure* */
function makePrimaryRepo(
  base: ReturnType<typeof getSiteRepository>
): PrimaryMenuSettingsRepo {
  return {
    async find(state) {
      const all = await base.readSettings(state);
      return (all?.primaryMenu as PrimaryMenuSettings | undefined) ?? null;
    },
    async save(next, state) {
      const all = await base.readSettings(state);
      await base.writeSettings(state, { ...all, primaryMenu: next });
    },
  };
}

export async function GET(req: Request) {
  const NS = "api.admin.site.primary-menu.GET" as const;

  return handleRoute(NS, req, async ({ state }) => {
    const baseRepo = getSiteRepository();
    const repo = makePrimaryRepo(baseRepo);

    const t = await getRequestT();
    const seed = makeLocalizedPrimaryMenuDefaults(t);

    const ensured = await ensurePrimaryMenuSettings(repo, seed, state);
    const res: GetPrimaryMenuResponse = { settings: ensured };
    return res;
  });
}

export async function PATCH(req: Request) {
  const NS = "api.admin.site.primary-menu.PATCH" as const;
  const lg = log.child({ ns: NS });

  return handleRoute(NS, req, async ({ state }) => {
    const raw = await readJsonOr400(req);

    // Typage explicite du DTO complet (avec `state?`)
    const dto: UpdatePrimaryMenuSettingsIntentDTO = parseDTO(
      UpdatePrimaryMenuSettingsIntentSchema,
      raw
    );

    const { state: stateFromBody, ...patchDto } = dto;
    const effectiveState = parseDTO(ContentStateSchema, stateFromBody ?? state);

    // Adapter DTO → Domaine (brand, trims, structure)
    const patch = adaptUpdatePrimaryMenuPatch(patchDto);

    const repo = getSiteRepository();
    const run = updatePrimaryMenuSettings({ repo });

    const { settings } = await run({ patch, state: effectiveState });

    const itemsLen = Array.isArray(patch.items)
      ? patch.items.length
      : undefined;

    lg.info("patch.metrics", {
      state: effectiveState,
      patchKeys: Object.keys(patch),
      itemsLen,
    });

    const res: PatchPrimaryMenuResponse = { settings: settings.primaryMenu };
    return res;
  });
}
