/**
 * @file src/i18n/factories/admin/page-defaults.ts
 * @intro i18n — factory admin (Pages)
 * @layer i18n/factory
 * @description
 * Fournit un seed *localisé* pour initialiser le formulaire de création de page.
 * Appelle `buildPageItem` (domaine) avec un titre localisé.
 */

import { buildPageItem } from "@/core/domain/pages/defaults/page";
import type { Page } from "@/core/domain/pages/entities/page";
import type { TFunc } from "@/i18n";

/** Seed localisé pour l’UI (non persisté tant que non enregistré). */
export function makeLocalizedPageDefaults(t: TFunc): Page {
  return buildPageItem(t("admin.pages.seed.title"));
}
