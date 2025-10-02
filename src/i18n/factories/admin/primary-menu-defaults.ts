/**
 * @file src/i18n/factories/admin/primary-menu-defaults.ts
 * @intro i18n — factories admin (menu principal)
 *
 * Seed *localisé* pour l’affichage quand la liste est vide (non persisté).
 */

import { DEFAULT_MENU_PATH } from "@/core/domain/constants/urls";
import { buildPrimaryItem } from "@/core/domain/site/defaults/primary-menu";
import type { PrimaryMenuSettings } from "@/core/domain/site/entities";
import type { TFunc } from "@/i18n";

export function makeLocalizedPrimaryMenuDefaults(
  t: TFunc
): PrimaryMenuSettings {
  return {
    items: [
      buildPrimaryItem(
        t("admin.menu.seed.label.home"), // libellé localisé
        DEFAULT_MENU_PATH // href non localisé (constant domaine)
      ),
    ],
  };
}
