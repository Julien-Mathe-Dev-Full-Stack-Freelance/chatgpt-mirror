/**
 * @file src/i18n/factories/admin/seo-defaults.ts
 * @intro i18n — factories admin (SEO)
 */

import { buildSeoSettings } from "@/core/domain/site/defaults/seo";
import type { SeoSettings } from "@/core/domain/site/entities";
import type { TFunc } from "@/i18n";

export function makeLocalizedSeoDefaults(t: TFunc): SeoSettings {
  return buildSeoSettings(
    t("admin.seo.seed.title"),
    t("admin.seo.seed.description")
  );
}
