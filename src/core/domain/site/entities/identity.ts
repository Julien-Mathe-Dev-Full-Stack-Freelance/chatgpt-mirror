/**
 * @file src/core/domain/site/entities/identity.ts
 * @intro Entité
 */

import type { AssetUrl } from "@/core/domain/urls/href";

export interface IdentitySettings {
  title: string;
  logoUrl?: AssetUrl;
  faviconUrl?: AssetUrl;
}
