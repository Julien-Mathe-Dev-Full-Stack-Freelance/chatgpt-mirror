/**
 * @file src/i18n/locales/fr.ts
 * @intro i18n — catalogues (UI & erreurs par code)
 */

import admin from "@/i18n/locales/admin/fr";
// importe et fusionne ici tes autres namespaces existants si tu en as (ui, common, …)

const fr = {
  admin,
  // ui: { … }, common: { … }  // conserve l’existant
} as const;

export default fr;
