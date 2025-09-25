/**
 * @file src/core/domain/site/entities/theme.ts
 * @intro DTO de réglages du thème (couleurs, logo, favicon)
 */

import type { ThemeMode, ThemePalette } from "@/core/domain/constants/theme";

export interface ThemeSettings {
  themeMode: ThemeMode;
  themePalette: ThemePalette;
}
