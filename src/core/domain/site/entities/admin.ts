/**
 * @file src/core/domain/site/entities/admin.ts
 * @intro DTO de réglages Admin (thème, préférences d’interface, etc.)
 */

import type { ThemeMode, ThemePalette } from "@/core/domain/constants/theme";

export interface AdminSettings {
  themeMode: ThemeMode;
  themePalette: ThemePalette;
}
