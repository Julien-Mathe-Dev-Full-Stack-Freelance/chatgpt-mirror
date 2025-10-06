/**
 * @file src/i18n/factories/admin/theme.ts
 * @intro i18n — factories admin (thème: palettes + modes)
 * @layer i18n/core
 */

import type { TFunc } from "@/i18n";
import { makeLabeledOptions, type LabeledOption } from "@/i18n/factories/admin";
import type { AdminPalette } from "@/infrastructure/ui/theme";

// Palettes supportées par l'UI (doivent matcher tes CSS data-theme)
const ADMIN_PALETTES = [
  "gray",
  "red",
  "purple",
  "blue",
  "green",
] as const satisfies readonly AdminPalette[];

export type AdminPaletteId = (typeof ADMIN_PALETTES)[number];

/** Options i18n pour Select (palette) */
export function makePaletteOptions(
  t: TFunc
): ReadonlyArray<LabeledOption<AdminPaletteId>> {
  // clés attendues: ui.theme.palette.{id}
  return makeLabeledOptions(t, "admin.theme.palette", ADMIN_PALETTES);
}

// Modes de thème (pour un éventuel Select des modes)
// const ADMIN_THEME_MODES = [
//   "light",
//   "dark",
//   "system",
// ] as const satisfies readonly ThemeMode[];
// export type AdminThemeModeId = (typeof ADMIN_THEME_MODES)[number];

/** Options i18n pour Select (mode) */
// export function makeModeOptions(
//   t: TFunc
// ): ReadonlyArray<LabeledOption<AdminThemeModeId>> {
//   // clés: ui.theme.mode.{id}
//   return makeLabeledOptions(t, "admin.theme.mode", ADMIN_THEME_MODES);
// }
