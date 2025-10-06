// src/core/domain/site/use-cases/site-index/update-site-index.ts
/**
 * @file Use-case : appliquer une action immuable sur l’index puis persister.
 * @description
 * - Lit l’index via `repo.readIndex`, applique l’action (helpers purs),
 *   met à jour `index.updatedAt`, puis écrit l’index via `repo.writeIndex`.
 * - No-op → mêmes références : rien n’est écrit (pattern homogène).
 * @layer domain/use-case
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";
import {
  SITE_INDEX_ACTIONS,
  type SiteIndexAction,
} from "@/core/domain/site/index/actions";
import {
  removePageBySlug,
  upsertPageRef,
} from "@/core/domain/site/index/utils";
import type {
  UpdateSiteIndexDeps,
  UpdateSiteIndexInput,
  UpdateSiteIndexResult,
} from "@/core/domain/site/use-cases/site-index/update-site-index.types";
import { systemClock } from "@/core/domain/utils/clock";
import { log, logWithDuration } from "@/lib/log";

export function updateSiteIndex({
  repo,
  nowIso = systemClock.nowIso,
}: UpdateSiteIndexDeps) {
  const logger = log.child({ uc: "updateSiteIndex" });

  return async function run(
    input: UpdateSiteIndexInput
  ): Promise<UpdateSiteIndexResult> {
    return logWithDuration("uc.updateSiteIndex", async () => {
      const state: ContentState = input.state ?? DEFAULT_CONTENT_STATE;
      const action: SiteIndexAction = input.action;

      logger.info("start", { state, action: action.type });

      // 1) ensure + read **index**
      await repo.ensureBase();
      const prev = await repo.readIndex(state);
      logger.debug("index.read", { state, pagesCount: prev.pages.length });

      // 2) apply action (immutables)
      let next = prev;
      switch (action.type) {
        case SITE_INDEX_ACTIONS.ENSURE_PAGE_LISTED:
          next = upsertPageRef(prev, action.ref, action.position);
          break;
        case SITE_INDEX_ACTIONS.REMOVE_BY_SLUG:
          next = removePageBySlug(prev, action.slug).next;
          break;
      }

      // 3) no-op branch (mêmes références → rien à écrire)
      if (next === prev) {
        logger.info("ok.noop", { state });
        return { index: prev };
      }

      // 4) persist **index** avec updatedAt
      const updatedAt = nowIso();
      const indexNext = { ...next, updatedAt };
      await repo.writeIndex(state, indexNext);
      logger.debug("index.written", {
        state,
        before: prev.pages.length,
        after: indexNext.pages.length,
      });

      logger.info("ok", { state });
      return { index: indexNext };
    });
  };
}
