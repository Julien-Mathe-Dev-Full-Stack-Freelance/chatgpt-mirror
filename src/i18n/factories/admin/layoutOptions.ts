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
  SECTION_ALIGN_X,
  SECTION_MAX_WIDTHS,
  SECTION_SPACING_Y,
  type SectionAlignX,
  type SectionMaxWidth,
  type SectionSpacingY,
} from "@/core/domain/constants/layout";
import type {
  ContainerKey,
  HeaderFooterHeight,
} from "@/core/domain/constants/theme";
import {
  CONTAINERS,
  HEADER_FOOTER_HEIGHTS,
  PALETTES,
  THEME_MODES,
} from "@/core/domain/constants/theme";
import type { TFunc } from "@/i18n";
import { makeLabeledOptions, type LabeledOption } from "./options";

/** Options de hauteur (header/footer). */
export function makeHeightItems(
  t: TFunc
): ReadonlyArray<LabeledOption<HeaderFooterHeight>> {
  return makeLabeledOptions(t, "admin.size", HEADER_FOOTER_HEIGHTS);
}

/** Options de container (narrow/normal/wide/full). */
export function makeContainerItems(
  t: TFunc
): ReadonlyArray<LabeledOption<ContainerKey>> {
  return makeLabeledOptions(t, "admin.container", CONTAINERS);
}

/** Options de mode de thème (ex. light/dark/system). */
export function makeThemeModeItems(
  t: TFunc
): ReadonlyArray<LabeledOption<(typeof THEME_MODES)[number]>> {
  return makeLabeledOptions(t, "admin.theme.mode", THEME_MODES);
}

/** Options de palette. */
export function makeThemePaletteItems(
  t: TFunc
): ReadonlyArray<LabeledOption<(typeof PALETTES)[number]>> {
  return makeLabeledOptions(t, "admin.theme.palette", PALETTES);
}

/** Options de largeur max (alias de CONTAINERS). */
export function makeLayoutMaxWidthItems(
  t: TFunc
): ReadonlyArray<LabeledOption<SectionMaxWidth>> {
  return makeLabeledOptions(t, "admin.layout.maxWidth", SECTION_MAX_WIDTHS);
}

/** Options d’espacement vertical des sections. */
export function makeLayoutSpacingYItems(
  t: TFunc
): ReadonlyArray<LabeledOption<SectionSpacingY>> {
  return makeLabeledOptions(t, "admin.layout.spacingY", SECTION_SPACING_Y);
}

/** Options d’alignement horizontal. */
export function makeLayoutAlignItems(
  t: TFunc
): ReadonlyArray<LabeledOption<SectionAlignX>> {
  return makeLabeledOptions(t, "admin.layout.align", SECTION_ALIGN_X);
}
