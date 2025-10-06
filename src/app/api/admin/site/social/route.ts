/**
 * @file src/app/api/admin/site/social/route.ts
 * @intro API admin — Social settings (seed-once en GET, PATCH update)
 */

import "@/lib/zod-bootstrap";

import { handleRoute } from "@/lib/api/handle-route";
import { readJsonOr400 } from "@/lib/http/read-json";
import { parseDTO } from "@/lib/http/validation";
import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";
import {
  UpdateSocialSettingsIntentSchema,
  type UpdateSocialSettingsIntentDTO,
} from "@/schemas/site/social/social-intents";

import { adaptUpdateSocialPatch } from "@/app/api/admin/_adapters/social";
import { updateSocialSettings } from "@/core/domain/site/use-cases/social/update-social-settings";
import { getSiteRepository } from "@/infrastructure/site";
import { log } from "@/lib/log";

// ▼ Assure-toi d’avoir ces exports côté domaine & i18n (mêmes patterns que identity/legal/primary)
import type { SocialSettingsDTO } from "@/core/domain/site/dto";
import type { SocialSettings } from "@/core/domain/site/entities/social";
import {
  ensureSocialSettings,
  type SocialSettingsRepo,
} from "@/core/domain/site/use-cases/ensure-site-settings";
import { makeLocalizedSocialDefaults } from "@/i18n/factories/admin/social-defaults";
import { getRequestT } from "@/i18n/server";

/** Shapes de réponse (source de vérité côté route) */
export type GetSocialResponse = { settings: SocialSettingsDTO };
export type PatchSocialResponse = { settings: SocialSettingsDTO };

/** Adapte le repo global site -> mini repo “social” pour ensure* */
function makeSocialRepo(
  base: ReturnType<typeof getSiteRepository>
): SocialSettingsRepo {
  return {
    async find(state) {
      const all = await base.readSettings(state);
      return (all?.social as SocialSettings | undefined) ?? null;
    },
    async save(next, state) {
      const all = await base.readSettings(state);
      await base.writeSettings(state, { ...all, social: next });
    },
  };
}

export async function GET(req: Request) {
  const NS = "api.admin.site.social.GET" as const;
  return handleRoute(NS, req, async ({ state }) => {
    const baseRepo = getSiteRepository();
    const repo = makeSocialRepo(baseRepo);

    // Seed localisé (sera PERSISTÉ si social absent)
    const t = await getRequestT();
    const seed = makeLocalizedSocialDefaults(t);
    const ensured = await ensureSocialSettings(repo, seed, state);

    const res: GetSocialResponse = { settings: ensured };
    return res;
  });
}

export async function PATCH(req: Request) {
  const NS = "api.admin.site.social.PATCH" as const;
  const lg = log.child({ ns: NS });

  return handleRoute(NS, req, async ({ state }) => {
    const raw = await readJsonOr400(req);

    // DTO complet (avec `state?`)
    const dto: UpdateSocialSettingsIntentDTO = parseDTO(
      UpdateSocialSettingsIntentSchema,
      raw
    );

    const { state: stateFromBody, ...patchDto } = dto;
    const effectiveState = parseDTO(ContentStateSchema, stateFromBody ?? state);

    // Adapter DTO → Domaine (brand href, etc.)
    const patch = adaptUpdateSocialPatch(patchDto);

    const repo = getSiteRepository();
    const run = updateSocialSettings({ repo });

    const { settings } = await run({ patch, state: effectiveState });

    lg.info("patch.metrics", {
      state: effectiveState,
      patchKeys: Object.keys(patch),
      itemsLen: Array.isArray(patch.items) ? patch.items.length : undefined,
    });

    const res: PatchSocialResponse = { settings: settings.social };
    return res;
  });
}
