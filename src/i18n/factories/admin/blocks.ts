/**
 * @file src/i18n/factories/admin/blocks.ts
 * @intro i18n — factories admin (blocs)
 */

import {
  BLOCK_TYPES_VALUES,
  type BlockType,
} from "@/core/domain/blocks/constants";
import {
  H_ALIGNMENT_VALUES,
  type HorizontalAlignment,
} from "@/core/domain/constants/layout";
import type { TFunc } from "@/i18n";
import { makeLabeledOptions, type LabeledOption } from "@/i18n/factories/admin";

export function makeBlockTypeOptions(
  t: TFunc
): ReadonlyArray<LabeledOption<BlockType>> {
  return makeLabeledOptions(t, "admin.blocks.type", BLOCK_TYPES_VALUES);
}

export function makeTextAlignOptions(
  t: TFunc
): ReadonlyArray<LabeledOption<HorizontalAlignment>> {
  return makeLabeledOptions(t, "admin.blocks.text.align", H_ALIGNMENT_VALUES);
}

// Petit helper si tu as besoin d’un label direct
export const textAlignLabel = (t: TFunc, a: HorizontalAlignment) =>
  t(`admin.blocks.text.align.${a}`);
