/**
 * @file src/core/domain/site/use-cases/publish/publish-site.ts
 * @intro Use-case : publier le site (draft -> published)
 * @layer domain/use-case
 * @description
 * - Copie index + pages + settings du state `from` vers `to`.
 * - Applique des **invariants métier bloquants** avant d’écrire les settings :
 *   - Identity : `assertIdentitySettings`
 *   - SEO : `assertSeoSettings`
 * - Agrège des warnings non bloquants (structure index, etc.).
 *
 * Logs :
 * - info  : start/ok (durée)
 * - warn  : warnings non bloquants
 * - error : erreurs techniques (levées ou transformées en PublishSiteError)
 */

import {
  DEFAULT_CONTENT_STATE,
  PUBLISHED_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";
import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import { isDomainError } from "@/core/domain/errors/domain-error";
import { PublishSiteError } from "@/core/domain/site/use-cases/publish/publish-site.errors";
import type {
  PublishSiteDeps,
  PublishSiteInput,
  PublishSiteResult,
} from "@/core/domain/site/use-cases/publish/publish-site.types";
import { assertIdentitySettings } from "@/core/domain/site/validators/identity";
import {
  publishWarnings,
  type PublishWarning,
} from "@/core/domain/site/validators/publish";
import { assertSeoSettings } from "@/core/domain/site/validators/seo";
import { log, logWithDuration } from "@/lib/log";

export function publishSite({ site, pages }: PublishSiteDeps) {
  const logger = log.child({ uc: "publishSite" });

  return async function run(
    input?: PublishSiteInput
  ): Promise<PublishSiteResult> {
    return logWithDuration("uc.publishSite", async () => {
      const from: ContentState = input?.from ?? DEFAULT_CONTENT_STATE;
      const to: ContentState = input?.to ?? PUBLISHED_CONTENT_STATE;
      const warnings: PublishWarning[] = [];

      logger.info("start", { from, to });
      if (from === to) throw new PublishSiteError(EC.PUBLISH_IDENTICAL_STATES);

      await Promise.all([site.ensureBase(), pages.ensureBase()]);
      logger.debug("persist.ensureBase.ok", { from, to });

      const draftIndex = await site.readIndex(from);
      logger.debug("index.read", { from, pagesCount: draftIndex.pages.length });

      const idxWarnings = publishWarnings(draftIndex);
      if (idxWarnings.length > 0) {
        warnings.push(...idxWarnings);
        logger.warn("index.warnings", { warnings: idxWarnings });
      }

      // Option: timestamp le published (si ton entity a updatedAt)
      const stampedIndex = {
        ...draftIndex,
        updatedAt: new Date().toISOString(),
      };
      await site.writeIndex(to, stampedIndex);
      logger.debug("index.written", { to });

      let settingsCopied = false;
      try {
        const s = await site.readSettings(from);

        // ✅ Invariants métier (bloquants) avant écriture des settings
        try {
          assertIdentitySettings(s.identity);
          assertSeoSettings(s.seo);
        } catch (e) {
          if (isDomainError(e)) {
            // transforme en PublishSiteError stable + details.issues
            logger.warn("settings.validation.failed", {
              code: e.code,
              message: e.message,
              details: e.details,
            });
            throw new PublishSiteError(EC.VALIDATION_ERROR, e.message, {
              issues: [
                {
                  code: e.code,
                  message: e.message,
                  details: e.details,
                },
              ],
            });
          }
          // erreur inattendue
          throw e;
        }

        await site.writeSettings(to, s);
        settingsCopied = true;
        logger.debug("settings.copied", { from, to });
      } catch (err) {
        if (err instanceof PublishSiteError) {
          // Erreur métier bloquante → relance
          throw err;
        }
        // Erreur technique → warning et on poursuit (MVP)
        warnings.push({
          code: EC.PUBLISH_SETTINGS_COPY_FAILED,
          path: ["settings"],
          meta: { from, to },
        });
        logger.warn("settings.copy.warn", {
          error: err instanceof Error ? err.message : String(err),
        });
      }

      let pagesCopied = 0;
      for (const ref of draftIndex.pages) {
        const p = await pages.read(from, ref.slug);
        if (!p) {
          warnings.push({
            code: EC.PUBLISH_PAGE_MISSING,
            path: ["pages", ref.slug],
          });
          logger.warn("page.missing", { slug: ref.slug, from });
          continue;
        }
        await pages.put(to, p);
        pagesCopied++;
      }
      logger.debug("pages.copied", { count: pagesCopied });

      logger.info("ok", {
        from,
        to,
        pagesCopied,
        settingsCopied,
        warningsCount: warnings.length,
      });
      return { pagesCopied, settingsCopied, warnings, from, to };
    });
  };
}
