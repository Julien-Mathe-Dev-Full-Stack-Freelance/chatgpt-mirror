// src/core/domain/pages/use-cases/update-page.ts
/**
 * @file src/core/domain/pages/use-cases/update-page.ts
 * @intro Met à jour une page (titre, slug, layout) et synchronise l’index.
 * @description
 * Règles :
 * - `currentSlug` identifie la cible.
 * - Si `slug` est fourni : slugify + validations (format, réservés) + résolution de collisions.
 * - `layout` est PARTIEL → fusion avec l’existant (pas de reset implicite).
 * - `updatedAt` est toujours rafraîchi si la page change.
 * - L’index est synchronisé via le **runner** `updateSiteIndex` (upsert par id).
 *
 * Idempotence :
 * - Si rien ne change (titre/slug/layout identiques), on évite toute écriture page et on
 *   upsert quand même l’index de façon idempotente (sécurité).
 *
 * Frontière :
 * - La forme (min/max titre…) est validée côté API via Zod ; ici on garde les garde-fous métier.
 *
 * Observabilité :
 * - `info`  : start/ok (durée, changements)
 * - `warn`  : avant une erreur métier (slug manquant/invalid, not found…)
 * - `debug` : points clés (ensureBase, lecture, collisions, persistance, index)
 *
 * Erreurs métier :
 * - Lève `UpdatePageError` (extends DomainError) avec `code: ErrorCode`.
 *   Codes utilisés : VALIDATION_ERROR, PAGE_NOT_FOUND, PAGE_SLUG_INVALID_FORMAT, PAGE_SLUG_RESERVED
 *
 * @layer domain/use-case
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";
import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import type { Page } from "@/core/domain/pages/entities/page";
import { UpdatePageError } from "@/core/domain/pages/use-cases/update-page.errors";
import type {
  UpdatePageDeps,
  UpdatePageInput,
  UpdatePageResult,
} from "@/core/domain/pages/use-cases/update-page.types";
import { SITE_INDEX_ACTIONS } from "@/core/domain/site/index/actions";
import {
  isReservedSlug,
  isValidSlug,
  normalizeSlug,
} from "@/core/domain/slug/utils";
import { systemClock } from "@/core/domain/utils/clock";
import { log, logWithDuration } from "@/lib/log";
import { isShallowEqual } from "@/lib/merge";

/**
 * Fabrique du use-case `updatePage`.
 * @param deps - Dépendances injectées (repositories + horloge optionnelle).
 *   - `pages`     : dépôt de pages (lecture/écriture/suppression).
 *   - `siteIndex` : runner `updateSiteIndex` (writer unique de l’index).
 *   - `now?`      : horloge injectable (ISO string) pour testabilité/déterminisme.
 * @returns Une fonction `run(input)` qui exécute la mise à jour et renvoie `{ page, index }`.
 */
export function updatePage({
  pages,
  siteIndex,
  nowIso = systemClock.nowIso,
}: UpdatePageDeps) {
  const logger = log.child({ uc: "updatePage" });

  /**
   * Exécute la mise à jour (titre, slug, layout) et synchronise l’index.
   * @param input - `{ currentSlug, title?, slug?, layout?, state? }`.
   * @returns Objet `{ page, index }` avec la page persistée et l’index synchronisé.
   * @throws UpdatePageError - En cas d’input invalide, page introuvable, slug invalide/réservé.
   */
  return async function run(input: UpdatePageInput): Promise<UpdatePageResult> {
    return logWithDuration("uc.updatePage", async () => {
      const state: ContentState = input.state ?? DEFAULT_CONTENT_STATE;
      const currentSlug = (input.currentSlug ?? "").trim();

      logger.info("start", { state, currentSlug });

      if (!currentSlug) {
        logger.warn("rule.currentSlug.missing");
        throw new UpdatePageError(EC.PAGE_CURRENT_SLUG_REQUIRED);
      }

      await pages.ensureBase();
      logger.debug("persist.ensureBase.ok", { state });

      const existing = await pages.read(state, currentSlug);
      if (!existing) {
        logger.warn("rule.page.notFound", { state, currentSlug });
        throw new UpdatePageError(EC.PAGE_NOT_FOUND);
      }
      logger.debug("page.read", { id: existing.id, slug: existing.slug });

      // 1) Titre
      const providedTitle = input.title?.trim();
      const newTitle =
        providedTitle && providedTitle.length > 0
          ? providedTitle
          : existing.title;

      // 2) Slug (si fourni)
      let targetSlug = existing.slug;
      if (typeof input.slug === "string") {
        const raw = input.slug.trim();
        const candidate = raw ? normalizeSlug(raw) : "";
        if (!candidate) {
          logger.warn("rule.slug.emptyAfterNormalization", {
            provided: raw.length > 0,
          });
          throw new UpdatePageError(EC.PAGE_SLUG_INVALID_FORMAT);
        }
        if (!isValidSlug(candidate)) {
          logger.warn("rule.slug.invalidFormat", { candidate });
          throw new UpdatePageError(EC.PAGE_SLUG_INVALID_FORMAT);
        }
        if (isReservedSlug(candidate)) {
          logger.warn("rule.slug.reserved", { candidate });
          throw new UpdatePageError(EC.PAGE_SLUG_RESERVED);
        }
        targetSlug = candidate;
      }

      // 3) Collisions (uniquement si le slug change)
      const slugWasChanged = targetSlug !== existing.slug;
      if (slugWasChanged) {
        // Si un autre contenu occupe déjà ce slug → on lève une erreur claire
        if (await pages.exists(state, targetSlug)) {
          logger.warn("rule.slug.conflict", { candidate: targetSlug });
          throw new UpdatePageError(EC.CONFLICT);
        }
      }

      // 4) Layout (merge partiel + détection via shallow equal)
      const newLayout: Page["layout"] = {
        ...existing.layout,
        ...(input.layout ?? {}),
      };
      const layoutChanged = !isShallowEqual(existing.layout, newLayout);
      const titleChanged = newTitle !== existing.title;

      if (!slugWasChanged && !titleChanged && !layoutChanged) {
        logger.info("ok.noop", { state, currentSlug });

        const { index } = await siteIndex({
          state,
          action: {
            type: SITE_INDEX_ACTIONS.ENSURE_PAGE_LISTED,
            ref: {
              id: existing.id,
              slug: existing.slug,
              title: existing.title,
            },
          },
        });

        return { page: existing, index };
      }

      // 5) Construire + persister
      const at = nowIso();
      const updatedPage: Page = {
        ...existing,
        slug: targetSlug,
        title: newTitle,
        layout: newLayout,
        meta: { ...existing.meta, updatedAt: at },
      };

      await pages.put(state, updatedPage);
      logger.debug("persist.page.written", { state, slug: updatedPage.slug });

      if (slugWasChanged) {
        if (pages.delete) {
          await pages.delete(state, existing.slug);
          logger.debug("persist.page.deletedOld", {
            state,
            oldSlug: existing.slug,
          });
        } else {
          logger.debug("persist.page.deleteUnsupported", {
            state,
            oldSlug: existing.slug,
          });
          // Optionnel: exposer un warning système ou planifier un cleanup d’orphelins.
        }
      }

      // 6) MAJ index
      const { index } = await siteIndex({
        state,
        action: {
          type: SITE_INDEX_ACTIONS.ENSURE_PAGE_LISTED,
          ref: {
            id: updatedPage.id,
            slug: updatedPage.slug,
            title: updatedPage.title,
          },
        },
      });

      logger.info("ok", {
        state,
        currentSlug,
        newSlug: updatedPage.slug,
        slugChanged: slugWasChanged,
        titleChanged,
        layoutChanged,
      });

      return { page: updatedPage, index };
    });
  };
}
