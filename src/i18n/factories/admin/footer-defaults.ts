// src/i18n/factories/admin/footer-defaults.ts
/**
 * @file src/i18n/factories/admin/footer-defaults.ts
 * @intro i18n — factory admin (footer)
 * @description
 * Fournit un **seed localisé** pour l’admin quand la config Footer est vide.
 * Ce seed n’est pas persisté tant que l’utilisateur n’enregistre pas (pattern seed-once).
 *
 * @layer i18n/factory
 */

import { buildFooterSettings } from "@/core/domain/site/defaults/footer";
import type { FooterSettings } from "@/core/domain/site/entities/footer";
import type { TFunc } from "@/i18n";

/**
 * Seed minimal & sûr pour l’admin Footer.
 * @param t Fonction de traduction (pour pré-remplir le copyright).
 * @returns Un FooterSettings prêt à afficher tant que la config réelle est vide.
 */
export function makeLocalizedFooterDefaults(t: TFunc): FooterSettings {
  return buildFooterSettings(t("admin.footer.seed.copyright"));
}
