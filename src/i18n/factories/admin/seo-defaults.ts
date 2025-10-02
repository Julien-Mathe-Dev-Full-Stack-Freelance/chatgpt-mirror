/**
 * @file src/i18n/factories/admin/seo-defaults.ts
 * @intro i18n — factories admin (SEO)
 */

import type { SeoSettings } from "@/core/domain/site/entities";
import { TITLE_PLACEHOLDER } from "@/core/domain/site/seo/constants";
import type { TFunc } from "@/i18n";

export function makeLocalizedSeoDefaults(
  t: TFunc,
  identityTitle?: string
): SeoSettings {
  const siteTitle =
    identityTitle && identityTitle.trim()
      ? identityTitle
      : t("seed.site.title");
  return {
    defaultTitle: siteTitle,
    titleTemplate: `${TITLE_PLACEHOLDER} — ${siteTitle}`,
  };
}
