// src/core/domain/site/validators/publish.ts
/**
 * @file src/core/domain/site/validators/publish.ts
 * @intro Avertissements publication (non bloquants)
 * @layer domain/validators
 */
import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import type { UiWarning } from "@/core/domain/errors/issue-types";
import type { SiteIndex } from "@/core/domain/site/entities/site-index";

/** Codes supportés pour les avertissements de publication. */
type PublishWarningCode =
  | "PUBLISH_EMPTY_INDEX"
  | "PUBLISH_SETTINGS_COPY_FAILED"
  | "PUBLISH_PAGE_MISSING";

/** Warnings de publish (on garde des ErrorCode pour l’i18n). */
export type PublishWarning = UiWarning<PublishWarningCode>;

export function publishWarnings(
  draftIndex: SiteIndex
): ReadonlyArray<PublishWarning> {
  const warnings: PublishWarning[] = [];
  if (draftIndex.pages.length === 0) {
    warnings.push({
      code: EC.PUBLISH_EMPTY_INDEX, // string literal compatible
      path: ["pages"],
    });
  }
  return warnings;
}
