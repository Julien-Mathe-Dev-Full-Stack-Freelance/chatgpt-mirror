// src/core/domain/site/defaults/legal-menu.ts
/**
 * @file Defaults — menu légal (domaine)
 */

import type {
  LegalMenuItem,
  LegalMenuSettings,
} from "@/core/domain/site/entities/legal-menu";
import { rel } from "@/core/domain/urls/tools";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

// Flags non localisés par défaut pour un item légal.
const DEFAULT_LEGAL_ITEM_FLAGS = deepFreeze({
  newTab: false,
  isExternal: false,
});

// Helper domaine pour créer un item légal avec flags par défaut (non localisés)
export function buildLegalItem(label: string, href: string): LegalMenuItem {
  return {
    label,
    href: rel(href),
    ...DEFAULT_LEGAL_ITEM_FLAGS,
  };
}

/** Default canonique (vide) : l’UI/route pourra injecter un seed i18n si nécessaire. */
export const DEFAULT_LEGAL_MENU_SETTINGS: LegalMenuSettings = deepFreeze({
  items: [],
});
