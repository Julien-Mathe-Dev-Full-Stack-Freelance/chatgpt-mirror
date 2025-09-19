/**
 * @file src/core/domain/site/defaults/primary-menu.ts
 * @intro Defaults — menu principal (domaine)
 * @layer domain/defaults
 * @remarks
 * - Type métier local (aucun DTO ici).
 * - Les libellés sont susceptibles d’être fournis via l’UI/i18n.
 * - Immutabilité runtime : `deepFreeze`.
 * - Helper standard : `withDefaults*`.
 */

import type {
  PrimaryMenuItem,
  PrimaryMenuSettings,
} from "@/core/domain/site/entities/primary-menu";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

/** Defaults canoniques. */
const EMPTY_PRIMARY_MENU_ITEMS: PrimaryMenuItem[] = [];
export const DEFAULT_PRIMARY_MENU_SETTINGS: PrimaryMenuSettings = deepFreeze({
  items: EMPTY_PRIMARY_MENU_ITEMS,
} satisfies PrimaryMenuSettings);

// Pas de dev-check nécessaire ici (liste vide volontaire).
