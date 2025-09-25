/**
 * @file src/core/domain/blocks/constants.ts
 * @intro Source de vérité des blocs et de leurs alignements.
 * @layer domain/constants
 * @sot docs/bible/domain/blocks/README.md#constants
 * @description
 * - Définit l’union fermée `BlockType` (ex. "text" | "image").
 * - Définit l’union fermée `BlockAlignment` (ex. "start" | "center" | "end").
 * - Expose des type-guards compacts : `isBlockType`, `isBlockAlignment`.
 * - Ne contient aucune logique UI/infra ; pas de side-effects.
 * @remarks
 * - Étendre les unions **ici d’abord**, puis mettre à jour le modèle et les schémas (voir SoT).
 */

// ───────────────────────────────────────────────────────────────────────────────
// Types de blocs supportés (union fermée).
// Étendre ici AVANT de modifier `model.ts` ou les schémas `src/schemas/blocks/**`.
// ───────────────────────────────────────────────────────────────────────────────
export const BLOCK_TYPES = {
  TEXT: "text",
  IMAGE: "image",
} as const;
export type BlockType = (typeof BLOCK_TYPES)[keyof typeof BLOCK_TYPES];

// ───────────────────────────────────────────────────────────────────────────────
// Type guards compacts pour sécuriser les adapters/DTOs.
// Préférer ces gardes à des regex/transformations fragiles.
// Invariant : les valeurs acceptées proviennent **uniquement** des unions ci-dessus.
// ───────────────────────────────────────────────────────────────────────────────
export const BLOCK_TYPES_VALUES = Object.values(
  BLOCK_TYPES
) as readonly BlockType[];

export function isBlockType(v: unknown): v is BlockType {
  return typeof v === "string" && BLOCK_TYPES_VALUES.includes(v as BlockType);
}
