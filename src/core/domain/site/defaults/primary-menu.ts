/**
 * @file src/core/domain/site/defaults/primary-menu.ts
 * @intro Defaults — menu principal (domaine, non localisés)
 */

import type {
  PrimaryMenuItem,
  PrimaryMenuSettings,
} from "@/core/domain/site/entities/primary-menu";
import { rel } from "@/core/domain/urls/tools";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

/** Flags non localisés par défaut pour un item principal (et ses enfants). */
const DEFAULT_PRIMARY_ITEM_FLAGS = deepFreeze({
  newTab: false,
  isExternal: false,
});

/** Helper domaine : construit un item (avec children) en appliquant les flags par défaut. */
export function buildPrimaryItem(
  label: string,
  href: string,
  children?: Array<{ label: string; href: string }>
): PrimaryMenuItem {
  return {
    label,
    href: rel(href),
    ...DEFAULT_PRIMARY_ITEM_FLAGS,
    children: Array.isArray(children)
      ? children.map((c) => ({
          label: c.label,
          href: rel(c.href),
          ...DEFAULT_PRIMARY_ITEM_FLAGS,
          children: [],
        }))
      : [],
  };
}

/** Default canonique (liste vide) — la route pourra injecter un seed i18n si nécessaire. */
export const DEFAULT_PRIMARY_MENU_SETTINGS: PrimaryMenuSettings = deepFreeze({
  items: [],
});
