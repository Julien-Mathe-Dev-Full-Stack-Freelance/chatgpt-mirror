// src/core/domain/site/use-cases/publish/publish-site.ts
import { log, logWithDuration } from "@/lib/log";
import {
  DEFAULT_CONTENT_STATE,
  PUBLISHED_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";
import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import { PublishSiteError } from "@/core/domain/site/use-cases/publish/publish-site.errors";
import type {
  PublishSiteDeps,
  PublishSiteInput,
  PublishSiteResult,
} from "@/core/domain/site/use-cases/publish/publish-site.types";
import {
  publishWarnings,
  type PublishWarning,
} from "@/core/domain/site/validators/publish";

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
        await site.writeSettings(to, s);
        settingsCopied = true;
        logger.debug("settings.copied", { from, to });
      } catch (err) {
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
