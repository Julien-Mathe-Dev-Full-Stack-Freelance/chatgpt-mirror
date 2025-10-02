/**
 * @file src/core/domain/site/entities/primary-menu.ts
 * @intro Entité (menu principal — jusqu’à 2 niveaux, href = AssetUrl)
 * @layer domain/entities
 */

import type { AssetUrl } from "@/core/domain/urls/tools";

export interface PrimaryMenuItem {
  label: string;
  href: AssetUrl; // ✅ AssetUrl (relative | http/https)
  newTab: boolean;
  isExternal: boolean;
  children?: ReadonlyArray<PrimaryMenuItem>; // niveau 2 optionnel
}

export interface PrimaryMenuSettings {
  items: ReadonlyArray<PrimaryMenuItem>;
}
