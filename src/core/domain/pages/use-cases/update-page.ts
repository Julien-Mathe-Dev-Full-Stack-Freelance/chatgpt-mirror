/**
 * @file src/core/domain/pages/use-cases/update-page.ts
 * @intro Met à jour une page (titre/slug/sitemap) et synchronise l’index (pattern homogénéisé).
 * @layer domain/use-case
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";
import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import { isDomainError } from "@/core/domain/errors/domain-error";
import type { Page } from "@/core/domain/pages/entities/page";
import { UpdatePageError } from "@/core/domain/pages/use-cases/update-page.errors";
import type {
  UpdatePageDeps,
  UpdatePageInput,
  UpdatePageResult,
} from "@/core/domain/pages/use-cases/update-page.types";
import { SITE_INDEX_ACTIONS } from "@/core/domain/site/index/actions";
import { normalizeSlug } from "@/core/domain/slug/utils";
import { assertPageSlug } from "@/core/domain/slug/validator";
import { systemClock } from "@/core/domain/utils/clock";
import { log, logWithDuration } from "@/lib/log";
import { DEFAULT_PAGE_SITEMAP } from "../defaults/page";

export function updatePage({
  pages,
  siteIndex,
  nowIso = systemClock.nowIso,
}: UpdatePageDeps) {
  const logger = log.child({ uc: "updatePage" });

  return async function run(input: UpdatePageInput): Promise<UpdatePageResult> {
    return logWithDuration("uc.updatePage", async () => {
      const state: ContentState = input.state ?? DEFAULT_CONTENT_STATE;

      // currentSlug: trim + normalize pour être tolérant
      const currentSlugRaw = (input.currentSlug ?? "").trim();
      if (!currentSlugRaw) {
        logger.warn("rule.currentSlug.missing");
        throw new UpdatePageError(EC.PAGE_CURRENT_SLUG_REQUIRED);
      }
      const currentSlug = normalizeSlug(currentSlugRaw);
      if (!currentSlug) {
        logger.warn("rule.currentSlug.invalidAfterNormalization");
        throw new UpdatePageError(EC.PAGE_CURRENT_SLUG_REQUIRED);
      }

      // ── START ────────────────────────────────────────────────────────────────
      logger.info("start", {
        state,
        hasTitle: typeof input.title === "string",
        hasSlug: typeof input.slug === "string",
        hasSitemap: typeof input.sitemap === "object" && input.sitemap !== null,
        currentSlug,
      });

      // ── ENSURE BASE / READ ──────────────────────────────────────────────────
      await pages.ensureBase();
      logger.debug("persist.ensureBase.ok", { state });

      const existing = await pages.read(state, currentSlug);
      if (!existing) {
        logger.warn("rule.page.notFound", { state, currentSlug });
        throw new UpdatePageError(EC.PAGE_NOT_FOUND);
      }
      logger.debug("page.read", { id: existing.id, slug: existing.slug });

      // ── COMPUTE `next` + changedKeys (pattern homogénéisé) ──────────────────
      const changedKeys: Array<keyof Pick<Page, "title" | "slug" | "sitemap">> =
        [];
      const next: Page = { ...existing };

      // 1) Title
      if (typeof input.title === "string") {
        const t = input.title.trim();
        const titleNext = t.length > 0 ? t : existing.title;
        if (titleNext !== existing.title) {
          next.title = titleNext;
          changedKeys.push("title");
        }
      }

      // 2) Slug (normalisation + assert + collision si changement)
      if (typeof input.slug === "string") {
        const raw = input.slug.trim();
        if (raw.length > 0) {
          const candidate = normalizeSlug(raw);

          try {
            assertPageSlug(candidate, ["page", "slug"]);
          } catch (e) {
            if (isDomainError(e)) {
              logger.warn("rule.slug.invalid", {
                code: e.code,
                details: e.details,
              });
              throw new UpdatePageError(e.code, e.message, e.details, e.cause);
            }
            throw e;
          }

          if (candidate !== existing.slug) {
            if (await pages.exists(state, candidate)) {
              logger.warn("rule.slug.conflict", { candidate });
              throw new UpdatePageError(EC.CONFLICT);
            }
            next.slug = candidate;
            changedKeys.push("slug");
          }
        }
      }

      // 3) Sitemap (merge shallow)
      if (typeof input.sitemap === "object" && input.sitemap !== null) {
        const prev: Page["sitemap"] = existing.sitemap ?? DEFAULT_PAGE_SITEMAP;

        // On applique un défaut pour include (ex: true) si absent partout.
        const sitemapNext: Page["sitemap"] = {
          include: input.sitemap.include ?? prev.include ?? true, // <= défaut
          changefreq: input.sitemap.changefreq ?? prev.changefreq,
          priority: input.sitemap.priority ?? prev.priority,
        };

        // Détection simple (shallow) du changement
        const changed =
          sitemapNext.include !== (prev.include ?? true) ||
          sitemapNext.changefreq !== prev.changefreq ||
          sitemapNext.priority !== prev.priority;

        if (changed) {
          next.sitemap = sitemapNext; // <- OK: PageSitemap garanti
          changedKeys.push("sitemap");
        }
      }

      // ── NO-OP BRANCH ────────────────────────────────────────────────────────
      if (changedKeys.length === 0) {
        logger.info("ok.noop", { state, currentSlug });

        // S'assure que l’index liste la page (idempotent)
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

      // ── WRITE (avec updatedAt) ─────────────────────────────────────────────
      const at = nowIso();
      next.meta = { ...existing.meta, updatedAt: at };

      await pages.put(state, next);
      logger.debug("persist.page.written", {
        state,
        changedKeys,
        changedCount: changedKeys.length,
        slug: next.slug,
      });

      // Cleanup ancien artefact si slug a changé
      const slugChanged = changedKeys.includes("slug");
      if (slugChanged) {
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
        }
      }

      // ── UPDATE INDEX (writer unique) ────────────────────────────────────────
      const { index } = await siteIndex({
        state,
        action: {
          type: SITE_INDEX_ACTIONS.ENSURE_PAGE_LISTED,
          ref: { id: next.id, slug: next.slug, title: next.title },
        },
      });

      // ── OK ──────────────────────────────────────────────────────────────────
      logger.info("ok", {
        state,
        currentSlug,
        newSlug: next.slug,
        changedKeys,
        changedCount: changedKeys.length,
      });

      return { page: next, index };
    });
  };
}
