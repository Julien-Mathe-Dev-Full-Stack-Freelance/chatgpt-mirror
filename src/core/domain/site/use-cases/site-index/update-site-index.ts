/**
 * @file src/core/domain/site/use-cases/site-index/update-site-index.ts
 * @intro Use-case : valider les invariants + persister l’index du site.
 * @description
 * Charge/valide l’index fourni (unicité id/slug, etc.) via `checkSiteIndexInvariants`,
 * puis écrit l’index si tout est OK. En cas d’échec, lève une `UpdateSiteIndexError`
 * avec `code: DOMAIN_RULE_VIOLATION`.
 *
 * Observabilité :
 * - `info`  : début/fin avec durée
 * - `debug` : ensureBase / write + cardinalités
 * - `warn`  : détails des issues d’invariants
 *
 * @layer domain/use-case
 */

import {
  DEFAULT_CONTENT_STATE,
  POS_APPEND,
  type ContentState,
} from "@/core/domain/constants/common";
import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import type { SiteIndex } from "@/core/domain/site/entities/site-index";
import {
  removePageById,
  removePageBySlug,
  upsertPageRef,
} from "@/core/domain/site/index/helpers";
import { UpdateSiteIndexError } from "@/core/domain/site/use-cases/site-index/update-site-index.errors";
import type {
  UpdateSiteIndexAction,
  UpdateSiteIndexDeps,
  UpdateSiteIndexInput,
  UpdateSiteIndexResult,
} from "@/core/domain/site/use-cases/site-index/update-site-index.types";
import { checkSiteIndexInvariants } from "@/core/domain/site/index/validators";
import { log, logWithDuration } from "@/lib/log";

/**
 * Fabrique le use-case `updateSiteIndex`.
 * @param deps - Dépendances injectées (repository site).
 * @returns runner : `(input) => Promise<{ index }>`
 */
export function updateSiteIndex({ repo }: UpdateSiteIndexDeps) {
  const logger = log.child({ uc: "updateSiteIndex" });

  return async function run(
    input: UpdateSiteIndexInput
  ): Promise<UpdateSiteIndexResult> {
    return logWithDuration("uc.updateSiteIndex", async () => {
      const state: ContentState = input.state ?? DEFAULT_CONTENT_STATE;

      // 1) Préparer & lire
      await repo.ensureBase();
      logger.debug("persist.ensureBase.ok", { state });

      const current = await repo.readIndex(state);
      logger.debug("index.read", { state, pagesCount: current.pages.length });

      // 2) Appliquer l’action (avec garde-fou sur ref si besoin)
      const next = applyAction(current, input.action);

      // 3) Invariants
      const issues = checkSiteIndexInvariants(next);
      if (issues.length) {
        logger.warn("invariants.failed", {
          state,
          issuesCount: issues.length,
          issues,
        });
        const [first] = issues;
        const code = first?.code ?? EC.DOMAIN_RULE_VIOLATION;
        throw new UpdateSiteIndexError(code, undefined, { issues });
      }

      // 4) Persister (idempotent)
      await repo.writeIndex(state, next);
      logger.debug("index.written", {
        state,
        before: current.pages.length,
        after: next.pages.length,
      });

      logger.info("ok", { state });
      return { index: next };
    });
  };
}

function applyAction(
  index: SiteIndex,
  action: UpdateSiteIndexAction
): SiteIndex {
  switch (action.type) {
    case "ensurePageListed":
      return upsertPageRef(index, action.ref, action.position ?? POS_APPEND);
    case "removeBySlug":
      return removePageBySlug(index, action.slug).next;
    case "removeById":
      return removePageById(index, action.id).next;
  }
}
