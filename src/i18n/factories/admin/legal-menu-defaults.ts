// src/i18n/factories/admin/legal-menu-defaults.ts
/**
 * @file i18n — factories admin (menu légal)
 * Seed *localisé* pour l'affichage quand la liste est vide (non persisté tant qu'on ne sauvegarde pas).
 */
import { buildLegalItem } from "@/core/domain/site/defaults/legal-menu";
import type { LegalMenuSettings } from "@/core/domain/site/entities";
import type { TFunc } from "@/i18n";

export function makeLocalizedLegalMenuDefaults(t: TFunc): LegalMenuSettings {
  return {
    items: [
      buildLegalItem(
        t("admin.menu.seed.label.mentions"),
        t("admin.menu.seed.link.mentions")
      ),
      buildLegalItem(
        t("admin.menu.seed.label.cookies"),
        t("admin.menu.seed.link.cookies")
      ),
    ],
  };
}
