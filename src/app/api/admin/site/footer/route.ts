/**
 * @file src/app/api/admin/site/footer/route.ts
 * @intro API admin — lecture & mise à jour Footer (seed-once en GET)
 */

import "@/lib/zod-bootstrap";

import { handleRoute } from "@/lib/api/handle-route";
import { readJsonOr400 } from "@/lib/http/read-json";
import { parseDTO } from "@/lib/http/validation";

import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";
import {
  UpdateFooterSettingsIntentSchema,
  type UpdateFooterSettingsIntentDTO,
} from "@/schemas/site/footer/footer-intents";

import { makeLocalizedFooterDefaults } from "@/i18n/factories/admin/footer-defaults";
import { getRequestT } from "@/i18n/server";

import type { FooterSettingsDTO } from "@/core/domain/site/dto";
import type { FooterSettings } from "@/core/domain/site/entities/footer";
import {
  ensureFooterSettings,
  type FooterSettingsRepo,
} from "@/core/domain/site/use-cases/ensure-site-settings";
import { getSiteRepository } from "@/infrastructure/site";

import { adaptUpdateFooterPatch } from "@/app/api/admin/_adapters/footer";
import { updateFooterSettings } from "@/core/domain/site/use-cases/footer/update-footer-settings";

/** Types de réponse exportés (source de vérité pour le client) */
export type GetFooterResponse = { settings: FooterSettingsDTO };
export type PatchFooterResponse = { settings: FooterSettingsDTO };

/** mini-repo Footer pour ensure* */
function makeFooterRepo(
  base: ReturnType<typeof getSiteRepository>
): FooterSettingsRepo {
  return {
    async find(state) {
      const all = await base.readSettings(state);
      return (all?.footer as FooterSettings | undefined) ?? null;
    },
    async save(next, state) {
      const all = await base.readSettings(state);
      await base.writeSettings(state, { ...all, footer: next });
    },
  };
}

export async function GET(req: Request) {
  const NS = "api.admin.site.footer.GET" as const;

  return handleRoute(NS, req, async ({ state }) => {
    const baseRepo = getSiteRepository();
    const repo = makeFooterRepo(baseRepo);

    const t = await getRequestT();
    const seed = makeLocalizedFooterDefaults(t);
    const ensured = await ensureFooterSettings(repo, seed, state);

    // ⬅️ renvoie un DTO domaine sous la clé "settings"
    const res: GetFooterResponse = { settings: ensured };
    return res;
  });
}

export async function PATCH(req: Request) {
  const NS = "api.admin.site.footer.PATCH" as const;

  return handleRoute(NS, req, async ({ state }) => {
    const raw = await readJsonOr400(req);

    const dto: UpdateFooterSettingsIntentDTO = parseDTO(
      UpdateFooterSettingsIntentSchema,
      raw
    );

    const { state: stateFromBody, ...patchDto } = dto;
    const effectiveState = parseDTO(ContentStateSchema, stateFromBody ?? state);

    const patch = adaptUpdateFooterPatch(patchDto);

    const repo = getSiteRepository();
    const run = updateFooterSettings({ repo });

    const { settings } = await run({ patch, state: effectiveState });

    // ⬅️ on renvoie *seulement* la section Footer (DTO domaine) sous "settings"
    const res: PatchFooterResponse = { settings: settings.footer };
    return res;
  });
}
