/**
 * @file src/i18n/factories/admin/layoutOptions.ts
 * @intro i18n — factories admin (options de layout & thème)
 * @layer i18n/core
 * @sot docs/bible/ui/i18n-factories.md
 * @remarks
 * - Canonique tailles : `small | medium | large` (pas `sm|md|lg`).
 * - Namespaces i18n : `admin.size.*`, `admin.container.*`, `admin.theme.mode.*`, `admin.theme.palette.*`.
 * - Zéro any ; type-safety via Template Literal Types.
 */
import {
  H_ALIGNMENT_VALUES,
  SPACING_STEPS_VALUES,
  type HorizontalAlignment,
  type SpacingStep,
} from "@/core/domain/constants/layout";
import {
  CONTAINER_VALUES,
  HEADER_FOOTER_HEIGHT_VALUES,
  PALETTE_VALUES,
  THEME_MODE_VALUES,
  type ContainerKey,
  type HeaderFooterHeight,
  type ThemeMode,
  type ThemePalette,
} from "@/core/domain/constants/theme";
import type { TFunc } from "@/i18n";
import { makeLabeledOptions, type LabeledOption } from "./options";

/** Options de hauteur (header/footer). */
export function makeHeightItems(
  t: TFunc
): ReadonlyArray<LabeledOption<HeaderFooterHeight>> {
  return makeLabeledOptions(t, "admin.size", HEADER_FOOTER_HEIGHT_VALUES);
}

/** Options de container (narrow/normal/wide/full). */
export function makeContainerItems(
  t: TFunc
): ReadonlyArray<LabeledOption<ContainerKey>> {
  return makeLabeledOptions(t, "admin.container", CONTAINER_VALUES);
}

/** Options de mode de thème (ex. light/dark/system). */
export function makeThemeModeItems(
  t: TFunc
): ReadonlyArray<LabeledOption<ThemeMode>> {
  return makeLabeledOptions(t, "admin.theme.mode", THEME_MODE_VALUES);
}

/** Options de palette. */
export function makeThemePaletteItems(
  t: TFunc
): ReadonlyArray<LabeledOption<ThemePalette>> {
  return makeLabeledOptions(t, "admin.theme.palette", PALETTE_VALUES);
}

/** Options de largeur max (alias de CONTAINERS). */
export function makeLayoutMaxWidthItems(
  t: TFunc
): ReadonlyArray<LabeledOption<ContainerKey>> {
  return makeLabeledOptions(t, "admin.layout.maxWidth", CONTAINER_VALUES);
}

/** Options d’espacement vertical des sections. */
export function makeLayoutSpacingYItems(
  t: TFunc
): ReadonlyArray<LabeledOption<SpacingStep>> {
  return makeLabeledOptions(t, "admin.layout.spacingY", SPACING_STEPS_VALUES);
}

/** Options d’alignement horizontal. */
export function makeLayoutAlignItems(
  t: TFunc
): ReadonlyArray<LabeledOption<HorizontalAlignment>> {
  return makeLabeledOptions(t, "admin.layout.align", H_ALIGNMENT_VALUES);
}
