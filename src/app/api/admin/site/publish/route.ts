/**
 * @file src/app/api/admin/site/publish/route.ts
 * @intro API admin — publier le site (draft → published)
 * @description
 * - POST /api/admin/site/publish
 *   - Body (optionnel) : { from?, to?, cleanOrphans? }
 *   - Query (optionnelle) : ?from=…&to=… (le body a priorité)
 *
 * Frontière : readJsonOptionalOrEmpty + parseDTO (Zod) + throwHttp → handleRoute (zodToHttp + logs + no-store).
 * Erreurs métier : isPublishSiteError → throwHttp(400, { code, message }).
 *
 * Sources internes consultées : 02, 03, 04, 05, 06, 07, 11, 12.
 *
 * @layer api/routes
 */

import "@/lib/zod-bootstrap";

import type { ContentState } from "@/constants/shared/common";
import { handleRoute } from "@/lib/api/handle-route";
import { readJsonOptionalOrEmpty } from "@/lib/http/read-json";
import { parseDTO, throwHttp } from "@/lib/http/validation";
import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";
import { PublishSiteIntentSchema } from "@/schemas/site/publish/publish-intents";

import { publishSite } from "@/core/domain/site/use-cases/publish/publish-site";
import { isPublishSiteError } from "@/core/domain/site/use-cases/publish/publish-site.errors";
import { getPagesRepository } from "@/infrastructure/pages";
import { getSiteRepository } from "@/infrastructure/site";
import { log } from "@/lib/log";

/** Parse `?from=` / `?to=` (ignore valeurs invalides) */
function parseStatesFromQuery(req: Request): {
  from?: ContentState;
  to?: ContentState;
} {
  const url = new URL(req.url);
  const qsFrom = url.searchParams.get("from");
  const qsTo = url.searchParams.get("to");
  const isState = (v: string | null): v is ContentState =>
    v === "draft" || v === "published";
  return {
    from: isState(qsFrom) ? qsFrom : undefined,
    to: isState(qsTo) ? qsTo : undefined,
  };
}

export async function POST(req: Request) {
  const NS = "api.admin.site.publish.POST" as const;
  const lg = log.child({ ns: NS });

  return handleRoute(NS, req, async () => {
    const qs = parseStatesFromQuery(req);
    const raw = await readJsonOptionalOrEmpty(req);
    const dto = parseDTO(PublishSiteIntentSchema, raw);

    const from = parseDTO(ContentStateSchema, dto.from ?? qs.from ?? "draft");
    const to = parseDTO(ContentStateSchema, dto.to ?? qs.to ?? "published");

    const run = publishSite({
      site: getSiteRepository(),
      pages: getPagesRepository(),
    });

    try {
      const result = await run({ from, to, cleanOrphans: dto.cleanOrphans });
      lg.info("publish.metrics", {
        from: result.from,
        to: result.to,
        pagesCopied: result.pagesCopied,
        settingsCopied: result.settingsCopied,
        warnings: result.warnings.length,
      });
      return result;
    } catch (err: unknown) {
      if (isPublishSiteError(err)) {
        throwHttp(400, { code: err.code, message: err.message });
      }
      throw err;
    }
  });
}
