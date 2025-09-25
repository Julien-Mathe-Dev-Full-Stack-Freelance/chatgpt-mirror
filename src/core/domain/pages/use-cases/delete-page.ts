// src/core/domain/pages/use-cases/delete-page.ts
/**
 * @file src/core/domain/pages/use-cases/delete-page.ts
 * @intro Supprimer une page puis resynchroniser l’index (PagesRepo + updateSiteIndex)
 * @description
 * Étapes :
 * 1) Valider la présence du slug.
 * 2) Préparer la persistance (ensureBase côté pages).
 * 3) Tenter la suppression du fichier page via `pages.delete` (si supporté).
 * 4) Déléguer la mise à jour de l’index au **runner** `updateSiteIndex`
 *    avec l’action `{ type: "removeBySlug", slug }` (idempotente).
 *
 * Observabilité :
 * - `info`  : start/ok (durée, idempotence par nature de l’action removeBySlug)
 * - `debug` : points clés (ensureBase, suppression, updateIndex)
 * - `warn`  : juste avant de lever une erreur métier (slug manquant)
 *
 * Erreurs métier :
 * - Lève `DeletePageError` (extends DomainError) avec `code: ErrorCode`.
 *   Codes utilisés : PAGE_SLUG_REQUIRED, PAGE_SLUG_INVALID_FORMAT
 *
 * @layer domain/use-case
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";
import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import { SITE_INDEX_ACTIONS } from "@/core/domain/site/index/actions";
import { isValidSlug } from "@/core/domain/slug/utils";
import { DeletePageError } from "@/core/domain/pages/use-cases/delete-page.errors";
import type {
  DeletePageDeps,
  DeletePageInput,
  DeletePageResult,
} from "@/core/domain/pages/use-cases/delete-page.types";
import { log, logWithDuration } from "@/lib/log";

/**
 * Fabrique le use-case `deletePage`.
 * @param deps - Dépendances injectées (IoC).
 *   - `pages`     : dépôt “par page” (CRUD fichier-par-page).
 *   - `siteIndex` : **runner** `updateSiteIndex` (writer unique de l’index).
 * @returns Une fonction `run(input)` qui exécute la suppression idempotente.
 */
export function deletePage({ pages, siteIndex }: DeletePageDeps) {
  const logger = log.child({ uc: "deletePage" });

  /**
   * Exécute la suppression d’une page (idempotent par conception).
   * @param input - `{ slug, state? }` où `state` vaut `"draft"` par défaut.
   * @returns `{ index }` : l’index après tentative de retrait du slug.
   * @throws DeletePageError - Si `slug` est manquant/illisible.
   */
  return async function run(input: DeletePageInput): Promise<DeletePageResult> {
    return logWithDuration("uc.deletePage", async () => {
      const state: ContentState = input.state ?? DEFAULT_CONTENT_STATE;
      const slug = (input.slug ?? "").trim();

      logger.info("start", { state, slug });

      if (!slug) {
        logger.warn("rule.slug.missing");
        throw new DeletePageError(EC.PAGE_SLUG_REQUIRED);
      }

      // (Optionnel) validation de forme — cohérence avec createPage
      if (!isValidSlug(slug)) {
        logger.warn("rule.slug.invalidFormat", { slug });
        throw new DeletePageError(EC.PAGE_SLUG_INVALID_FORMAT);
      }

      // 1) Préparer l’environnement pages
      await pages.ensureBase();
      logger.debug("persist.ensureBase.ok", { state });

      // 2) Supprimer le fichier page si l’adapter le supporte (idempotent)
      if (pages.delete) {
        await pages.delete(state, slug);
        logger.debug("persist.page.deleted", { state, slug });
      } else {
        logger.debug("persist.page.deleteUnsupported", { state, slug });
      }

      // 3) Retirer la référence du slug dans l’index (idempotent)
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
