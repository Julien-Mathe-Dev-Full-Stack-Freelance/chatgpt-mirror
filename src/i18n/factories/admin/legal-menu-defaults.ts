/**
 * @file src/i18n/factories/admin/legal-menu-defaults.ts
 * @intro i18n — factories admin (menu légal)
 */

import {
  DEFAULT_LEGAL_COOKIES_PATH,
  DEFAULT_LEGAL_MENTIONS_PATH,
} from "@/core/domain/constants/urls";
import type { LegalMenuSettings } from "@/core/domain/site/entities";
import type { TFunc } from "@/i18n";

export function makeLocalizedLegalMenuDefaults(t: TFunc): LegalMenuSettings {
  return {
    items: [
      {
        label: t("seed.legal.links.mentions"),
        href: DEFAULT_LEGAL_MENTIONS_PATH,
        newTab: false,
      },
      {
        label: t("seed.legal.links.cookies"),
        href: DEFAULT_LEGAL_COOKIES_PATH,
        newTab: false,
      },
    ],
  };
}
