/**
 * @file src/core/domain/site/defaults/theme.ts
 * @intro Defaults — thème public (mode & palette)
 * @layer domain/defaults
 * @remarks
 * - Les domaines de valeurs proviennent de la SoT : `src/constants/shared/theme.ts`.
 * - Les schémas consomment ces constantes (ils ne sont pas la SoT).
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
import type { ThemeSettings } from "@/core/domain/site/entities/theme";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

/** Defaults canoniques (réutilisables individuellement). */
const DEFAULT_THEME_MODE: ThemeMode = "system" as const;
const DEFAULT_THEME_PALETTE: ThemePalette = "neutral" as const;

/** Default complet (gelé au runtime). */
export const DEFAULT_THEME_SETTINGS: ThemeSettings = deepFreeze({
  themeMode: DEFAULT_THEME_MODE,
  themePalette: DEFAULT_THEME_PALETTE,
} satisfies ThemeSettings);

/* Dev-only: garde de parité avec la SoT si les tuples évoluent */
if (process.env.NODE_ENV !== "production") {
  const inSet = (v: string, set: readonly string[]) => set.includes(v);
  if (!inSet(DEFAULT_THEME_MODE, THEME_MODE_VALUES)) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message: `[defaults/theme] themeMode inconnu: ${DEFAULT_THEME_MODE}`,
    });
  }
  if (!inSet(DEFAULT_THEME_PALETTE, PALETTE_VALUES)) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message: `[defaults/theme] themePalette inconnu: ${DEFAULT_THEME_PALETTE}`,
    });
  }
}
