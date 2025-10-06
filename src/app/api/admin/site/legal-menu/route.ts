/**
 * @file src/app/api/admin/site/legal-menu/route.ts
 * @intro API admin — Legal menu (seed-once en GET, PATCH update)
 */

import "@/lib/zod-bootstrap";

import { handleRoute } from "@/lib/api/handle-route";
import { readJsonOr400 } from "@/lib/http/read-json";
import { parseDTO } from "@/lib/http/validation";
import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";

import { adaptUpdateLegalMenuPatch } from "@/app/api/admin/_adapters/menus";
import { updateLegalMenuSettings } from "@/core/domain/site/use-cases/legal-menu/update-legal-menu-settings";
import { getSiteRepository } from "@/infrastructure/site";
import {
  UpdateLegalMenuSettingsIntentSchema,
  type UpdateLegalMenuSettingsIntentDTO,
} from "@/schemas/site/legal-menu/legal-menu-intents";

import { makeLocalizedLegalMenuDefaults } from "@/i18n/factories/admin/legal-menu-defaults";
import { getRequestT } from "@/i18n/server";

import type { LegalMenuSettingsDTO } from "@/core/domain/site/dto";
import type { LegalMenuSettings } from "@/core/domain/site/entities";
import {
  ensureLegalMenuSettings,
  type LegalMenuSettingsRepo,
} from "@/core/domain/site/use-cases/ensure-site-settings";
import { log } from "@/lib/log";

/** Shapes de réponse (source de vérité) */
export type GetLegalMenuResponse = { settings: LegalMenuSettingsDTO };
export type PatchLegalMenuResponse = { settings: LegalMenuSettingsDTO };

/** Adapte le repo global site -> mini repo “legal menu” pour ensure* */
function makeLegalRepo(
  base: ReturnType<typeof getSiteRepository>
): LegalMenuSettingsRepo {
  return {
    async find(state) {
      const all = await base.readSettings(state);
      return (all?.legalMenu as LegalMenuSettings | undefined) ?? null;
    },
    async save(next, state) {
      const all = await base.readSettings(state);
      await base.writeSettings(state, { ...all, legalMenu: next });
    },
  };
}

export async function GET(req: Request) {
  const NS = "api.admin.site.legal-menu.GET" as const;

  return handleRoute(NS, req, async ({ state }) => {
    const baseRepo = getSiteRepository();
    const repo = makeLegalRepo(baseRepo);

    const t = await getRequestT();
    const seed = makeLocalizedLegalMenuDefaults(t);

    const ensured = await ensureLegalMenuSettings(repo, seed, state);
    const res: GetLegalMenuResponse = { settings: ensured };
    return res;
  });
}

export async function PATCH(req: Request) {
  const NS = "api.admin.site.legal-menu.PATCH" as const;
  const lg = log.child({ ns: NS });

  return handleRoute(NS, req, async ({ state }) => {
    // 1) Body JSON
    const raw = await readJsonOr400(req);

    // 2) Zod (DTO complet avec state?)
    const dto: UpdateLegalMenuSettingsIntentDTO = parseDTO(
      UpdateLegalMenuSettingsIntentSchema,
      raw
    );

    // 3) State effectif
    const { state: stateFromBody, ...patchDto } = dto;
    const effectiveState = parseDTO(ContentStateSchema, stateFromBody ?? state);

    // 4) Adapter DTO → Domaine (patch sans `state`)
    const patch = adaptUpdateLegalMenuPatch(patchDto);

    // 5) Use-case
    const repo = getSiteRepository();
    const run = updateLegalMenuSettings({ repo });
    const { settings } = await run({ patch, state: effectiveState });

    const itemsLen = Array.isArray(patch.items)
      ? patch.items.length
      : undefined;

    lg.info("patch.metrics", {
      state: effectiveState,
      patchKeys: Object.keys(patch as Record<string, unknown>),
      itemsLen,
    });

    const res: PatchLegalMenuResponse = { settings: settings.legalMenu };
    return res;
  });
}
