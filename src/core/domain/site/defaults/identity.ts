/**
 * @file src/core/domain/site/defaults/identity.ts
 * @intro Defaults — identité du site (neutres, non localisés)
 */

import type { IdentitySettings } from "@/core/domain/site/entities/identity";
import { rel } from "@/core/domain/urls/tools";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

const DEFAULT_IDENTITY_ITEM_FLAGS = deepFreeze({
  logoLightUrl: rel("/logos/compoz-light.svg"),
  logoDarkUrl: rel("/logos/compoz-dark.svg"),
  faviconLightUrl: rel("/favicons/favicon-light.ico"),
  faviconDarkUrl: rel("/favicons/favicon-dark.ico"),
});

// Helper domaine pour créer un item légal avec flags par défaut (non localisés)
export function buildIdentitySettings(
  title: string,
  logoAlt: string
): IdentitySettings {
  return {
    title,
    logoAlt,
    ...DEFAULT_IDENTITY_ITEM_FLAGS,
  };
}

/** Default canonique (vide) : l’UI/route pourra injecter un seed i18n si nécessaire. */
export const DEFAULT_IDENTITY_SETTINGS: IdentitySettings = deepFreeze({
  title: "",
  logoAlt: "",
  ...DEFAULT_IDENTITY_ITEM_FLAGS,
});
