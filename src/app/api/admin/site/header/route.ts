/**
 * @file src/app/api/admin/site/header/route.ts
 * @intro API admin — lecture & mise à jour des réglages Header (seed-once en GET)
 * @description
 * - GET   /api/admin/site/header?state=draft|published → réglages header (ensure + seed)
 * - PATCH /api/admin/site/header?state=...            → patch partiel
 *
 * Frontière : readJsonOr400 + parseDTO (Zod).
 * Logs       : via handleRoute.
 *
 * @layer api/routes
 */

import "@/lib/zod-bootstrap";

import { handleRoute } from "@/lib/api/handle-route";
import { readJsonOr400 } from "@/lib/http/read-json";
import { parseDTO } from "@/lib/http/validation";

import { adaptUpdateHeaderPatch } from "@/app/api/admin/_adapters/header";
import { updateHeaderSettings } from "@/core/domain/site/use-cases/header/update-header-settings";
import { getSiteRepository } from "@/infrastructure/site";

import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";
import {
  UpdateHeaderSettingsIntentSchema,
  type UpdateHeaderSettingsIntentDTO,
} from "@/schemas/site/header/header-intents";

import { makeLocalizedHeaderDefaults } from "@/i18n/factories/admin/header-defaults";
import { getRequestT } from "@/i18n/server";

import type { HeaderSettingsDTO } from "@/core/domain/site/dto";
import type { HeaderSettings } from "@/core/domain/site/entities/header";
import {
  ensureHeaderSettings,
  type HeaderSettingsRepo,
} from "@/core/domain/site/use-cases/ensure-site-settings";

/** Types de réponse exportés (source de vérité pour le client) */
export type GetHeaderResponse = { settings: HeaderSettingsDTO };
export type PatchHeaderResponse = { settings: HeaderSettingsDTO };

/** Adapte le repo global site -> mini repo “header” pour ensure* */
function makeHeaderRepo(
  base: ReturnType<typeof getSiteRepository>
): HeaderSettingsRepo {
  return {
    async find(state) {
      const all = await base.readSettings(state);
      return (all?.header as HeaderSettings | undefined) ?? null;
    },
    async save(next, state) {
      const all = await base.readSettings(state);
      await base.writeSettings(state, { ...all, header: next });
    },
  };
}

export async function GET(req: Request) {
  const NS = "api.admin.site.header.GET" as const;

  return handleRoute(NS, req, async ({ state }) => {
    const baseRepo = getSiteRepository();
    const repo = makeHeaderRepo(baseRepo);

    // Seed localisé (même si V0.5 ne localise rien, on garde la symétrie “seed-once”)
    const t = await getRequestT();
    const seed = makeLocalizedHeaderDefaults(t);

    const ensured = await ensureHeaderSettings(repo, seed, state);
    const res: GetHeaderResponse = { settings: ensured };
    return res;
  });
}

export async function PATCH(req: Request) {
  const NS = "api.admin.site.header.PATCH" as const;

  return handleRoute(NS, req, async ({ state }) => {
    // 1) Body brut
    const raw = await readJsonOr400(req);

    // 2) Frontière Zod → DTO (avec `state?`)
    const dto: UpdateHeaderSettingsIntentDTO = parseDTO(
      UpdateHeaderSettingsIntentSchema,
      raw
    );

    // 3) State effectif
    const { state: stateFromBody, ...patchDto } = dto;
    const effectiveState = parseDTO(ContentStateSchema, stateFromBody ?? state);

    // 4) Adapter DTO → Domaine (patch sans `state`)
    const patch = adaptUpdateHeaderPatch(patchDto);

    // 5) Use-case — laisse remonter les DomainError (gérées par handleRoute)
    const repo = getSiteRepository();
    const run = updateHeaderSettings({ repo });

    const { settings } = await run({ patch, state: effectiveState });
    const res: PatchHeaderResponse = { settings: settings.header };
    return res;
  });
}
