// src/app/api/admin/site/identity/route.ts
/**
 * @file src/app/api/admin/site/identity/route.ts
 * @intro API admin — lecture & mise à jour des réglages Identity (seed-once)
 */

import "@/lib/zod-bootstrap";

import { handleRoute } from "@/lib/api/handle-route";
import { readJsonOr400 } from "@/lib/http/read-json";
import { parseDTO } from "@/lib/http/validation";

import { adaptUpdateIdentityPatch } from "@/app/api/admin/_adapters/identity";
import { updateIdentitySettings } from "@/core/domain/site/use-cases/identity/update-identity-settings";
import { getSiteRepository } from "@/infrastructure/site";
import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";
import {
  UpdateIdentitySettingsIntentSchema,
  type UpdateIdentitySettingsIntentDTO,
} from "@/schemas/site/identity/identity-intents";

import { makeLocalizedIdentityDefaults } from "@/i18n/factories/admin/identity-defaults";
import { getRequestT } from "@/i18n/server";

import type { IdentitySettingsDTO } from "@/core/domain/site/dto";
import type { IdentitySettings } from "@/core/domain/site/entities/identity";
import {
  ensureIdentitySettings,
  type IdentitySettingsRepo,
} from "@/core/domain/site/use-cases/ensure-site-settings";

/** Shapes de réponse (source de vérité pour le client) */
export type GetIdentityResponse = { settings: IdentitySettingsDTO };
export type PatchIdentityResponse = { settings: IdentitySettingsDTO };

/** Adapte le repo global site -> mini repo “identity” pour ensure* */
function makeIdentityRepo(
  base: ReturnType<typeof getSiteRepository>
): IdentitySettingsRepo {
  return {
    async find(state) {
      const all = await base.readSettings(state);
      return (all?.identity as IdentitySettings | undefined) ?? null;
    },
    async save(next, state) {
      const all = await base.readSettings(state);
      await base.writeSettings(state, { ...all, identity: next });
    },
  };
}

export async function GET(req: Request) {
  const NS = "api.admin.site.identity.GET" as const;

  return handleRoute(NS, req, async ({ state }) => {
    const baseRepo = getSiteRepository();
    const repo = makeIdentityRepo(baseRepo);

    const t = await getRequestT();
    const seed = makeLocalizedIdentityDefaults(t);

    const ensured = await ensureIdentitySettings(repo, seed, state);
    const res: GetIdentityResponse = { settings: ensured };
    return res;
  });
}

export async function PATCH(req: Request) {
  const NS = "api.admin.site.identity.PATCH" as const;

  return handleRoute(NS, req, async ({ state }) => {
    // 1) Lire le body brut (400 si invalide)
    const raw = await readJsonOr400(req);

    // 2) Valider la FORME (Zod) → typer explicitement le DTO complet (avec `state?`)
    const dto: UpdateIdentitySettingsIntentDTO = parseDTO(
      UpdateIdentitySettingsIntentSchema,
      raw
    );

    // 3) Extraire state éventuel du body & composer avec la query
    const { state: stateFromBody, ...patchDto } = dto;
    const effectiveState = parseDTO(ContentStateSchema, stateFromBody ?? state);

    // 4) Adapter (DTO → Domaine) — patch sans `state`
    const patch = adaptUpdateIdentityPatch(patchDto);

    // 5) Use-case
    const repo = getSiteRepository();
    const run = updateIdentitySettings({ repo });
    const { settings } = await run({ patch, state: effectiveState });

    const res: PatchIdentityResponse = { settings: settings.identity };
    return res;
  });
}
