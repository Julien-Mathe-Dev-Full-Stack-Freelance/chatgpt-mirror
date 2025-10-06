/**
 * @file src/i18n/locales/en.ts
 * @intro i18n — catalogues (UI & erreurs par code)
 */

import admin from "@/i18n/locales/admin/en";
// idem : fusionne ici tes autres namespaces existants (ui, common, …)

const en = {
  admin,
  errors: {
    generic: "Something went wrong. Please try again.",
  },
} as const;

export default en;
