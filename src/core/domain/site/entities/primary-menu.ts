/**
 * @file src/core/domain/site/entities/primary-menu.ts
 * @intro Entité (menu principal — jusqu’à 2 niveaux, href = AssetUrl)
 * @layer domain/entities
 */

import type { AssetUrl } from "@/core/domain/urls/tools";

export interface PrimaryMenuItem {
  label: string;
  href: AssetUrl; // relatif ou http(s)
  newTab: boolean;
  isExternal: boolean;

  /** Toujours un tableau, même s’il est vide → API plus simple. */
  children: ReadonlyArray<PrimaryMenuItem>;
}

export interface PrimaryMenuSettings {
  items: ReadonlyArray<PrimaryMenuItem>;
}
