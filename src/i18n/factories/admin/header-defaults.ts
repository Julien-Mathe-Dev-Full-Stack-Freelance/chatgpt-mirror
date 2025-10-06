/**
 * @file src/i18n/factories/admin/header-defaults.ts
 * @intro i18n — factories admin (header)
 * @description
 * Fournit un **seed localisé** (à l’affichage) quand l’objet HeaderSettings est vide.
 * Aujourd’hui, aucun champ n’est localisé → on retourne les defaults domaine.
 * Ce seed n’est **pas** persisté tant que l’utilisateur n’enregistre pas.
 * (Le “seed-once” sera géré côté route GET si nécessaire, pour rester symétrique avec Identity/Social.)
 *
 * @layer i18n/factory
 */

import { buildHeaderSettings } from "@/core/domain/site/defaults/header";
import type { HeaderSettings } from "@/core/domain/site/entities/header";
import type { TFunc } from "@/i18n";

/**
 * Seed minimal & sûr pour l’admin Header.
 * @param _t Fonction de traduction (réservée pour de futurs libellés localisés).
 * @returns Un objet HeaderSettings prêt à afficher tant que la config réelle est vide.
 */
export function makeLocalizedHeaderDefaults(_t: TFunc): HeaderSettings {
  // Rien de localisé pour V0.5 → on expose les defaults domaine.
  // Si des libellés/flags localisés apparaissent plus tard,
  // les lire via `_t("admin.header.seed.*")` puis les injecter ici.
  return buildHeaderSettings();
}
