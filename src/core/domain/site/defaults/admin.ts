/**
 * @file src/core/domain/site/defaults/admin.ts
 * @intro Defaults — réglages d’affichage de l’admin (thème)
 * @layer domain/defaults
 * @remarks
 * - Les domaines de valeurs proviennent des SoT : `src/constants/shared/theme.ts`.
 *   (cf. docs/bible/domain/constants-theme.md)
 * - Les schémas **consomment** ces constantes, ils ne sont pas la SoT.
 * - Immutabilité runtime : `deepFreeze`.
 * - Helper standardisé : `withDefaults*`.
 */

import {
  type ThemeMode,
  type ThemePalette,
  PALETTE_VALUES,
  THEME_MODE_VALUES,
} from "@/core/domain/constants/theme";
import { ERROR_CODES } from "@/core/domain/errors/codes";
import { DomainError } from "@/core/domain/errors/domain-error";
import type { AdminSettings } from "@/core/domain/site/entities/admin";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

/** Defaults canoniques (réutilisables individuellement). */
const DEFAULT_ADMIN_THEME_MODE: ThemeMode = "system" as const;
const DEFAULT_ADMIN_THEME_PALETTE: ThemePalette = "neutral" as const;

/** Default complet (gelé au runtime). */
export const DEFAULT_ADMIN_SETTINGS: AdminSettings = deepFreeze({
  themeMode: DEFAULT_ADMIN_THEME_MODE,
  themePalette: DEFAULT_ADMIN_THEME_PALETTE,
} satisfies AdminSettings);

/* Dev-only: garde de parité avec la SoT si les tuples évoluent */
if (process.env.NODE_ENV !== "production") {
  const inSet = (v: string, set: readonly string[]) => set.includes(v);

  if (!inSet(DEFAULT_ADMIN_THEME_MODE, THEME_MODE_VALUES)) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message: `[defaults/admin] themeMode inconnu: ${DEFAULT_ADMIN_THEME_MODE}`,
    });
  }
  if (!inSet(DEFAULT_ADMIN_THEME_PALETTE, PALETTE_VALUES)) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message: `[defaults/admin] themePalette inconnu: ${DEFAULT_ADMIN_THEME_PALETTE}`,
    });
  }
}
