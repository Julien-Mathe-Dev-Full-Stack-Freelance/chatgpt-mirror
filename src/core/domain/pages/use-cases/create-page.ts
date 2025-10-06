// src/core/domain/pages/use-cases/create-page.ts
import {
  DEFAULT_CONTENT_STATE,
  POS_APPEND,
  type ContentState,
} from "@/core/domain/constants/common";
import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import { isDomainError } from "@/core/domain/errors/domain-error";
import { type PageId } from "@/core/domain/ids/schema";
import { genPageId } from "@/core/domain/ids/tools"; // ⬅️ use existing tool
import type { Page } from "@/core/domain/pages/entities/page";
import { CreatePageError } from "@/core/domain/pages/use-cases/create-page.errors";
import type {
  CreatePageDeps,
  CreatePageInput,
  CreatePageResult,
} from "@/core/domain/pages/use-cases/create-page.types";
import { SITE_INDEX_ACTIONS } from "@/core/domain/site/index/actions";
import { normalizeSlug } from "@/core/domain/slug/utils";
import { assertPageSlug } from "@/core/domain/slug/validator";
import { systemClock } from "@/core/domain/utils/clock";
import { log, logWithDuration } from "@/lib/log";

export function createPage({
  pages,
  siteIndex,
  nowIso = systemClock.nowIso,
  genId: injectedGenPageId = genPageId, // ⬅️ défaut = tool SoT
}: CreatePageDeps) {
  const logger = log.child({ uc: "createPage" });

  return async function run(input: CreatePageInput): Promise<CreatePageResult> {
    return logWithDuration("uc.createPage", async () => {
      const state: ContentState = input.state ?? DEFAULT_CONTENT_STATE;
      logger.info("start", { state });

      // 1) Title
      const rawTitle = (input.title ?? "").trim();
      if (!rawTitle) {
        logger.warn("rule.title.empty");
        throw new CreatePageError(EC.PAGE_TITLE_REQUIRED);
      }

      // 2) Slug base -> normalisation
      const base = input.slug
        ? normalizeSlug(input.slug)
        : normalizeSlug(rawTitle);

      if (!base) {
        logger.warn("rule.slug.emptyAfterNormalization", {
          fromInput: Boolean(input.slug),
        });
        throw new CreatePageError(EC.PAGE_SLUG_REQUIRED);
      }

      // 3) Validation métier du slug
      try {
        assertPageSlug(base, ["page", "slug"]);
      } catch (e) {
        if (isDomainError(e)) {
          logger.warn("rule.slug.invalid", {
            code: e.code,
            details: e.details,
          });
          throw new CreatePageError(e.code, e.message, e.details, e.cause);
        }
        throw e;
      }

      // 4) Collisions
      let slug = base;
      let suffix = 2;
      let collisions = 0;
      while (await pages.exists(state, slug)) {
        collisions++;
        slug = `${base}-${suffix++}`;
      }
      if (collisions > 0) {
        logger.debug("slug.collision.resolved", {
          baseSlug: base,
          collisions,
          finalSlug: slug,
        });
      }

      // 5) Entité (sans layout, comme décidé)
      const at = nowIso();
      const page: Page = {
        id: injectedGenPageId() as PageId, // ⬅️ tool SoT
        slug,
        title: rawTitle,
        blocks: [],
        meta: { createdAt: at, updatedAt: at },
      };

      // 6) Persist
      await pages.ensureBase();
      await pages.put(state, page);
      logger.debug("persist.page.written", { state, slug: page.slug });

      // 7) MAJ index
      const { index } = await siteIndex({
        state,
        action: {
          type: SITE_INDEX_ACTIONS.ENSURE_PAGE_LISTED,
          ref: { id: page.id, slug: page.slug, title: page.title },
          position: POS_APPEND,
        },
      });

      logger.info("ok", { state, slug });
      return { page, index };
    });
  };
}
