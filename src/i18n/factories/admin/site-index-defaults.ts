/**
 * @file src/i18n/factories/admin/site-index-defaults.ts
 * @intro i18n — factory admin (SiteIndex)
 * @layer i18n/factory
 * @description
 * Fournit un **seed** pour l’UI admin quand l’index est vide.
 * Aujourd’hui aucun champ n’est localisé → on renvoie un index vide.
 * Ce seed n’est **pas** persisté tant que l’utilisateur n’enregistre pas.
 */

import {
  buildEmptySiteIndex,
  EPOCH_ISO,
} from "@/core/domain/site/defaults/site-index";
import type { SiteIndex } from "@/core/domain/site/entities/site-index";
import type { TFunc } from "@/i18n";

/** Seed minimal & sûr pour l’admin (non persisté). */
export function makeLocalizedSiteIndexDefaults(_t: TFunc): SiteIndex {
  // Pas de contenu localisable à ce stade → index vide daté à l'époque.
  // (Les timestamps “now” resteront côté use-cases/adapters lors d’une vraie écriture.)
  return buildEmptySiteIndex(EPOCH_ISO);
}
