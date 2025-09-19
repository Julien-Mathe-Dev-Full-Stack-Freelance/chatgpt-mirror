/**
 * @file src/i18n/factories/admin/blocks.ts
 * @intro i18n — factories admin (blocs)
 */

import { makeLabeledOptions, type LabeledOption } from "@/i18n/factories/admin";
import {
  BLOCK_TYPES,
  TEXT_ALIGN_X,
  type BlockType,
  type TextAlignX,
} from "@/core/domain/blocks/constants";
import type { TFunc } from "@/i18n";

export function makeBlockTypeOptions(
  t: TFunc
): ReadonlyArray<LabeledOption<BlockType>> {
  return makeLabeledOptions(t, "admin.blocks.type", BLOCK_TYPES);
}

export function makeTextAlignOptions(
  t: TFunc
): ReadonlyArray<LabeledOption<TextAlignX>> {
  return makeLabeledOptions(t, "admin.blocks.text.align", TEXT_ALIGN_X);
}

// Petit helper si tu as besoin d’un label direct
export const textAlignLabel = (t: TFunc, a: TextAlignX) =>
  t(`admin.blocks.text.align.${a}`);
