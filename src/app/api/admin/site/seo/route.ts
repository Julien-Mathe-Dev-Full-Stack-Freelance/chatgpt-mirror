/**
 * @file src/app/api/admin/site/seo/route.ts
 * @intro API admin — lecture & mise à jour des réglages SEO (seed-once en GET)
 * @description
 * - GET   /api/admin/site/seo?state=draft|published → réglages SEO (seed-once)
 * - PATCH /api/admin/site/seo?state=...            → patch partiel (DTO→domaine via adapter)
 *
 * Frontière : readJsonOr400 + parseDTO (Zod) → handleRoute (zodToHttp + toHttpError).
 * Domaine : updateSeoSettings (merge shallow) — brouillons incomplets permis.
 * Seed GET : ensureSeoSettings + makeLocalizedSeoDefaults(t).
 *
 * @layer api/routes
 */

import "@/lib/zod-bootstrap";

import { adaptUpdateSeoPatch } from "@/app/api/admin/_adapters/seo";
import { handleRoute } from "@/lib/api/handle-route";
import { readJsonOr400 } from "@/lib/http/read-json";
import { parseDTO } from "@/lib/http/validation";
import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";
import {
  UpdateSeoSettingsIntentSchema,
  type UpdateSeoSettingsIntentDTO,
} from "@/schemas/site/seo/seo-intents";

import { updateSeoSettings } from "@/core/domain/site/use-cases/seo/update-seo-settings";
import { getSiteRepository } from "@/infrastructure/site";
import { log } from "@/lib/log";

import type { SeoSettingsDTO } from "@/core/domain/site/dto";
import type { SeoSettings } from "@/core/domain/site/entities/seo";
import {
  ensureSeoSettings,
  type SeoSettingsRepo,
} from "@/core/domain/site/use-cases/ensure-site-settings";
import { makeLocalizedSeoDefaults } from "@/i18n/factories/admin/seo-defaults";
import { getRequestT } from "@/i18n/server";

/** Shapes de réponse (source de vérité côté route) */
export type GetSeoResponse = { settings: SeoSettingsDTO };
export type PatchSeoResponse = { settings: SeoSettingsDTO };

/** Adapte le repo global site -> mini repo “seo” pour ensure* */
function makeSeoRepo(
  base: ReturnType<typeof getSiteRepository>
): SeoSettingsRepo {
  return {
    async find(state) {
      const all = await base.readSettings(state);
      return (all?.seo as SeoSettings | undefined) ?? null;
    },
    async save(next, state) {
      const all = await base.readSettings(state);
      await base.writeSettings(state, { ...all, seo: next });
    },
  };
}

export async function GET(req: Request) {
  const NS = "api.admin.site.seo.GET" as const;

  return handleRoute(NS, req, async ({ state }) => {
    const baseRepo = getSiteRepository();
    const repo = makeSeoRepo(baseRepo);

    // Seed localisé (persisté si absent)
    const t = await getRequestT();
    const seed = makeLocalizedSeoDefaults(t);

    const ensured = await ensureSeoSettings(repo, seed, state);
    const res: GetSeoResponse = { settings: ensured };
    return res;
  });
}

export async function PATCH(req: Request) {
  const NS = "api.admin.site.seo.PATCH" as const;
  const lg = log.child({ ns: NS });

  return handleRoute(NS, req, async ({ state }) => {
    // 1) Body JSON
    const raw = await readJsonOr400(req);

    // 2) Zod (DTO complet avec state?)
    const dto: UpdateSeoSettingsIntentDTO = parseDTO(
      UpdateSeoSettingsIntentSchema,
      raw
    );

    // 3) State effectif (body > query)
    const { state: stateFromBody, ...patchDto } = dto;
    const effectiveState = parseDTO(ContentStateSchema, stateFromBody ?? state);

    // 4) Adapter DTO → Domaine (patch sans `state`)
    const patch = adaptUpdateSeoPatch(patchDto);

    // 5) Use-case
    const repo = getSiteRepository();
    const run = updateSeoSettings({ repo });

    const { settings } = await run({ patch, state: effectiveState });

    lg.info("patch.metrics", {
      state: effectiveState,
      patchKeys: Object.keys(patch),
      hasTwitter: "twitter" in patch,
      hasOpenGraph: "openGraph" in patch,
    });

    const res: PatchSeoResponse = { settings: settings.seo };
    return res;
  });
}
