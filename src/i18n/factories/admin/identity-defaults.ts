/**
 * @file src/i18n/factories/admin/identity-defaults.ts
 * @intro i18n — factories admin (identité)
 *
 * But: fournir un seed *localisé* pour l'affichage quand l'objet est vide.
 * Ce seed n'est PAS persisté tant que l'utilisateur n'enregistre pas.
 */

import { buildIdentitySettings } from "@/core/domain/site/defaults/identity";
import type { IdentitySettings } from "@/core/domain/site/entities/identity";
import type { TFunc } from "@/i18n";

export function makeLocalizedIdentityDefaults(t: TFunc): IdentitySettings {
  return buildIdentitySettings(
    t("admin.identity.seed.title"),
    t("admin.identity.seed.logo.alt")
  );
}
