/**
 * @file src/i18n/factories/admin/primary-menu-defaults.ts
 * @intro i18n — factories admin (menu principal)
 */

import { DEFAULT_MENU_PATH } from "@/core/domain/constants/urls";
import type { PrimaryMenuSettings } from "@/core/domain/site/entities";
import type { TFunc } from "@/i18n";

export function makeLocalizedPrimaryMenuDefaults(
  t: TFunc
): PrimaryMenuSettings {
  return {
    items: [
      { label: t("seed.nav.home"), href: DEFAULT_MENU_PATH, newTab: false },
    ],
  };
}
