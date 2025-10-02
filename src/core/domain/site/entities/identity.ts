/**
 * @file src/core/domain/site/entities/identity.ts
 * @intro Entité
 */

import type { AssetUrlOrNull } from "@/core/domain/urls/tools";

export interface IdentitySettings {
  title: string;
  tagline?: string;
  logoLightUrl: AssetUrlOrNull;
  logoDarkUrl: AssetUrlOrNull;
  logoAlt: string;
  faviconLightUrl: AssetUrlOrNull;
  faviconDarkUrl: AssetUrlOrNull;
}
