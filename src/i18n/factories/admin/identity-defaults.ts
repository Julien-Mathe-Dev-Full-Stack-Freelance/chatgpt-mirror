/**
 * @file src/i18n/factories/admin/identity-defaults.ts
 * @intro i18n — factories admin (identité)
 */

import type { IdentitySettings } from "@/core/domain/site/entities";
import type { TFunc } from "@/i18n";

/** Injecte un titre localisé (SoT catalogue: `seed.site.title`). */
export function makeLocalizedIdentityDefaults(t: TFunc): IdentitySettings {
  return {
    title: t("seed.site.title"), // ajoute ces clés côté fr/en
  };
}
