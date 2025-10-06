/**
 * @file src/core/domain/pages/use-cases/delete-page.ts
 * @intro Supprimer une page puis resynchroniser l’index (pattern homogénéisé)
 * @description
 * Étapes :
 * 1) Normaliser + valider le slug via `assertPageSlug` (codes PAGE_*).
 * 2) ensureBase (pages).
 * 3) Suppression idempotente via `pages.delete` si supporté.
 * 4) Mise à jour de l’index via le runner `updateSiteIndex` (REMOVE_BY_SLUG).
 *
 * Observabilité :
 * - info  : start/ok (durée, idempotence)
 * - debug : ensureBase / delete / index.update
 * - warn  : avant de lever une erreur métier (slug manquant/invalid)
 *
 * @layer domain/use-case
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";
import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import { isDomainError } from "@/core/domain/errors/domain-error";
import { DeletePageError } from "@/core/domain/pages/use-cases/delete-page.errors";
import type {
  DeletePageDeps,
  DeletePageInput,
  DeletePageResult,
} from "@/core/domain/pages/use-cases/delete-page.types";
import { SITE_INDEX_ACTIONS } from "@/core/domain/site/index/actions";
import { normalizeSlug } from "@/core/domain/slug/utils";
import { assertPageSlug } from "@/core/domain/slug/validator";
import { log, logWithDuration } from "@/lib/log";

export function deletePage({ pages, siteIndex }: DeletePageDeps) {
  const logger = log.child({ uc: "deletePage" });

  return async function run(input: DeletePageInput): Promise<DeletePageResult> {
    return logWithDuration("uc.deletePage", async () => {
      const state: ContentState = input.state ?? DEFAULT_CONTENT_STATE;
      const raw = (input.slug ?? "").trim();

      logger.info("start", { state, hasSlug: raw.length > 0 });

      if (!raw) {
        logger.warn("rule.slug.missing");
        throw new DeletePageError(EC.PAGE_SLUG_REQUIRED);
      }

      // Normalisation + validation métier (codes PAGE_*)
      const slug = normalizeSlug(raw);
      try {
        assertPageSlug(slug, ["page", "slug"]);
      } catch (e) {
        if (isDomainError(e)) {
          logger.warn("rule.slug.invalid", {
            code: e.code,
            message: e.message,
            details: e.details,
          });
          throw new DeletePageError(e.code, e.message, e.details, e.cause);
        }
        throw e;
      }

      // 1) Préparer l’environnement pages
      await pages.ensureBase();
      logger.debug("persist.ensureBase.ok", { state });

      // 2) Suppression idempotente si supportée
      if (pages.delete) {
        await pages.delete(state, slug);
        logger.debug("persist.page.deleted", { state, slug });
      } else {
        logger.debug("persist.page.deleteUnsupported", { state, slug });
      }

      // 3) Retirer la référence dans l’index (idempotent)
      const { index } = await siteIndex({
        state,
        action: { type: SITE_INDEX_ACTIONS.REMOVE_BY_SLUG, slug },
      });
      logger.debug("index.updated", {
        state,
        action: SITE_INDEX_ACTIONS.REMOVE_BY_SLUG,
        slug,
      });

      logger.info("ok", { state, slug, idempotent: true });
      return { index };
    });
  };
}
