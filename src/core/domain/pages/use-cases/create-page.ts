/**
 * @file src/core/domain/pages/use-cases/create-page.ts
 * @intro Créer une page et mettre à jour l’index (PagesRepo + updateSiteIndex)
 * @description
 * Orchestration **métier pure** (pas d’I/O direct) :
 * - Normalise/valide le slug (réservés, format).
 * - Résout les collisions par suffixe (slug, slug-2, …).
 * - Applique les défauts de layout, génère `id` + timestamps.
 * - Persiste la page via `PagesRepository`, puis met à jour l’index via le **runner `updateSiteIndex`**.
 *
 * Observabilité :
 * - `info`: start/ok (avec durée)
 * - `warn`: juste avant de lever une erreur métier
 * - `debug`: décisions clés (collisions résolues, mises à jour)
 *
 * Erreurs métier :
 * - Lève `CreatePageError` (extends DomainError) avec `code: ErrorCode`.
 *   Codes utilisés : PAGE_TITLE_REQUIRED, PAGE_SLUG_INVALID_FORMAT, PAGE_SLUG_RESERVED
 *
 * @layer domain/use-case
 *
 * @todo(slug) Factoriser la logique slug (format + réservés) dans un helper partagé avec UpdatePage.
 * @todo(concurrence) Étudier les écritures atomiques/locks pour créations simultanées.
 * @todo(ordonnancement) Permettre une insertion à une position donnée dans l’index (prepend/position).
 * @todo(observabilité) Ajouter un hook/événement `onCreated({ page })` injectable pour logs/analytics.
 */

import {
  DEFAULT_CONTENT_STATE,
  POS_APPEND,
} from "@/core/domain/constants/common";
import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import { genPageId } from "@/core/domain/ids/tools";
import { DEFAULT_PAGE_LAYOUT } from "@/core/domain/pages/defaults/page";
import type { Page } from "@/core/domain/pages/entities/page";
import { CreatePageError } from "@/core/domain/pages/use-cases/create-page.errors";
import type {
  CreatePageDeps,
  CreatePageInput,
  CreatePageResult,
} from "@/core/domain/pages/use-cases/create-page.types";
import { SITE_INDEX_ACTIONS } from "@/core/domain/site/index/actions";
import {
  isReservedSlug,
  isValidSlug,
  normalizeSlug,
} from "@/core/domain/slug/utils";
import { systemClock } from "@/core/domain/utils/clock";
import { log, logWithDuration } from "@/lib/log";
/**
 * Fabrique du use-case `createPage`.
 * @param deps - Dépendances injectées (repositories, horloge, générateur d’ID).
 *   - `pages`     : dépôt de pages (persistences de la ressource Page).
 *   - `siteIndex` : **runner** du use-case `updateSiteIndex` (writer unique de l’index).
 *   - `now?`      : horloge injectable (ISO string) pour testabilité.
 *   - `genId?`    : générateur d’identifiants stables/uniques pour testabilité.
 * @returns Une fonction `run(input)` qui exécute le use-case et renvoie `{ page, index }`.
 * @remarks
 * - Le dépôt doit être idempotent côté `ensureBase`.
 * - L’unicité globale de l’ID est déléguée à `genId` (non vérifiée ici).
 */
export function createPage({
  pages,
  siteIndex,
  nowIso = systemClock.nowIso,
  genId = genPageId,
}: CreatePageDeps) {
  const logger = log.child({ uc: "createPage" });

  return async function run(input: CreatePageInput): Promise<CreatePageResult> {
    return logWithDuration("uc.createPage", async () => {
      const state = input.state ?? DEFAULT_CONTENT_STATE;
      logger.info("start", { state });

      // 1) Titre
      const rawTitle = (input.title ?? "").trim();
      if (!rawTitle) {
        logger.warn("rule.title.empty");
        throw new CreatePageError(EC.PAGE_TITLE_REQUIRED);
      }

      // 2) Slug (normalisation + validations)
      const base = input.slug
        ? normalizeSlug(input.slug)
        : normalizeSlug(rawTitle);
      if (!base) {
        logger.warn("rule.slug.emptyAfterNormalization", {
          inputSlug: !!input.slug,
        });
        throw new CreatePageError(EC.PAGE_SLUG_REQUIRED);
      }
      if (!isValidSlug(base)) {
        logger.warn("rule.slug.invalidFormat", { baseSlug: base });
        throw new CreatePageError(EC.PAGE_SLUG_INVALID_FORMAT);
      }
      if (isReservedSlug(base)) {
        logger.warn("rule.slug.reserved", { baseSlug: base });
        throw new CreatePageError(EC.PAGE_SLUG_RESERVED);
      }

      // 3) Collisions (par state)
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

      // 4) Entité
      const at = nowIso();
      const page: Page = {
        id: genId(),
        slug,
        title: rawTitle,
        layout: DEFAULT_PAGE_LAYOUT,
        blocks: [],
        meta: { createdAt: at, updatedAt: at },
      };

      // 5) Persist
      await pages.ensureBase();
      await pages.put(state, page);
      logger.debug("persist.page.written", { state, slug: page.slug });

      // 6) MAJ index
      const { index } = await siteIndex({
        state,
        action: {
          type: SITE_INDEX_ACTIONS.ENSURE_PAGE_LISTED, // TODO: extraire en SoT quand tu crées site-index/actions.ts
          ref: { id: page.id, slug: page.slug, title: page.title },
          position: POS_APPEND,
        },
      });

      logger.info("ok", { state, slug });
      return { page, index };
    });
  };
}
