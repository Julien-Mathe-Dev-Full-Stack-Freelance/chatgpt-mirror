/**
 * @file src/core/domain/site/entities/legal-menu.ts
 * @intro Entité (menu légal — 1 niveau, href = AssetUrl)
 * @layer domain/entities
 */

import type { AssetUrl } from "@/core/domain/urls/tools";

export interface LegalMenuItem {
  label: string;
  href: AssetUrl;
  newTab: boolean;
  isExternal: boolean;
}

export interface LegalMenuSettings {
  /** Toujours un tableau (éventuellement vide). */
  items: ReadonlyArray<LegalMenuItem>;
}
