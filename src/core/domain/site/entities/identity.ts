/**
 * @file src/core/domain/site/entities/identity.ts
 * @intro Entité
 */

import type { AssetUrlOrNull } from "@/core/domain/urls/tools";

export interface IdentitySettings {
  /** Toujours présent, jamais vide côté domaine : validé en amont. */
  title: string;

  /** Optionnel (si non fourni, `undefined`) — on évite "" dans le domaine. */
  tagline?: string;

  /** Champs clearables : présents, mais nullables. */
  logoLightUrl: AssetUrlOrNull;
  logoDarkUrl: AssetUrlOrNull;

  /** Toujours présent, jamais vide côté domaine : validé en amont. */
  logoAlt: string;

  /** Champs clearables : présents, mais nullables. */
  faviconLightUrl: AssetUrlOrNull;
  faviconDarkUrl: AssetUrlOrNull;
}
